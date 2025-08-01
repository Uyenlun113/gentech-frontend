import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import Flatpickr from "react-flatpickr";
import { Link } from "react-router";

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { ShowMoreTables } from "../../components/tables/ShowMoreTables";
import Button from "../../components/ui/button/Button";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";
import { CalenderIcon } from "../../icons";
import { ModalCreatePhieuMua } from "./ModalCreatePhieuMua";
import { ModalEditPhieuMua } from "./ModalEditPhieuMua";
import { usePhieuMuaList } from "./usePhieuMuaList";
import toWords from 'vn-num2words';
import { FilePlus, Search, Pencil, Trash, Printer } from "lucide-react";
import { useRef, forwardRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

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
                {/* <div className="flex-1"></div> */}
                <div className="flex-1 text-center text-xs">
                    <div>
                        Nợ: {data?.ct71?.map((item) => item.tk_vt).join(', ') || '1111'}
                    </div>
                    <div>Có: {data?.tk_i|| '0000'}</div>
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
                        {data?.ct71?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-1 text-center">{index + 1}</td>
                                <td className="border border-black p-1">{item?.ten_vt || "con hàng 1"}</td>
                                <td className="border border-black p-1">{item?.ma_vt || "VT002"}</td>
                                <td className="border border-black p-1 text-center">{item?.dvt || "cái"}</td>
                                <td className="border border-black p-1 text-right">
                                    {/* {item?.so_luong?.toLocaleString("vi-VN") || "10.000"} */}
                                </td>
                                <td className="border border-black p-1 text-right">
                                    {item?.so_luong?.toLocaleString("vi-VN") || "10.000"}
                                </td>
                                <td className="border border-black p-1 text-right">{item?.gia0?.toLocaleString("vi-VN") || "20.00"}</td>
                                <td className="border border-black p-1 text-right">
                                    {item?.tien0?.toLocaleString("vi-VN") || "1.434"}
                                </td>
                            </tr>
                        ))}

                        {/* Các dòng trống */}
                        {Array.from({ length: Math.max(0, 10 - (data?.ct71?.length || 1)) }, (_, i) => (
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
                                {data?.t_tt?.toLocaleString("vi-VN") || "1.434"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ghi chú */}
            <div className="text-xs mb-4 space-y-1">
                <div>{data?.t_tien_nt ? `- Số tiền (viết bằng chữ): ${capitalizeFirstLetter(toWords(data.t_tien_nt))} đồng` : ""}</div>
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
export default function PhieuMuaListPage() {
    const {
        dataTable,
        // columnsTable,
        columnsSubTable,
        rangePickerValue,
        loading,
        currentPage,
        totalItems,
        recordToDelete,
        isOpenDelete,
        handleRangePicker,
        handleChangePage,
        handleSearch,
        handleRowClick,
        handleConfirmDelete,
        handleCancelDelete,
        isOpenCreate,
        openModalCreate,
        closeModalCreate,
        isOpenEdit,
        closeModalEdit,
        selectedEditId,
        handleDeleteClick,
        formatDate,
        formatCurrency,
        deleteMutation,
        handleOpenEdit,
    } = usePhieuMuaList();

    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const printRef = useRef();
    const [printData, setPrintData] = useState(null);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(localSearchTerm);
    };

    const handleSearchInputChange = (e) => {
        setLocalSearchTerm(e.target.value);
        if (e.target.value === "") {
            handleSearch("");
        }
    };
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
            key: "stt",
            title: "STT",
            dataIndex: "stt",
            width: 60,
            fixed: "left",
            align: "center",
            render: (text, record) => record.stt,
        },
        {
            key: "ngay_lct",
            title: "Ngày lập phiếu",
            fixed: "left",
            width: 140,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
        },
        {
            key: "so_ct",
            title: "Số phiếu nhập",
            fixed: "left",
            width: 120,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "t_tien_nt",
            title: "Tiền hàng",
            width: 140,
            render: (val) => (
                <div className="font-mono text-sm text-center text-blue-600">
                    {formatCurrency(val)}
                </div>
            ),
        },
        {
            key: "t_cp_nt",
            title: "Tiền chi phí",
            width: 140,
            render: (val) => (
                <div className="font-mono text-sm text-center text-blue-600">
                    {formatCurrency(val)}
                </div>
            ),
        },
        {
            key: "t_tt_nt",
            title: "Tổng tiền thanh toán",
            width: 140,
            render: (val) => (
                <div className="font-mono text-sm text-center text-blue-600">
                    {formatCurrency(val)}
                </div>
            ),
        },
        {
            key: "ma_kh",
            title: "Mã khách hàng",
            width: 180,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "tk_thue_no",
            title: "Tài khoản có",
            width: 120,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ma_dvcs",
            title: "Mã DVCS",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "action",
            title: "Thao tác",
            fixed: "right",
            width: 100,
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <button
                            className="text-gray-500 hover:text-amber-500"
                            title="In"
                            onClick={() => handlePrintFun(record)}
                        >
                            <Printer size={18} />
                        </button>
                        <button
                            className="text-gray-500 hover:text-amber-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Sửa"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(record?.stt_rec);
                            }}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={(e) => handleDeleteClick(record, e)}
                            className="text-gray-500 hover:text-red-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa"
                            disabled={deleteMutation.isPending}
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];
    return (
        <>
            <ModalCreatePhieuMua
                isOpenCreate={isOpenCreate}
                closeModalCreate={closeModalCreate}
            />
            <ModalEditPhieuMua
                isOpenEdit={isOpenEdit}
                closeModalEdit={closeModalEdit}
                editingId={selectedEditId}
            />
            <div className="px-4">
                <PageMeta title="Danh sách phiếu nhập mua" description="Danh sách phiếu nhập mua" />
                <PageBreadcrumb pageTitle="Danh sách phiếu nhập mua" />
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    {printData && <PrintContent ref={printRef} data={printData} />}
                </div>
                <div className="space-y-6">
                    <ComponentCard>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/sales"
                                    className="flex items-center border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    Quay lại
                                </Link>
                                <Button onClick={openModalCreate} size="sm" variant="primary" startIcon={<FilePlus className="size-5" />}>
                                    Thêm phiếu nhập
                                </Button>
                            </div>

                            {/* Right: Search + Date Range */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                {/* Search */}
                                <form className="w-full sm:max-w-xs" onSubmit={handleSearchSubmit}>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Search size={18} className="text-gray-500 dark:text-white/50" />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm theo số phiếu, mã KH..."
                                            value={localSearchTerm}
                                            onChange={handleSearchInputChange}
                                            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                        />
                                    </div>
                                </form>

                                {/* Date Range Picker */}
                                <div className="relative w-full sm:w-[360px]">
                                    <Flatpickr
                                        value={rangePickerValue}
                                        onChange={handleRangePicker}
                                        options={{
                                            mode: "range",
                                            dateFormat: "d/m/Y",
                                            locale: Vietnamese,
                                        }}
                                        placeholder="Chọn khoảng ngày"
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                        <CalenderIcon className="w-5 h-5" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ShowMoreTables
                            dataTable={dataTable}
                            columnsTable={columnsTable}
                            columnsSubTable={columnsSubTable}
                            handleChangePage={handleChangePage}
                            loading={loading}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            handleRowClick={handleRowClick}
                        />
                    </ComponentCard>

                    {/* Modal xác nhận xóa */}
                    <ConfirmModal
                        isOpen={isOpenDelete}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa phiếu nhập "${recordToDelete?.so_ct || recordToDelete?.stt_rec
                            }" không?`}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        variant="danger"
                    />
                </div>
            </div>
        </>
    );
}