"use client";

import React from "react";
import GoogleButton from "react-google-button";
import { googleOAuthLogin } from "../service/authService";

export default function GoogleLoginButton() {
  async function handleGoogleLogin() {
    try {
      // Call your authService function
      const googleUrl = await googleOAuthLogin();

      // Redirect to Google login page
      window.location.href = googleUrl;
    } catch (error) {
      console.error("Google OAUTH error:", error);
      alert("Unable to initiate Google login.");
    }
  }

  return (
    <GoogleButton onClick={handleGoogleLogin} />
  );
}
