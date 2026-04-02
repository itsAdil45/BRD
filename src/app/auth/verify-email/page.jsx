import { Suspense } from "react";
import AuthForm from "../AuthForm"; // Adjust path if needed

export const metadata = {
  title: {
    default: "Verify Email – CPEMS",
  },
  description:
    "Please verify your email address to complete your CPEMS registration.",
};

function VerifyEmailContent() {
  return <AuthForm type="verify" />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
