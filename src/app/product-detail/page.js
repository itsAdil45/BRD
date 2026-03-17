import CarAuctionDetails2 from "@/components/auction-details/CarAuctionDetails2";
import Breadcrumb2 from "@/components/common/Breadcrumb2";

export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
    title: "Product Detail",
  },
};
const AuctionDetails2Page = () => {
  return (
    <>
      <Breadcrumb2 pagetitle="Product Detail" currentPage="Product Detail" />
      <CarAuctionDetails2 />
    </>
  );
};

export default AuctionDetails2Page;
