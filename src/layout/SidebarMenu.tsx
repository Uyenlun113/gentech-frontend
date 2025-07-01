import React, { useState } from 'react';

const SidebarMenu = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [activeMenu, setActiveMenu] = useState('dau-ky');

    const menuItems = [
        {
            id: 'dau-ky',
            title: 'Đầu kỳ',
            icon: '📋'
        },
        {
            id: 'chung-tu',
            title: 'Chứng từ',
            icon: '📄',
            hasSubmenu: true,
            submenu: [
                { id: 'phieu-nop-tien-mat', title: '1. Phiếu nộp tiền mặt' },
                { id: 'phieu-chi-tien-mat', title: '2. Phiếu chi tiền mặt' },
                { id: 'bao-co-ngan-hang', title: '3. Báo có ngân hàng' },
                { id: 'bao-no-ngan-hang', title: '4. Báo nợ ngân hàng' },
                { id: 'don-dat-hang-mua', title: 'a. Đơn đặt hàng mua' },
                { id: 'don-dat-hang-ban', title: 'b. Đơn đặt hàng bán' },
                { id: 'phieu-nhap-mua', title: 'c. Phiếu nhập mua' },
                { id: 'chi-phi-van-chuyen', title: 'd. Chi phí vận chuyển' },
                { id: 'phieu-nhap-thanh-pham', title: '5. Phiếu nhập thành phẩm' },
                { id: 'phieu-nhap-kho', title: '6. Phiếu nhập kho' },
                { id: 'hoa-don-ban-hang', title: '7. Hóa đơn bán hàng' },
                { id: 'hang-ban-bi-tra-lai', title: '8. Hàng bán bị trả lại' },
                { id: 'phieu-xuat-kho', title: 'e. Phiếu xuất kho' },
                { id: 'phieu-xuat-lap-rap', title: 'f. Phiếu xuất lắp ráp' },
                { id: 'phieu-bo-tu-cong-cu', title: 'g. Phiếu bổ từ công cụ' },
                { id: 'phieu-ke-toan-khac', title: 'h. Phiếu kế toán khác' },
                { id: 'chung-tu-ngoai-bang', title: 'j. Chứng từ ngoài bảng' },
                { id: 'quan-ly-tai-san', title: 'k. Quản lý tài sản' },
                { id: 'dieu-chinh-giam-gia-cu', title: 'l. Điều chỉnh giảm giá cũ' }
            ]
        },
        {
            id: 'danh-muc',
            title: 'Danh mục',
            icon: '📚'
        },
        {
            id: 'cuoi-ky',
            title: 'Cuối kỳ',
            icon: '📊'
        },
        {
            id: 'bao-cao',
            title: 'Báo cáo',
            icon: '📈'
        },
        {
            id: 'he-thong',
            title: 'Hệ thống',
            icon: '⚙️'
        }
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSubmenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleMenuClick = (menuId) => {
        setActiveMenu(menuId);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <nav className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-br from-blue-600 to-purple-700 text-white transition-all duration-300 ease-in-out shadow-xl flex flex-col`}>
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">
                            GT
                        </div>
                        {!isCollapsed && (
                            <span className="text-lg font-semibold">GenTech</span>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 py-4 overflow-y-auto">
                    {!isCollapsed && (
                        <div className="px-4 mb-4">
                            <p className="text-xs uppercase tracking-wider text-white/70 font-medium">MENU</p>
                        </div>
                    )}

                    <div className="space-y-1 px-2">
                        {menuItems.map((item) => (
                            <div key={item.id} className="menu-item">
                                <div
                                    className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${activeMenu === item.id
                                            ? 'bg-white/15 text-white border-r-2 border-yellow-400'
                                            : 'hover:bg-white/10 text-white/90'
                                        } ${item.hasSubmenu ? 'justify-between' : ''}`}
                                    onClick={() => {
                                        if (item.hasSubmenu) {
                                            toggleSubmenu(item.id);
                                        }
                                        handleMenuClick(item.id);
                                    }}
                                >
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3 flex-shrink-0">{item.icon}</span>
                                        {!isCollapsed && (
                                            <span className="font-medium">{item.title}</span>
                                        )}
                                    </div>
                                    {item.hasSubmenu && !isCollapsed && (
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${expandedMenus[item.id] ? 'rotate-90' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>

                                {/* Submenu */}
                                {item.hasSubmenu && expandedMenus[item.id] && !isCollapsed && (
                                    <div className="mt-1 ml-4 space-y-1 bg-black/10 rounded-lg p-2">
                                        {item.submenu.map((subItem) => (
                                            <div
                                                key={subItem.id}
                                                className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${activeMenu === subItem.id
                                                        ? 'bg-white/15 text-white border-r-2 border-yellow-400'
                                                        : 'hover:bg-white/10 text-white/80'
                                                    }`}
                                                onClick={() => handleMenuClick(subItem.id)}
                                            >
                                                {subItem.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">H</span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">hihi</p>
                                <p className="text-xs text-white/70">Admin</p>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                    <div className="border-b pb-4 mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Hệ thống Kế toán</h1>
                        <p className="text-gray-600 mt-1">Công ty TNHH Vận tải thương mại Việt Trung Phú Thọ</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium mb-1">Báo cáo nhanh</h3>
                                    <p className="text-2xl font-bold">25</p>
                                </div>
                                <div className="text-3xl opacity-80">📄</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium mb-1">Báo cáo tài chính</h3>
                                    <p className="text-2xl font-bold">8</p>
                                </div>
                                <div className="text-3xl opacity-80">💰</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium mb-1">Hóa đơn điện tử</h3>
                                    <p className="text-2xl font-bold">156</p>
                                </div>
                                <div className="text-3xl opacity-80">🧾</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium mb-1">Kết nối ngân hàng</h3>
                                    <p className="text-2xl font-bold">3</p>
                                </div>
                                <div className="text-3xl opacity-80">🏦</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-lg text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium mb-1">Nộp thuế điện tử</h3>
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                                <div className="text-3xl opacity-80">📊</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Chứng từ gần đây</h2>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                                <div className="flex-1">
                                    <p className="font-medium">Phiếu nộp tiền mặt</p>
                                    <p className="text-sm text-gray-600">Số CT: 001/2024 - Số tiền: 5,000,000 VNĐ</p>
                                </div>
                                <span className="text-sm text-gray-500">Hôm nay</span>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
                                <div className="flex-1">
                                    <p className="font-medium">Hóa đơn bán hàng</p>
                                    <p className="text-sm text-gray-600">Số HĐ: 0000123 - Khách hàng: Công ty ABC</p>
                                </div>
                                <span className="text-sm text-gray-500">Hôm qua</span>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-4"></div>
                                <div className="flex-1">
                                    <p className="font-medium">Báo có ngân hàng</p>
                                    <p className="text-sm text-gray-600">Tk: 1234567890 - Số tiền: 10,000,000 VNĐ</p>
                                </div>
                                <span className="text-sm text-gray-500">2 ngày trước</span>
                            </div>

                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-4"></div>
                                <div className="flex-1">
                                    <p className="font-medium">Phiếu chi tiền mặt</p>
                                    <p className="text-sm text-gray-600">Số CT: 002/2024 - Lý do: Chi phí văn phòng</p>
                                </div>
                                <span className="text-sm text-gray-500">3 ngày trước</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SidebarMenu;