import { Suspense } from "react";
import DemoPageGenerator from "./demo-page-generator";

export default function DemoPage() {
  return (
    <Suspense>
      <DemoPageGenerator />
    </Suspense>
  );
}
