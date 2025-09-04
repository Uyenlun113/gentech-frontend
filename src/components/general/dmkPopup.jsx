import { Search, Warehouse, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const WarehouseSelectionPopup = ({
    isOpen,
    onClose,
    onSelect,
    warehouses = [],
    searchValue = "",
    onSearch
}) => {
    const [searchTerm, setSearchTerm] = useState(searchValue);
    const [selectedWarehouseIndex, setSelectedWarehouseIndex] = useState(0);
    const popupRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const filteredWarehouses = useMemo(() => {
        if (!Array.isArray(warehouses)) return [];
        if (!searchTerm) return warehouses;
        return warehouses.filter(warehouse =>
            warehouse.ma_kho?.trim().toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.ten_kho?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [warehouses, searchTerm]);

    // Reset selected index when filtered warehouses change
    useEffect(() => {
        setSelectedWarehouseIndex(0);
    }, [filteredWarehouses.length]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm(searchValue);
            setSelectedWarehouseIndex(0);
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
    const handleSelectWarehouse = useCallback((warehouse) => {
        onSelect(warehouse);
        onClose();
    }, [onSelect, onClose]);
    // Scroll to selected item
    const scrollToSelected = useCallback(() => {
        if (listRef.current && selectedWarehouseIndex >= 0) {
            const selectedElement = listRef.current.querySelector(`tr:nth-child(${selectedWarehouseIndex + 1})`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }, [selectedWarehouseIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen || filteredWarehouses.length === 0) return;

            switch (event.key) {
                case "Escape":
                    event.preventDefault();
                    onClose();
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    setSelectedWarehouseIndex((prev) => {
                        const next = prev < filteredWarehouses.length - 1 ? prev + 1 : 0;
                        return next;
                    });
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setSelectedWarehouseIndex((prev) => {
                        const next = prev > 0 ? prev - 1 : filteredWarehouses.length - 1;
                        return next;
                    });
                    break;
                case "Enter":
                    event.preventDefault();
                    if (selectedWarehouseIndex >= 0 && filteredWarehouses[selectedWarehouseIndex]) {
                        handleSelectWarehouse(filteredWarehouses[selectedWarehouseIndex]);
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
    }, [isOpen, filteredWarehouses, selectedWarehouseIndex, onClose, handleSelectWarehouse]);

    // Scroll to selected item when selection changes
    useEffect(() => {
        if (isOpen) {
            scrollToSelected();
        }
    }, [selectedWarehouseIndex, isOpen, scrollToSelected]);



    const handleRowClick = useCallback((warehouse, index) => {
        setSelectedWarehouseIndex(index);
        handleSelectWarehouse(warehouse);
    }, [handleSelectWarehouse]);

    const handleDoubleClick = useCallback((warehouse) => {
        handleSelectWarehouse(warehouse);
    }, [handleSelectWarehouse]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={popupRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Warehouse className="w-5 h-5 text-blue-600" />
                        Chọn kho
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
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
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Tìm theo mã kho hoặc tên kho..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Warehouse List */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-sm text-gray-500">
                        Sử dụng ↑↓ để di chuyển, Enter để chọn, Esc để đóng
                    </div>
                </div>

                <div className="overflow-y-auto max-h-96" ref={listRef}>
                    {filteredWarehouses.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Mã kho
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên kho
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Mã ĐVCS
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredWarehouses.map((warehouse, index) => (
                                    <tr
                                        key={warehouse.ma_kho?.trim() || index}
                                        onClick={() => handleRowClick(warehouse, index)}
                                        onDoubleClick={() => handleDoubleClick(warehouse)}
                                        className={`cursor-pointer transition-colors ${selectedWarehouseIndex === index
                                            ? "bg-blue-100 border-blue-300 ring-2 ring-blue-200"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {warehouse.ma_kho?.trim() || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {warehouse.ten_kho || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {warehouse.ma_dvcs?.trim() || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${warehouse.status === "1"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}>
                                                {warehouse.status === "1" ? "Hoạt động" : "Không hoạt động"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Warehouse size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>Không tìm thấy kho nào</p>
                            {searchTerm && (
                                <p className="text-sm mt-2">
                                    Thử từ khóa khác: "{searchTerm}"
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            {filteredWarehouses.length > 0 && (
                                <>
                                    Tìm thấy {filteredWarehouses.length} kho
                                    {selectedWarehouseIndex >= 0 && (
                                        <span className="ml-2 text-blue-600">
                                            (Đã chọn: {selectedWarehouseIndex + 1}/{filteredWarehouses.length})
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
                            {selectedWarehouseIndex >= 0 && filteredWarehouses[selectedWarehouseIndex] && (
                                <button
                                    onClick={() => handleSelectWarehouse(filteredWarehouses[selectedWarehouseIndex])}
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

export default WarehouseSelectionPopup;