import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Pulseboard | Your daily signal',description:'A personalized content dashboard for news, film and community ideas.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
