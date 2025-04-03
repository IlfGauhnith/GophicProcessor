// "use client" ensures we can have interactive elements (like hover dropdown) in Next.js 13 app router.
"use client";

import React from "react";
import Header from "../components/Header";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-cover bg-center bg-[#9C8F8B]">
      <Header />
      <Flex
        id="main-flex"
        className="tw-center flex-1 w-full h-full items-center justify-center"
      >
        <Image
          id="gophic-logo"
          src="/GophicProcessor-Logo.png"
          alt="GophicProcessor Logo"
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
