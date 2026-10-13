import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container empty-state">
      <span className="eyebrow">หลงทางนิดหน่อย</span>
      <h1>ไม่พบหน้านี้</h1>
      <p>กลับไปยังบ้านเล็ก ๆ ของเรากันเถอะ</p>
      <Link href="/" className="button">
        กลับหน้าแรก ↗
      </Link>
    </section>
  );
}
