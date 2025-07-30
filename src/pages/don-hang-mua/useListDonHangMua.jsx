import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useDonHangMuas, useDeleteDonHangMua } from "../../hooks/usedonhangmua";
import { useModal } from "../../hooks/useModal";

export const useListDonHangMua = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();

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
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDetail, openModal: openModalDetail, closeModal: closeModalDetail } = useModal();


    const handleSaveCreate = () => {
        refetch();
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        refetch();
        closeModalEdit();
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

        // Data
        dataTable: cashReceiptData?.data || [],
        // columnsTable,
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
        // closeModalDetail,

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
        openModalEdit,
        setConfirmDelete,
    };
};
