import Breadcrumb1 from "@/components/common/Breadcrumb1";
import MultipurposeMyAuction from "@/components/dashboard/MultipurposeMyAuction";
import Footer from "@/components/footer/Footer2";
import InnerPageHeader1 from "@/components/header/InnerPageHeader1";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
const MyAuctionPage = () => {
  return (
    <>
      <Breadcrumb1 pagetitle={"My Auction"} currentPage={"My Auction"} />
      <MultipurposeMyAuction />
    </>
  );
};

export default MyAuctionPage;
