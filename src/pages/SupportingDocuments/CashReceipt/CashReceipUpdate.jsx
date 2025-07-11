import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalenderIcon } from "../../../icons";
import { useUpdateCashReceipt } from "../../../hooks/useCashReceipt";
import { useCustomers } from "../../../hooks/useCustomer";
import { useAccounts } from "../../../hooks/useAccounts";
import { CalendarIcon, Plus, Save, Trash2, X } from "lucide-react";

export const ModalEditCashReceipt = ({ isOpenEdit, closeModalEdit, selectedCashReceipt }) => {
  const [formData, setFormData] = useState({
    so_ct: "",
    ong_ba: "",
    ngay_lct: "",
    ngay_ct: "",
    tk: "",
    ma_gd: "",
    ma_kh: "",
    dia_chi: "",
    dien_giai: "",
    ma_qs: "",
    loai_ct: "Đã ghi sổ cái",
    mst: "",
    ma_nt: "",
    ty_gia: "",
  });

  const [taiKhoanList, setTaiKhoanList] = useState([
    {
      tk_so: "",
      tk_me: "",
      ten_tai_khoan: "",
      ps_co: 0,
      dien_giai: ""
    }
  ]);

  // State cho customer dropdown
  const [maKhSearch, setMaKhSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // State cho account dropdown trong bảng hạch toán
  const [maTaiKhoanSearchList, setMaTaiKhoanSearchList] = useState([]);
  const [showAccountDropdownList, setShowAccountDropdownList] = useState([]);
  // State cho active search index
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);

  // State cho account dropdown (tài khoản nợ)
  const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // State để track việc load tên tài khoản
  const [isLoadingAccountNames, setIsLoadingAccountNames] = useState(false);

  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch.trim() } : {});

  // Hook cho tìm kiếm tài khoản trong bảng hạch toán với activeSearchIndex
  const { data: accountDataList = [] } = useAccounts(
    activeSearchIndex >= 0 && maTaiKhoanSearchList[activeSearchIndex]?.length > 0
      ? { search: maTaiKhoanSearchList[activeSearchIndex] }
      : {}
  );

  // Function để lấy thông tin tài khoản theo tk_so
  const loadAccountInfo = async (tkSo) => {
    try {
      const trimmedTkSo = tkSo?.trim(); // 🧼 Trim khoảng trắng

      const response = useAccounts(trimmedTkSo);
      const data = await response[0].json();

      if (data?.data && data.data.length > 0) {
        // Tìm tài khoản chính xác khớp với tk_so
        const exactMatch = data.data.find(acc => acc.tk === trimmedTkSo || acc.so_tk === trimmedTkSo);
        return exactMatch || data.data[0]; // Lấy kết quả đầu tiên nếu không tìm thấy exact match
      }
      return null;
    } catch (error) {
      console.error(`Error loading account info for ${tkSo}:`, error);
      return null;
    }
  };

  // Function để load tên tài khoản cho tất cả các dòng trong taiKhoanList
  const loadAllAccountNames = async (taiKhoanListData) => {
    if (!taiKhoanListData || taiKhoanListData.length === 0) return taiKhoanListData;

    setIsLoadingAccountNames(true);
    const updatedList = [];

    for (const item of taiKhoanListData) {
      if (item.tk_so && !item.ten_tai_khoan) {
        // Chỉ load nếu có tk_so nhưng chưa có ten_tai_khoan
        const accountInfo = await loadAccountInfo(item.tk_so);
        updatedList.push({
          ...item,
          ten_tai_khoan: accountInfo?.ten_tk || item.ten_tai_khoan,
          tk_me: accountInfo?.tk_me || item.tk_me
        });
      } else {
        updatedList.push(item);
      }
    }

    setIsLoadingAccountNames(false);
    return updatedList;
  };

  // Debounce customer search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maKhSearch && maKhSearch.length > 0) {
        setShowCustomerDropdown(true);
      } else {
        setShowCustomerDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maKhSearch]);

  // Debounce account search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maTaiKhoanSearch && maTaiKhoanSearch.length > 0) {
        setShowAccountDropdown(true);
      } else {
        setShowAccountDropdown(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maTaiKhoanSearch]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      if (!target || !target.closest) {
        return;
      }

      if (!target.closest('.customer-dropdown-container')) {
        setShowCustomerDropdown(false);
      }
      if (!target.closest('.account-dropdown-container')) {
        setShowAccountDropdown(false);
      }
      // Ẩn tất cả dropdown của bảng nếu click outside
      if (!target.closest('.account-table-dropdown')) {
        setShowAccountDropdownList(prev => prev.map(() => false));
        setActiveSearchIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCashReceiptMutation = useUpdateCashReceipt();

  // Load data when selectedCashReceipt changes
  useEffect(() => {
    if (selectedCashReceipt && isOpenEdit) {
      setFormData({
        so_ct: selectedCashReceipt.so_ct || "",
        ong_ba: selectedCashReceipt.ong_ba || "",
        ngay_lct: selectedCashReceipt.ngay_lct ? new Date(selectedCashReceipt.ngay_lct).toLocaleDateString("en-CA") : "",
        ngay_ct: selectedCashReceipt.ngay_ct ? new Date(selectedCashReceipt.ngay_ct).toLocaleDateString("en-CA") : "",
        tk: selectedCashReceipt.tk || "",
        ma_gd: selectedCashReceipt.ma_gd || "",
        ma_kh: selectedCashReceipt.ma_kh || "",
        dia_chi: selectedCashReceipt.dia_chi || "",
        dien_giai: selectedCashReceipt.dien_giai || "",
        ma_qs: selectedCashReceipt.ma_qs || "",
        loai_ct: selectedCashReceipt.loai_ct || "Đã ghi sổ cái",
        mst: selectedCashReceipt.mst ? selectedCashReceipt.mst : "",
        ma_nt: selectedCashReceipt.ma_nt || "",
        ty_gia: selectedCashReceipt.ty_gia || "",
      });

      // Set search values for existing data
      setMaKhSearch(selectedCashReceipt.ma_kh || "");
      setMaTaiKhoanSearch(selectedCashReceipt.tk || "");

      if (selectedCashReceipt.tai_khoan_list && selectedCashReceipt.tai_khoan_list.length > 0) {
        const taiKhoanData = selectedCashReceipt.tai_khoan_list.map(item => ({
          tk_so: item.tk_so || "",
          tk_me: item.tk_me || "",
          ten_tai_khoan: item.ten_tai_khoan || "",
          ps_co: item.ps_co || 0,
          dien_giai: item.dien_giai || ""
        }));

        // Load tên tài khoản cho các dòng không có tên
        loadAllAccountNames(taiKhoanData).then(updatedList => {
          setTaiKhoanList(updatedList);
        });

        // Khởi tạo mảng search và dropdown cho từng dòng
        setMaTaiKhoanSearchList(taiKhoanData.map(item => item.tk_so || ""));
        setShowAccountDropdownList(taiKhoanData.map(() => false));
      } else {
        setTaiKhoanList([{
          tk_so: "",
          tk_me: "",
          ten_tai_khoan: "",
          ps_co: 0,
          dien_giai: ""
        }]);
        setMaTaiKhoanSearchList([""]);
        setShowAccountDropdownList([false]);
      }
    } else if (!isOpenEdit) {
      // Reset form khi modal đóng
      resetForm();
    }
  }, [selectedCashReceipt, isOpenEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Trigger customer search when ma_kh changes
    if (field === 'ma_kh') {
      setMaKhSearch(value);
    }

    // Trigger account search when tk changes
    if (field === 'tk') {
      setMaTaiKhoanSearch(value);
    }

    // Auto update exchange rate when currency changes
    if (field === 'ma_nt') {
      const exchangeRate = value === 'USD' ? 25000 : 1;
      setFormData(prev => ({
        ...prev,
        [field]: value,
        ty_gia: exchangeRate
      }));
    }
  };

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      mst: customer.ma_so_thue,
      ma_kh: customer.ma_kh,
      ong_ba: customer.ten_kh,
      dia_chi: customer.dia_chi || prev.dia_chi
    }));
    setShowCustomerDropdown(false);
    setMaKhSearch(customer.ma_kh);
  };

  // Handle account selection
  const handleAccountSelect = (account) => {
    setFormData(prev => ({
      ...prev,
      tk: account.ma_tk || account.so_tk
    }));
    setShowAccountDropdown(false);
    setMaTaiKhoanSearch(account.tk);
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date[0]?.toLocaleDateString("en-CA") || ""
    }));
  };

  // Xử lý thay đổi dữ liệu tài khoản với auto-load tên tài khoản
  const handleTaiKhoanChange = async (index, field, value) => {
    const newList = [...taiKhoanList];
    newList[index] = {
      ...newList[index],
      [field]: field === 'ps_co' ? Number(value) || 0 : value
    };

    // Nếu thay đổi tk_so, tự động load tên tài khoản
    if (field === 'tk_so' && value.trim() !== '') {
      // Clear tên tài khoản hiện tại
      newList[index].ten_tai_khoan = '';
      newList[index].tk_me = '';

      setTaiKhoanList(newList);

      // Load thông tin tài khoản
      const accountInfo = await loadAccountInfo(value);
      if (accountInfo) {
        const updatedList = [...newList];
        updatedList[index].ten_tai_khoan = accountInfo.ten_tk || '';
        updatedList[index].tk_me = accountInfo.tk_me || '';
        setTaiKhoanList(updatedList);
      }
    } else {
      setTaiKhoanList(newList);
    }
  };

  // Thêm dòng mới
  const addTaiKhoan = () => {
    setTaiKhoanList([...taiKhoanList, {
      tk_so: "",
      tk_me: "",
      ten_tai_khoan: "",
      ps_co: 0,
      dien_giai: ""
    }]);
    setMaTaiKhoanSearchList(prev => [...prev, ""]);
    setShowAccountDropdownList(prev => [...prev, false]);
  };

  // Xóa dòng
  const removeTaiKhoan = (index) => {
    if (taiKhoanList.length > 1) {
      const newList = taiKhoanList.filter((_, i) => i !== index);
      setTaiKhoanList(newList);
      setMaTaiKhoanSearchList(prev => prev.filter((_, i) => i !== index));
      setShowAccountDropdownList(prev => prev.filter((_, i) => i !== index));

      // Reset active search index if the removed row was active
      if (activeSearchIndex === index) {
        setActiveSearchIndex(-1);
      } else if (activeSearchIndex > index) {
        setActiveSearchIndex(activeSearchIndex - 1);
      }
    }
  };

  // Tính tổng tiền
  const getTongTien = () => {
    return taiKhoanList.reduce((total, item) => total + (item.ps_co || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCashReceipt) return;

    const validTaiKhoanList = taiKhoanList.filter(item =>
      item.tk_so && item.tk_so.trim() !== ''
    );

    if (validTaiKhoanList.length === 0) {
      alert('Vui lòng nhập ít nhất một tài khoản với TK số và TK mẹ hợp lệ!');
      return;
    }

    const dataToSave = {
      ma_gd: formData.ma_gd || "2",
      ma_kh: formData.ma_kh,
      dia_chi: formData.dia_chi,
      ong_ba: formData.ong_ba,
      dien_giai: formData.dien_giai,
      ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : undefined,
      ngay_lct: formData.ngay_lct ? new Date(formData.ngay_lct).toISOString() : undefined,
      ma_qs: formData.ma_qs,
      so_ct: formData.so_ct ? formData.so_ct : "PT001",
      ma_nt: formData.ma_nt || "VND",
      ty_gia: formData.ty_gia ? Number(formData.ty_gia) : 1,
      loai_ct: "PT",
      tai_khoan_list: validTaiKhoanList,
      tong_tien: validTaiKhoanList.reduce((total, item) => total + (item.ps_co || 0), 0),
      han_thanh_toan: 0
    };

    try {
      await updateCashReceiptMutation.mutateAsync({
        stt_rec: selectedCashReceipt.stt_rec,
        data: dataToSave
      });
      closeModalEdit();
    } catch (error) {
      console.error("Error updating cash receipt:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      so_ct: "",
      ong_ba: "",
      ngay_lct: "",
      ngay_ct: "",
      tk: "",
      ma_gd: "",
      ma_kh: "",
      dia_chi: "",
      dien_giai: "",
      ma_qs: "",
      loai_ct: "Đã ghi sổ cái",
      mst: "",
      ma_nt: "VND",
      ty_gia: "1",
    });
    setTaiKhoanList([{
      tk_so: "",
      tk_me: "",
      ten_tai_khoan: "",
      ps_co: 0,
      dien_giai: ""
    }]);
    setMaTaiKhoanSearchList([]);
    setShowAccountDropdownList([]);
    setActiveSearchIndex(-1);
    setMaKhSearch("");
    setMaTaiKhoanSearch("");
    setShowCustomerDropdown(false);
    setShowAccountDropdown(false);
    setIsLoadingAccountNames(false);
  };

  const handleClose = () => {
    resetForm();
    closeModalEdit();
  };

  return (
    <Modal isOpen={isOpenEdit} onClose={handleClose} title="Thêm mới phiếu thu" className="w-full max-w-7xl m-1 border-2">
      <form onSubmit={handleSubmit} className="relative w-full h-[88vh] bg-white dark:bg-gray-900 flex flex-col rounded-full">
        <div className="flex-shrink-0 px-6 lg:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Cập nhật phiếu thu tiền mặt
                {isLoadingAccountNames && (
                  <span className="text-sm text-blue-600 animate-pulse">
                    (Đang tải tên tài khoản...)
                  </span>
                )}
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin phiếu thu tiền mặt sửa vào hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Content area - KHÔNG scroll, chia thành 2 phần cố định */}
        <div className="flex-1 min-h-0 flex flex-col">

          {/* Phần 1: 2 khung thông tin - 60% chiều cao */}
          <div className="h-[60%] px-6 py-4 flex-shrink-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">

              {/* Khung trái - Thông tin chung */}
              <div className="dark:border-gray-600 rounded-lg flex flex-col lg:col-span-3">
                <div className="p-3 flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs mb-0.5">Loại phiếu thu</Label>
                      <Input
                        value={formData.ma_gd}
                        onChange={e => handleChange("ma_gd", e.target.value)}
                        placeholder="2"
                        className="h-8 text-sm"
                      />
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Mã khách</Label>
                      <div className="relative customer-dropdown-container">
                        <Input
                          value={maKhSearch}
                          onChange={e => {
                            setMaKhSearch(e.target.value);
                            handleChange("ma_kh", e.target.value);
                          }}
                          placeholder="Nhập mã khách hàng..."
                          onFocus={() => maKhSearch && setShowCustomerDropdown(true)}
                          className="h-8 text-sm"
                        />
                        {showCustomerDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {customerData?.data && customerData.data.length > 0 ? (
                              <>
                                {customerData.data.slice(0, 10).map((customer, index) => (
                                  <div
                                    key={index}
                                    onClick={() => handleCustomerSelect(customer)}
                                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                                  >
                                    <div className="flex flex-col">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {customer.ma_kh}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          MST: {customer.ma_so_thue || 'N/A'}
                                        </span>
                                      </div>
                                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                        {customer.ten_kh}
                                      </span>
                                      {customer.dia_chi && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                          {customer.dia_chi}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {customerData.data.length > 10 && (
                                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-600">
                                    Hiển thị 10/{customerData.data.length} kết quả
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                Không tìm thấy khách hàng cho "{maKhSearch}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <Label className="text-xs mb-0.5">Địa chỉ</Label>
                        <Input value={formData.dia_chi} disabled className="h-8 text-sm" />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs mb-0.5">MST</Label>
                        <Input value={formData.mst} disabled className="h-8 text-sm" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Người nộp tiền</Label>
                      <Input value={formData.ong_ba} disabled className="h-8 text-sm" />
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Lý do nộp</Label>
                      <Input value={formData.dien_giai} onChange={e => handleChange("dien_giai", e.target.value)} className="h-8 text-sm" />
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Tk nợ</Label>
                      <div className="relative account-dropdown-container">
                        <Input
                          value={maTaiKhoanSearch}
                          onChange={e => {
                            setMaTaiKhoanSearch(e.target.value);
                            handleChange("tk", e.target.value);
                          }}
                          placeholder="Nhập mã tài khoản..."
                          onFocus={() => maTaiKhoanSearch && setShowAccountDropdown(true)}
                          className="h-8 text-sm"
                        />
                        <span className="text-xs text-gray-400 mt-0.5 block">Tiền mặt VND</span>
                        {showAccountDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {accountData?.data && accountData.data.length > 0 ? (
                              <>
                                {accountData.data.slice(0, 10).map((account, index) => (
                                  <div
                                    key={index}
                                    onClick={() => handleAccountSelect(account)}
                                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                                  >
                                    <div className="flex flex-col">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {account.tk}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {account.tk_me || 'N/A'}
                                        </span>
                                      </div>
                                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                        {account.ten_tk}
                                      </span>
                                      {account.ma_nt && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                          {account.ma_nt}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {accountData.data.length > 10 && (
                                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-600">
                                    Hiển thị 10/{accountData.data.length} kết quả
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                                Không tìm thấy tài khoản cho "{maTaiKhoanSearch}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Khung phải - Chứng từ */}
              <div className="dark:border-gray-600 rounded-lg flex flex-col lg:col-span-2">
                <div className="p-3 flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs mb-0.5">Ngày hạch toán</Label>
                      <div className="relative w-full flatpickr-wrapper">
                        <DatePicker
                          selected={formData.ngay_ct}
                          onChange={date => handleDateChange(date, "ngay_ct")}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="yyyy-mm-dd"
                          className="h-8 w-full rounded-lg border appearance-none px-3 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                        />
                        {/* <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <CalenderIcon className="size-4" />
                        </span> */}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Ngày lập phiếu thu</Label>
                      <div className="relative w-full flatpickr-wrapper">
                        <DatePicker
                          selected={formData.ngay_lct}
                          onChange={date => handleDateChange(date, "ngay_lct")}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="yyyy-mm-dd"
                          className="h-8 w-full rounded-lg border appearance-none px-3 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                        />
                        {/* <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <CalenderIcon className="size-4" />
                        </span> */}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Quyển số</Label>
                      <Input value={formData.ma_qs} onChange={e => handleChange("ma_qs", e.target.value)} placeholder="PT001" className="h-8 text-sm" />
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Số phiếu thu</Label>
                      <Input value={formData.so_ct} onChange={e => handleChange("so_ct", e.target.value)} className="h-8 text-sm" />
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">TGGD</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={formData.ma_nt || "VND"}
                          onChange={e => handleChange("ma_nt", e.target.value)}
                          className="h-8 w-full rounded-lg border appearance-none px-3 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                        >
                          <option value="VND">VND</option>
                          <option value="USD">USD</option>
                        </select>
                        <Input
                          value={formData.ty_gia}
                          onChange={e => handleChange("ty_gia", e.target.value)}
                          placeholder="1,00"
                          disabled
                          className="bg-gray-50 dark:bg-gray-800 text-right h-8 text-sm col-span-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Trạng thái</Label>
                      <Input value={formData.loai_ct} disabled className="h-8 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phần 2: Hạch toán - 40% chiều cao */}
          <div className="h-[40%] px-6 pb-4 flex-shrink-0 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Hạch toán
              </h5>
              <Button type="button" variant="outline" size="sm" onClick={addTaiKhoan} className="h-9 px-4 text-sm">
                + Thêm dòng
              </Button>
            </div>

            {/* Table - CHỈ SCROLL Ở ĐÂY khi vượt quá 40% */}
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto min-h-0">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
                    <tr>
                      <th className="border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 w-16">STT</th>
                      <th className="border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 w-32">TK số</th>
                      <th className="border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Tên tài khoản</th>
                      <th className="border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 w-32">Phát sinh có</th>
                      <th className="border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Diễn giải</th>
                      <th className="border-b border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 w-24">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taiKhoanList.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center">
                          {index + 1}
                        </td>
                        <td className="px-2 py-2 relative account-table-dropdown">
                          <Input
                            value={item.tk_so}
                            onChange={e => {
                              const value = e.target.value;
                              handleTaiKhoanChange(index, 'tk_so', value);

                              // Gán search cho đúng dòng
                              setMaTaiKhoanSearchList(prev => {
                                const updated = [...prev];
                                updated[index] = value;
                                return updated;
                              });

                              // Set active search index để API chỉ search cho dòng này
                              setActiveSearchIndex(index);

                              // CHỈ hiện dropdown của dòng hiện tại khi có từ khóa
                              setShowAccountDropdownList(prev => {
                                const updated = [...prev];
                                // Tắt tất cả dropdown khác
                                for (let i = 0; i < updated.length; i++) {
                                  if (i !== index) updated[i] = false;
                                }
                                // Chỉ bật dropdown của dòng hiện tại nếu có value
                                updated[index] = value.trim() !== "";
                                return updated;
                              });
                            }}
                            onFocus={() => {
                              // Set active search index
                              setActiveSearchIndex(index);

                              // Tắt tất cả dropdown khác trước
                              setShowAccountDropdownList(prev => {
                                const updated = [...prev];
                                for (let i = 0; i < updated.length; i++) {
                                  if (i !== index) updated[i] = false;
                                }
                                // Chỉ hiển thị dropdown của dòng hiện tại nếu có dữ liệu
                                if (maTaiKhoanSearchList[index]?.trim()) {
                                  updated[index] = true;
                                }
                                return updated;
                              });
                            }}
                            onBlur={() => {
                              // Delay để tránh mất focus trước khi click
                              setTimeout(() => {
                                setShowAccountDropdownList(prev => {
                                  const updated = [...prev];
                                  updated[index] = false;
                                  return updated;
                                });
                              }, 200);
                            }}
                            placeholder="TK số *"
                            className="h-8 text-sm"
                          />
                          {showAccountDropdownList[index] && activeSearchIndex === index && (
                            <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow max-h-60 overflow-y-auto">
                              {accountDataList?.data?.length > 0 ? (
                                accountDataList.data
                                  .filter(account =>
                                    !maTaiKhoanSearchList[index] ||
                                    account.tk?.toLowerCase().includes(maTaiKhoanSearchList[index]?.toLowerCase()) ||
                                    account.ten_tk?.toLowerCase().includes(maTaiKhoanSearchList[index]?.toLowerCase())
                                  )
                                  .slice(0, 10)
                                  .map((account, accIndex) => (
                                    <div
                                      key={accIndex}
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                      onClick={() => {
                                        const newList = [...taiKhoanList];
                                        newList[index].tk_so = account.tk;
                                        newList[index].ten_tai_khoan = account.ten_tk;
                                        newList[index].tk_me = account.tk_me || '';
                                        setTaiKhoanList(newList);

                                        // Ẩn dropdown sau khi chọn
                                        setShowAccountDropdownList(prev => {
                                          const updated = [...prev];
                                          updated[index] = false;
                                          return updated;
                                        });

                                        // Gán lại search term để phù hợp với dropdown sau
                                        setMaTaiKhoanSearchList(prev => {
                                          const updated = [...prev];
                                          updated[index] = account.tk;
                                          return updated;
                                        });
                                      }}
                                    >
                                      <div className="font-medium text-gray-900 dark:text-gray-100">{account.tk}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{account.ten_tk}</div>
                                    </div>
                                  ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                  {maTaiKhoanSearchList[index]
                                    ? `Không tìm thấy tài khoản cho "${maTaiKhoanSearchList[index]}"`
                                    : "Không có tài khoản nào"}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            value={item.ten_tai_khoan}
                            onChange={e => handleTaiKhoanChange(index, 'ten_tai_khoan', e.target.value)}
                            className="h-8 text-sm bg-gray-50 dark:bg-gray-800"
                            placeholder="Tên tài khoản"
                            disabled={item.tk_so && item.tk_so.trim() !== ""}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            type="number"
                            value={item.ps_co}
                            onChange={e => handleTaiKhoanChange(index, 'ps_co', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <Input
                            value={item.dien_giai}
                            onChange={e => handleTaiKhoanChange(index, 'dien_giai', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Diễn giải"
                          />
                        </td>
                        <td className="px-2 py-2 text-center">
                          {taiKhoanList.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTaiKhoan(index)}
                              className="h-8 px-2 text-sm text-red-600 hover:text-red-700"
                            >
                              Xóa
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer tổng tiền - sticky bottom */}
              <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-4 py-2 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng tiền:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {getTongTien().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons - CỐ ĐỊNH */}
        <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 justify-end bg-gray-50 dark:bg-gray-800 flex-shrink-0 rounded-b-3xl">
          <Button variant="outline" type="button" onClick={handleClose} className="h-10 px-6 text-sm">Hủy</Button>
          <Button type="submit" disabled={updateCashReceiptMutation.isLoading} className="h-10 px-6 text-sm">
            {updateCashReceiptMutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};