"use client";
import React, { useEffect, useState } from "react";
import useGet from "@/customHooks/useGet";
import usePut from "@/customHooks/usePut";
import toast from "react-hot-toast";

const Settings = () => {
  const { data: profileData, loading: profileLoading } = useGet(
    "/profile",
    true,
    true,
  );
  const { put, loading: saving } = usePut();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    // company fields
    company_name: "",
    registration_number: "",
    company_phone: "",
    // company_address: "",
    contact_first_name: "",
    contact_last_name: "",
    contact_email: "",
    contact_phone: "",
  });

  const [accountType, setAccountType] = useState("individual");

  // Populate form once profile loads
  useEffect(() => {
    if (!profileData?.data) return;
    const d = profileData.data;
    const cp = d.company_profile || {};
    setAccountType(d.account_type || "individual");
    setForm({
      first_name: d.first_name || "",
      last_name: d.last_name || "",
      email: d.email || "",
      phone: d.phone || "",
      date_of_birth: d.date_of_birth || "",
      company_name: cp.company_name || "",
      registration_number: cp.registration_number || "",
      company_phone: cp.company_phone || "",
      //   company_address: cp.company_address || "",
      contact_first_name: cp.contact_first_name || "",
      contact_last_name: cp.contact_last_name || "",
      contact_email: cp.contact_email || "",
      contact_phone: cp.contact_phone || "",
    });
  }, [profileData]);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        date_of_birth: form.date_of_birth,
        ...(accountType === "company" && {
          company_profile: {
            company_name: form.company_name,
            registration_number: form.registration_number,
            company_phone: form.company_phone,
            // company_address: form.company_address,
            contact_first_name: form.contact_first_name,
            contact_last_name: form.contact_last_name,
            contact_email: form.contact_email,
            contact_phone: form.contact_phone,
          },
        }),
      };
      await put("/profile", payload);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save changes.");
    }
  };

  if (profileLoading) {
    return (
      <div className="dashboard-content-wrap two">
        <div className="settings-wrap">
          <div
            className="edit-info-area"
            style={{ textAlign: "center", padding: "60px 0" }}
          >
            <div className="brd-spinner-lg" />
            <p style={{ marginTop: 16, color: "#888" }}>Loading profile…</p>
          </div>
        </div>
        <style>{spinnerCss}</style>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-content-wrap two">
        <div className="settings-wrap">
          {/* ── Edit Information ── */}
          <div className="edit-info-area">
            <h6>Edit Your Information</h6>

            {/* Account type badge */}
            <div style={{ marginBottom: 20 }}>
              <span className={`acct-badge acct-badge--${accountType}`}>
                {accountType === "company" ? (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    Company Account
                  </>
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    Individual Account
                  </>
                )}
              </span>
            </div>

            <form className="edit-info-form" onSubmit={handleSave} noValidate>
              <div className="row">
                {/* First / Last name */}
                <div className="col-md-6 mb-30">
                  <div className="form-inner">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handle}
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-30">
                  <div className="form-inner">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handle}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Date of birth */}
                <div className="col-md-6 mb-30">
                  <div className="form-inner">
                    <label>Date of Birth (Optional)</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={form.date_of_birth}
                      onChange={handle}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-30">
                  <div className="form-inner">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handle}
                      placeholder="+971 50 000 0000"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="col-md-12 mb-30">
                  <div className="verify-area">
                    <div className="form-inner">
                      <label>
                        Email Address
                        {profileData?.data?.email_verified && (
                          <span className="verified-tag">
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handle}
                        placeholder="email@example.com"
                      />
                    </div>
                    {!profileData?.data?.email_verified && (
                      <button
                        type="button"
                        className="primary-btn btn-hover two black-bg"
                      >
                        Verify Email
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Company fields (only if company account) ── */}
                {accountType === "company" && (
                  <>
                    <div className="col-md-12">
                      <div className="section-divider">
                        <span>Company Information</span>
                      </div>
                    </div>

                    <div className="col-md-12 mb-30">
                      <div className="form-inner">
                        <label>Company Name</label>
                        <input
                          type="text"
                          name="company_name"
                          value={form.company_name}
                          onChange={handle}
                          placeholder="Company name"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-30">
                      <div className="form-inner">
                        <label>Registration Number</label>
                        <input
                          type="text"
                          name="registration_number"
                          value={form.registration_number}
                          onChange={handle}
                          placeholder="REG-0000"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-30">
                      <div className="form-inner">
                        <label>Company Phone</label>
                        <input
                          type="tel"
                          name="company_phone"
                          value={form.company_phone}
                          onChange={handle}
                          placeholder="+971 50 000 0000"
                        />
                      </div>
                    </div>

                    {/* <div className="col-md-12 mb-30">
                      <div className="form-inner">
                        <label>Company Address</label>
                        <input
                          type="text"
                          name="company_address"
                          value={form.company_address}
                          onChange={handle}
                          placeholder="Street, City, Country"
                        />
                      </div>
                    </div> */}

                    {/* Contact Person */}
                    <div className="col-md-12">
                      <div className="section-divider">
                        <span>Contact Person</span>
                      </div>
                    </div>

                    <div className="col-md-6 mb-30">
                      <div className="form-inner">
                        <label>Contact First Name</label>
                        <input
                          type="text"
                          name="contact_first_name"
                          value={form.contact_first_name}
                          onChange={handle}
                          placeholder="First name"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-30">
                      <div className="form-inner">
                        <label>Contact Last Name</label>
                        <input
                          type="text"
                          name="contact_last_name"
                          value={form.contact_last_name}
                          onChange={handle}
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-30">
                      <div className="form-inner">
                        <label>Contact Email</label>
                        <input
                          type="email"
                          name="contact_email"
                          value={form.contact_email}
                          onChange={handle}
                          placeholder="contact@company.com"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-30">
                      <div className="form-inner">
                        <label>Contact Phone</label>
                        <input
                          type="tel"
                          name="contact_phone"
                          value={form.contact_phone}
                          onChange={handle}
                          placeholder="+971 50 000 0000"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="primary-btn btn-hover two"
                disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                {saving ? (
                  <>
                    <span className="brd-spinner" /> Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{css}</style>
    </>
  );
};

export default Settings;

const spinnerCss = `
  .brd-spinner-lg {
    display: inline-block;
    width: 36px; height: 36px;
    border: 3px solid rgba(0,0,0,.1);
    border-top-color: #02ab86;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const css = `
  .acct-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: .75rem;
    font-weight: 600;
    letter-spacing: .05em;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .acct-badge--individual {
    background: rgba(2,171,134,.1);
    color: #019a78;
    border: 1px solid rgba(2,171,134,.25);
  }
  .acct-badge--company {
    background: rgba(59,130,246,.1);
    color: #2563eb;
    border: 1px solid rgba(59,130,246,.25);
  }

  .verified-tag {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-left: 8px;
    font-size: .7rem;
    font-weight: 600;
    color: #019a78;
    background: rgba(2,171,134,.08);
    border: 1px solid rgba(2,171,134,.2);
    padding: 2px 7px;
    border-radius: 20px;
    vertical-align: middle;
  }

  .section-divider {
    position: relative;
    text-align: center;
    margin: 8px 0 24px;
  }
  .section-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0; right: 0;
    height: 1px;
    background: #e5e7eb;
  }
  .section-divider span {
    position: relative;
    background: #fff;
    padding: 0 12px;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: #2563eb;
  }

  .brd-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
