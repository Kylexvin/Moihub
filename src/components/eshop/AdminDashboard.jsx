import { useState, useEffect } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import VendorApplications from "./components/vendors/VendorApplications";
import ShopsManagement from "./components/shops/ShopsManagement";
import CategoriesManagement from "./components/categories/CategoriesManagement";
import SettingsPage from "./components/settings/SettingsPage";

// Main Dashboard Component
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "vendors":
        return <VendorApplications />;
      case "shops":
        return <ShopsManagement />;
      case "categories":
        return <CategoriesManagement />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Header 
          activeTab={activeTab} 
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}