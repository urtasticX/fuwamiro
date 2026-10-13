import { Cat, JourneyEvent, Litter, SiteContent } from "./types";
const health = {
  th: "ข้อมูลสุขภาพตัวอย่าง • สมุดวัคซีนและผลตรวจสุขภาพจะได้รับการยืนยันเป็นรายตัวก่อนย้ายบ้าน",
  en: "Sample health information. Individual veterinary records and vaccination history are confirmed before going home.",
};
const base = {
  breed: "British Shorthair",
  pedigree: "สอบถามรายละเอียดใบเพ็ดเพิ่มเติมได้",
  pedigree_type: "",
  public_health: health,
};
export const sampleCats: Cat[] = [
  {
    ...base,
    id: "moon",
    name: "Moon",
    gender: "Male",
    color: "Silver shaded",
    color_code: "BRI ns 11",
    birthday: "2024-03-15",
    stage: "breeding",
    availability: "Staying",
    portrait: "/images/moon.webp",
    photos: ["/images/moon.webp", "/images/moon-close.webp"],
    personality: {
      th: "สุภาพ ใจเย็น และชอบนอนอาบแดดข้างหน้าต่าง",
      en: "A gentle soul who loves sunny windows and slow afternoons.",
    },
    story: {
      th: "มูนคือก้อนเมฆประจำบ้านของเรา เขาชอบทักทายทุกคนด้วยเสียงครางเบา ๆ และมักจะอยู่ข้างเราในวันธรรมดาที่แสนพิเศษ",
      en: "Our very own little cloud. Moon greets everyone with a quiet purr and turns ordinary afternoons into something special.",
    },
    father_id: "nori",
    mother_id: "yuki",
  },
  {
    ...base,
    id: "bomi",
    name: "Bomi",
    gender: "Female",
    color: "Golden shaded",
    color_code: "BRI ny 11",
    birthday: "2024-04-20",
    stage: "breeding",
    availability: "Staying",
    portrait: "/images/bomi.webp",
    photos: ["/images/bomi.webp", "/images/bomi-close.webp"],
    personality: {
      th: "อ่อนโยน ขี้อ้อน และชอบอยู่ใกล้คน",
      en: "Affectionate, curious, and happiest by your side.",
    },
    story: {
      th: "โบมี แปลว่าความงามของฤดูใบไม้ผลิ เธอนำความสดใสเข้ามาในบ้านทุกวัน และมีมุมโปรดเป็นเบาะสีฟ้าอ่อนที่ริมหน้าต่าง",
      en: "Named for the beauty of spring, Bomi brings warmth to every room. Her favourite place is a pale blue cushion by the window.",
    },
  },
  {
    ...base,
    id: "nori",
    name: "Nori",
    gender: "Male",
    color: "Blue",
    color_code: "BRI a",
    birthday: "2021-02-08",
    stage: "retired",
    availability: "Staying",
    portrait: "/images/nori.webp",
    photos: ["/images/nori.webp"],
    personality: {
      th: "สุขุมและรักความสงบ",
      en: "A calm companion with a wonderfully quiet confidence.",
    },
    story: {
      th: "วันนี้โนริใช้เวลาส่วนใหญ่กับการนอนพักและรับความรักจากทุกคนในบ้าน",
      en: "These days, Nori spends his time enjoying naps and all the affection a family can give.",
    },
  },
  {
    ...base,
    id: "yuki",
    name: "Yuki",
    gender: "Female",
    color: "Silver shaded",
    color_code: "BRI ns 11",
    birthday: "2021-06-12",
    stage: "retired",
    availability: "Staying",
    portrait: "/images/moon-close.webp",
    photos: ["/images/moon-close.webp"],
    personality: {
      th: "อ่อนหวานและเป็นมิตร",
      en: "Sweet-natured and endlessly gentle.",
    },
    story: {
      th: "ยูกิเป็นสมาชิกอาวุโสผู้แสนอ่อนโยน เธอชอบบ้านที่เงียบสงบและเวลานอนกอดกัน",
      en: "Our sweet elder loves a peaceful home and a good cuddle.",
    },
  },
  {
    ...base,
    id: "mochi",
    name: "Mochi",
    gender: "Male",
    color: "Silver shaded",
    color_code: "BRI ns 11",
    birthday: "2026-07-15",
    stage: "kitten",
    availability: "Available",
    portrait: "/images/mochi.webp",
    photos: ["/images/mochi.webp", "/images/kittens.webp"],
    personality: {
      th: "ขี้เล่น ช่างสำรวจ และชอบของเล่นที่มีเสียงกรุ๊งกริ๊ง",
      en: "Playful, inquisitive, and very fond of a jingling toy.",
    },
    story: {
      th: "โมจิคือนักสำรวจตัวน้อย ทุกมุมของบ้านคือการผจญภัยครั้งใหม่ ก่อนจะกลับมาหลับปุ๋ยอยู่ใกล้ ๆ เรา",
      en: "Every corner is a new adventure for little Mochi—followed, of course, by a long nap close to us.",
    },
    father_id: "moon",
    mother_id: "bomi",
    litter_id: "little-clouds",
    ready_date: "2026-11-04",
  },
  {
    ...base,
    id: "miso",
    name: "Miso",
    gender: "Female",
    color: "Golden shaded",
    color_code: "BRI ny 11",
    birthday: "2026-07-15",
    stage: "kitten",
    availability: "Reserved",
    portrait: "/images/miso.webp",
    photos: ["/images/miso.webp", "/images/kittens.webp"],
    personality: {
      th: "ขี้อ้อนและชอบนอนตัก",
      en: "A little lap-cat with a very big heart.",
    },
    story: {
      th: "มิโสะชอบติดตามเราไปทุกที่ และกำลังเตรียมตัวไปเติมความอบอุ่นให้ครอบครัวใหม่",
      en: "Miso follows us everywhere and is getting ready to bring a little warmth to her new family.",
    },
    father_id: "moon",
    mother_id: "bomi",
    litter_id: "little-clouds",
    ready_date: "2026-11-04",
  },
  {
    ...base,
    id: "sora",
    name: "Sora",
    gender: "Female",
    color: "Silver shaded",
    color_code: "BRI ns 11",
    birthday: "2026-07-15",
    stage: "kitten",
    availability: "Under Evaluation",
    portrait: "/images/mochi.webp",
    photos: ["/images/mochi.webp", "/images/kittens.webp"],
    personality: {
      th: "สดใสและมั่นใจ",
      en: "Bright-eyed and quietly confident.",
    },
    story: {
      th: "โซระกำลังเติบโตทีละนิดในบ้านของเรา เราเฝ้าดูพัฒนาการของเธอด้วยความรักทุกวัน",
      en: "Sora is growing a little more every day, surrounded by the love of our home.",
    },
    father_id: "moon",
    mother_id: "bomi",
    litter_id: "little-clouds",
    ready_date: "2026-11-04",
  },
  {
    ...base,
    id: "taro",
    name: "Taro",
    nickname: "Tofu",
    gender: "Male",
    color: "Golden shaded",
    color_code: "BRI ny 11",
    birthday: "2025-11-10",
    stage: "alumni",
    availability: "Sold",
    portrait: "/images/miso.webp",
    photos: [
      "/images/miso.webp",
      "/images/bomi-close.webp",
      "/images/kittens.webp",
    ],
    personality: {
      th: "ร่าเริงและชอบเล่นซ่อนหา",
      en: "A happy little explorer who loves hide-and-seek.",
    },
    story: {
      th: "จากทาโร่ตัวน้อยสู่ “เต้าหู้” ของครอบครัวใหม่ เรื่องราวของเขายังคงเติบโตไปพร้อมกับความรักในทุกวัน",
      en: "Little Taro is now Tofu to his new family. His story keeps growing, with a little more love every day.",
    },
    father_id: "nori",
    mother_id: "yuki",
    litter_id: "first-snow",
    adoption_date: "2026-03-01",
  },
];
export const sampleLitters: Litter[] = [
  {
    id: "little-clouds",
    name: "Little Clouds · Litter M",
    father_id: "moon",
    mother_id: "bomi",
    birthday: "2026-07-15",
  },
  {
    id: "first-snow",
    name: "First Snow · Litter T",
    father_id: "nori",
    mother_id: "yuki",
    birthday: "2025-11-10",
  },
];
export const sampleEvents: JourneyEvent[] = sampleCats.flatMap((cat) => [
  {
    id: `${cat.id}-born`,
    cat_id: cat.id,
    date: cat.birthday,
    title: { th: "วันแรกที่ได้พบกัน", en: "Hello, World!" },
    description: {
      th: "วันแรกของเรื่องราวเล็ก ๆ ที่เต็มไปด้วยความรัก",
      en: "The first page of a little story, already filled with love.",
    },
    photos: [
      cat.stage === "kitten" || cat.stage === "alumni"
        ? "/images/kittens.webp"
        : cat.portrait,
    ],
  },
  {
    id: `${cat.id}-home`,
    cat_id: cat.id,
    date:
      cat.stage === "kitten"
        ? "2026-08-15"
        : cat.id === "moon"
          ? "2024-06-20"
          : cat.stage === "alumni"
            ? "2026-01-10"
            : `${Number(cat.birthday.slice(0, 4))}-09-01`,
    title: { th: "บ้านที่อบอุ่น", en: "A Place to Belong" },
    description: {
      th: "เริ่มคุ้นเคยกับเสียงของบ้าน มุมโปรด และอ้อมกอดอุ่น ๆ",
      en: "Getting to know the sounds of home, favourite corners, and warm cuddles.",
    },
    photos: [cat.portrait, ...cat.photos.slice(1, 2)],
  },
  {
    id: `${cat.id}-growing`,
    cat_id: cat.id,
    date:
      cat.stage === "kitten"
        ? "2026-10-01"
        : cat.id === "moon"
          ? "2025-01-10"
          : cat.stage === "alumni"
            ? "2026-03-01"
            : `${Number(cat.birthday.slice(0, 4)) + 1}-01-10`,
    title: {
      th: cat.stage === "alumni" ? "บ้านใหม่ของฉัน" : "เติบโตขึ้นอีกนิด",
      en: cat.stage === "alumni" ? "My Forever Home" : "Growing Up",
    },
    description: {
      th:
        cat.stage === "alumni"
          ? "บทใหม่เริ่มต้นขึ้นกับครอบครัวที่แสนอบอุ่น"
          : "เรียนรู้สิ่งใหม่ เติบโตอย่างมั่นใจ และเป็นตัวเองมากขึ้นทุกวัน",
      en:
        cat.stage === "alumni"
          ? "A new chapter begins with a loving forever family."
          : "Learning new things, growing in confidence, and becoming a little more myself.",
    },
    photos: [cat.photos.at(-1) || cat.portrait],
  },
  ...(cat.id === "moon"
    ? [
        {
          id: "moon-dad",
          cat_id: "moon",
          date: "2026-07-15",
          title: { th: "ได้เป็นคุณพ่อ", en: "Becoming a Dad" },
          description: {
            th: "ต้อนรับสมาชิกตัวน้อยของครอก Little Clouds เข้าสู่ครอบครัว",
            en: "Welcoming our Little Clouds litter into the family.",
          },
          photos: ["/images/kittens.webp"],
        },
      ]
    : []),
]);
export const defaultContent: SiteContent = {
  sample_mode: true,
  icon_url: "",
  intro: {
    th: "บ้านเล็ก ๆ ที่เต็มไปด้วยความรัก เราเชื่อว่าความผูกพันที่สวยงาม เริ่มต้นจากการดูแลที่อ่อนโยน และเวลาที่ได้ใช้ร่วมกัน",
    en: "A little home filled with love. We believe the most beautiful bonds begin with gentle care and the time we share together.",
  },
  philosophy: {
    th: "สำหรับเรา แมวทุกตัวคือสมาชิกในครอบครัว เราใส่ใจทั้งสุขภาพ อุปนิสัย และความสุขในทุกช่วงวัย เพื่อให้พวกเขาเติบโตอย่างมั่นใจและพร้อมเป็นเพื่อนที่แสนดี",
    en: "To us, every cat is family. We care about their wellbeing, their unique personalities, and their happiness at every age, so they grow into confident, loving companions.",
  },
  health: {
    th: "เราให้ความสำคัญกับการตรวจสุขภาพโดยสัตวแพทย์ โภชนาการที่เหมาะสม พื้นที่สะอาด และการเข้าสังคมอย่างอ่อนโยน แผนวัคซีนและการดูแลจะพิจารณาตามความต้องการของแมวแต่ละตัว",
    en: "Our approach brings together veterinary care, thoughtful nutrition, clean spaces, and gentle socialisation. Each cat’s vaccination and care plan is considered individually.",
  },
  line_url: "",
  facebook_url: "",
  instagram_url: "",
  email: "",
  location: {
    th: "ประเทศไทย · นัดหมายล่วงหน้า",
    en: "Thailand · By appointment",
  },
};
