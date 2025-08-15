import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Building2, Calendar, CreditCard, Filter, Loader, Package, Search, Truck, User, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";

import { useCustomers } from "../hooks/useCustomer";
import { useDmkho } from "../hooks/useDmkho";
import { useDmvt } from "../hooks/useDmvt";
import { CalenderIcon } from "../icons";
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

export default function SalesFilterModal({ isOpen, onClose, selectedItem, defaultValues, onSubmit, isSubmitting = false }) {
    const [filterData, setFilterData] = useState({
        StartDate: "",
        EndDate: "",
        ma_kh: "",
        ma_kho: "",
        ma_vt: "",
        so_ct_from: "",
        so_ct_to: "",
        ma_dvcs: "",
    });

    // States cho search và popup
    const [searchStates, setSearchStates] = useState({
        ma_khach: "",
        ma_kho: "",
        ma_vat_tu: "",
    });

    const [popupStates, setPopupStates] = useState({
        showCustomerPopup: false,
        showKhoPopup: false,
        showVatTuPopup: false,
    });

    const [focusStates, setFocusStates] = useState({
        customerFocused: false,
        khoFocused: false,
        vatTuFocused: false,
    });

    // Debounce search queries
    const debouncedMaKhSearch = useDebounce(searchStates.ma_khach, 300);
    const debouncedKhoXuatSearch = useDebounce(searchStates.ma_kho, 300);
    const debouncedVatTuSearch = useDebounce(searchStates.ma_vat_tu, 300);

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

    // Reset form khi modal đóng/mở
    useEffect(() => {
        if (isOpen) {
            if (defaultValues) {
                setFilterData((prev) => ({ ...prev, ...defaultValues }));
            }
        } else {
            // Reset khi đóng modal
            setSearchStates({
                ma_khach: "",
                ma_kho: "",
                ma_vat_tu: "",
            });
            setPopupStates({
                showCustomerPopup: false,
                showKhoPopup: false,
                showVatTuPopup: false,
            });
            setFocusStates({
                customerFocused: false,
                khoFocused: false,
                vatTuFocused: false,
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
            ma_vat_tu: 'ma_vt'
        };

        if (value !== filterData[fieldMap[field]]) {
            setFilterData((prev) => ({ ...prev, [fieldMap[field]]: "" }));
        }
    }, [filterData]);

    const handleInputFocus = useCallback((field) => {
        const focusMap = {
            ma_khach: 'customerFocused',
            ma_kho: 'khoFocused',
            ma_vat_tu: 'vatTuFocused'
        };

        setFocusStates(prev => ({ ...prev, [focusMap[field]]: true }));

        const searchValue = searchStates[field];
        if (searchValue) {
            const popupMap = {
                ma_khach: 'showCustomerPopup',
                ma_kho: 'showKhoPopup',
                ma_vat_tu: 'showVatTuPopup'
            };
            setPopupStates(prev => ({ ...prev, [popupMap[field]]: true }));
        }
    }, [searchStates]);

    const handleInputBlur = useCallback((field) => {
        const focusMap = {
            ma_khach: 'customerFocused',
            ma_kho: 'khoFocused',
            ma_vat_tu: 'vatTuFocused'
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

    const handleSubmit = useCallback(() => {
        const submitData = {
            ...filterData,
            ma_kh: filterData.ma_kh || searchStates.ma_khach.trim(),
            ma_kho: filterData.ma_kho || searchStates.ma_kho.trim(),
            ma_vt: filterData.ma_vt || searchStates.ma_vat_tu.trim(),
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
    const allowedIds = ["import-plan", "inventory2", "inventory-detail2", "import-export-summary2", "import-export-detail"];//vật tư
    const allowedIds2 = ["import-plan", "import-export-plan", "inventory-detail2", "import-export-summary2", "import-export-detail"];//kho
    const allowedIds3 = ["import-plan", "import-export-plan", "export-plan", "import-export-detail", "import-export-detail"];//khách hàng

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-auto transform transition-all">
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
                            {/* Row 1: Khách hàng và Kho */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>

                                    </div>
                                )}


                                {/* Kho */}  {allowedIds2.includes(selectedItem.id) && (
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
                                                <Package className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Row 2: Vật tư và Đơn vị */}
                            {allowedIds.includes(selectedItem.id) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Vật tư */}
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
                                </div>
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
            {popupStates.showCustomerPopup && (
                <CustomerSelectionPopup
                    isOpen={true}
                    onClose={() => handleClosePopup('showCustomerPopup')}
                    onSelect={handleCustomerSelect}
                    customers={customerData.data || []}
                    searchValue={searchStates.ma_khach || ""}
                    onSearch={(value) => handlePopupSearch('ma_khach', value)}
                />
            )}

            {/* Popup cho kho */}
            {popupStates.showKhoPopup && (
                <WarehouseSelectionPopup
                    isOpen={true}
                    onClose={() => handleClosePopup('showKhoPopup')}
                    onSelect={handleKhoSelect}
                    warehouses={Array.isArray(khoXuatData?.data) ? khoXuatData.data : []}
                    searchValue={searchStates.ma_kho || ""}
                    onSearch={(value) => handlePopupSearch('ma_kho', value)}
                />
            )}

            {/* Popup cho vật tư */}
            {popupStates.showVatTuPopup && (
                <MaterialSelectionPopup
                    isOpen={true}
                    onClose={() => handleClosePopup('showVatTuPopup')}
                    onSelect={handleVatTuSelect}
                    materials={Array.isArray(vatTuData?.data) ? vatTuData.data : []}
                    searchValue={searchStates.ma_vat_tu || ""}
                    onSearch={(value) => handlePopupSearch('ma_vat_tu', value)}
                />
            )}
        </div>
    );
}