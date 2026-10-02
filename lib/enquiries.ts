import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";

export type EnquiryInput = {
  id: string; name: string; email: string; phone: string;
  website: string; service: string; message: string;
};

export async function saveEnquiry(data: EnquiryInput): Promise<"created" | "duplicate" | "limited"> {
  const pool = getPool();
  const connection = await pool.getConnection();
  try {
    await connection.query("SET time_zone = '+00:00'");
    await connection.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
    await connection.beginTransaction();
    await connection.execute(
      "INSERT INTO enquiry_email_locks (email) VALUES (?) ON DUPLICATE KEY UPDATE email = email",
      [data.email],
    );
    // Held until commit/rollback: serialize the rolling limit across processes.
    await connection.execute("SELECT email FROM enquiry_email_locks WHERE email = ? FOR UPDATE", [data.email]);
    const [existing] = await connection.execute<RowDataPacket[]>(
      "SELECT id FROM enquiries WHERE id = ? FOR UPDATE", [data.id],
    );
    if (existing.length) {
      await connection.commit();
      return "duplicate";
    }
    const [recent] = await connection.execute<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM enquiries WHERE email = ? AND created_at > UTC_TIMESTAMP(6) - INTERVAL 1 HOUR",
      [data.email],
    );
    if (Number(recent[0].total) >= 5) {
      await connection.rollback();
      return "limited";
    }
    await connection.execute(
      "INSERT INTO enquiries (id, name, email, phone, website, service, message) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.id, data.name, data.email, data.phone, data.website, data.service, data.message],
    );
    await connection.commit();
    return "created";
  } catch (error) {
    await connection.rollback().catch(() => {});
    // Concurrent same-UUID requests with different emails are only successful
    // after verifying an already committed durable row.
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY") {
      const [existing] = await connection.execute<RowDataPacket[]>(
        "SELECT id FROM enquiries WHERE id = ?", [data.id],
      );
      if (existing.length) return "duplicate";
    }
    throw error;
  } finally {
    connection.release();
  }
}
