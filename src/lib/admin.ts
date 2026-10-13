import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import type { Cat, JourneyEvent, Litter, SiteContent } from "./types";
import {
  sampleCats,
  sampleEvents,
  sampleLitters,
  defaultContent,
} from "./data";

export type PrivateHealth = {
  id: string;
  notes: string;
  records: string[];
  updated_at: string;
};
export async function loadAdminData() {
  const [cats, events, litters, health, content] = await Promise.all([
    getDocs(collection(db, "cats")),
    getDocs(collection(db, "timeline_events")),
    getDocs(collection(db, "litters")),
    getDocs(collection(db, "private_health")),
    getDoc(doc(db, "site_content", "main")),
  ]);
  return {
    cats: cats.docs.map((d) => ({ ...d.data(), id: d.id }) as Cat),
    events: events.docs.map((d) => ({ ...d.data(), id: d.id }) as JourneyEvent),
    litters: litters.docs.map((d) => ({ ...d.data(), id: d.id }) as Litter),
    health: health.docs.map(
      (d) => ({ ...d.data(), id: d.id }) as PrivateHealth,
    ),
    content: {
      ...defaultContent,
      ...(content.exists() ? content.data() : {}),
    } as SiteContent,
  };
}
export function validateCat(cat: Cat, cats: Cat[], litters: Litter[]) {
  if (!cat.name.trim() || !cat.birthday || !cat.portrait)
    throw new Error("กรุณากรอกชื่อ วันเกิด และรูปประจำตัว");
  if (cat.father_id && cat.father_id === cat.mother_id)
    throw new Error("พ่อและแม่ต้องเป็นคนละตัว");
  const records = [...cats.filter((c) => c.id !== cat.id), cat];
  function visit(id: string, path: Set<string>) {
    if (path.has(id))
      throw new Error("ความสัมพันธ์พ่อแม่วนกลับมาที่แมวตัวเดิม");
    const c = records.find((c) => c.id === id);
    if (!c) return;
    const next = new Set(path).add(id);
    if (c.father_id) visit(c.father_id, next);
    if (c.mother_id) visit(c.mother_id, next);
  }
  visit(cat.id, new Set());
  for (const [id, gender] of [
    [cat.father_id, "Male"],
    [cat.mother_id, "Female"],
  ]) {
    if (!id) continue;
    const parent = records.find((c) => c.id === id);
    if (!parent || parent.gender !== gender)
      throw new Error("กรุณาเลือกพ่อและแม่จากประวัติแมวที่ถูกต้อง");
    if (parent.birthday >= cat.birthday)
      throw new Error("วันเกิดของพ่อแม่ต้องมาก่อนวันเกิดลูก");
  }
  if (cat.litter_id) {
    const litter = litters.find((l) => l.id === cat.litter_id);
    if (!litter) throw new Error("ไม่พบครอกที่เลือก");
    if (
      cat.father_id !== litter.father_id ||
      cat.mother_id !== litter.mother_id
    )
      throw new Error("พ่อแม่ของลูกแมวต้องตรงกับครอกที่เลือก");
  }
}
export async function saveRecord(
  collectionName: "cats" | "litters" | "timeline_events" | "private_health",
  record: Cat | Litter | JourneyEvent | PrivateHealth,
) {
  await setDoc(
    doc(db, collectionName, record.id),
    JSON.parse(JSON.stringify(record)),
  );
}
export async function removeRecord(
  collectionName: "cats" | "litters" | "timeline_events",
  id: string,
  data: Awaited<ReturnType<typeof loadAdminData>>,
) {
  if (collectionName === "cats") {
    if (
      data.cats.some((c) => c.father_id === id || c.mother_id === id) ||
      data.litters.some((l) => l.father_id === id || l.mother_id === id)
    )
      throw new Error(
        "แมวตัวนี้มีครอบครัวเชื่อมอยู่ เปลี่ยนเป็น Retired แทนการลบเพื่อรักษาประวัติ",
      );
    if (
      data.events.some((e) => e.cat_id === id) ||
      data.health.some((h) => h.id === id)
    )
      throw new Error("กรุณาจัดการไทม์ไลน์และเวชระเบียนของแมวตัวนี้ก่อนลบ");
  }
  if (collectionName === "litters" && data.cats.some((c) => c.litter_id === id))
    throw new Error("ครอกนี้ยังมีลูกแมวอยู่ กรุณาย้ายลูกแมวออกก่อนลบ");
  await deleteDoc(doc(db, collectionName, id));
}
export async function saveContent(content: SiteContent) {
  for (const url of [
    content.line_url,
    content.facebook_url,
    content.instagram_url,
  ])
    if (url && !/^https:\/\//i.test(url))
      throw new Error("ลิงก์โซเชียลต้องขึ้นต้นด้วย https://");
  await setDoc(doc(db, "site_content", "main"), content);
}
export async function uploadMedia(
  files: FileList | File[],
  privateFile = false,
): Promise<string[]> {
  const allowed = privateFile
    ? /^(image\/(jpeg|png|webp|avif)|application\/pdf)$/
    : /^(image\/(jpeg|png|webp|avif)|video\/(mp4|webm))$/;
  const list = Array.from(files);
  for (const file of list) {
    if (!allowed.test(file.type)) throw new Error("ไฟล์ชนิดนี้ไม่รองรับ");
    if (file.size >= 20 * 1024 * 1024)
      throw new Error("แต่ละไฟล์ต้องเล็กกว่า 20 MB");
  }
  return Promise.all(
    list.map(async (file) => {
      const path = `${privateFile ? "private" : "public"}/${crypto.randomUUID()}.${file.name.split(".").pop()?.toLowerCase() || "bin"}`;
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, file, { contentType: file.type });
      return privateFile ? path : await getDownloadURL(fileRef);
    }),
  );
}
export async function importSampleData() {
  // Never overwrite real data. The dashboard exposes this only as an explicit action.
  const [cats, events, litters, content] = await Promise.all([
    getDocs(collection(db, "cats")),
    getDocs(collection(db, "timeline_events")),
    getDocs(collection(db, "litters")),
    getDoc(doc(db, "site_content", "main")),
  ]);
  if (!cats.empty || !events.empty || !litters.empty)
    throw new Error(
      "นำเข้าตัวอย่างได้เฉพาะฐานข้อมูลแมวที่ยังว่าง เพื่อป้องกันข้อมูลทับกัน",
    );
  const batch = writeBatch(db);
  sampleCats.forEach((c) => batch.set(doc(db, "cats", c.id), c));
  sampleEvents.forEach((e) => batch.set(doc(db, "timeline_events", e.id), e));
  sampleLitters.forEach((l) => batch.set(doc(db, "litters", l.id), l));
  if (!content.exists())
    batch.set(doc(db, "site_content", "main"), defaultContent);
  await batch.commit();
}
