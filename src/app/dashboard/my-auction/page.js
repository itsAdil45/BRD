import Breadcrumb2 from "@/components/common/Breadcrumb2";
import MultipurposeMyAuction from "@/components/dashboard/MultipurposeMyAuction";
import DashboardLayout from "@/components/common/DashboardLayout";

import React from "react";
export const metadata = {
  title: "CPEMS- Multi Vendor Auction and Bidding Platform",
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
const MyAuctionPage = () => {
  return (
    <DashboardLayout pagetitle="My Auction" currentPage="My Auction">
      <MultipurposeMyAuction />
    </DashboardLayout>
  );
};

export default MyAuctionPage;
