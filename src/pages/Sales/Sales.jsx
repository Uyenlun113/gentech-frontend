import { CarFront, ChevronRight, FileText, FileType, Users } from 'lucide-react';
import { useState } from 'react';
import FilterModalKho from '../../components/FilterModalKho';
export default function Sales() {
  const [activeTab, setActiveTab] = useState('reportIn');
  const [openModalId, setOpenModalId] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const managementMenuItems = [
    { id: 'cost-analysis', label: 'Phân tích chi phí vật tư', isCanUse: false },
    { id: 'performance-report', label: 'Báo cáo hiệu suất quản trị', isCanUse: false },
    { id: 'turnover-analysis', label: 'Phân tích vòng quay hàng tồn', isCanUse: false },
    { id: 'abc-analysis', label: 'Phân tích ABC vật tư', isCanUse: false },
    { id: 'inventory-valuation', label: 'Định giá tồn kho', isCanUse: false },
    { id: 'budget-control', label: 'Kiểm soát ngân sách', isCanUse: false },
    { id: 'variance-analysis', label: 'Phân tích chênh lệch', isCanUse: false },
    { id: 'profitability-report', label: 'Báo cáo lợi nhuận', isCanUse: false },
  ];

  const reportInMenuItems = [
    { id: 'bang_ke_phieu_nhap', label: 'Bảng kê phiếu nhập', isCanUse: true },
    { id: 'bang_ke_hoa_don_mua_hang_va_dich_vu', label: 'Bảng kê hóa đơn mua hàng và dịch vụ', isCanUse: true },
    { id: 'bang_ke_phieu_xuat_tra_lai_nha_cung_cap', label: 'Bảng kê phiếu xuất trả lại nhà cung cấp', isCanUse: true },
    { id: 'bang_ke_phieu_nhap_cua_mot_mat_hang', label: 'Bảng kê phiếu nhập của một mặt hàng', isCanUse: true },
    { id: 'bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_nha_cung_cap', label: 'Bảng kê phiếu nhập của một mặt hàng nhóm theo nhà cung cấp', isCanUse: true },
    { id: 'bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_dang_nhap_mua', label: 'Bảng kê phiếu nhập của một mặt hàng nhóm theo dạng nhập mua', isCanUse: true },
    { id: 'bang_ke_phieu_nhap_cua_mot_nha_cung_cap_nhom_theo_mat_hang', label: 'Bảng kê phiếu nhập của một nhà cung cấp nhóm theo mặt hàng', isCanUse: true },
    { id: 'bao_cao_tong_hop_hang_nhap_mua', label: 'Báo cáo tổng hợp hàng nhập mua', isCanUse: true },
    { id: 'bao_cao_tong_hop_hang_xuat_tra_lai_nha_cung_cap', label: 'Báo cáo tổng hợp hàng xuất trả lại nhà cung cấp', isCanUse: false },
    { id: 'bao_cao_tong_gia_tri_hang_nhap_theo_nha_cung_cap_dang_nhap_mua', label: 'Báo cáo tổng giá trị hàng nhập theo nhà cung cấp, dạng nhập mua', isCanUse: false },
    { id: 'bao_cao_hang_nhap_nhom_theo_hai_chi_tieu', label: 'Báo cáo hàng nhập nhóm theo hai chỉ tiêu', isCanUse: false },
    { id: 'bao_cao_mua_hang_luy_ke', label: 'Báo cáo mua hàng lũy kế', isCanUse: false },
    { id: 'bao_cao_mua_hang_cho_nhieu_ky', label: 'Báo cáo mua hàng cho nhiều kỳ', isCanUse: false },
    { id: 'bao_cao_so_sanh_mua_hang_giua_2_ky', label: 'Báo cáo so sánh mua hàng giữa 2 kỳ', isCanUse: false },
  ];

  const reportOutMenuItems = [
    { id: 'bang_ke_chung_tu', label: 'Bảng kê chứng từ', isCanUse: true },
    { id: 'bang_ke_chung_tu_theo_nha_cung_cap', label: 'Bảng kê chứng từ theo nhà cung cấp', isCanUse: true },
    { id: 'tong_hop_so_phat_sinh_theo_nha_cung_cap', label: 'Tổng hợp số phát sinh theo nhà cung cấp', isCanUse: true },
    { id: 'tra_so_du_cong_no_cua_mot_nha_cung_cap', label: 'Tra số dư công nợ của một nhà cung cấp', isCanUse: true },
    { id: 'so_chi_tiet_cong_no_cua_mot_nha_cung_cap', label: 'Sổ chi tiết công nợ của một nhà cung cấp', isCanUse: true },
    { id: 'so_doi_chieu_cong_no', label: 'Sổ đối chiếu công nợ', isCanUse: true },
    { id: 'so_chi_tiet_cong_no_len_tat_ca_nha_cung_cap', label: 'Sổ chi tiết công nợ (lên cho tất cả các nhà cung cấp)', isCanUse: true },
    { id: 'so_tong_hop_cong_no_theo_chu_t_cua_mot_nha_cung_cap', label: 'Sổ tổng hợp công nợ chữ T của một nhà cung cấp', isCanUse: false },
    { id: 'bang_can_doi_phat_sinh_cong_no_cua_mot_tai_khoan', label: 'Bảng cân đối phát sinh công nợ của một tài khoản', isCanUse: false },
    { id: 'bang_can_doi_phat_sinh_cong_no_tren_nhieu_tai_khoan', label: 'Bảng cân đối phát sinh công nợ trên nhiều tài khoản', isCanUse: false },
    { id: 'bang_tong_hop_so_du_cong_no_cuoi_ky', label: 'Bảng tổng hợp số dư công nợ cuối kỳ', isCanUse: false },
    { id: 'bang_tong_hop_so_du_cong_no_dau_ky', label: 'Bảng tổng hợp số dư công nợ đầu kỳ', isCanUse: false },
    { id: 'bao_cao_cong_no_luy_ke_cua_cac_nha_cung_cap', label: 'Báo cáo công nợ lũy kế của các nhà cung cấp', isCanUse: false },
    { id: 'bao_cao_so_sanh_phat_sinh_giua_2_ky_cua_cac_nha_cung_cap', label: 'Báo cáo so sánh phát sinh giữa 2 kỳ của các nhà cung cấp', isCanUse: false },
    { id: 'bao_cao_tong_so_phat_sinh_nhieu_ky_cua_cac_nha_cung_cap', label: 'Báo cáo tổng số phát sinh nhiều kỳ của các nhà cung cấp', isCanUse: false },
    { id: 'so_chi_tiet_cua_mot_tai_khoan', label: 'Sổ chi tiết của một tài khoản', isCanUse: false },
  ];

  const reportExistMenuItems = [
    { id: 'bang_ke_don_hang', label: 'Bảng kê đơn hàng', isCanUse: true },
    { id: 'bao_cao_thuc_hien_don_hang', label: 'Báo cáo thực hiện đơn hàng', isCanUse: true },
    { id: 'bao_cao_tinh_hinh_thuc_hien_ke_hoach_don_hang', label: 'Báo cáo tình hình thực hiện kế hoạch đơn hàng', isCanUse: true },
    { id: 'so_chi_tiet_don_hang', label: 'Sổ chi tiết đơn hàng', isCanUse: true },
    { id: 'bang_ke_chung_tu_phat_sinh_theo_don_hang', label: 'Bảng kê chứng từ phát sinh theo đơn hàng', isCanUse: true },
    { id: 'tong_hop_so_phat_sinh_theo_don_hang', label: 'Tổng hợp số phát sinh theo đơn hàng', isCanUse: false },
    { id: 'bang_can_doi_so_phat_sinh_cua_cac_don_hang', label: 'Bảng cân đối số phát sinh của các đơn hàng', isCanUse: false },
    { id: 'so_du_dau_ky_cua_cac_don_hang', label: 'Số dư đầu kỳ của các đơn hàng', isCanUse: false },
    { id: 'so_du_cuoi_ky_cua_cac_don_hang', label: 'Số dư cuối kỳ của các đơn hàng', isCanUse: false },
  ];

  const handleIconClick = (type) => {
    switch (type) {
      case 'bank-receipt':
        window.location.href = '/chung-tu/don-dat-hang-mua';
        break;
      case 'bank-payment':
        window.location.href = '/phieu-mua';
        break;
      case 'cash-receipt':
        window.location.href = '/chi-phi-mua-hang';
        break;
      case 'cash-payment':
        window.location.href = '/chung-tu/hoa-don-mua-dv';
        break;
      default:
        break;
    }
  };
  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      // Chuẩn bị data để gọi API
      const requestData = {
        ...formData,
      };
      const responseData = await getBCKhoMutation.mutateAsync(requestData);
      // Đóng modal
      setOpenModalId(null);
      setSelectedMenuItem(null);
      // Điều hướng sang trang TablePrintKho với dữ liệu
      navigate('/purchases/print-kho', {
        state: {
          data: responseData,
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
  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    setOpenModalId(item.id);
  };
  const menuMap = {
    reportIn: reportInMenuItems,
    reportOut: reportOutMenuItems,
    reportExist: reportExistMenuItems,
    management: managementMenuItems,
  };

  const currentMenuItems = menuMap[activeTab] || reportInMenuItems;

  return (
    <div className="w-full h-full">
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
            <span className="text-sm text-gray-700 text-center">Đơn hàng mua</span>
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
            <span className="text-sm text-gray-700 text-center">Nhập mua hàng</span>
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
            <span className="text-sm text-gray-700 text-center">Phiếu nhập chi phí mua hàng</span>
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
            <span className="text-sm text-gray-700 text-center">Hóa đơn mua dịch vụ</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="">
          <button
            onClick={() => setActiveTab('reportIn')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reportIn'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo hàng nhập mua
          </button>
          <button
            onClick={() => setActiveTab('reportOut')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reportOut'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo công nợ NCC
          </button>
          <button
            onClick={() => setActiveTab('reportExist')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reportExist'
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            Báo cáo đơn hàng
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
            configTitle={selectedMenuItem.label}
          />
        )}
      </div>
    </div>
  );
}