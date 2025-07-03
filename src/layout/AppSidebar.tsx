import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, GridIcon, ListIcon } from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { name: "Hệ thống", icon: <ListIcon />, path: "/system" },
  { icon: <GridIcon />, name: "Vốn bằng tiền", path: "/" },
  {
    name: "Mua hàng - Phải trả",
    icon: <ListIcon />,
    path: "/sales",
  },
  { name: "Bán hàng - Phải thu", icon: <ListIcon />, path: "/cash" },
  { name: "Hàng tồn kho", icon: <ListIcon />, path: "/purchases" },
  {
    name: "Tài sản cố định",
    icon: <ListIcon />,
    subItems: [
      { name: "Báo cáo phân hệ", path: "/fixed-assets/module-report" },
      { name: "Báo cáo quản trị", path: "/fixed-assets/depreciation-report" },
    ],
  },
  { name: "Công cụ dụng cụ", icon: <ListIcon />, path: "/tools" },
  { name: "Tiền lương", icon: <ListIcon />, path: "/payroll" },
  { name: "Chi phí giá thành", icon: <ListIcon />, path: "/costing" },
  {
    name: "Kế toán tổng hợp",
    icon: <ListIcon />,
    subItems: [
      { name: "Phiếu kế toán", path: "/general-ledger/create" },
      { name: "Danh sách phiếu kế toán", path: "/general-ledger/list" },
    ],
  },
  { name: "Chuyển dữ liệu từ Excel", icon: <ListIcon />, path: "/import-excel" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: "main"; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

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

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { type: "main", index }));
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col ">
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
      <div className="flex flex-col flex-grow overflow-y-auto px-5 py-4 no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col">
            <div>{renderMenuItems(navItems)}</div>
          </div>
        </nav>
      </div>

      {/* --- BOTTOM SECTION giống như ảnh --- */}
      <div className="px-5 py-4 border-t h-[400px]">
        <div className="flex flex-col gap-2 text-sm text-blue-700 h-[120px]">
          <Link to="/contact" className="hover:underline text-green-600 font-semibold text-center">
            Liên hệ với chúng tôi
          </Link>
          <button className="text-left hover:underline">+ Tìm kiếm</button>
          <button className="text-left hover:underline">+ DIAMON SOFT., JSC</button>
          <button className="text-left hover:underline">+ Nhắc việc</button>
        </div>
        <div className="mt-4">
          <img src="/images/logo/logo.jpg" alt="Diamond Soft" className="w-full h-[90px]" />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
