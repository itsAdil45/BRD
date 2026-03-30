import Breadcrumb2 from "@/components/common/Breadcrumb2";
import DashboardSidebar from "@/components/common/DashboardSidebar";

const DashboardLayout = ({ pagetitle, currentPage, children }) => {
  return (
    <>
      <Breadcrumb2 pagetitle={pagetitle} currentPage={currentPage} />
      <div className="dashboard-section pt-110 mb-110">
        <div className="container">
          <div className="dashboard-wrapper">
            <DashboardSidebar />
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
