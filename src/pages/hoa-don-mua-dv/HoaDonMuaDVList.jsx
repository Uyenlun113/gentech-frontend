import "flatpickr/dist/flatpickr.min.css";

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/pagination/Pagination";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import Button from "../../components/ui/button/Button";

import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { ModalCreateHoaDonMuaDV } from "./HoaDonMuaDVCreate";
import { ModalEditHoaDonMuaDV } from "./HoaDonMuaDVUpdate";
import { useListHoaDonMuaDV } from "./useListHoaDonMuaDV";
import toWords from 'vn-num2words';
import { FilePlus, Search, Pencil, Trash, Printer } from "lucide-react";
import { useRef, forwardRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router";

const PrintContent = forwardRef(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[210mm] h-[297mm] p-4 text-sm text-black bg-white"
            style={{ fontFamily: "Times New Roman, serif" }}
        >
            {/* Header với thông tin phần mềm */}
            <div className="text-xs text-left mb-4">
                <div className="text-xs leading-tight">Công ty công nghệ Gentech</div>
                <div className="text-xs leading-tight">Tầng 02, chung cư CT3 Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội</div>
            </div>

            {/* Tiêu đề và số hóa đơn */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1"></div>
                <div className="text-center flex-1">
                    <h1 className="font-bold text-xl mb-2">HÓA ĐƠN MUA DỊCH VỤ</h1>
                    <div className="text-sm">NGÀY {formatDateVN(data?.ngay_ct || new Date())}</div>
                </div>
                <div className="flex-1 text-right">
                    <div className="text-sm font-medium">Số: {data?.so_ct || "DV0001"}</div>
                </div>
            </div>

            {/* Thông tin người bán và đơn vị */}
            <div className="mb-4 space-y-1 text-xs">
                <div className="flex">
                    <span className="font-medium w-40">Họ tên người bán hàng:</span>
                    <span>{data?.ong_ba}</span>
                </div>
                <div className="flex">
                    <span className="font-medium w-40">Đơn vị:</span>
                    <span>{data?.ma_kh}</span>
                </div>
                <div className="flex">
                    <span className="font-medium w-40">Địa chỉ:</span>
                    <span>{data?.dia_chi}</span>
                </div>
                <div className="flex">
                    <span className="font-medium w-40">Tk có:</span>
                    <span>{data?.ma_nx}</span>
                </div>
            </div>

            {/* Bảng dịch vụ */}
            <div className="mb-4">
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-green-50">
                            <th className="border border-black p-2 text-center">NỘI DUNG</th>
                            <th className="border border-black p-2 w-24 text-center">TK NỢ</th>
                            <th className="border border-black p-2 w-32 text-center">TIỀN HÀNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dòng dữ liệu từ danh sách dịch vụ */}
                        {data?.hachToanList?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-2">{item?.dien_giaii || `đây là địa chỉ gì ${index + 1}`}</td>
                                <td className="border border-black p-2 text-center">{item?.tk_vt}</td>
                                <td className="border border-black p-2 text-right">
                                    {item?.tien?.toLocaleString("vi-VN")}
                                </td>
                            </tr>
                        ))}

                        {/* Các dòng trống */}
                        {Array.from({ length: Math.max(0, 8 - (data?.hachToanList?.length || 2)) }, (_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-2 py-4"></td>
                                <td className="border border-black p-2 py-4"></td>
                                <td className="border border-black p-2 py-4"></td>
                            </tr>
                        ))}

                        {/* Các dòng tổng kết */}
                        <tr>
                            <td colSpan="2" className="border border-black p-2 text-right font-medium">
                                CỘNG TIỀN HÀNG:
                            </td>
                            <td className="border border-black p-2 text-right">
                                {data?.t_tien?.toLocaleString("vi-VN")}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black p-2 text-right font-medium">
                                TIỀN THUẾ GTGT:
                            </td>
                            <td className="border border-black p-2 text-right">
                                {data?.t_thue?.toLocaleString("vi-VN")}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="border border-black p-2 text-right font-bold">
                                TỔNG TIỀN THANH TOÁN:
                            </td>
                            <td className="border border-black p-2 text-right font-bold">
                                {data?.t_tt?.toLocaleString("vi-VN")}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ghi chú số tiền bằng chữ */}
            <div className="text-xs mb-8 italic text-right">
                {data?.t_tt ? `Số tiền (viết bằng chữ): ${capitalizeFirstLetter(toWords(data.t_tt))} đồng` : ""}
            </div>

            {/* Phần ký tên */}
            <div className="grid grid-cols-3 text-center text-xs gap-8 min-h-[120px]">
                <div>
                    <div className="font-bold mb-1">NGƯỜI BÁN HÀNG</div>
                    <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                </div>
                <div>
                    <div className="font-bold mb-1">KẾ TOÁN TRƯỞNG</div>
                    <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                </div>
                <div>
                    <div className="font-bold mb-1">GIÁM ĐỐC</div>
                    <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                </div>
            </div>
        </div>
    )
})
const formatDateVN = (dateInput) => {
    const date = new Date(dateInput)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day} THÁNG ${month} NĂM ${year}`
}

const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export default function HoaDonMuaDVList() {
    const {
        isOpenCreate,
        isOpenEdit,
        selectedHoaDonMuaDV,
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
        confirmDeleteHoaDonMuaDV,
        cancelDeleteHoaDonMuaDV,
        handleDeleteHoaDonMuaDV,
        handleEditHoaDonMuaDV,
        isDeleting,
    } = useListHoaDonMuaDV();

    const [searchInput, setSearchInput] = useState(searchValue);
    const [selectedRowForDetail, setSelectedRowForDetail] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);
    const printRef = useRef();
    const [printData, setPrintData] = useState(null);
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchInput);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Xử lý chọn row để hiển thị detail với debug logs
    const handleRowSelect = (cashReceipt) => {
        if (cashReceipt) {
            setSelectedRowForDetail(cashReceipt);
            setShowDetailPanel(true);
        } else {
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

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Hóa_đơn_mua_dịch_vụ_${printData?.so_ct}`,
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
        },
        onPrintError: (errorLocation, error) => {
            console.error('Print error:', errorLocation, error);
        }
    });


    // Function để xử lý in phiếu thu
    const handlePrintFun = (record) => {
        setPrintData(record);
        // Delay để đảm bảo data được set và component được render
        setTimeout(() => {
            if (printRef.current) {
                handlePrint();
            } else {
                console.error('Print ref not found!');
            }
        }, 200);
    };
    const columnsTable = [
        {
            key: "ngay_ct",
            title: "Ngày chứng từ",
            fixed: "left",
            width: 150,
        },
        {
            key: "so_ct",
            title: "Số phiếu thu",
            fixed: "left",
            width: 100,
        },
        {
            key: "ma_kh",
            title: "Mã khách",
            width: 150,
        },
        {
            key: "ten_kh",
            title: "Tên khách hàng",
            width: 150,
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
            width: 200,
        },
        {
            key: "ma_nx",
            title: "Mã nx",
            width: 150,
        },
        // {
        //     key: "tk_thue_no",
        //     title: "TK Thuế",
        //     width: 100,
        // },
        {
            key: "t_tien",
            title: "Tiền hàng VNĐ",
            width: 250,
        },
        {
            key: "t_thue",
            title: "Tiền thuế VNĐ",
            width: 100,
        },
        {
            key: "t_tt",
            title: "Tổng tiền tt VNĐ",
            width: 100,
        },
        {
            key: "ma_nt",
            title: "Mã ngoại tệ",
            width: 80,
        },
        {
            key: "ty_gia",
            title: "Tỷ giá",
            width: 50,
        },
        {
            key: "date",
            title: "Ngày cập nhật",
            width: 100,
        },
        {
            key: "time",
            title: "Giờ cập nhật",
            width: 100,
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
                        onClick={() => handlePrintFun(record)}
                    >
                        <Printer size={18} />
                    </button>
                    <button
                        className="text-gray-500 hover:text-amber-500"
                        title="Sửa"
                        onClick={() => handleEditHoaDonMuaDV(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteHoaDonMuaDV(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={isDeleting}
                    >
                        <Trash size={18} />
                    </button>
                </div>
            ),
        },
    ];
    return (
        <div className="px-4">
            <PageMeta title="Hoá đơn mua Dịch vụ" description="Hoá đơn mua Dịch vụ" />
            <PageBreadcrumb pageTitle="Hoá đơn mua Dịch vụ" />
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {printData && <PrintContent ref={printRef} data={printData} />}
            </div>
            <div className="space-y-6 ">
                <ComponentCard>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left: Button */}
                        <div className="flex items-center gap-2">
                            <Link
                                to="/sales"
                                className="flex items-center border border-gray-300 px-2 py-1.5 text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                                Quay lại
                            </Link>
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
                                    // Tìm row gần nhất
                                    let element = e.target;
                                    while (element && element.tagName !== 'TR') {
                                        element = element.parentElement;
                                        if (!element || element.tagName === 'TABLE') break;
                                    }

                                    if (element && element.tagName === 'TR') {
                                        // Lấy index từ data attribute hoặc position
                                        const rowIndex = Array.from(element.parentElement.children).indexOf(element);

                                        if (rowIndex >= 0 && rowIndex < dataTable.length) {
                                            const rowData = dataTable[rowIndex];
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
                    {selectedRowForDetail && (
                        <div className="space-y-6">
                            <div className="space-y-4">

                                {selectedRowForDetail.hachToanList && selectedRowForDetail.hachToanList.length > 0 ? (
                                    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                        <table className="w-full border-collapse">
                                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                                <tr>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">STT</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">TK nợ</th>
                                                    {/* <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">TK mẹ</th> */}
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tên tài khoản</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tiền VNĐ</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Diễn giải</th>
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
                                                            {item.ten_tai_khoan || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                                                            {item.tien || '0'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                            {item.dien_giaii || 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                <tr>
                                                    <td colSpan="3" className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right border-t border-gray-200 dark:border-gray-600">
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
                    )}
                </ComponentCard>

                {/* Detail Panel với spacing đẹp hơn và cách đáy xa hơn */}


                {/* Modals */}
                <ModalCreateHoaDonMuaDV
                    isOpenCreate={isOpenCreate}
                    closeModalCreate={closeModalCreate}
                    onSaveCreate={handleSaveCreate}
                />
                <ModalEditHoaDonMuaDV
                    isOpenEdit={isOpenEdit}
                    closeModalEdit={closeModalEdit}
                    onSaveEdit={handleSaveEdit}
                    selectedHoaDonMuaDV={selectedHoaDonMuaDV}
                />

                <ConfirmModal
                    isOpen={confirmDelete.open}
                    title="Xác nhận xoá"
                    message={`Bạn có chắc chắn muốn xoá phiếu "${confirmDelete.cashReceipt?.so_ct}" không?`}
                    onConfirm={confirmDeleteHoaDonMuaDV}
                    onCancel={cancelDeleteHoaDonMuaDV}
                />
            </div>
        </div>
    );
}