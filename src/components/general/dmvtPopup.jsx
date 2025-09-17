import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MaterialSelectionPopup = ({
    isOpen,
    onClose,
    onSelect,
    materials = [],
    searchValue = "",
    onSearchChange
}) => {
    const [searchTerm, setSearchTerm] = useState(searchValue);
    const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
    const popupRef = useRef(null);
    const searchInputRef = useRef(null);
    const listRef = useRef(null);

    const filteredMaterials = useMemo(() => {
        if (!Array.isArray(materials)) return [];
        if (!searchTerm) return materials;
        return materials.filter(material =>
            material.ma_vt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.ten_vt?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [materials, searchTerm]);

    // Reset selected index when filtered materials change
    useEffect(() => {
        setSelectedMaterialIndex(0);
    }, [filteredMaterials.length]);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm(searchValue);
            setSelectedMaterialIndex(0);
            // Focus search input when popup opens but don't select all text
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                    // Move cursor to end instead of selecting all
                    const length = searchInputRef.current.value.length;
                    searchInputRef.current.setSelectionRange(length, length);
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
    const handleSelectMaterial = useCallback((material) => {
        onSelect(material);
        onClose();
    }, [onSelect, onClose]);
    // Scroll to selected item
    const scrollToSelected = useCallback(() => {
        if (listRef.current && selectedMaterialIndex >= 0) {
            const selectedElement = listRef.current.querySelector(`tr:nth-child(${selectedMaterialIndex + 1})`);
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }, [selectedMaterialIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!isOpen || filteredMaterials.length === 0) return;

            switch (event.key) {
                case "Escape":
                    event.preventDefault();
                    onClose();
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    setSelectedMaterialIndex((prev) => {
                        const next = prev < filteredMaterials.length - 1 ? prev + 1 : 0;
                        return next;
                    });
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    setSelectedMaterialIndex((prev) => {
                        const next = prev > 0 ? prev - 1 : filteredMaterials.length - 1;
                        return next;
                    });
                    break;
                case "Enter":
                    event.preventDefault();
                    if (selectedMaterialIndex >= 0 && filteredMaterials[selectedMaterialIndex]) {
                        handleSelectMaterial(filteredMaterials[selectedMaterialIndex]);
                    }
                    break;
                case "Tab":
                    // Allow tab to work normally for accessibility
                    break;
                default:
                    // Don't interfere with typing in the search input
                    if (event.target === searchInputRef.current) {
                        return; // Let the input handle its own events
                    }
                    
                    // Only auto-focus search input for alphanumeric characters when not already focused
                    if (!event.ctrlKey && !event.altKey && !event.metaKey &&
                        event.key.length === 1 && 
                        /^[a-zA-Z0-9]$/.test(event.key) && 
                        searchInputRef.current &&
                        document.activeElement !== searchInputRef.current) {
                        searchInputRef.current.focus();
                        // Move cursor to end to prevent text selection
                        setTimeout(() => {
                            if (searchInputRef.current) {
                                const length = searchInputRef.current.value.length;
                                searchInputRef.current.setSelectionRange(length, length);
                            }
                        }, 0);
                    }
                    break;
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isOpen, filteredMaterials, selectedMaterialIndex, onClose, handleSelectMaterial]);

    // Scroll to selected item when selection changes
    useEffect(() => {
        if (isOpen) {
            scrollToSelected();
        }
    }, [selectedMaterialIndex, isOpen, scrollToSelected]);



    const handleRowClick = useCallback((material, index) => {
        setSelectedMaterialIndex(index);
        handleSelectMaterial(material);
    }, [handleSelectMaterial]);

    const handleDoubleClick = useCallback((material) => {
        handleSelectMaterial(material);
    }, [handleSelectMaterial]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={popupRef} className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Chọn vật tư</h3>
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
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchTerm(value);
                                if (onSearchChange) {
                                    onSearchChange(value);
                                }
                            }}
                            placeholder="Tìm theo mã vật tư hoặc tên..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-4 border-b border-gray-200">
                    <div className="text-sm text-gray-500">
                        Sử dụng ↑↓ để di chuyển, Enter để chọn, Esc để đóng
                    </div>
                </div>

                {/* Material List */}
                <div className="overflow-y-auto max-h-96" ref={listRef}>
                    {filteredMaterials.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Mã VT
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên vật tư
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Đơn vị
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMaterials.map((material, index) => (
                                    <tr
                                        key={material.id || material.ma_vt}
                                        onClick={() => handleRowClick(material, index)}
                                        onDoubleClick={() => handleDoubleClick(material)}
                                        className={`cursor-pointer transition-colors ${selectedMaterialIndex === index
                                            ? "bg-blue-100 border-blue-300 ring-2 ring-blue-200"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {material.ma_vt}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {material.ten_vt}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {material.dvt || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Search size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>Không tìm thấy vật tư nào</p>
                            {searchTerm && (
                                <p className="text-sm mt-2">
                                    Thử từ khóa khác
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            {filteredMaterials.length > 0 && (
                                <>
                                    Tìm thấy {filteredMaterials.length} vật tư
                                    {selectedMaterialIndex >= 0 && (
                                        <span className="ml-2 text-blue-600">
                                            (Đã chọn: {selectedMaterialIndex + 1}/{filteredMaterials.length})
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
                            {selectedMaterialIndex >= 0 && filteredMaterials[selectedMaterialIndex] && (
                                <button
                                    onClick={() => handleSelectMaterial(filteredMaterials[selectedMaterialIndex])}
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

export default MaterialSelectionPopup;
