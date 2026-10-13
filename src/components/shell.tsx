"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Heart,
  Menu,
  X,
  Instagram,
  Facebook,
} from "lucide-react";
import { useSite } from "./providers";
export function Brand() {
  const { content } = useSite();
  return (
    <Link href="/" className="brand" aria-label="หน้าแรก Fuwamiro">
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
        <small>บ้านเล็ก ๆ ที่เต็มไปด้วยความรัก</small>
      </span>
    </Link>
  );
}
const links = [
  ["/", "หน้าแรก"],
  ["/family", "ครอบครัวของเรา"],
  ["/kittens", "ลูกแมวหาบ้าน"],
  ["/alumni", "สมาชิกที่ย้ายบ้าน"],
  ["/health", "สุขภาพและการดูแล"],
];
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
        เลี้ยงดูด้วยหัวใจ รักตลอดไป <Heart size={11} />
      </div>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-wrap">
          <Brand />
          <nav
            className={open ? "nav-links open" : "nav-links"}
            aria-label="เมนูหลัก"
          >
            {links.map(([href, label]) => (
              <div className="nav-item" key={href}>
                <Link className={pathname === href || (href === "/family" && ["/kings", "/queens"].includes(pathname)) ? "active" : ""} href={href}>
                  {label}
                </Link>
                {href === "/family" && (
                  <div className="subnav">
                    <Link href="/kings">พ่อพันธุ์</Link>
                    <Link href="/queens">แม่พันธุ์</Link>
                    <Link href="/family?filter=retired">สมาชิกวัยเกษียณ</Link>
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact" className={`mobile-contact ${pathname === "/contact" ? "active" : ""}`}>
              ติดต่อเรา
            </Link>
          </nav>
          <div className="nav-actions">
            <Link href="/contact" className={`button small contact-nav ${pathname === "/contact" ? "active" : ""}`}>
              พูดคุยกับเรา <ArrowUpRight size={15} />
            </Link>
            <button
              className="menu-toggle icon-button"
              aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
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
  const { content, isDemo } = useSite();
  return (
    <footer>
      <div className="container footer-main">
        <div className="footer-brand">
          <Brand />
          <p>
            ความรักเล็ก ๆ ที่ทำให้บ้านอบอุ่นขึ้นทุกวัน
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
          <span className="footer-title">ครอบครัวของเรา</span>
          <Link href="/family">รู้จักสมาชิก</Link>
          <Link href="/kings">พ่อพันธุ์</Link>
          <Link href="/queens">แม่พันธุ์</Link>
          <Link href="/kittens">ลูกแมวหาบ้าน</Link>
        </div>
        <div>
          <span className="footer-title">ดูเพิ่มเติม</span>
          <Link href="/alumni">สมาชิกที่ย้ายบ้าน</Link>
          <Link href="/health">สุขภาพและการดูแล</Link>
          <Link href="/contact">ติดต่อเรา</Link>
          <Link href="/admin">จัดการเว็บไซต์</Link>
        </div>
        <div className="footer-note">
          <Heart size={22} strokeWidth={1} />
          <p>
            อุ้งเท้าเล็ก ๆ
            <br />
            จุดเริ่มต้นที่งดงาม
          </p>
          <span>{content.location.th}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Fuwamiro Cattery</span>
        <span>
          {isDemo ? "ภาพและข้อมูลแมวเป็นตัวอย่างสำหรับการออกแบบเว็บไซต์" : "สร้างด้วยความรักและความใส่ใจ"}
        </span>
        <span>ด้วยความรักเสมอ ♡</span>
      </div>
    </footer>
  );
}
