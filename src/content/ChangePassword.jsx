"use client";
import usePost from "@/customHooks/usePost";
import React, { useState } from "react";
import { isStrongPassword } from "@/utils/validators/FormValidator";
import toast from "react-hot-toast";
const ENDPOINT = "/change-password";

export default function ChangePassword() {
  const { postData, loading } = usePost();

  const [form, setForm] = useState({
    current_password: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.current_password)
      e.current_password = "Current password is required.";
    if (!form.password) e.password = "New password is required.";
    else if (!isStrongPassword(form.password))
      e.password =
        "Min 8 chars, one uppercase, one digit, one special character.";
    if (!form.confirm_password)
      e.confirm_password = "Please confirm your password.";
    else if (form.password !== form.confirm_password)
      e.confirm_password = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const result = await postData(ENDPOINT, {
      current_password: form.current_password,
      password: form.password,
      confirm_password: form.confirm_password,
    });

    if (result) {
      setSuccess("Password changed successfully!");
      toast.success("Password changed successfully!");
      setForm({ current_password: "", password: "", confirm_password: "" });
    }
  };

  const togglePw = (field) => setShowPw((p) => ({ ...p, [field]: !p[field] }));

  const fields = [
    {
      name: "current_password",
      label: "Old Password",
      id: "togglePassword",
      toggle: "current",
    },
    {
      name: "password",
      label: "New Password",
      id: "togglePassword2",
      toggle: "new",
    },
    {
      name: "confirm_password",
      label: "Confirm Password",
      id: "togglePassword3",
      toggle: "confirm",
    },
  ];

  return (
    <div className="dashboard-content-wrap two">
      <div className="change-pass-wrap">
        <div className="edit-info-area">
          <h6>Update Your Password</h6>

          {success && (
            <div className="brd-alert brd-alert--ok" style={alertStyle("ok")}>
              ✓ {success}
            </div>
          )}
          {errors.general && (
            <div className="brd-alert brd-alert--err" style={alertStyle("err")}>
              {errors.general}
            </div>
          )}

          <form className="edit-info-form" onSubmit={handleSubmit} noValidate>
            <div className="row">
              {fields.map(({ name, label, id, toggle }, i) => (
                <div
                  key={name}
                  className={`col-md-12 ${i < 2 ? "mb-50" : "mb-60"}`}
                >
                  <div className="form-inner" style={{ position: "relative" }}>
                    <label>{label}</label>
                    <input
                      id={id}
                      name={name}
                      type={showPw[toggle] ? "text" : "password"}
                      placeholder="••••••••"
                      value={form[name]}
                      onChange={handle}
                      style={errors[name] ? { borderColor: "#d93025" } : {}}
                    />
                    <i
                      className={`bi ${showPw[toggle] ? "bi-eye" : "bi-eye-slash"}`}
                      id={`${id}Toggle`}
                      onClick={() => togglePw(toggle)}
                      style={eyeStyle}
                    />
                    {errors[name] && <p style={errStyle}>{errors[name]}</p>}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="primary-btn btn-hover two"
              disabled={loading}
            >
              {loading ? "Processing…" : "Change Password"}
              <span />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const eyeStyle = {
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  color: "#888",
};

const errStyle = {
  color: "#d93025",
  fontSize: "0.75rem",
  margin: "4px 0 0",
  fontWeight: 500,
};

const alertStyle = (type) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "0.82rem",
  fontWeight: 500,
  marginBottom: "18px",
  background: type === "ok" ? "rgba(2,171,134,0.1)" : "#fdf0ee",
  border: `1px solid ${type === "ok" ? "rgba(2,171,134,0.3)" : "#f0b8b2"}`,
  color: type === "ok" ? "#019a78" : "#d93025",
});
