import Breadcrumb2 from "@/components/common/Breadcrumb2";
import HowToSell from "@/components/how-to-sell/HowToSell";

export const metadata = {
  title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
const HowToSellPage = () => {
  return (
    <>
      <Breadcrumb2 currentPage={"How To Sell"} pagetitle={"How To Sell"} />
      <HowToSell />
    </>
  );
};

export default HowToSellPage;
