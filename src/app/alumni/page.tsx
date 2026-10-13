import { Suspense } from "react";
import { Listing } from "@/components/listing";
export const metadata = { title: "สมาชิกที่ย้ายบ้าน" };
export default function Page() {
  return (
    <Suspense>
      <Listing kind="alumni" />
    </Suspense>
  );
}
