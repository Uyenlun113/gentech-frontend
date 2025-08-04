import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Loader, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Flatpickr from "react-flatpickr";
import { useAccounts } from '../hooks/useAccounts';
import { CalenderIcon } from '../icons';
import AccountSelectionPopup from './general/AccountSelectionPopup';

export default function FilterModal({
    isOpen,
    onClose,
    selectedItem,
    defaultValues,
    onSubmit,
    isSubmitting = false,
}) {
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

    const { data: accountRawData = {} } = useAccounts(
        tkSearch ? { search: tkSearch } : {}
    );

    // Áp dụng defaultValues khi modal mở
    useEffect(() => {
        if (defaultValues) {
            setFilterData((prev) => ({ ...prev, ...defaultValues }));
        }
    }, [defaultValues]);

    // Mở popup khi gõ tkSearch
    useEffect(() => {
        const timer = setTimeout(() => {
            if (tkSearch) setShowAccountPopup(true);
        }, 400);
        return () => clearTimeout(timer);
    }, [tkSearch]);

    const handleInputChange = (field, value) => {
        setFilterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAccountSelect = (account) => {
        setFilterData((prev) => ({
            ...prev,
            tk: account.tk.trim(),
        }));
        setTkSearch("");
        setShowAccountPopup(false);
    };

    const handleSubmit = () => {
        console.log(filterData);
        onSubmit(filterData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-xl w-[600px] max-w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-100">
                    <h3 className="text-lg font-semibold flex items-center">
                        <Search className="w-5 h-5 mr-2" />
                        {selectedItem?.label || "Bộ lọc"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-blue-50">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Tài khoản */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã tài khoản
                            </label>
                            <input
                                type="text"
                                value={filterData.tk ? `${filterData.tk}` : tkSearch}
                                onChange={(e) => {
                                    setTkSearch(e.target.value);
                                    setFilterData((prev) => ({ ...prev, tk: "" }));
                                }}
                                onFocus={() => {
                                    if (tkSearch) setShowAccountPopup(true);
                                }}
                                placeholder="Nhập mã tài khoản..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Mã ĐVCS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã ĐVCS
                            </label>
                            <input
                                type="text"
                                value={filterData.ma_dvcs}
                                onChange={(e) => handleInputChange("ma_dvcs", e.target.value)}
                                placeholder="Nhập mã đơn vị"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Từ ngày */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Từ ngày
                            </label>
                            <div className="relative w-full flatpickr-wrapper">
                                <Flatpickr
                                    value={filterData.ngay_ct1}
                                    onChange={(date) => {
                                        const formatted = date[0]?.toLocaleDateString("en-CA");
                                        handleInputChange("ngay_ct1", formatted);
                                    }}
                                    options={{
                                        dateFormat: "Y-m-d",
                                        locale: Vietnamese,
                                    }}
                                    placeholder="dd-mm-yyyy"
                                    className="h-11 w-full bg-white rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring bg-transparent text-gray-800 border-gray-300 focus:border-blue-300 focus:ring-blue-500/20"
                                    disabled={isSubmitting}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                    <CalenderIcon className="size-6" />
                                </span>
                            </div>
                        </div>

                        {/* Đến ngày */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Đến ngày
                            </label>
                            <div className="relative w-full flatpickr-wrapper">
                                <Flatpickr
                                    value={filterData.ngay_ct2}
                                    onChange={(date) => {
                                        const formatted = date[0]?.toLocaleDateString("en-CA");
                                        handleInputChange("ngay_ct2", formatted);
                                    }}
                                    options={{
                                        dateFormat: "Y-m-d",
                                        locale: Vietnamese,
                                    }}
                                    placeholder="dd-mm-yyyy"
                                    className="h-11 w-full bg-white rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring bg-transparent text-gray-800 border-gray-300 focus:border-blue-300 focus:ring-blue-500/20"
                                    disabled={isSubmitting}
                                />
                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                                    <CalenderIcon className="size-6" />
                                </span>
                            </div>
                        </div>

                        {/* Gộp TK */}
                        {(selectedItem?.id === "inventory" ||
                            selectedItem?.id === "inventory-detail" ||
                            selectedItem?.id === "import-export-summary") && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gộp tài khoản
                                    </label>
                                    <select
                                        value={filterData.gop_tk}
                                        onChange={(e) =>
                                            handleInputChange("gop_tk", parseInt(e.target.value))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isSubmitting}
                                    >
                                        <option value={0}>Không</option>
                                        <option value={1}>Có</option>
                                    </select>
                                </div>
                            )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200 bg-blue-50">
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                            {isSubmitting ? "Đang xử lý..." : "Lọc dữ liệu"}
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
