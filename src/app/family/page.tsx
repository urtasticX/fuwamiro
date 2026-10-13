import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "ครอบครัวของเรา" };
export default function Page() {
  return (
    <Suspense>
      <Listing />
    </Suspense>
  );
}
