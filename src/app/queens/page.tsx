import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "Our Queens" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="queens" />
    </Suspense>
  );
}
