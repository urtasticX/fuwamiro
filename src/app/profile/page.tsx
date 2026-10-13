import { Suspense } from "react";
import { Profile } from "@/components/profile";
export const metadata = { title: "เรื่องราวของแมว" };
export default function Page() {
  return (
    <Suspense>
      <Profile />
    </Suspense>
  );
}
