import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Building2, Calendar, CreditCard, Filter, Loader, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useAccounts } from "../hooks/useAccounts";
import { CalenderIcon } from "../icons";
import AccountSelectionPopup from "./general/AccountSelectionPopup";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function FilterModal({ isOpen, onClose, selectedItem, defaultValues, onSubmit, isSubmitting = false }) {
  const [filterData, setFilterData] = useState({
    tk: "",
    ngay_ct1: "",
    ngay_ct2: "",
    ma_dvcs: "",
    store: "",
    gop_tk: 0,
  });

  const [tkSearch, setTkSearch] = useState("");
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [isAccountInputFocused, setIsAccountInputFocused] = useState(false);

  // Debounce search để giảm số lần gọi API
  const debouncedTkSearch = useDebounce(tkSearch, 300);

  const { data: accountRawData = {}, isLoading: isLoadingAccounts } = useAccounts(
    debouncedTkSearch ? { search: debouncedTkSearch } : {}
  );

  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        setFilterData((prev) => ({ ...prev, ...defaultValues }));
      }
    } else {
      // Reset khi đóng modal
      setTkSearch("");
      setShowAccountPopup(false);
      setIsAccountInputFocused(false);
    }
  }, [isOpen, defaultValues]);

  // Xử lý hiển thị popup account
  useEffect(() => {
    if (debouncedTkSearch && isAccountInputFocused) {
      setShowAccountPopup(true);
    } else if (!tkSearch) {
      setShowAccountPopup(false);
    }
  }, [debouncedTkSearch, isAccountInputFocused, tkSearch]);

  const handleInputChange = useCallback((field, value) => {
    setFilterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleAccountInputChange = useCallback(
    (value) => {
      setTkSearch(value);
      if (value !== filterData.tk) {
        setFilterData((prev) => ({ ...prev, tk: "" }));
      }
    },
    [filterData.tk]
  );

  const handleAccountSelect = useCallback((account) => {
    const accountCode = account.tk?.trim() || "";
    setFilterData((prev) => ({
      ...prev,
      tk: accountCode,
    }));
    setTkSearch(accountCode);
    setShowAccountPopup(false);
    setIsAccountInputFocused(false);
  }, []);

  const handleAccountInputFocus = useCallback(() => {
    setIsAccountInputFocused(true);
    if (tkSearch) {
      setShowAccountPopup(true);
    }
  }, [tkSearch]);

  const handleAccountInputBlur = useCallback(() => {
    // Delay để cho phép click vào popup
    setTimeout(() => {
      setIsAccountInputFocused(false);
    }, 200);
  }, []);

  const handleSubmit = useCallback(() => {
    // Validate dữ liệu trước khi submit
    const submitData = {
      ...filterData,
      tk: filterData.tk || tkSearch.trim(),
    };

    console.log("Filter data:", submitData);
    onSubmit(submitData);
  }, [filterData, tkSearch, onSubmit]);

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      onClose();
    }
  }, [isSubmitting, onClose]);

  // Xử lý ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const showGroupAccountField = ["inventory", "inventory-detail", "import-export-summary"].includes(selectedItem?.id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all">
        {/* Header với gradient */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-blue-500 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{selectedItem?.label || "Bộ lọc dữ liệu"}</h3>
              <p className="text-blue-100 text-sm mt-1">Thiết lập các tiêu chí lọc dữ liệu</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 bg-gray-50/50">
          <div className="space-y-6">
            {/* Tài khoản */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                Mã tài khoản
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filterData.tk || tkSearch}
                  onChange={(e) => handleAccountInputChange(e.target.value)}
                  onFocus={handleAccountInputFocus}
                  onBlur={handleAccountInputBlur}
                  placeholder="Nhập mã tài khoản để tìm kiếm..."
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  disabled={isSubmitting}
                />
                {isLoadingAccounts && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
                {!isLoadingAccounts && (filterData.tk || tkSearch) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Khoảng thời gian */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Từ ngày */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium flex">
                    {" "}
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Từ ngày
                  </label>
                  <div className="relative">
                    <Flatpickr
                      value={filterData.ngay_ct1}
                      onChange={(date) => {
                        const formatted = date[0]?.toLocaleDateString("en-CA");
                        handleInputChange("ngay_ct1", formatted);
                      }}
                      options={{
                        dateFormat: "Y-m-d",
                        locale: Vietnamese,
                        allowInput: true,
                      }}
                      placeholder="Chọn ngày bắt đầu"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      disabled={isSubmitting}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <CalenderIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Đến ngày */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-medium flex">
                    {" "}
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Đến ngày
                  </label>
                  <div className="relative">
                    <Flatpickr
                      value={filterData.ngay_ct2}
                      onChange={(date) => {
                        const formatted = date[0]?.toLocaleDateString("en-CA");
                        handleInputChange("ngay_ct2", formatted);
                      }}
                      options={{
                        dateFormat: "Y-m-d",
                        locale: Vietnamese,
                        allowInput: true,
                        minDate: filterData.ngay_ct1 || undefined,
                      }}
                      placeholder="Chọn ngày kết thúc"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                      disabled={isSubmitting}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <CalenderIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row chứa Mã ĐVCS và Gộp TK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mã ĐVCS */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                  Mã đơn vị
                </label>
                <input
                  type="text"
                  value={filterData.ma_dvcs}
                  onChange={(e) => handleInputChange("ma_dvcs", e.target.value)}
                  placeholder="Nhập mã đơn vị..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  disabled={isSubmitting}
                />
              </div>

              {/* Gộp TK */}
              {showGroupAccountField && (
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Filter className="w-4 h-4 mr-2 text-blue-600" />
                    Gộp tài khoản
                  </label>
                  <select
                    value={filterData.gop_tk}
                    onChange={(e) => handleInputChange("gop_tk", parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    disabled={isSubmitting}
                  >
                    <option value={0}>Không gộp</option>
                    <option value={1}>Có gộp</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-100 bg-white rounded-b-xl">
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Áp dụng lọc
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Popup chọn tài khoản */}
      {showAccountPopup && (
        <AccountSelectionPopup
          isOpen={true}
          onClose={() => setShowAccountPopup(false)}
          onSelect={handleAccountSelect}
          accounts={accountRawData.data || []}
          searchValue={tkSearch}
        />
      )}
    </div>
  );
}
