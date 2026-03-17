import Breadcrumb2 from "@/components/common/Breadcrumb2";
import CarAuctionSidebar from "@/components/auction-sidebar/CarAuctionSidebar";
export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
    title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
  },
};
const AuctionSidebarPage = () => {
  return (
    <>
      <Breadcrumb2 pagetitle="Shop" currentPage="Shop" />
      <CarAuctionSidebar />
    </>
  );
};

export default AuctionSidebarPage;
