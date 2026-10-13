"use client";
import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "motion/react";
import { Heart } from "lucide-react";
import { JourneyEvent } from "@/lib/types";
import { PhotoGallery, formatDate } from "./ui";
import { useSite } from "./providers";
export function AnimatedTimeline({
  events,
  name,
}: {
  events: JourneyEvent[];
  name: string;
}) {
  const { t, locale } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 70%"],
  });
  return (
    <div className="timeline" ref={ref}>
      <div className="timeline-track" />
      <motion.div
        className="timeline-progress"
        style={{ scaleY: reduced ? 1 : scrollYProgress }}
      />
      {events
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((event, index) => (
          <motion.article
            key={event.id}
            className={`timeline-event ${index % 2 ? "right" : "left"}`}
            initial={
              reduced ? false : { opacity: 0.2, x: index % 2 ? 30 : -30 }
            }
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              className="timeline-dot"
              initial={{ backgroundColor: "#fff" }}
              whileInView={{ backgroundColor: "#73bce8" }}
              viewport={{ once: true }}
            />
            <div className="timeline-content">
              <time>{formatDate(event.date, locale)}</time>
              <h3>{t(event.title)}</h3>
              <p>{t(event.description)}</p>
              {event.photos.length > 0 && (
                <PhotoGallery photos={event.photos} name={name} />
              )}
              {event.video_url && (
                <video
                  controls
                  preload="metadata"
                  src={event.video_url}
                  aria-label={`วิดีโอ ${t(event.title)}`}
                />
              )}
            </div>
            <span className="timeline-chapter">
              ตอนที่ {String(index + 1).padStart(2, "0")}
            </span>
          </motion.article>
        ))}
      <div className="timeline-today">
        <span className="pulse-heart">
          <Heart size={19} />
        </span>
        <span className="eyebrow">วันนี้และทุกวันต่อจากนี้</span>
        <h3>เติบโตอย่างมีความสุข</h3>
        <p>
          {locale === "th"
            ? "และเรื่องราวแห่งความรักยังคงดำเนินต่อไป…"
            : "And the story of love goes on…"}
        </p>
      </div>
    </div>
  );
}
