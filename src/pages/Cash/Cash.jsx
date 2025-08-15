import { CarFront, ChevronRight, FileType, Laptop, Pocket } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesFilterModal from '../../components/SalesFilterModal';
import bcBanHangPhaiThuService from '../../services/bc-ban-hang';


export default function CashPage() {
  const [activeTab, setActiveTab] = useState('software');
  const [openModalId, setOpenModalId] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Định nghĩa giá trị mặc định cho từng menu item
  const getDefaultValues = (itemId) => {
    const defaultValues = {
      'import-plan': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'export-plan': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'import-export-plan': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'inventory2': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'inventory-detail2': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'import-export-summary2': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'import-export-detail': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'inventory-report': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'cost-analysis': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'performance-report': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'turnover-analysis': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'abc-analysis': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'inventory-valuation': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'budget-control': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'variance-analysis': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      },
      'profitability-report': {
        StartDate: '2025-08-01',
        EndDate: '2025-08-31',
        ma_kh: '',
        ma_kho: '',
        ma_vt: '',
        so_ct_from: '',
        so_ct_to: '',
        ma_dvcs: 'CTY'
      }
    };



    return defaultValues[itemId] || {
      StartDate: '20250801',
      EndDate: '20250831',
      ma_kh: '',
      ma_kho: '',
      ma_vt: '',
      so_ct_from: '',
      so_ct_to: '',
      ma_dvcs: 'CTY',
    };
  };

  const softwareMenuItems = [
    { id: 'import-plan', label: 'Bảng kê hóa đơn bán hàng', isCanUse: true },
    { id: 'export-plan', label: 'Bảng kê hóa đơn bán hàng và dịch vụ', isCanUse: true },
    { id: 'import-export-plan', label: 'Bảng kê phiếu nhập bàng bán bị trả lại', isCanUse: true },
    { id: 'inventory2', label: 'Bảng kê hóa đơn của một mặt hàng', isCanUse: true },
    { id: 'inventory-detail2', label: 'Bảng kê hóa đơn của một mặt hàng nhóm theo khách hàng', isCanUse: true },
    { id: 'import-export-summary2', label: 'Bảng kê hóa đơn của một mặt hàng nhóm theo dạng xuất bán', isCanUse: true },
    { id: 'import-export-detail', label: 'Bảng kê hóa đơn của một mặt hàng nhóm theo mặt hàng', isCanUse: true },
    { id: 'inventory-report', label: 'Sổ chi tiết bán hàng', isCanUse: true },
  ];

  const managementMenuItems = [
    { id: 'cost-analysis', label: 'Phân tích chi phí vật tư', isCanUse: false },
    { id: 'performance-report', label: 'Báo cáo hiệu suất quản trị', isCanUse: false },
    { id: 'turnover-analysis', label: 'Phân tích vòng quay hàng tồn', isCanUse: false },
    { id: 'abc-analysis', label: 'Phân tích ABC vật tư', isCanUse: false },
    { id: 'inventory-valuation', label: 'Định giá tồn kho', isCanUse: false },
    { id: 'budget-control', label: 'Kiểm soát ngân sách', isCanUse: false },
    { id: 'variance-analysis', label: 'Phân tích chênh lệch', isCanUse: false },
    { id: 'profitability-report', label: 'Báo cáo lợi nhuận', isCanUse: false }
  ];

  const productMenuItems = [
    { id: 'cost-analysis', label: 'Phân tích chi phí vật tư', isCanUse: false },
    { id: 'performance-report', label: 'Báo cáo hiệu suất quản trị', isCanUse: false },
    { id: 'turnover-analysis', label: 'Phân tích vòng quay hàng tồn', isCanUse: false },
    { id: 'abc-analysis', label: 'Phân tích ABC vật tư', isCanUse: false },
    { id: 'inventory-valuation', label: 'Định giá tồn kho', isCanUse: false },
    { id: 'budget-control', label: 'Kiểm soát ngân sách', isCanUse: false },
    { id: 'variance-analysis', label: 'Phân tích chênh lệch', isCanUse: false },
    { id: 'profitability-report', label: 'Báo cáo lợi nhuận', isCanUse: false }
  ];

  const handleIconClick = (type) => {
    switch (type) {
      case 'bank-receipt':
        window.location.href = '/don-ban-hang';
        break;
      case 'bank-payment':
        window.location.href = '/chung-tu/hoa-don-ban-hang';
        break;
      case 'cash-receipt':
        window.location.href = '/hd-ban-dv';
        break;
      case 'cash-payment':
        window.location.href = '/hd-dien-tu';
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
      // Chuân bị data để gọi API
      const requestData = {
        ...formData,
        methodName: selectedMenuItem?.id,
      };

      const paramSearch = new URLSearchParams(requestData).toString();
      const salesData = await bcBanHangPhaiThuService.getData(paramSearch);

      setOpenModalId(null);
      setSelectedMenuItem(null);
      navigate('/bao-cao-ban-hang', {
        state: {
          data: salesData,
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

  const menuMap = {
    software: softwareMenuItems,
    management: managementMenuItems,
    hardware: productMenuItems
  };

  const currentMenuItems = menuMap[activeTab] || [];

  return (
    <div className="w-full h-full ">
      {/* Header with icons */}
      <div className="border-b border-gray-200 p-8 bg-blue-50">
        <div className="flex justify-between items-center">
          {/* Đơn bán hàng */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
            onClick={() => handleIconClick('bank-receipt')}
          >
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 relative">
              <FileType className="w-8 h-8 text-yellow-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-800">+</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Đơn bán hàng</span>
          </div>

          {/* Hóa đơn bán hàng */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleIconClick('bank-payment')}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2 relative">
              <CarFront className="w-8 h-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-800">-</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Hóa đơn bán hàng</span>
          </div>

          {/* Hóa đơn bán hàng dịch vụ */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
            onClick={() => handleIconClick('cash-receipt')}
          >
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-2 relative">
              <Pocket className="w-8 h-8 text-orange-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-red-800">-</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Hóa đơn bán hàng dịch vụ</span>
          </div>

          {/* Hóa đơn điện tử */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
            onClick={() => handleIconClick('cash-payment')}
          >
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-2 relative">
              <Laptop className="w-8 h-8 text-green-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-800">-</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Hóa đơn điện tử</span>
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
            Báo cáo bán hàng
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'management'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo công nợ bán hàng
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'hardware'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo đơn hàng
          </button>
        </div>
      </div>

      <div>
        {/* Menu Items */}
        <div className="py-2 space-y-1">
          {currentMenuItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center p-1 text-sm rounded-md transition-colors ${item.isCanUse === false
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                }`}
              onClick={() => item.isCanUse !== false && handleMenuItemClick(item)}
            >
              <ChevronRight className={`w-4 h-4 mr-2 ${item.isCanUse === false ? 'text-gray-300' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {openModalId && selectedMenuItem && (
          <SalesFilterModal
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