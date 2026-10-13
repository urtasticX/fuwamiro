import {
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Cat, JourneyEvent, Litter, SiteContent } from "./types";

// Document IDs remain stable as a kitten becomes alumni, breeding, or retired.
// Relationships reference those IDs, rather than duplicating cat records.
export async function loadPublicContent() {
  const [cats, events, litters, content] = await Promise.all([
    getDocsFromServer(collection(db, "cats")),
    getDocsFromServer(collection(db, "timeline_events")),
    getDocsFromServer(collection(db, "litters")),
    getDocFromServer(doc(db, "site_content", "main")),
  ]);
  return {
    cats: cats.docs
      .map((d) => ({ ...d.data(), id: d.id }) as Cat)
      .sort((a, b) => a.name.localeCompare(b.name)),
    events: events.docs
      .map((d) => ({ ...d.data(), id: d.id }) as JourneyEvent)
      .sort((a, b) => a.date.localeCompare(b.date)),
    litters: litters.docs.map((d) => ({ ...d.data(), id: d.id }) as Litter),
    content: content.exists() ? (content.data() as Partial<SiteContent>) : null,
  };
}
