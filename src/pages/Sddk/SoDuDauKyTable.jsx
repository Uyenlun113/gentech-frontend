import { format } from 'date-fns';
import { Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useListCdtk, useUpdateCdtk } from '../../hooks/useCdtk';
const SoDuDauKyTable = () => {
    const [searchParams] = useSearchParams();
    const [editingRow, setEditingRow] = useState(null);
    const [editData, setEditData] = useState({});
    const yearFromUrl = searchParams.get('nam');
    const [selectedYear, setSelectedYear] = useState(
        yearFromUrl ? parseInt(yearFromUrl) : new Date().getFullYear()
    );

    // Gọi hook để lấy dữ liệu (đã có account info từ JOIN)
    const { data: cdtkData, isLoading, error, refetch } = useListCdtk(selectedYear);
    const updateCdtk = useUpdateCdtk();

    const handleEdit = (index, row) => {
        setEditingRow(index);
        setEditData(row);
    };

    const handleSave = async () => {
        try {
            await updateCdtk.mutateAsync({
                tk: editData.tk.trim(),
                nam: selectedYear,
                data: {
                    du_no00: parseFloat(editData.du_no00) || 0,
                    du_co00: parseFloat(editData.du_co00) || 0,
                    du_no_nt00: parseFloat(editData.du_no_nt00) || 0,
                    du_co_nt00: parseFloat(editData.du_co_nt00) || 0,
                    du_no1: parseFloat(editData.du_no1) || 0,
                    du_co1: parseFloat(editData.du_co1) || 0,
                    du_no_nt1: parseFloat(editData.du_no_nt1) || 0,
                    du_co_nt1: parseFloat(editData.du_co_nt1) || 0
                }
            });
            setEditingRow(null);
            setEditData({});
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleCancel = () => {
        setEditingRow(null);
        setEditData({});
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value === '' ? '' : parseFloat(value) || 0
        }));
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('vi-VN').format(num || 0);
    };

    // Helper function để lấy tên tài khoản
    const getAccountName = (row) => {
        return row.account?.ten_tk || row.account?.name || `Tài khoản ${row.tk}`;
    };

    // Tính tổng các cột - đảm bảo convert sang number
    const calculateTotals = () => {
        if (!cdtkData || cdtkData.length === 0) return {};

        return {
            du_no00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no00) || 0), 0),
            du_co00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co00) || 0), 0),
            du_no1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no1) || 0), 0),
            du_co1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co1) || 0), 0),
            du_no_nt00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no_nt00) || 0), 0),
            du_co_nt00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co_nt00) || 0), 0),
            du_no_nt1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no_nt1) || 0), 0),
            du_co_nt1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co_nt1) || 0), 0)
        };
    };

    const totals = calculateTotals();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Lỗi khi tải dữ liệu: {error.message}</div>
            </div>
        );
    }

    return (
        <div className="px-4 bg-white dark:bg-gray-900 pt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Vào số dư ban đầu của các tài khoản
                    </h1>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Năm:
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md 
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                        <span>Kết xuất</span>
                    </button>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Tính tổng
                    </button>
                </div>
            </div>

            {/* Table Container with sticky header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 w-[80px]">
                                    Tài khoản
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư nợ ban đầu
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư có ban đầu
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư nợ đầu năm TC
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư có đầu năm TC
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư nợ n.tệ ban đầu
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư có n.tệ ban đầu
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư nợ n.tệ đầu năm TC
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Dư có n.tệ đầu năm TC
                                </th>
                                <th className="px-2 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 w-[100px]">
                                    Tên tài khoản
                                </th>
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[120px]">
                                    Ngày cập nhật
                                </th>
                                <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0 min-w-[50px]">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {cdtkData?.map((row, index) => (
                                <tr key={row.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center">
                                        {row.tk}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        {editingRow === index ? (
                                            <input
                                                type="number"
                                                value={editData.du_no00 === '' ? '' : editData.du_no00 || ''}
                                                onChange={(e) => handleInputChange('du_no00', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                                            />
                                        ) : (
                                            <span className="font-mono">{formatNumber(row.du_no00)}</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        {editingRow === index ? (
                                            <input
                                                type="number"
                                                value={editData.du_co00 === '' ? '' : editData.du_co00 || ''}
                                                onChange={(e) => handleInputChange('du_co00', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                                            />
                                        ) : (
                                            <span className="font-mono">{formatNumber(row.du_co00)}</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        {editingRow === index ? (
                                            <input
                                                type="number"
                                                value={editData.du_no1 === '' ? '' : editData.du_no1 || ''}
                                                onChange={(e) => handleInputChange('du_no1', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                                            />
                                        ) : (
                                            <span className="font-mono">{formatNumber(row.du_no1)}</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        {editingRow === index ? (
                                            <input
                                                type="number"
                                                value={editData.du_co1 === '' ? '' : editData.du_co1 || ''}
                                                onChange={(e) => handleInputChange('du_co1', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm text-center"
                                            />
                                        ) : (
                                            <span className="font-mono">{formatNumber(row.du_co1)}</span>
                                        )}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        <span className="font-mono">{formatNumber(row.du_no_nt00 || 0)}</span>
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        <span className="font-mono">{formatNumber(row.du_co_nt00 || 0)}</span>
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        <span className="font-mono">{formatNumber(row.du_no_nt1 || 0)}</span>
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white text-center">
                                        <span className="font-mono">{formatNumber(row.du_co_nt1 || 0)}</span>
                                    </td>
                                    {/* Hiển thị tên tài khoản từ data đã JOIN */}
                                    <td className="px-2 py-4 text-sm text-gray-900 dark:text-white text-center w-[210px] overflow-hidden ">
                                        <span className="text-gray-900 dark:text-white " title={getAccountName(row)}>
                                            {getAccountName(row)}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {format(new Date(row.date), 'dd/MM/yyyy')}
                                    </td>
                                    <td className="px-2 py-2 whitespace-nowrap text-sm text-center">
                                        {editingRow === index ? (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={handleSave}
                                                    disabled={updateCdtk.isPending}
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 
                                                             p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:opacity-50"
                                                    title="Lưu"
                                                >
                                                    <Save className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={updateCdtk.isPending}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 
                                                             p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                                    title="Hủy"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(index, row)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 
                                                             p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sticky Footer with Totals */}
                {cdtkData && cdtkData.length > 0 && (
                    <div className="sticky bottom-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 
                   border-t border-blue-200 dark:border-blue-700 text-sm">
                        <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <table className="min-w-full table-auto">

                                <tbody>
                                    <tr className="font-semibold text-gray-900 dark:text-white">
                                        <td className="px-2 py-1 w-[40px]">
                                            <span className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-blue-800 dark:text-blue-200">
                                                Tổng
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[100px] ">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300 text-center">
                                                {formatNumber(totals.du_no00)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[100px]">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300  text-center">
                                                {formatNumber(totals.du_co00)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[100px]">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300  text-center">
                                                {formatNumber(totals.du_no1)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[100px]">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300  text-center">
                                                {formatNumber(totals.du_co1)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[100px]">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300  text-center">
                                                {formatNumber(totals.du_no_nt00)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[100px]">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300  text-center">
                                                {formatNumber(totals.du_co_nt00)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[120px]">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300  text-center">
                                                {formatNumber(totals.du_no_nt1)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 text-center w-[120px]">
                                            <span className="font-mono text-sm text-blue-700 dark:text-blue-300  text-center">
                                                {formatNumber(totals.du_co_nt1)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-1 w-[100px]"></td> {/* tên tài khoản */}
                                        <td className="px-2 py-1 w-[120px]"></td> {/* ngày cập nhật */}
                                        <td className="px-2 py-1 w-[100px]"></td> {/* thao tác */}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SoDuDauKyTable;