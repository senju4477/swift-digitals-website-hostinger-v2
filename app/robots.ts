import type {MetadataRoute} from 'next';
import {SITE_URL,SITE_INDEXABLE} from '@/lib/site';
export default function robots():MetadataRoute.Robots{return SITE_INDEXABLE?{rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:SITE_URL+'/sitemap.xml'}:{rules:{userAgent:'*',disallow:'/'}};}
