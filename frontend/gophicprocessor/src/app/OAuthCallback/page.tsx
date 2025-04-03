"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", name || "");
      localStorage.setItem("userEmail", email || "");
      router.push("/");
    }
  }, [router, searchParams]);

  return (
    <div className="bg-[#9C8F8B]">
      <h1>Redirecting...</h1>
    </div>
  );
}
