import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalenderIcon } from "../../../icons";
import { useCreateCashReceipt } from "../../../hooks/useCashReceipt";
import { useCustomers } from "../../../hooks/useCustomer";
import { useAccounts } from "../../../hooks/useAccounts";
import { useEffect } from "react";

export const ModalCreateCashReceipt = ({ isOpenCreate, closeModalCreate }) => {
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

  // State cho danh sách tài khoản
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

  // State cho account dropdown (tài khoản nợ)
  const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [maTaiKhoanSearchList, setMaTaiKhoanSearchList] = useState([]);
  const [showAccountDropdownList, setShowAccountDropdownList] = useState([]);


  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});
  const { data: accountDataList = [] } = useAccounts(
    maTaiKhoanSearchList.some(keyword => keyword?.length > 0)
      ? { search: maTaiKhoanSearchList.find(k => k.length > 0) }
      : {}
  );

  useEffect(() => {
    const timeouts = [];

    maTaiKhoanSearchList.forEach((searchValue, index) => {
      const timeout = setTimeout(() => {
        if (searchValue && searchValue.length > 0) {
          // Chỉ hiển thị dropdown nếu chưa được hiển thị
          setShowAccountDropdownList(prev => {
            const newList = [...prev];
            if (!newList[index]) { // Chỉ set true nếu hiện tại là false
              newList[index] = true;
            }
            return newList;
          });
        } else {
          setShowAccountDropdownList(prev => {
            const newList = [...prev];
            newList[index] = false;
            return newList;
          });
        }
      }, 300);

      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [maTaiKhoanSearchList]);

  // Debounce customer search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maKhSearch && maKhSearch.length > 0) {
        console.log('🔍 Searching for customer:', maKhSearch);
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
        console.log('🔍 Searching for account:', maTaiKhoanSearch);
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

      // Kiểm tra xem target có phải là element và có method closest không
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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createCashReceiptMutation = useCreateCashReceipt();

  // const handleChange = (field, value) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));

  //   // Trigger customer search when ma_kh changes
  //   if (field === 'ma_kh') {
  //     setMaKhSearch(value);
  //   }

  //   // Trigger account search when tk changes
  //   if (field === 'tk') {
  //     setMaTaiKhoanSearch(value);
  //   }
  // };
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
      tk: account.ma_tk // hoặc account.so_tk tùy theo cấu trúc dữ liệu của bạn
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

  // Xử lý thay đổi dữ liệu tài khoản
  const handleTaiKhoanChange = (index, field, value) => {
    const newList = [...taiKhoanList];
    newList[index] = {
      ...newList[index],
      [field]: field === 'ps_co' ? Number(value) || 0 : value
    };
    setTaiKhoanList(newList);
  };
  // Xóa dòng
  const removeTaiKhoan = (index) => {
    if (taiKhoanList.length > 1) {
      const newList = taiKhoanList.filter((_, i) => i !== index);
      setTaiKhoanList(newList);
    }
  };

  // Tính tổng tiền
  const getTongTien = () => {
    return taiKhoanList.reduce((total, item) => total + (item.ps_co || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cho danh sách tài khoản
    const validTaiKhoanList = taiKhoanList.filter(item =>
      item.tk_so && item.tk_so.trim() !== '' &&
      item.tk_me && item.tk_me.trim() !== ''
    );

    // if (validTaiKhoanList.length === 0) {
    //   alert('Vui lòng nhập ít nhất một tài khoản với TK số và TK mẹ hợp lệ!');
    //   return;
    // }

    const dataToSave = {
      ma_gd: formData.ma_gd || "2",
      ma_kh: formData.ma_kh,
      dia_chi: formData.dia_chi,
      ong_ba: formData.ong_ba,
      dien_giai: formData.dien_giai,
      ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : undefined,
      ngay_lct: formData.ngay_lct ? new Date(formData.ngay_lct).toISOString() : undefined,
      ma_qs: formData.ma_qs,
      so_ct: formData.so_ct ? formData.so_ct : "2",
      ma_nt: formData.ma_nt || "VND",
      ty_gia: formData.ty_gia ? Number(formData.ty_gia) : 1,
      loai_ct: "PT",
      tai_khoan_list: validTaiKhoanList,
      tong_tien: validTaiKhoanList.reduce((total, item) => total + (item.ps_co || 0), 0),
      han_thanh_toan: 0
    };

    await createCashReceiptMutation.mutateAsync(dataToSave);
    resetForm();
    closeModalCreate();
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

    setMaKhSearch("");
    setMaTaiKhoanSearch("");
    setShowCustomerDropdown(false);
    setShowAccountDropdown(false);
  };

  const handleClose = () => {
    resetForm();
    closeModalCreate();
  };
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
  return (// Thay thế phần Modal trong code của bạn:

    <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới phiếu thu" className="max-w-[98vw] max-h-[95vh] m-1">
      <div className="relative w-full h-[88vh] bg-white dark:bg-gray-900 flex flex-col">

        {/* Header section - compact */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Nhập thông tin phiếu thu tiền vào hệ thống.
          </p>
        </div>

        {/* Content area - KHÔNG scroll, chia thành 2 phần cố định */}
        <div className="flex-1 min-h-0 flex flex-col">

          {/* Phần 1: 2 khung thông tin - 70% chiều cao */}
          <div className="h-[70%] px-6 py-4 flex-shrink-0">
            {/* Layout 2 khung với viền và title */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

              {/* Khung trái - Thông tin chung */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-600 rounded-t-lg flex-shrink-0">
                  <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Thông tin chung</h6>
                </div>

                {/* Nội dung khung trái - fit trong không gian */}
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
                      <Label className="text-xs mb-0.5">Thu chi tiết theo khách hàng</Label>
                      <Input
                        value={formData.dien_giai}
                        onChange={e => handleChange("dien_giai", e.target.value)}
                        placeholder="Thu tiền đặt cọc hợp đồng"
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

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs mb-0.5">Địa chỉ</Label>
                        <Input value={formData.dia_chi} disabled className="h-8 text-sm" />
                      </div>
                      <div>
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
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col">
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-300 dark:border-gray-600 rounded-t-lg flex-shrink-0">
                  <h6 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Chứng từ</h6>
                </div>

                {/* Nội dung khung phải - fit trong không gian */}
                <div className="p-3 flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs mb-0.5">Ngày hạch toán</Label>
                      <div className="relative w-full flatpickr-wrapper">
                        <Flatpickr
                          value={formData.ngay_ct}
                          onChange={date => handleDateChange(date, "ngay_ct")}
                          options={{
                            dateFormat: "Y-m-d",
                            locale: Vietnamese,
                          }}
                          placeholder="dd-mm-yyyy"
                          className="h-8 w-full rounded-lg border appearance-none px-3 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <CalenderIcon className="size-4" />
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Ngày lập phiếu thu</Label>
                      <div className="relative w-full flatpickr-wrapper">
                        <Flatpickr
                          value={formData.ngay_lct}
                          onChange={date => handleDateChange(date, "ngay_lct")}
                          options={{
                            dateFormat: "Y-m-d",
                            locale: Vietnamese,
                          }}
                          placeholder="dd-mm-yyyy"
                          className="h-8 w-full rounded-lg border appearance-none px-3 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                          <CalenderIcon className="size-4" />
                        </span>
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
                      <div className="grid grid-cols-2 gap-2">
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
                          className="bg-gray-50 dark:bg-gray-800 text-right h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-0.5">Trạng thái</Label>
                      <select
                        value={formData.loai_ct}
                        onChange={e => handleChange("loai_ct", e.target.value)}
                        className="h-8 w-full rounded-lg border appearance-none px-3 py-2 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                      >
                        <option value="Đã ghi sổ cái">Đã ghi sổ cái</option>
                        <option value="Chưa ghi sổ cái">Chưa ghi sổ cái</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phần 2: Hạch toán - 30% chiều cao */}
          <div className="h-[30%] px-6 pb-4 flex-shrink-0 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Hạch toán
              </h5>
              <Button type="button" variant="outline" size="sm" onClick={addTaiKhoan} className="h-9 px-4 text-sm">
                + Thêm dòng
              </Button>
            </div>

            {/* Table - CHỈ SCROLL Ở ĐÂY khi vượt quá 30% */}
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

                              // Hiện dropdown chỉ khi có từ khóa
                              setShowAccountDropdownList(prev => {
                                const updated = [...prev];
                                updated[index] = value.trim() !== "";
                                return updated;
                              });
                            }}
                            onFocus={() => {
                              // Nếu có dữ liệu thì hiển thị dropdown
                              if (maTaiKhoanSearchList[index]?.trim()) {
                                setShowAccountDropdownList(prev => {
                                  const updated = [...prev];
                                  updated[index] = true;
                                  return updated;
                                });
                              }
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
                          {showAccountDropdownList[index] && (
                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
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
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                      onClick={() => {
                                        const newList = [...taiKhoanList];
                                        newList[index].tk_so = account.tk;
                                        newList[index].ten_tai_khoan = account.ten_tk;
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
                                      <div className="font-medium">{account.tk}</div>
                                      <div className="text-sm text-gray-500">{account.ten_tk}</div>
                                    </div>
                                  ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500">
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
                            className="h-8 text-sm"
                            placeholder="Tên tài khoản"
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
        <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 justify-end bg-gray-50 dark:bg-gray-800 flex-shrink-0">
          <Button variant="outline" type="button" onClick={handleClose} className="h-10 px-6 text-sm">Hủy</Button>
          <Button type="submit" className="h-10 px-6 text-sm">Lưu</Button>
        </div>
      </div>
    </Modal>
  );
};