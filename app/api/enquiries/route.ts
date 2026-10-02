import { randomUUID } from "node:crypto";
import { z } from "zod";
import { saveEnquiry } from "@/lib/enquiries";

export const runtime = "nodejs";
const MAX_BODY_BYTES = 18000;
const schema = z.object({
  id: z.string().uuid(), name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().default(""),
  website: z.string().trim().max(500).optional().default(""),
  service: z.enum(["Website design", "NDIS & allied health", "E-commerce", "SEO & digital marketing", "AI automation", "Website audit", "Not sure yet"]),
  message: z.string().trim().min(10).max(5000),
  company_url: z.string().max(500).optional().default(""),
});

function respond(body: object, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

async function readBody(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) throw new RangeError();
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return respond({ error: "Please submit your enquiry from this website." }, 403);
  }
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return respond({ error: "Unsupported request." }, 415);
  }
  let raw: unknown;
  try { raw = await readBody(request); }
  catch (error) {
    return error instanceof RangeError
      ? respond({ error: "Your message is too long." }, 413)
      : respond({ error: "Please check your enquiry and try again." }, 400);
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return respond({ error: "Please provide your name, a valid email, a service and a message of at least 10 characters." }, 400);
  }
  const data = parsed.data;
  // Preserve the intentional spam response. No genuine enquiry reaches this branch.
  if (data.company_url) return respond({ ok: true });
  try {
    const result = await saveEnquiry({ ...data, email: data.email.toLowerCase() });
    if (result === "limited") {
      return respond({ error: "Several enquiries have already been received for this email. Please try later or call 0469 785 113." }, 429, { "Retry-After": "3600" });
    }
    return respond({ ok: true }, result === "created" ? 201 : 200);
  } catch (error) {
    const reference = randomUUID();
    const code = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string" && /^[A-Z0-9_]{1,64}$/.test(error.code)
      ? error.code : "DB_UNAVAILABLE";
    // Avoid driver messages, SQL, payloads and credentials in logs.
    console.error(JSON.stringify({ event: "enquiry_storage_unavailable", code, reference }));
    return respond({ error: "We couldn’t save your enquiry. Please try again, email info@swiftdigitals.com.au or call 0469 785 113.", reference }, 503);
  }
}
