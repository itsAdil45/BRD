import { Suspense } from "react";
import AuthForm from "../AuthForm"; // Adjust path if needed
export const metadata = {
  title: {
    default: "Sign-up/Register – Juventa.ae",
  },
  description:
    "Join now for quick checkout, saved cart items, order history, and a personalized shopping experience.",
};

function SignupPageContent() {
  return <AuthForm type="signup" />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
}
