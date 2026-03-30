import Breadcrumb2 from "@/components/common/Breadcrumb2";

import HowTobuy from "@/components/how-to-buy/HowTobuy";

export const metadata = {
  title: "CPEMS- Multi Vendor Auction and Bidding Platform",
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
const Home1AboutowToBuyPage = () => {
  return (
    <>
      <Breadcrumb2 currentPage={"How to Bid"} pagetitle={"How to Bid"} />
      <HowTobuy />
    </>
  );
};

export default Home1AboutowToBuyPage;
