import { Suspense } from "react";
import AuthForm from "../AuthForm"; // Adjust path if needed

export const metadata = {
  title: {
    default: "Verify Email – BRD",
  },
  description:
    "Please verify your email address to complete your BRD Marketplace registration.",
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
