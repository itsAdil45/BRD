import Breadcrumb1 from "@/components/common/Breadcrumb1";

import HowTobuy from "@/components/how-to-buy/HowTobuy";

export const metadata = {
  title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
const Home1AboutowToBuyPage = () => {
  return (
    <>
      <Breadcrumb1 currentPage={"How to Bid"} pagetitle={"How to Bid"} />
      <HowTobuy />
    </>
  );
};

export default Home1AboutowToBuyPage;
