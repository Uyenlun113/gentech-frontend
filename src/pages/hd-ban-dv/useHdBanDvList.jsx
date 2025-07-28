import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDeleteHdBanDv, useListHdBanDv } from "../../hooks/useHdBanDv";
import { useModal } from "../../hooks/useModal";

export const useHdBanDvList = () => {
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

    const { data: fetchHdBanDvData, isLoading: isLoadingHdBanDv, refetch: refetchHdBanDvData, error } = useListHdBanDv(searchParams);

    const deleteMutation = useDeleteHdBanDv();

    const dataTable = useMemo(() => {
        let rawData = [];
        if (!fetchHdBanDvData) {
            return [];
        }

        if (fetchHdBanDvData?.data?.items && Array.isArray(fetchHdBanDvData.data.items)) {
            rawData = fetchHdBanDvData.data.items;
        }
        else if (fetchHdBanDvData?.items && Array.isArray(fetchHdBanDvData.items)) {
            rawData = fetchHdBanDvData.items;
        }
        else if (fetchHdBanDvData?.data && Array.isArray(fetchHdBanDvData.data)) {
            rawData = fetchHdBanDvData.data;
        }
        else if (Array.isArray(fetchHdBanDvData)) {
            rawData = fetchHdBanDvData;
        }
        return rawData.map((item, index) => ({
            ...item,
            stt: index + 1,
        }));
    }, [fetchHdBanDvData]);

    const totalItems = useMemo(() => {
        if (!fetchHdBanDvData) {
            return 0;
        }

        if (fetchHdBanDvData?.data?.totalItems) {
            return fetchHdBanDvData.data.totalItems;
        }
        if (fetchHdBanDvData?.totalItems) {
            return fetchHdBanDvData.totalItems;
        }
        if (fetchHdBanDvData?.data?.total) {
            return fetchHdBanDvData.data.total;
        }
        if (fetchHdBanDvData?.total) {
            return fetchHdBanDvData.total;
        }
        return dataTable.length;
    }, [fetchHdBanDvData, dataTable.length]);

    const totalPages = Math.ceil(totalItems / pageSize);

    const dataDetailTable = useMemo(() => {
        const list = selectedRecord?.hangHoa;
        if (Array.isArray(list)) {
            return list.map((item, index) => ({
                ...item,
                stt: index + 1,
            }));
        }
        return [];
    }, [selectedRecord]);

    useEffect(() => {
        setLoading(isLoadingHdBanDv || deleteMutation.isPending);
    }, [isLoadingHdBanDv, deleteMutation.isPending]);


    useEffect(() => {
        if (error && error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
            console.error('Error in useHdBanDvList:', error);
        }
    }, [error]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
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
                refetchHdBanDvData();
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
            const dichvuWithSTT = Array.isArray(record.hangHoa)
                ? record.hangHoa.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                }))
                : [];

            record.hangHoa = dichvuWithSTT;
            record.children = dichvuWithSTT;
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
            key: "ngay_ct",
            title: "Ngày chứng từ",
            dataIndex: "ngay_ct",
            fixed: "left",
            width: 140,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
        },
        {
            key: "ma_qs",
            title: "Mã quyển sổ",
            dataIndex: "so_ct",
            fixed: "left",
            width: 140,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "ma_kh",
            title: "Mã khách hàng",
            dataIndex: "ma_kh",
            width: 140,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ten_kh",
            title: "Tên khách hàng",
            dataIndex: "ma_kh",
            width: 140,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "tien_hg_nt",
            title: "Tiền hàng n.tệ",
            dataIndex: "dien_giai",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "t_ck",
            title: "Tiền ck n.tệ",
            dataIndex: "dien_giai",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "t_thue",
            title: "Tiền thuế n.tệ",
            dataIndex: "dien_giai",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "t_tt_nt",
            title: "Tổng tiền n.tệ",
            dataIndex: "dien_giai",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ma_nx",
            title: "Tài khoản nợ",
            dataIndex: "ma_nx",
            width: 120,
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
            key: "tk_dt",
            title: "TK doanh thu",
            dataIndex: "hinh_thuc_tt",
            width: 120,
            render: (val) => (
                <span className="text-center block">
                    {val || "-"}
                </span>
            ),
        },
        {
            key: "tien2",
            title: "Tiền n.tệ",
            dataIndex: "tk_co",
            width: 120,
            render: (val) => (
                <span className="text-center block">
                    {val || "-"}
                </span>
            ),
        },
        {
            key: "dien_giaii",
            title: "Diễn giải",
            dataIndex: "tk_thue",
            width: 120,
            render: (val) => (
                <span className="text-center block">
                    {val || "-"}
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
        columnsTable,
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
        fetchHdBanDvData,

        // Modals
        isOpenCreate,
        openModalCreate,
        closeModalCreate,
        isOpenEdit,
        openModalEdit,
        closeModalEdit,
        selectedEditId,
        setSelectedEditId,
    };
};