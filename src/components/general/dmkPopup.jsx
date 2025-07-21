import { useState } from "react";
import { Search, X, Warehouse } from "lucide-react";

const WarehouseSelectionPopup = ({
    isOpen,
    onClose,
    onSelect,
    warehouses = [],
    searchValue = "",
    onSearch
}) => {
    const [searchTerm, setSearchTerm] = useState(searchValue);

    const filteredWarehouses = Array.isArray(warehouses)
        ? warehouses.filter(warehouse =>
            warehouse.ma_kho?.trim().toLowerCase().includes(searchTerm.toLowerCase()) ||
            warehouse.ten_kho?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleSelectWarehouse = (warehouse) => {
        onSelect(warehouse);
        onClose();
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
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
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Tìm theo mã kho hoặc tên kho..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Warehouse List */}
                <div className="overflow-y-auto max-h-96">
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
                                        onClick={() => handleSelectWarehouse(warehouse)}
                                        className="cursor-pointer hover:bg-blue-50 transition-colors"
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
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                warehouse.status === "1" 
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
                                <>Tìm thấy {filteredWarehouses.length} kho</>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarehouseSelectionPopup;