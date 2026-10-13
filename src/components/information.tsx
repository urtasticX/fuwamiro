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
      title: "Care, with intention.",
      th: "ใส่ใจสุขภาพอย่างต่อเนื่อง",
      body: "เราให้ความสำคัญกับการติดตามสุขภาพโดยสัตวแพทย์ และจัดเก็บประวัติการดูแลของแมวแต่ละตัวอย่างเป็นระบบ",
      en: "We value ongoing veterinary care and an individual record of each cat’s wellbeing.",
    },
    {
      icon: Sun,
      title: "Room to be themselves.",
      th: "พื้นที่สำหรับการเติบโต",
      body: "พื้นที่สะอาด แสงธรรมชาติ มุมพักผ่อน และของเล่นที่ช่วยให้พวกเขาได้สำรวจโลกในจังหวะของตัวเอง",
      en: "Clean spaces, natural light, quiet corners, and playful moments to explore at their own pace.",
    },
    {
      icon: Heart,
      title: "A gentle introduction.",
      th: "คุ้นเคยกับความรักในทุกวัน",
      body: "เราใช้เวลาร่วมกับแมวทุกวัน เพื่อให้คุ้นเคยกับผู้คน เสียงในบ้าน และการดูแลอย่างอ่อนโยน",
      en: "Everyday time together helps our cats become comfortable with people, household sounds, and gentle handling.",
    },
    {
      icon: Flower2,
      title: "A thoughtful next chapter.",
      th: "พร้อมสำหรับบ้านใหม่",
      body: "พูดคุยเรื่องไลฟ์สไตล์และความพร้อมของครอบครัว พร้อมส่งต่อข้อมูลการดูแลที่เหมาะกับแมวแต่ละตัว",
      en: "We talk about your home and lifestyle, then share care information that is specific to your companion.",
    },
  ];
  return (
    <>
      <section className="page-hero container">
        <Reveal>
          <Eyebrow>{locale === "th" ? "ความรักอยู่ในทุกการดูแล" : "LOVE IS IN THE LITTLE THINGS"}</Eyebrow>
          <h1>
            {locale === "th" ? "เติบโต" : "Growing"}
            <br />
            {locale === "th" ? <>ด้วย<em>ความใส่ใจ</em></> : <>with <em>care.</em></>}
          </h1>
          <p className="page-subtitle">
            {locale === "th" ? "ชีวิตที่มีความสุข เริ่มต้นจากการดูแลที่ดี" : "A happy life starts with a thoughtful beginning."}
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
          <Eyebrow>{locale === "th" ? "แนวทางของเรา" : "OUR PHILOSOPHY"}</Eyebrow>
          <h2>
            {locale === "th" ? "เป็นครอบครัว" : "Family."}
            <br />
            {locale === "th" ? <>ตั้งแต่<em>วันแรก</em></> : <>From the <em>first day.</em></>}
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
            <h3>{locale === "th" ? c.th : c.title}</h3>
            <p>{locale === "th" ? c.body : c.en}</p>
          </Reveal>
        ))}
      </section>
      <section className="container section faq-section">
        <div>
          <Eyebrow>{locale === "th" ? "เรื่องที่ควรรู้" : "A FEW THINGS TO KNOW"}</Eyebrow>
          <h2>
            {locale === "th" ? "อุ่นใจ" : "A little"}
            <br />
            <em>{locale === "th" ? "ในทุกขั้นตอน" : "peace of mind."}</em>
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
      ? "Alumni update"
      : cat
        ? `About ${cat.name}`
        : "Meet a kitten",
  );
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const channels = [
    {
      title: "LINE",
      label:
        locale === "th"
          ? "เริ่มต้นบทสนทนาเล็ก ๆ"
          : "A little conversation starts here",
      url: content.line_url,
      icon: MessageCircle,
    },
    {
      title: "Instagram",
      label: locale === "th" ? "เรื่องราวเล็ก ๆ ในทุกวัน" : "Little moments, every day",
      url: content.instagram_url,
      icon: Instagram,
    },
    {
      title: "Facebook",
      label: locale === "th" ? "เรื่องราวจากบ้านหลังเล็กของเรา" : "Stories from our little home",
      url: content.facebook_url,
      icon: Facebook,
    },
  ];
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <>
      <section className="page-hero container">
        <Reveal>
          <Eyebrow>{locale === "th" ? "ทุกเรื่องราวเริ่มจากการทักทาย" : "EVERY BEAUTIFUL STORY STARTS WITH HELLO"}</Eyebrow>
          <h1>
            {locale === "th" ? "มาคุยกัน" : "Let’s talk"}
            <br />
            <em>{locale === "th" ? "เรื่องน้องแมว" : "little paws."}</em>
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
            {locale === "th" ? <>เริ่มต้น<em>ทักทาย</em></> : <>A little <em>hello.</em></>}
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
                  <span className="coming-soon">{locale === "th" ? "เร็ว ๆ นี้" : "Soon"}</span>
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
          <Eyebrow>{locale === "th" ? "ฝากข้อความถึงบ้านของเรา" : "A NOTE TO OUR LITTLE HOME"}</Eyebrow>
          <h3>
            {locale === "th"
              ? "บอกเราเกี่ยวกับคุณ"
              : "Tell us a little about you"}
          </h3>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              setCopied(false);
              setDraft(
                locale === "th" ? `สวัสดี Fuwamiro\n\nชื่อ: ${name}\nอีเมล: ${email}\nเรื่อง: ${topic}\n\n${message}\n\nจาก ${name}` : `Hello Fuwamiro,\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}\n\nWith love,\n${name}`,
              );
            }}
          >
            <label>
              {locale === "th" ? "ชื่อของคุณ" : "Your name"}
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "th" ? "ชื่อของคุณ" : "Your lovely name"}
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
                {cat && <option value={`About ${cat.name}`}>{locale === "th" ? `สอบถามเรื่อง ${cat.name}` : `About ${cat.name}`}</option>}
                <option value="Meet a kitten">{locale === "th" ? "ทำความรู้จักลูกแมว" : "Meet a kitten"}</option>
                <option value="About our cattery">{locale === "th" ? "เกี่ยวกับฟาร์มของเรา" : "About our cattery"}</option>
                <option value="Alumni update">{locale === "th" ? "อัปเดตสมาชิกบ้านใหม่" : "Alumni update"}</option>
                <option value="Something else">{locale === "th" ? "เรื่องอื่น ๆ" : "Something else"}</option>
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
                    : "A little about your home, or anything you’d like to ask…"
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
                aria-label={locale === "th" ? "ข้อความที่เตรียมไว้" : "Prepared message"}
              />
              <div className="draft-actions">
                <button className="button outline small" onClick={copy}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
                  {locale === "th" ? (copied ? "คัดลอกแล้ว" : "คัดลอกข้อความ") : (copied ? "Copied" : "Copy message")}
                </button>
                {content.line_url && (
                  <a
                    href={content.line_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button small"
                  >
                    {locale === "th" ? "เปิด LINE" : "Open LINE"} ↗
                  </a>
                )}
                {content.email && (
                  <a
                    className="text-link"
                    href={`mailto:${content.email}?subject=${encodeURIComponent(topic)}&body=${encodeURIComponent(draft)}`}
                  >
                    {locale === "th" ? "เปิดอีเมล" : "Open email"} ↗
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
