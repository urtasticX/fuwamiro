"use client";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Flower2,
  Sun,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { useSite } from "./providers";
import {
  CatPhoto,
  CatCard,
  ContactCTA,
  Eyebrow,
  Reveal,
  SectionHeading,
} from "./ui";
export function Home() {
  const { cats, locale, t, content } = useSite();
  const featured = cats.find((c) => c.stage === "breeding") || cats[0];
  const alumni = cats.find((c) => c.stage === "alumni");
  const hero = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 70]);
  return (
    <>
      <section className="hero container" ref={hero}>
        <div className="hero-copy">
          <Reveal>
            <Eyebrow>บ้านเล็ก ๆ ที่เต็มไปด้วยความรัก</Eyebrow>
          </Reveal>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
          >
            เติบโตด้วย<em>ความรัก</em>
            <br />
            ดูแล
            <br /> ด้วยความใส่ใจ<span className="title-dot">.</span>
          </motion.h1>
          <Reveal delay={0.22}>
            <p className="hero-subtitle">
              ทุกอุ้งเท้าเล็ก ๆ มีเรื่องราวของตัวเอง
            </p>
            <p className="hero-thai">
              {locale === "th"
                ? "เราเลี้ยงดูทุกชีวิตด้วยหัวใจ เพื่อส่งต่อความรัก\nสู่บ้านที่อบอุ่นของพวกเขา"
                : "Thoughtfully raised in our home,\nready to fill yours with a little more love."}
            </p>
            <div className="hero-buttons">
              <Link href="/family" className="button">
                รู้จักครอบครัวของเรา <ArrowUpRight size={17} />
              </Link>
              <Link href="/kittens" className="button outline">
                ลูกแมวหาบ้าน
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.35} className="hero-note">
            <div className="little-portraits">
              <div>
                <CatPhoto
                  src="/images/moon-close.webp"
                  alt="Moon"
                  sizes="40px"
                />
              </div>
              <div>
                <CatPhoto
                  src="/images/bomi-close.webp"
                  alt="Bomi"
                  sizes="40px"
                />
              </div>
              <div>
                <CatPhoto src="/images/mochi.webp" alt="Mochi" sizes="40px" />
              </div>
            </div>
            <div>
              <span>อุ้งเท้าเล็ก ๆ ความรักยิ่งใหญ่</span>
              <small>ครอบครัวของเรา ตั้งแต่วันแรก</small>
            </div>
            <Heart size={15} />
          </Reveal>
        </div>
        <div className="hero-visual">
          <motion.div className="hero-photo" style={{ y: reduce ? 0 : y }}>
            <CatPhoto
              src={featured?.portrait || "/images/moon.webp"}
              alt={
                featured
                  ? `${featured.name} enjoying a quiet afternoon at home`
                  : "A quiet afternoon at Fuwamiro"
              }
              priority
              sizes="(max-width: 700px) 100vw, 52vw"
            />
          </motion.div>
          <span className="hero-image-label">ช่วงเวลาที่บ้าน — 01</span>
          <div className="hero-sticker">
            <Heart size={20} strokeWidth={1.2} />
            <span>
              ความนุ่มฟู
              <br />และความรัก
            </span>
          </div>
          <Link
            href={featured ? `/profile?id=${featured.id}` : "/family"}
            className="hero-caption"
          >
            <div>
              <span>รู้จักสมาชิกของเรา</span>
              <strong>
                {featured?.name || "บ้านของเรา"}{" "}
                <small>{featured?.breed || "ด้วยความรักเสมอ"}</small>
              </strong>
            </div>
            <ArrowUpRight size={21} />
          </Link>
        </div>
        <a className="scroll-cue" href="#our-story">
          <span>เลื่อนดูโลกใบเล็กของเรา</span>
          <ArrowDown size={14} />
        </a>
      </section>
      <div className="values-strip">
        <span>
          <Heart />
          เลี้ยงดูเหมือนครอบครัว
        </span>
        <i />
        <span>
          <ShieldCheck />
          ดูแลด้วยความใส่ใจ
        </span>
        <i />
        <span>
          <Flower2 />
          เริ่มต้นอย่างอ่อนโยน
        </span>
        <i />
        <span>
          <Sun />รักตลอดไป
        </span>
      </div>
      <section id="our-story" className="container section story-section">
        <Reveal className="story-visual">
          <div className="story-photo">
            <CatPhoto
              src="/images/bomi.webp"
              alt="Bomi at her favourite sunny spot"
            />
          </div>
          <div className="story-small-photo">
            <CatPhoto
              src="/images/kittens.webp"
              alt="Our little kittens growing together"
            />
          </div>
          <span className="handwritten">บ้านแห่งแรก ก่อนพบครอบครัวใหม่</span>
        </Reveal>
        <Reveal className="story-copy">
          <Eyebrow>ยินดีต้อนรับสู่ Fuwamiro</Eyebrow>
          <h2>
            บ้านเล็ก ๆ
            <br />ที่เต็มไปด้วย<em>หัวใจ</em>
          </h2>
          <p className="lead">{t(content.intro)}</p>
          <p>{t(content.philosophy)}</p>
          <Link href="/health" className="text-link">
            เรื่องราวและการดูแลของเรา <ArrowUpRight size={18} />
          </Link>
          <div className="story-signature">
            <span>ด้วยรัก</span>
            <strong>ครอบครัว Fuwamiro ♡</strong>
          </div>
        </Reveal>
      </section>
      <section className="family-section section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="หัวใจของบ้านเรา"
              title={
                <>
                  รู้จัก<em>ครอบครัวของเรา</em>
                </>
              }
              description={
                locale === "th"
                  ? "ทุกตัวมีบุคลิกที่ไม่เหมือนใคร และมีเรื่องราวน่ารัก ๆ รอให้คุณรู้จัก"
                  : "Different personalities. Equally loved. A little story behind every face."
              }
              href="/family"
              linkLabel="รู้จักทุกตัว"
            />
          </Reveal>
          <div className="cat-grid">
            {cats
              .filter((c) => c.stage === "breeding" || c.id === "nori")
              .slice(0, 3)
              .map((cat, i) => (
                <CatCard key={cat.id} cat={cat} index={i} />
              ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <Reveal>
          <SectionHeading
            eyebrow="อุ้งเท้าเล็ก ๆ กับการเริ่มต้นใหม่"
            title={
              <>
                ความรักเล็ก ๆ <em>กำลังรอคุณ</em>
              </>
            }
            description={
              locale === "th"
                ? "ทำความรู้จักสมาชิกตัวน้อยที่กำลังเติบโต พร้อมเริ่มต้นเรื่องราวบทใหม่"
                : "Meet our little ones, growing with care and ready for their next chapter."
            }
            href="/kittens"
            linkLabel="ดูลูกแมวทั้งหมด"
          />
        </Reveal>
        <div className="cat-grid">
          {cats
            .filter((c) => c.stage === "kitten")
            .slice(0, 3)
            .map((cat, i) => (
              <CatCard key={cat.id} cat={cat} index={i} />
            ))}
        </div>
        <p className="gentle-note">
          <Heart size={13} />
          {locale === "th"
            ? "เราใส่ใจการจับคู่ที่เหมาะสม เพื่อความสุขของน้องและครอบครัวใหม่"
            : "The right home matters more than the perfect timing."}
        </p>
      </section>
      <section className="alumni-feature">
        <div className="container alumni-layout">
          <Reveal className="alumni-copy">
            <Eyebrow>เป็นครอบครัวของเราเสมอ</Eyebrow>
            <h2>
              บ้านใหม่
              <br />
              หัวใจดวงเดิม<em>ที่เรารัก</em>
            </h2>
            <p>
              {locale === "th"
                ? "แม้จะย้ายไปอยู่ในอ้อมกอดใหม่ แต่ทุกตัวจะเป็นส่วนหนึ่งของครอบครัวเราเสมอ มาติดตามเรื่องราวน่ารัก ๆ จากบ้านใหม่ของพวกเขากัน"
                : "A new home is never the end of their story. Follow the little lives that will always be part of our family."}
            </p>
            <Link href="/alumni" className="text-link">
              เรื่องราวจากบ้านใหม่ <ArrowUpRight size={18} />
            </Link>
          </Reveal>
          <Reveal className="alumni-photos">
            <Link
              href={alumni ? `/profile?id=${alumni.id}` : "/alumni"}
              className="alumni-polaroid"
            >
              <div>
                <CatPhoto
                  src={alumni?.portrait || "/images/miso.webp"}
                  alt={
                    alumni
                      ? `${alumni.name} as a little kitten`
                      : "A little memory from home"
                  }
                />
              </div>
              <span>
                {alumni
                  ? `${alumni.name}${alumni.nickname ? ` ชื่อใหม่ ${alumni.nickname}` : ""} ♡`
                  : "รักเสมอ ♡"}
              </span>
            </Link>
            <div className="alumni-polaroid small">
              <div>
                <CatPhoto
                  src="/images/bomi-close.webp"
                  alt="A little portrait from home"
                />
              </div>
              <span>รักตลอดไป</span>
            </div>
          </Reveal>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
