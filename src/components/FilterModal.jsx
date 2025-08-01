import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const FilterModal = ({ isOpen, onClose, selectedItem, defaultValues, onSubmit }) => {
    const [filterData, setFilterData] = useState({
        tk: '',
        ngay_ct1: '',
        ngay_ct2: '',
        ma_dvcs: ''
    });

    // Cập nhật filterData khi defaultValues thay đổi
    useEffect(() => {
        if (defaultValues) {
            setFilterData(defaultValues);
        }
    }, [defaultValues]);

    if (!isOpen) return null;

    const handleInputChange = (field, value) => {
        setFilterData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        const submitData = {
            ...filterData,
            // reportType: selectedItem?.id,
            // reportName: selectedItem?.label
        };
        console.log("-------------------", defaultValues.type)

        // console.log('Filter data being submitted:', submitData);
        onSubmit(submitData);
    };

    const resetFilter = () => {
        if (defaultValues) {
            setFilterData(defaultValues);
        } else {
            setFilterData({
                tk: '',
                ngay_ct1: '',
                ngay_ct2: '',
                ma_dvcs: ''
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-w-full mx-4">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                        <Search className="w-5 h-5 mr-2" />
                        {selectedItem?.label}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900 mb-4">Điều kiện lọc</h4>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Tài khoản */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tài khoản
                                </label>
                                <input
                                    type="text"
                                    value={filterData.tk}
                                    onChange={(e) => handleInputChange('tk', e.target.value)}
                                    placeholder="Nhập mã tài khoản"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    onChange={(e) => handleInputChange('ma_dvcs', e.target.value)}
                                    placeholder="Nhập mã đơn vị"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Từ ngày */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Từ ngày
                                </label>
                                <input
                                    type="date"
                                    value={filterData.ngay_ct1}
                                    onChange={(e) => handleInputChange('ngay_ct1', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Đến ngày */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đến ngày
                                </label>
                                <input
                                    type="date"
                                    value={filterData.ngay_ct2}
                                    onChange={(e) => handleInputChange('ngay_ct2', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Hiển thị thông tin về giá trị mặc định */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-700">
                                <strong>Báo cáo:</strong> {selectedItem?.label}
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                                Các trường đã được điền sẵn giá trị mặc định. Bạn có thể chỉnh sửa theo nhu cầu.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-between p-6 border-t border-gray-200">
                    <button
                        onClick={resetFilter}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                    >
                        Reset
                    </button>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                        >
                            Lọc dữ liệu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;