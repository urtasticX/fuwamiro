import { Suspense } from "react";
import { Contact } from "@/components/information";
export const metadata = { title: "Say Hello" };
export default function Page() {
  return (
    <Suspense>
      <Contact />
    </Suspense>
  );
}
