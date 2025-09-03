import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CustomerSelectionPopup = ({
    isOpen,
    onClose,
    onSelect,
    customers = [],
    searchValue = ""
}) => {
    const [searchTerm, setSearchTerm] = useState(searchValue);
    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(0);
    const popupRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const filteredCustomers = useMemo(() => {
        if (!Array.isArray(customers)) return [];
        if (!searchTerm) return customers;
        return customers.filter(customer =>
            customer.ma_kh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.ten_kh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.dia_chi?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    // Reset selected index when filtered customers change
    useEffect(() => {
        setSelectedCustomerIndex(0);
    }, [filteredCustomers.length]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm(searchValue);
            setSelectedCustomerIndex(0);
            // Focus search input when popup opens
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    searchInputRef.current.select();
                }
            }, 100);
        }
    }, [isOpen, searchValue]);

    // Handle click outside to close popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen, onClose]);

    // Scroll to selected item
    const scrollToSelected = useCallback(() => {
        if (listRef.current && selectedCustomerIndex >= 0) {
            const selectedElement = listRef.current.querySelector(`tr:nth-child(${selectedCustomerIndex + 1})`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }, [selectedCustomerIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen || filteredCustomers.length === 0) return;

            switch (event.key) {
                case "Escape":
                    event.preventDefault();
                    onClose();
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    setSelectedCustomerIndex((prev) => {
                        const next = prev < filteredCustomers.length - 1 ? prev + 1 : 0;
                        return next;
                    });
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setSelectedCustomerIndex((prev) => {
                        const next = prev > 0 ? prev - 1 : filteredCustomers.length - 1;
                        return next;
                    });
                    break;
                case "Enter":
                    event.preventDefault();
                    if (selectedCustomerIndex >= 0 && filteredCustomers[selectedCustomerIndex]) {
                        handleSelectCustomer(filteredCustomers[selectedCustomerIndex]);
                    }
                    break;
                case "Tab":
                    // Allow tab to work normally for accessibility
                    break;
                default:
                    // Focus search input for typing
                    if (event.target !== searchInputRef.current && !event.ctrlKey && !event.altKey) {
                        if (searchInputRef.current) {
                            searchInputRef.current.focus();
                        }
                    }
                    break;
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, filteredCustomers, selectedCustomerIndex, onClose]);

    // Scroll to selected item when selection changes
    useEffect(() => {
        if (isOpen) {
            scrollToSelected();
        }
    }, [selectedCustomerIndex, isOpen, scrollToSelected]);

    const handleSelectCustomer = useCallback((customer) => {
        onSelect(customer);
        onClose();
    }, [onSelect, onClose]);

    const handleRowClick = useCallback((customer, index) => {
        setSelectedCustomerIndex(index);
        handleSelectCustomer(customer);
    }, [handleSelectCustomer]);

    const handleDoubleClick = useCallback((customer) => {
        handleSelectCustomer(customer);
    }, [handleSelectCustomer]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={popupRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Chọn khách hàng</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo mã khách hàng, tên hoặc địa chỉ..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        Sử dụng ↑↓ để di chuyển, Enter để chọn, Esc để đóng
                    </div>
                </div>

                {/* Customer List */}
                <div className="overflow-y-auto max-h-96" ref={listRef}>
                    {filteredCustomers.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Mã KH
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên khách hàng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                                        Địa chỉ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.map((customer, index) => (
                                    <tr
                                        key={customer.id || customer.ma_kh}
                                        onClick={() => handleRowClick(customer, index)}
                                        onDoubleClick={() => handleDoubleClick(customer)}
                                        className={`cursor-pointer transition-colors ${selectedCustomerIndex === index
                                            ? "bg-blue-100 border-blue-300 ring-2 ring-blue-200"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {customer.ma_kh}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {customer.ten_kh}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {customer.dia_chi || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Search size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>Không tìm thấy khách hàng nào</p>
                            {searchTerm && (
                                <p className="text-sm mt-2">
                                    Thử tìm kiếm với từ khóa khác
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            {filteredCustomers.length > 0 && (
                                <>
                                    Tìm thấy {filteredCustomers.length} khách hàng
                                    {selectedCustomerIndex >= 0 && (
                                        <span className="ml-2 text-blue-600">
                                            (Đã chọn: {selectedCustomerIndex + 1}/{filteredCustomers.length})
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                tabIndex={-1}
                            >
                                Hủy
                            </button>
                            {selectedCustomerIndex >= 0 && filteredCustomers[selectedCustomerIndex] && (
                                <button
                                    onClick={() => handleSelectCustomer(filteredCustomers[selectedCustomerIndex])}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    tabIndex={-1}
                                >
                                    Chọn
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSelectionPopup;