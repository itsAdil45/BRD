import Home2PopularAuction from "@/components/auction/Home2PopularAuction";
import Home2Banner from "@/components/banner/Home2Banner";

import Home2Category from "@/components/category/Home2Category";
import Home2Faq from "@/components/faq/Home2Faq";

import Home2latestAuction from "@/components/latest-auction/Home2latestAuction";
import Home2LogoSection from "@/components/logo-section/Home2LogoSection";

export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
    title: "Probid- Multi Vendor Auction and Bidding Next js Template.",
  },
};
export default function Home() {
  return (
    <>
      <Home2Banner />
      <Home2Category />
      <Home2latestAuction />
      <Home2PopularAuction />
      <Home2Faq />
      <Home2LogoSection />
    </>
  );
}
