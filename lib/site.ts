const origin = new URL(process.env.SITE_URL || 'https://swiftdigitals.au');
if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) throw new Error('SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment.');
export const SITE_URL = origin.origin;
if (process.env.SITE_INDEXABLE && !['true', 'false'].includes(process.env.SITE_INDEXABLE)) throw new Error('SITE_INDEXABLE must be true or false.');
export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === 'true';
export const PHONE = '0469 785 113';
export const EMAIL = 'info@swiftdigitals.com.au';
export const services = [
 {slug:'website-development',icon:'monitor',name:'Website design',short:'A clear message. A confident first impression.',description:'Thoughtful design, useful content and an easy path from browsing to enquiry.'},
 {slug:'ndis-website-design',icon:'people',name:'NDIS & allied health',short:'Make your services easier to understand.',description:'Help participants, families and referrers find the right information and take the next step.'},
 {slug:'ecommerce-website-design',icon:'bag',name:'E-commerce',short:'A better experience from browse to checkout.',description:'Online stores with considered product pages, clear delivery information and a simple buying journey.'},
 {slug:'seo-digital-marketing',icon:'chart',name:'SEO & digital marketing',short:'Be found for the work you want to do.',description:'Search-focused content and marketing that connect your services with relevant enquiries.'},
 {slug:'ai-automation',icon:'workflow',name:'AI automation',short:'Less repetitive work. More time for your business.',description:'Practical automation for customer intake, enquiry follow-ups and connected business tools.'},
];
export const pageInfo: Record<string,{title:string;description:string;label:string}> = {
 'website-development':{title:'Website Design Melbourne',label:'Website design',description:'Website design for Melbourne businesses. Clear service pages, mobile-friendly layouts and an enquiry journey built around your customers. Discuss your project.'},
 'ndis-website-design':{title:'NDIS & Allied Health Website Design Melbourne',label:'NDIS & allied health',description:'NDIS and allied health website design in Melbourne and across Australia. Clear support information, accessible design considerations and referral enquiries.'},
 'ecommerce-website-design':{title:'E-commerce Website Design Melbourne',label:'E-commerce websites',description:'E-commerce website design for Melbourne and Australian businesses. Thoughtful product pages, payment setup and a clear shopping journey. Request a quote.'},
 'seo-digital-marketing':{title:'SEO & Digital Marketing Melbourne',label:'SEO & digital marketing',description:'SEO and digital marketing for Melbourne service businesses. Local search, useful service content and Google Ads planning with clearly agreed scope.'},
 'ai-automation':{title:'AI Automation for Melbourne Businesses',label:'AI automation',description:'Reduce repetitive admin with AI automation for your Melbourne business. Explore customer intake, enquiry follow-ups and integrations with human review.'},
 'services':{title:'Web Design, SEO & AI Automation Services',label:'Services',description:'Explore Swift Digitals services: website design, NDIS websites, online stores, local SEO, digital marketing and AI automation. Based in Sunshine, Melbourne.'},
 'our-work':{title:'Our Work | Website Projects',label:'Our work',description:'Explore websites created by Swift Digitals for cleaning, NDIS support, renovations, beauty and packaging businesses. View the projects and visit each site.'},
 'packages':{title:'Website Packages Melbourne',label:'Packages',description:'Compare business website, growing business and online store packages. Get a tailored proposal with clear scope, inclusions and costs from Swift Digitals.'},
 'about':{title:'About Swift Digitals | Melbourne Web Design',label:'About',description:'Meet the approach behind Swift Digitals, a Sunshine-based web design and digital solutions business serving Melbourne and businesses across Australia.'},
 'contact':{title:'Contact Swift Digitals Melbourne',label:'Contact',description:'Discuss your website, SEO or AI automation project with Swift Digitals. Based in Sunshine, Melbourne. Call 0469 785 113 or send a project enquiry.'},
 'privacy':{title:'Privacy Information',label:'Privacy',description:'How Swift Digitals handles information submitted through this website and how to contact us with privacy questions.'},
};
export const commonFaq = [
 ['Can you redesign my existing website?','Yes. We start by looking at what works, what needs to improve and whether your current platform is suitable. The proposal explains what will be retained, rebuilt or migrated.'],
 ['What will my project include?','Your proposal confirms the pages, features, content responsibilities, revision allowance, timeline and costs. Hosting, ongoing support and any third-party subscriptions are discussed separately so you can see the full picture.'],
 ['Can I update the website after launch?','We discuss the updates you need to make yourself and recommend an appropriate editing setup. Any content management system, training or handover support is included in the agreed project scope.'],
 ['How much does a website cost?','The cost depends on the number of pages, content, integrations and functionality. Tell us what you need and we can provide a scoped quote before you commit.'],
];

