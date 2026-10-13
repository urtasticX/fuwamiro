"use client";
import Link from "next/link";
import { Cat } from "@/lib/types";
import { useSite } from "./providers";
import { CatPhoto } from "./ui";
export function FamilyTree({ cat }: { cat: Cat }) {
  const { cats, litters, locale } = useSite();
  const father = cats.find((c) => c.id === cat.father_id);
  const mother = cats.find((c) => c.id === cat.mother_id);
  const children = cats.filter(
    (c) => c.father_id === cat.id || c.mother_id === cat.id,
  );
  const related = litters.filter(
    (l) =>
      l.father_id === cat.id ||
      l.mother_id === cat.id ||
      l.id === cat.litter_id,
  );
  function node(c: Cat | undefined, label: string, current = false) {
    return (
      <div className={`tree-node ${current ? "current" : ""}`} key={label}>
        <span className="tree-label">{label}</span>
        {c ? (
          <Link href={`/profile?id=${c.id}`}>
            <div className="tree-portrait">
              <CatPhoto src={c.portrait} alt={c.name} sizes="120px" />
            </div>
            <strong>{c.name}</strong>
            <small>{c.color}</small>
          </Link>
        ) : (
          <div className="tree-unknown">
            <span>♡</span>
            <small>
              {locale === "th" ? "สอบถามข้อมูลสายเลือด" : "Pedigree on request"}
            </small>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="family-tree">
      <div className="tree-row parents">
        {node(father, locale === "th" ? "พ่อ" : "FATHER")}
        {node(mother, locale === "th" ? "แม่" : "MOTHER")}
      </div>
      <div className="tree-stem" />
      {node(cat, locale === "th" ? "สมาชิกคนสำคัญ" : "OUR LITTLE CONNECTION", true)}
      {children.length > 0 && (
        <>
          <div className="tree-stem" />
          <div className="tree-row children">
            {children.map((c) => node(c, (locale === "th" ? "ลูก " : "LITTLE ") + c.name.toUpperCase()))}
          </div>
        </>
      )}
      {related.length > 0 && (
        <div className="related-litters">
          <span className="eyebrow">{locale === "th" ? "ครอกที่เกี่ยวข้อง" : "RELATED LITTERS"}</span>
          {related.map((l) => (
            <Link key={l.id} href={`/kittens?litter=${l.id}`}>
              {l.name} <span>↗</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
