import Breadcrumb2 from "@/components/common/Breadcrumb2";
import Link from "next/link";
import React from "react";
export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
import DashboardLayout from "@/components/common/DashboardLayout";

const ChangePasswordPage = () => {
  return (
    <DashboardLayout pagetitle="Change Password" currentPage="Change Password">
      <div className="dashboard-content-wrap two">
        <div className="change-pass-wrap">
          <div className="edit-info-area">
            <h6>Update Your Password</h6>
            <form className="edit-info-form">
              <div className="row">
                <div className="col-md-12 mb-50">
                  <div className="form-inner">
                    <label>Old Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Htydh746fg@1’;po\"
                    />
                    <i className="bi bi-eye-slash" id="togglePassword" />
                  </div>
                </div>
                <div className="col-md-12 mb-30">
                  <div className="form-inner">
                    <label>New Password</label>
                    <input
                      id="password2"
                      type="password"
                      placeholder="Htydh746fg@1’;po\"
                    />
                    <i className="bi bi-eye-slash" id="togglePassword2" />
                  </div>
                </div>
                <div className="col-md-12 mb-60">
                  <div className="form-inner">
                    <label>Confirm Password</label>
                    <input
                      id="password3"
                      type="password"
                      placeholder="Htydh746fg@1’;po\"
                    />
                    <i
                      className="bi bi-eye-slash bi-eye"
                      id="togglePassword3"
                    />
                  </div>
                </div>
              </div>
              <button className="primary-btn btn-hover two">
                Change Password
                <span style={{ top: "40.5px", left: "84.2344px" }} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChangePasswordPage;
