import DashboardLayout from "@/components/common/DashboardLayout";
import React from "react";
import Settings from "@/content/Settings";
export const metadata = {
  icons: { icon: "/assets/img/fav-icon.svg" },
};

const SettingsPage = () => {
  return (
    <DashboardLayout pagetitle="Profile" currentPage="Profile">
      <Settings />
    </DashboardLayout>
  );
};

export default SettingsPage;
