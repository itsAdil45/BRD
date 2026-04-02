"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { themeColors } from "@/theme/themeColors";
import { signIn } from "next-auth/react";
import { FormInputField } from "@/components/authForm-Inputs/FormInputField";
import { FormPwField } from "@/components/authForm-Inputs/FormPwField";
import usePost from "@/customHooks/usePost";
import toast from "react-hot-toast";
import axios from "@/libs/axios";
import { getSession } from "next-auth/react";
import {
  isValidEmail,
  isStrongPassword,
} from "@/utils/validators/FormValidator";
import Cookies from "js-cookie";
export default function AuthForm({ type }) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accountType, setAccountType] = useState("individual");
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPw, setShowForgotPw] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { postData, error: postError } = usePost();

  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyToken, setVerifyToken] = useState("");

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    agreeTerms: false,
    companyName: "",
    regNumber: "",
    companyAddress: "",
    companyCountry: "",
    companyCity: "",
    companyPhone: "",
    contactFname: "",
    contactLname: "",
    contactEmail: "",
    contactPhone: "",
    contactPassword: "",
    companyAgreeTerms: false,
    passwordConfirmation: "",
  });

  useEffect(() => {
    if (type === "reset-password") {
      const token = searchParams.get("token");
      const email = searchParams.get("email");
      if (token && email) {
        setResetToken(token);
        setResetEmail(decodeURIComponent(email));
        setForm((p) => ({ ...p, email: decodeURIComponent(email) }));
      }
    }

    if (type === "verify") {
      const storedToken = Cookies.get("reg_token");
      console.log("stored token", storedToken);
      const storedEmail = sessionStorage.getItem("reg_email");
      if (storedToken) setVerifyToken(storedToken);
      if (storedEmail) setVerifyEmail(storedEmail);
    }
  }, [type, searchParams]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };
  const handle = (e) => {
    const { name, value, type: t, checked } = e.target;
    set(name, t === "checkbox" ? checked : value);
  };

  const handleResendVerification = async () => {
    if (!verifyToken) {
      toast.error("Session expired. Please sign up again.");
      return;
    }
    setResendLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/email/resend`,
        {},
        {
          headers: {
            Authorization: `Bearer ${verifyToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      if (response.data) {
        toast.success("Verification email resent! Check your inbox.");
        setResendCooldown(60);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to resend verification email.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  const validateLogin = () => {
    const e = {};
    if (!form.email) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  const validateIndividual = () => {
    const e = {};
    if (!form.fname.trim()) e.fname = "First name is required.";
    if (!form.lname.trim()) e.lname = "Last name is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    else if (!isStrongPassword(form.password))
      e.password =
        "Min 8 chars, one uppercase, one digit, one special character.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.agreeTerms) e.agreeTerms = "You must agree to the terms.";
    return e;
  };

  const validateCompany = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Company name is required.";
    if (!form.companyAddress.trim())
      e.companyAddress = "Company address is required.";
    if (!form.companyPhone.trim()) e.companyPhone = "Phone is required.";
    if (!form.contactFname.trim()) e.contactFname = "First name is required.";
    if (!form.contactLname.trim()) e.contactLname = "Last name is required.";
    if (!form.contactEmail) e.contactEmail = "Email is required.";
    else if (!isValidEmail(form.contactEmail))
      e.contactEmail = "Enter a valid email.";
    if (!form.contactPhone.trim())
      e.contactPhone = "Contact phone is required.";
    if (!form.contactPassword) e.contactPassword = "Password is required.";
    else if (!isStrongPassword(form.contactPassword))
      e.contactPassword =
        "Min 8 chars, one uppercase, one digit, one special character.";
    if (!form.companyAgreeTerms)
      e.companyAgreeTerms = "You must agree to the terms.";
    return e;
  };

  const validateForgot = () => {
    const e = {};
    if (!form.email) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email.";
    return e;
  };

  const validateReset = () => {
    const e = {};
    if (!form.password) e.password = "Password is required.";
    else if (!isStrongPassword(form.password))
      e.password =
        "Min 8 chars, one uppercase, one digit, one special character.";
    if (form.password !== form.passwordConfirmation)
      e.passwordConfirmation = "Passwords do not match.";
    return e;
  };

  const handleResetPassword = async () => {
    if (form.password !== form.passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const resetData = {
      email: resetEmail || form.email,
      password: form.password,
      password_confirmation: form.passwordConfirmation,
      token: resetToken,
    };

    const result = await postData("/reset-password", resetData, false);

    if (result) {
      toast.success("Password has been reset successfully!");
      setSuccess(
        "Password has been reset successfully! You can now login with your new password.",
      );
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (type === "login" && showForgotPw) {
      const errs = validateForgot();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      return handleForgotPassword();
    }

    if (type === "forgot-password") {
      const errs = validateForgot();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      return handleForgotPassword();
    }

    if (type === "reset-password") {
      const errs = validateReset();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      return handleResetPassword();
    }

    if (type === "login") {
      const errs = validateLogin();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }
      setLoading(true);
      try {
        const res = await signIn("credentials", {
          email: form.email,
          password: form.password,
          remember_me: rememberMe.toString(),
          redirect: false,
        });

        if (res?.ok) {
          toast.success("Login Successfully!");
          const session = await getSession();

          if (session?.user?.email_verified === false) {
            sessionStorage.setItem("reg_email", session.user.email);
            router.push("/auth/verify-email");
          } else {
            router.push("/");
          }
        } else {
          toast.error("Invalid Credentials!");
        }
      } catch (error) {
        toast.error("An error occurred during login");
      } finally {
        setLoading(false);
        return;
      }
    }

    if (type === "signup") {
      const errs =
        accountType === "individual" ? validateIndividual() : validateCompany();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }

      setLoading(true);
      try {
        let payload =
          accountType === "individual"
            ? {
                account_type: "individual",
                first_name: form.fname,
                last_name: form.lname,
                email: form.email,
                password: form.password,
                password_confirmation: form.confirmPassword,
                phone: form.phone,
                terms_accepted: form.agreeTerms,
              }
            : {
                account_type: "company",
                first_name: form.contactFname,
                last_name: form.contactLname,
                email: form.contactEmail,
                password: form.contactPassword,
                password_confirmation: form.contactPassword,
                phone: form.contactPhone,
                terms_accepted: form.companyAgreeTerms,
                company_name: form.companyName,
                registration_number: form.regNumber || undefined,
                company_phone: form.companyPhone,
                company_address: form.companyAddress,
                contact_first_name: form.contactFname,
                contact_last_name: form.contactLname,
                contact_email: form.contactEmail,
                contact_phone: form.contactPhone,
              };

        const result = await postData("/register", payload, false);

        if (result?.status == true) {
          toast.success("Account created successfully!");

          const registrationToken = result?.data?.token;
          const registrationEmail =
            accountType === "individual" ? form.email : form.contactEmail;
          console.log("api res ", registrationToken);

          if (registrationToken) {
            Cookies.set("reg_token", registrationToken);
          }
          sessionStorage.setItem("reg_email", registrationEmail);

          router.push("/auth/verify-email");
        } else {
          toast.error(postError);
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    const result = await postData(
      "/forgot-password",
      { email: form.email },
      false,
    );
    if (result) {
      toast.success("Reset instructions sent to your email.");
      setSuccess("Reset instructions sent to your email.");
    }
  };

  const title =
    type === "login"
      ? showForgotPw
        ? "Forgot Password"
        : "Welcome Back"
      : type === "signup"
        ? "Create Account"
        : type === "forgot-password"
          ? "Forgot Password"
          : type === "verify"
            ? "Verify Your Email"
            : "Reset Password";

  const btnLabel = loading
    ? "Processing…"
    : type === "login" && showForgotPw
      ? "Send Reset Link"
      : type === "login"
        ? "Sign In"
        : type === "signup"
          ? "Create Account"
          : type === "forgot-password"
            ? "Send Reset Link"
            : "Reset Password";

  return (
    <>
      <style>{CSS}</style>

      <div className="brd-page">
        {/* ── Brand mark ── */}
        <div className="brd-brand">
          <span className="brd-logo">BRD</span>
          <span className="brd-tagline">Marketplace</span>
        </div>

        <div className="brd-card">
          <h1 className="brd-title">{title}</h1>

          {/* ════════ VERIFY EMAIL ════════ */}
          {type === "verify" && (
            <>
              <div className="brd-verify-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </div>

              <p className="brd-sub brd-sub--center">
                We've sent a verification link to your email address. Please
                check your inbox (and spam folder) and click the link to
                activate your account.
              </p>

              {/* Disabled email display */}
              <div className="brd-field">
                <label>Email Address</label>
                <input
                  className="brd-input"
                  type="email"
                  value={verifyEmail}
                  disabled
                  readOnly
                />
              </div>

              {/* Resend button */}
              <button
                type="button"
                className="brd-btn brd-btn--outline"
                onClick={handleResendVerification}
                disabled={resendLoading || resendCooldown > 0}
              >
                {resendLoading ? (
                  <>
                    <span className="brd-spinner brd-spinner--accent" />
                    Sending…
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Resend in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 2L11 13" />
                      <path d="M21 2L14 22 11 13 2 10l19-8z" />
                    </svg>
                    Resend Verification Email
                  </>
                )}
              </button>

              <div className="brd-nav-links">
                <p>
                  Already verified?{" "}
                  <a href="/auth/login" className="brd-link-inline">
                    Sign in
                  </a>
                </p>
                <p>
                  Wrong email?{" "}
                  <a href="/auth/signup" className="brd-link-inline">
                    Sign up again
                  </a>
                </p>
              </div>
            </>
          )}

          {/* ── All non-verify types below ── */}
          {type !== "verify" && (
            <>
              {/* ── Account type toggle (signup only) ── */}
              {type === "signup" && (
                <div className="brd-type-toggle">
                  <button
                    type="button"
                    className={
                      accountType === "individual"
                        ? "brd-toggle-btn active"
                        : "brd-toggle-btn"
                    }
                    onClick={() => {
                      setAccountType("individual");
                      setErrors({});
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    Individual Buyer
                  </button>
                  <button
                    type="button"
                    className={
                      accountType === "company"
                        ? "brd-toggle-btn active"
                        : "brd-toggle-btn"
                    }
                    onClick={() => {
                      setAccountType("company");
                      setErrors({});
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    Company Buyer
                  </button>
                </div>
              )}

              {success && (
                <div className="brd-alert brd-alert--ok">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  {success}
                </div>
              )}
              {errors.general && (
                <div className="brd-alert brd-alert--err">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4m0 4h.01" />
                  </svg>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* ════════ LOGIN ════════ */}
                {type === "login" && !showForgotPw && (
                  <>
                    <FormInputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      errors={errors}
                      handle={handle}
                      required
                    />
                    <FormPwField
                      errors={errors}
                      handle={handle}
                      label="Password"
                      name="password"
                      value={form.password}
                      show={showPw}
                      toggleShow={() => setShowPw(!showPw)}
                    />
                    <div className="brd-row-spread">
                      <label className="brd-check">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="brd-link"
                        onClick={() => {
                          setShowForgotPw(true);
                          setErrors({});
                          setSuccess("");
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </>
                )}

                {/* ════════ FORGOT PW ════════ */}
                {((type === "login" && showForgotPw) ||
                  type === "forgot-password") && (
                  <>
                    <p className="brd-sub">
                      Enter your email and we'll send you a reset link.
                    </p>
                    <FormInputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={form.email}
                      errors={errors}
                      handle={handle}
                      required
                    />
                  </>
                )}

                {/* ════════ RESET PW ════════ */}
                {type === "reset-password" && (
                  <>
                    <FormInputField
                      label="Email Address"
                      name="email"
                      type="email"
                      errors={errors}
                      handle={handle}
                      value={form.email}
                      disabled={!!resetEmail}
                      required
                    />
                    <FormPwField
                      errors={errors}
                      handle={handle}
                      label="New Password"
                      name="password"
                      value={form.password}
                      show={showPw}
                      toggleShow={() => setShowPw(!showPw)}
                      small="Min 8 chars, one uppercase, one digit, one special character."
                    />
                    <FormPwField
                      errors={errors}
                      handle={handle}
                      label="Confirm New Password"
                      name="passwordConfirmation"
                      value={form.passwordConfirmation}
                      show={showConfirmPw}
                      toggleShow={() => setShowConfirmPw(!showConfirmPw)}
                    />
                  </>
                )}

                {/* ════════ SIGNUP — INDIVIDUAL ════════ */}
                {type === "signup" && accountType === "individual" && (
                  <>
                    <div className="brd-grid-2">
                      <FormInputField
                        label="First Name"
                        name="fname"
                        errors={errors}
                        handle={handle}
                        value={form.fname}
                        required
                      />
                      <FormInputField
                        label="Last Name"
                        name="lname"
                        errors={errors}
                        handle={handle}
                        value={form.lname}
                        required
                      />
                    </div>
                    <FormInputField
                      label="Email Address"
                      name="email"
                      type="email"
                      errors={errors}
                      handle={handle}
                      value={form.email}
                      required
                    />
                    <FormInputField
                      label="Phone Number"
                      name="phone"
                      errors={errors}
                      handle={handle}
                      type="tel"
                      value={form.phone}
                      placeholder="+92 300 1234567"
                      required
                    />
                    <FormPwField
                      errors={errors}
                      handle={handle}
                      label="Password"
                      name="password"
                      value={form.password}
                      show={showPw}
                      toggleShow={() => setShowPw(!showPw)}
                      small="Min 8 chars, one uppercase, one digit, one special character."
                    />
                    <FormPwField
                      errors={errors}
                      handle={handle}
                      label="Confirm Password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      show={showConfirmPw}
                      toggleShow={() => setShowConfirmPw(!showConfirmPw)}
                    />
                    <label className="brd-check brd-check--terms">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handle}
                      />
                      <span>
                        I agree to the{" "}
                        <a href="/terms" className="brd-link-inline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="brd-link-inline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="brd-err">{errors.agreeTerms}</p>
                    )}
                  </>
                )}

                {/* ════════ SIGNUP — COMPANY ════════ */}
                {type === "signup" && accountType === "company" && (
                  <>
                    <div className="brd-section-label">Company Information</div>
                    <FormInputField
                      label="Company Name"
                      name="companyName"
                      errors={errors}
                      handle={handle}
                      value={form.companyName}
                      required
                    />
                    <FormInputField
                      label="Registration Number"
                      name="regNumber"
                      errors={errors}
                      handle={handle}
                      value={form.regNumber}
                      placeholder="Optional"
                    />
                    <FormInputField
                      label="Company Address"
                      name="companyAddress"
                      errors={errors}
                      handle={handle}
                      value={form.companyAddress}
                      required
                    />
                    <FormInputField
                      label="Company Phone"
                      name="companyPhone"
                      type="tel"
                      errors={errors}
                      handle={handle}
                      value={form.companyPhone}
                      placeholder="+92 21 1234567"
                      required
                    />

                    <div className="brd-divider" />
                    <div className="brd-section-label">Contact Person</div>
                    <div className="brd-grid-2">
                      <FormInputField
                        label="First Name"
                        name="contactFname"
                        errors={errors}
                        handle={handle}
                        value={form.contactFname}
                        required
                      />
                      <FormInputField
                        label="Last Name"
                        name="contactLname"
                        errors={errors}
                        handle={handle}
                        value={form.contactLname}
                        required
                      />
                    </div>
                    <FormInputField
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      errors={errors}
                      handle={handle}
                      value={form.contactEmail}
                      required
                    />
                    <FormInputField
                      label="Contact Phone"
                      name="contactPhone"
                      type="tel"
                      errors={errors}
                      handle={handle}
                      value={form.contactPhone}
                      placeholder="+92 300 1234567"
                      required
                    />
                    <FormPwField
                      errors={errors}
                      handle={handle}
                      label="Password"
                      name="contactPassword"
                      value={form.contactPassword}
                      show={showPw}
                      toggleShow={() => setShowPw(!showPw)}
                      small="Min 8 chars, one uppercase, one digit, one special character."
                    />

                    <label className="brd-check brd-check--terms">
                      <input
                        type="checkbox"
                        name="companyAgreeTerms"
                        checked={form.companyAgreeTerms}
                        onChange={handle}
                      />
                      <span>
                        I agree to the{" "}
                        <a href="/terms" className="brd-link-inline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="brd-link-inline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {errors.companyAgreeTerms && (
                      <p className="brd-err">{errors.companyAgreeTerms}</p>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="brd-btn login-btn btn-hover"
                  disabled={loading}
                  data-testid="auth-submit-button"
                >
                  {loading ? (
                    <>
                      <span className="brd-spinner" />
                      Processing…
                    </>
                  ) : (
                    btnLabel
                  )}
                </button>
              </form>

              {/* ── Nav links ── */}
              <div className="brd-nav-links">
                {type === "login" && !showForgotPw && (
                  <p>
                    Don't have an account?{" "}
                    <a href="/auth/signup" className="brd-link-inline">
                      Sign up
                    </a>
                  </p>
                )}
                {type === "login" && showForgotPw && (
                  <p>
                    <button
                      type="button"
                      className="brd-link"
                      onClick={() => {
                        setShowForgotPw(false);
                        setErrors({});
                        setSuccess("");
                      }}
                    >
                      ← Back to login
                    </button>
                  </p>
                )}
                {type === "signup" && (
                  <p>
                    Already have an account?{" "}
                    <a href="/auth/login" className="brd-link-inline">
                      Sign in
                    </a>
                  </p>
                )}
                {type === "forgot-password" && (
                  <p>
                    <a href="/auth/login" className="brd-link-inline">
                      ← Back to login
                    </a>
                  </p>
                )}
                {type === "reset-password" && (
                  <p>
                    <a href="/auth/login" className="brd-link-inline">
                      ← Back to login
                    </a>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const CSS = `

  :root {
    --ink: #0a0a0a;
    --ink-light: #404040;
    --ink-muted: #888888;
    --surface: #f5f5f5;
    --surface-2: #ebebeb;
    --border: #e0e0e0;
    --accent: ${themeColors.primary};
    --accent-dark: #019a78;
    --accent-light: rgba(2, 171, 134, 0.1);
    --accent-ring: rgba(2, 171, 134, 0.2);
    --err: #d93025;
    --ok: ${themeColors.primary};
    --radius: 10px;
  }

  .brd-page {
    min-height: 100vh;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 16px 80px;
    font-family: var(--font-body);
    color: var(--ink);
  }

  .brd-brand {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 32px;
  }
  .brd-logo {
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 1.9rem;
    letter-spacing: .12em;
    color: var(--ink);
  }
  .brd-tagline {
    font-size: .75rem;
    font-weight: 500;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  .brd-card {
    width: 100%;
    max-width: 520px;
    background: #ffffff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px 40px 32px;
    box-shadow: 0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04);
  }
  @media (max-width: 560px) {
    .brd-card { padding: 28px 20px 24px; }
  }

  /* ── Verify email icon ── */
  .brd-verify-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: var(--accent-light);
    border: 1.5px solid rgba(2, 171, 134, 0.25);
    border-radius: 50%;
    margin: 0 auto 20px;
    color: var(--accent);
  }

  .brd-verified-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--accent-light);
    border: 1px solid rgba(2, 171, 134, 0.3);
    color: var(--accent);
    font-size: .82rem;
    font-weight: 600;
    letter-spacing: .04em;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .brd-title {
    font-family: var(--font-serif);
    font-size: 1.65rem;
    font-weight: 700;
    color: var(--ink);
    margin: 0 0 24px;
    letter-spacing: -.01em;
  }

  .brd-type-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 24px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 4px;
  }
  .brd-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px 8px;
    border: none;
    border-radius: 7px;
    background: transparent;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: .82rem;
    font-weight: 500;
    color: var(--ink-muted);
    transition: all .18s;
  }
  .brd-toggle-btn.active {
    background: #ffffff;
    color: var(--ink);
    box-shadow: 0 1px 6px rgba(0,0,0,.1);
  }
  .brd-toggle-btn.active svg { stroke: var(--accent); }

  .brd-sub {
    font-size: .88rem;
    color: var(--ink-light);
    margin: -4px 0 18px;
    line-height: 1.5;
  }
  .brd-sub--center {
    text-align: center;
    margin: 0 0 24px;
  }

  .brd-section-label {
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--accent);
    margin: 4px 0 14px;
  }

  .brd-divider {
    border: none;
    border-top: 1px dashed var(--border);
    margin: 20px 0 18px;
  }

  .brd-field {
    margin-bottom: 16px;
  }
  .brd-field label {
    display: block;
    font-size: .8rem;
    font-weight: 600;
    letter-spacing: .03em;
    color: var(--ink);
    margin-bottom: 5px;
  }
  .brd-field label span {
    color: var(--accent);
    margin-left: 2px;
  }

  .brd-input {
    width: 100%;
    padding: 10px 13px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    background: #ffffff;
    font-family: var(--font-body);
    font-size: .88rem;
    color: var(--ink);
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    box-sizing: border-box;
  }
  .brd-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-ring);
    background: #ffffff;
  }
  .brd-input--err { border-color: var(--err); }
  .brd-input--err:focus { box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.12); }
  .brd-input:disabled { opacity: .5; cursor: not-allowed; background: var(--surface-2); }

  select.brd-input { cursor: pointer; }

  .brd-pw-wrap { position: relative; }
  .brd-pw-wrap .brd-input { padding-right: 54px; }
  .brd-pw-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: .75rem;
    font-weight: 600;
    color: var(--ink-muted);
    letter-spacing: .04em;
    padding: 4px;
    transition: color .15s;
  }
  .brd-pw-toggle:hover { color: var(--accent); }

  .brd-hint { font-size: .75rem; color: var(--ink-muted); margin: 4px 0 0; }
  .brd-err  { font-size: .75rem; color: var(--err); margin: 4px 0 0; font-weight: 500; }

  .brd-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 440px) { .brd-grid-2 { grid-template-columns: 1fr; } }

  .brd-row-spread {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .brd-check {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: .83rem;
    color: var(--ink-light);
    user-select: none;
  }
  .brd-check input[type=checkbox] {
    width: 15px;
    height: 15px;
    cursor: pointer;
    flex-shrink: 0;
    accent-color: var(--accent);
  }
  .brd-check--terms { margin: 16px 0 4px; align-items: flex-start; }
  .brd-check--terms input { margin-top: 2px; }

  .brd-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 13px;
    margin-top: 24px;
    background: var(--accent);
    color: #ffffff;
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: .9rem;
    font-weight: 600;
    letter-spacing: .04em;
    cursor: pointer;
    transition: background .18s, transform .1s, box-shadow .18s;
  }
  .brd-btn:hover:not(:disabled) {
    background: var(--accent-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(2, 171, 134, 0.35);
  }
  .brd-btn:active:not(:disabled) { transform: translateY(0); box-shadow: none; }
  .brd-btn:disabled { opacity: .6; cursor: not-allowed; }

  /* ── Outline variant for resend button ── */
  .brd-btn--outline {
    background: transparent;
    color: var(--accent);
    border: 1.5px solid var(--accent);
    margin-top: 8px;
  }
  .brd-btn--outline:hover:not(:disabled) {
    background: var(--accent-light);
    color: var(--accent-dark);
    border-color: var(--accent-dark);
    box-shadow: none;
    transform: translateY(-1px);
  }

  .brd-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: brd-spin .7s linear infinite;
  }
  .brd-spinner--accent {
    border-color: rgba(2, 171, 134, 0.25);
    border-top-color: var(--accent);
  }
  @keyframes brd-spin { to { transform: rotate(360deg); } }

  .brd-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: .82rem;
    font-weight: 500;
    margin-bottom: 18px;
  }
  .brd-alert--ok  {
    background: var(--accent-light);
    border: 1px solid rgba(2, 171, 134, 0.3);
    color: var(--accent-dark);
  }
  .brd-alert--err {
    background: #fdf0ee;
    border: 1px solid #f0b8b2;
    color: var(--err);
  }

  .brd-link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: .83rem;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
    transition: color .15s;
  }
  .brd-link:hover { color: var(--accent-dark); text-decoration: underline; }

  .brd-link-inline {
    color: var(--accent);
    font-weight: 600;
    text-decoration: none;
    transition: color .15s;
  }
  .brd-link-inline:hover { color: var(--accent-dark); text-decoration: underline; }

  .brd-nav-links {
    text-align: center;
    margin-top: 20px;
    font-size: .83rem;
    color: var(--ink-muted);
  }
  .brd-nav-links p { margin: 6px 0; }
`;
