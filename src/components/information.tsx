"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Sun,
  Flower2,
  MessageCircle,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Copy,
  Check,
} from "lucide-react";
import { useSite } from "./providers";
import { CatPhoto, ContactCTA, Eyebrow, Reveal } from "./ui";
export function Health() {
  const { locale, t, content } = useSite();
  const care = [
    {
      icon: ShieldCheck,
      title: "ดูแลด้วยความตั้งใจ",
      th: "ใส่ใจสุขภาพอย่างต่อเนื่อง",
      body: "เราให้ความสำคัญกับการติดตามสุขภาพโดยสัตวแพทย์ และจัดเก็บประวัติการดูแลของแมวแต่ละตัวอย่างเป็นระบบ",
      en: "We value ongoing veterinary care and an individual record of each cat’s wellbeing.",
    },
    {
      icon: Sun,
      title: "พื้นที่ให้เป็นตัวเอง",
      th: "พื้นที่สำหรับการเติบโต",
      body: "พื้นที่สะอาด แสงธรรมชาติ มุมพักผ่อน และของเล่นที่ช่วยให้พวกเขาได้สำรวจโลกในจังหวะของตัวเอง",
      en: "Clean spaces, natural light, quiet corners, and playful moments to explore at their own pace.",
    },
    {
      icon: Heart,
      title: "คุ้นเคยอย่างอ่อนโยน",
      th: "คุ้นเคยกับความรักในทุกวัน",
      body: "เราใช้เวลาร่วมกับแมวทุกวัน เพื่อให้คุ้นเคยกับผู้คน เสียงในบ้าน และการดูแลอย่างอ่อนโยน",
      en: "Everyday time together helps our cats become comfortable with people, household sounds, and gentle handling.",
    },
    {
      icon: Flower2,
      title: "ก้าวต่อไปด้วยความใส่ใจ",
      th: "พร้อมสำหรับบ้านใหม่",
      body: "พูดคุยเรื่องไลฟ์สไตล์และความพร้อมของครอบครัว พร้อมส่งต่อข้อมูลการดูแลที่เหมาะกับแมวแต่ละตัว",
      en: "We talk about your home and lifestyle, then share care information that is specific to your companion.",
    },
  ];
  return (
    <>
      <section className="page-hero container">
        <Reveal>
          <Eyebrow>ความรักอยู่ในรายละเอียดเล็ก ๆ</Eyebrow>
          <h1>
            เติบโต
            <br />
            ด้วย<em>ความใส่ใจ</em>
          </h1>
          <p className="page-subtitle">
            ชีวิตที่ดีเริ่มต้นจากการดูแลที่ใส่ใจ
          </p>
        </Reveal>
        <span className="page-hero-heart">
          <ShieldCheck size={68} strokeWidth={0.7} />
        </span>
      </section>
      <section className="container care-intro">
        <Reveal className="care-photo">
          <CatPhoto
            src="/images/kittens.webp"
            alt="Two kittens resting together at home"
            priority
          />
        </Reveal>
        <Reveal>
          <Eyebrow>แนวทางของเรา</Eyebrow>
          <h2>
            ครอบครัว
            <br />
            ตั้งแต่<em>วันแรก</em>
          </h2>
          <p className="lead">{t(content.health)}</p>
          <p>
            {locale === "th"
              ? "ข้อมูลสุขภาพที่เผยแพร่จะเป็นข้อมูลที่เหมาะสมสำหรับครอบครัวใหม่ ส่วนเวชระเบียนและรายละเอียดส่วนตัวจะจัดเก็บแยกอย่างปลอดภัย"
              : "We share relevant wellbeing information with future families while keeping detailed private records protected."}
          </p>
        </Reveal>
      </section>
      <section className="container section care-grid">
        {care.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <c.icon size={28} strokeWidth={1} />
            <span className="care-number">0{i + 1}</span>
            <h3>{c.title}</h3>
            <h4>{locale === "th" ? c.th : ""}</h4>
            <p>{locale === "th" ? c.body : c.en}</p>
          </Reveal>
        ))}
      </section>
      <section className="container section faq-section">
        <div>
          <Eyebrow>เรื่องที่ควรรู้</Eyebrow>
          <h2>
            อีกนิดเพื่อ
            <br />
            <em>ความสบายใจ</em>
          </h2>
        </div>
        <div className="faq-list">
          {[
            {
              q:
                locale === "th"
                  ? "ก่อนน้องย้ายบ้าน เราจะได้รับข้อมูลอะไรบ้าง?"
                  : "What will we receive before going home?",
              a:
                locale === "th"
                  ? "เราจะยืนยันข้อมูลสุขภาพ ตารางการดูแล อาหารที่น้องคุ้นเคย และรายละเอียดประจำตัวเป็นรายตัวก่อนย้ายบ้าน คุณสามารถสอบถามเอกสารที่มีได้โดยตรง"
                  : "We confirm individual health information, care routines, familiar food, and identification details before the move. Ask us directly about the records available for your cat.",
            },
            {
              q:
                locale === "th"
                  ? "สามารถทำความรู้จักน้องก่อนได้ไหม?"
                  : "Can we get to know a kitten first?",
              a:
                locale === "th"
                  ? "ได้เลย เราเริ่มจากการพูดคุยเพื่อรู้จักครอบครัวของคุณ แล้วนัดหมายการทำความรู้จักที่เหมาะสมกับน้อง"
                  : "Of course. We start with a conversation about your family and arrange an introduction that suits the kitten.",
            },
            {
              q:
                locale === "th"
                  ? "หลังย้ายบ้านแล้วยังติดต่อได้ไหม?"
                  : "Can we stay in touch after the move?",
              a:
                locale === "th"
                  ? "ยินดีเสมอ เราอยากเห็นน้องเติบโตอย่างมีความสุข คุณสามารถส่งภาพและเรื่องราวมาให้เราอัปเดตในหน้าความทรงจำของน้องได้"
                  : "Always. We love seeing our little ones grow. You can send photos and stories for their memory page.",
            },
          ].map((c) => (
            <details key={c.q}>
              <summary>
                {c.q}
                <span>+</span>
              </summary>
              <p>{c.a}</p>
            </details>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
export function Contact() {
  const { locale, cats, content } = useSite();
  const params = useSearchParams();
  const cat = cats.find((c) => c.id === params.get("cat"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(
    params.get("topic") === "alumni"
      ? "อัปเดตสมาชิกที่ย้ายบ้าน"
      : cat
        ? `สอบถามเกี่ยวกับ ${cat.name}`
        : "ทำความรู้จักลูกแมว",
  );
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState("");
  const [copied, setคัดลอกแล้ว] = useState(false);
  const channels = [
    {
      title: "LINE",
      label:
        locale === "th"
          ? "เริ่มต้นบทสนทนาเล็ก ๆ"
          : "อีกนิดเพื่อ conversation starts here",
      url: content.line_url,
      icon: MessageCircle,
    },
    {
      title: "Instagram",
      label: "เรื่องราวน่ารักในทุกวัน",
      url: content.instagram_url,
      icon: Instagram,
    },
    {
      title: "Facebook",
      label: "เรื่องราวจากบ้านของเรา",
      url: content.facebook_url,
      icon: Facebook,
    },
  ];
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setคัดลอกแล้ว(true);
    } catch {
      setคัดลอกแล้ว(false);
    }
  }
  return (
    <>
      <section className="page-hero container">
        <Reveal>
          <Eyebrow>ทุกเรื่องราวดี ๆ เริ่มจากการทักทาย</Eyebrow>
          <h1>
            มาพูดคุย
            <br />
            <em>เรื่องน้องแมว</em>
          </h1>
          <p>
            {locale === "th"
              ? "อยากทำความรู้จักน้อง ๆ หรือมีคำถามเกี่ยวกับบ้านของเรา เรายินดีพูดคุยเสมอ"
              : "Curious about our cats, or simply want to say hello? We’d love to hear from you."}
          </p>
        </Reveal>
        <span className="page-hero-heart">
          <MessageCircle size={68} strokeWidth={0.7} />
        </span>
      </section>
      <section className="container contact-layout">
        <Reveal>
          <h2>
            <em>ทักทายกัน</em>
          </h2>
          <p>
            {locale === "th"
              ? "เลือกช่องทางที่คุณสะดวก แล้วมาเริ่มต้นเรื่องราวบทใหม่ด้วยกัน"
              : "Choose your favourite way to get in touch."}
          </p>
          <div className="contact-channels">
            {channels.map((c) =>
              c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={c.title}
                >
                  <c.icon size={24} />
                  <span>
                    <strong>{c.title}</strong>
                    <small>{c.label}</small>
                  </span>
                  <ArrowUpRight size={19} />
                </a>
              ) : (
                <div className="channel-pending" key={c.title}>
                  <c.icon size={24} />
                  <span>
                    <strong>{c.title}</strong>
                    <small>
                      {locale === "th"
                        ? "ช่องทางติดต่อจะเปิดเร็ว ๆ นี้"
                        : "Contact details coming soon"}
                    </small>
                  </span>
                  <span className="coming-soon">เร็ว ๆ นี้</span>
                </div>
              ),
            )}
          </div>
          {content.email && (
            <a className="contact-detail" href={`mailto:${content.email}`}>
              <Mail size={17} />
              {content.email}
            </a>
          )}
          <p className="contact-detail">
            <MapPin size={17} />
            {tCopy(content.location, locale)}
          </p>
          <div className="visit-note">
            <Heart size={18} />
            <p>
              {locale === "th"
                ? "เราต้อนรับการทำความรู้จักผ่านการนัดหมายล่วงหน้า เพื่อให้ทุกช่วงเวลาสบายใจสำหรับน้อง ๆ"
                : "Introductions are by appointment, keeping every visit comfortable for our little family."}
            </p>
          </div>
        </Reveal>
        <Reveal className="contact-form-wrap">
          <Eyebrow>ส่งข้อความถึงบ้านของเรา</Eyebrow>
          <h3>
            {locale === "th"
              ? "บอกเราเกี่ยวกับคุณ"
              : "Tell us a little about you"}
          </h3>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              setคัดลอกแล้ว(false);
              setDraft(
                `สวัสดี Fuwamiro,\n\nชื่อ: ${name}\nEmail: ${email}\nหัวข้อ: ${topic}\n\n${message}\n\nด้วยความรัก,\n${name}`,
              );
            }}
          >
            <label>
              {locale === "th" ? "ชื่อของคุณ" : "Your name"}
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อของคุณ"
                autoComplete="name"
              />
            </label>
            <label>
              {locale === "th" ? "อีเมล" : "Email address"}
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                autoComplete="email"
              />
            </label>
            <label>
              {locale === "th" ? "อยากคุยเรื่องอะไร" : "What’s on your mind?"}
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {cat && <option>About {cat.name}</option>}
                <option>ทำความรู้จักลูกแมว</option>
                <option>เกี่ยวกับบ้านแมวของเรา</option>
                <option>อัปเดตสมาชิกที่ย้ายบ้าน</option>
                <option>เรื่องอื่น ๆ</option>
              </select>
            </label>
            <label>
              {locale === "th" ? "ข้อความของคุณ" : "Your message"}
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  locale === "th"
                    ? "เล่าให้เราฟังเกี่ยวกับบ้านของคุณ หรือฝากคำถามไว้ได้เลย…"
                    : "อีกนิดเพื่อ about your home, or anything you’d like to ask…"
                }
              />
            </label>
            <button className="button" type="submit">
              {locale === "th" ? "เตรียมข้อความ" : "Prepare my message"}
              <ArrowUpRight size={17} />
            </button>
            <small>
              {locale === "th"
                ? "เราจะเตรียมข้อความให้คุณคัดลอกไปส่งทางช่องทางติดต่อ ข้อมูลในแบบฟอร์มนี้ยังไม่ถูกส่ง"
                : "This prepares a message you can send through a contact channel. The form does not send or store your details."}
            </small>
          </form>
          {draft && (
            <div className="message-draft" role="status">
              <h4>
                {locale === "th"
                  ? "ข้อความของคุณพร้อมแล้ว"
                  : "Your little note is ready"}
              </h4>
              <textarea
                value={draft}
                readOnly
                rows={7}
                aria-label="ข้อความที่เตรียมไว้"
              />
              <div className="draft-actions">
                <button className="button outline small" onClick={copy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
                  {copied ? "คัดลอกแล้ว" : "คัดลอกข้อความ"}
                </button>
                {content.line_url && (
                  <a
                    href={content.line_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button small"
                  >
                    เปิด LINE ↗
                  </a>
                )}
                {content.email && (
                  <a
                    className="text-link"
                    href={`mailto:${content.email}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(draft)}`}
                  >
                    เปิดอีเมล ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
function tCopy(copy: { th: string; en: string }, locale: "th" | "en") {
  return copy[locale];
}
