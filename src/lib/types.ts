export type Locale = "th" | "en";
export type Copy = { th: string; en: string };
export type LifeStage = "breeding" | "kitten" | "alumni" | "retired";
export type Availability =
  "Available" | "Reserved" | "Under Evaluation" | "Sold" | "Staying";
export type Cat = {
  id: string;
  name: string;
  nickname?: string;
  breed: string;
  gender: "Male" | "Female";
  color: string;
  color_code: string;
  birthday: string;
  stage: LifeStage;
  availability: Availability;
  portrait: string;
  photos: string[];
  personality: Copy;
  story: Copy;
  public_health: Copy;
  pedigree: string;
  father_id?: string | null;
  mother_id?: string | null;
  litter_id?: string | null;
  ready_date?: string | null;
  adoption_date?: string | null;
  price?: number | null;
};
export type JourneyEvent = {
  id: string;
  cat_id: string;
  date: string;
  title: Copy;
  description: Copy;
  photos: string[];
  video_url?: string | null;
};
export type Litter = {
  id: string;
  name: string;
  father_id: string;
  mother_id: string;
  birthday: string;
};
export type SiteContent = {
  sample_mode?: boolean;
  intro: Copy;
  philosophy: Copy;
  health: Copy;
  line_url: string;
  facebook_url: string;
  instagram_url: string;
  email: string;
  location: Copy;
};
