import type {MetadataRoute} from 'next';
import {SITE_URL,pageInfo} from '@/lib/site';
export default function sitemap():MetadataRoute.Sitemap{return ['',...Object.keys(pageInfo)].map(slug=>({url:SITE_URL+(slug?'/'+slug:'/'),changeFrequency:slug?'monthly':'weekly',priority:slug?0.7:1}));}
