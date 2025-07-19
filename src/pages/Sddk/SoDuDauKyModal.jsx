import { Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useAccounts } from '../../hooks/useAccounts';
import { useCreateCdtkBulk } from '../../hooks/useCdtk';
import { useListDmstt } from '../../hooks/useDmstt';

const SoDuDauKyModal = ({ isOpen, onClose }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [maDVCS, setMaDVCS] = useState('CTY');
    const [congTy, setCongTy] = useState('Công ty TNHH');
    const { data: accountResponse } = useAccounts();
    const accountList = accountResponse?.data || [];
    const createMutation = useCreateCdtkBulk();
    // Sử dụng hook để lấy dữ liệu
    const { data: dmsttData, isLoading, error } = useListDmstt();

    // Set ngày mặc định khi có dữ liệu
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
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!dmsttData || dmsttData.length === 0) {
            toast.error("Không có dữ liệu ngày kỳ");
            return;
        }

        if (!Array.isArray(accountList) || accountList.length === 0) {
            toast.error("Không có tài khoản nào để thêm.");
            return;
        }

        const nam = new Date(dmsttData[0].ngay_ky1).getFullYear();

        const dataToCreate = accountList.map((account) => ({
            ma_dvcs: maDVCS,
            nam,
            tk: account.tk?.trim(),
            du_no00: 0,
            du_co00: 0,
            du_no_nt00: 0,
            du_co_nt00: 0,
            du_no1: 0,
            du_co1: 0,
            du_no_nt1: 0,
            du_co_nt1: 0,
            date: new Date(),
            status: "0",
        }));

        try {
            await createMutation.mutateAsync(dataToCreate);
            onClose();
            navigate(`/dau-ky/sodu-tk/table?nam=${nam}`);
        } catch (err) {
            toast.error("Có lỗi xảy ra trong quá trình thêm số dư.");
            console.error(err);
        }
    };



    const handleCancel = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-100">
                    <div className="flex items-center space-x-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Vào số dư ban đầu của các tài khoản
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6  bg-blue-50 ">
                    {/* Thông báo */}
                    <div className="mb-6 p-4 bg-blue-200 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                            <p>
                                - Đối với các tài khoản theo dõi chi tiết công nợ, thì phải vào số liệu
                                công nợ chi tiết ở phần vào số dư công nợ
                            </p>
                            <p>
                                - Nếu số dư ban đầu không phải là của đầu năm tài chính, thì phải vào
                                thêm số dư dư nợ để có thể lên được bảng cân đối kế toán.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4 bg-blue-50">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Ngày
                            </label>
                            <input
                                type="text"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                placeholder="dd-mm-yyyy"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           placeholder-gray-400 dark:placeholder-gray-500"
                                disabled
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Mã ĐVCS
                                </label>
                                <input
                                    type="text"
                                    value={maDVCS}
                                    onChange={(e) => setMaDVCS(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Công ty
                                </label>
                                <input
                                    type="text"
                                    value={congTy}
                                    onChange={(e) => setCongTy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled
                                />
                            </div>
                        </div>


                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Đang tải dữ liệu...
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-sm text-red-800 dark:text-red-200">
                                Lỗi khi tải dữ liệu: {error.message}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                     rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
        border border-transparent rounded-md hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading && (
                            <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        )}
                        {isLoading ? 'Đang xử lý...' : 'Nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SoDuDauKyModal;