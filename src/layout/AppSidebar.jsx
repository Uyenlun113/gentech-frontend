import {
  Banknote,
  BookOpenCheck,
  Boxes,
  Building2,
  ClipboardList,
  FileBarChart2,
  FileInput,
  HandCoins,
  Settings,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon } from "../icons";

const navItems = [
  { name: "Hệ thống", icon: <Settings />, path: "/system" },
  { name: "Vốn bằng tiền", icon: <Banknote />, path: "/" },
  {
    name: "Mua hàng - Phải trả",
    icon: <ShoppingCart />,
    path: "/sales",
  },
  { name: "Bán hàng - Phải thu", icon: <HandCoins />, path: "/cash" },
  { name: "Hàng tồn kho", icon: <Boxes />, path: "/purchases" },
  {
    name: "Tài sản cố định",
    icon: <Building2 />,
    subItems: [
      { name: "Báo cáo phân hệ", path: "/fixed-assets/module-report" },
      { name: "Báo cáo quản trị", path: "/fixed-assets/depreciation-report" },
    ],
  },
  { name: "Công cụ dụng cụ", icon: <ClipboardList />, path: "/tools" },
  { name: "Tiền lương", icon: <Wallet />, path: "/payroll" },
  { name: "Chi phí giá thành", icon: <FileBarChart2 />, path: "/costing" },
  {
    name: "Kế toán tổng hợp",
    icon: <BookOpenCheck />,
    subItems: [
      { name: "Phiếu kế toán", path: "/general-ledger/create" },
      { name: "Danh sách phiếu kế toán", path: "/general-ledger/list" },
    ],
  },
  { name: "Chuyển dữ liệu từ Excel", icon: <FileInput />, path: "/import-excel" },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let matched = false;
    navItems.forEach((nav, index) => {
      nav.subItems?.forEach((subItem) => {
        if (isActive(subItem.path)) {
          setOpenSubmenu({ type: "main", index });
          matched = true;
        }
      });
    });

    if (!matched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { type: "main", index }));
  };

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text font-normal">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text font-normal">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      {(subItem.new || subItem.pro) && (
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`menu-dropdown-badge ${
                                isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                              }`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`menu-dropdown-badge ${
                                isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                              }`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`
    fixed left-0 flex flex-col h-screen
    bg-white dark:bg-gray-900 text-gray-900 border-r border-gray-200 z-40 transition-all duration-300 ease-in-out
    ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
  `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* === MAIN CONTENT WITH SCROLL === */}
      <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col">
            <div>{renderMenuItems(navItems)}</div>
          </div>
        </nav>
      </div>

      {/* === BOTTOM SECTION STICKY TO BOTTOM === */}
      <div className="px-5 py-4 border-t h-[330px]">
        <div className="flex flex-col gap-2 text-blue-700 text-xs">
          <Link to="/contact" className="hover:underline text-green-600 font-semibold text-center">
            Liên hệ với chúng tôi
          </Link>
          <button className="text-left hover:underline">+ Tìm kiếm</button>
          <button className="text-left hover:underline">+ DIAMON SOFT., JSC</button>
          <button className="text-left hover:underline">+ Nhắc việc</button>
        </div>
        <div className="mt-4">
          <img src="/images/logo/logo.jpg" alt="Diamond Soft" className="mx-auto w-[70%] h-[60px]" />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
