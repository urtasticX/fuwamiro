import type {Metadata} from 'next';
import {Providers} from '@/components/providers';
import {Navbar,Footer} from '@/components/shell';
import './globals.css';
export const metadata:Metadata={title:{default:'Fuwamiro — Raised with Love, Growing with Care',template:'%s · Fuwamiro'},description:'A little home, a lot of love. Meet the Fuwamiro British Shorthair family, discover their stories, and find your little companion.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="th"><body><Providers><a className="skip-link" href="#main">Skip to content</a><Navbar/><main id="main">{children}</main><Footer/></Providers></body></html>}
