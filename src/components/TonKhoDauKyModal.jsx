import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDmkho } from '../hooks/useDmkho';
import { useListDmstt } from '../hooks/useDmstt';
import SearchableSelect from '../pages/category/account/SearchableSelect';

const TonKhoDauKyModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        kho: '',
        ngay: '',
        maDvcs: 'CTY'
    });
    const [selectedDate, setSelectedDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { data: dmsttData } = useListDmstt();

    useEffect(() => {
        if (dmsttData && Array.isArray(dmsttData) && dmsttData.length > 0) {
            const firstItem = dmsttData[0];
            if (firstItem.ngay_ky1) {
                const date = new Date(firstItem.ngay_ky1);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                setSelectedDate(formattedDate);
            }
        }
    }, [dmsttData]);

    const { data: listKho, isLoading: isKhoLoading } = useDmkho({
        search: searchTerm,
        page: 1,
        limit: 100
    });

    const khoData = listKho?.data || [];
    const khoOptions = khoData?.map(item => ({
        value: item.ma_kho || item.id || item.value,
        displayValue: item.ten_kho || item.name || item.ten || item.displayValue
    })) || [];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate(`/tonkho-dk?ma_kho=${formData.kho}&nam=${selectedDate.split('-')[2]}`);
        onClose();
    };

    const handleCancel = () => {
        setFormData({
            kho: '',
            ngay: '',
            maDvcs: 'CTY'
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-blue-500 text-white rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        <span className="text-sm font-medium">Vào số dư, tồn kho ban đầu</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Kho field */}
                    <div className="grid grid-cols-3 gap-3 items-center">
                        <label className="text-sm font-medium text-gray-700">
                            Kho
                        </label>
                        <div className="col-span-2">
                            <SearchableSelect
                                value={formData.kho}
                                onChange={(value) => handleInputChange('kho', value)}
                                options={khoOptions}
                                placeholder="Chọn kho"
                                searchPlaceholder="Tìm kiếm kho..."
                                loading={isKhoLoading}
                                onSearch={setSearchTerm}
                                displayKey="displayValue"
                                valueKey="value"
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>

                    {/* Ngày field */}
                    <div className="grid grid-cols-3 gap-3 items-center">
                        <label className="text-sm font-medium text-gray-700">
                            Ngày
                        </label>
                        <div className="col-span-1">
                            <input
                                type="text"
                                value={selectedDate}
                                disabled
                                className="w-full h-9 px-3 text-sm bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Mã ĐVCS field */}
                    <div className="grid grid-cols-3 gap-3 items-center">
                        <label className="text-sm font-medium text-gray-700">
                            Mã ĐVCS
                        </label>
                        <div className="col-span-1">
                            <input
                                type="text"
                                value={formData.maDvcs}
                                disabled
                                className="w-full h-9 px-3 text-sm bg-gray-100 border border-gray-300 rounded text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center px-4 py-3 bg-gray-50 rounded-b-lg">
                    <div className="flex gap-2">

                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm bg-red-600 border border-red-300 rounded hover:bg-red-800 transition-colors text-white"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm bg-green-600 border border-green-300 rounded hover:bg-green-900 transition-colors text-white"
                        >
                            Nhận
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TonKhoDauKyModal;