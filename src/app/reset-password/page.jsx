"use client";

import { Suspense } from "react";
import AuthForm from "../auth/AuthForm";

function ResetPasswordContent() {
  return <AuthForm type="reset-password" />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
