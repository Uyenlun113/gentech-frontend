import "flatpickr/dist/flatpickr.min.css";

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/pagination/Pagination";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import Button from "../../components/ui/button/Button";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { ModalCreatePhieuNhapKho } from "./PhieuNhapKhoCreate";
import { ModalEditPhieuNhapKho } from "./PhieuNhapKhoUpdate";
import { useListPhieuNhapKho } from "./useListPhieuNhapKho";
import dmvtService from "../../services/dmvt";
import toWords from 'vn-num2words';
import { FilePlus, Search, Pencil, Trash, Printer } from "lucide-react";
import { useRef, forwardRef, useState, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import { Link } from "react-router";
const PrintContent = forwardRef(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[210mm] h-[297mm] p-4 text-sm text-black bg-white"
            style={{ fontFamily: "Times New Roman, serif" }}
        >
            {/* Header với thông tin phần mềm và mã số thuế */}
            <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-center">
                    <div className="text-xs leading-tight">Công ty công nghệ Gentech</div>
                    <div className="text-xs leading-tight">Tầng 02, chung cư CT3 Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội</div>
                </div>
                <div className="text-xs text-center">
                    <div>Mã số thuế: {data?.ma_so_thue}</div>
                    <div>Mẫu số: 01-VT</div>
                    <div className="text-[10px]">
                        (Ban hành theo Thông tư số 133/2016/TT-BTC
                        <br />
                        ngày 26/8/2016 của Bộ Tài chính)
                    </div>
                </div>
            </div>

            {/* Tiêu đề và thông tin phiếu */}

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1"></div>
                <div className="text-center flex-1">
                    <h1 className="font-bold text-xl mb-2">PHIẾU NHẬP KHO</h1>
                    <div className="text-sm">NGÀY {formatDateVN(data?.ngay_ct || new Date())}</div>
                    <div className="text-sm">Số: {data?.so_ct || "PN0002"}</div>
                </div>
                <div className="flex-1 text-xs">
                    <div className="flex justify-center">
                        {/* Cột 1: Nhãn */}
                        <div className="text-right pr-2">
                            <div><strong>Nợ:</strong></div>
                            {data?.hang_hoa_list?.slice(1).map((_, index) => (
                                <div key={`n-label-${index}`}>&nbsp;</div>
                            ))}
                            <div className="mt-2"><strong>Có:</strong></div>
                            {data?.hang_hoa_list?.slice(1).map((_, index) => (
                                <div key={`c-label-${index}`}>&nbsp;</div>
                            ))}
                        </div>

                        {/* Cột 2: Dữ liệu */}
                        <div className="pl-2">
                            {data?.hang_hoa_list?.map((item, index) => (
                                <div key={`n-${index}`}>{item.tk_vt}</div>
                            ))}
                            <div className="mt-2" />
                            {data?.hang_hoa_list?.map((item, index) => (
                                <div key={`c-${index}`}>{item.ma_nx_i}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="mb-4 space-y-1 text-xs">
                <div className="flex">
                    <span className="font-medium">- Họ và tên người giao hàng: {data?.ong_ba}</span>
                </div>
                <div className="flex">
                    <span className="font-medium">- Theo: </span>
                    <span className="ml-20">số</span>
                    <span className="ml-8">ngày</span>
                    <span className="ml-8">tháng</span>
                    <span className="ml-8">năm</span>
                    <span className="ml-16">của</span>
                </div>
                <div className="flex">
                    <span className="font-medium">- Nhập tại kho: {data?.ma_kho || "KH01"}, địa điểm:</span>
                </div>
            </div>

            {/* Bảng chi tiết phiếu nhập kho */}
            <div className="mb-4">
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-8" rowSpan="2">
                                STT
                            </th>
                            <th className="border border-black p-1" rowSpan="2">
                                TÊN, NHÃN HIỆU, QUY CÁCH, PHẨM CHẤT
                                <br />
                                VẬT TƯ, DỤNG CỤ, SẢN PHẨM HÀNG HÓA
                            </th>
                            <th className="border border-black p-1 w-16" rowSpan="2">
                                MÃ SỐ
                            </th>
                            <th className="border border-black p-1 w-12" rowSpan="2">
                                ĐVT
                            </th>
                            <th className="border border-black p-1" colSpan="2">
                                SỐ LƯỢNG
                            </th>
                            <th className="border border-black p-1 w-20" rowSpan="2">
                                ĐƠN GIÁ
                            </th>
                            <th className="border border-black p-1 w-24" rowSpan="2">
                                THÀNH TIỀN
                            </th>
                        </tr>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-16">THEO CTƯ</th>
                            <th className="border border-black p-1 w-16">THỰC NHẬP</th>
                        </tr>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 text-center">A</th>
                            <th className="border border-black p-1 text-center">B</th>
                            <th className="border border-black p-1 text-center">C</th>
                            <th className="border border-black p-1 text-center">D</th>
                            <th className="border border-black p-1 text-center">1</th>
                            <th className="border border-black p-1 text-center">2</th>
                            <th className="border border-black p-1 text-center">3</th>
                            <th className="border border-black p-1 text-center">4</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.hang_hoa_list?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-1 text-center">{index + 1}</td>
                                <td className="border border-black p-1">{item?.ten_vt || "noname"}</td>
                                <td className="border border-black p-1">{item?.ma_vt}</td>
                                <td className="border border-black p-1 text-center">{item?.dvt || "nodvt"}</td>
                                <td className="border border-black p-1 text-right">
                                    {/* {item?.so_luong?.toLocaleString("vi-VN") || "10.000"} */}
                                </td>
                                <td className="border border-black p-1 text-right">
                                    {item?.so_luong?.toLocaleString("vi-VN") || "10.000"}
                                </td>
                                <td className="border border-black p-1 text-right">{item?.gia?.toLocaleString("vi-VN") || "20.00"}</td>
                                <td className="border border-black p-1 text-right">
                                    {item?.tien?.toLocaleString("vi-VN") || "1.434"}
                                </td>
                            </tr>
                        ))}

                        {/* Các dòng trống */}
                        {Array.from({ length: Math.max(0, 10 - (data?.hang_hoa_list?.length || 1)) }, (_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-1 py-3 text-center"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                            </tr>
                        ))}

                        {/* Dòng tổng cộng */}
                        <tr>
                            <td colSpan="7" className="border border-black p-1 text-center font-bold">
                                CỘNG:
                            </td>
                            <td className="border border-black p-1 text-right font-bold">
                                {data?.tong_tien?.toLocaleString("vi-VN") || "1.434"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ghi chú */}
            <div className="text-xs mb-4 space-y-1">
                <div>{data?.tong_tien ? `- Số tiền (viết bằng chữ): ${capitalizeFirstLetter(toWords(data.tong_tien))} đồng` : ""}</div>
                <div>- Số chứng từ gốc kèm theo: 0</div>
            </div>

            <div className="grid grid-cols-4 grid-rows-6 text-center text-xs gap-x-4 gap-y-1 min-h-[120px]">
                {/* Hàng 1 - Ngày tháng */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 3 trống */}
                <div className="text-xs">Ngày ..... tháng ..... năm .........</div> {/* Cột 4 */}

                {/* Hàng 2 - Tiêu đề chính */}
                <div className="font-bold">NGƯỜI LẬP PHIẾU</div>
                <div className="font-bold">NGƯỜI GIAO HÀNG</div>
                <div className="font-bold">THỦ KHO</div>
                <div className="font-bold">KẾ TOÁN TRƯỞNG</div>

                {/* Hàng 3 - Ghi chú ký tên */}
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Hoặc bộ phận có nhu cầu nhập)</div>

                {/* Hàng 4 - Ký tên KẾ TOÁN TRƯỞNG */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 3 trống */}
                <div className="text-[10px]">(Ký, họ tên)</div>

                {/* Hàng 5 - Thông tin bổ sung */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 4 trống */}

                {/* Hàng 5 - Thông tin bổ sung */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div className="text-xs">Họ và tên thủ kho</div>
                <div></div> {/* Cột 4 trống */}
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
export default function PhieuNhapKhoList() {
    const {
        isOpenCreate,
        isOpenEdit,
        selectedPhieuNhapKho,
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
        confirmDeletePhieuNhapKho,
        cancelDeletePhieuNhapKho,
        handleDeletePhieuNhapKho,
        handleEditPhieuNhapKho,
        isDeleting,
    } = useListPhieuNhapKho();

    const [searchInput, setSearchInput] = useState(searchValue);
    const [selectedRowForDetail, setSelectedRowForDetail] = useState(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);
    const [isLoadingMaterialNames, setIsLoadingMaterialNames] = useState(false);
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

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Phiếu_nhập_kho_${printData?.so_ct || 'PT001'}`,
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
            title: "Ngày CT",
            fixed: "left",
            width: 150,
        },
        {
            key: "so_ct",
            title: "Số CT",
            fixed: "left",
            width: 100,
        },
        {
            key: "ma_gd",
            title: "Mã GD",
            width: 50,
        },
        {
            key: "ma_kh",
            title: "Mã KH",
            width: 100,
        },
        {
            key: "ong_ba",
            title: "Tên khách hàng",
            fixed: "left",
            width: 200,
        },
        // {
        //     key: "ma_kh",
        //     title: "Tổng tiền ngoại tệ",
        //     width: 150,
        // },
        {
            key: "tong_tien",
            title: "Tổng tiền VNĐ",
            width: 150,
            render: (value) => {
                if (typeof value !== "number") return value;
                return value.toLocaleString("vi-VN");
            },
        },
        {
            key: "dien_giai",
            title: "Lý do nộp",
            width: 250,
        },
        {
            key: "ma_nt",
            title: "Loại tiền",
            width: 50,
        },
        {
            key: "ty_gia",
            title: "Tỷ giá",
            width: 50,
        },
        {
            key: "date",
            title: "Ngày cập nhật",
            width: 120,
            render: (value) => {
                if (!value) return "";
                const date = new Date(value);
                const dd = String(date.getDate()).padStart(2, "0");
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const yyyy = date.getFullYear();
                return `${yyyy}-${mm}-${dd}`;
            },
        },
        {
            key: "time",
            title: "Giờ cập nhật",
            width: 100,
        },
        {
            key: "ma_dvcs",
            title: "Mã DVCS",
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
                        onClick={() => handleEditPhieuNhapKho(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeletePhieuNhapKho(record)}
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
            <PageMeta title="Phiếu nhập kho" description="Phiếu nhập kho" />
            <PageBreadcrumb pageTitle="Phiếu nhập kho" />
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {printData && <PrintContent ref={printRef} data={printData} />}
            </div>
            <div className="space-y-6 ">
                <ComponentCard>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left: Button */}
                        <div className="flex items-center gap-2">
                            <Link
                                to="/purchases"
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
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Đơn giá n.tệ</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Thành tiền n.tệ</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">TK nợ</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">TK có</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Đơn giá VNĐ</th>
                                                    <th className="border-b border-gray-200 dark:border-gray-600 px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Thành tiền VNĐ</th>
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
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                            {item.so_luong ? parseFloat(item.so_luong).toLocaleString('vi-VN') : '0'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                            {item.gia_nt || item.gia ? parseFloat(item.gia_nt || item.gia).toLocaleString('vi-VN') : '0'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-right">
                                                            {item.tien_nt || item.tien ? parseFloat(item.tien_nt || item.tien).toLocaleString('vi-VN') : '0'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                            {item.tk_no || item.tk_vt || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                                                            {item.tk_co || item.ma_nx_i || 'N/A'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                                                            {item.gia_vnd || item.gia ? parseFloat(item.gia_vnd || item.gia).toLocaleString('vi-VN') : '0'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-green-600 dark:text-green-400 text-right">
                                                            {item.tien_vnd || item.tien ? parseFloat(item.tien_vnd || item.tien).toLocaleString('vi-VN') : '0'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                                                <tr>
                                                    <td colSpan="7" className="px-4 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 text-right border-t border-gray-200 dark:border-gray-600">
                                                        Tổng tiền n.tệ:
                                                    </td>
                                                    <td className="px-4 py-4 text-lg font-bold text-blue-600 dark:text-blue-400 text-right border-t border-gray-200 dark:border-gray-600">
                                                        {selectedRowForDetail.hang_hoa_list
                                                            .reduce((total, item) => total + (parseFloat(item.tien_nt || item.tien) || 0), 0)
                                                            .toLocaleString('vi-VN')
                                                        }
                                                    </td>
                                                    <td colSpan="3" className="border-t border-gray-200 dark:border-gray-600"></td>
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
                    )}
                </ComponentCard>

                {/* Modals */}
                <ModalCreatePhieuNhapKho
                    isOpenCreate={isOpenCreate}
                    closeModalCreate={closeModalCreate}
                    onSaveCreate={handleSaveCreate}
                />
                <ModalEditPhieuNhapKho
                    isOpenEdit={isOpenEdit}
                    closeModalEdit={closeModalEdit}
                    onSaveEdit={handleSaveEdit}
                    selectedPhieuNhapKho={selectedPhieuNhapKho}
                />

                <ConfirmModal
                    isOpen={confirmDelete.open}
                    title="Xác nhận xoá"
                    message={`Bạn có chắc chắn muốn xoá phiếu "${confirmDelete.cashReceipt?.so_ct}" không?`}
                    onConfirm={confirmDeletePhieuNhapKho}
                    onCancel={cancelDeletePhieuNhapKho}
                />
            </div>
        </div>
    );
}