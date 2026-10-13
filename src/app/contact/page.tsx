import { Suspense } from "react";
import { Contact } from "@/components/information";
export const metadata = { title: "ติดต่อเรา" };
export default function Page() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  );
}
