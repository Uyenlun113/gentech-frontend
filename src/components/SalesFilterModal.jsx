
import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Building2, Calendar, ChevronDown, CreditCard, Filter, Loader, Package, Search, Truck, Users, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";

import { useAccounts } from "../hooks/useAccounts";
import { useCustomers } from "../hooks/useCustomer";
import { useDmkho } from "../hooks/useDmkho";
import { useDmvt } from "../hooks/useDmvt";
import { CalenderIcon } from "../icons";
import AccountSelectionPopup from "./general/AccountSelectionPopup";
import CustomerSelectionPopup from "./general/CustomerSelectionPopup";
import WarehouseSelectionPopup from "./general/dmkPopup";
import MaterialSelectionPopup from "./general/dmvtPopup";

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

const MultiAccountSelect = ({
    value = [],
    onChange,
    placeholder = "Chọn tài khoản",
    searchPlaceholder = "Tìm kiếm tài khoản...",
    label = "Tài khoản",
    disabled = false,
    showNameInTags = true
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Lấy danh sách tài khoản
    const { data: accountsData, isLoading } = useAccounts({ search: searchTerm });
    const accounts = accountsData?.data || [];


    const selectedAccounts = accounts.filter(account =>
        value.includes(account.tk)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
                setSearchTerm('');
            }
        }
    };

    const handleSelect = (account) => {
        const accountCode = account.tk;
        const newValue = value.includes(accountCode)
            ? value.filter(code => code !== accountCode)
            : [...value, accountCode];
        onChange(newValue);
    };

    const handleRemove = (accountCode, e) => {
        e.stopPropagation();
        const newValue = value.filter(code => code !== accountCode);
        onChange(newValue);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange([]);
    };
    const getDisplayText = (account) => {
        if (showNameInTags && account.ten_tk) {
            return `${account.tk}`;
        }
        return account.tk;
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700">
                <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                {label}
            </label>
            <div className="relative" ref={dropdownRef}>
                {/* Select Button */}
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    className={`min-h-[44px] w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 flex items-center justify-between transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'
                        }`}
                >
                    <div className="flex-1 text-left">
                        {selectedAccounts.length === 0 ? (
                            <span className="text-gray-500">{placeholder}</span>
                        ) : selectedAccounts.length === 1 ? (
                            <div className="flex flex-wrap gap-1">
                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md max-w-full">
                                    <span className="truncate">{getDisplayText(selectedAccounts[0])}</span>
                                    {!disabled && (
                                        <button
                                            onClick={(e) => handleRemove(selectedAccounts[0].tk, e)}
                                            className="ml-1 hover:text-blue-600 flex-shrink-0"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {selectedAccounts.slice(0, 3).map((account) => (
                                    <span
                                        key={account.tk}
                                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                                    >
                                        <span className="truncate max-w-[120px]">
                                            {getDisplayText(account)}
                                        </span>
                                        {!disabled && (
                                            <button
                                                onClick={(e) => handleRemove(account.tk, e)}
                                                className="ml-1 hover:text-blue-600 flex-shrink-0"
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </span>
                                ))}
                                {selectedAccounts.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                        +{selectedAccounts.length - 3} khác
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        {selectedAccounts.length > 0 && !disabled && (
                            <button
                                onClick={handleClear}
                                className="text-gray-400 hover:text-gray-600"
                                title="Xóa tất cả"
                            >
                                <X size={16} />
                            </button>
                        )}
                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </div>
                </button>

                {/* Dropdown */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500">
                                    <div className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    <span className="ml-2">Đang tải...</span>
                                </div>
                            ) : accounts.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    {searchTerm ? 'Không tìm thấy kết quả' : 'Không có dữ liệu'}
                                </div>
                            ) : (
                                accounts.map((account) => {
                                    const accountCode = account.tk;
                                    const isSelected = value.includes(accountCode);
                                    return (
                                        <button
                                            key={accountCode}
                                            type="button"
                                            onClick={() => handleSelect(account)}
                                            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${isSelected
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-800'
                                                }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{account.tk}</div>
                                                {account.ten_tk && (
                                                    <div className="text-xs text-gray-500 truncate mt-1">
                                                        {account.ten_tk}
                                                    </div>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function SalesFilterModal({ isOpen, onClose, selectedItem, defaultValues, onSubmit, isSubmitting = false }) {
    const [filterData, setFilterData] = useState({
        StartDate: "",
        EndDate: "",
        ma_kh: "",
        ma_kho: "",
        ma_vt: "",
        ma_tk: "", // Thêm trường mã tài khoản
        ghi_no_co: 3, // Thêm trường ghi nợ/có, mặc định là "Nợ"
        so_ct_from: "",
        so_ct_to: "",
        ma_dvcs: "",
        tk_doanh_thu: [],
        tk_giam_tru: [],
        quyen_so: "",
        ngay_mo_so: "",
    });

    // States cho search và popup
    const [searchStates, setSearchStates] = useState({
        ma_khach: "",
        ma_kho: "",
        ma_vat_tu: "",
        ma_tai_khoan: "", // Thêm state search cho tài khoản
    });

    const [popupStates, setPopupStates] = useState({
        showCustomerPopup: false,
        showKhoPopup: false,
        showVatTuPopup: false,
        showAccountPopup: false, // Thêm state popup cho tài khoản
    });

    const [focusStates, setFocusStates] = useState({
        customerFocused: false,
        khoFocused: false,
        vatTuFocused: false,
        accountFocused: false, // Thêm state focus cho tài khoản
    });

    // Debounce search queries
    const debouncedMaKhSearch = useDebounce(searchStates.ma_khach, 300);
    const debouncedKhoXuatSearch = useDebounce(searchStates.ma_kho, 300);
    const debouncedVatTuSearch = useDebounce(searchStates.ma_vat_tu, 300);
    const debouncedAccountSearch = useDebounce(searchStates.ma_tai_khoan, 300); // Thêm debounce cho tài khoản

    // API Hooks
    const { data: customerData = [] } = useCustomers(
        { search: debouncedMaKhSearch || "" },
        { enabled: !!debouncedMaKhSearch && debouncedMaKhSearch.length > 0 }
    );

    const { data: vatTuData = [] } = useDmvt(
        { search: debouncedVatTuSearch || "" },
        { enabled: !!debouncedVatTuSearch && debouncedVatTuSearch.length > 0 }
    );

    const { data: khoXuatData = [] } = useDmkho(
        { search: debouncedKhoXuatSearch || "" },
        { enabled: !!debouncedKhoXuatSearch && debouncedKhoXuatSearch.length > 0 }
    );

    // Thêm hook cho tài khoản
    const { data: accountData = [] } = useAccounts(
        { search: debouncedAccountSearch || "" },
        { enabled: !!debouncedAccountSearch && debouncedAccountSearch.length > 0 }
    );

    // Check if current item is "Sổ chi tiết bán hàng"
    const isDetailedSalesReport = selectedItem?.id === 'inventory-report';

    // Reset form khi modal đóng/mở
    useEffect(() => {
        if (isOpen) {
            if (defaultValues) {
                setFilterData((prev) => ({
                    ...prev,
                    ...defaultValues,
                    tk_doanh_thu: defaultValues.tk_doanh_thu || [],
                    tk_giam_tru: defaultValues.tk_giam_tru || []
                }));
            }
        } else {
            // Reset khi đóng modal
            setSearchStates({
                ma_khach: "",
                ma_kho: "",
                ma_vat_tu: "",
                ma_tai_khoan: "", // Reset search tài khoản
            });
            setPopupStates({
                showCustomerPopup: false,
                showKhoPopup: false,
                showVatTuPopup: false,
                showAccountPopup: false, // Reset popup tài khoản
            });
            setFocusStates({
                customerFocused: false,
                khoFocused: false,
                vatTuFocused: false,
                accountFocused: false, // Reset focus tài khoản
            });
        }
    }, [isOpen, defaultValues]);

    // Xử lý hiển thị popup
    useEffect(() => {
        if (debouncedMaKhSearch && focusStates.customerFocused) {
            setPopupStates(prev => ({ ...prev, showCustomerPopup: true }));
        } else if (!searchStates.ma_khach) {
            setPopupStates(prev => ({ ...prev, showCustomerPopup: false }));
        }
    }, [debouncedMaKhSearch, focusStates.customerFocused, searchStates.ma_khach]);

    useEffect(() => {
        if (debouncedKhoXuatSearch && focusStates.khoFocused) {
            setPopupStates(prev => ({ ...prev, showKhoPopup: true }));
        } else if (!searchStates.ma_kho) {
            setPopupStates(prev => ({ ...prev, showKhoPopup: false }));
        }
    }, [debouncedKhoXuatSearch, focusStates.khoFocused, searchStates.ma_kho]);

    useEffect(() => {
        if (debouncedVatTuSearch && focusStates.vatTuFocused) {
            setPopupStates(prev => ({ ...prev, showVatTuPopup: true }));
        } else if (!searchStates.ma_vat_tu) {
            setPopupStates(prev => ({ ...prev, showVatTuPopup: false }));
        }
    }, [debouncedVatTuSearch, focusStates.vatTuFocused, searchStates.ma_vat_tu]);

    // Thêm useEffect cho tài khoản
    useEffect(() => {
        if (debouncedAccountSearch && focusStates.accountFocused) {
            setPopupStates(prev => ({ ...prev, showAccountPopup: true }));
        } else if (!searchStates.ma_tai_khoan) {
            setPopupStates(prev => ({ ...prev, showAccountPopup: false }));
        }
    }, [debouncedAccountSearch, focusStates.accountFocused, searchStates.ma_tai_khoan]);

    const handleInputChange = useCallback((field, value) => {
        setFilterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    const handlePopupSearch = useCallback((field, value) => {
        setSearchStates((prev) => ({ ...prev, [field]: value }));

        // Reset corresponding filter data if search value changes
        const fieldMap = {
            ma_khach: 'ma_kh',
            ma_kho: 'ma_kho',
            ma_vat_tu: 'ma_vt',
            ma_tai_khoan: 'ma_tk' // Thêm mapping cho tài khoản
        };

        if (value !== filterData[fieldMap[field]]) {
            setFilterData((prev) => ({ ...prev, [fieldMap[field]]: "" }));
        }
    }, [filterData]);

    const handleInputFocus = useCallback((field) => {
        const focusMap = {
            ma_khach: 'customerFocused',
            ma_kho: 'khoFocused',
            ma_vat_tu: 'vatTuFocused',
            ma_tai_khoan: 'accountFocused' // Thêm mapping focus cho tài khoản
        };

        setFocusStates(prev => ({ ...prev, [focusMap[field]]: true }));

        const searchValue = searchStates[field];
        if (searchValue) {
            const popupMap = {
                ma_khach: 'showCustomerPopup',
                ma_kho: 'showKhoPopup',
                ma_vat_tu: 'showVatTuPopup',
                ma_tai_khoan: 'showAccountPopup' // Thêm mapping popup cho tài khoản
            };
            setPopupStates(prev => ({ ...prev, [popupMap[field]]: true }));
        }
    }, [searchStates]);

    const handleInputBlur = useCallback((field) => {
        const focusMap = {
            ma_khach: 'customerFocused',
            ma_kho: 'khoFocused',
            ma_vat_tu: 'vatTuFocused',
            ma_tai_khoan: 'accountFocused' // Thêm mapping blur cho tài khoản
        };

        setTimeout(() => {
            setFocusStates(prev => ({ ...prev, [focusMap[field]]: false }));
        }, 200);
    }, []);

    const handleClosePopup = useCallback((popupField) => {
        setPopupStates(prev => ({ ...prev, [popupField]: false }));
    }, []);

    // Selection handlers
    const handleCustomerSelect = useCallback((customer) => {
        const customerCode = customer.ma_kh?.trim() || "";
        setFilterData((prev) => ({
            ...prev,
            ma_kh: customerCode,
        }));
        setSearchStates(prev => ({ ...prev, ma_khach: customerCode }));
        setPopupStates(prev => ({ ...prev, showCustomerPopup: false }));
        setFocusStates(prev => ({ ...prev, customerFocused: false }));
    }, []);

    const handleKhoSelect = useCallback((warehouse) => {
        const warehouseCode = warehouse.ma_kho?.trim() || "";
        setFilterData((prev) => ({
            ...prev,
            ma_kho: warehouseCode,
        }));
        setSearchStates(prev => ({ ...prev, ma_kho: warehouseCode }));
        setPopupStates(prev => ({ ...prev, showKhoPopup: false }));
        setFocusStates(prev => ({ ...prev, khoFocused: false }));
    }, []);

    const handleVatTuSelect = useCallback((material) => {
        const materialCode = material.ma_vt?.trim() || "";
        setFilterData((prev) => ({
            ...prev,
            ma_vt: materialCode,
        }));
        setSearchStates(prev => ({ ...prev, ma_vat_tu: materialCode }));
        setPopupStates(prev => ({ ...prev, showVatTuPopup: false }));
        setFocusStates(prev => ({ ...prev, vatTuFocused: false }));
    }, []);

    // Thêm handler cho tài khoản
    const handleAccountSelect = useCallback((account) => {
        const accountCode = account.tk?.trim() || ""; // Sửa từ ma_tk thành tk
        setFilterData((prev) => ({
            ...prev,
            ma_tk: accountCode,
        }));
        setSearchStates(prev => ({ ...prev, ma_tai_khoan: accountCode }));
        setPopupStates(prev => ({ ...prev, showAccountPopup: false }));
        setFocusStates(prev => ({ ...prev, accountFocused: false }));
    }, []);

    const handleSubmit = useCallback(() => {
        const submitData = {
            ...filterData,
            ma_kh: filterData.ma_kh || searchStates.ma_khach.trim(),
            ma_kho: filterData.ma_kho || searchStates.ma_kho.trim(),
            ma_vt: filterData.ma_vt || searchStates.ma_vat_tu.trim(),
            ma_tk: filterData.ma_tk || searchStates.ma_tai_khoan.trim(), // Thêm mã tài khoản vào submit data
            // Format account arrays as comma-separated strings
            tk_doanh_thu: Array.isArray(filterData.tk_doanh_thu) ? filterData.tk_doanh_thu.join(',') : filterData.tk_doanh_thu,
            tk_giam_tru: Array.isArray(filterData.tk_giam_tru) ? filterData.tk_giam_tru.join(',') : filterData.tk_giam_tru,
        };
        onSubmit(submitData);
    }, [filterData, searchStates, onSubmit]);

    const handleClose = useCallback(() => {
        if (!isSubmitting) {
            onClose();
        }
    }, [isSubmitting, onClose]);

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

    const allowedIds = ["import-plan", "inventory2", "inventory-detail2", "import-export-summary2", "import-export-detail", "inventory-report"];
    const allowedIds2 = ["import-plan", "import-export-plan", "inventory-detail2", "import-export-summary2", "import-export-detail", "inventory-report"];
    const allowedIds3 = ["import-plan", "import-export-plan", "export-plan", "import-export-detail", "import-export-detail"];
    const allowedIds4 = ["cost-analysis", "performance-report", "turnover-analysis"];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-auto transform transition-all max-h-[90vh] overflow-y-auto">
                {/* Header với gradient */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-blue-500 rounded-t-xl">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Filter className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">{selectedItem?.label || "Bộ lọc báo cáo bán hàng"}</h3>
                            <p className="text-blue-100 text-sm mt-1">Thiết lập các tiêu chí lọc dữ liệu báo cáo</p>
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
                    <div className="grid grid-cols-10 gap-8">
                        <div className="col-span-7 space-y-2 border border-gray-300 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Từ ngày */}
                                <div className="space-y-1">
                                    <label className=" text-sm font-semibold text-gray-700  flex">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                        Từ ngày
                                    </label>
                                    <div className="relative">
                                        <Flatpickr
                                            value={filterData.StartDate}
                                            onChange={(date) => {
                                                const isoDate = date[0]?.toISOString().split("T")[0];
                                                handleInputChange("StartDate", isoDate);
                                            }}
                                            options={{
                                                dateFormat: "Y-m-d",
                                                locale: Vietnamese,
                                                allowInput: true,
                                            }}
                                            placeholder="Chọn ngày bắt đầu"
                                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg 
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                focus:border-transparent transition-all duration-200 
                                                bg-white shadow-sm"
                                            disabled={isSubmitting}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <CalenderIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Đến ngày */}
                                <div className="space-y-1">
                                    <label className=" text-sm font-semibold text-gray-700 flex">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                        Đến ngày
                                    </label>
                                    <div className="relative">
                                        <Flatpickr
                                            value={filterData.EndDate}
                                            onChange={(date) => {
                                                const isoDate = date[0]?.toISOString().split("T")[0];
                                                handleInputChange("EndDate", isoDate);
                                            }}
                                            options={{
                                                dateFormat: "Y-m-d",
                                                locale: Vietnamese,
                                                allowInput: true,
                                            }}
                                            placeholder="Chọn ngày kết thúc"
                                            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg 
                                                focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                focus:border-transparent transition-all duration-200 
                                                bg-white shadow-sm"
                                            disabled={isSubmitting}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <CalenderIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Số chứng từ và Loại voucher */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Số CT từ */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                        Số CT từ
                                    </label>
                                    <input
                                        type="text"
                                        value={filterData.so_ct_from}
                                        onChange={(e) => handleInputChange("so_ct_from", e.target.value)}
                                        placeholder="Số CT từ..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Số CT đến */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                        Số CT đến
                                    </label>
                                    <input
                                        type="text"
                                        value={filterData.so_ct_to}
                                        onChange={(e) => handleInputChange("so_ct_to", e.target.value)}
                                        placeholder="Số CT đến..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            {/* Khách hàng */}
                            {allowedIds3.includes(selectedItem.id) && (
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                                        Mã khách hàng
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={filterData.ma_kh || searchStates.ma_khach}
                                            onChange={(e) => handlePopupSearch('ma_khach', e.target.value)}
                                            onFocus={() => handleInputFocus('ma_khach')}
                                            onBlur={() => handleInputBlur('ma_khach')}
                                            placeholder="Nhập mã khách hàng..."
                                            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                            disabled={isSubmitting}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <Package className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Row 2: Vật tư */}
                            {allowedIds.includes(selectedItem.id) && (
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <Package className="w-4 h-4 mr-2 text-blue-600" />
                                        Mã vật tư
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={filterData.ma_vt || searchStates.ma_vat_tu}
                                            onChange={(e) => handlePopupSearch('ma_vat_tu', e.target.value)}
                                            onFocus={() => handleInputFocus('ma_vat_tu')}
                                            onBlur={() => handleInputBlur('ma_vat_tu')}
                                            placeholder="Nhập mã vật tư..."
                                            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                            disabled={isSubmitting}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {allowedIds2.includes(selectedItem.id) && (
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <Truck className="w-4 h-4 mr-2 text-blue-600" />
                                        Mã kho
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={filterData.ma_kho || searchStates.ma_kho}
                                            onChange={(e) => handlePopupSearch('ma_kho', e.target.value)}
                                            onFocus={() => handleInputFocus('ma_kho')}
                                            onBlur={() => handleInputBlur('ma_kho')}
                                            placeholder="Nhập mã kho..."
                                            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                            disabled={isSubmitting}
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <Truck className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Thêm trường Mã tài khoản */}
                            {allowedIds4.includes(selectedItem.id) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-semibold text-gray-700">
                                            <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                            Mã tài khoản
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={filterData.ma_tk || searchStates.ma_tai_khoan}
                                                onChange={(e) => handlePopupSearch('ma_tai_khoan', e.target.value)}
                                                onFocus={() => handleInputFocus('ma_tai_khoan')}
                                                onBlur={() => handleInputBlur('ma_tai_khoan')}
                                                placeholder="Nhập mã tài khoản..."
                                                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                                disabled={isSubmitting}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <CreditCard className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thêm trường Ghi nợ/có */}
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-semibold text-gray-700">
                                            <Filter className="w-4 h-4 mr-2 text-blue-600" />
                                            Ghi nợ/có
                                        </label>
                                        <select
                                            value={filterData.ghi_no_co}
                                            onChange={(e) => handleInputChange("ghi_no_co", parseInt(e.target.value))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                            disabled={isSubmitting}
                                        >
                                            <option value={1}>1 - Nợ</option>
                                            <option value={2}>2 - Có</option>
                                            <option value={3}>3 - Cả hai</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Additional fields for "Sổ chi tiết bán hàng" */}
                            {isDetailedSalesReport && (
                                <>
                                    {/* Account selection fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <MultiAccountSelect
                                            value={filterData.tk_doanh_thu}
                                            onChange={(value) => handleInputChange("tk_doanh_thu", value)}
                                            label="TK doanh thu"
                                            placeholder="Chọn tài khoản doanh thu"
                                            disabled={isSubmitting}
                                        />

                                        <MultiAccountSelect
                                            value={filterData.tk_giam_tru}
                                            onChange={(value) => handleInputChange("tk_giam_tru", value)}
                                            label="TK giảm trừ"
                                            placeholder="Chọn tài khoản giảm trừ"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Quyển số và Ngày mở sổ */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm font-semibold text-gray-700">
                                                <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                                Quyển số
                                            </label>
                                            <input
                                                type="text"
                                                value={filterData.quyen_so}
                                                onChange={(e) => handleInputChange("quyen_so", e.target.value)}
                                                placeholder="Nhập quyển số..."
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                                Ngày mở sổ
                                            </label>
                                            <div className="relative">
                                                <Flatpickr
                                                    value={filterData.ngay_mo_so}
                                                    onChange={(date) => {
                                                        const isoDate = date[0]?.toISOString().split("T")[0];
                                                        handleInputChange("ngay_mo_so", isoDate);
                                                    }}
                                                    options={{
                                                        dateFormat: "Y-m-d",
                                                        locale: Vietnamese,
                                                        allowInput: true,
                                                    }}
                                                    placeholder="Chọn ngày mở sổ"
                                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                                    disabled={isSubmitting}
                                                />
                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                    <CalenderIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="col-span-3 space-y-2 border border-gray-300 rounded-lg p-4">
                            {/* Kind Filter */}
                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <Filter className="w-4 h-4 mr-2 text-blue-600" />
                                        Kiểu lọc
                                    </label>
                                    <select
                                        value={filterData.KindFilter}
                                        onChange={(e) => handleInputChange("KindFilter", parseInt(e.target.value))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                        disabled={isSubmitting}
                                    >
                                        <option value={0}>Tất cả các vật tư trong phiếu</option>
                                        <option value={1}>Chỉ các vật tư theo điều kiện</option>
                                    </select>
                                </div>
                            </div>

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

                            {/* Màu báo cáo chỉ hiện khi là "Sổ chi tiết bán hàng" */}
                            {isDetailedSalesReport && (
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-semibold text-gray-700">
                                        <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                        Màu VND/ngoại tệ
                                    </label>
                                    <select
                                        value={filterData.mau_bao_cao || 'VND'}
                                        onChange={(e) => handleInputChange("mau_bao_cao", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                        disabled={isSubmitting}
                                    >
                                        <option value="VND">VND</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
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

            {/* Popup cho khách hàng */}
            {
                popupStates.showCustomerPopup && (
                    <CustomerSelectionPopup
                        isOpen={true}
                        onClose={() => handleClosePopup('showCustomerPopup')}
                        onSelect={handleCustomerSelect}
                        customers={customerData.data || []}
                        searchValue={searchStates.ma_khach || ""}
                        onSearch={(value) => handlePopupSearch('ma_khach', value)}
                    />
                )
            }

            {/* Popup cho kho */}
            {
                popupStates.showKhoPopup && (
                    <WarehouseSelectionPopup
                        isOpen={true}
                        onClose={() => handleClosePopup('showKhoPopup')}
                        onSelect={handleKhoSelect}
                        warehouses={Array.isArray(khoXuatData?.data) ? khoXuatData.data : []}
                        searchValue={searchStates.ma_kho || ""}
                        onSearch={(value) => handlePopupSearch('ma_kho', value)}
                    />
                )
            }

            {/* Popup cho vật tư */}
            {
                popupStates.showVatTuPopup && (
                    <MaterialSelectionPopup
                        isOpen={true}
                        onClose={() => handleClosePopup('showVatTuPopup')}
                        onSelect={handleVatTuSelect}
                        materials={Array.isArray(vatTuData?.data) ? vatTuData.data : []}
                        searchValue={searchStates.ma_vat_tu || ""}
                        onSearch={(value) => handlePopupSearch('ma_vat_tu', value)}
                    />
                )
            }

            {/* Popup cho tài khoản */}
            {
                popupStates.showAccountPopup && (
                    <AccountSelectionPopup
                        isOpen={true}
                        onClose={() => handleClosePopup('showAccountPopup')}
                        onSelect={handleAccountSelect}
                        accounts={Array.isArray(accountData?.data) ? accountData.data : []}
                        searchValue={searchStates.ma_tai_khoan || ""}
                        onSearch={(value) => handlePopupSearch('ma_tai_khoan', value)}
                    />
                )
            }
        </div >
    );
}