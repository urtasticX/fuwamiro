"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState, ReactNode } from "react";
import { Cat } from "@/lib/types";
import { useSite } from "./providers";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function CatPhoto({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span />
      {children}
    </span>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "ดูเพิ่มเติม",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkLabel}
          <ArrowUpRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { Available: "พร้อมย้ายบ้าน", Reserved: "มีคนจองแล้ว", "Under Evaluation": "กำลังประเมิน", Sold: "ย้ายบ้านแล้ว", Staying: "อยู่กับเรา" };
  return (
    <span className={`status ${status.toLowerCase().replaceAll(" ", "-")}`}>
      <i />
      {labels[status] || status}
    </span>
  );
}
export function CatCard({ cat, index = 0 }: { cat: Cat; index?: number }) {
  const { locale } = useSite();
  const kitten = cat.stage === "kitten";
  return (
    <Reveal delay={Math.min(index * 0.07, 0.28)}>
      <Link href={`/profile?id=${cat.id}`} className="cat-card">
        <div className="cat-card-image">
          <CatPhoto
            src={cat.portrait}
            alt={`${cat.name}, ${cat.color} ${cat.breed}`}
          />
          {kitten ? (
            <StatusBadge status={cat.availability} />
          ) : (
            <span className="card-label">
              {cat.stage === "retired"
                ? "สมาชิกวัยเกษียณ"
                : cat.stage === "alumni"
                  ? "ย้ายบ้านแล้ว"
                  : cat.gender === "Male"
                    ? "พ่อพันธุ์"
                    : "แม่พันธุ์"}
            </span>
          )}
          <span className="card-arrow">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <div className="cat-card-info">
          <div>
            <h3>
              {cat.name}
              <span>{cat.gender === "Male" ? "♂" : "♀"}</span>
            </h3>
            <p>
              {cat.breed} · {cat.color}
            </p>
            {kitten && (
              <small>
                เกิด{" "}
                {formatDate(cat.birthday, locale)}
              </small>
            )}
          </div>
          <span className="profile-link">
            รู้จักน้อง
            <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
export function ContactCTA() {
  const { locale } = useSite();
  return (
    <section className="contact-cta container">
      <Reveal className="cta-inner">
        <div className="cta-doodle">
          <Heart size={42} strokeWidth={0.8} />
        </div>
        <Eyebrow>เริ่มต้นเรื่องราวดี ๆ ด้วยกัน</Eyebrow>
        <h2>
          เพื่อนตัวน้อยของคุณ
          <br />
          อาจรออยู่<em>ที่นี่</em>
        </h2>
        <p>
          {locale === "th"
            ? "อยากรู้จักสมาชิกตัวน้อยของเราให้มากขึ้น? เรายินดีพูดคุยกับคุณเสมอ"
            : "Curious about our little family? We’re always happy to say hello."}
        </p>
        <Link className="button" href="/contact">
          ทักทายเรา <ArrowUpRight size={17} />
        </Link>
        <span className="cta-foot">
          พบกันด้วยความใส่ใจ เริ่มต้นด้วยความรัก
        </span>
      </Reveal>
    </section>
  );
}
export function formatDate(date: string, locale = "th") {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    locale === "th" ? "th-TH" : "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );
}
export function PhotoGallery({
  photos,
  name,
}: {
  photos: string[];
  name: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  function open(i: number) {
    setSelected(i);
    dialog.current?.showModal();
  }
  function dismiss() {
    dialog.current?.close();
    setSelected(null);
  }
  useEffect(() => {
    if (selected === null) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    return () => {
      document.body.style.overflow = old;
    };
  }, [selected]);
  return (
    <>
      <div className="masonry-gallery">
        {photos.map((photo, i) => (
          <button
            key={`${photo}-${i}`}
            onClick={() => open(i)}
            className="gallery-photo"
            aria-label={`เปิดรูปที่ ${i + 1} ของ ${name}`}
          >
            <CatPhoto src={photo} alt={`${name} — memory ${i + 1}`} />
            <span>
              <ArrowUpRight size={21} />
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dismiss();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight")
            setSelected((v) => (v === null ? 0 : (v + 1) % photos.length));
          if (e.key === "ArrowLeft")
            setSelected((v) =>
              v === null ? 0 : (v - 1 + photos.length) % photos.length,
            );
        }}
      >
        <button
          ref={close}
          className="lightbox-close icon-button"
          aria-label="ปิดรูปภาพ"
          onClick={dismiss}
        >
          <X />
        </button>
        {selected !== null && (
          <>
            <div className="lightbox-image">
              <Image
                src={photos[selected]}
                alt={`${name} — memory ${selected + 1}`}
                fill
                sizes="90vw"
              />
            </div>
            <div className="lightbox-controls">
              <button
                className="icon-button"
                onClick={() =>
                  setSelected((selected - 1 + photos.length) % photos.length)
                }
                aria-label="รูปก่อนหน้า"
              >
                <ChevronLeft />
              </button>
              <span>
                {selected + 1} / {photos.length} · {name}
              </span>
              <button
                className="icon-button"
                onClick={() => setSelected((selected + 1) % photos.length)}
                aria-label="รูปถัดไป"
              >
                <ChevronRight />
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
