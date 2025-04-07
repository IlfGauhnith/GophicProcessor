"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const avatar_url = searchParams.get("user_picture_url");

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", name || "");
      localStorage.setItem("userEmail", email || "");
      localStorage.setItem("userPictureUrl", avatar_url || "");
      router.push("/");
    }
  }, [router, searchParams]);

  return (
    <div className="bg-[#9C8F8B]">
      <h1>Redirecting...</h1>
    </div>
  );
}

export default function OAuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthCallbackContent />
    </Suspense>
  );
}
