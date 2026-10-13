"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Search } from "lucide-react";
import { useSite } from "./providers";
import { CatCard, CatPhoto, ContactCTA, Eyebrow, Reveal } from "./ui";
export function Listing({
  kind = "family",
}: {
  kind?: "family" | "kings" | "queens" | "kittens" | "alumni";
}) {
  const { cats, locale, litters } = useSite();
  const params = useSearchParams();
  const [filter, setFilter] = useState(params.get("filter") || "All");
  const [search, setSearch] = useState("");
  const kitten = kind === "kittens";
  const alumni = kind === "alumni";
  const titles = {
    family: (
      <>
        รู้จัก<em>ครอบครัวของเรา</em>
      </>
    ),
    kings: (
      <>
        <em>พ่อพันธุ์ของเรา</em>
      </>
    ),
    queens: (
      <>
        <em>แม่พันธุ์ของเรา</em>
      </>
    ),
    kittens: (
      <>
        อุ้งเท้าเล็ก ๆ
        <br />
        จุดเริ่มต้น<em>ที่งดงาม</em>
      </>
    ),
    alumni: (
      <>
        <em>รักเสมอ</em>
      </>
    ),
  };
  const descriptions = {
    family: "ทุกตัวมีเรื่องราวน่ารัก ๆ ให้รู้จัก",
    kings: "หัวใจแสนอ่อนโยนของบ้านเรา",
    queens: "ความอ่อนหวานและความรักในทุกวัน",
    kittens: "เพื่อนตัวน้อยอาจกำลังรอคุณอยู่",
    alumni: "เรื่องราวอบอุ่นจากบ้านใหม่",
  };
  const filters = kitten
    ? ["All", "Available", "Reserved", "Under Evaluation", "Sold", "Staying"]
    : kind === "family"
      ? ["All", "Kings", "Queens", "Retired"]
      : alumni
        ? []
        : ["All", "Active", "Retired"];
  const filterLabels: Record<string, string> = { All: "ทั้งหมด", Available: "พร้อมย้ายบ้าน", Reserved: "มีคนจองแล้ว", "Under Evaluation": "กำลังประเมิน", Sold: "ย้ายบ้านแล้ว", Staying: "อยู่กับเรา", Kings: "พ่อพันธุ์", Queens: "แม่พันธุ์", Retired: "วัยเกษียณ", Active: "อยู่กับเรา" };
  const litter = litters.find((l) => l.id === params.get("litter"));
  let visible = cats
    .filter((c) =>
      kitten
        ? c.stage === "kitten"
        : alumni
          ? c.stage === "alumni"
          : kind === "kings"
            ? (c.stage === "breeding" || c.stage === "retired") &&
              c.gender === "Male"
            : kind === "queens"
              ? (c.stage === "breeding" || c.stage === "retired") &&
                c.gender === "Female"
              : c.stage === "breeding" || c.stage === "retired",
    )
    .filter(
      (c) =>
        filter === "All" ||
        (filter === "Kings" && c.gender === "Male" && c.stage === "breeding") ||
        (filter === "Queens" &&
          c.gender === "Female" &&
          c.stage === "breeding") ||
        (filter.toLowerCase() === "retired" && c.stage === "retired") ||
        (filter === "Active" && c.stage === "breeding") ||
        c.availability === filter,
    )
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.color.toLowerCase().includes(search.toLowerCase()),
    );
  if (litter) visible = visible.filter((c) => c.litter_id === litter.id);
  return (
    <>
      <section
        className={`page-hero container ${alumni ? "alumni-page-hero" : ""}`}
      >
        <Reveal>
          <Eyebrow>
            {kitten
              ? "ความรักเล็ก ๆ กำลังรอคุณ"
              : alumni
                ? "เป็นครอบครัวของเราเสมอ"
                : "หัวใจของ Fuwamiro"}
          </Eyebrow>
          <h1>{titles[kind]}</h1>
          <p className="page-subtitle">{descriptions[kind]}</p>
          <p>
            {locale === "th"
              ? alumni
                ? "ติดตามเรื่องราวและความสุขจากบ้านใหม่ของสมาชิกตัวน้อย"
                : kitten
                  ? "เติบโตด้วยความใส่ใจ พร้อมเติมความอบอุ่นให้บ้านของคุณ"
                  : "ทำความรู้จักสมาชิกแสนพิเศษ และเรื่องราวเล็ก ๆ ของพวกเขา"
              : "Thoughtfully raised, with a story that is entirely their own."}
          </p>
        </Reveal>
        <span className="page-hero-heart">
          <Heart size={64} strokeWidth={0.65} />
        </span>
      </section>
      <section className="container listing-section">
        {!alumni && (
          <div className="filter-bar">
            <div className="filter-tabs" role="group" aria-label="กรองรายชื่อแมว">
              {filters.map((f) => (
                <button
                  key={f}
                  className={
                    filter.toLowerCase() === f.toLowerCase() ? "selected" : ""
                  }
                  onClick={() => setFilter(f)}
                >
                  {filterLabels[f] || f}
                  {f === "All" && (
                    <span>
                      {
                        cats.filter((c) =>
                          kitten
                            ? c.stage === "kitten"
                            : kind === "kings"
                              ? (c.stage === "breeding" ||
                                  c.stage === "retired") &&
                                c.gender === "Male"
                              : kind === "queens"
                                ? (c.stage === "breeding" ||
                                    c.stage === "retired") &&
                                  c.gender === "Female"
                                : c.stage === "breeding" ||
                                  c.stage === "retired",
                        ).length
                      }
                    </span>
                  )}
                </button>
              ))}
            </div>
            <label className="search-field">
              <Search size={16} />
              <input
                aria-label="ค้นหาแมว"
                placeholder={
                  locale === "th"
                    ? "ค้นหาชื่อหรือสีขน"
                    : "Search name or colour"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
        )}
        {litter && (
          <div className="litter-heading">
            <span>{litter.name}</span>
            <Link href="/kittens">ดูลูกแมวทั้งหมด ↗</Link>
          </div>
        )}
        {visible.length === 0 ? (
          <div className="empty-state">
            <Heart size={30} />
            <h3>
              {locale === "th"
                ? "ยังไม่มีน้องในหมวดนี้"
                : "No little faces here just yet."}
            </h3>
            <p>
              {locale === "th"
                ? "ลองเลือกหมวดอื่น หรือทักมาพูดคุยกับเราได้เลย"
                : "Try another filter, or say hello to learn about upcoming litters."}
            </p>
            <button
              className="button outline"
              onClick={() => {
                setFilter("All");
                setSearch("");
              }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        ) : alumni ? (
          <div className="alumni-stories">
            {visible.map((c) => (
              <Reveal key={c.id} className="alumni-story">
                <Link
                  href={`/profile?id=${c.id}`}
                  className="alumni-story-photo"
                >
                  <CatPhoto src={c.portrait} alt={`${c.name} ในบ้านใหม่`} />
                  <span className="card-label">บทใหม่ของชีวิต</span>
                </Link>
                <div>
                  <Eyebrow>จากบ้านเรา สู่บ้านของเขา</Eyebrow>
                  <h2>
                    {c.name}
                    {c.nickname && <small>ชื่อใหม่ {c.nickname} ♡</small>}
                  </h2>
                  <p>{c.story[locale]}</p>
                  <Link href={`/profile?id=${c.id}`} className="text-link">
                    อ่านเรื่องราวของน้อง <ArrowUpRight size={18} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="cat-grid">
            {visible.map((cat, i) => (
              <CatCard key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        )}
        {alumni && (
          <div className="alumni-update">
            <Heart size={25} />
            <h3>เติบโตต่อไปในความรัก</h3>
            <p>
              {locale === "th"
                ? "เป็นครอบครัวของน้องจาก Fuwamiro? ส่งภาพและเรื่องราวมาให้เราเพิ่มในสมุดความทรงจำของน้องได้เสมอ"
                : "Part of a Fuwamiro forever family? Share a photo or a little update for your companion’s memory book."}
            </p>
            <Link href="/contact?topic=alumni" className="button outline">
              แบ่งปันเรื่องราว <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>
      <ContactCTA />
    </>
  );
}
