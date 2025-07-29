import "flatpickr/dist/flatpickr.min.css";
import { FilePlus, Search, Pencil, Trash, Printer } from "lucide-react";
import { useRef, forwardRef } from "react";
import { useReactToPrint } from "react-to-print";

import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Pagination from "../../../components/pagination/Pagination";
import TableBasic from "../../../components/tables/BasicTables/BasicTableOne";
import Button from "../../../components/ui/button/Button";

import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ui/modal/ConfirmModal";
import { ModalCreateCashReceipt } from "./CashReceiptCreate";
import { ModalEditCashReceipt } from "./CashReceipUpdate";
import { useListCashReceipt } from "./useListCashReceipt";
import toWords from 'vn-num2words';


// Component nội dung in được tách riêng - Format nửa tờ A4
const PrintContent = forwardRef(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[210mm] h-[148.5mm] p-3 text-sm text-black bg-white"
            style={{ fontFamily: 'Times New Roman, serif' }}
        >
            {/* Header với thông tin tổ chức và mã số thuế */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                    <div className="text-xs leading-tight">Công ty công nghệ Gentech</div>
                    <div className="text-xs leading-tight">Tầng 02, chung cư CT3 Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội</div>
                </div>
                <div className="text-center text-xs w-48">
                    <div className="font-bold">Mã số thuế: {data?.MST || ""}</div>
                    <div className="font-bold">Mẫu số: 01-TT</div>
                    <div className="text-[10px]">
                        (Ban hành theo Thông tư số 133/2016/TT-BTC<br />
                        ngày 26/8/2016 của Bộ Tài chính)
                    </div>
                </div>
            </div>

            {/* Tiêu đề phiếu thu và thông tin kế toán */}
            <div className="flex justify-between items-start mb-4">
                {/* Khoảng trống bên trái */}
                <div className="w-48"></div>

                {/* Tiêu đề phiếu thu ở giữa */}
                <div className="flex-1 text-center">
                    <h2 className="font-bold text-xl mb-2">PHIẾU THU</h2>
                    <div className="text-center text-sm mb-4">
                        NGÀY {formatDateVN(data?.ngay_ct || data?.ngay_lct || new Date("2025-05-30"))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-x-4 text-xs" style={{ gridTemplateRows: 'repeat(5, 1fr)' }}>
                    {/* Cột 1: Label */}
                    <div className="text-left font-medium" style={{ gridColumn: 1, gridRow: 1 }}>Liên số:</div>
                    <div className="text-left font-medium" style={{ gridColumn: 1, gridRow: 2 }}>Quyển số:</div>
                    <div className="text-left font-medium" style={{ gridColumn: 1, gridRow: 3 }}>Số phiếu:</div>
                    <div className="text-left font-medium" style={{ gridColumn: 1, gridRow: 4 }}>Nợ:</div>
                    <div className="text-left font-medium" style={{ gridColumn: 1, gridRow: 5 }}>Có:</div>

                    {/* Cột 2: Giá trị dữ liệu */}
                    <div style={{ gridColumn: 2, gridRow: 1 }}>{data?.lien_so || "1"}</div>
                    <div style={{ gridColumn: 2, gridRow: 2 }}>{data?.ma_qs || "PT001"}</div>
                    <div style={{ gridColumn: 2, gridRow: 3 }}>{data?.so_ct || "PT0008"}</div>
                    <div style={{ gridColumn: 2, gridRow: 4 }}>{data?.tk}</div>
                    <div style={{ gridColumn: 2, gridRow: 5 }}>{data?.tai_khoan_list?.[0]?.tk_so}</div>

                    {/* Cột 3: Số tiền - chỉ ở dòng 4 và 5 */}
                    <div className="text-right" style={{ gridColumn: 3, gridRow: 4 }}>{data?.tong_tien?.toLocaleString('vi-VN')}</div>
                    <div className="text-right" style={{ gridColumn: 3, gridRow: 5 }}>{data?.tai_khoan_list?.[0]?.ps_co?.toLocaleString('vi-VN')}</div>
                </div>


            </div>

            {/* Thông tin chính - nằm hoàn toàn bên trái và sát với phiếu thu */}
            <div className="mb-3">
                <div className="w-96 space-y-1">
                    <div className="flex items-baseline">
                        <span className="text-xs font-medium w-32 flex-shrink-0">Họ, tên người nộp tiền:</span>
                        <span className="flex-1 text-xs ml-2">{data?.ong_ba || ""}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-xs font-medium w-32 flex-shrink-0">Đơn vị:</span>
                        <span className="flex-1 text-xs ml-2">{data?.don_vi || data?.ma_kh || ""}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-xs font-medium w-32 flex-shrink-0">Địa chỉ:</span>
                        <span className="flex-1 text-xs ml-2">{data?.dia_chi || ""}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-xs font-medium w-32 flex-shrink-0">Lý do nộp:</span>
                        <span className="flex-1 text-xs ml-2">{data?.dien_giai || ""}</span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-xs font-medium w-32 flex-shrink-0">Số tiền:</span>
                        <span className="flex-1 text-xs ml-2 font-bold">
                            {`${data.tong_tien?.toLocaleString('vi-VN')} VND`}
                        </span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-xs font-medium w-32 flex-shrink-0">Bằng chữ:</span>
                        <span className="flex-1 text-xs ml-2">
                            {data?.tong_tien ? `${capitalizeFirstLetter(toWords(data.tong_tien))} đồng` : ""}
                        </span>
                    </div>
                    <div className="flex items-baseline">
                        <span className="text-xs font-medium w-32 flex-shrink-0">Kèm theo:</span>
                        <span className="flex-1 text-xs ml-2"></span>
                    </div>
                </div>
            </div>

            {/* Phần ngày ký ở góc phải */}
            <div className="text-right mb-4 text-xs">
                Ngày.....tháng.....năm.........
            </div>

            {/* Phần ký tên - 5 cột - center */}
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-5 text-center text-[10px] gap-x-1 mb-8">
                    <div>
                        <div className="font-bold">CHỦ TÀI KHOẢN</div>
                        <div>(Ký, họ tên, đóng dấu)</div>
                    </div>
                    <div>
                        <div className="font-bold">PHỤ TRÁCH KẾ TOÁN</div>
                        <div>(Ký, họ tên)</div>
                    </div>
                    <div>
                        <div className="font-bold">NGƯỜI NỘP TIỀN</div>
                        <div>(Ký, họ tên)</div>
                    </div>
                    <div>
                        <div className="font-bold">NGƯỜI LẬP PHIẾU</div>
                        <div>(Ký, họ tên)</div>
                    </div>
                    <div>
                        <div className="font-bold">THỦ QUỸ</div>
                        <div>(Ký, họ tên)</div>
                    </div>
                </div>

                {/* Chữ ký - Hiển thị tên từ data */}
                <div className="grid grid-cols-5 text-center text-xs mb-6">
                    <div></div>
                    <div></div>
                </div>
            </div>

            {/* Phần cuối - đã nhận đủ số tiền - center */}
            <div className="text-xs w-full">
                <div className="flex items-start mb-2 w-full">
                    <span className="font-bold whitespace-nowrap mr-2">
                        Đã nhận đủ số tiền (viết bằng chữ):
                    </span>
                    <div className="border-b border-dashed border-black flex-1 min-h-[16px]">
                        {data?.so_tien_bang_chu || ""}
                    </div>
                </div>
                <div className="min-h-[16px]"></div>
            </div>
        </div>
    );
});
const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const formatDateVN = (dateInput) => {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day} THÁNG ${month} NĂM ${year}`;
};
export default function CashReceiptList() {
    const {
        isOpenCreate,
        isOpenEdit,
        selectedCashReceipt,
        dataTable,
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
        confirmDeleteCashReceipt,
        cancelDeleteCashReceipt,
        setConfirmDelete,
        setSelectedCashReceipt,
        openModalEdit,
    } = useListCashReceipt();

    const [searchInput, setSearchInput] = useState(searchValue);
    const [selectedRowForDetail, setSelectedRowForDetail] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    // Ref cho component in
    const printRef = useRef();
    const [printData, setPrintData] = useState(null);

    // Thiết lập react-to-print
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Phiếu_thu_${printData?.so_ct || 'PT001'}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 0.5in;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                    margin: 0;
                    padding: 0;
                }
            }
        `,
        onAfterPrint: () => {
            console.log('Print completed');
        },
        onPrintError: (errorLocation, error) => {
            console.error('Print error:', errorLocation, error);
        }
    });

    // Function để xử lý in phiếu thu
    const handlePrintCashReceipt = (record) => {
        console.log('Print data being set:', record);
        setPrintData(record);
        // Delay để đảm bảo data được set và component được render
        setTimeout(() => {
            if (printRef.current) {
                console.log('Print ref found, starting print...');
                handlePrint();
            } else {
                console.error('Print ref not found!');
            }
        }, 200);
    };

    const handleEditCashReceipt = (record) => {
        setSelectedCashReceipt(record);
        openModalEdit();
    };

    const handleDeleteCashReceipt = (record) => {
        setConfirmDelete({
            open: true,
            cashReceipt: record,
        });
    };

    // Định nghĩa columns với actions
    const columnsTable = [
        {
            key: "so_ct",
            title: "Số phiếu thu",
            fixed: "left",
            width: 100,
        },
        {
            key: "ong_ba",
            title: "Đối tác",
            fixed: "left",
            width: 150,
        },
        {
            key: "ngay_lct",
            title: "Ngày lập phiếu thu",
            width: 150,
        },
        {
            key: "ngay_ct",
            title: "Ngày hạch toán",
            width: 150,
        },
        {
            key: "tk",
            title: "Tài khoản nợ",
            width: 150,
        },
        {
            key: "ma_gd",
            title: "Loại phiếu thu",
            width: 100,
        },
        {
            key: "ma_kh",
            title: "Mã khách",
            width: 150,
        },
        {
            key: "dia_chi",
            title: "Địa chỉ",
            width: 250,
        },
        {
            key: "dien_giai",
            title: "Lý do nộp",
            width: 200,
        },
        {
            key: "ma_qs",
            title: "Quyển số",
            width: 100,
        },
        {
            key: "loai_ct",
            title: "Trạng thái",
            width: 100,
        },
        {
            key: "MST",
            title: "MST",
            width: 80,
        },
        {
            key: "ma_nt",
            title: "TGGD(Tỷ giá giao dịch)",
            width: 50,
        },
        {
            key: "ty_gia",
            title: "Mức tỷ giá giao dịch",
            width: 50,
        },
        {
            key: "action",
            title: "Thao tác",
            fixed: "right",
            width: 120,
            render: (_, record) => (
                <div className="flex items-center gap-3 justify-center">
                    <button
                        className="text-gray-500 hover:text-amber-500"
                        title="In"
                        onClick={() => handlePrintCashReceipt(record)}
                    >
                        <Printer size={18} />
                    </button>
                    <button
                        className="text-gray-500 hover:text-amber-500"
                        title="Sửa"
                        onClick={() => handleEditCashReceipt(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteCashReceipt(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                    >
                        <Trash size={18} />
                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Xử lý chọn row để hiển thị detail với debug logs
    const handleRowSelect = (cashReceipt) => {
        console.log('🚀 handleRowSelect called with:', cashReceipt);
        if (cashReceipt) {
            setSelectedRowForDetail(cashReceipt);
            setShowDetailPanel(true);
            console.log('🚀 Row selected successfully');
        } else {
            console.log('❌ cashReceipt is null/undefined');
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
            <PageMeta title="Phiếu thu tiền mặt" description="Phiếu thu tiền mặt" />
            <PageBreadcrumb pageTitle="Phiếu thu tiền mặt" />

            {/* Hidden print component - đảm bảo luôn có nội dung */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {printData && <PrintContent ref={printRef} data={printData} />}
            </div>

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

                    {/* Table */}
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

                {/* Detail Panel */}
                {selectedRowForDetail && showDetailPanel && (
                    <div className="mt-8 mb-20 pb-8">
                        <ComponentCard>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-start border-gray-200 dark:border-gray-700 pb-4 space-y-1">
                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                Hạch toán
                                            </h4>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                                                {selectedRowForDetail.tai_khoan_list?.length || 0} mục
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

                                    {selectedRowForDetail.tai_khoan_list && selectedRowForDetail.tai_khoan_list.length > 0 ? (
                                        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                            <table className="w-full border-collapse">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                                    <tr>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">STT</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">TK số</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên tài khoản</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Phát sinh có</th>
                                                        <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Diễn giải</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {selectedRowForDetail.tai_khoan_list.map((item, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                                {item.tk_so || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                                {item.ten_tai_khoan || 'N/A'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                                                                {item.ps_co ? item.ps_co.toLocaleString() : '0'}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                                {item.dien_giai || 'N/A'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                    <tr>
                                                        <td colSpan="4" className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right border-t border-gray-200 dark:border-gray-600">
                                                            Tổng tiền:
                                                        </td>
                                                        <td className="px-4 py-4 text-lg font-bold text-green-600 dark:text-green-400 text-right border-t border-gray-200 dark:border-gray-600">
                                                            {selectedRowForDetail.tai_khoan_list
                                                                .reduce((total, item) => total + (item.ps_co || 0), 0)
                                                                .toLocaleString()
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
                <ModalCreateCashReceipt
                    isOpenCreate={isOpenCreate}
                    closeModalCreate={closeModalCreate}
                    onSaveCreate={handleSaveCreate}
                />
                <ModalEditCashReceipt
                    isOpenEdit={isOpenEdit}
                    closeModalEdit={closeModalEdit}
                    onSaveEdit={handleSaveEdit}
                    selectedCashReceipt={selectedCashReceipt}
                />

                <ConfirmModal
                    isOpen={confirmDelete.open}
                    title="Xác nhận xoá"
                    message={`Bạn có chắc chắn muốn xoá phiếu "${confirmDelete.cashReceipt?.so_ct}" không?`}
                    onConfirm={confirmDeleteCashReceipt}
                    onCancel={cancelDeleteCashReceipt}
                />
            </div>
        </div>
    );
}