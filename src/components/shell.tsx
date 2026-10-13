"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Heart,
  Menu,
  X,
  Instagram,
  Facebook,
} from "lucide-react";
import { useSite } from "./providers";
export function Brand() {
  const { content, locale } = useSite();
  return (
    <Link href="/" className="brand" aria-label="Fuwamiro home">
      {content.icon_url ? <img className="brand-icon" src={content.icon_url} alt="" /> : <svg
        width="38"
        height="36"
        viewBox="0 0 38 36"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 15 7 4l10 7h5l10-7-1 12c3 4 3 10-1 14-6 5-18 5-23-1-4-4-3-10 1-14Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 21h.01M25 21h.01"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="m17 25 2 2 2-2M19 27v2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>}
      <span>
        fuwamiro<span className="brand-dot">.</span>
        <small>{locale === "th" ? "บ้านเล็ก ๆ ที่เต็มไปด้วยความรัก" : "A LITTLE HOME, A LOT OF LOVE"}</small>
      </span>
    </Link>
  );
}
const links = [
  ["/", "หน้าแรก", "Home"],
  ["/family", "ครอบครัวของเรา", "Our Family"],
  ["/kittens", "ลูกแมวหาบ้าน", "Available Kittens"],
  ["/alumni", "สมาชิกที่ย้ายบ้าน", "Our Alumni"],
  ["/health", "สุขภาพและการดูแล", "Health & Care"],
] as const;
export function Navbar() {
  const pathname = usePathname();
  const activePath = pathname.replace(/\/+$/, "") || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale } = useSite();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);
  return (
    <>
      <div className="announcement">
        {locale === "th" ? "เลี้ยงดูด้วยหัวใจ รักตลอดไป" : "Thoughtfully raised. Endlessly loved."} <Heart size={11} />
      </div>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-wrap">
          <Brand />
          <nav
            className={open ? "nav-links open" : "nav-links"}
            aria-label="Main navigation"
          >
            {links.map(([href, th, en]) => (
              <div className="nav-item" key={href}>
                <Link className={activePath === href || (href === "/family" && ["/kings", "/queens"].includes(activePath)) ? "active" : ""} href={href}>
                  {locale === "th" ? th : en}
                  {href === "/family" && <ChevronDown size={12} />}
                </Link>
                {href === "/family" && (
                  <div className="subnav">
                    <Link href="/kings">{locale === "th" ? "พ่อพันธุ์" : "Our Kings"}</Link>
                    <Link href="/queens">{locale === "th" ? "แม่พันธุ์" : "Our Queens"}</Link>
                    <Link href="/family?filter=retired">{locale === "th" ? "สมาชิกวัยเกษียณ" : "Retired & loved"}</Link>
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact" className={`mobile-contact ${activePath === "/contact" ? "active" : ""}`}>
              {locale === "th" ? "ติดต่อเรา" : "Contact Us"}
            </Link>
          </nav>
          <div className="nav-actions">
            <button
              className="language"
              onClick={() => setLocale(locale === "th" ? "en" : "th")}
              aria-label={`Switch to ${locale === "th" ? "English" : "Thai"}`}
            >
              {locale.toUpperCase()}
              <ChevronDown size={11} />
            </button>
            <Link href="/contact" className={`button small contact-nav ${activePath === "/contact" ? "active" : ""}`}>
              {locale === "th" ? "พูดคุยกับเรา" : "Let’s talk"} <ArrowUpRight size={15} />
            </Link>
            <button
              className="menu-toggle icon-button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  const { locale, content, isDemo } = useSite();
  return (
    <footer>
      <div className="container footer-main">
        <div className="footer-brand">
          <Brand />
          <p>
            {locale === "th"
              ? "ความรักเล็ก ๆ ที่ทำให้บ้านอบอุ่นขึ้นทุกวัน"
              : "Little companions. A lifetime of love."}
          </p>
          <div className="social-row">
            <Link
              href={content.instagram_url || "/contact"}
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href={content.facebook_url || "/contact"}
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </Link>
            <Link href={content.line_url || "/contact"} aria-label="LINE">
              <span className="line-icon">LINE</span>
            </Link>
          </div>
        </div>
        <div>
          <span className="footer-title">{locale === "th" ? "ครอบครัวของเรา" : "OUR LITTLE WORLD"}</span>
          <Link href="/family">{locale === "th" ? "รู้จักสมาชิก" : "Meet Our Family"}</Link>
          <Link href="/kings">{locale === "th" ? "พ่อพันธุ์" : "Our Kings"}</Link>
          <Link href="/queens">{locale === "th" ? "แม่พันธุ์" : "Our Queens"}</Link>
          <Link href="/kittens">{locale === "th" ? "ลูกแมวหาบ้าน" : "Available Kittens"}</Link>
        </div>
        <div>
          <span className="footer-title">{locale === "th" ? "ดูเพิ่มเติม" : "STAY A LITTLE LONGER"}</span>
          <Link href="/alumni">{locale === "th" ? "สมาชิกที่ย้ายบ้าน" : "Our Alumni"}</Link>
          <Link href="/health">{locale === "th" ? "สุขภาพและการดูแล" : "Health & Care"}</Link>
          <Link href="/contact">{locale === "th" ? "ติดต่อเรา" : "Contact Us"}</Link>
          <Link href="/admin">{locale === "th" ? "จัดการเว็บไซต์" : "Cattery Admin"}</Link>
        </div>
        <div className="footer-note">
          <Heart size={22} strokeWidth={1} />
          <p>
            {locale === "th" ? "อุ้งเท้าเล็ก ๆ" : "Small paws."}
            <br />
            {locale === "th" ? "จุดเริ่มต้นที่งดงาม" : "Beautiful beginnings."}
          </p>
          <span>{content.location[locale]}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Fuwamiro Cattery</span>
        <span>
          {isDemo
            ? locale === "th"
              ? "ภาพและข้อมูลแมวเป็นตัวอย่างสำหรับการออกแบบเว็บไซต์"
              : "Illustrative photography and sample cat profiles."
            : "Made with a little extra love."}
        </span>
        <span>{locale === "th" ? "ด้วยความรักเสมอ ♡" : "WITH LOVE, ALWAYS ♡"}</span>
      </div>
    </footer>
  );
}
