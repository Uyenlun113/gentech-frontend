import { useState } from "react";
import { useCashReceipts, useDeleteCashReceipt } from "../../../hooks/useCashReceipt";
import { useModal } from "../../../hooks/useModal";

export const useListCashReceipt = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCashReceipt, setSelectedCashReceipt] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDetail, openModal: openModalDetail, closeModal: closeModalDetail } = useModal();

    // Parse date range
    const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
    const dateFrom = dateRange[0] || undefined;
    const dateTo = dateRange[1] || undefined;
    const [loaiTk, setLoaiTk] = useState("");

    // Query params
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
    const { data: cashReceiptData, isLoading, error, refetch } = useCashReceipts(queryParams);
    const deleteCashReceiptMutation = useDeleteCashReceipt();
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

    const confirmDeleteCashReceipt = async () => {
        try {
            await deleteCashReceiptMutation.mutateAsync(confirmDelete.cashReceipt.stt_rec);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, cashReceipt: null });
        }
    };

    const cancelDeleteCashReceipt = () => {
        setConfirmDelete({ open: false, cashReceipt: null });
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
        selectedCashReceipt,

        // Data
        dataTable: cashReceiptData?.data || [],
        pagination: cashReceiptData?.pagination || { page: 1, limit: 5, total: 0, totalPages: 0 },

        // Form states
        rangePickerValue,
        searchValue,

        // Loading states
        isLoading,
        error,
        isDeleting: deleteCashReceiptMutation.isLoading,

        // Modal handlers
        openModalCreate,
        openModalEdit,
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
        setSelectedCashReceipt,

        // Delete confirmation
        confirmDelete,
        setConfirmDelete,
        confirmDeleteCashReceipt,
        cancelDeleteCashReceipt,
    };
};