"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Hardcoded credentials
const HARDCODED_EMAIL = "user@example.com";
const HARDCODED_PASSWORD = "password123";

export default function AuthForm({ type }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
    confirmPassword: "",
    passwordConfirmation: "",
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "reset-password") {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (token && email) {
        setResetToken(token);
        setResetEmail(decodeURIComponent(email));
        setForm((prev) => ({ ...prev, email: decodeURIComponent(email) }));
      }
    }
  }, [type, searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!form.email) {
      setErrorMessage("Please enter your email address");
      return;
    }

    setSuccessMessage(
      "Password reset instructions have been sent to your email address.",
    );
    setShowForgotPassword(false);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirmation) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }

    setSuccessMessage(
      "Password has been reset successfully! You can now login with your new password.",
    );
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (type === "forgot-password") {
      return handleForgotPassword(e);
    }

    if (type === "reset-password") {
      return handleResetPassword(e);
    }

    if (type === "login" && showForgotPassword) {
      return handleForgotPassword(e);
    }

    if (type === "login" && !showForgotPassword) {
      setLoading(true);
      try {
        // Hardcoded credential check
        if (
          form.email === HARDCODED_EMAIL &&
          form.password === HARDCODED_PASSWORD
        ) {
          setSuccessMessage("Login Successful!");
          router.push("/");
        } else {
          setErrorMessage("Invalid Credentials!");
        }
      } catch (error) {
        setErrorMessage("An error occurred during login");
      } finally {
        setLoading(false);
      }
    } else if (type === "signup") {
      if (form.password !== form.confirmPassword) {
        setErrorMessage("Passwords do not match!");
        return;
      }

      // Simulate successful registration
      setSuccessMessage("Registration successful! Please login.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    }
  };

  const getFormTitle = () => {
    switch (type) {
      case "login":
        return showForgotPassword ? "Forgot Password" : "Login";
      case "signup":
        return "Sign Up";
      case "forgot-password":
        return "Forgot Password";
      case "reset-password":
        return "Reset Password";
      default:
        return "Authentication";
    }
  };

  const getSubmitButtonText = () => {
    if (loading) return "Processing...";

    switch (type) {
      case "login":
        return showForgotPassword ? "Send Reset Instructions" : "Sign In";
      case "signup":
        return "Create Account";
      case "forgot-password":
        return "Send Reset Instructions";
      case "reset-password":
        return "Reset Password";
      default:
        return "Submit";
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">{getFormTitle()}</h2>

      {successMessage && (
        <div className="alert alert-success mb-4" role="alert">
          {successMessage}
        </div>
      )}

      <div className="border p-4 rounded">
        {/* Signup Fields */}
        {type === "signup" && (
          <>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="fname"
                value={form.fname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lname"
                value={form.lname}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {/* Email Field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={type === "reset-password" && resetEmail}
            required
          />
        </div>

        {/* Login Password Field */}
        {type === "login" && !showForgotPassword && (
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Signup Password Fields */}
        {type === "signup" && (
          <>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {/* Reset Password Fields */}
        {type === "reset-password" && (
          <>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength="8"
                required
              />
              <small className="form-text text-muted">
                Password must be at least 8 characters long.
              </small>
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                name="passwordConfirmation"
                value={form.passwordConfirmation}
                onChange={handleChange}
                minLength="8"
                required
              />
            </div>
          </>
        )}

        {/* Remember Me */}
        {type === "login" && !showForgotPassword && (
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          className="btn btn-dark w-100"
          disabled={loading}
          onClick={handleSubmit}
          data-testid="auth-submit-button"
        >
          {getSubmitButtonText()}
        </button>
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Navigation Links */}
      <div className="text-center mt-3">
        {type === "login" && !showForgotPassword && (
          <>
            <p>
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => setShowForgotPassword(true)}
                style={{ textDecoration: "none" }}
              >
                Forgot your password?
              </button>
            </p>
            <p>
              Don&apos;t have an account? <a href="/auth/signup">Sign up</a>
            </p>
          </>
        )}

        {type === "login" && showForgotPassword && (
          <p>
            Remember your password?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => {
                setShowForgotPassword(false);
                setSuccessMessage("");
                setErrorMessage("");
              }}
              style={{ textDecoration: "none" }}
            >
              Back to login
            </button>
          </p>
        )}

        {type === "signup" && (
          <p>
            Already have an account? <a href="/auth/login">Sign in</a>
          </p>
        )}

        {type === "forgot-password" && (
          <p>
            Remember your password? <a href="/auth/login">Back to login</a>
          </p>
        )}

        {type === "reset-password" && (
          <p>
            <a href="/auth/login">Back to login</a>
          </p>
        )}
      </div>
    </div>
  );
}
