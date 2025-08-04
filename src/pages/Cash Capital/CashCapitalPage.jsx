import { Building2, ChevronRight, Receipt, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterModal from '../../components/FilterModal';
import vonBangTienService from "../../services/baocaovonbangtien";

export default function CashCapitalPage() {
    const [activeTab, setActiveTab] = useState('software');
    const [openModalId, setOpenModalId] = useState(null);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Định nghĩa giá trị mặc định cho từng menu item
    const getDefaultValues = (itemId) => {
        const defaultValues = {
            'so-quy': {
                tk: '1111',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY',
                store: 'Caso1',
                gop_tk: '1',
            },
            'export-plan': {
                tk: '1112',
                ngay_ct1: '2025-08-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CN01',
            },
            'inventory': {
                tk: '1113',
                ngay_ct1: '2025-06-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY',
                store: 'GLSO1D',
                gop_tk: '0',
            },
            'inventory-detail': {
                tk: '1121',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY',
                store: 'GLSO1D',
                gop_tk: '0',
            },
            'import-export-summary': {
                tk: '1131',
                ngay_ct1: '2025-07-15',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY',
                store: 'GLSO1',
                gop_tk: '0',
            },
            'import-export-detail': {
                tk: '1311',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CN01'
            },
            'inventory-report': {
                tk: '1111',
                ngay_ct1: '2025-08-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CN03'
            },
            'inventory-report-detail': {
                tk: '1112',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY'
            },
            // Default values cho management tab
            'cost-analysis': {
                tk: '6211',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY'
            },
            'performance-report': {
                tk: '5111',
                ngay_ct1: '2025-06-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CN01'
            },
            'turnover-analysis': {
                tk: '1561',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY'
            },
            'abc-analysis': {
                tk: '1562',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CN02'
            },
            'inventory-valuation': {
                tk: '1571',
                ngay_ct1: '2025-08-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY'
            },
            'budget-control': {
                tk: '6411',
                ngay_ct1: '2025-07-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CN01'
            },
            'variance-analysis': {
                tk: '5211',
                ngay_ct1: '2025-07-15',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CTY'
            },
            'profitability-report': {
                tk: '5111',
                ngay_ct1: '2025-06-01',
                ngay_ct2: '2025-08-31',
                ma_dvcs: 'CN03'
            }
        };

        return defaultValues[itemId] || {
            tk: '1111',
            ngay_ct1: '2025-07-01',
            ngay_ct2: '2025-08-31',
            ma_dvcs: 'CTY'
        };
    };

    const softwareMenuItems = [
        { id: 'so-quy', label: 'Sổ quỹ' },
        { id: 'export-plan', label: 'Sổ quỹ (in từng ngày)' },
        { id: 'inventory', label: 'Sổ kế toán chi tiết quỹ tiền mặt' },
        { id: 'inventory-detail', label: 'Sổ tiền gửi ngân hàng' },
        { id: 'import-export-summary', label: 'Sổ chi tiết của một tài khoản' },
        { id: 'import-export-detail', label: 'Sổ chi tiết công nợ của một khách hàng' },
        { id: 'inventory-report', label: 'Bảng cân đối số phát sinh theo ngày của một tài khoản' },
        { id: 'inventory-report-detail', label: 'Bảng số dư tiền tại quỹ và tại các ngân hàng' }
    ];

    const managementMenuItems = [
        { id: 'cost-analysis', label: 'Phân tích chi phí vật tư' },
        { id: 'performance-report', label: 'Báo cáo hiệu suất quản trị' },
        { id: 'turnover-analysis', label: 'Phân tích vòng quay hàng tồn' },
        { id: 'abc-analysis', label: 'Phân tích ABC vật tư' },
        { id: 'inventory-valuation', label: 'Định giá tồn kho' },
        { id: 'budget-control', label: 'Kiểm soát ngân sách' },
        { id: 'variance-analysis', label: 'Phân tích chênh lệch' },
        { id: 'profitability-report', label: 'Báo cáo lợi nhuận' }
    ];

    const handleIconClick = (type) => {
        switch (type) {
            case 'bank-receipt':
                window.location.href = '/chung-tu/bao-co';
                break;
            case 'bank-payment':
                window.location.href = '/chung-tu/bao-no';
                break;
            case 'cash-receipt':
                window.location.href = '/chung-tu/phieu-thu';
                break;
            case 'cash-payment':
                window.location.href = '/phieu-chi-tien-mat';
                break;
            default:
                break;
        }
    };

    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item);
        setOpenModalId(item.id);
    };

    const handleModalSubmit = async (formData) => {
        try {
            setIsSubmitting(true);

            // Chuẩn bị data để gọi API
            const requestData = {
                ...formData,
                // reportType: selectedMenuItem?.id,
                // reportName: selectedMenuItem?.label
            };

            console.log('Submitting filter data:', requestData);
            const paramSearch = new URLSearchParams(requestData).toString();
            console.log("---------------", paramSearch)
            // Gọi API để lấy dữ liệu báo cáo
            const materialData = await vonBangTienService.getData(paramSearch);

            console.log('API Response:', materialData);

            // Đóng modal
            setOpenModalId(null);
            setSelectedMenuItem(null);
            console.log(selectedMenuItem?.id)
            // Kiểm tra dữ liệu trả về
            // if (materialData && materialData.length > 0) {
            // Chuyển hướng đến trang hiển thị bảng với dữ liệu
            navigate('/bao-cao-von-bang-tien', {
                state: {
                    data: materialData,
                    filterData: requestData,
                    reportName: selectedMenuItem?.label,
                    reportType: selectedMenuItem?.id
                }
            });


        } catch (error) {
            console.error('Error fetching report data:', error);
            alert('Có lỗi xảy ra khi tải dữ liệu báo cáo. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentMenuItems = activeTab === 'software' ? softwareMenuItems : managementMenuItems;

    return (
        <div className="w-full h-full ">
            {/* Header with icons */}
            <div className="border-b border-gray-200 p-8 bg-blue-50">
                <div className="flex justify-between items-center">
                    {/* Giấy báo có (thu) của ngân hàng */}
                    <div
                        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
                        onClick={() => handleIconClick('bank-receipt')}
                    >
                        <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 relative">
                            <Building2 className="w-8 h-8 text-yellow-600" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-yellow-800">+</span>
                            </div>
                        </div>
                        <span className="text-sm text-gray-700 text-center">Giấy báo có (thu)<br />của ngân hàng</span>
                    </div>

                    {/* Giấy báo nợ (chi) của ngân hàng */}
                    <div
                        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleIconClick('bank-payment')}
                    >
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2 relative">
                            <Building2 className="w-8 h-8 text-blue-600" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-800">-</span>
                            </div>
                        </div>
                        <span className="text-sm text-gray-700 text-center">Giấy báo nợ (chi)<br />của ngân hàng</span>
                    </div>

                    {/* Phiếu thu tiền mặt */}
                    <div
                        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleIconClick('cash-receipt')}
                    >
                        <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-2 relative">
                            <Wallet className="w-8 h-8 text-pink-600" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-green-800">+</span>
                            </div>
                        </div>
                        <span className="text-sm text-gray-700 text-center">Phiếu thu tiền mặt</span>
                    </div>

                    {/* Phiếu chi tiền mặt */}
                    <div
                        className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
                        onClick={() => handleIconClick('cash-payment')}
                    >
                        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-2 relative">
                            <Receipt className="w-8 h-8 text-orange-600" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-red-800">-</span>
                            </div>
                        </div>
                        <span className="text-sm text-gray-700 text-center">Phiếu chi tiền mặt</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="">
                    <button
                        onClick={() => setActiveTab('software')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'software'
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Báo cáo phần hệ
                    </button>
                    <button
                        onClick={() => setActiveTab('management')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'management'
                            ? 'border-blue-500 text-blue-600 bg-blue-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Báo cáo quản trị
                    </button>
                </div>
            </div>

            <div>
                {/* Menu Items */}
                <div className="py-2 space-y-1">
                    {currentMenuItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center p-1 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                            onClick={() => handleMenuItemClick(item)}
                        >
                            <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                {openModalId && selectedMenuItem && (
                    <FilterModal
                        isOpen={true}
                        onClose={() => {
                            setOpenModalId(null);
                            setSelectedMenuItem(null);
                        }}
                        selectedItem={selectedMenuItem}
                        defaultValues={getDefaultValues(selectedMenuItem.id)}
                        onSubmit={handleModalSubmit}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}