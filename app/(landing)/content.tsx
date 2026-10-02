import React from "react";

export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {children}
    </div>
  );
}
