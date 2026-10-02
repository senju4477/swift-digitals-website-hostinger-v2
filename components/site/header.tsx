'use client';
import Link from 'next/link';

import {useState} from 'react';
import {usePathname} from 'next/navigation';
import {Menu,ArrowUpRight} from 'lucide-react';
import {Sheet,SheetContent,SheetTrigger,SheetTitle,SheetDescription} from '@/components/ui/sheet';
const links=[['Services','/services'],['NDIS & Allied Health','/ndis-website-design'],['Our Work','/our-work'],['Packages','/packages'],['About','/about'],['Contact','/contact']];
export function Header(){const [open,setOpen]=useState(false);const path=usePathname();return <header className="site-header"><div className="container header-inner"><Link href="/" className="brand" aria-label="Swift Digitals home"><img src="/assets/logo-original.png" alt="Swift Digitals — We build your digital future" width="230" height="82"/></Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(([t,h])=><Link key={h} href={h} aria-current={path===h?'page':undefined}>{t}</Link>)}</nav><Link className="header-cta" href="/contact">Discuss Your Project<ArrowUpRight size={15}/></Link><Sheet open={open} onOpenChange={setOpen}><SheetTrigger className="mobile-menu" aria-label="Open navigation"><Menu size={25}/></SheetTrigger><SheetContent side="right" className="mobile-sheet"><SheetTitle>Swift Digitals</SheetTitle><SheetDescription>Web design, marketing & AI automation</SheetDescription><nav aria-label="Mobile navigation"><Link href="/" onClick={()=>setOpen(false)}>Home</Link>{links.map(([t,h])=><Link key={h} href={h} onClick={()=>setOpen(false)}>{t}</Link>)}<Link href="/ai-automation" onClick={()=>setOpen(false)}>AI Automation</Link><Link href="tel:+61469785113">0469 785 113</Link></nav></SheetContent></Sheet></div></header>}
