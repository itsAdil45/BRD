import Breadcrumb2 from "@/components/common/Breadcrumb2";
import Link from "next/link";
import React from "react";
import ChangePassword from "@/content/ChangePassword";
export const metadata = {
  icons: {
    icon: "/assets/img/fav-icon.svg",
  },
};
import DashboardLayout from "@/components/common/DashboardLayout";

const ChangePasswordPage = () => {
  return (
    <DashboardLayout pagetitle="Change Password" currentPage="Change Password">
      <ChangePassword />
    </DashboardLayout>
  );
};

export default ChangePasswordPage;
