"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { themeColors } from "@/theme/themeColors";
import Cookies from "js-cookie";

// Extract the main content into its own component
function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const regToken = Cookies.get("reg_token");
      if (!regToken) {
        setStatus("error");
        setMessage(
          "Session expired. Please sign up again or request a new verification email.",
        );
        return;
      }

      const path = searchParams.get("path");
      const expires = searchParams.get("expires");
      const signature = searchParams.get("signature");

      if (!path || !expires || !signature) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }

      const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/email/verify/${decodeURIComponent(path)}?expires=${expires}&signature=${signature}`;

      try {
        const res = await fetch(backendUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${regToken}`,
          },
        });

        const result = await res.json();

        if (!result.status) {
          setStatus("error");
          setMessage(
            result.message || "Verification failed. The link may have expired.",
          );
          return;
        }

        const user = result.data;

        if (!user) {
          setStatus("error");
          setMessage("Verification response missing user data.");
          return;
        }

        const signInRes = await signIn("credentials", {
          token: regToken,
          user_json: JSON.stringify(user),
          redirect: false,
        });

        if (signInRes?.ok) {
          setStatus("success");
          setMessage(result.message || "Email verified successfully!");
          setTimeout(() => router.push("/"), 2500);
        } else {
          setStatus("error");
          setMessage("Verified but sign-in failed. Please log in manually.");
          setTimeout(() => router.push("/auth/login"), 2500);
        }
      } catch {
        setStatus("error");
        setMessage(
          "Something went wrong. Please try again or contact support.",
        );
      }
    };

    verify();
  }, [searchParams]);

  return (
    <>
      <style>{CSS}</style>
      <div className="ev-page">
        <div className="ev-brand">
          <span className="ev-logo">BRD</span>
          <span className="ev-tagline">Marketplace</span>
        </div>

        <div className="ev-card">
          {status === "verifying" && (
            <>
              <div className="ev-icon ev-icon--spin">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="ev-title">Verifying your email…</h1>
              <p className="ev-sub">
                Please wait while we confirm your account.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="ev-icon ev-icon--ok">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path
                    d="M8 12l3 3 5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="ev-title">Email Verified!</h1>
              <p className="ev-sub">{message}</p>
              <p className="ev-redirect">Redirecting you now…</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="ev-icon ev-icon--err">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="ev-title">Verification Failed</h1>
              <p className="ev-sub">{message}</p>
              <div className="ev-actions">
                <a href="/auth/verify-email" className="ev-btn">
                  Resend verification email
                </a>
                <a href="/auth/login" className="ev-btn ev-btn--ghost">
                  Back to login
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// Fallback shown while the component is loading
function VerificationFallback() {
  return (
    <>
      <style>{CSS}</style>
      <div className="ev-page">
        <div className="ev-brand">
          <span className="ev-logo">BRD</span>
          <span className="ev-tagline">Marketplace</span>
        </div>
        <div className="ev-card">
          <div className="ev-icon ev-icon--spin">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="ev-title">Verifying your email…</h1>
          <p className="ev-sub">Please wait while we confirm your account.</p>
        </div>
      </div>
    </>
  );
}

// Default export wraps everything in Suspense
export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<VerificationFallback />}>
      <EmailVerificationContent />
    </Suspense>
  );
}

const CSS = `
  :root {
    --accent:       ${themeColors.primary};
    --accent-dark:  #019a78;
    --accent-light: rgba(2,171,134,.10);
    --err:          #d93025;
    --err-light:    #fdf0ee;
    --ink:          #0a0a0a;
    --ink-muted:    #888;
    --border:       #e0e0e0;
    --surface:      #f5f5f5;
  }
  .ev-page {
    min-height: 100vh;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    font-family: var(--font-body, sans-serif);
  }
  .ev-brand {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 28px;
  }
  .ev-logo {
    font-weight: 700;
    font-size: 1.9rem;
    letter-spacing: .12em;
    color: var(--ink);
  }
  .ev-tagline {
    font-size: .75rem;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }
  .ev-card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 44px 36px 36px;
    box-shadow: 0 4px 24px rgba(0,0,0,.07);
    text-align: center;
  }
  .ev-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 0 auto 24px;
  }
  .ev-icon--spin {
    background: var(--accent-light);
    color: var(--accent);
    animation: ev-spin 1s linear infinite;
  }
  .ev-icon--ok  { background: var(--accent-light); color: var(--accent); }
  .ev-icon--err { background: var(--err-light);    color: var(--err);    }
  @keyframes ev-spin { to { transform: rotate(360deg); } }
  .ev-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ink);
    margin: 0 0 10px;
  }
  .ev-sub {
    font-size: .88rem;
    color: #555;
    line-height: 1.55;
    margin: 0 0 6px;
  }
  .ev-redirect {
    font-size: .8rem;
    color: var(--ink-muted);
    margin-top: 16px;
  }
  .ev-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 24px;
  }
  .ev-btn {
    display: block;
    padding: 12px;
    border-radius: 10px;
    font-size: .88rem;
    font-weight: 600;
    text-decoration: none;
    background: var(--accent);
    color: #fff;
    transition: background .18s;
  }
  .ev-btn:hover { background: var(--accent-dark); }
  .ev-btn--ghost {
    background: transparent;
    color: var(--accent);
    border: 1.5px solid var(--accent);
  }
  .ev-btn--ghost:hover { background: var(--accent-light); }
`;
