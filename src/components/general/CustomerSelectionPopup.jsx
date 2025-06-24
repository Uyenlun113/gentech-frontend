import { useState } from "react";
import { Search, X } from "lucide-react";

const CustomerSelectionPopup = ({
    isOpen,
    onClose,
    onSelect,
    customers = [],
    searchValue = ""
}) => {
    const [searchTerm, setSearchTerm] = useState(searchValue);

    const filteredCustomers = Array.isArray(customers)
        ? customers.filter(customer =>
            customer.ma_kh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.ten_kh?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleSelectCustomer = (customer) => {
        onSelect(customer);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Chọn khách hàng</h3>
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
                            placeholder="Tìm kiếm theo mã khách hàng hoặc tên..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Customer List */}
                <div className="overflow-y-auto max-h-96">
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
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                        Địa chỉ
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id || customer.ma_kh}
                                        onClick={() => handleSelectCustomer(customer)}
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
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
                                <>Tìm thấy {filteredCustomers.length} khách hàng</>
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

export default CustomerSelectionPopup;