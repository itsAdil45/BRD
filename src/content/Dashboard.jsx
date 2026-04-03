"use client";
import React from "react";
import { useSession } from "next-auth/react";

const DashboardContent = () => {
  const { data: session, status } = useSession();
  return (
    <>
      <div className="dashboard-content-wrap">
        <div className="profile-info-wrap">
          <div className="profile-content">
            <h4>Hi, {session?.user?.name}</h4>
            <p>
              You Have Complete 10 Auction In Last Month. Start Your auction
              Today.
            </p>
          </div>
        </div>

        <div className="row g-lg-3 gy-4">
          {[
            { label: "Auction Attend", count: 280, variant: "" },
            { label: "Auction Win", count: 50, variant: "two" },
            { label: "Cancel Auction", count: 25, variant: "three" },
          ].map(({ label, count, variant }) => (
            <div key={label} className="col-lg-4">
              <div className={`single-counter-card ${variant}`.trim()}>
                <span>{label}</span>
                <h2>{count}</h2>
              </div>
            </div>
          ))}
        </div>

        <div className="bidding-summary-wrap">
          <h6>Bidding Summary</h6>
          <table className="bidding-summary-table">
            <thead>
              <tr>
                <th>Auction ID</th>
                <th>Product name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Auction Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "12584885455",
                  product: "Porcelain",
                  amount: "$1800",
                  status: "Winning",
                  date: "June 25, 2024",
                },
                {
                  id: "12584885482",
                  product: "Old Clocks",
                  amount: "$1900",
                  status: "Winning",
                  date: "June 13, 2024",
                },
                {
                  id: "12584885536",
                  product: "Manuscripts",
                  amount: "$2000",
                  status: "Cancel",
                  date: "June 2, 2024",
                },
                {
                  id: "12584885548",
                  product: "Renaissance Art",
                  amount: "$2100",
                  status: "Winning",
                  date: "June 8, 2024",
                },
                {
                  id: "12584885563",
                  product: "Impressionism Art",
                  amount: "$2200",
                  status: "Winning",
                  date: "June 21, 2024",
                },
                {
                  id: "12584885589",
                  product: "Romanticism Art",
                  amount: "$2300",
                  status: "Cancel",
                  date: "June 9, 2024",
                },
              ].map(({ id, product, amount, status, date }) => (
                <tr key={id}>
                  <td data-label="Auction ID">{id}</td>
                  <td data-label="Product name">{product}</td>
                  <td data-label="Amount">{amount}</td>
                  <td data-label="Status">
                    <span className={status === "Cancel" ? "cancel" : ""}>
                      {status}
                    </span>
                  </td>
                  <td data-label="Auction Date">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row pt-40">
          <div className="col-lg-12">
            <div className="inner-pagination-area two">
              <ul className="paginations">
                {["01", "02", "03"].map((page, i) => (
                  <li
                    key={page}
                    className={`page-item${i === 0 ? " active" : ""}`}
                  >
                    <a href="#">{page}</a>
                  </li>
                ))}
                <li className="page-item paginations-button">
                  <a href="#">
                    <svg
                      width={16}
                      height={13}
                      viewBox="0 0 16 13"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.557 10.1026L1.34284 1.89603M15.557 10.1026C12.9386 8.59083 10.8853 3.68154 12.7282 0.489511M15.557 10.1026C12.9386 8.59083 7.66029 9.2674 5.81744 12.4593"
                        strokeWidth="0.96"
                        strokeLinecap="round"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
