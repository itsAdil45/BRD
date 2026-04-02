import { Metadata } from "next";

import { Suspense } from "react";
import AuthForm from "../AuthForm"; // Adjust path if needed
export const metadata = {
  title: {
    default: "Sign-in/Login – CPEMS",
  },
  description:
    "Login to view your cart or order status, track your delivery, manage returns, and many more.",
};
function LoginContent() {
  return <AuthForm type="login" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
