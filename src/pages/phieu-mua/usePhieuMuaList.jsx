import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useModal } from "../../hooks/useModal";
import { useDeletePhieuMua, useListPhieuMua } from "../../hooks/usePhieumua";

export const usePhieuMuaList = () => {
    const [selectedEditId, setSelectedEditId] = useState();

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

    const [rangePickerValue, setRangePickerValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showDetailTable, setShowDetailTable] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();

    // Build search params for API call
    const searchParams = useMemo(() => {
        const params = {
            page: currentPage,
            limit: pageSize,
        };

        if (searchTerm) {
            params.search = searchTerm;
        }

        if (rangePickerValue && rangePickerValue.length === 2) {
            const [startDate, endDate] = rangePickerValue;
            params.startDate = startDate.toISOString().split('T')[0];
            params.endDate = endDate.toISOString().split('T')[0];
        }

        return params;
    }, [currentPage, pageSize, searchTerm, rangePickerValue]);

    const { data: fetchPhieuMuaData, isLoading: isLoadingPhieuMua, refetch: refetchPhieuMuaData } = useListPhieuMua(searchParams);

    const deleteMutation = useDeletePhieuMua();

    const dataTable = useMemo(() => {
        let rawData = [];

        if (fetchPhieuMuaData?.data?.items && Array.isArray(fetchPhieuMuaData.data.items)) {
            rawData = fetchPhieuMuaData.data.items;
        }
        else if (fetchPhieuMuaData?.items && Array.isArray(fetchPhieuMuaData.items)) {
            rawData = fetchPhieuMuaData.items;
        }
        else if (fetchPhieuMuaData?.data && Array.isArray(fetchPhieuMuaData.data)) {
            rawData = fetchPhieuMuaData.data;
        }
        else if (Array.isArray(fetchPhieuMuaData)) {
            rawData = fetchPhieuMuaData;
        }

        // Thêm stt
        return rawData.map((item, index) => ({
            ...item,
            stt: index + 1,
        }));
    }, [fetchPhieuMuaData]);

    // Get total items and total pages from API response
    const totalItems = useMemo(() => {
        if (fetchPhieuMuaData?.data?.totalItems) {
            return fetchPhieuMuaData.data.totalItems;
        }
        if (fetchPhieuMuaData?.totalItems) {
            return fetchPhieuMuaData.totalItems;
        }
        if (fetchPhieuMuaData?.data?.total) {
            return fetchPhieuMuaData.data.total;
        }
        if (fetchPhieuMuaData?.total) {
            return fetchPhieuMuaData.total;
        }
        return dataTable.length;
    }, [fetchPhieuMuaData, dataTable.length]);

    const totalPages = Math.ceil(totalItems / pageSize);
    const dataDetailTable = useMemo(() => {
        const list = selectedRecord?.ct71;
        if (Array.isArray(list)) {
            return list.map((item, index) => ({
                ...item,
                stt: index + 1,
            }));
        }
        return [];
    }, [selectedRecord]);

    useEffect(() => {
        setLoading(isLoadingPhieuMua || deleteMutation.isPending);
    }, [isLoadingPhieuMua, deleteMutation.isPending]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };
    const formatCurrency = (amount) => {
        if (!amount) return "0";
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    const handleDeleteClick = (record, e) => {
        e.stopPropagation();
        setRecordToDelete(record);
        openModalDelete();
    };

    const handleConfirmDelete = async () => {
        if (!recordToDelete?.stt_rec) {
            toast.error("Không có thông tin bản ghi để xóa");
            return;
        }

        try {
            await deleteMutation.mutateAsync(recordToDelete.stt_rec);
            toast.success("Xóa thành công!");
            handleCloseDetailTable();
            setSelectedRecord(null);

            closeModalDelete();
            setRecordToDelete(null);
            // If current page becomes empty after deletion, go to previous page
            const newTotalItems = totalItems - 1;
            const newTotalPages = Math.ceil(newTotalItems / pageSize);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            } else {
                refetchPhieuMuaData();
            }
        } catch (error) {
            console.error("Error deleting record:", error);
            toast.error("Lỗi khi xóa: " + (error?.message || "Không xác định"));
        }
    };

    const handleCancelDelete = () => {
        closeModalDelete();
        setRecordToDelete(null);
    };

    const handleRowClick = async (record) => {
        try {
            const ct71WithSTT = Array.isArray(record.ct71)
                ? record.ct71.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                }))
                : [];

            record.ct71 = ct71WithSTT;
            record.children = ct71WithSTT;
            setSelectedRecord(record);
            setShowDetailTable(true);
        } catch (error) {
            console.error("Failed to fetch detail data:", error);
            toast.error("Không thể tải dữ liệu chi tiết");
        }
    };

    const handleCloseDetailTable = () => {
        setShowDetailTable(false);
        setSelectedRecord(null);
    };

    const handleOpenEdit = (id) => {
        setSelectedEditId(id);
        openModalEdit();
    };

    // Pagination handlers
    const handleChangePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleChangePageSize = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    // Search handlers
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleRangePicker = (date) => {
        setRangePickerValue(date);
        setCurrentPage(1); // Reset to first page when filtering by date
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setRangePickerValue("");
        setCurrentPage(1);
    };



    // Columns for detail sub-table
    const columnsSubTable = [
        {
            key: "stt",
            title: "STT",
            width: 50,
            fixed: "left",
            render: (_, record) => <div className="text-center">{record.stt}</div>,
        },
        {
            key: "ma_vt",
            title: "Mã vật tư",
            fixed: "left",
            width: 120,
            render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
        },
        {
            key: "ten_vt",
            title: "Tên vật tư",
            width: 200,
            render: (val) => (
                <div className="text-center truncate" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ma_kho_i",
            title: "Mã kho",
            width: 120,
            render: (val) => (
                <div className="text-center truncate" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 100,
            render: (val) => (
                <span className="text-center block text-blue-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "gia",
            title: "Đơn giá",
            width: 120,
            render: (val) => (
                <span className="text-center block text-green-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "tien_nt",
            title: "Thành tiền",
            width: 120,
            render: (val) => (
                <span className="text-center block text-red-600 font-medium">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "cp_nt",
            title: "Chi phí",
            width: 120,
            render: (val) => (
                <span className="text-center block">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "tk_vt",
            title: "TK vật tư",
            width: 120,
            render: (val) => (
                <span className="text-center block ">
                    {formatCurrency(val)}
                </span>
            ),
        },
    ];

    // Add data with STT numbers for current page
    const processedDataTable = useMemo(() => {
        return dataTable.map((item, index) => ({
            ...item,
            stt: (currentPage - 1) * pageSize + index + 1,
        }));
    }, [dataTable, currentPage, pageSize]);

    // Pagination info
    const paginationInfo = useMemo(() => {
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalItems);

        return {
            startItem,
            endItem,
            totalItems,
            currentPage,
            totalPages,
            pageSize,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
            isFirstPage: currentPage === 1,
            isLastPage: currentPage === totalPages,
        };
    }, [currentPage, pageSize, totalItems, totalPages]);

    return {
        // Data
        dataTable: processedDataTable,
        dataDetailTable,
        // columnsTable,
        columnsSubTable,

        // Search & Filter
        rangePickerValue,
        searchTerm,
        handleRangePicker,
        handleSearch,
        handleClearSearch,

        // Pagination
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        paginationInfo,
        handleChangePage,
        handleChangePageSize,
        handlePrevPage,
        handleNextPage,
        handleFirstPage,
        handleLastPage,

        // Loading & Record Management
        loading,
        selectedRecord,
        showDetailTable,
        recordToDelete,
        isOpenDelete,
        handleRowClick,
        handleCloseDetailTable,
        handleConfirmDelete,
        handleCancelDelete,
        setSelectedRecord,
        deleteMutation,
        fetchPhieuMuaData,

        // Modals
        isOpenCreate,
        openModalCreate,
        closeModalCreate,
        isOpenEdit,
        openModalEdit,
        closeModalEdit,
        selectedEditId,
        setSelectedEditId,
        handleDeleteClick,
        handleOpenEdit,
        formatDate,
        formatCurrency,
    };
};