import "flatpickr/dist/flatpickr.min.css";
import { FilePlus, Search } from "lucide-react";

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/pagination/Pagination";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import Button from "../../components/ui/button/Button";

import { useEffect, useState } from "react";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { ModalCreateHoaDonXuatKho } from "./HoaDonXuatKhoCreate";
import { ModalEditHoaDonXuatKho } from "./HoaDonXuatKhoUpdate";
import { useListHoaDonXuatKho } from "./useListHoaDonXuatKho";

export default function HoaDonXuatKhoList() {
    const {
        isOpenCreate,
        isOpenEdit,
        selectedHoaDonXuatKho,
        dataTable,
        columnsTable,
        pagination,
        searchValue,
        isLoading,
        error,
        openModalCreate,
        closeModalCreate,
        closeModalEdit,
        handleSearch,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,
        confirmDelete,
        confirmDeleteHoaDonXuatKho,
        cancelDeleteHoaDonXuatKho,
    } = useListHoaDonXuatKho();

    const [searchInput, setSearchInput] = useState(searchValue);
    const [selectedRowForDetail, setSelectedRowForDetail] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Xử lý chọn row để hiển thị detail với debug logs
    const handleRowSelect = (cashReceipt) => {
        // console.log('🚀 handleRowSelect called with:', cashReceipt);
        if (cashReceipt) {
            setSelectedRowForDetail(cashReceipt);
            setShowDetailPanel(true);
            // console.log('🚀 Row selected successfully');
        } else {
            // console.log('❌ cashReceipt is null/undefined');
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Có lỗi xảy ra khi tải dữ liệu</p>
                    <p className="text-gray-500 text-sm">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4">
            <PageMeta title="Hóa đơn bán hàng kiêm phiếu xuất kho" description="Hóa đơn bán hàng kiêm phiếu xuất kho" />
            <PageBreadcrumb pageTitle="Hóa đơn bán hàng kiêm phiếu xuất kho" />
            <div className="space-y-6 ">
                <ComponentCard>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left: Button */}
                        <div>
                            <Button onClick={openModalCreate} size="sm" variant="primary" startIcon={<FilePlus className="size-5" />}>
                                Thêm mới
                            </Button>
                        </div>

                        {/* Right: Search */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="w-full sm:max-w-xs relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Search size={18} className="text-gray-500 dark:text-white/50" />
                                </span>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Tìm kiếm..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-32">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-2"></div>
                                <p className="text-gray-500">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    )}

                    {/* Table với event delegation đơn giản */}
                    {!isLoading && (
                        <div className="space-y-4">
                            <div
                                onClick={(e) => {
                                    // console.log('🔍 Table clicked, target:', e.target.tagName);

                                    // Tìm row gần nhất
                                    let element = e.target;
                                    while (element && element.tagName !== 'TR') {
                                        element = element.parentElement;
                                        if (!element || element.tagName === 'TABLE') break;
                                    }

                                    if (element && element.tagName === 'TR') {
                                        // Lấy index từ data attribute hoặc position
                                        const rowIndex = Array.from(element.parentElement.children).indexOf(element);
                                        // console.log('🔍 Row index found:', rowIndex);
                                        // console.log('🔍 Data table length:', dataTable.length);

                                        if (rowIndex >= 0 && rowIndex < dataTable.length) {
                                            const rowData = dataTable[rowIndex];
                                            // console.log('🔍 Row data:', rowData);
                                            handleRowSelect(rowData);
                                        }
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableBasic
                                    data={dataTable}
                                    columns={columnsTable}
                                />
                            </div>
                            <Pagination
                                currentPage={pagination.page}
                                totalItems={pagination.total}
                                totalPages={pagination.totalPages}
                                onPageChange={handleChangePage}
                            />
                        </div>
                    )}
                </ComponentCard>

                {/* Detail Panel với spacing đẹp hơn và cách đáy xa hơn */}
                {selectedRowForDetail && (
                    <div className="mt-8 mb-20 pb-8">
                        <ComponentCard>
                            <div className="space-y-6">
                                {/* Header */}


                                {/* Danh sách tài khoản */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-start border-gray-200 dark:border-gray-700 pb-4 space-y-1">
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                Hạch toán
                                            </h4>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                {selectedRowForDetail.hachToanList?.length || 0} mục
                                            </span>
                                        </div>


                                        <div className="flex items-center justify-between border-gray-200 dark:border-gray-700 pb-4 gap-x-4">

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedRowForDetail(null);
                                                    setShowDetailPanel(false);
                                                }}
                                            >
                                                Đóng
                                            </Button>
                                        </div>
                                    </div>

                                    {selectedRowForDetail.hachToanList && selectedRowForDetail.hachToanList.length > 0 ? (
                                        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <table className="w-full border-collapse">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                                    <tr>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">STT</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mã vật tư</th>
                                                        {/* <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">TK mẹ</th> */}
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên vật tư</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Đvt</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mã kho</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Số lượng</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tk d.thu</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tk kho</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tk giá vốn</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Giá bán</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tiền hàng</th>
                                                        {/* <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Diễn giải</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {selectedRowForDetail.hachToanList.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                                {item.tk_vt || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.ten_vt || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.dvt || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.ma_kho_i || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.so_luong || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.tk_dt || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.tk_vt || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.tk_gv || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                                                                {item.gia || '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                                                                {item.tien || '0'}
                                                            </td>
                                                            {/* <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                {item.dien_giaii || 'N/A'}
                                                            </td> */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                    <tr>
                                                        <td colSpan="10" className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right border-t border-gray-200 dark:border-gray-600">
                                                            Tổng tiền:
                                                        </td>
                                                        <td className="px-4 py-4 text-lg font-bold text-green-600 dark:text-green-400 text-right border-t border-gray-200 dark:border-gray-600">
                                                            {selectedRowForDetail.hachToanList
                                                                .reduce((total, item) => total + (item.tien || 0), 0)
                                                                .toLocaleString()
                                                            } VNĐ
                                                        </td>
                                                        <td className="border-t border-gray-200 dark:border-gray-600"></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                            <div className="text-gray-400 dark:text-gray-500 mb-2">
                                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Không có dữ liệu tài khoản</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Danh sách tài khoản trống</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ComponentCard>
                    </div>
                )}

                {/* Modals */}
                <ModalCreateHoaDonXuatKho
                    isOpenCreate={isOpenCreate}
                    closeModalCreate={closeModalCreate}
                    onSaveCreate={handleSaveCreate}
                />
                <ModalEditHoaDonXuatKho
                    isOpenEdit={isOpenEdit}
                    closeModalEdit={closeModalEdit}
                    onSaveEdit={handleSaveEdit}
                    selectedHoaDonXuatKho={selectedHoaDonXuatKho}
                />

                <ConfirmModal
                    isOpen={confirmDelete.open}
                    title="Xác nhận xoá"
                    message={`Bạn có chắc chắn muốn xoá phiếu "${confirmDelete.cashReceipt?.so_ct}" không?`}
                    onConfirm={confirmDeleteHoaDonXuatKho}
                    onCancel={cancelDeleteHoaDonXuatKho}
                />
            </div>
        </div>
    );
}