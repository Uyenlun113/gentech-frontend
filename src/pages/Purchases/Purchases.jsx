import { Calculator, ChevronRight, FileText, FileType, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterModalKho from '../../components/FilterModalKho';
import LoadingModal from '../../components/LoadingModal';
import PricingModal from '../../components/PricingModal';
import usePostBCKho from "../../hooks/useBCKho";
import { usePostInGia } from '../../hooks/useInGia';

// Get current date values
const now = new Date();
const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
const currentYear = now.getFullYear();

const initialPricingData = {
  ky: currentMonth.toString(),       // Current month
  nam: currentYear.toString(),       // Current year
  ky2: '',
  nam2: '',
  maKho: '',
  maVatTu: '',
  maDuAn: '',
  taiKhoanVatTu: '',
  nhomVatTu1: '',
  nhomVatTu2: '',
  nhomVatTu3: '',
  taoPxChenhLech: '0',
  capNhatGiaTrungBinh: '1',
  xuLyKhiHoachToan: '0',
  ngayBatDau: '31-12-2020',
  maDVCS: 'CTY'
};


export default function PurChases() {
  const [activeTab, setActiveTab] = useState('reportIn');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openModalId, setOpenModalId] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  // Initialize API mutation hook
  const postInGiaMutation = usePostInGia();
  const getBCKhoMutation = usePostBCKho();

  const [pricingData, setPricingData] = useState(initialPricingData);
  const processingSteps = [
    { progress: 10, task: 'Đang khởi tạo quá trình tính giá...' },
    { progress: 20, task: 'Đang tính toán giá trung bình...' },
    { progress: 45, task: 'Đang cập nhật phiếu xuất...' },
    { progress: 75, task: 'Đang tạo phiếu xuất chênh lệch...' },
    { progress: 100, task: 'Hoàn tất!' }
  ];

  const transformToApiPayload = (formData) => {
    const period1 = parseInt(formData.ky);
    const year1 = parseInt(formData.nam);
    const period2 = parseInt(formData.ky2 || formData.ky);
    const year2 = parseInt(formData.nam2 || formData.nam);
    if (isNaN(period1) || period1 < 1 || period1 > 12) {
      throw new Error('Kỳ phải là số từ 1 đến 12');
    }
    if (isNaN(year1) || year1 < 1900 || year1 > 2100) {
      throw new Error('Năm phải là số từ 1900 đến 2100');
    }
    if (isNaN(period2) || period2 < 1 || period2 > 12) {
      throw new Error('Kỳ 2 phải là số từ 1 đến 12');
    }
    if (isNaN(year2) || year2 < 1900 || year2 > 2100) {
      throw new Error('Năm 2 phải là số từ 1900 đến 2100');
    }

    return {
      Period1: period1,
      Year1: year1,
      Period2: period2,
      Year2: year2,
      Ma_kho: formData.maKho.trim() || undefined,
      Ma_dvcs: formData.maDVCS || undefined,
      Ma_vt: formData.maVatTu.trim() || undefined,
      Ma_vv: formData.maDuAn.trim() || undefined,
      OutMa_vts: undefined,
      Tk_vt: formData.taiKhoanVatTu.trim() || undefined,
      Nh_vt1: formData.nhomVatTu1.trim() || undefined,
      Nh_vt2: formData.nhomVatTu2.trim() || undefined,
      Nh_vt3: formData.nhomVatTu3.trim() || undefined,
      Nh_sc: formData.xuLyKhiHoachToan || 0,
      Dk_cl: formData.taoPxChenhLech || 0,
      Tinh_giatb: formData.capNhatGiaTrungBinh || 1,
    };
  };

  const simulateProgress = async () => {
    for (let i = 0; i < processingSteps.length - 1; i++) {
      const step = processingSteps[i];
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
      setCurrentTask(step.task);
    }
  };

  const handlePricingSubmit = async () => {
    try {
      if (!pricingData.ky || !pricingData.nam) {
        throw new Error('Vui lòng nhập đầy đủ thông tin Kỳ và Năm');
      }

      const apiPayload = transformToApiPayload(pricingData);
      setShowPricingModal(false);
      setShowLoadingModal(true);
      setProgress(0);
      setIsCompleted(false);
      setHasError(false);
      setErrorMessage('');
      await simulateProgress();
      await postInGiaMutation.mutateAsync(apiPayload);
      setProgress(100);
      setCurrentTask('Hoàn tất!');
      setIsCompleted(true);
      setTimeout(() => {
        setShowLoadingModal(false);
        resetModalState();
        setPricingData(initialPricingData);
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setProgress(100);
      setTimeout(() => {
        setHasError(true);
        setIsCompleted(false);
        let errorMsg = 'Có lỗi xảy ra khi tính giá';
        if (error?.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          errorMsg = error.response.data.errors.join(', ');
        } else if (error?.message) {
          errorMsg = error.message;
        } else if (typeof error === 'string') {
          errorMsg = error;
        }

        setErrorMessage(errorMsg);
        setCurrentTask(`Lỗi: ${errorMsg}`);
      }, 800);
    }
  };

  const resetModalState = () => {
    setProgress(0);
    setIsCompleted(false);
    setHasError(false);
    setErrorMessage('');
    setCurrentTask('');
  };

  const handleCloseLoading = () => {
    setShowLoadingModal(false);
    resetModalState();
    setPricingData(initialPricingData);
  };

  const handleCloseModal = () => {
    setShowPricingModal(false);
    resetModalState();
    setPricingData(initialPricingData);
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    setProgress(0);
    handlePricingSubmit();
  };

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

  const handleIconClick = (type) => {
    switch (type) {
      case 'bank-receipt':
        window.location.href = '/chung-tu/phieu-nhap-kho';
        break;
      case 'bank-payment':
        window.location.href = '/phieu-xuat';
        break;
      case 'cash-receipt':
        window.location.href = '/chung-tu/phieu-xuat-kho';
        break;
      case 'cash-payment':
        window.location.href = '/phieu-xuat-dc';
        break;
      case 'pricing':
        setShowPricingModal(true);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (field, value) => {
    setPricingData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const menuMap = {
    reportIn: reportInMenuItems,
    reportOut: reportOutMenuItems,
    reportExist: reportExistMenuItems,
    management: managementMenuItems,
  };

  const currentMenuItems = menuMap[activeTab] || reportInMenuItems;

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

          {/* Tính giá */}
          <div
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity px-6"
            onClick={() => handleIconClick('pricing')}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2 relative">
              <Calculator className="w-8 h-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-800">$</span>
              </div>
            </div>
            <span className="text-sm text-gray-700 text-center">Tính giá trung bình tháng</span>
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
            configTitle={selectedMenuItem.label}
          />
        )}
      </div>

      {/* Modals */}
      <PricingModal
        showModal={showPricingModal}
        onClose={handleCloseModal}
        onSubmit={handlePricingSubmit}
        pricingData={pricingData}
        onInputChange={handleInputChange}
      />

      <LoadingModal
        showModal={showLoadingModal}
        progress={progress}
        currentTask={currentTask}
        isCompleted={isCompleted}
        hasError={hasError}
        errorMessage={errorMessage}
        onClose={handleCloseLoading}
        onRetry={handleRetry}
      />
    </div>
  );
}