"use client";

import { Suspense } from "react";
import AuthForm from "../AuthForm"; // Adjust path if needed

function ForgotPasswordContent() {
  return <AuthForm type="forgot-password" />;
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
