import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "Our Kings" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="kings" />
    </Suspense>
  );
}
