import DashboardLayout from "@/components/common/DashboardLayout";
import React from "react";

export const metadata = {
  icons: { icon: "/assets/img/fav-icon.svg" },
};

const SettingsPage = () => {
  return (
    <DashboardLayout pagetitle="Profile" currentPage="Profile">
      <div className="dashboard-content-wrap two">
        <div className="settings-wrap">
          <div className="edit-info-area mb-30">
            <h6>Edit Your Profile Picture</h6>
            <div className="edit-profile-img-area">
              <div className="profile-img">
                <img
                  src="/assets/img/inner-pages/dashbaord-edit-profile-img.png"
                  alt=""
                />
              </div>
              <div className="upload-img-area">
                <h6>Upload Your Image</h6>
                <form>
                  <div className="upload-filed">
                    <input type="file" />
                  </div>
                </form>
                <span>JPEG 100 x 100</span>
              </div>
            </div>
          </div>

          <div className="edit-info-area">
            <h6>Edit Your Information</h6>
            <form className="edit-info-form">
              <div className="row">
                <div className="col-md-6 mb-30">
                  <div className="form-inner">
                    <label>First Name</label>
                    <input type="text" placeholder="Md. Rofiqul" />
                  </div>
                </div>
                <div className="col-md-6 mb-30">
                  <div className="form-inner">
                    <label>Last Name</label>
                    <input type="text" placeholder="Islam" />
                  </div>
                </div>
                <div className="col-md-12 mb-50">
                  <div className="form-inner">
                    <label>Your Address</label>
                    <input
                      type="text"
                      placeholder="House 168/170, Road 02, Avenue 01, Mirpur DOHS, Dhaka, Bangladesh"
                    />
                  </div>
                </div>
                <div className="col-md-12 mb-30">
                  <div className="verify-area">
                    <div className="form-inner">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="shimanto.nits@gmail.com"
                      />
                    </div>
                    <button className="primary-btn btn-hover two black-bg">
                      Verify Email
                    </button>
                  </div>
                </div>
                <div className="col-md-12 mb-60">
                  <div className="verify-area">
                    <div className="form-inner">
                      <label>Phone Number</label>
                      <input type="text" placeholder="+880 179 671 3831" />
                    </div>
                    <button className="primary-btn btn-hover two black-bg">
                      Verify Phone
                    </button>
                  </div>
                </div>
              </div>
              <button className="primary-btn btn-hover two">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
