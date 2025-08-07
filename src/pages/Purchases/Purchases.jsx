import { Building2, ChevronRight, Receipt, Wallet, FileText, FileType, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterModalKho from '../../components/FilterModalKho';
// import khoService from "../../services/khoService"; // Giả lập, bạn cần tạo file này hoặc thay bằng service thực tế

export default function PurChases() {
  const [activeTab, setActiveTab] = useState('reportIn');
  const [openModalId, setOpenModalId] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const reportInMenuItems = [
    { id: 'bang_ke_phieu_nhap', label: 'Bảng kê phiếu nhập', isCanUse: true },
    { id: 'bang_ke_phieu_nhap_mat_hang', label: 'Bảng kê phiếu nhập của một mặt hàng', isCanUse: true },
    { id: 'bang_ke_phieu_nhap_mat_hang_ncc', label: 'Bảng kê phiếu nhập của một mặt hàng nhóm theo nhà cung cấp', isCanUse: true },
    { id: 'bang_ke_phieu_nhap_mat_hang_dang_nhap', label: 'Bảng kê phiếu nhập của một mặt hàng theo dạng nhập', isCanUse: false },
    { id: 'bang_ke_phieu_nhap_ncc_mat_hang', label: 'Bảng kê phiếu nhập của một nhà cung cấp nhóm theo mặt hàng', isCanUse: true },
    { id: 'tong_hop_hang_nhap_kho', label: 'Tổng hợp hàng nhập kho', isCanUse: true },
    { id: 'bao_cao_gia_tri_hang_nhap', label: 'Báo cáo giá trị hàng nhập theo nhà cung cấp, dạng nhập hàng', isCanUse: false },
    { id: 'bao_cao_hang_nhap_hai_chi_tieu', label: 'Báo cáo hàng nhập nhóm theo hai chỉ tiêu', isCanUse: false },
    { id: 'bao_cao_hang_nhap_nhieu_ky', label: 'Báo cáo hàng nhập kho cho nhiều kỳ', isCanUse: false }
  ];

  const reportOutMenuItems = [
    { id: 'bang_ke_phieu_xuat', label: 'Bảng kê phiếu xuất', isCanUse: true },
    { id: 'bang_ke_phieu_xuat_mat_hang', label: 'Bảng kê phiếu xuất của một mặt hàng', isCanUse: true },
    { id: 'bang_ke_phieu_xuat_mat_hang_khach_hang', label: 'Bảng kê phiếu xuất của một mặt hàng theo khách hàng', isCanUse: true },
    { id: 'bang_ke_phieu_xuat_mat_hang_dang_xuat', label: 'Bảng kê phiếu xuất của một mặt hàng nhóm theo dạng xuất', isCanUse: false },
    { id: 'bang_ke_phieu_xuat_khach_hang_mat_hang', label: 'Bảng kê phiếu xuất của một khách hàng nhóm theo mặt hàng', isCanUse: true },
    { id: 'tong_hop_hang_xuat_kho', label: 'Tổng hợp hàng xuất kho', isCanUse: true },
    { id: 'bao_cao_gia_tri_xuat', label: 'Báo cáo giá trị hàng xuất theo khách hàng, dạng xuất hàng', isCanUse: false },
    { id: 'bao_cao_xuat_hai_chi_tieu', label: 'Báo cáo hàng xuất nhóm theo hai chỉ tiêu', isCanUse: false },
    { id: 'bao_cao_hang_xuat_nhieu_ky', label: 'Báo cáo hàng xuất kho cho nhiều kỳ', isCanUse: false }
  ];

  const reportExistMenuItems = [
    { id: 'the_kho_chi_tiet_vat_tu', label: 'Thẻ kho/ Sổ chi tiết vật tư', isCanUse: true },
    { id: 'the_kho_chi_tiet_nhieu_vat_tu', label: 'Thẻ kho/ Sổ chi tiết vật tư (lên cho nhiều vật tư)', isCanUse: false },
    { id: 'tra_so_ton_kho_mot_vat_tu', label: 'Tra sổ tồn kho của một vật tư', isCanUse: false },
    { id: 'tong_hop_nhap_xuat_ton', label: 'Tổng hợp nhập xuất tồn', isCanUse: true },
    { id: 'tong_hop_nhap_xuat_ton_quy_doi', label: 'Tổng hợp nhập xuất tồn (quy đổi theo đơn vị tính)', isCanUse: true },
    { id: 'tong_hop_chi_tiet_vat_tu', label: 'Bảng tổng hợp chi tiết vật tư', isCanUse: true },
    { id: 'bao_cao_ton_kho', label: 'Báo cáo tồn kho', isCanUse: true },
    { id: 'bao_cao_ton_theo_kho', label: 'Báo cáo tồn theo kho', isCanUse: false },
    { id: 'bao_cao_ton_dau_ky', label: 'Báo cáo tồn kho đầu kỳ', isCanUse: false },
    { id: 'bao_cao_ton_theo_phieu_nhap', label: 'Báo cáo tồn kho theo phiếu nhập (giá NTXT)', isCanUse: false },
    { id: 'bao_cao_ton_duoi_dinh_muc', label: 'Báo cáo tồn kho dưới định mức tối thiểu', isCanUse: false },
    { id: 'bao_cao_ton_tren_dinh_muc', label: 'Báo cáo tồn kho trên định mức tối đa', isCanUse: false },
    { id: 'bang_gia_trung_binh_thang', label: 'Bảng giá trung bình tháng', isCanUse: false },
    { id: 'so_chi_tiet_tai_khoan', label: 'Sổ chi tiết của một tài khoản', isCanUse: false }
  ];

  const managementMenuItems = [
    { id: 'cost_analysis', label: 'Phân tích chi phí vật tư', isCanUse: false },
    { id: 'performance_report', label: 'Báo cáo hiệu suất quản trị', isCanUse: false },
    { id: 'turnover_analysis', label: 'Phân tích vòng quay hàng tồn', isCanUse: false },
    { id: 'abc_analysis', label: 'Phân tích ABC vật tư', isCanUse: false },
    { id: 'inventory_valuation', label: 'Định giá tồn kho', isCanUse: false },
    { id: 'budget_control', label: 'Kiểm soát ngân sách', isCanUse: false },
    { id: 'variance_analysis', label: 'Phân tích chênh lệch', isCanUse: false },
    { id: 'profitability_report', label: 'Báo cáo lợi nhuận', isCanUse: false }
  ];

  const menuMap = {
    reportIn: reportInMenuItems,
    reportOut: reportOutMenuItems,
    reportExist: reportExistMenuItems,
    management: managementMenuItems,
  };

  const currentMenuItems = menuMap[activeTab] || [];

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
      let paramSearch = new URLSearchParams(requestData).toString();
      // Gọi API lấy dữ liệu báo cáo (bạn cần thay khoService.getData bằng service thực tế)
      // const khoData = await khoService.getData(paramSearch);
      const khoData = []
      // Đóng modal
      setOpenModalId(null);
      setSelectedMenuItem(null);
      // Điều hướng sang trang TablePrintKho với dữ liệu
      navigate('/purchases/print-kho', {
        state: {
          data: khoData,
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

  return (
    <div className="w-full h-full ">
      {/* Header with icons giữ nguyên */}
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
            <span className="text-sm text-gray-700 text-center">Phiếu nhập kho</span>
          </div>
          {/* Phiếu thu tiền mặt */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleIconClick('cash-receipt')}
          >
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-2 relative">
              <FileText className="w-8 h-8 text-pink-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-800">+</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Phiếu xuất kho</span>
          </div>

          {/* Phiếu chi tiền mặt */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
            onClick={() => handleIconClick('cash-payment')}
          >
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-2 relative">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-red-800">-</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Phiếu xuất điều chuyển kho</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation giữ nguyên */}
      <div className="bg-white border-b border-gray-200">
        <div className="">
          <button
            onClick={() => setActiveTab('reportIn')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reportIn'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo nhập kho
          </button>
          <button
            onClick={() => setActiveTab('reportOut')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reportOut'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo xuất kho
          </button>
          <button
            onClick={() => setActiveTab('reportExist')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reportExist'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo tồn kho
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
          <FilterModalKho
            isOpen={true}
            onClose={() => {
              setOpenModalId(null);
              setSelectedMenuItem(null);
            }}
            selectedItem={selectedMenuItem}
            onSubmit={handleModalSubmit}
            isSubmitting={isSubmitting}
            configName={selectedMenuItem.id}
          />
        )}
      </div>
    </div>
  );
}