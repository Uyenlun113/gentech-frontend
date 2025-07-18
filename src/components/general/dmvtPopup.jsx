import { useState } from "react";
import { Search, X } from "lucide-react";

const MaterialSelectionPopup = ({
    isOpen,
    onClose,
    onSelect,
    materials = [],
    searchValue = ""
}) => {
    const [searchTerm, setSearchTerm] = useState(searchValue);

    const filteredMaterials = Array.isArray(materials)
        ? materials.filter(material =>
            material.ma_vt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.ten_vt?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleSelectMaterial = (material) => {
        onSelect(material);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
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
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm theo mã vật tư hoặc tên..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Material List */}
                <div className="overflow-y-auto max-h-96">
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
                                {filteredMaterials.map((material) => (
                                    <tr
                                        key={material.id || material.ma_vt}
                                        onClick={() => handleSelectMaterial(material)}
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
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
                                <>Tìm thấy {filteredMaterials.length} vật tư</>
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

export default MaterialSelectionPopup;
