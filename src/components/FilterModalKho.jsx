import { Building2, Calendar, CreditCard, Filter, Loader, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getFilterConfig, validateSubmitData } from "./UISearch_and_formData/UISearch_and_formData"
import CustomerSelectionPopup from "../components/general/CustomerSelectionPopup";
import WarehouseSelectionPopup from "../components/general/dmkPopup";
import MaterialSelectionPopup from "../components/general/dmvtPopup";
import { useCustomers } from "../hooks/useCustomer";
import { useDmkho } from "../hooks/useDmkho";
import { useDmvt } from "../hooks/useDmvt";

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

export default function FilterModalKho({
  isOpen,
  onClose,
  selectedItem,
  onSubmit,
  isSubmitting = false,
  configName,
  configTitle,
  onSearch,
  title = "Bộ lọc dữ liệu"
}) {
  // State cho cấu hình từ getFilterConfig
  const [filterConfig, setFilterConfig] = useState(null);
  const [filterData, setFilterData] = useState({});

  // State cho các trường lookup - SỬA LẠI: Thêm ma_kho_xuat và ma_kho_nhap
  const [searchStates, setSearchStates] = useState({
    ma_khach: "",
    ma_kho: "",
    ma_kho_xuat: "",
    ma_kho_nhap: "",
    ma_vat_tu: "",
  });

  // ✅ THÊM: State riêng cho popup search values
  const [popupSearchStates, setPopupSearchStates] = useState({
    ma_khach: "",
    ma_kho: "",
    ma_kho_xuat: "",
    ma_kho_nhap: "",
    ma_vat_tu: "",
  });

  // ✅ THÊM: State riêng cho popup states - thêm popup cho kho xuất và kho nhập
  const [popupStates, setPopupStates] = useState({
    showCustomerPopup: false,
    showKhoPopup: false,
    showKhoXuatPopup: false,
    showKhoNhapPopup: false,
    showVatTuPopup: false,
  });

  const [focusStates, setFocusStates] = useState({});
  const [searchResults, setSearchResults] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // State cho validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Debounced search values
  const [debouncedSearches, setDebouncedSearches] = useState({});

  // Tạo allFields từ filterConfig.searchFields object
  let allFields = [];
  if (filterConfig && filterConfig.searchFields && typeof filterConfig.searchFields === 'object') {
    allFields = [
      ...(filterConfig.searchFields.mainFieldKeys || []),
      ...(filterConfig.searchFields.rightBox1Keys || []),
      ...(filterConfig.searchFields.rightBox2Keys || [])
    ];
  }

  const debouncedMaKhSearch = useDebounce(searchStates.ma_khach || "", 300);
  const debouncedKhoSearch = useDebounce(searchStates.ma_kho || "", 300);
  const debouncedKhoXuatSearch = useDebounce(searchStates.ma_kho_xuat || "", 300);
  const debouncedKhoNhapSearch = useDebounce(searchStates.ma_kho_nhap || "", 300);
  const debouncedVatTuSearch = useDebounce(searchStates.ma_vat_tu || "", 300);

  const debouncedPopupMaKhSearch = useDebounce(popupSearchStates.ma_khach || "", 300);
  const debouncedPopupKhoSearch = useDebounce(popupSearchStates.ma_kho || "", 300);
  const debouncedPopupKhoXuatSearch = useDebounce(popupSearchStates.ma_kho_xuat || "", 300);
  const debouncedPopupKhoNhapSearch = useDebounce(popupSearchStates.ma_kho_nhap || "", 300);
  const debouncedPopupVatTuSearch = useDebounce(popupSearchStates.ma_vat_tu || "", 300);

  const { data: customerData = [], isLoading: isLoadingCustomers } = useCustomers(
    { search: debouncedMaKhSearch || debouncedPopupMaKhSearch || "" },
    {
      enabled: !!(debouncedMaKhSearch || debouncedPopupMaKhSearch) &&
        (debouncedMaKhSearch || debouncedPopupMaKhSearch).length > 0
    }
  );

  const { data: vatTuData = [], isLoading: isLoadingVatTu } = useDmvt(
    { search: debouncedVatTuSearch || debouncedPopupVatTuSearch || "" },
    {
      enabled: !!(debouncedVatTuSearch || debouncedPopupVatTuSearch) &&
        (debouncedVatTuSearch || debouncedPopupVatTuSearch).length > 0
    }
  );

  // ✅ SỬA LẠI: Hook cho kho - sử dụng search value hợp nhất
  const { data: khoData = [], isLoading: isLoadingKho } = useDmkho(
    { search: debouncedKhoSearch || debouncedPopupKhoSearch || "" },
    {
      enabled: !!(debouncedKhoSearch || debouncedPopupKhoSearch) &&
        (debouncedKhoSearch || debouncedPopupKhoSearch).length > 0
    }
  );

  const { data: khoXuatData = [], isLoading: isLoadingKhoXuat } = useDmkho(
    { search: debouncedKhoXuatSearch || debouncedPopupKhoXuatSearch || "" },
    {
      enabled: !!(debouncedKhoXuatSearch || debouncedPopupKhoXuatSearch) &&
        (debouncedKhoXuatSearch || debouncedPopupKhoXuatSearch).length > 0
    }
  );

  const { data: khoNhapData = [], isLoading: isLoadingKhoNhap } = useDmkho(
    { search: debouncedKhoNhapSearch || debouncedPopupKhoNhapSearch || "" },
    {
      enabled: !!(debouncedKhoNhapSearch || debouncedPopupKhoNhapSearch) &&
        (debouncedKhoNhapSearch || debouncedPopupKhoNhapSearch).length > 0
    }
  );

  // Load filter configuration khi component mount hoặc configName thay đổi
  useEffect(() => {
    if (configName) {
      try {
        const config = getFilterConfig(configName);
        setFilterConfig(config);
      } catch (error) {
        console.error("Error loading filter config:", error);
        setFilterConfig(null);
      }
    }
  }, [configName]);

  // Handle search API calls - THÊM xử lý cho kho xuất và kho nhập
  useEffect(() => {
    // API call cho khách hàng
    if (debouncedMaKhSearch && debouncedMaKhSearch.length > 0) {
      setLoadingStates(prev => ({ ...prev, ma_khach: true }));
      setSearchResults(prev => ({
        ...prev,
        ma_khach: customerData.data || []
      }));
      setLoadingStates(prev => ({ ...prev, ma_khach: false }));
    } else {
      setSearchResults(prev => ({ ...prev, ma_khach: [] }));
    }
  }, [debouncedMaKhSearch, customerData]);

  useEffect(() => {
    // API call cho kho
    if (debouncedKhoSearch && debouncedKhoSearch.length > 0) {
      setLoadingStates(prev => ({ ...prev, ma_kho: true }));
      setSearchResults(prev => ({
        ...prev,
        ma_kho: Array.isArray(khoData?.data) ? khoData.data : []
      }));
      setLoadingStates(prev => ({ ...prev, ma_kho: false }));
    } else {
      setSearchResults(prev => ({ ...prev, ma_kho: [] }));
    }
  }, [debouncedKhoSearch, khoData]);

  useEffect(() => {
    // API call cho kho xuất
    if (debouncedKhoXuatSearch && debouncedKhoXuatSearch.length > 0) {
      setLoadingStates(prev => ({ ...prev, ma_kho_xuat: true }));
      setSearchResults(prev => ({
        ...prev,
        ma_kho_xuat: Array.isArray(khoXuatData?.data) ? khoXuatData.data : []
      }));
      setLoadingStates(prev => ({ ...prev, ma_kho_xuat: false }));
    } else {
      setSearchResults(prev => ({ ...prev, ma_kho_xuat: [] }));
    }
  }, [debouncedKhoXuatSearch, khoXuatData]);

  useEffect(() => {
    // API call cho kho nhập
    if (debouncedKhoNhapSearch && debouncedKhoNhapSearch.length > 0) {
      setLoadingStates(prev => ({ ...prev, ma_kho_nhap: true }));
      setSearchResults(prev => ({
        ...prev,
        ma_kho_nhap: Array.isArray(khoNhapData?.data) ? khoNhapData.data : []
      }));
      setLoadingStates(prev => ({ ...prev, ma_kho_nhap: false }));
    } else {
      setSearchResults(prev => ({ ...prev, ma_kho_nhap: [] }));
    }
  }, [debouncedKhoNhapSearch, khoNhapData]);

  useEffect(() => {
    // API call cho vật tư
    if (debouncedVatTuSearch && debouncedVatTuSearch.length > 0) {
      setLoadingStates(prev => ({ ...prev, ma_vat_tu: true }));
      setSearchResults(prev => ({
        ...prev,
        ma_vat_tu: Array.isArray(vatTuData?.data) ? vatTuData.data : []
      }));
      setLoadingStates(prev => ({ ...prev, ma_vat_tu: false }));
    } else {
      setSearchResults(prev => ({ ...prev, ma_vat_tu: [] }));
    }
  }, [debouncedVatTuSearch, vatTuData]);

  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (isOpen && filterConfig) {
      const initialData = {
        ...(filterConfig.defaultFormData || {}),
      };
      setFilterData(initialData);
      setValidationErrors({});
    } else if (!isOpen) {
      // Reset states khi đóng modal - THÊM kho xuất và kho nhập
      setSearchStates({
        ma_khach: "",
        ma_kho: "",
        ma_kho_xuat: "",
        ma_kho_nhap: "",
        ma_vat_tu: "",
      });
      // ✅ THÊM: Reset popup search states
      setPopupSearchStates({
        ma_khach: "",
        ma_kho: "",
        ma_kho_xuat: "",
        ma_kho_nhap: "",
        ma_vat_tu: "",
      });
      setPopupStates({
        showCustomerPopup: false,
        showKhoPopup: false,
        showKhoXuatPopup: false,
        showKhoNhapPopup: false,
        showVatTuPopup: false,
      });
      setFocusStates({});
      setSearchResults({});
      setLoadingStates({});
      setValidationErrors({});
    }
  }, [isOpen, filterConfig]);

  // ✅ SỬA LẠI: Logic hiển thị popup - THÊM logic cho kho xuất và kho nhập
  useEffect(() => {
    // Logic cho popup khách hàng
    if (debouncedMaKhSearch && debouncedMaKhSearch.length > 0 &&
      focusStates.ma_khach && !filterData.ma_khach &&
      !popupStates.showKhoPopup && !popupStates.showKhoXuatPopup &&
      !popupStates.showKhoNhapPopup && !popupStates.showVatTuPopup) {
      setPopupStates(prev => ({ ...prev, showCustomerPopup: true }));
    }

    // Logic cho popup kho
    if (debouncedKhoSearch && debouncedKhoSearch.length > 0 &&
      focusStates.ma_kho && !filterData.ma_kho &&
      !popupStates.showCustomerPopup && !popupStates.showKhoXuatPopup &&
      !popupStates.showKhoNhapPopup && !popupStates.showVatTuPopup) {
      setPopupStates(prev => ({ ...prev, showKhoPopup: true }));
    }

    // Logic cho popup kho xuất
    if (debouncedKhoXuatSearch && debouncedKhoXuatSearch.length > 0 &&
      focusStates.ma_kho_xuat && !filterData.ma_kho_xuat &&
      !popupStates.showCustomerPopup && !popupStates.showKhoPopup &&
      !popupStates.showKhoNhapPopup && !popupStates.showVatTuPopup) {
      setPopupStates(prev => ({ ...prev, showKhoXuatPopup: true }));
    }

    // Logic cho popup kho nhập
    if (debouncedKhoNhapSearch && debouncedKhoNhapSearch.length > 0 &&
      focusStates.ma_kho_nhap && !filterData.ma_kho_nhap &&
      !popupStates.showCustomerPopup && !popupStates.showKhoPopup &&
      !popupStates.showKhoXuatPopup && !popupStates.showVatTuPopup) {
      setPopupStates(prev => ({ ...prev, showKhoNhapPopup: true }));
    }

    // Logic cho popup vật tư
    if (debouncedVatTuSearch && debouncedVatTuSearch.length > 0 &&
      focusStates.ma_vat_tu && !filterData.ma_vat_tu &&
      !popupStates.showCustomerPopup && !popupStates.showKhoPopup &&
      !popupStates.showKhoXuatPopup && !popupStates.showKhoNhapPopup) {
      setPopupStates(prev => ({ ...prev, showVatTuPopup: true }));
    }
  }, [debouncedMaKhSearch, debouncedKhoSearch, debouncedKhoXuatSearch, debouncedKhoNhapSearch, debouncedVatTuSearch,
    focusStates, filterData, popupStates.showCustomerPopup, popupStates.showKhoPopup,
    popupStates.showKhoXuatPopup, popupStates.showKhoNhapPopup, popupStates.showVatTuPopup]);

  const handleInputChange = useCallback((field, value) => {
    setFilterData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleSearchInputChange = useCallback((fieldKey, value) => {
    setSearchStates(prev => ({ ...prev, [fieldKey]: value }));

    // ✅ THÊM: Đồng bộ với popup search states
    setPopupSearchStates(prev => ({ ...prev, [fieldKey]: value }));

    // Clear the actual field value if search value changes
    if (value !== filterData[fieldKey]) {
      setFilterData(prev => ({ ...prev, [fieldKey]: "" }));
    }

    // Clear validation error
    if (validationErrors[fieldKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [filterData, validationErrors]);

  const handleLookupSelect = useCallback((fieldKey, selectedItem, field) => {
    const value = selectedItem[field?.valueKey] || selectedItem.ma_kh || selectedItem.ma_kho || selectedItem.ma_vt || "";

    setFilterData(prev => ({
      ...prev,
      [fieldKey]: value,
    }));

    setSearchStates(prev => ({
      ...prev,
      [fieldKey]: value,
    }));

    // ✅ THÊM: Đồng bộ với popup search states
    setPopupSearchStates(prev => ({
      ...prev,
      [fieldKey]: value,
    }));

    // ✅ THÊM: Clear popup search state
    setPopupSearchStates(prev => ({
      ...prev,
      [fieldKey]: "",
    }));

    // ✅ SỬA LẠI: Đóng tất cả popup sau khi chọn - THÊM popup kho xuất và kho nhập
    setPopupStates({
      showCustomerPopup: false,
      showKhoPopup: false,
      showKhoXuatPopup: false,
      showKhoNhapPopup: false,
      showVatTuPopup: false
    });

    // Clear focus state
    setFocusStates({});

    // Clear validation error
    if (validationErrors[fieldKey]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleFormChange = useCallback((field, value) => {
    setFilterData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDateChange = useCallback((date, field) => {
    const formattedDate = date[0]?.toLocaleDateString("en-CA");
    handleFormChange(field, formattedDate);
  }, [handleFormChange]);

  // ✅ SỬA LẠI: Xử lý focus - THÊM focus cho kho xuất và kho nhập
  const handleLookupInputFocus = useCallback((fieldKey) => {
    // Đóng tất cả popup khác khi focus vào field mới
    setPopupStates({
      showCustomerPopup: false,
      showKhoPopup: false,
      showKhoXuatPopup: false,
      showKhoNhapPopup: false,
      showVatTuPopup: false
    });

    // Set focus cho field hiện tại
    setFocusStates({
      ma_khach: fieldKey === 'ma_khach',
      ma_kho: fieldKey === 'ma_kho',
      ma_kho_xuat: fieldKey === 'ma_kho_xuat',
      ma_kho_nhap: fieldKey === 'ma_kho_nhap',
      ma_vat_tu: fieldKey === 'ma_vat_tu'
    });
  }, []);

  // ✅ SỬA LẠI: Xử lý blur - không đóng popup nữa
  const handleLookupInputBlur = useCallback((fieldKey) => {
    // Chỉ clear focus state sau delay để cho phép click vào popup
    setTimeout(() => {
      setFocusStates(prev => ({ ...prev, [fieldKey]: false }));
    }, 150);
  }, []);

  // ✅ SỬA LẠI: Xử lý click vào lookup field - THÊM logic cho kho xuất và kho nhập
  const handleLookupClick = useCallback((fieldKey) => {
    // Set focus
    handleLookupInputFocus(fieldKey);

    // Mở popup tương ứng nếu chưa có giá trị được chọn
    if (fieldKey === 'ma_khach' && !filterData.ma_khach) {
      setPopupStates({
        showCustomerPopup: true,
        showKhoPopup: false,
        showKhoXuatPopup: false,
        showKhoNhapPopup: false,
        showVatTuPopup: false
      });
    } else if (fieldKey === 'ma_kho' && !filterData.ma_kho) {
      setPopupStates({
        showCustomerPopup: false,
        showKhoPopup: true,
        showKhoXuatPopup: false,
        showKhoNhapPopup: false,
        showVatTuPopup: false
      });
    } else if (fieldKey === 'ma_kho_xuat' && !filterData.ma_kho_xuat) {
      setPopupStates({
        showCustomerPopup: false,
        showKhoPopup: false,
        showKhoXuatPopup: true,
        showKhoNhapPopup: false,
        showVatTuPopup: false
      });
    } else if (fieldKey === 'ma_kho_nhap' && !filterData.ma_kho_nhap) {
      setPopupStates({
        showCustomerPopup: false,
        showKhoPopup: false,
        showKhoXuatPopup: false,
        showKhoNhapPopup: true,
        showVatTuPopup: false
      });
    } else if (fieldKey === 'ma_vat_tu' && !filterData.ma_vat_tu) {
      setPopupStates({
        showCustomerPopup: false,
        showKhoPopup: false,
        showKhoXuatPopup: false,
        showKhoNhapPopup: false,
        showVatTuPopup: true
      });
    }
  }, [handleLookupInputFocus, filterData]);

  // ✅ SỬA LẠI: Xử lý tìm kiếm từ popup - cập nhật popup search states
  const handlePopupSearch = useCallback((fieldKey, value) => {
    // ✅ THAY ĐỔI: Update cả popup search states và main search states để đồng bộ
    setPopupSearchStates(prev => ({ ...prev, [fieldKey]: value }));

    // Clear giá trị đã chọn nếu search value thay đổi
    if (value !== filterData[fieldKey]) {
      setFilterData(prev => ({ ...prev, [fieldKey]: "" }));
    }
  }, [filterData]);

  // ✅ SỬA LẠI: Xử lý chọn từ popup - sử dụng handleLookupSelect thống nhất
  const handleCustomerSelect = useCallback((customer) => {
    // Tạo field object giả để sử dụng handleLookupSelect
    const field = { valueKey: 'ma_kh' };
    handleLookupSelect('ma_khach', customer, field);
  }, [handleLookupSelect]);

  const handleKhoSelect = useCallback((kho) => {
    const field = { valueKey: 'ma_kho' };
    handleLookupSelect('ma_kho', kho, field);
  }, [handleLookupSelect]);

  const handleVatTuSelect = useCallback((vatTu) => {
    const field = { valueKey: 'ma_vt' };
    handleLookupSelect('ma_vat_tu', vatTu, field);
  }, [handleLookupSelect]);

  // ✅ THÊM: Xử lý chọn từ popup - thêm handler cho kho xuất và kho nhập
  const handleKhoXuatSelect = useCallback((kho) => {
    const field = { valueKey: 'ma_kho' };
    handleLookupSelect('ma_kho_xuat', kho, field);
  }, [handleLookupSelect]);

  const handleKhoNhapSelect = useCallback((kho) => {
    const field = { valueKey: 'ma_kho' };
    handleLookupSelect('ma_kho_nhap', kho, field);
  }, [handleLookupSelect]);

  // ✅ THÊM: Hàm đóng popup
  const handleClosePopup = useCallback((popupType) => {
    setPopupStates(prev => ({
      ...prev,
      [popupType]: false
    }));
  }, []);
  useEffect(() => {
    console.log('PopupSearchStates changed:', popupSearchStates);
  }, [popupSearchStates]);

  useEffect(() => {
    console.log('Customer data changed:', customerData);
  }, [customerData]);

  useEffect(() => {
    console.log('Kho data changed:', khoData);
  }, [khoData]);

  useEffect(() => {
    console.log('KhoXuat data changed:', khoXuatData);
  }, [khoXuatData]);

  useEffect(() => {
    console.log('KhoNhap data changed:', khoNhapData);
  }, [khoNhapData]);

  useEffect(() => {
    console.log('VatTu data changed:', vatTuData);
  }, [vatTuData]);

  const handleSubmit = useCallback(() => {
    if (!filterConfig) {
      console.error("Filter config not loaded");
      return;
    }

    try {
      // Merge filter data với search states cho các lookup fields
      const submitData = { ...filterData, configName: configName };

      // Đối với các lookup fields, sử dụng giá trị đã chọn hoặc giá trị search
      allFields.forEach(field => {
        if (field.type === 'lookup') {
          submitData[field.key] = filterData[field.key] || searchStates[field.key]?.trim() || "";
        }
      });

      // Validate dữ liệu với validateSubmitData
      const validation = validateSubmitData(configName, submitData);

      if (!validation.isValid) {
        // Hiển thị lỗi validation
        setValidationErrors(validation.errors || {});
        return;
      }

      // Clear validation errors và submit
      setValidationErrors({});
      onSubmit(submitData);

    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  }, [filterData, searchStates, filterConfig, configName, onSubmit, allFields]);

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

  const renderField = (field) => {
    const value = filterData[field.key] || "";
    const hasError = validationErrors[field.key];
    const errorMessage = hasError ? validationErrors[field.key] : "";

    // Giảm chiều cao input
    const inputClasses = `w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 ${hasError
      ? 'border-red-300 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500'
      }`;

    const renderInput = () => {
      switch (field.type) {
        case 'text':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
              placeholder={field.placeholder}
            />
          );

        case 'date':
          const formatDateForInput = (dateStr) => {
            if (!dateStr) return "";
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
          };

          const formatDateForState = (dateStr) => {
            if (!dateStr) return "";
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return dateStr;
          };

          return (
            <input
              type="date"
              value={formatDateForInput(value)}
              onChange={(e) => {
                const formatted = formatDateForState(e.target.value);
                handleInputChange(field.key, formatted);
              }}
              className={inputClasses}
              disabled={isSubmitting}
            />
          );

        case 'select':
          return (
            <select
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'lookup':
          const searchValue = searchStates[field.key] || "";
          const results = searchResults[field.key] || [];
          const isLoading = loadingStates[field.key] || false;
          const showResults = focusStates[field.key] && searchValue.length > 0 && results.length > 0;

          return (
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchInputChange(field.key, e.target.value)}
                onFocus={() => handleLookupInputFocus(field.key)}
                onBlur={() => handleLookupInputBlur(field.key)}
                onClick={() => handleLookupClick(field.key)}
                className={inputClasses}
                disabled={isSubmitting}
                placeholder={field.placeholder}
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
              {isLoading && (
                <Loader className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-blue-500" />
              )}

              {/* Dropdown results */}
              {showResults && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {results.map((item, index) => {
                    // Xác định các key để hiển thị dựa vào field type
                    const getDisplayKey = () => {
                      if (field.key === 'ma_khach') return 'ten_kh';
                      if (field.key.includes('kho')) return 'ten_kho';
                      if (field.key === 'ma_vat_tu') return 'ten_vt';
                      return 'name';
                    };

                    const getValueKey = () => {
                      if (field.key === 'ma_khach') return 'ma_kh';
                      if (field.key.includes('kho')) return 'ma_kho';
                      if (field.key === 'ma_vat_tu') return 'ma_vt';
                      return 'id';
                    };

                    return (
                      <div
                        key={`${getValueKey()}-${index}`}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Ngăn blur event
                          const mockField = { valueKey: getValueKey() };
                          handleLookupSelect(field.key, item, mockField);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {item[getValueKey()]}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item[getDisplayKey()]}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );

        case 'number':
          return (
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
            />
          );

        case 'text_disabled':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={true}
              placeholder={field.placeholder}
            />
          );

        default:
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
              placeholder={field.placeholder}
            />
          );
      }
    };

    return (
      <div>
        {renderInput()}
        {hasError && (
          <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  // Loading state khi chưa có config
  if (!filterConfig) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Đang tải cấu hình...</p>
        </div>
      </div>
    );
  }

  const searchFields = filterConfig.searchFields || {};
  const advancedFields = filterConfig.advancedFields || [];
  const modalTitle = filterConfig.title || title;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-auto transform transition-all rounded-t-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-blue-500 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{modalTitle}</h3>
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

        {/* Body scrollable */}
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            {/* Basic filters section */}
            {filterConfig && filterConfig.searchFields && (() => {
              const mainFields = filterConfig.searchFields.mainFieldKeys || [];
              const rightBox1Fields = filterConfig.searchFields.rightBox1Keys || [];
              const rightBox2Fields = filterConfig.searchFields.rightBox2Keys || [];
              return (
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Khung trái lớn: mainFields */}
                  <div className="md:w-[65%] w-full">
                    <div className="border rounded-xl p-4 bg-white max-h-[300px] h-full flex flex-col">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        {mainFields.map(field => (
                          <div key={field.key} className="flex items-center gap-3">
                            <label className="text-xs text-gray-600 min-w-[100px] text-left">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="flex-1">
                              {renderField(field)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Khung phải: 2 box nhỏ dọc */}
                  <div className="md:w-[35%] w-full flex flex-col gap-4">
                    {/* Box 1 */}
                    <div className="border rounded-xl p-4 bg-white max-h-[140px] flex-1">
                      <div className="h-full flex flex-col justify-start">
                        {rightBox1Fields.map((field, index) => (
                          <div key={field.key} className={`flex items-center gap-3 ${index < rightBox1Fields.length - 1 ? 'mb-3' : ''}`}>
                            <label className="text-xs text-gray-600 min-w-[80px] text-left">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="flex-1">
                              {renderField(field)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Box 2 */}
                    <div className="border rounded-xl p-4 bg-white max-h-[140px] flex-1">
                      <div className="h-full flex flex-col justify-start">
                        {rightBox2Fields.map((field, index) => (
                          <div key={field.key} className={`flex items-center gap-3 ${index < rightBox2Fields.length - 1 ? 'mb-3' : ''}`}>
                            <label className="text-xs text-gray-600 min-w-[80px] text-left">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <div className="flex-1">
                              {renderField(field)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Advanced filters section */}
            {advancedFields.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-orange-900 mb-4">Điều kiện lọc nâng cao</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Trường lọc</th>
                        <th className="text-left p-2 font-medium">Phép so sánh</th>
                        <th className="text-left p-2 font-medium">Giá trị 1</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advancedFields.map((item, index) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">
                            <span>{item.name}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-blue-600 cursor-pointer hover:underline">
                              {item.operator || 'like'}
                            </span>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              className="border px-2 py-0.5 text-sm rounded w-full"
                              value={item.value1 || ''}
                              onChange={(e) => {
                                const updated = [...advancedFields];
                                updated[index].value1 = e.target.value;
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty state */}
            {allFields.length === 0 && advancedFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Chưa có trường lọc nào được cấu hình</p>
              </div>
            )}

            {/* Validation errors summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">Vui lòng kiểm tra lại:</h4>
                <ul className="text-sm text-red-600">
                  {Object.entries(validationErrors).map(([field, message]) => (
                    <li key={field} className="mb-1">• {message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-4 border-t border-gray-300 bg-gray-50 rounded-b-xl">
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


        {/* Popup cho khách hàng */}
        {popupStates.showCustomerPopup && (
          <CustomerSelectionPopup
            isOpen={true}
            onClose={() => handleClosePopup('showCustomerPopup')}
            onSelect={handleCustomerSelect}
            customers={customerData.data || []}
            searchValue={popupSearchStates.ma_khach || ""}
            onSearch={(value) => handlePopupSearch('ma_khach', value)}
          />
        )}

        {/* Popup cho kho */}
        {popupStates.showKhoPopup && (
          <WarehouseSelectionPopup
            isOpen={true}
            onClose={() => handleClosePopup('showKhoPopup')}
            onSelect={handleKhoSelect}
            warehouses={Array.isArray(khoData?.data) ? khoData.data : []}
            searchValue={popupSearchStates.ma_kho || ""}
            onSearch={(value) => handlePopupSearch('ma_kho', value)}
          />
        )}

        {/* Popup cho kho xuất */}
        {popupStates.showKhoXuatPopup && (
          <WarehouseSelectionPopup
            isOpen={true}
            onClose={() => handleClosePopup('showKhoXuatPopup')}
            onSelect={handleKhoXuatSelect}
            warehouses={Array.isArray(khoXuatData?.data) ? khoXuatData.data : []}
            searchValue={popupSearchStates.ma_kho_xuat || ""}
            onSearch={(value) => handlePopupSearch('ma_kho_xuat', value)}
          />
        )}

        {/* Popup cho kho nhập */}
        {popupStates.showKhoNhapPopup && (
          <WarehouseSelectionPopup
            isOpen={true}
            onClose={() => handleClosePopup('showKhoNhapPopup')}
            onSelect={handleKhoNhapSelect}
            warehouses={Array.isArray(khoNhapData?.data) ? khoNhapData.data : []}
            searchValue={popupSearchStates.ma_kho_nhap || ""}
            onSearch={(value) => handlePopupSearch('ma_kho_nhap', value)}
          />
        )}

        {/* Popup cho vật tư */}
        {popupStates.showVatTuPopup && (
          <MaterialSelectionPopup
            isOpen={true}
            onClose={() => handleClosePopup('showVatTuPopup')}
            onSelect={handleVatTuSelect}
            materials={Array.isArray(vatTuData?.data) ? vatTuData.data : []}
            searchValue={popupSearchStates.ma_vat_tu || ""}
            onSearch={(value) => handlePopupSearch('ma_vat_tu', value)}
          />
        )}
      </div>
    </div>
  );
}