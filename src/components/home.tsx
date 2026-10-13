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
            <Eyebrow>A LITTLE HOME, A LOT OF LOVE</Eyebrow>
          </Reveal>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
          >
            Raised with <br className="hero-love-break" /><em>Love,</em>
            <br />
            Growing
            <br className="hero-care-break" /> with Care<span className="title-dot">.</span>
          </motion.h1>
          <Reveal delay={0.22}>
            <p className="hero-subtitle">
              {locale === "th"
                ? "ทุกอุ้งเท้าเล็ก ๆ มีเรื่องราวของตัวเอง"
                : "Every little paw has a story to tell."}
            </p>
            <p className="hero-thai">
              {locale === "th"
                ? "เราเลี้ยงดูทุกชีวิตด้วยหัวใจ เพื่อส่งต่อความรัก\nสู่บ้านที่อบอุ่นของพวกเขา"
                : "Thoughtfully raised in our home,\nready to fill yours with a little more love."}
            </p>
            <div className="hero-buttons">
              <Link href="/family" className="button">
                Meet Our Family <ArrowUpRight size={17} />
              </Link>
              <Link href="/kittens" className="button outline">
                Available Kittens
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
              <span>Small paws. Big love.</span>
              <small>Our family, from the very beginning.</small>
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
          <span className="hero-image-label">MOMENTS AT HOME — 01</span>
          <div className="hero-sticker">
            <Heart size={20} strokeWidth={1.2} />
            <span>
              Made of fluff
              <br />& a little love.
            </span>
          </div>
          <Link
            href={featured ? `/profile?id=${featured.id}` : "/family"}
            className="hero-caption"
          >
            <div>
              <span>MEET OUR GENTLE SOUL</span>
              <strong>
                {featured?.name || "Our little home"}{" "}
                <small>{featured?.breed || "With love, always"}</small>
              </strong>
            </div>
            <ArrowUpRight size={21} />
          </Link>
        </div>
        <a className="scroll-cue" href="#our-story">
          <span>SCROLL TO OUR LITTLE WORLD</span>
          <ArrowDown size={14} />
        </a>
      </section>
      <div className="values-strip">
        <span>
          <Heart />
          Raised as family
        </span>
        <i />
        <span>
          <ShieldCheck />
          Thoughtful care
        </span>
        <i />
        <span>
          <Flower2 />
          Gentle beginnings
        </span>
        <i />
        <span>
          <Sun />A lifetime of love
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
          <span className="handwritten">a home, before a forever home.</span>
        </Reveal>
        <Reveal className="story-copy">
          <Eyebrow>WELCOME TO FUWAMIRO</Eyebrow>
          <h2>
            A little home.
            <br />A whole lot of <em>heart.</em>
          </h2>
          <p className="lead">{t(content.intro)}</p>
          <p>{t(content.philosophy)}</p>
          <Link href="/health" className="text-link">
            Our story & the care behind it <ArrowUpRight size={18} />
          </Link>
          <div className="story-signature">
            <span>with love,</span>
            <strong>the Fuwamiro family ♡</strong>
          </div>
        </Reveal>
      </section>
      <section className="family-section section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="THE HEART OF OUR HOME"
              title={
                <>
                  Meet our <em>family.</em>
                </>
              }
              description={
                locale === "th"
                  ? "ทุกตัวมีบุคลิกที่ไม่เหมือนใคร และมีเรื่องราวน่ารัก ๆ รอให้คุณรู้จัก"
                  : "Different personalities. Equally loved. A little story behind every face."
              }
              href="/family"
              linkLabel="Meet everyone"
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
            eyebrow="LITTLE PAWS, NEW BEGINNINGS"
            title={
              <>
                A little love, <em>waiting.</em>
              </>
            }
            description={
              locale === "th"
                ? "ทำความรู้จักสมาชิกตัวน้อยที่กำลังเติบโต พร้อมเริ่มต้นเรื่องราวบทใหม่"
                : "Meet our little ones, growing with care and ready for their next chapter."
            }
            href="/kittens"
            linkLabel="All kittens"
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
            <Eyebrow>ALWAYS PART OF OUR FAMILY</Eyebrow>
            <h2>
              New homes.
              <br />
              Same <em>little hearts.</em>
            </h2>
            <p>
              {locale === "th"
                ? "แม้จะย้ายไปอยู่ในอ้อมกอดใหม่ แต่ทุกตัวจะเป็นส่วนหนึ่งของครอบครัวเราเสมอ มาติดตามเรื่องราวน่ารัก ๆ จากบ้านใหม่ของพวกเขากัน"
                : "A new home is never the end of their story. Follow the little lives that will always be part of our family."}
            </p>
            <Link href="/alumni" className="text-link">
              Stories from their forever homes <ArrowUpRight size={18} />
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
                  ? `${alumni.name}${alumni.nickname ? `, now ${alumni.nickname}` : ""} ♡`
                  : "a little love, forever. ♡"}
              </span>
            </Link>
            <div className="alumni-polaroid small">
              <div>
                <CatPhoto
                  src="/images/bomi-close.webp"
                  alt="A little portrait from home"
                />
              </div>
              <span>forever loved.</span>
            </div>
          </Reveal>
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
