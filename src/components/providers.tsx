"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Cat,
  Copy,
  JourneyEvent,
  Litter,
  Locale,
  SiteContent,
} from "@/lib/types";
import {
  sampleCats,
  sampleEvents,
  sampleLitters,
  defaultContent,
} from "@/lib/data";
import { initializeAnalytics } from "@/lib/firebase";
import { loadPublicContent } from "@/lib/repository";
type Context = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (c: Copy) => string;
  cats: Cat[];
  events: JourneyEvent[];
  litters: Litter[];
  content: SiteContent;
  isDemo: boolean;
  connectionStatus: "loading" | "connected" | "error";
  connectionError: string | null;
  refresh: () => Promise<void>;
};
const C = createContext<Context>(null!);
export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("th");
  const [cats, setCats] = useState(sampleCats);
  const [events, setEvents] = useState(sampleEvents);
  const [litters, setLitters] = useState(sampleLitters);
  const [content, setContent] = useState(defaultContent);
  const [isDemo, setIsDemo] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "loading" | "connected" | "error"
  >("loading");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  function setLocale(l: Locale) {
    setLocaleState("th");
    document.documentElement.lang = "th";
  }
  async function refresh() {
    setConnectionStatus("loading");
    setConnectionError(null);
    try {
      const data = await loadPublicContent();
      const demo = data.cats.length === 0 && !data.content;
      setCats(demo ? sampleCats : data.cats);
      setEvents(demo ? sampleEvents : data.events);
      setLitters(demo ? sampleLitters : data.litters);
      setContent({ ...defaultContent, ...data.content });
      setIsDemo(demo || data.content?.sample_mode === true);
      setConnectionStatus("connected");
    } catch (error) {
      setConnectionStatus("error");
      setConnectionError(
        error instanceof Error
          ? error.message
          : "Unable to load Firestore data",
      );
    }
  }
  useEffect(() => {
    void refresh();
    void initializeAnalytics();
  }, []);
  useEffect(() => {
    if (!content.icon_url) return;
    let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = content.icon_url;
  }, [content.icon_url]);
  return (
    <C.Provider
      value={{
        locale,
        setLocale,
        t: (c) => c.th || c.en,
        cats,
        events,
        litters,
        content,
        isDemo,
        connectionStatus,
        connectionError,
        refresh,
      }}
    >
      {children}
    </C.Provider>
  );
}
export const useSite = () => useContext(C);
