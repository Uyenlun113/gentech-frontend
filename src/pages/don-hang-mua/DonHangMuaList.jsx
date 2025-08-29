import "flatpickr/dist/flatpickr.min.css";

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
import toWords from 'vn-num2words';
import { FilePlus, Search, Pencil, Trash, Printer } from "lucide-react";
import { useRef, forwardRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router";

// Component nội dung in được tách riêng - Format nửa tờ A4
const PrintContent = forwardRef(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[210mm] h-[297mm] p-4 text-sm text-black bg-white"
            style={{ fontFamily: "Times New Roman, serif" }}
        >
            {/* Header với thông tin phần mềm */}
            <div className="text-xs text-left mb-2">
                <div className="text-xs leading-tight">Công ty công nghệ Gentech</div>
                <div className="text-xs leading-tight">Tầng 02, chung cư CT3 Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội</div>
            </div>

            {/* Tiêu đề và số đơn hàng */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1"></div>
                <div className="text-center flex-1">
                    <h1 className="font-bold text-xl mb-2">ĐƠN HÀNG MUA</h1>
                    <div className="text-sm">NGÀY {formatDateVN(data?.ngay_ct || new Date())}</div>
                </div>
                <div className="flex-1 text-right">
                    <div className="text-sm font-medium">Số: {data?.so_ct}</div>
                </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="mb-4 space-y-1">
                <div className="flex">
                    <span className="font-medium flex-none w-32 whitespace-nowrap">
                        Người giao hàng:
                    </span>
                    <span className="flex-1 pb-0.5">{data?.ong_ba || ""}</span>
                </div>
                <div className="flex">
                    <span className="font-medium flex-none w-32 whitespace-nowrap">
                        Đơn vị:
                    </span>
                    <span className="flex-1 pb-0.5">{data?.ma_kh}</span>
                </div>
                <div className="flex">
                    <span className="font-medium flex-none w-32 whitespace-nowrap">
                        Địa chỉ:
                    </span>
                    <span className="flex-1 pb-0.5">{data?.dia_chi}</span>
                </div>
                <div className="flex">
                    <span className="font-medium flex-none w-32 whitespace-nowrap">
                        Nội dung:
                    </span>
                    <span className="flex-1 pb-0.5">{data?.dien_giai}</span>
                </div>
            </div>


            {/* Bảng chi tiết đơn hàng với tổng kết */}
            <div className="mb-4">
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-8">STT</th>
                            <th className="border border-black p-1 w-16">MÃ KHO</th>
                            <th className="border border-black p-1 w-16">MÃ VT</th>
                            <th className="border border-black p-1">TÊN VT</th>
                            <th className="border border-black p-1 w-12">TK</th>
                            <th className="border border-black p-1 w-12">ĐVT</th>
                            <th className="border border-black p-1 w-20">SỐ LƯỢNG</th>
                            <th className="border border-black p-1 w-20">ĐƠN GIÁ</th>
                            <th className="border border-black p-1 w-24">TIỀN HÀNG</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Dòng dữ liệu từ hang_hoa_list */}
                        {data?.hang_hoa_list?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-1 text-center">{index + 1}</td>
                                <td className="border border-black p-1">{item?.ma_kho_i || ""}</td>
                                <td className="border border-black p-1">{item?.ma_vt || ""}</td>
                                <td className="border border-black p-1">{item?.ten_vt || ""}</td>
                                <td className="border border-black p-1">{item?.tk_vt || ""}</td>
                                <td className="border border-black p-1 text-center">{item?.dvt || ""}</td>
                                <td className="border border-black p-1 text-right">{item?.so_luong?.toLocaleString("vi-VN") || ""}</td>
                                <td className="border border-black p-1 text-right">{item?.gia0?.toLocaleString("vi-VN") || ""}</td>
                                <td className="border border-black p-1 text-right">{item?.tien0?.toLocaleString("vi-VN") || ""}</td>
                            </tr>
                        )) || []}

                        {/* Các dòng trống nếu cần thiết để đủ 10 dòng */}
                        {Array.from({ length: Math.max(0, 10 - (data?.hang_hoa_list?.length || 0)) }, (_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-1 text-center">{(data?.hang_hoa_list?.length || 0) + i + 1}</td>
                                <td className="border border-black p-1"></td>
                                <td className="border border-black p-1"></td>
                                <td className="border border-black p-1"></td>
                                <td className="border border-black p-1"></td>
                                <td className="border border-black p-1"></td>
                                <td className="border border-black p-1"></td>
                                <td className="border border-black p-1"></td>
                                <td className="border border-black p-1"></td>
                            </tr>
                        ))}

                        {/* Các dòng tổng kết */}
                        <tr>
                            <td colSpan="8" className="border border-black p-1 text-right font-medium">
                                CỘNG TIỀN HÀNG:
                            </td>
                            <td className="border border-black p-1 text-right">
                                {data?.t_tien?.toLocaleString("vi-VN") || "1.514.376"}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8" className="border border-black p-1 text-right font-medium">
                                TIỀN CHI PHÍ:
                            </td>
                            <td className="border border-black p-1 text-right">
                                {data?.t_cp?.toLocaleString("vi-VN") || "456.456"}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8" className="border border-black p-1 text-right font-medium">
                                TIỀN THUẾ GTGT:
                            </td>
                            <td className="border border-black p-1 text-right">
                                {data?.t_thue?.toLocaleString("vi-VN") || "151.438"}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="8" className="border border-black p-1 text-right font-bold">
                                TỔNG TIỀN THANH TOÁN:
                            </td>
                            <td className="border border-black p-1 text-right font-bold">
                                {data?.t_tt?.toLocaleString("vi-VN") || "2.122.270"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ghi chú số tiền bằng chữ */}
            <div className="text-xs mb-6 italic text-right">
                {data?.t_tt ? `Số tiền (viết bằng chữ): ${capitalizeFirstLetter(toWords(data.t_tt))} đồng` : ""}
            </div>

            {/* Ngày ký */}


            {/* Phần ký tên */}
            <div className="grid grid-cols-3 text-center text-xs gap-8 min-h-[160px]">
                {/* Cột 1: Người giao hàng */}
                <div className="flex flex-col justify-center">
                    <div className="font-bold mb-1">NGƯỜI GIAO HÀNG</div>
                    <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                </div>

                {/* Cột 2: Người nhận hàng */}
                <div className="flex flex-col justify-center">
                    <div className="font-bold mb-1">NGƯỜI NHẬN HÀNG</div>
                    <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                </div>

                {/* Cột 3: Thủ kho */}
                <div className="flex flex-col justify-between h-full">
                    <div className="text-center text-xs">Ngày ..... tháng ..... năm .........</div>

                    <div className="text-center">
                        <div className="font-bold mb-1">THỦ KHO</div>
                        <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                    </div>

                    <div className="text-center text-xs mt-2">Họ và tên thủ kho</div>
                </div>
            </div>

            {/* Footer */}
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
export default function DonHangMuaList() {
    const {
        isOpenCreate,
        isOpenEdit,
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
        confirmDeleteDonHangMua,
        cancelDeleteDonHangMua,
        openModalEdit,
        setConfirmDelete,
    } = useListDonHangMua();

    const [searchInput, setSearchInput] = useState(searchValue);
    const [selectedRowForDetail, setSelectedRowForDetail] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);
    const [isLoadingMaterialNames, setIsLoadingMaterialNames] = useState(false);
    const [selectedDonHangMua, setSelectedDonHangMua] = useState(null);

    const printRef = useRef();
    const [printData, setPrintData] = useState(null);

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
                        const materialData = await dmvtService.getDmvtById(item.ma_vt);
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
        if (cashReceipt) {
            // Set data ngay lập tức để hiển thị UI
            setSelectedRowForDetail(cashReceipt);
            setShowDetailPanel(true);

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


    const handleEditDonHangMua = (record) => {
        setSelectedDonHangMua(record);
        openModalEdit();
    };

    const handleDeleteDonHangMua = (record) => {
        setConfirmDelete({
            open: true,
            cashReceipt: record,
        });
    };

    // Thiết lập react-to-print
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Đơn_hàng_mua_${printData?.so_ct || 'PT001'}`,
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
            key: "ma_hdm",
            title: "Số đơn hàng mua",
            fixed: "left",
            width: 100,
        },
        {
            key: "ma_kh",
            title: "Mã khách hàng",
            width: 80,
        },
        {
            key: "ong_ba",
            title: "Tên khách hàng",
            width: 200,
        },
        {
            key: "t_tien_nt0",
            title: "Tiền hàng ngoại tệ",
            width: 150,
        },
        {
            key: "t_cp_nt",
            title: "Tiền cp ngoại tệ",
            width: 150,
        },
        {
            key: "t_tt_nt",
            title: "Tổng tiền tt ngoại tệ",
            width: 150,
        },
        {
            key: "ma_nx",
            title: "Mã nx",
            width: 80,
        },
        {
            key: "hd_thue",
            title: "Tk thuế",
            width: 80,
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
            width: 150,
        },
        {
            key: "t_tien    ",
            title: "Tiền hàng VNĐ",
            width: 150,
        },
        {
            key: "t_cp",
            title: "Tiền cp VNĐ",
            width: 150,
        },
        {
            key: "t_thue",
            title: "Tiền thuế VNĐ",
            width: 150,
        },
        {
            key: "t_tt",
            title: "Tổng tiền tt VNĐ",
            width: 150,
        },
        {
            key: "so_ct",
            title: "Số đơn hàng",
            width: 150,
        },
        {
            key: "ma_nt",
            title: "Mã ngoại tệ",
            width: 100,
        },
        {
            key: "ty_gia",
            title: "Tỷ giá",
            width: 80,
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
            key: "ma_dvcs",
            title: "Mã DVCS",
            width: 150,
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
                        onClick={() => handleEditDonHangMua(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteDonHangMua(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                    // disabled={deleteDonHangMuaMutation.isLoading}
                    >
                        <Trash size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="px-4">
            <PageMeta title="Đơn hàng nội địa" description="Đơn hàng nội địa" />
            <PageBreadcrumb pageTitle="Đơn hàng nội địa" />
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
                            {/* Danh sách hàng hóa */}
                            <div className="space-y-4">

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
                                                            {item.gia ? parseFloat(item.gia0).toLocaleString('vi-VN') : '0'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                                            {item.tien_nt ? parseFloat(item.tien0).toLocaleString('vi-VN') : '0'}
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
                                                            .reduce((total, item) => total + (parseFloat(item.tien0) || 0), 0)
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
                    )}
                </ComponentCard>

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