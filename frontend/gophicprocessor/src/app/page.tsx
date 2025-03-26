// "use client" ensures we can have interactive elements (like hover dropdown) in Next.js 13 app router.
"use client";

import React from "react";
import Header from "../components/Header";

export default function HomePage() {
  return (
    // Set `relative` so child elements can be absolutely positioned
    <main>
      <Header />
      <div className="relative flex flex-col items-center justify-center h-screen">
        <img
          src="/GophicProcessor-Logo.png"
          alt="GophicProcessor Logo"
          className="
          mb-8
          w-24      /* Default (mobile): smaller image */
          sm:w-76   /* Custom screen widths if configured in Tailwind */
          md:w-88
          lg:w-94
          xl:w-112
          h-auto
        "
        />
      </div>
    </main>
  );
}
