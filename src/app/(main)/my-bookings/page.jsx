import { Suspense } from "react";
import MyBookingsClient from "./MyBookingsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="page-shell flex min-h-screen items-center justify-center text-zinc-300">Loading...</div>}>
      <MyBookingsClient />
    </Suspense>
  );
}