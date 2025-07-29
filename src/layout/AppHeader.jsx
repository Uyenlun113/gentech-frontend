import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import TonKhoDauKyModal from "../components/TonKhoDauKyModal";
import SoDuDauKyModal from "../pages/Sddk/SoDuDauKyModal";

const AppHeader = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTonKhoModalOpen, setIsTonKhoModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate(); // Thêm hook navigate

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleMenuItemClick = (path) => {
    // Đóng dropdown trước
    setActiveDropdown(null);

    // Kiểm tra nếu là item "Vào số dư đầu kỳ tài khoản"
    if (path === "/dau-ky/sodu-tk") {
      setIsModalOpen(true);
    } else if (path === "/dau-ky/tonkho") {
      // Kiểm tra nếu là item "Vào tồn kho đầu kỳ"
      setIsTonKhoModalOpen(true);
    } else {
      // Navigate cho các item khác
      navigate(path);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeTonKhoModal = () => {
    setIsTonKhoModalOpen(false);
  };

  const menuItems = [
    {
      label: "Đầu kỳ",
      hasDropdown: true,
      items: [
        { label: "1. Vào số dư đầu kỳ tài khoản", path: "/dau-ky/sodu-tk" },
        { label: "2. Vào tồn kho đầu kỳ", path: "/dau-ky/tonkho" },
        { label: "3. Vào số dư đầu kỳ tài khoản ngoài bảng", path: "/dau-ky/ngoai-bang" },
        { label: "4. Vào số dư đầu cho các chứng từ có hạn thanh toán", path: "/dau-ky/han-thanh-toan" },
        { label: "5. Kế hoạch", path: "/dau-ky/ke-hoach" },
      ],
    },
    {
      label: "Chứng từ",
      hasDropdown: true,
      items: [
        { label: "1. Phiếu thu tiền mặt", path: "/chung-tu/phieu-thu" },
        { label: "2. Phiếu chi tiền mặt", path: "/phieu-chi-tien-mat" },
        { label: "3. Báo có ngân hàng", path: "/chung-tu/bao-co" },
        { label: "4. Báo nợ ngân hàng", path: "/chung-tu/bao-no" },
        { label: "a. Đơn đặt hàng mua", path: "/chung-tu/don-dat-hang-mua" },
        { label: "b. Đơn đặt hàng bán", path: "/chung-tu/don-dat-hang-ban" },
        { label: "c. Phiếu nhập mua", path: "/chung-tu/phieu-nhap-mua" },
        { label: "d. Chi phí vận chuyển", path: "/chung-tu/chi-phi-van-chuyen" },
        { label: "5. Phiếu nhập thành phẩm", path: "/chung-tu/phieu-nhap-tp" },
        { label: "6. Phiếu nhập kho", path: "/chung-tu/phieu-nhap-kho" },
        { label: "7. Hóa đơn bán hàng", path: "/chung-tu/hoa-don-ban-hang" },
        { label: "8. Hàng bán bị trả lại", path: "/chung-tu/tra-lai" },
        { label: "e. Phiếu xuất kho", path: "/chung-tu/phieu-xuat-kho" },
        { label: "f. Phiếu xuất lắp ráp", path: "/chung-tu/phieu-xuat-lap-rap" },
        { label: "g. Phiếu bù trừ công nợ", path: "/chung-tu/bu-tru" },
        { label: "h. Phiếu kế toán khác", path: "/chung-tu/phieu-ke-toan-khac" },
        { label: "j. Chứng từ ngoài bảng", path: "/chung-tu/ngoai-bang" },
        { label: "k. Quản lí tài sản", path: "/chung-tu/tai-san" },
        { label: "l. Quản lí công cụ dụng cụ", path: "/chung-tu/cong-cu" },
      ],
    },
    {
      label: "Danh mục",
      hasDropdown: true,
      items: [
        { label: "1. Danh mục tài khoản", path: "/category/account" },
        { label: "2. Danh mục nhóm đối tượng", path: "/category/dmnhkh" },
        { label: "3. Danh mục đối tượng", path: "/category/customer" },
        { label: "4. Danh mục sản phẩm (công trình)", path: "/danh-muc/san-pham" },
        { label: "5. Danh mục yếu tố chi phí", path: "/danh-muc/yto-chi-phi" },
        { label: "6. Danh mục hợp đồng", path: "/danh-muc/hop-dong" },
        { label: "7. Danh mục khoản mục phí", path: "/danh-muc/khoan-muc-phi" },
        { label: "8. Danh mục hình thức thanh toán", path: "/danh-muc/thanh-toan" },
        { label: "9. Danh mục kho hàng hóa", path: "/category/dmkho" },
        { label: "a. Danh mục vàng, đá bán", path: "/danh-muc/vang-da" },
        { label: "b. Danh mục nhóm vật tư hàng hóa", path: "/category/material-group" },
        { label: "c. Danh mục vật tư hàng hóa", path: "/category/dmvt" },
        { label: "d. Danh mục biểu thuế", path: "/danh-muc/bieu-thue" },
        { label: "đ. Danh mục nguồn vốn", path: "/danh-muc/nguon-von" },
        { label: "e. Danh mục mức độ dịch vụ dùng", path: "/danh-muc/muc-do-dv" },
        { label: "f. Danh mục lý do tăng giảm", path: "/danh-muc/ly-do" },
        { label: "g. Danh mục bộ phận", path: "/danh-muc/bo-phan" },
      ],
    },
    {
      label: "Cuối kỳ",
      hasDropdown: true,
      items: [
        { label: "1. Hạch toán công cụ dụng cụ", path: "/cuoi-ky/hachtoan-ccdc" },
        { label: "2. Tính khấu hao TSCD", path: "/cuoi-ky/khau-hao-tscd" },
        { label: "3. Tính giá vốn hàng xuất", path: "/cuoi-ky/gia-von" },
        { label: "4. Tiền lương", path: "/cuoi-ky/tien-luong" },
        { label: "5. Chênh lệch tỷ giá tự động", path: "/cuoi-ky/chenh-lech-ty-gia" },
        { label: "6. Tính giá thành sản phẩm", path: "/cuoi-ky/gia-thanh" },
        { label: "7. Bút toán khóa sổ", path: "/cuoi-ky/khoa-so" },
        { label: "8. Kiểm kê vật tư, hàng hóa", path: "/cuoi-ky/kiem-ke" },
        { label: "9. Tính lại tồn kho tức thời", path: "/cuoi-ky/tinh-lai-ton-kho" },
        { label: "10. Kiểm tra số liệu", path: "/cuoi-ky/kiem-tra" },
      ],
    },
    {
      label: "Báo cáo",
      hasDropdown: true,
      items: [
        { label: "1. Báo cáo công nợ", path: "/bao-cao/cong-no" },
        { label: "2. Báo cáo TSCD", path: "/bao-cao/tscd" },
        { label: "3. Các báo cáo chi phí - giá thành", path: "/bao-cao/chi-phi" },
        { label: "4. Báo cáo vật tư - hàng hóa", path: "/bao-cao/vattu" },
        { label: "5. Báo cáo thuế", path: "/bao-cao/thue" },
        { label: "6. Báo cáo quyết toán - tài chính", path: "/bao-cao/quyet-toan" },
        { label: "7. Báo cáo lương", path: "/bao-cao/luong" },
        { label: "8. Báo cáo quản trị", path: "/bao-cao/quan-tri" },
        { label: "a. Sổ kế toán theo hình thức nhật ký chung", path: "/bao-cao/so-nhat-ky-chung" },
        { label: "b. Sổ kế toán theo hình thức chứng từ ghi sổ", path: "/bao-cao/so-ctgs" },
        { label: "c. Sổ kế toán theo hình thức nhật ký chứng từ", path: "/bao-cao/so-nkct" },
        { label: "d. Sổ kế toán theo hình thức sổ cái", path: "/bao-cao/so-cai" },
        { label: "e. Báo cáo danh mục", path: "/bao-cao/danh-muc" },
      ],
    },
    {
      label: "Hệ thống",
      hasDropdown: true,
      items: [
        { label: "1. Tỷ giá hạch toán", path: "/he-thong/ty-gia" },
        { label: "2. Danh mục nhân viên", path: "/he-thong/nhan-vien" },
        { label: "3. Danh mục giá bán", path: "/he-thong/gia-ban" },
        { label: "4. Khai báo đại lý thuế", path: "/he-thong/dai-ly-thue" },
      ],
    },
  ];

  const menuHeader = [
    {
      name: "Báo cáo nhanh",
      path: "/quick-report",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      name: "Báo cáo tài chính",
      path: "/reporting",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      name: "Hóa đơn điện tử",
      path: "/reporting",
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    {
      name: "Kết nối ngân hàng",
      path: "/reporting",
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
    {
      name: "Nộp thuế điện tử",
      path: "/reporting",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
        {/* Main Header */}
        <div className="px-4 lg:px-6">
          <div className="flex items-center justify-between h-[70px]">
            <div className="items-center space-x-2">
              <div className="flex items-center space-x-3">
                <Link to="/">
                  <img src="/images/logo/GenTech-logo.png" alt="Logo" className="w-8 h-8" />
                </Link>
                <div className="text-sl font-medium text-gray-900 dark:text-white">
                  <div>Công ty TNHH Công Nghệ GenTech</div>
                </div>
              </div>
              <div className="hidden lg:flex flex-1 justify-center mt-2">
                <nav className="flex space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {menuItems.map((item, index) => (
                    <div key={index} className="relative">
                      <button
                        onClick={() => item.hasDropdown && toggleDropdown(`menu-${index}`)}
                        className="flex items-center space-x-1 px-2 py-1 hover:text-blue-600 dark:hover:text-white"
                      >
                        <span>{item.label}</span>
                        {item.hasDropdown && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              activeDropdown === `menu-${index}` ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Dropdown */}
                      {item.hasDropdown && activeDropdown === `menu-${index}` && (
                        <div
                          ref={dropdownRef}
                          className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-96 overflow-y-auto"
                        >
                          {item.items?.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => handleMenuItemClick(subItem.path)}
                              className="block w-full text-left mx-2 px-3 py-2.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {subItem.label || subItem}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              {/* <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                {/* <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tìm kiếm hoặc nhập lệnh..."
                  className="block w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                /> */}
              {/* </div> */}
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggleButton />
              <NotificationDropdown />
              <UserDropdown />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 px-6 pb-2 dark:bg-slate-800">
          <div className="flex flex-wrap gap-2">
            {menuHeader.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105 hover:shadow-md ${item.color}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Modals */}
      <SoDuDauKyModal isOpen={isModalOpen} onClose={closeModal} />

      <TonKhoDauKyModal isOpen={isTonKhoModalOpen} onClose={closeTonKhoModal} />
    </>
  );
};

export default AppHeader;
