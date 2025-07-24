import "flatpickr/dist/flatpickr.min.css";
import { FilePlus, Search } from "lucide-react";

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/pagination/Pagination";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import Button from "../../components/ui/button/Button";

import { useEffect, useState, useCallback } from "react";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { ModalCreateDonHangMua } from "./DonHangMuaCreate";
import { ModalEditDonHangMua } from "./DonHangMuaUpdate";
import { useListDonHangMua } from "./useListDonHangMua";
import dmvtService from "../../services/dmvt";

export default function DonHangMuaList() {
    const {
        isOpenCreate,
        isOpenEdit,
        selectedDonHangMua,
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
        confirmDeleteDonHangMua,
        cancelDeleteDonHangMua,
    } = useListDonHangMua();

    const [searchInput, setSearchInput] = useState(searchValue);
    const [selectedRowForDetail, setSelectedRowForDetail] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);
    const [isLoadingMaterialNames, setIsLoadingMaterialNames] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Hook để lấy tên vật tư cho từng dòng hàng hóa
    const fetchMaterialNames = useCallback(async (hangHoaArray) => {
        if (!hangHoaArray || hangHoaArray.length === 0) return hangHoaArray;

        setIsLoadingMaterialNames(true);

        try {
            const promises = hangHoaArray.map(async (item) => {
                if (item.ma_vt && !item.ten_vt) {
                    try {
                        console.log(`🔍 Fetching material for ${item.ma_vt}`);
                        const materialData = await dmvtService.getDmvtById(item.ma_vt);
                        console.log(`✅ Fetched material data:`, materialData);
                        return {
                            ...item,
                            ten_vt: materialData?.ten_vt || materialData?.name || ""
                        };
                    } catch (error) {
                        console.warn(`❌ Cannot fetch material name for ${item.ma_vt}:`, error);
                        return item;
                    }
                }
                return item;
            });

            const updatedList = await Promise.all(promises);
            console.log(`✅ Updated ${updatedList.length} material names`);
            return updatedList;
        } catch (error) {
            console.error('❌ Error fetching material names:', error);
            return hangHoaArray;
        } finally {
            setIsLoadingMaterialNames(false);
        }
    }, []);

    // Xử lý chọn row để hiển thị detail với debug logs
    const handleRowSelect = useCallback(async (cashReceipt) => {
        console.log('🚀 handleRowSelect called with:', cashReceipt);
        if (cashReceipt) {
            // Set data ngay lập tức để hiển thị UI
            setSelectedRowForDetail(cashReceipt);
            setShowDetailPanel(true);
            console.log('🚀 Row selected successfully');

            // Fetch tên vật tư trong background
            if (cashReceipt.hang_hoa_list && cashReceipt.hang_hoa_list.length > 0) {
                const updatedHangHoaList = await fetchMaterialNames(cashReceipt.hang_hoa_list);

                // Update lại selectedRowForDetail với tên vật tư đã fetch
                setSelectedRowForDetail(prev => ({
                    ...prev,
                    hang_hoa_list: updatedHangHoaList
                }));
            }
        } else {
            console.log('❌ cashReceipt is null/undefined');
        }
    }, [fetchMaterialNames]);

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
            <PageMeta title="Đơn hàng nội địa" description="Đơn hàng nội địa" />
            <PageBreadcrumb pageTitle="Đơn hàng nội địa" />
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
                                    console.log('🔍 Table clicked, target:', e.target.tagName);

                                    // Tìm row gần nhất
                                    let element = e.target;
                                    while (element && element.tagName !== 'TR') {
                                        element = element.parentElement;
                                        if (!element || element.tagName === 'TABLE') break;
                                    }

                                    if (element && element.tagName === 'TR') {
                                        // Lấy index từ data attribute hoặc position
                                        const rowIndex = Array.from(element.parentElement.children).indexOf(element);
                                        console.log('🔍 Row index found:', rowIndex);
                                        console.log('🔍 Data table length:', dataTable.length);

                                        if (rowIndex >= 0 && rowIndex < dataTable.length) {
                                            const rowData = dataTable[rowIndex];
                                            console.log('🔍 Row data:', rowData);
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
                                {/* Danh sách hàng hóa */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-start border-gray-200 dark:border-gray-700 pb-4 space-y-1">
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                Hàng hóa
                                                {isLoadingMaterialNames && (
                                                    <span className="ml-2 inline-flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                                        <span className="ml-1 text-sm text-blue-500">Đang tải tên vật tư...</span>
                                                    </span>
                                                )}
                                            </h4>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                {selectedRowForDetail.hang_hoa_list?.length || 0} mục
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

                                    {selectedRowForDetail.hang_hoa_list && selectedRowForDetail.hang_hoa_list.length > 0 ? (
                                        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <table className="w-full border-collapse">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                                    <tr>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">STT</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mã vật tư</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên vật tư</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">ĐVT</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mã kho</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Số lượng</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Giá gốc n.tệ</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tiền cp n.tệ</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Giá n.tệ</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tiền n.tệ</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">TK vật tư</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Giá gốc VNĐ</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tiền cp VNĐ</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Giá VNĐ</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tiền VNĐ</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {selectedRowForDetail.hang_hoa_list.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                                {item.ma_vt || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {isLoadingMaterialNames && !item.ten_vt ? (
                                                                    <div className="flex items-center">
                                                                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-24 rounded"></div>
                                                                        <span className="ml-2 text-xs text-gray-400">Đang tải...</span>
                                                                    </div>
                                                                ) : (
                                                                    item.ten_vt || item.ten_tai_khoan || 'N/A'
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                                                                {item.dvt || item.don_vi_tinh || 'cái'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                                {item.ma_kho_i || item.ma_kho || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                                                {item.so_luong ? parseFloat(item.so_luong).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                                {item.gia_nt0 ? parseFloat(item.gia_nt0).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                                {item.cp_nt ? parseFloat(item.cp_nt).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                                                {item.gia_nt ? parseFloat(item.gia_nt).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                                                {item.tien_nt ? parseFloat(item.tien_nt).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                                {item.tk_vt || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                                {item.gia0 ? parseFloat(item.gia0).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                                {item.cp ? parseFloat(item.cp).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                                                {item.gia ? parseFloat(item.gia).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                                                {item.tien_nt ? parseFloat(item.tien_nt).toLocaleString('vi-VN') : '0'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                    <tr>
                                                        <td colSpan="9" className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right border-t border-gray-200 dark:border-gray-600">
                                                            Tổng tiền n.tệ:
                                                        </td>
                                                        <td className="px-4 py-4 text-lg font-bold text-blue-600 dark:text-blue-400 text-right border-t border-gray-200 dark:border-gray-600">
                                                            {selectedRowForDetail.hang_hoa_list
                                                                .reduce((total, item) => total + (parseFloat(item.tien_nt || item.tien) || 0), 0)
                                                                .toLocaleString('vi-VN')
                                                            }
                                                        </td>
                                                        <td colSpan="4" className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right border-t border-gray-200 dark:border-gray-600">
                                                            Tổng tiền VNĐ:
                                                        </td>
                                                        <td className="px-4 py-4 text-lg font-bold text-green-600 dark:text-green-400 text-right border-t border-gray-200 dark:border-gray-600">
                                                            {selectedRowForDetail.hang_hoa_list
                                                                .reduce((total, item) => total + (parseFloat(item.tien_vnd || item.tien) || 0), 0)
                                                                .toLocaleString('vi-VN')
                                                            } VNĐ
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                            <div className="text-gray-400 dark:text-gray-500 mb-2">
                                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l3-1 3 1v12" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">Không có dữ liệu hàng hóa</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Danh sách hàng hóa trống</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ComponentCard>
                    </div>
                )}

                {/* Modals */}
                <ModalCreateDonHangMua
                    isOpenCreate={isOpenCreate}
                    closeModalCreate={closeModalCreate}
                    onSaveCreate={handleSaveCreate}
                />
                <ModalEditDonHangMua
                    isOpenEdit={isOpenEdit}
                    closeModalEdit={closeModalEdit}
                    onSaveEdit={handleSaveEdit}
                    selectedDonHangMua={selectedDonHangMua}
                />

                <ConfirmModal
                    isOpen={confirmDelete.open}
                    title="Xác nhận xoá"
                    message={`Bạn có chắc chắn muốn xoá phiếu "${confirmDelete.cashReceipt?.so_ct}" không?`}
                    onConfirm={confirmDeleteDonHangMua}
                    onCancel={cancelDeleteDonHangMua}
                />
            </div>
        </div>
    );
}