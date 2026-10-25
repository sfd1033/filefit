import type { MetadataRoute } from 'next';
import {tools,siteUrl} from '@/lib/catalog';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap {return ['','guides/','privacy/','terms/','contact/',...tools.map(t=>`tools/${t.slug}/`)].map(path=>({url:`${siteUrl}/${path}`}));}
