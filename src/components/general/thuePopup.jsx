import { useState } from "react";
import { Search, X, Receipt } from "lucide-react";

const TaxSelectionPopup = ({
    isOpen,
    onClose,
    onSelect,
    taxes = [],
    searchValue = "",
    onSearch
}) => {
    const [searchTerm, setSearchTerm] = useState(searchValue);

    const filteredTaxes = Array.isArray(taxes)
        ? taxes.filter(tax =>
            tax.ma_thue?.trim().toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax.ten_thue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax.muc_thue?.toString().includes(searchTerm)
        )
        : [];

    const handleSelectTax = (tax) => {
        onSelect(tax);
        onClose();
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const formatTaxRate = (rate) => {
        if (!rate && rate !== 0) return 'N/A';
        return `${rate}%`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-green-600" />
                        Chọn thuế
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
                            placeholder="Tìm theo mã thuế, tên thuế hoặc mức thuế..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Tax List */}
                <div className="overflow-y-auto max-h-96">
                    {filteredTaxes.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                        Mã thuế
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên thuế
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Mức thuế
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTaxes.map((tax, index) => (
                                    <tr
                                        key={tax.ma_thue?.trim() || index}
                                        onClick={() => handleSelectTax(tax)}
                                        className="cursor-pointer hover:bg-green-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {tax.ma_thue?.trim() || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {tax.ten_thue || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            {formatTaxRate(tax.muc_thue)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {tax.mo_ta || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                tax.status === "1" || tax.trang_thai === "1"
                                                    ? "bg-green-100 text-green-800" 
                                                    : "bg-red-100 text-red-800"
                                            }`}>
                                                {(tax.status === "1" || tax.trang_thai === "1") ? "Áp dụng" : "Ngừng áp dụng"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <Receipt size={48} className="mx-auto mb-4 text-gray-300" />
                            <p>Không tìm thấy thuế nào</p>
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
                            {filteredTaxes.length > 0 && (
                                <>Tìm thấy {filteredTaxes.length} loại thuế</>
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

export default TaxSelectionPopup;