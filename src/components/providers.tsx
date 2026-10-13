'use client';
import {createContext,useContext,useEffect,useState,ReactNode} from 'react';
import {Cat,Copy,JourneyEvent,Litter,Locale,SiteContent} from '@/lib/types';
import {sampleCats,sampleEvents,sampleLitters,defaultContent} from '@/lib/data';
import {initializeAnalytics} from '@/lib/firebase';
import {loadPublicContent} from '@/lib/repository';
type Context={locale:Locale;setLocale:(l:Locale)=>void;t:(c:Copy)=>string;cats:Cat[];events:JourneyEvent[];litters:Litter[];content:SiteContent;isDemo:boolean;connectionStatus:'loading'|'connected'|'error';connectionError:string|null;refresh:()=>Promise<void>};
const C=createContext<Context>(null!);
export function Providers({children}:{children:ReactNode}){
 const [locale,setLocaleState]=useState<Locale>('th');const [cats,setCats]=useState(sampleCats);const [events,setEvents]=useState(sampleEvents);const [litters,setLitters]=useState(sampleLitters);const [content,setContent]=useState(defaultContent);const [isDemo,setIsDemo]=useState(true);
 const [connectionStatus,setConnectionStatus]=useState<'loading'|'connected'|'error'>('loading');
 const [connectionError,setConnectionError]=useState<string|null>(null);
 useEffect(()=>{const saved=localStorage.getItem('fuwamiro-language');if(saved==='en'||saved==='th')setLocaleState(saved)},[]);
 function setLocale(l:Locale){setLocaleState(l);localStorage.setItem('fuwamiro-language',l);document.documentElement.lang=l;}
 async function refresh(){
  setConnectionStatus('loading');setConnectionError(null);
  try {const data=await loadPublicContent();setCats(data.cats);setEvents(data.events);setLitters(data.litters);setContent({...defaultContent,...data.content});setIsDemo(false);setConnectionStatus('connected');}
  catch(error){setConnectionStatus('error');setConnectionError(error instanceof Error?error.message:'Unable to load Firestore data');}
 }
 useEffect(()=>{void refresh();void initializeAnalytics()},[]);
 return <C.Provider value={{locale,setLocale,t:c=>c[locale]||c.en,cats,events,litters,content,isDemo,connectionStatus,connectionError,refresh}}>{children}</C.Provider>
}
export const useSite=()=>useContext(C);
