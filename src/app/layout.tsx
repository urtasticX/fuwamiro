import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar, Footer } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Fuwamiro — บ้านแมวที่เต็มไปด้วยความรัก",
    template: "%s · Fuwamiro",
  },
  description:
    "ทำความรู้จักครอบครัวแมว Fuwamiro เรื่องราวของพวกเขา และเพื่อนตัวน้อยที่อาจรอคุณอยู่",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <Providers>
          <a className="skip-link" href="#main">
            ข้ามไปยังเนื้อหา
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
