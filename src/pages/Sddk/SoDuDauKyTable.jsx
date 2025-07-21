import { format } from 'date-fns';
import { Edit2, Save, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

import { useAccounts } from '../../hooks/useAccounts';
import { useFindCdtkByTkAndYear, useListCdtk, useUpdateCdtk } from '../../hooks/useCdtk';

const SoDuDauKyTable = () => {
    const [searchParams] = useSearchParams();
    const [editingRow, setEditingRow] = useState(null);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const yearFromUrl = searchParams.get('nam');
    const [selectedYear, setSelectedYear] = useState(
        yearFromUrl ? parseInt(yearFromUrl) : new Date().getFullYear()
    );

    const { data: cdtkData, isLoading, error } = useListCdtk(selectedYear);
    const { data: accounts } = useAccounts();
    const accountsData = accounts?.data;
    const { data: selectedAccountDetail } = useFindCdtkByTkAndYear(selectedAccount.trim(), selectedYear);
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
                    du_co_nt1: parseFloat(editData.du_co_nt1) || 0,
                },
            });
            setEditingRow(null);
            setEditData({});
        } catch (err) {
            console.error('Lỗi khi lưu:', err);
        }
    };

    const handleCancel = () => {
        setEditingRow(null);
        setEditData({});
    };

    const handleInputChange = (field, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value === '' ? '' : parseFloat(value) || 0,
        }));
    };

    const formatNumber = (num) => new Intl.NumberFormat('vi-VN').format(num || 0);

    const getAccountName = (row) =>
        row.account?.ten_tk || row.account?.name || `Tài khoản ${row.tk}`;

    const calculateTotals = () => {
        if (!cdtkData?.length) return {};
        return {
            du_no00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no00) || 0), 0),
            du_co00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co00) || 0), 0),
            du_no1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no1) || 0), 0),
            du_co1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co1) || 0), 0),
            du_no_nt00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no_nt00) || 0), 0),
            du_co_nt00: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co_nt00) || 0), 0),
            du_no_nt1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_no_nt1) || 0), 0),
            du_co_nt1: cdtkData.reduce((sum, row) => sum + (parseFloat(row.du_co_nt1) || 0), 0),
        };
    };

    const handleShowModal = () => {
        setShowModal(true);
        setSelectedAccount('');
        setSearchTerm('');
    };

    const handleAccountSelect = () => {
        if (selectedAccount) {
            setShowModal(false);
            setShowDetailModal(true);
        }
    };

    const filteredAccounts = accountsData?.filter((account) =>
        account.tk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.ten_tk?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const accountOptions = cdtkData?.map((row) => ({
        tk: row.tk,
        ten_tk: getAccountName(row),
    })) || [];

    const totals = calculateTotals();

    if (isLoading) {
        return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">Lỗi khi tải dữ liệu: {error.message}</div>;
    }

    console.log('cdtkData:', selectedAccountDetail);
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
                        onClick={handleShowModal}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Tính tổng
                    </button>
                </div>
            </div>

            {/* Table Container */}
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
                                        <td className="px-2 py-1 w-[100px]"></td>
                                        <td className="px-2 py-1 w-[120px]"></td>
                                        <td className="px-2 py-1 w-[100px]"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Selection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Tính tổng
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tài khoản
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Tài khoản, Tên tài khoản"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Account List */}
                        <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md">
                            {(filteredAccounts.length > 0 ? filteredAccounts : accountOptions)
                                .filter(account =>
                                    account.tk?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    account.ten_tk?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((account) => (
                                    <div
                                        key={account.tk}
                                        onClick={() => setSelectedAccount(account.tk)}
                                        className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600 last:border-b-0 
                                        ${selectedAccount === account.tk ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="account"
                                                value={account.tk}
                                                checked={selectedAccount === account.tk}
                                                onChange={() => setSelectedAccount(account.tk)}
                                                className="mr-3 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {account.tk}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {account.ten_tk}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleAccountSelect}
                                disabled={!selectedAccount}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedAccountDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-100 max-w-lg mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Tổng số
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-0">
                            {/* Header row */}
                            <div className="grid grid-cols-3 border-b border-gray-300 dark:border-gray-600 pb-2 mb-2">
                                <div></div>
                                <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tiền VNĐ
                                </div>
                                <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tiền n.tệ
                                </div>
                            </div>

                            {/* Data rows */}
                            <div className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-600">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    Dư nợ ban đầu
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_no00 || '0'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_no1 || '0'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-600">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    Dư có ban đầu
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_co00 || '0'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_co1 || '0,00'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-600">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    Dư nợ đầu năm tài chính
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_no_nt00 || '0'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_no_nt1 || '0'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 py-2 border-b border-gray-200 dark:border-gray-600">
                                <div className="text-sm text-gray-900 dark:text-white">
                                    Dư có đầu năm tài chính
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_co_nt00 || '0'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div className="text-center">
                                    <input
                                        type="text"
                                        value={selectedAccountDetail?.du_co_nt1 || '0'}
                                        readOnly
                                        className="w-full text-center border-0 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default SoDuDauKyTable;