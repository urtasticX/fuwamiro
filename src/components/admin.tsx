"use client";
import { useEffect, useRef, useState, FormEvent, ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getBlob, ref } from "firebase/storage";
import {
  ArrowUpRight,
  LockKeyhole,
  LogOut,
  Plus,
  Upload,
  Trash2,
  Save,
  Heart,
  RefreshCw,
  Check,
  ImagePlus,
} from "lucide-react";
import { db, getFirebaseAuth, storage } from "@/lib/firebase";
import {
  loadAdminData,
  saveRecord,
  removeRecord,
  uploadMedia,
  saveContent,
  validateCat,
  importSampleData,
  PrivateHealth,
} from "@/lib/admin";
import { Cat, Copy, JourneyEvent, Litter, SiteContent } from "@/lib/types";
import { defaultContent } from "@/lib/data";
import { useSite } from "./providers";
import { Eyebrow } from "./ui";
import { ImageCropper, imageSize, type CropSize } from "./image-cropper";
type Data = Awaited<ReturnType<typeof loadAdminData>>;
type Kind = "cat" | "litter" | "event" | "health" | "content";
const tabKind: Partial<Record<Tab, Kind>> = {
  cats: "cat",
  litters: "litter",
  timeline: "event",
  health: "health",
  content: "content",
};
type Tab = "overview" | "cats" | "litters" | "timeline" | "health" | "content";
const tabs: [Tab, string][] = [
  ["overview", "ภาพรวม"],
  ["cats", "สมาชิกในบ้าน"],
  ["litters", "ครอกลูกแมว"],
  ["timeline", "ไทม์ไลน์ & Alumni"],
  ["health", "เวชระเบียนส่วนตัว"],
  ["content", "เนื้อหา & ติดต่อ"],
];
const copy = (): Copy => ({ th: "", en: "" });
const stageLabel: Record<string, string> = { kitten: "ลูกแมว", breeding: "พ่อพันธุ์/แม่พันธุ์", retired: "วัยเกษียณ", alumni: "ย้ายบ้านแล้ว" };
const availabilityLabel: Record<string, string> = { Available: "พร้อมย้ายบ้าน", Reserved: "มีคนจองแล้ว", "Under Evaluation": "กำลังประเมิน", Sold: "ย้ายบ้านแล้ว", Staying: "อยู่กับเรา" };
function newCat(): Cat {
  return {
    id: crypto.randomUUID(),
    name: "",
    breed: "British Shorthair",
    gender: "Male",
    color: "",
    color_code: "",
    birthday: "",
    stage: "kitten",
    availability: "Under Evaluation",
    portrait: "",
    photos: [],
    personality: copy(),
    story: copy(),
    public_health: copy(),
    pedigree: "",
    pedigree_type: "",
    father_id: null,
    mother_id: null,
    litter_id: null,
    ready_date: null,
    adoption_date: null,
    price: null,
  };
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="form-field">
      {label}
      {children}
    </label>
  );
}
function CopyFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Copy;
  onChange: (v: Copy) => void;
}) {
  return (
    <fieldset className="copy-fields">
      <legend>{label}</legend>
      <Field label="ไทย">
        <textarea
          rows={3}
          value={value.th}
          onChange={(e) => onChange({ ...value, th: e.target.value })}
        />
      </Field>
      <Field label="English">
        <textarea
          rows={3}
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
        />
      </Field>
    </fieldset>
  );
}
function MediaEditor({
  value,
  onChange,
  onError,
  hint,
  multiple = true,
  cropSize,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onError: (s: string) => void;
  hint: string;
  multiple?: boolean;
  cropSize?: CropSize;
}) {
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const cropPromise = useRef<{ resolve: (file: File) => void; reject: () => void } | null>(null);
  function requestCrop(file: File) {
    return new Promise<File>((resolve, reject) => {
      cropPromise.current = { resolve, reject: () => reject(new DOMException("Crop cancelled", "AbortError")) };
      setCropFile(file);
    });
  }
  return (
    <div className="media-editor">
      <div className="admin-media-grid">
        {value.map((url, i) => (
          <div key={`${url}-${i}`}>
            {/\.(mp4|webm)(\?|$)/i.test(url) ? (
              <span>วิดีโอ</span>
            ) : (
              <img src={url} alt={`Photo ${i + 1}`} />
            )}
            <button
              type="button"
              aria-label={`Remove photo ${i + 1}`}
              onClick={() => onChange(value.filter((_, n) => n !== i))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="button outline small upload-label">
        <ImagePlus size={15} />
        {busy ? "กำลังอัปโหลด…" : "เพิ่มรูปภาพ"}
        <input
          type="file"
          className="upload-input"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple={multiple}
          disabled={busy}
          onChange={async (e) => {
            if (!e.target.files) return;
            const files = Array.from(e.target.files);
            e.target.value = "";
            setLocalError("");
            onError("");
            setUploaded(false);
            setBusy(true);
            try {
              const urls = [...value];
              for (const file of files) {
                const dimensions = await imageSize(file);
                const needsCrop = cropSize && (
                  Math.abs(dimensions.width / dimensions.height - cropSize.width / cropSize.height) > 0.01 ||
                  dimensions.width < cropSize.width || dimensions.height < cropSize.height
                );
                const prepared = needsCrop ? await requestCrop(file) : file;
                urls.push(...await uploadMedia([prepared]));
                onChange([...urls]);
              }
              setUploaded(urls.length > value.length);
            } catch (error) {
              if (!(error instanceof DOMException && error.name === "AbortError")) {
                setLocalError(message(error));
                onError(message(error));
              }
            } finally {
              setBusy(false);
            }
          }}
        />
      </label>
      <small className="upload-hint">{hint} · JPG, PNG, WebP หรือ AVIF · ไม่เกิน 20 MB ต่อไฟล์</small>
      {busy && <p className="upload-feedback" role="status">{cropFile ? "กำลังครอปรูป…" : "กำลังอัปโหลดรูป กรุณารอสักครู่…"}</p>}
      {uploaded && !busy && <p className="upload-feedback success" role="status">อัปโหลดแล้ว กดบันทึกการเปลี่ยนแปลงเพื่อเผยแพร่</p>}
      {localError && <p className="upload-feedback error" role="alert">{localError}</p>}
      {cropFile && cropSize && <ImageCropper
        file={cropFile}
        size={cropSize}
        onConfirm={(file) => { cropPromise.current?.resolve(file); cropPromise.current = null; setCropFile(null); }}
        onCancel={() => { cropPromise.current?.reject(); cropPromise.current = null; setCropFile(null); }}
      />}
    </div>
  );
}
function message(error: unknown) {
  const e = error as { code?: string; message?: string };
  const messages: Record<string, string> = {
    "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    "auth/operation-not-allowed":
      "กรุณาเปิด Email/Password ใน Firebase Authentication ก่อน",
    "auth/configuration-not-found":
      "โปรเจกต์ยังไม่ได้เปิด Firebase Authentication",
    "auth/too-many-requests": "ลองใหม่ในอีกสักครู่ เนื่องจากมีคำขอมากเกินไป",
    "permission-denied":
      "ยังไม่มีสิทธิ์เข้าถึงข้อมูล ตรวจสอบบัญชีแอดมินและ Firebase Rules",
    "storage/unauthorized": "บัญชีนี้ยังไม่มีสิทธิ์อัปโหลดไฟล์",
    "storage/unknown": "อัปโหลดไม่สำเร็จ ตรวจสอบว่าเปิด Firebase Storage แล้ว",
  };
  return messages[e.code || ""] || e.message || "เกิดข้อผิดพลาด กรุณาลองใหม่";
}
export function Admin() {
  const { refresh } = useSite();
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<Data>({
    cats: [],
    events: [],
    litters: [],
    health: [],
    content: defaultContent,
  });
  const [loaded, setLoaded] = useState(false);
  const [cat, setCat] = useState<Cat | null>(null);
  const [litter, setLitter] = useState<Litter | null>(null);
  const [event, setEvent] = useState<JourneyEvent | null>(null);
  const [health, setHealth] = useState<PrivateHealth | null>(null);
  const [content, setContent] = useState(defaultContent);
  const [search, setSearch] = useState("");
  const [timelineCat, setTimelineCat] = useState("all");
  // JSON snapshot of each editor when it was opened or last saved, to detect unsaved edits.
  const baseline = useRef<Partial<Record<Kind, string>>>({});
  const editing: Record<Kind, unknown> = {
    cat,
    litter,
    event,
    health,
    content,
  };
  const setters = {
    cat: setCat,
    litter: setLitter,
    event: setEvent,
    health: setHealth,
    content: setContent,
  } as unknown as Record<Kind, (v: unknown) => void>;
  const isDirty = (k: Kind) =>
    editing[k] != null && JSON.stringify(editing[k]) !== baseline.current[k];
  const anyDirty = (Object.keys(editing) as Kind[]).some(isDirty);
  const currentKind = tabKind[tab];
  const currentDirty = currentKind ? isDirty(currentKind) : false;
  const matches = (...text: (string | undefined)[]) =>
    text.some((t) => t?.toLowerCase().includes(search.trim().toLowerCase()));
  const sortedCats = [...data.cats].sort((a, b) => a.name.localeCompare(b.name, "th"));
  const timelineGroups = sortedCats
    .filter((c) => timelineCat === "all" || timelineCat === c.id)
    .map((c) => ({
      cat: c,
      events: data.events
        .filter((ev) => ev.cat_id === c.id && matches(c.name, c.nickname, ev.title.th, ev.title.en))
        .sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .filter((group) => group.events.length > 0 || (timelineCat !== "all" && !search.trim()));
  function confirmDiscard(kinds: Kind[]) {
    return (
      !kinds.some(isDirty) ||
      window.confirm(
        "มีการแก้ไขที่ยังไม่ได้บันทึก ต้องการทิ้งการแก้ไขนี้ใช่ไหม?",
      )
    );
  }
  function open<T>(kind: Kind, value: T) {
    if (!confirmDiscard([kind])) return;
    baseline.current[kind] = JSON.stringify(value);
    setters[kind](value);
    setError("");
    setNotice("");
    // On phones the editor sits below the list, so bring it into view.
    if (window.matchMedia("(max-width: 700px)").matches)
      requestAnimationFrame(() =>
        document
          .querySelector(".admin-editor")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
  }
  function revert(kind: Kind) {
    const saved = baseline.current[kind];
    if (saved) setters[kind](JSON.parse(saved));
  }
  function addEvent(catId: string) {
    open("event", {
      id: crypto.randomUUID(),
      cat_id: catId,
      date: new Date().toISOString().slice(0, 10),
      title: copy(),
      description: copy(),
      photos: [],
      video_url: null,
    });
  }
  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);
  async function reload() {
    const next = await loadAdminData();
    setData(next);
    // Keep unsaved site-content edits when another section saves and reloads.
    if (baseline.current.content === undefined || !isDirty("content")) {
      setContent(next.content);
      baseline.current.content = JSON.stringify(next.content);
    }
    setLoaded(true);
    await refresh();
  }
  useEffect(
    () =>
      onAuthStateChanged(getFirebaseAuth(), async (next) => {
        setChecking(true);
        setUser(next);
        setAuthorized(false);
        setLoaded(false);
        setCat(null);
        setLitter(null);
        setEvent(null);
        setHealth(null);
        setData({
          cats: [],
          events: [],
          litters: [],
          health: [],
          content: defaultContent,
        });
        setContent(defaultContent);
        baseline.current = {};
        if (next) {
          try {
            const token = await next.getIdTokenResult(true);
            let admin = token.claims.admin === true;
            if (!admin) {
              const access = await getDoc(doc(db, "admins", next.uid));
              admin = access.exists() && access.data().enabled === true;
            }
            setAuthorized(admin);
            if (admin) await reload();
            else
              setError(
                "บัญชีนี้ยังไม่ได้รับสิทธิ์แอดมิน กรุณาเพิ่มสิทธิ์ใน Firebase ก่อน",
              );
          } catch (e) {
            setError(message(e));
          }
        }
        setChecking(false);
      }),
    [],
  );
  async function action(fn: () => Promise<void>, success = "บันทึกเรียบร้อย") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      setNotice(success);
    } catch (e) {
      setError(message(e));
    } finally {
      setBusy(false);
    }
  }
  async function save(e: FormEvent, kind: Kind, fn: () => Promise<void>) {
    e.preventDefault();
    const saved = JSON.stringify(editing[kind]);
    await action(async () => {
      await fn();
      baseline.current[kind] = saved;
      await reload();
    });
  }
  const alert = (
    <>
      {error && (
        <div className="admin-alert error" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="admin-alert" role="status">
          <Check size={16} />
          {notice}
        </div>
      )}
    </>
  );
  // Floating feedback so it stays visible after saving at the bottom of a long form.
  const toasts = (
    <div className="admin-toasts" aria-live="polite">
      {error && (
        <div className="admin-alert error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            aria-label="ปิดข้อความ"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}
      {notice && (
        <div className="admin-alert" role="status">
          <Check size={16} />
          {notice}
        </div>
      )}
    </div>
  );
  const searchBox = (placeholder: string) => (
    <input
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
  if (checking)
    return (
      <section className="admin-login container">
        <p role="status">กำลังตรวจสอบบัญชี…</p>
      </section>
    );
  if (!user || !authorized)
    return (
      <section className="admin-login container">
        <div className="admin-login-card">
          <span className="admin-lock">
            <LockKeyhole size={25} />
          </span>
          <Eyebrow>พื้นที่ดูแลบ้านเล็ก ๆ ของเรา</Eyebrow>
          <h1>
            <em>จัดการเว็บไซต์</em>
          </h1>
          <p>เข้าสู่ระบบด้วยบัญชีผู้ดูแล Fuwamiro</p>
          {alert}
          {user ? (
            <>
              <p className="admin-uid">UID: {user.uid}</p>
              <button
                className="button outline"
                onClick={() => signOut(getFirebaseAuth())}
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void action(async () => {
                  await signInWithEmailAndPassword(
                    getFirebaseAuth(),
                    email,
                    password,
                  );
                }, "เข้าสู่ระบบแล้ว");
              }}
            >
              <Field label="อีเมล">
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="รหัสผ่าน">
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <button className="button" disabled={busy}>
                {busy ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
                <ArrowUpRight size={17} />
              </button>
              <button
                type="button"
                className="admin-reset"
                disabled={busy}
                onClick={() => {
                  if (!email) {
                    setError("กรุณากรอกอีเมลก่อน");
                    return;
                  }
                  void action(
                    () => sendPasswordResetEmail(getFirebaseAuth(), email),
                    "หากมีบัญชีนี้ในระบบ คุณจะได้รับอีเมลตั้งรหัสผ่านใหม่",
                  );
                }}
              >
                ลืมรหัสผ่าน?
              </button>
            </form>
          )}
          <p className="admin-login-note">
            เฉพาะผู้ดูแลที่ได้รับสิทธิ์เท่านั้น
          </p>
        </div>
      </section>
    );
  const catSelect = (
    value: string | null | undefined,
    onChange: (v: string) => void,
    gender?: string,
  ) => (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">— ไม่ระบุ —</option>
      {data.cats
        .filter((c) => (!gender || c.gender === gender) && c.id !== cat?.id)
        .map((c) => (
          <option value={c.id} key={c.id}>
            {c.name}
          </option>
        ))}
    </select>
  );
  const saveButton = (
    <span className="admin-save-group">
      <button className="button" disabled={busy || !loaded}>
        <Save size={16} />
        {busy ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}
      </button>
      {currentDirty && currentKind && (
        <>
          <span className="unsaved-hint">ยังไม่ได้บันทึก</span>
          <button
            type="button"
            className="admin-revert"
            disabled={busy}
            onClick={() => revert(currentKind)}
          >
            ยกเลิกการแก้ไข
          </button>
        </>
      )}
    </span>
  );
  return (
    <section className="container admin-page">
      <div className="admin-heading">
        <div>
          <Eyebrow>FUWAMIRO · สำหรับผู้ดูแล</Eyebrow>
          <h1>
            <em>บ้านของเรา</em>
          </h1>
          <p>เข้าสู่ระบบในฐานะแอดมิน · {user.email}</p>
        </div>
        <div className="admin-heading-actions">
          <button
            className="button outline small"
            disabled={busy}
            onClick={() => action(reload, "อัปเดตข้อมูลแล้ว")}
          >
            <RefreshCw size={14} />
            โหลดใหม่
          </button>
          <button
            className="button outline small"
            onClick={() => {
              if (confirmDiscard(Object.keys(editing) as Kind[]))
                void signOut(getFirebaseAuth());
            }}
          >
            <LogOut size={14} />
            ออกจากระบบ
          </button>
        </div>
      </div>
      <nav className="admin-tabs" aria-label="หัวข้อจัดการเว็บไซต์">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              setSearch("");
              setError("");
              setNotice("");
            }}
            className={tab === id ? "selected" : ""}
          >
            {label}
            {tabKind[id] && isDirty(tabKind[id]) && (
              <span className="unsaved-dot" title="ยังไม่ได้บันทึก" />
            )}
          </button>
        ))}
      </nav>
      {toasts}
      {!loaded ? (
        <div className="empty-state">
          <h3>ยังโหลดข้อมูลไม่สำเร็จ</h3>
          <p>ตรวจสอบ Firebase Rules และลองโหลดใหม่</p>
        </div>
      ) : (
        <>
          {tab === "overview" && (
            <>
              <div className="admin-stats">
                {[
                  ["สมาชิกทั้งหมด", data.cats.length],
                  [
                    "กำลังหาบ้าน",
                    data.cats.filter(
                      (c) =>
                        c.stage === "kitten" && c.availability === "Available",
                    ).length,
                  ],
                  [
                    "สมาชิกที่ย้ายบ้าน",
                    data.cats.filter((c) => c.stage === "alumni").length,
                  ],
                  ["ความทรงจำ", data.events.length],
                ].map(([label, n]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{n}</strong>
                  </div>
                ))}
              </div>
              <div className="admin-welcome">
                <Heart size={30} />
                <h2>ใส่ใจทุกรายละเอียด</h2>
                <p>
                  จัดการข้อมูลแมวด้วยรหัสเดิมตลอดทุกช่วงชีวิต
                  เลือกเมนูด้านบนเพื่อเพิ่มสมาชิก ครอก หรือความทรงจำใหม่
                </p>
                <button
                  className="button"
                  onClick={() => {
                    setTab("cats");
                    open("cat", newCat());
                  }}
                >
                  <Plus size={16} />
                  เพิ่มสมาชิก
                </button>
                {data.cats.length === 0 && (
                  <button
                    className="button outline"
                    disabled={busy}
                    onClick={() => {
                      if (
                        window.confirm(
                          "เพิ่มข้อมูลและภาพตัวอย่างสำหรับทดลองเว็บไซต์? ข้อมูลเหล่านี้เป็นตัวอย่าง ไม่ใช่แมวจริงของฟาร์ม",
                        )
                      )
                        void action(async () => {
                          await importSampleData();
                          await reload();
                        }, "เพิ่มข้อมูลตัวอย่างแล้ว");
                    }}
                  >
                    เพิ่มข้อมูลตัวอย่าง
                  </button>
                )}
              </div>
            </>
          )}
          {tab === "cats" && (
            <div className="admin-split">
              <aside className="admin-records">
                <div className="admin-records-heading">
                  <h3>สมาชิกในบ้าน</h3>
                  <button
                    className="icon-button"
                    aria-label="เพิ่มแมว"
                    onClick={() => open("cat", newCat())}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {searchBox("ค้นหาชื่อแมว…")}
                {data.cats
                  .filter((c) => matches(c.name, c.nickname))
                  .map((c) => (
                    <button
                      key={c.id}
                      className={`admin-record ${cat?.id === c.id ? "selected" : ""}`}
                      onClick={() => open("cat", structuredClone(c))}
                    >
                      <img src={c.portrait} alt="" />
                      <span>
                        <strong>{c.name}</strong>
                        <small>
                          {stageLabel[c.stage]} · {availabilityLabel[c.availability]}
                        </small>
                      </span>
                    </button>
                  ))}
              </aside>
              {cat ? (
                <form
                  className="admin-editor"
                  onSubmit={(e) =>
                    save(e, "cat", async () => {
                      validateCat(cat, data.cats, data.litters);
                      await saveRecord("cats", cat);
                    })
                  }
                >
                  <div className="admin-editor-heading">
                    <h2>{cat.name || "สมาชิกใหม่"}</h2>
                    <span className="record-id">ID: {cat.id}</span>
                  </div>
                  <div className="form-grid">
                    <Field label="ชื่อ">
                      <input
                        required
                        value={cat.name}
                        onChange={(e) =>
                          setCat({ ...cat, name: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="ชื่อใหม่ (เมื่อย้ายบ้าน)">
                      <input
                        value={cat.nickname || ""}
                        onChange={(e) =>
                          setCat({ ...cat, nickname: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="สายพันธุ์">
                      <input
                        required
                        value={cat.breed}
                        onChange={(e) =>
                          setCat({ ...cat, breed: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="เพศ">
                      <select
                        value={cat.gender}
                        onChange={(e) =>
                          setCat({
                            ...cat,
                            gender: e.target.value as Cat["gender"],
                          })
                        }
                      >
                        <option value="Male">ผู้</option>
                        <option value="Female">เมีย</option>
                      </select>
                    </Field>
                    <Field label="สีขน">
                      <input
                        required
                        value={cat.color}
                        onChange={(e) =>
                          setCat({ ...cat, color: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="รหัสสี">
                      <input
                        value={cat.color_code}
                        onChange={(e) =>
                          setCat({ ...cat, color_code: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="วันเกิด">
                      <input
                        type="date"
                        required
                        value={cat.birthday}
                        onChange={(e) =>
                          setCat({ ...cat, birthday: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="ช่วงชีวิต">
                      <select
                        value={cat.stage}
                        onChange={(e) =>
                          setCat({
                            ...cat,
                            stage: e.target.value as Cat["stage"],
                          })
                        }
                      >
                        <option value="kitten">ลูกแมว</option>
                        <option value="breeding">พ่อพันธุ์/แม่พันธุ์</option>
                        <option value="retired">วัยเกษียณ</option>
                        <option value="alumni">ย้ายบ้านแล้ว</option>
                      </select>
                    </Field>
                    <Field label="สถานะ">
                      <select
                        value={cat.availability}
                        onChange={(e) =>
                          setCat({
                            ...cat,
                            availability: e.target.value as Cat["availability"],
                          })
                        }
                      >
                        {[
                          "Available",
                          "Reserved",
                          "Under Evaluation",
                          "Sold",
                          "Staying",
                        ].map((s) => (
                          <option key={s} value={s}>{availabilityLabel[s]}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="ครอก">
                      <select
                        value={cat.litter_id || ""}
                        onChange={(e) => {
                          const l = data.litters.find(
                            (l) => l.id === e.target.value,
                          );
                          setCat({
                            ...cat,
                            litter_id: l?.id || null,
                            ...(l
                              ? {
                                  father_id: l.father_id,
                                  mother_id: l.mother_id,
                                  birthday: l.birthday,
                                }
                              : {}),
                          });
                        }}
                      >
                        <option value="">— ไม่ระบุ —</option>
                        {data.litters.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="พ่อ">
                      {catSelect(
                        cat.father_id,
                        (v) => setCat({ ...cat, father_id: v || null }),
                        "Male",
                      )}
                    </Field>
                    <Field label="แม่">
                      {catSelect(
                        cat.mother_id,
                        (v) => setCat({ ...cat, mother_id: v || null }),
                        "Female",
                      )}
                    </Field>
                    <Field label="พร้อมย้ายบ้าน">
                      <input
                        type="date"
                        value={cat.ready_date || ""}
                        onChange={(e) =>
                          setCat({ ...cat, ready_date: e.target.value || null })
                        }
                      />
                    </Field>
                    <Field label="วันที่ย้ายบ้าน">
                      <input
                        type="date"
                        value={cat.adoption_date || ""}
                        onChange={(e) =>
                          setCat({
                            ...cat,
                            adoption_date: e.target.value || null,
                          })
                        }
                      />
                    </Field>
                    <Field label="ราคา (ไม่บังคับ)">
                      <input
                        type="number"
                        min="0"
                        value={cat.price ?? ""}
                        onChange={(e) =>
                          setCat({
                            ...cat,
                            price:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          })
                        }
                      />
                    </Field>
                    <Field label="ประเภทใบเพ็ด (พิมพ์เอง เช่น SCFC / BCT)">
                      <input
                        value={cat.pedigree_type || ""}
                        placeholder="SCFC / BCT"
                        onChange={(e) =>
                          setCat({ ...cat, pedigree_type: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="รายละเอียดใบเพ็ดเพิ่มเติม">
                      <input
                        value={cat.pedigree}
                        onChange={(e) =>
                          setCat({ ...cat, pedigree: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <fieldset>
                    <legend>รูปประจำตัว</legend>
                    <MediaEditor
                      value={cat.portrait ? [cat.portrait] : []}
                      onChange={(v) =>
                        setCat({ ...cat, portrait: v.at(-1) || "" })
                      }
                      onError={setError}
                      hint="ขนาดแนะนำ 1200 × 1500 พิกเซล (แนวตั้ง 4:5)"
                      multiple={false}
                      cropSize={{ width: 1200, height: 1500 }}
                    />
                  </fieldset>
                  <fieldset>
                    <legend>แกลเลอรี</legend>
                    <MediaEditor
                      value={cat.photos}
                      onChange={(v) => setCat({ ...cat, photos: v })}
                      onError={setError}
                      hint="ขนาดแนะนำ 1600 × 1200 พิกเซล (แนวนอน 4:3)"
                      cropSize={{ width: 1600, height: 1200 }}
                    />
                  </fieldset>
                  <CopyFields
                    label="บุคลิก"
                    value={cat.personality}
                    onChange={(v) => setCat({ ...cat, personality: v })}
                  />
                  <CopyFields
                    label="เรื่องราว"
                    value={cat.story}
                    onChange={(v) => setCat({ ...cat, story: v })}
                  />
                  <CopyFields
                    label="ข้อมูลสุขภาพที่เผยแพร่ได้"
                    value={cat.public_health}
                    onChange={(v) => setCat({ ...cat, public_health: v })}
                  />
                  <div className="admin-form-actions">
                    {saveButton}
                    {data.cats.some((c) => c.id === cat.id) && (
                      <button
                        type="button"
                        className="danger-button"
                        disabled={busy}
                        onClick={() => {
                          if (window.confirm(`ลบประวัติ ${cat.name}?`))
                            void action(async () => {
                              await removeRecord("cats", cat.id, data);
                              setCat(null);
                              await reload();
                            }, "ลบข้อมูลแล้ว");
                        }}
                      >
                        <Trash2 size={15} />
                        ลบประวัติ
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="admin-placeholder">
                  <Heart />
                  <p>เลือกสมาชิก หรือกด + เพื่อเพิ่มแมวตัวใหม่</p>
                </div>
              )}
            </div>
          )}
          {tab === "litters" && (
            <div className="admin-split">
              <aside className="admin-records">
                <div className="admin-records-heading">
                  <h3>ครอกลูกแมว</h3>
                  <button
                    className="icon-button"
                    aria-label="Add litter"
                    onClick={() =>
                      open("litter", {
                        id: crypto.randomUUID(),
                        name: "",
                        father_id: "",
                        mother_id: "",
                        birthday: "",
                      })
                    }
                  >
                    <Plus />
                  </button>
                </div>
                {searchBox("ค้นหาครอก…")}
                {data.litters.filter((l) => matches(l.name)).map((l) => (
                  <button
                    key={l.id}
                    className={`admin-record ${litter?.id === l.id ? "selected" : ""}`}
                    onClick={() => open("litter", { ...l })}
                  >
                    <span>
                      <strong>{l.name}</strong>
                      <small>
                        {l.birthday} ·{" "}
                        {data.cats.filter((c) => c.litter_id === l.id).length}{" "}
                        ตัว
                      </small>
                    </span>
                  </button>
                ))}
              </aside>
              {litter ? (
                <form
                  className="admin-editor"
                  onSubmit={(e) =>
                    save(e, "litter", async () => {
                      if (
                        !litter.father_id ||
                        !litter.mother_id ||
                        litter.father_id === litter.mother_id
                      )
                        throw new Error("กรุณาเลือกพ่อและแม่ให้ครบ");
                      for (const id of [litter.father_id, litter.mother_id]) {
                        const parent = data.cats.find((c) => c.id === id);
                        if (!parent || parent.birthday >= litter.birthday)
                          throw new Error("ตรวจสอบวันเกิดและข้อมูลพ่อแม่");
                      }
                      const linked = data.cats.filter(
                        (c) => c.litter_id === litter.id,
                      );
                      if (
                        linked.some(
                          (c) =>
                            c.father_id !== litter.father_id ||
                            c.mother_id !== litter.mother_id,
                        )
                      )
                        throw new Error(
                          "ครอกมีลูกแมวแล้ว กรุณาจัดการข้อมูลลูกแมวก่อนเปลี่ยนพ่อแม่",
                        );
                      await saveRecord("litters", litter);
                    })
                  }
                >
                  <h2>{litter.name || "ครอกใหม่"}</h2>
                  <Field label="ชื่อครอก">
                    <input
                      required
                      value={litter.name}
                      onChange={(e) =>
                        setLitter({ ...litter, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="วันเกิด">
                    <input
                      type="date"
                      required
                      value={litter.birthday}
                      onChange={(e) =>
                        setLitter({ ...litter, birthday: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="พ่อ">
                    <select
                      required
                      value={litter.father_id}
                      onChange={(e) =>
                        setLitter({ ...litter, father_id: e.target.value })
                      }
                    >
                      <option value="">เลือกพ่อ</option>
                      {data.cats
                        .filter((c) => c.gender === "Male")
                        .map((c) => (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </Field>
                  <Field label="แม่">
                    <select
                      required
                      value={litter.mother_id}
                      onChange={(e) =>
                        setLitter({ ...litter, mother_id: e.target.value })
                      }
                    >
                      <option value="">เลือกแม่</option>
                      {data.cats
                        .filter((c) => c.gender === "Female")
                        .map((c) => (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </Field>
                  <p className="admin-help">
                    เพิ่มลูกแมวในเมนูสมาชิก แล้วเลือกครอกนี้
                    พ่อแม่และวันเกิดจะถูกเติมให้
                  </p>
                  <div className="admin-form-actions">
                    {saveButton}
                    {data.litters.some((l) => l.id === litter.id) && (
                      <button
                        type="button"
                        className="danger-button"
                        disabled={busy}
                        onClick={() => {
                          if (window.confirm("ลบครอกนี้?"))
                            void action(async () => {
                              await removeRecord("litters", litter.id, data);
                              setLitter(null);
                              await reload();
                            }, "ลบครอกแล้ว");
                        }}
                      >
                        <Trash2 size={15} />
                        ลบครอก
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="admin-placeholder">
                  <p>เลือกครอกหรือสร้างครอกใหม่</p>
                </div>
              )}
            </div>
          )}
          {tab === "timeline" && (
            <div className="admin-split">
              <aside className="admin-records">
                <div className="admin-records-heading">
                  <h3>ความทรงจำ</h3>
                  <button
                    className="icon-button"
                    aria-label="เพิ่มความทรงจำ"
                    onClick={() => addEvent(timelineCat === "all" ? sortedCats[0]?.id || "" : timelineCat)}
                  >
                    <Plus />
                  </button>
                </div>
                <label className="admin-memory-filter">
                  แสดงความทรงจำของ
                  <select value={timelineCat} onChange={(e) => setTimelineCat(e.target.value)}>
                    <option value="all">สมาชิกทุกตัว ({data.events.length})</option>
                    {sortedCats.map((c) => (
                      <option value={c.id} key={c.id}>
                        {c.name} ({data.events.filter((ev) => ev.cat_id === c.id).length})
                      </option>
                    ))}
                  </select>
                </label>
                {searchBox("ค้นหาเรื่องราวหรือชื่อแมว…")}
                {timelineGroups.length === 0 && <p className="admin-memory-empty">ไม่พบความทรงจำในรายการนี้</p>}
                {timelineGroups.map(({ cat: memoryCat, events: memories }) => (
                  <div className="admin-memory-group" key={memoryCat.id}>
                    <div className="admin-memory-heading">
                      <img src={memoryCat.portrait} alt="" />
                      <span><strong>{memoryCat.name}</strong><small>{memories.length} ความทรงจำ</small></span>
                      <button type="button" className="icon-button" aria-label={`เพิ่มความทรงจำให้ ${memoryCat.name}`} onClick={() => addEvent(memoryCat.id)}><Plus size={16} /></button>
                    </div>
                    {memories.length === 0 && <p className="admin-memory-empty">ยังไม่มีความทรงจำของน้อง</p>}
                    {memories.map((ev) => (
                      <button
                        key={ev.id}
                        className={`admin-record admin-memory-record ${event?.id === ev.id ? "selected" : ""}`}
                        onClick={() => open("event", structuredClone(ev))}
                      >
                        <span>
                          <strong>{ev.title.th || ev.title.en}</strong>
                          <small>{ev.date}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </aside>
              {event ? (
                <form
                  className="admin-editor"
                  onSubmit={(e) =>
                    save(e, "event", async () => {
                      if (
                        !data.cats.some((c) => c.id === event.cat_id) ||
                        !event.date ||
                        (!event.title.th && !event.title.en)
                      )
                        throw new Error(
                          "กรุณาเลือกแมว วันที่ และชื่อเหตุการณ์",
                        );
                      if (
                        event.video_url &&
                        !/^https:\/\//i.test(event.video_url)
                      )
                        throw new Error("ลิงก์วิดีโอต้องขึ้นต้นด้วย https://");
                      await saveRecord("timeline_events", event);
                    })
                  }
                >
                  <h2>บันทึกเรื่องราว</h2>
                  <Field label="สมาชิก">
                    <select
                      required
                      value={event.cat_id}
                      onChange={(e) =>
                        setEvent({ ...event, cat_id: e.target.value })
                      }
                    >
                      <option value="">เลือกสมาชิก</option>
                      {data.cats.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                          {c.stage === "alumni" ? " · Alumni" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="วันที่">
                    <input
                      required
                      type="date"
                      value={event.date}
                      onChange={(e) =>
                        setEvent({ ...event, date: e.target.value })
                      }
                    />
                  </Field>
                  <CopyFields
                    label="ชื่อเหตุการณ์"
                    value={event.title}
                    onChange={(v) => setEvent({ ...event, title: v })}
                  />
                  <CopyFields
                    label="เรื่องราว"
                    value={event.description}
                    onChange={(v) => setEvent({ ...event, description: v })}
                  />
                  <fieldset>
                    <legend>รูปความทรงจำ</legend>
                    <MediaEditor
                      value={event.photos}
                      onChange={(v) => setEvent({ ...event, photos: v })}
                      onError={setError}
                      hint="ขนาดแนะนำ 1600 × 1200 พิกเซล (แนวนอน 4:3)"
                      cropSize={{ width: 1600, height: 1200 }}
                    />
                  </fieldset>
                  <Field label="ลิงก์วิดีโอ MP4 / WebM (ไม่บังคับ)">
                    <input
                      type="url"
                      value={event.video_url || ""}
                      onChange={(e) =>
                        setEvent({
                          ...event,
                          video_url: e.target.value || null,
                        })
                      }
                    />
                  </Field>
                  <label className="button outline small upload-label">
                    <Upload size={15} />
                    อัปโหลดวิดีโอ
                    <input
                      hidden
                      type="file"
                      accept="video/mp4,video/webm"
                      disabled={busy}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files)
                          void action(
                            async () =>
                              setEvent({
                                ...event,
                                video_url: (await uploadMedia(files))[0],
                              }),
                            "อัปโหลดแล้ว กดบันทึกเพื่อเผยแพร่",
                          );
                      }}
                    />
                  </label>
                  <p className="admin-help">
                    ใช้ฟอร์มเดียวกันเพื่อเพิ่มภาพและข่าวจากครอบครัวใหม่ในหน้า
                    Alumni
                  </p>
                  <div className="admin-form-actions">
                    {saveButton}
                    {data.events.some((ev) => ev.id === event.id) && (
                      <button
                        type="button"
                        className="danger-button"
                        disabled={busy}
                        onClick={() => {
                          if (window.confirm("ลบความทรงจำนี้?"))
                            void action(async () => {
                              await removeRecord(
                                "timeline_events",
                                event.id,
                                data,
                              );
                              setEvent(null);
                              await reload();
                            }, "ลบเหตุการณ์แล้ว");
                        }}
                      >
                        <Trash2 size={15} />
                        ลบเหตุการณ์
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="admin-placeholder">
                  <p>เลือกความทรงจำ หรือเพิ่มเรื่องราวใหม่</p>
                </div>
              )}
            </div>
          )}
          {tab === "health" && (
            <div className="admin-split">
              <aside className="admin-records">
                <h3>ข้อมูลส่วนตัว</h3>
                {searchBox("ค้นหาชื่อแมว…")}
                {data.cats.filter((c) => matches(c.name, c.nickname)).map((c) => (
                  <button
                    key={c.id}
                    className={`admin-record ${health?.id === c.id ? "selected" : ""}`}
                    onClick={() =>
                      open(
                        "health",
                        structuredClone(
                          data.health.find((h) => h.id === c.id) || {
                            id: c.id,
                            notes: "",
                            records: [],
                            updated_at: "",
                          },
                        ),
                      )
                    }
                  >
                    <img src={c.portrait} alt="" />
                    <span>
                      <strong>{c.name}</strong>
                      <small>
                        {data.health.some((h) => h.id === c.id)
                          ? "มีเวชระเบียน"
                          : "ยังไม่มีเวชระเบียน"}
                      </small>
                    </span>
                  </button>
                ))}
              </aside>
              {health ? (
                <form
                  className="admin-editor"
                  onSubmit={(e) =>
                    save(e, "health", () =>
                      saveRecord("private_health", {
                        ...health,
                        updated_at: new Date().toISOString(),
                      }),
                    )
                  }
                >
                  <h2>
                    {data.cats.find((c) => c.id === health.id)?.name} · Health
                  </h2>
                  <div className="admin-alert">
                    <LockKeyhole size={18} />
                    ข้อมูลส่วนตัว ผู้เยี่ยมชมทั่วไปมองไม่เห็นเวชระเบียนนี้
                  </div>
                  <Field label="บันทึกส่วนตัว">
                    <textarea
                      rows={10}
                      value={health.notes}
                      onChange={(e) =>
                        setHealth({ ...health, notes: e.target.value })
                      }
                    />
                  </Field>
                  <div className="private-files">
                    {health.records.map((path, i) => (
                      <div key={path}>
                        <button
                          type="button"
                          onClick={() =>
                            action(async () => {
                              const blob = await getBlob(ref(storage, path));
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `health-record-${i + 1}.${path.split(".").pop()}`;
                              a.click();
                              setTimeout(() => URL.revokeObjectURL(url), 1000);
                            }, "ดาวน์โหลดไฟล์แล้ว")
                          }
                        >
                          เอกสาร {i + 1} ↗
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove record ${i + 1}`}
                          onClick={() =>
                            setHealth({
                              ...health,
                              records: health.records.filter((p) => p !== path),
                            })
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="button outline small upload-label">
                    <Upload size={15} />
                    เพิ่มเอกสาร (รูป / PDF)
                    <input
                      hidden
                      multiple
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,application/pdf"
                      disabled={busy}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files)
                          void action(
                            async () =>
                              setHealth({
                                ...health,
                                records: [
                                  ...health.records,
                                  ...(await uploadMedia(files, true)),
                                ],
                              }),
                            "อัปโหลดแล้ว กดบันทึกเพื่อเก็บเอกสาร",
                          );
                      }}
                    />
                  </label>
                  <div className="admin-form-actions">{saveButton}</div>
                </form>
              ) : (
                <div className="admin-placeholder">
                  <LockKeyhole />
                  <p>เลือกสมาชิกเพื่อดูบันทึกส่วนตัว</p>
                </div>
              )}
            </div>
          )}
          {tab === "content" && (
            <form
              className="admin-editor content-editor"
              onSubmit={(e) => save(e, "content", () => saveContent(content))}
            >
              <h2>เนื้อหาบนเว็บไซต์</h2>
              <fieldset>
                <legend>ไอคอนเว็บไซต์</legend>
                <MediaEditor
                  value={content.icon_url ? [content.icon_url] : []}
                  onChange={(v) => setContent({ ...content, icon_url: v.at(-1) || "" })}
                  onError={setError}
                  hint="ขนาดแนะนำ 512 × 512 พิกเซล (สี่เหลี่ยมจัตุรัส) ใช้เป็นโลโก้และไอคอนแท็บ"
                  multiple={false}
                  cropSize={{ width: 512, height: 512 }}
                />
              </fieldset>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={content.sample_mode === true}
                  onChange={(e) =>
                    setContent({ ...content, sample_mode: e.target.checked })
                  }
                />
                แสดงข้อความว่าเป็นภาพและข้อมูลตัวอย่าง
              </label>
              <CopyFields
                label="คำแนะนำบ้าน Fuwamiro"
                value={content.intro}
                onChange={(v) => setContent({ ...content, intro: v })}
              />
              <CopyFields
                label="แนวทางการเลี้ยงดู"
                value={content.philosophy}
                onChange={(v) => setContent({ ...content, philosophy: v })}
              />
              <CopyFields
                label="แนวทางดูแลสุขภาพ"
                value={content.health}
                onChange={(v) => setContent({ ...content, health: v })}
              />
              <CopyFields
                label="สถานที่ / การนัดหมาย"
                value={content.location}
                onChange={(v) => setContent({ ...content, location: v })}
              />
              <div className="form-grid">
                {(
                  [
                    "line_url",
                    "facebook_url",
                    "instagram_url",
                    "email",
                  ] as const
                ).map((key) => (
                  <Field
                    key={key}
                    label={
                      {
                        line_url: "LINE URL",
                        facebook_url: "Facebook URL",
                        instagram_url: "Instagram URL",
                        email: "อีเมลติดต่อ",
                      }[key]
                    }
                  >
                    <input
                      type={key === "email" ? "email" : "url"}
                      value={content[key]}
                      onChange={(e) =>
                        setContent({ ...content, [key]: e.target.value })
                      }
                    />
                  </Field>
                ))}
              </div>
              <div className="admin-form-actions">{saveButton}</div>
            </form>
          )}
        </>
      )}
    </section>
  );
}
