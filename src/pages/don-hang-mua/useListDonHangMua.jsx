import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useDonHangMuas, useDeleteDonHangMua } from "../../hooks/usedonhangmua";
import { useModal } from "../../hooks/useModal";

export const useListDonHangMua = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDonHangMua, setSelectedDonHangMua] = useState(null);

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
    const { data: cashReceiptData, isLoading, error, refetch } = useDonHangMuas(queryParams);
    const deleteDonHangMuaMutation = useDeleteDonHangMua();
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

    const confirmDeleteDonHangMua = async () => {
        try {
            await deleteDonHangMuaMutation.mutateAsync(confirmDelete.cashReceipt.stt_rec);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, cashReceipt: null });
        }
    };

    const cancelDeleteDonHangMua = () => {
        setConfirmDelete({ open: false, cashReceipt: null });
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
            key: "t_tien0",
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
                        title="Sửa"
                        onClick={() => handleEditDonHangMua(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteDonHangMua(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deleteDonHangMuaMutation.isLoading}
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
        // Ví dụ: setSelectedDonHangMua({ ...selectedDonHangMua, [field]: value });
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
        selectedDonHangMua,

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
        isDeleting: deleteDonHangMuaMutation.isLoading,

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
        confirmDeleteDonHangMua,
        cancelDeleteDonHangMua,
    };
};
