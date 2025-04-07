"use client";

import React from "react";
import Header from "../../components/Header";
import { Flex, Box, Button, TextField } from "@radix-ui/themes";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col bg-cover bg-center bg-[#9C8F8B]">
      <Header />
      <Flex
        id="main-flex"
        className="flex flex-col flex-1 w-full h-full items-center justify-center"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {/* Disabled login form */}
        <Box className="
            flex 
            flex-col 
            gap-4 
            w-80 
            mb-8 
            bg-[#D3951C] 
            rounded-lg
            p-5
            "
        >
          <TextField.Root placeholder="Email" disabled className="bg-[#e5a524] rounded-lg p-1 text-white" />
          <TextField.Root placeholder="Password" type="password" disabled className="bg-[#e5a524] rounded-lg p-1 text-white" />
          <Button disabled className="opacity-50 bg-[#e5a524] rounded-lg">
            Login
          </Button>
        </Box>

        {/* Google Login button remains enabled */}
        <GoogleLoginButton />
      </Flex>
    </main>
  );
}
