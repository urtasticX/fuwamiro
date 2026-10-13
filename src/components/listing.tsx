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
        Meet our <em>family.</em>
      </>
    ),
    kings: (
      <>
        Our gentle <em>kings.</em>
      </>
    ),
    queens: (
      <>
        Our lovely <em>queens.</em>
      </>
    ),
    kittens: (
      <>
        Little paws.
        <br />
        Beautiful <em>beginnings.</em>
      </>
    ),
    alumni: (
      <>
        Forever <em>loved.</em>
      </>
    ),
  };
  const descriptions = {
    family: "Every little paw has a beautiful story.",
    kings: "The gentle hearts of our home.",
    queens: "A little grace. A whole lot of love.",
    kittens: "Your next chapter might begin with a little purr.",
    alumni: "Little paws, beautiful new beginnings.",
  };
  const filters = kitten
    ? ["All", "Available", "Reserved", "Under Evaluation", "Sold", "Staying"]
    : kind === "family"
      ? ["All", "Kings", "Queens", "Retired"]
      : alumni
        ? []
        : ["All", "Active", "Retired"];
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
              ? "A LITTLE LOVE IS WAITING"
              : alumni
                ? "ALWAYS PART OF OUR FAMILY"
                : "THE HEART OF FUWAMIRO"}
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
            <div className="filter-tabs" role="group" aria-label="Filter cats">
              {filters.map((f) => (
                <button
                  key={f}
                  className={
                    filter.toLowerCase() === f.toLowerCase() ? "selected" : ""
                  }
                  onClick={() => setFilter(f)}
                >
                  {f}
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
                aria-label="Search cats"
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
            <Link href="/kittens">View all litters ↗</Link>
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
              Reset filters
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
                  <CatPhoto src={c.portrait} alt={`${c.name}, forever loved`} />
                  <span className="card-label">A NEW CHAPTER</span>
                </Link>
                <div>
                  <Eyebrow>FROM OUR HOME TO THEIRS</Eyebrow>
                  <h2>
                    {c.name}
                    {c.nickname && <small>now {c.nickname} ♡</small>}
                  </h2>
                  <p>{c.story[locale]}</p>
                  <Link href={`/profile?id=${c.id}`} className="text-link">
                    Follow the little story <ArrowUpRight size={18} />
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
            <h3>Still growing. Still connected.</h3>
            <p>
              {locale === "th"
                ? "เป็นครอบครัวของน้องจาก Fuwamiro? ส่งภาพและเรื่องราวมาให้เราเพิ่มในสมุดความทรงจำของน้องได้เสมอ"
                : "Part of a Fuwamiro forever family? Share a photo or a little update for your companion’s memory book."}
            </p>
            <Link href="/contact?topic=alumni" className="button outline">
              Share a little update <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>
      <ContactCTA />
    </>
  );
}
