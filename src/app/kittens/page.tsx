import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "ลูกแมวหาบ้าน" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="kittens" />
    </Suspense>
  );
}
