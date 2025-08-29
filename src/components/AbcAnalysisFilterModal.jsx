import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Calendar, CreditCard, Filter, Loader, Search, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";

import { useAccounts } from "../hooks/useAccounts";
import { useCustomers } from "../hooks/useCustomer";
import { CalenderIcon } from "../icons";
import AccountSelectionPopup from "./general/AccountSelectionPopup";
import CustomerSelectionPopup from "./general/CustomerSelectionPopup";

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

export default function AbcAnalysisFilterModal({ isOpen, onClose, defaultValues, onSubmit, isSubmitting = false }) {
    const [filterData, setFilterData] = useState({
        ma_khach: "",
        tai_khoan: "",
        ngay: "",
        ma_dvcs: "",
        tien_mat_vnd: "VND",
    });

    // States cho search và popup
    const [searchStates, setSearchStates] = useState({
        ma_khach: "",
        tai_khoan: "",
    });

    const [popupStates, setPopupStates] = useState({
        showCustomerPopup: false,
        showAccountPopup: false,
    });

    const [focusStates, setFocusStates] = useState({
        customerFocused: false,
        accountFocused: false,
    });

    // Debounce search queries
    const debouncedMaKhSearch = useDebounce(searchStates.ma_khach, 300);
    const debouncedAccountSearch = useDebounce(searchStates.tai_khoan, 300);

    // API Hooks
    const { data: customerData = [] } = useCustomers(
        { search: debouncedMaKhSearch || "" },
        { enabled: !!debouncedMaKhSearch && debouncedMaKhSearch.length > 0 }
    );

    const { data: accountData = [] } = useAccounts(
        { search: debouncedAccountSearch || "" },
        { enabled: !!debouncedAccountSearch && debouncedAccountSearch.length > 0 }
    );

    // Reset form khi modal đóng/mở
    useEffect(() => {
        if (isOpen) {
            if (defaultValues) {
                setFilterData((prev) => ({
                    ...prev,
                    ...defaultValues
                }));
            }
        } else {
            // Reset khi đóng modal
            setSearchStates({
                ma_khach: "",
                tai_khoan: "",
            });
            setPopupStates({
                showCustomerPopup: false,
                showAccountPopup: false,
            });
            setFocusStates({
                customerFocused: false,
                accountFocused: false,
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
        if (debouncedAccountSearch && focusStates.accountFocused) {
            setPopupStates(prev => ({ ...prev, showAccountPopup: true }));
        } else if (!searchStates.tai_khoan) {
            setPopupStates(prev => ({ ...prev, showAccountPopup: false }));
        }
    }, [debouncedAccountSearch, focusStates.accountFocused, searchStates.tai_khoan]);

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
            ma_khach: 'ma_khach',
            tai_khoan: 'tai_khoan'
        };

        if (value !== filterData[fieldMap[field]]) {
            setFilterData((prev) => ({ ...prev, [fieldMap[field]]: "" }));
        }
    }, [filterData]);

    const handleInputFocus = useCallback((field) => {
        const focusMap = {
            ma_khach: 'customerFocused',
            tai_khoan: 'accountFocused'
        };

        setFocusStates(prev => ({ ...prev, [focusMap[field]]: true }));

        const searchValue = searchStates[field];
        if (searchValue) {
            const popupMap = {
                ma_khach: 'showCustomerPopup',
                tai_khoan: 'showAccountPopup'
            };
            setPopupStates(prev => ({ ...prev, [popupMap[field]]: true }));
        }
    }, [searchStates]);

    const handleInputBlur = useCallback((field) => {
        const focusMap = {
            ma_khach: 'customerFocused',
            tai_khoan: 'accountFocused'
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
            ma_khach: customerCode,
        }));
        setSearchStates(prev => ({ ...prev, ma_khach: customerCode }));
        setPopupStates(prev => ({ ...prev, showCustomerPopup: false }));
        setFocusStates(prev => ({ ...prev, customerFocused: false }));
    }, []);

    const handleAccountSelect = useCallback((account) => {
        const accountCode = account.tk?.trim() || "";
        setFilterData((prev) => ({
            ...prev,
            tai_khoan: accountCode,
        }));
        setSearchStates(prev => ({ ...prev, tai_khoan: accountCode }));
        setPopupStates(prev => ({ ...prev, showAccountPopup: false }));
        setFocusStates(prev => ({ ...prev, accountFocused: false }));
    }, []);

    const handleSubmit = useCallback(() => {
        const submitData = {
            ...filterData,
            ma_khach: filterData.ma_khach || searchStates.ma_khach.trim(),
            tai_khoan: filterData.tai_khoan || searchStates.tai_khoan.trim(),
        };
        onSubmit(submitData);
    }, [filterData, searchStates, onSubmit]);

    const handleClose = useCallback(() => {
        if (!isSubmitting) {
            onClose();
        }
    }, [isSubmitting, onClose]);

    const handleCancel = useCallback(() => {
        handleClose();
    }, [handleClose]);

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

    return (
        <>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-500 rounded-t-xl">
                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">
                                Tra số dư công nợ của một khách hàng
                            </h3>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        {/* Mã khách */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Users className="w-4 h-4 mr-2 text-blue-600" />
                                Mã khách
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filterData.ma_khach || searchStates.ma_khach}
                                    onChange={(e) => handlePopupSearch('ma_khach', e.target.value)}
                                    onFocus={() => handleInputFocus('ma_khach')}
                                    onBlur={() => handleInputBlur('ma_khach')}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Users className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>


                        {/* Tài khoản */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                Tài khoản
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filterData.tai_khoan || searchStates.tai_khoan}
                                    onChange={(e) => handlePopupSearch('tai_khoan', e.target.value)}
                                    onFocus={() => handleInputFocus('tai_khoan')}
                                    onBlur={() => handleInputBlur('tai_khoan')}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>


                        {/* Ngày */}
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                Ngày
                            </label>
                            <div className="relative">
                                <Flatpickr
                                    value={filterData.ngay}
                                    onChange={(date) => {
                                        if (date[0]) {
                                            const d = date[0];
                                            const formatted = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
                                            handleInputChange("ngay", formatted);
                                        }
                                    }}
                                    options={{
                                        dateFormat: "d-m-Y",
                                        locale: Vietnamese,
                                        allowInput: true,
                                        defaultDate: "11-08-2025"
                                    }}
                                    placeholder="11-08-2025"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <CalenderIcon className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Mã ĐVCS */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Mã ĐVCS
                            </label>
                            <input
                                type="text"
                                value={filterData.ma_dvcs}
                                onChange={(e) => handleInputChange("ma_dvcs", e.target.value)}
                                placeholder="CTY"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Màu VND/ngoại tệ */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Màu VND/ngoại tệ
                            </label>
                            <select
                                value={filterData.tien_mat_vnd}
                                onChange={(e) => handleInputChange("tien_mat_vnd", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSubmitting}
                            >
                                <option value="VND">VND</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end items-center p-6 border-t border-gray-100 bg-white rounded-b-xl">
                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancel}
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
            </div >

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

            {/* Popup cho tài khoản */}
            {
                popupStates.showAccountPopup && (
                    <AccountSelectionPopup
                        isOpen={true}
                        onClose={() => handleClosePopup('showAccountPopup')}
                        onSelect={handleAccountSelect}
                        accounts={Array.isArray(accountData?.data) ? accountData.data : []}
                        searchValue={searchStates.tai_khoan || ""}
                        onSearch={(value) => handlePopupSearch('tai_khoan', value)}
                    />
                )
            }
        </>
    );
}