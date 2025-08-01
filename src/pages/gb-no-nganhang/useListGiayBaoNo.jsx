import { Pencil, Printer, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useDeleteGiayBaoNo, useGiayBaoNos } from "../../hooks/usegiaybaono";
import { useModal } from "../../hooks/useModal";

export const useListGiayBaoNo = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGiayBaoNo, setSelectedGiayBaoNo] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDetail, openModal: openModalDetail, closeModal: closeModalDetail } = useModal();

    // Parse date range
    const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
    const dateFrom = dateRange[0] || undefined;
    const dateTo = dateRange[1] || undefined;
    const [loaiTk, setLoaiTk] = useState("");
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [selectedForPrint, setSelectedForPrint] = useState(null);
    const [printData, setPrintData] = useState(null);
    const printRef = useRef();

    // Handle print functionality
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Giấy Báo Nợ - ${selectedForPrint?.so_ct || 'GBN'}`,
        onAfterPrint: () => {
            // Reset print states after successful print
            setIsPrintModalOpen(false);
            setSelectedForPrint(null);
            setPrintData(null);
        },
        onPrintError: (error) => {
            console.error('❌ Print error:', error);
            alert('Có lỗi xảy ra khi in. Vui lòng thử lại!');
        }
    });

    const handlePrintClick = (record) => {
        setSelectedForPrint(record);
        setIsPrintModalOpen(true);
    };

    const handlePrintModalClose = () => {
        setIsPrintModalOpen(false);
        setSelectedForPrint(null);
        setPrintData(null);
    };

    const handlePrintConfirm = (formDataFromModal) => {

        // Lưu data để truyền vào template
        setPrintData(formDataFromModal);

        // Đợi một chút để state update rồi mới trigger print
        setTimeout(() => {
            try {
                handlePrint();
            } catch (error) {
                console.error('Print error:', error);
                alert('Có lỗi xảy ra khi in!');
            }
        }, 100);
    };
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
    const { data: cashReceiptData, isLoading, error, refetch } = useGiayBaoNos(queryParams);
    const deleteGiayBaoNoMutation = useDeleteGiayBaoNo();
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        cashReceipt: null,
    });

    const handleSaveCreate = () => {
        refetch();
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        refetch();
        closeModalEdit();
    };

    const handleEditGiayBaoNo = (record) => {
        setSelectedGiayBaoNo(record);
        openModalEdit();
    };

    const handleDeleteGiayBaoNo = (record) => {
        setConfirmDelete({
            open: true,
            cashReceipt: record,
        });
    };

    const confirmDeleteGiayBaoNo = async () => {
        try {
            await deleteGiayBaoNoMutation.mutateAsync(confirmDelete.cashReceipt.stt_rec);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, cashReceipt: null });
        }
    };

    const cancelDeleteGiayBaoNo = () => {
        setConfirmDelete({ open: false, cashReceipt: null });
    };

    // Định nghĩa các cột của bảng, thêm các trường mới
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
            // fixed: "left",
            width: 150,
        },
        {
            key: "ngay_ct",
            title: "Ngày hạch toán",
            // fixed: "left",
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
                        className="text-gray-500 hover:text-blue-500"
                        title="In"
                        onClick={() => handlePrintClick(record)}
                    >
                        <Printer size={18} />
                    </button>
                    <button
                        className="text-gray-500 hover:text-amber-500"
                        title="Sửa"
                        onClick={() => handleEditGiayBaoNo(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteGiayBaoNo(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deleteGiayBaoNoMutation.isLoading}
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
        // Ví dụ: setSelectedGiayBaoNo({ ...selectedGiayBaoNo, [field]: value });
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
        selectedGiayBaoNo,

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
        isDeleting: deleteGiayBaoNoMutation.isLoading,

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
        confirmDeleteGiayBaoNo,
        cancelDeleteGiayBaoNo,

        isPrintModalOpen,
        selectedForPrint,
        printData,
        printRef,
        handlePrintClick,
        handlePrintModalClose,
        handlePrintConfirm,
    };
};
