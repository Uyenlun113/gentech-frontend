import { Pencil, Trash, Printer } from "lucide-react";
import { useState,useRef } from "react";

import { usePhieuXuatKhos, useDeletePhieuXuatKho } from "../../hooks/usephieuxuatkho";
import { useModal } from "../../hooks/useModal";
import { useReactToPrint } from "react-to-print";

export const useListPhieuXuatKho = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPhieuXuatKho, setSelectedPhieuXuatKho] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDetail, openModal: openModalDetail, closeModal: closeModalDetail } = useModal();

    // Parse date range
    const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
    const dateFrom = dateRange[0] || undefined;
    const dateTo = dateRange[1] || undefined;
    const [loaiTk, setLoaiTk] = useState("");

    // Query params (Thêm các trường mới vào query)
    const queryParams = {
        search: searchValue || undefined,
        dateFrom,
        dateTo,
        page: currentPage,
        limit: 5,
        loaiPhieuThu: null,
        maKhach: null,
        diaChi: null,
        nguoiNop: null,
        lyDoNop: null,
        tkNo: null,
        ngayHachToan: null,
        ngayLapPhieu: null,
        quyenSo: null,
        soPhieuThu: null,
        tggd: null,
        trangThai: null,
        MST: null,
    };

    // Fetch data
    const { data: cashReceiptData, isLoading, error, refetch } = usePhieuXuatKhos(queryParams);
    const deletePhieuXuatKhoMutation = useDeletePhieuXuatKho();
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        cashReceipt: null,
    });
    const printRef = useRef();
    const [printData, setPrintData] = useState(null);

    const handleSaveCreate = () => {
        refetch();
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        refetch();
        closeModalEdit();
    };

    const handleEditPhieuXuatKho = (record) => {
        setSelectedPhieuXuatKho(record);
        openModalEdit();
    };

    const handleDeletePhieuXuatKho = (record) => {
        setConfirmDelete({
            open: true,
            cashReceipt: record,
        });
    };

    const confirmDeletePhieuXuatKho = async () => {
        try {
            await deletePhieuXuatKhoMutation.mutateAsync(confirmDelete.cashReceipt.stt_rec);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, cashReceipt: null });
        }
    };

    const cancelDeletePhieuXuatKho = () => {
        setConfirmDelete({ open: false, cashReceipt: null });
    };
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Phiếu_xuất_kho_${printData?.so_ct || 'PT001'}`,
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
    // Định nghĩa các cột của bảng, thêm các trường mới
    const columnsTable = [
        {
            key: "ngay_ct",
            title: "Ngày chứng từ",
            fixed: "left",
            width: 150,
        },
        {
            key: "so_ct",
            title: "Số chứng từ",
            fixed: "left",
            width: 100,
        },
        {
            key: "ma_gd",
            title: "Mã giao dịch",
            width: 100,
        },
        {
            key: "ma_kh",
            title: "Mã khách hàng",
            width: 150,
        },
        {
            key: "ong_ba",
            title: "Tên khách hàng",
            fixed: "left",
            width: 150,
        },
        {
            key: "ma_kh",
            title: "Tổng tiền ngoại tệ",
            width: 150,
        },
        {
            key: "ma_kh",
            title: "Tổng tiền VNĐ",
            width: 150,
        },
        {
            key: "dien_giai",
            title: "Lý do nộp",
            width: 200,
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
            width: 150,
        },
        {
            key: "time",
            title: "Giờ cập nhật",
            width: 150,
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
                        onClick={() => handleEditPhieuXuatKho(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeletePhieuXuatKho(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deletePhieuXuatKhoMutation.isLoading}
                    >
                        <Trash size={18} />
                    </button>
                </div>
            ),
        },
    ];

    // Các hàm xử lý input cho các trường mới nếu cần
    const handleInputChange = (field, value) => {
        // Cập nhật giá trị cho các trường mới nếu có form chỉnh sửa
        // Ví dụ: setSelectedPhieuXuatKho({ ...selectedPhieuXuatKho, [field]: value });
    };

    const handleRangePicker = (date) => {
        if (date && date.length === 2) {
            const formattedRange = `${date[0].toLocaleDateString()} to ${date[1].toLocaleDateString()}`;
            setRangePickerValue(formattedRange);
        } else {
            setRangePickerValue("");
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    return {
        // Modal states
        isOpenCreate,
        isOpenEdit,
        isOpenDetail,
        selectedPhieuXuatKho,

        // Data
        dataTable: cashReceiptData?.data || [],
        columnsTable,
        pagination: cashReceiptData?.pagination || { page: 1, limit: 5, total: 0, totalPages: 0 },

        // Form states
        rangePickerValue,
        searchValue,

        // Loading states
        isLoading,
        error,
        isDeleting: deletePhieuXuatKhoMutation.isLoading,

        // Modal handlers
        openModalCreate,
        closeModalCreate,
        closeModalEdit,
        closeModalDetail,

        // Form handlers
        handleRangePicker,
        handleSearch,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,

        // Utility
        refetch,
        setLoaiTk,
        handleInputChange,

        confirmDelete,
        confirmDeletePhieuXuatKho,
        cancelDeletePhieuXuatKho,
        printRef,
        printData,
    };
};
