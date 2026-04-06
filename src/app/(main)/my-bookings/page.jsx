import { Suspense } from "react";
import MyBookingsClient from "./MyBookingsClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyBookingsClient />
    </Suspense>
  );
}