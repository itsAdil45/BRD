import DashboardLayout from "@/components/common/DashboardLayout";
import React from "react";
import Addresses from "@/content/Addresses";
export const metadata = {
  icons: { icon: "/assets/img/fav-icon.svg" },
};

const AddressesPage = () => {
  return (
    <>
      <DashboardLayout pagetitle="Addresses" currentPage="Addresses">
        <Addresses />
      </DashboardLayout>
    </>
  );
};

export default AddressesPage;
