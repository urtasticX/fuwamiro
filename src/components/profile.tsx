"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Heart, ShieldCheck } from "lucide-react";
import { useSite } from "./providers";
import {
  CatPhoto,
  ContactCTA,
  Eyebrow,
  PhotoGallery,
  Reveal,
  SectionHeading,
  StatusBadge,
  formatDate,
} from "./ui";
import { AnimatedTimeline } from "./timeline";
import { FamilyTree } from "./family-tree";
export function Profile() {
  const { cats, events, locale, t, content } = useSite();
  const params = useSearchParams();
  const cat = cats.find((c) => c.id === params.get("id"));
  if (!cat)
    return (
      <div className="container empty-state">
        <h1>ไม่พบข้อมูลแมวตัวนี้</h1>
        <Link href="/family" className="button">
          พบสมาชิกของเรา <ArrowUpRight size={16} />
        </Link>
      </div>
    );
  const kitten = cat.stage === "kitten";
  const gallery = [
    ...new Set([
      ...cat.photos,
      ...events.filter((e) => e.cat_id === cat.id).flatMap((e) => e.photos),
    ]),
  ];
  return (
    <>
      <section className="container profile-hero">
        <Link
          className="back-link"
          href={
            kitten ? "/kittens" : cat.stage === "alumni" ? "/alumni" : "/family"
          }
        >
          <ArrowLeft size={15} /> กลับไปยัง{" "}
          {kitten
            ? "ลูกแมว"
            : cat.stage === "alumni"
              ? "สมาชิกที่ย้ายบ้าน"
              : "ครอบครัวของเรา"}
        </Link>
        <div className="profile-hero-grid">
          <Reveal className="profile-portrait">
            <CatPhoto
              src={cat.portrait}
              alt={`${cat.name}, ${cat.color} ${cat.breed}`}
              priority
              sizes="(max-width: 700px) 100vw, 50vw"
            />
            <span className="portrait-caption">
              ภาพของ {cat.name}
            </span>
          </Reveal>
          <Reveal className="profile-intro">
            <Eyebrow>
              {kitten
                ? "สมาชิกตัวน้อยของเรา"
                : cat.stage === "alumni"
                  ? "เป็นครอบครัวของเราเสมอ"
                  : cat.stage === "retired"
                    ? "สมาชิกวัยเกษียณที่เรารัก"
                    : cat.gender === "Male"
                      ? "รู้จักพ่อพันธุ์"
                      : "รู้จักแม่พันธุ์"}
            </Eyebrow>
            <h1>
              สวัสดี ฉันชื่อ
              <br />
              <em>{cat.name}.</em>
            </h1>
            {cat.nickname && (
              <p className="new-name">
                ครอบครัวใหม่เรียกฉันว่า {cat.nickname} ♡
              </p>
            )}
            <p className="profile-personality">{t(cat.personality)}</p>
            {kitten && <StatusBadge status={cat.availability} />}
            <dl className="profile-facts">
              <div>
                <dt>สายพันธุ์</dt>
                <dd>{cat.breed}</dd>
              </div>
              <div>
                <dt>เพศ</dt>
                <dd>
                  {cat.gender === "Male" ? "ผู้ ♂" : "เมีย ♀"}
                </dd>
              </div>
              <div>
                <dt>สีขน</dt>
                <dd>
                  {cat.color} · {cat.color_code}
                </dd>
              </div>
              <div>
                <dt>วันเกิด</dt>
                <dd>{formatDate(cat.birthday, locale)}</dd>
              </div>
              {cat.ready_date && (
                <div>
                  <dt>พร้อมย้ายบ้าน</dt>
                  <dd>{formatDate(cat.ready_date, locale)}</dd>
                </div>
              )}
              {cat.adoption_date && (
                <div>
                  <dt>ย้ายบ้านเมื่อ</dt>
                  <dd>{formatDate(cat.adoption_date, locale)}</dd>
                </div>
              )}
              {cat.price != null && (
                <div>
                  <dt>ราคา</dt>
                  <dd>฿{cat.price.toLocaleString()}</dd>
                </div>
              )}
            </dl>
            {cat.pedigree_type && <p className="pedigree">ประเภทใบเพ็ด: {cat.pedigree_type}</p>}
            {cat.pedigree && <p className="pedigree">รายละเอียดใบเพ็ด: {cat.pedigree}</p>}
            {kitten ? (
              <Link
                className="button"
                href={content.line_url || `/contact?cat=${cat.id}`}
              >
                สอบถามเกี่ยวกับ {cat.name} <ArrowUpRight size={17} />
              </Link>
            ) : (
              <a className="text-link" href="#journey">
                ติดตามเรื่องราวของฉัน <ArrowUpRight size={17} />
              </a>
            )}
          </Reveal>
        </div>
      </section>
      <nav className="profile-tabs" aria-label="หัวข้อประวัติแมว">
        <a href="#about-me">เกี่ยวกับฉัน</a>
        <a href="#journey">การเติบโต</a>
        <a href="#my-family">ครอบครัว</a>
        <a href="#little-moments">ภาพความทรงจำ</a>
      </nav>
      <section id="about-me" className="container section about-profile">
        <Reveal>
          <Eyebrow>ทำความรู้จักกันอีกนิด</Eyebrow>
          <h2>
            เรื่องเล็ก ๆ
            <br />
            <em>ตัวตนที่น่ารัก</em>
          </h2>
        </Reveal>
        <Reveal>
          <p className="lead">{t(cat.story)}</p>
          <div className="health-note">
            <ShieldCheck size={23} />
            <div>
              <h4>เติบโตด้วยความใส่ใจ</h4>
              <p>{t(cat.public_health)}</p>
              <Link href="/health" className="text-link">
                แนวทางการดูแล <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <section id="journey" className="container section journey-section">
        <Reveal className="center-heading">
          <Eyebrow>ทุกช่วงเวลามีความหมาย</Eyebrow>
          <h2>
            การ<em>เติบโตของฉัน</em>
          </h2>
          <p>
            {locale === "th"
              ? "จากวันแรก สู่ความทรงจำที่น่ารักในทุก ๆ วัน"
              : "From the very first day to all the little moments along the way."}
          </p>
        </Reveal>
        <AnimatedTimeline
          events={events.filter((e) => e.cat_id === cat.id)}
          name={cat.name}
        />
      </section>
      <section id="my-family" className="family-tree-section section">
        <div className="container">
          <Reveal className="center-heading">
            <Eyebrow>สายใยแห่งความรัก</Eyebrow>
            <h2>
              <em>ครอบครัวของฉัน</em>
            </h2>
            <p>
              {locale === "th"
                ? "กดที่รูปเพื่อทำความรู้จักสมาชิกในครอบครัวของฉัน"
                : "Tap a little face to discover another part of our story."}
            </p>
          </Reveal>
          <FamilyTree cat={cat} />
        </div>
      </section>
      <section id="little-moments" className="container section">
        <SectionHeading
          eyebrow="ความทรงจำแสนพิเศษ"
          title={
            <>
              <em>ภาพความทรงจำ</em>
            </>
          }
          description={
            locale === "th"
              ? "ความทรงจำเล็ก ๆ ที่อยากเก็บไว้ด้วยกัน"
              : "A few memories we’d love to keep forever."
          }
        />
        <PhotoGallery photos={gallery} name={cat.name} />
      </section>
      <div className="profile-end">
        <Heart size={20} />
        <p>ทุกอุ้งเท้าเล็ก ๆ มีเรื่องราวของตัวเอง</p>
      </div>
      <ContactCTA />
    </>
  );
}
