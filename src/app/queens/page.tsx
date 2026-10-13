import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "แม่พันธุ์" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="queens" />
    </Suspense>
  );
}
