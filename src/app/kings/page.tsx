import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "พ่อพันธุ์" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="kings" />
    </Suspense>
  );
}
