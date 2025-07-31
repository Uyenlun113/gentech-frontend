import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDeleteChiPhiMuaHang, useListChiPhiMuaHang } from "../../hooks/useChiPhiMuaHang";
import { useModal } from "../../hooks/useModal";

export const useChiPhiMuaHangList = () => {
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

    const { data: fetchChiPhiMuaHangData, isLoading: isLoadingChiPhiMuaHang, refetch: refetchChiPhiMuaHangData } = useListChiPhiMuaHang(useMemo(() => searchParams, [JSON.stringify(searchParams)]));

    const deleteMutation = useDeleteChiPhiMuaHang();

    const dataTable = useMemo(() => {
        let rawData = [];

        if (fetchChiPhiMuaHangData?.data?.items && Array.isArray(fetchChiPhiMuaHangData.data.items)) {
            rawData = fetchChiPhiMuaHangData.data.items;
        }
        else if (fetchChiPhiMuaHangData?.items && Array.isArray(fetchChiPhiMuaHangData.items)) {
            rawData = fetchChiPhiMuaHangData.items;
        }
        else if (fetchChiPhiMuaHangData?.data && Array.isArray(fetchChiPhiMuaHangData.data)) {
            rawData = fetchChiPhiMuaHangData.data;
        }
        else if (Array.isArray(fetchChiPhiMuaHangData)) {
            rawData = fetchChiPhiMuaHangData;
        }

        // Thêm stt
        return rawData.map((item, index) => ({
            ...item,
            stt: index + 1,
        }));
    }, [fetchChiPhiMuaHangData]);

    // Get total items and total pages from API response
    const totalItems = useMemo(() => {
        if (fetchChiPhiMuaHangData?.data?.totalItems) {
            return fetchChiPhiMuaHangData.data.totalItems;
        }
        if (fetchChiPhiMuaHangData?.totalItems) {
            return fetchChiPhiMuaHangData.totalItems;
        }
        if (fetchChiPhiMuaHangData?.data?.total) {
            return fetchChiPhiMuaHangData.data.total;
        }
        if (fetchChiPhiMuaHangData?.total) {
            return fetchChiPhiMuaHangData.total;
        }
        return dataTable.length;
    }, [fetchChiPhiMuaHangData, dataTable.length]);

    const totalPages = Math.ceil(totalItems / pageSize);
    const dataDetailTable = useMemo(() => {
        const list = selectedRecord?.ct73;
        if (Array.isArray(list)) {
            return list.map((item, index) => ({
                ...item,
                stt: index + 1,
            }));
        }
        return [];
    }, [selectedRecord]);

    useEffect(() => {
        setLoading(isLoadingChiPhiMuaHang || deleteMutation.isPending);
    }, [isLoadingChiPhiMuaHang, deleteMutation.isPending]);

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
                refetchChiPhiMuaHangData();
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
            const ct73WithSTT = Array.isArray(record.ct73)
                ? record.ct73.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                }))
                : [];

            record.ct73 = ct73WithSTT;
            record.children = ct73WithSTT;
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
            key: "so_pn",
            title: "Số PN",
            width: 120,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "ngay_pn",
            title: "Ngày PN",
            width: 120,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
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
            key: "ma_vt",
            title: "Mã vật tư",
            fixed: "left",
            width: 120,
            render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
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
        fetchChiPhiMuaHangData,

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