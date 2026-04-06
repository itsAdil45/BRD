import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderForm = () => {
  const [formData, setFormData] = useState({
    country: "",
    port: "",
    inspection: "no",
    insurance: "no",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    partnerCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="mb-4 fw-bold" style={{ color: "#02ab86" }}>
            Order Vehicle
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            <h5 className="fw-semibold mb-3">Step 1: Total Car Price</h5>

            <div className="mb-3">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Country</option>
                <option value="pakistan">Pakistan</option>
                <option value="uae">UAE</option>
              </select>
            </div>

            <div className="mb-3">
              <select
                name="port"
                value={formData.port}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Port</option>
                <option value="karachi">Karachi</option>
                <option value="lahore">Lahore</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label d-block">Inspection</label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inspection"
                  value="yes"
                  checked={formData.inspection === "yes"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inspection"
                  value="no"
                  checked={formData.inspection === "no"}
                  onChange={handleChange}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label d-block">Insurance</label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="insurance"
                  value="yes"
                  checked={formData.insurance === "yes"}
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="insurance"
                  value="no"
                  checked={formData.insurance === "no"}
                  onChange={handleChange}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>

            <div className="alert" style={{ backgroundColor: "#f8f9fa" }}>
              <strong>Total Price</strong>
              <div className="text-muted small">
                Please select Port C&F + inspect
              </div>
            </div>

            {/* Step 2 */}
            <h5 className="fw-semibold mt-4 mb-3">Step 2: Inquiry</h5>

            <div className="mb-3">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                rows={4}
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="partnerCode"
                placeholder="Partner Code (Optional)"
                value={formData.partnerCode}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button
              type="submit"
              className="btn w-100 text-white"
              style={{ backgroundColor: "#02ab86" }}
            >
              Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
