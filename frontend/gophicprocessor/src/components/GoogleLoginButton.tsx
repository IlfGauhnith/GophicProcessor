"use client";

import React from "react";
import GoogleButton from "react-google-button";
import { googleOAuthLogin } from "../service/authService";

export default function GoogleLoginButton() {
  async function handleGoogleLogin() {
    try {
      // Call your authService function
      const googleUrl = await googleOAuthLogin();

      // Open that URL in a new tab:
      window.open(googleUrl, "_blank");
    } catch (error) {
      console.error("Google OAUTH error:", error);
      alert("Unable to initiate Google login.");
    }
  }

  return (
    <GoogleButton onClick={handleGoogleLogin} />
  );
}
