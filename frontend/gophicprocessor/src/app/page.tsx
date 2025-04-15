// "use client" ensures we can have interactive elements (like hover dropdown) in Next.js 13 app router.
"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import WelcomeOverlay from "@/components/WelcomeOverlay/WelcomeOverlay";
import { welcomeSteps } from "@/components/WelcomeOverlay/welcomeOverlaySteps";

export default function HomePage() {
  const [showOverlay, setShowOverlay] = useState(true);
  
  return (
    <main className="min-h-screen flex flex-col bg-cover bg-center bg-[#9C8F8B]">
      <Header />
      {showOverlay && (
        <WelcomeOverlay steps={welcomeSteps} onClose={() => setShowOverlay(false)} />
      )}
      <Flex
        id="main-flex"
        className="flex flex-1 w-full h-full items-center justify-center"

        /* needed inline style to override radix-ui */
        style={{alignItems: "center", justifyContent: "center"}}
      >
        <Image
          id="gophic-logo"
          src="/GophicProcessor-Logo.png"
          alt="GophicProcessor Logo"
          priority={true}
          width={150}
          height={150}
          className="
          h-auto
          object-contain
          sm:w-[350px]
        "
        />
      </Flex>
    </main>
  );
}
