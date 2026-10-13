import { Suspense } from "react";
import { Profile } from "@/components/profile";
export const metadata = { title: "A Little Story" };
export default function Page() {
  return (
    <Suspense>
      <Profile />
    </Suspense>
  );
}
