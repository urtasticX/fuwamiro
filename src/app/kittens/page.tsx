import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "Available Kittens" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="kittens" />
    </Suspense>
  );
}
