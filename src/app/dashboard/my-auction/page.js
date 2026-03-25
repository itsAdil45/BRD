import Breadcrumb2 from "@/components/common/Breadcrumb2";
import MultipurposeMyAuction from "@/components/dashboard/MultipurposeMyAuction";
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
      <Breadcrumb2 pagetitle={"My Auction"} currentPage={"My Auction"} />
      <MultipurposeMyAuction />
    </>
  );
};

export default MyAuctionPage;
