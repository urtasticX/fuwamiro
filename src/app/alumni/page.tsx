import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "Our Alumni" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="alumni" />
    </Suspense>
  );
}
