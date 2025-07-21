import { Outlet } from "react-router";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
import SidebarMenu from "./SidebarMenu";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="h-screen overflow-hidden">
      <AppHeader />
      <SidebarMenu />

      <div className="flex pt-20 h-full">
        {" "}
        <AppSidebar />
        <Backdrop />
        <main
          className={`
            flex-1 overflow-y-auto transition-all duration-300 ease-in-out
            ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"}
            ${isMobileOpen ? "ml-0" : ""}
             pb-4
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
