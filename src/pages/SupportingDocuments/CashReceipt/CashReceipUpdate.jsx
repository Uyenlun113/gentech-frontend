import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalenderIcon } from "../../../icons";
import { useUpdateCashReceipt } from "../../../hooks/useCashReceipt";
import { useCustomers } from "../../../hooks/useCustomer";
import { useAccounts } from "../../../hooks/useAccounts";

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

  // State cho account dropdown (tài khoản nợ)
  const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});
  
  // Hook cho tìm kiếm tài khoản trong bảng hạch toán
  const { data: accountDataList = [] } = useAccounts(
    maTaiKhoanSearchList.some(keyword => keyword?.length > 0)
      ? { search: maTaiKhoanSearchList.find(k => k.length > 0) }
      : {}
  );

  // Effect để xử lý debounce cho dropdown trong bảng hạch toán
  useEffect(() => {
    const timeouts = [];

    maTaiKhoanSearchList.forEach((searchValue, index) => {
      const timeout = setTimeout(() => {
        if (searchValue && searchValue.length > 0) {
          setShowAccountDropdownList(prev => {
            const newList = [...prev];
            if (!newList[index]) {
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
        
        setTaiKhoanList(taiKhoanData);
        
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

  // Xử lý thay đổi dữ liệu tài khoản
  const handleTaiKhoanChange = (index, field, value) => {
    const newList = [...taiKhoanList];
    newList[index] = {
      ...newList[index],
      [field]: field === 'ps_co' ? Number(value) || 0 : value
    };
    setTaiKhoanList(newList);
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
      
      // Cập nhật mảng search và dropdown
      setMaTaiKhoanSearchList(prev => prev.filter((_, i) => i !== index));
      setShowAccountDropdownList(prev => prev.filter((_, i) => i !== index));
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
      item.tk_so && item.tk_so.trim() !== '' &&
      item.tk_me && item.tk_me.trim() !== ''
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
    setMaKhSearch("");
    setMaTaiKhoanSearch("");
    setShowCustomerDropdown(false);
    setShowAccountDropdown(false);
  };

  const handleClose = () => {
    resetForm();
    closeModalEdit();
  };

  return (
    <Modal isOpen={isOpenEdit} onClose={handleClose} title="Chỉnh sửa phiếu thu" className="max-w-[900px] m-4 h-[900px]">
      <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 h-[900px]">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Chỉnh sửa phiếu thu
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Cập nhật thông tin phiếu thu tiền trong hệ thống.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="custom-scrollbar h-[680px] overflow-y-auto px-2 pb-3">
            {/* Thông tin chung */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2 mb-6">
              <div><Label>Loại phiếu thu</Label><Input value={formData.ma_gd} onChange={e => handleChange("ma_gd", e.target.value)} placeholder="2" /></div>

              {/* Customer dropdown */}
              <div>
                <Label>Mã khách</Label>
                <div className="relative customer-dropdown-container">
                  <Input
                    value={maKhSearch}
                    onChange={e => {
                      setMaKhSearch(e.target.value);
                      handleChange("ma_kh", e.target.value);
                    }}
                    placeholder="Nhập mã khách hàng..."
                    onFocus={() => maKhSearch && setShowCustomerDropdown(true)}
                  />

                  {/* Dropdown customer list */}
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

              <div><Label>Người nộp</Label><Input value={formData.ong_ba} disabled /></div>
              <div><Label>Mã số thuế</Label><Input value={formData.mst} disabled /></div>
              <div><Label>Địa chỉ</Label><Input value={formData.dia_chi} disabled /></div>
              <div><Label>Trạng thái</Label><Input value={formData.loai_ct} disabled /></div>
              <div className="col-span-2"><Label>Lý do nộp</Label><Input value={formData.dien_giai} onChange={e => handleChange("dien_giai", e.target.value)} /></div>

              {/* Account dropdown */}
              <div className="col-span-2">
                <Label>Tài khoản nợ</Label>
                <div className="relative account-dropdown-container">
                  <Input
                    value={maTaiKhoanSearch}
                    onChange={e => {
                      setMaTaiKhoanSearch(e.target.value);
                      handleChange("tk", e.target.value);
                    }}
                    placeholder="Nhập mã tài khoản..."
                    onFocus={() => maTaiKhoanSearch && setShowAccountDropdown(true)}
                  />
                  <span className="text-xs text-gray-400 mt-1 block">VND</span>
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

              <div>
                <Label>Ngày lập phiếu thu</Label>
                <div className="relative w-full flatpickr-wrapper">
                  <Flatpickr
                    value={formData.ngay_lct}
                    onChange={date => handleDateChange(date, "ngay_lct")}
                    options={{
                      dateFormat: "Y-m-d",
                      locale: Vietnamese,
                    }}
                    placeholder="dd-mm-yyyy"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon className="size-6" />
                  </span>
                </div>
              </div>
              <div>
                <Label>Ngày hạch toán</Label>
                <div className="relative w-full flatpickr-wrapper">
                  <Flatpickr
                    value={formData.ngay_ct}
                    onChange={date => handleDateChange(date, "ngay_ct")}
                    options={{
                      dateFormat: "Y-m-d",
                      locale: Vietnamese,
                    }}
                    placeholder="dd-mm-yyyy"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon className="size-6" />
                  </span>
                </div>
              </div>
              <div><Label>Quyển số</Label><Input value={formData.ma_qs} onChange={e => handleChange("ma_qs", e.target.value)} placeholder="PT001"/></div>
              <div><Label>Số phiếu thu</Label><Input value={formData.so_ct} onChange={e => handleChange("so_ct", e.target.value)} /></div>
              <div>
                <Label>TGGD</Label>
                <select
                  value={formData.ma_nt || "VND"}
                  onChange={e => handleChange("ma_nt", e.target.value)}
                  className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <Label>Mức tỷ giá giao dịch</Label>
                <Input
                  value={formData.ty_gia}
                  onChange={e => handleChange("ty_gia", e.target.value)}
                  placeholder={formData.ma_nt === 'USD' ? '25000' : '1'}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Bảng hạch toán với dropdown */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Hạch toán
                </h5>
                <Button type="button" variant="outline" size="sm" onClick={addTaiKhoan}>
                  + Thêm dòng
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taiKhoanList.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 relative account-table-dropdown">
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
                            <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
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
                                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
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
                                  ))
                              ) : (
                                <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm">
                                  {maTaiKhoanSearchList[index]
                                    ? `Không tìm thấy tài khoản cho "${maTaiKhoanSearchList[index]}"`
                                    : "Không có tài khoản nào"}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            value={item.ten_tai_khoan}
                            onChange={e => handleTaiKhoanChange(index, 'ten_tai_khoan', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Tên tài khoản"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            type="number"
                            value={item.ps_co}
                            onChange={e => handleTaiKhoanChange(index, 'ps_co', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            value={item.dien_giai}
                            onChange={e => handleTaiKhoanChange(index, 'dien_giai', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Diễn giải"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                          {taiKhoanList.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTaiKhoan(index)}
                              className="h-8 px-2 text-red-600 hover:text-red-700"
                            >
                              Xóa
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan="4" className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
                        Tổng tiền:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {getTongTien().toLocaleString()}
                      </td>
                      <td colSpan="2" className="border border-gray-300 dark:border-gray-600"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button variant="outline" type="button" onClick={handleClose}>Hủy</Button>
            <Button type="submit" disabled={updateCashReceiptMutation.isLoading}>
              {updateCashReceiptMutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};