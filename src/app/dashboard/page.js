import DashboardLayout from "@/components/common/DashboardLayout";
import React from "react";
import DashboardContent from "@/content/Dashboard";
export const metadata = {
  icons: { icon: "/assets/img/fav-icon.svg" },
};

const DashboardPage = () => {
  return (
    <DashboardLayout pagetitle="Profile" currentPage="Profile">
      <DashboardContent />
    </DashboardLayout>
  );
};

export default DashboardPage;
