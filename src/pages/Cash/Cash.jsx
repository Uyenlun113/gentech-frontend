import { CarFront, ChevronRight, FileType, Laptop, Pocket } from 'lucide-react';
import { useState } from 'react';

export default function CashPage() {
  const [activeTab, setActiveTab] = useState('software');

  const softwareMenuItems = [
    { id: 'import-plan', label: 'Bảng kế phiếu nhập' },
    { id: 'export-plan', label: 'Bảng kế phiếu xuất' },
    { id: 'import-export-plan', label: 'Bảng kế phiếu nhập/xuất/hoá đơn' },
    { id: 'inventory', label: 'Thẻ kho' },
    { id: 'inventory-detail', label: 'Sổ chi tiết vật tư' },
    { id: 'import-export-summary', label: 'Tổng hợp Nhập-Xuất-Tồn' },
    { id: 'import-export-detail', label: 'Tổng hợp Nhập-Xuất-Tồn theo chi tiết' },
    { id: 'inventory-report', label: 'Báo cáo tồn kho' },
    { id: 'inventory-report-detail', label: 'Báo cáo tồn kho theo kho' }
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
        window.location.href = '/don-ban-hang';
        break;
      case 'bank-payment':
        window.location.href = '/phieu-xuat';
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
              <FileType className="w-8 h-8 text-yellow-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-800">+</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Đơn bán hàng</span>
          </div>

          {/* Giấy báo nợ (chi) của ngân hàng */}
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

          {/* Phiếu thu tiền mặt */}
          {/* <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleIconClick('cash-receipt')}
          >
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-2 relative">
              <FileText className="w-8 h-8 text-pink-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-800">+</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Phiếu nhập hàng bán, <br /> dịch vụ bị trả lại</span>
          </div> */}

          {/* Phiếu chi tiền mặt */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
            onClick={() => handleIconClick('cash-payment')}
          >
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-2 relative">
              <Pocket className="w-8 h-8 text-orange-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-red-800">-</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Hóa đơn bán hàng dịch vụ</span>
          </div>

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

      <div className="py-4">
        {/* Menu Items */}
        <div className="space-y-1">
          {currentMenuItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center p-1 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}