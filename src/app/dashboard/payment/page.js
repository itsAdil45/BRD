import DashboardLayout from "@/components/common/DashboardLayout";
import React from "react";

export const metadata = {
  icons: { icon: "/assets/img/fav-icon.svg" },
};

const paymentIcons = [
  "visa",
  "american-express",
  "discover",
  "mastercard",
  "stripe",
  "paypal",
  "skrill",
];

const PaymentPage = () => {
  return (
    <>
      {/* Add Payment Modal */}
      <div
        className="modal fade add-payment-modal"
        id="addPaymentModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="close-btn" data-bs-dismiss="modal"></div>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add new credit/debit card
              </h5>
            </div>
            <div className="modal-body">
              <form>
                <div className="row g-4">
                  <div className="col-md-12">
                    <div className="form-inner">
                      <label>Card Number</label>
                      <input type="text" placeholder="1234  1234  1234  1234" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-inner">
                      <label>Expiration date</label>
                      <input type="text" placeholder="MM/YEAR" />
                    </div>
                  </div>
                  <div className="col-md-6 mb-20">
                    <div className="form-inner">
                      <label>CVV</label>
                      <input type="text" placeholder="CVC" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-inner">
                      <button className="primary-btn btn-hover" type="submit">
                        Add Payment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DashboardLayout pagetitle="Payment" currentPage="Payment">
        <div className="dashboard-content-wrap">
          <div className="payment-wrap">
            <h6>Manage your Payment Methods</h6>
            <div className="payment-content-wrap">
              <div className="saved-card-area">
                <div className="single-card">
                  <img
                    src="/assets/img/inner-pages/dashboard-payment-card-img.png"
                    alt=""
                  />
                  <div className="card-details">
                    <h6>John Smith</h6>
                    <span>4143 **** **** **62</span>
                  </div>
                </div>
                <div className="add-payment-area">
                  <div
                    className="add-btn"
                    data-bs-toggle="modal"
                    data-bs-target="#addPaymentModal"
                  >
                    <svg
                      width={30}
                      height={30}
                      viewBox="0 0 30 30"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14.9992 30C13.8733 30 12.9609 29.0877 12.9609 27.9617V2.03826C12.9609 0.912327 13.8733 0 14.9992 0C16.1251 0 17.0375 0.912327 17.0375 2.03826V27.9617C17.0375 29.0877 16.1251 30 14.9992 30Z" />
                      <path d="M27.9617 17.0382H2.03826C0.912327 17.0382 0 16.1259 0 14.9999C0 13.874 0.912327 12.9617 2.03826 12.9617H27.9617C29.0877 12.9617 30 13.874 30 14.9999C30 16.1259 29.0877 17.0382 27.9617 17.0382Z" />
                    </svg>
                    <span>Add Payment Method</span>
                  </div>
                </div>
              </div>

              <div className="payment-options">
                <h6>Payment On Your</h6>
                <ul>
                  {paymentIcons.map((name) => (
                    <li key={name}>
                      <img
                        src={`/assets/img/inner-pages/icon/${name}.svg`}
                        alt={name}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default PaymentPage;
