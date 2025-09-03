import { Pencil, Printer, Trash } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { useDeletePhieu, useGetDonBanHangBySttRec, useListDonBanHang } from "../../hooks/useDonBanHang";
import { useModal } from "../../hooks/useModal";

export const useDonBanHangList = () => {
    const [selectedEditId, setSelectedEditId] = useState();
    const printRef = useRef();
    const [printData, setPrintData] = useState(null);
    const [selectedPrintId, setSelectedPrintId] = useState(null);

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

    const { data: fetchDonBanHangData, isLoading: isLoadingDonBanHang, refetch: refetchDonBanHangData, error } = useListDonBanHang(searchParams);

    // Sử dụng useGetDonBanHangBySttRec để lấy detail data cho việc in
    const {
        data: donBanHangDetailData,
        isLoading: isLoadingDonBanHangDetail,
    } = useGetDonBanHangBySttRec(selectedPrintId, {
        enabled: !!selectedPrintId,
    });

    const deleteMutation = useDeletePhieu();

    // Print functionality
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Đơn Bán Hàng - ${printData?.donHangData?.so_ct || 'DBH'}`,
        onAfterPrint: () => {
            // Clear print data sau khi in xong
            setPrintData(null);
            setSelectedPrintId(null);
        }
    });

    const handlePrintClick = async (record, e) => {
        e.stopPropagation();

        try {
            // Set selected print ID để trigger useGetDonBanHangBySttRec
            setSelectedPrintId(record.stt_rec);

            // Đợi data load xong
            setTimeout(() => {
                if (donBanHangDetailData) {
                    const donHangData = donBanHangDetailData;
                    const hangHoaData = donBanHangDetailData.hangHoa || [];

                    // Set print data
                    setPrintData({
                        donHangData: donHangData,
                        hangHoaData: hangHoaData,
                    });

                    // Trigger print
                    setTimeout(() => {
                        handlePrint();
                    }, 100);
                }
            }, 500);

        } catch (error) {
            console.error("Error fetching data for print:", error);
            toast.error("Không thể tải dữ liệu để in");
        }
    };

    // Effect để xử lý khi có donBanHangDetailData mới
    useEffect(() => {
        if (donBanHangDetailData && selectedPrintId) {
            const donHangData = donBanHangDetailData;
            const hangHoaData = donBanHangDetailData.hangHoa || [];

            // Tính tổng tiền từ hangHoa
            const tongTienHang = hangHoaData.reduce((sum, item) => {
                return sum + (parseFloat(item.tien_nt2) || parseFloat(item.tien_nt) || 0);
            }, 0);

            const tongTienThue = hangHoaData.reduce((sum, item) => {
                return sum + (parseFloat(item.thue_nt) || 0);
            }, 0);

            // Set print data
            setPrintData({
                donHangData: donHangData,
                hangHoaData: hangHoaData,
                tongTienHang: tongTienHang || donHangData?.t_tien_nt2 || 0,
                tongTienThue: tongTienThue || donHangData?.t_thue || 0,
                tongThanhToan: (tongTienHang + tongTienThue) || donHangData?.t_tt_nt || 0
            });

            // Trigger print
            setTimeout(() => {
                handlePrint();
                setSelectedPrintId(null); // Reset sau khi in
            }, 100);
        }
    }, [donBanHangDetailData, selectedPrintId]);

    const dataTable = useMemo(() => {
        let rawData = [];

        // Xử lý trường hợp data null (do AbortError)
        if (!fetchDonBanHangData) {
            return [];
        }

        if (fetchDonBanHangData?.data?.items && Array.isArray(fetchDonBanHangData.data.items)) {
            rawData = fetchDonBanHangData.data.items;
        }
        else if (fetchDonBanHangData?.items && Array.isArray(fetchDonBanHangData.items)) {
            rawData = fetchDonBanHangData.items;
        }
        else if (fetchDonBanHangData?.data && Array.isArray(fetchDonBanHangData.data)) {
            rawData = fetchDonBanHangData.data;
        }
        else if (Array.isArray(fetchDonBanHangData)) {
            rawData = fetchDonBanHangData;
        }

        // Thêm stt
        return rawData.map((item, index) => ({
            ...item,
            stt: index + 1,
        }));
    }, [fetchDonBanHangData]);

    // Get total items and total pages from API response
    const totalItems = useMemo(() => {
        if (!fetchDonBanHangData) {
            return 0;
        }

        if (fetchDonBanHangData?.data?.totalItems) {
            return fetchDonBanHangData.data.totalItems;
        }
        if (fetchDonBanHangData?.totalItems) {
            return fetchDonBanHangData.totalItems;
        }
        if (fetchDonBanHangData?.data?.total) {
            return fetchDonBanHangData.data.total;
        }
        if (fetchDonBanHangData?.total) {
            return fetchDonBanHangData.total;
        }
        return dataTable.length;
    }, [fetchDonBanHangData, dataTable.length]);

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
        setLoading(isLoadingDonBanHang || isLoadingDonBanHangDetail || deleteMutation.isPending);
    }, [isLoadingDonBanHang, isLoadingDonBanHangDetail, deleteMutation.isPending]);

    // Log error nếu không phải AbortError
    useEffect(() => {
        if (error && error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
            console.error('Error in useDonBanHangList:', error);
        }
    }, [error]);

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
                refetchDonBanHangData();
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
            const hangHoaWithSTT = Array.isArray(record.hangHoa)
                ? record.hangHoa.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                }))
                : [];

            record.hangHoa = hangHoaWithSTT;
            record.children = hangHoaWithSTT;
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
            title: "Ngày LP",
            dataIndex: "ngay_lct",
            fixed: "left",
            width: 140,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
        },
        {
            key: "so_ct",
            title: "Số ĐBH",
            dataIndex: "so_ct",
            fixed: "left",
            width: 140,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "ma_hd_me",
            title: "Số đơn hàng mẹ",
            dataIndex: "ma_hd_me",
            width: 140,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "ngay_ct",
            title: "Ngày HT",
            dataIndex: "ngay_ct",
            width: 140,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
        },
        {
            key: "t_tien_nt2",
            title: "Tiền hàng",
            dataIndex: "t_tien_nt2",
            width: 140,
            render: (val) => (
                <div className="font-mono text-sm text-center text-blue-600">
                    {formatCurrency(val)}
                </div>
            ),
        },
        {
            key: "t_thue",
            title: "Tiền thuế",
            dataIndex: "t_thue",
            width: 140,
            render: (val) => (
                <div className="font-mono text-sm text-center text-purple-600">
                    {formatCurrency(val)}
                </div>
            ),
        },
        {
            key: "t_tt_nt",
            title: "Tổng tiền TT",
            dataIndex: "t_tt_nt",
            width: 160,
            render: (val) => (
                <div className="font-mono text-sm text-center text-red-600 font-semibold">
                    {formatCurrency(val)}
                </div>
            ),
        },
        {
            key: "ma_kh",
            title: "Mã KH",
            dataIndex: "ma_kh",
            width: 140,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
            dataIndex: "dien_giai",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "tk_thue_no",
            title: "TK có",
            dataIndex: "tk_thue_no",
            width: 120,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ma_nx",
            title: "Mã NX",
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
            width: 130,
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <button
                            className="text-gray-500 hover:text-blue-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="In đơn bán hàng"
                            onClick={(e) => handlePrintClick(record, e)}
                            disabled={isLoadingDonBanHangDetail}
                        >
                            <Printer size={16} />
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
            dataIndex: "ma_vt",
            fixed: "left",
            width: 120,
            render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
        },
        {
            key: "ma_kho_i",
            title: "Mã kho",
            dataIndex: "ma_kho_i",
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
            dataIndex: "so_luong",
            width: 100,
            render: (val) => (
                <span className="text-center block text-blue-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "gia_nt",
            title: "Đơn giá",
            dataIndex: "gia_nt",
            width: 120,
            render: (val) => (
                <span className="text-center block text-green-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "tien_nt",
            title: "Tiền hàng",
            dataIndex: "tien_nt",
            width: 120,
            render: (val) => (
                <span className="text-center block text-blue-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "tl_ck",
            title: "TL CK (%)",
            dataIndex: "tl_ck",
            width: 100,
            render: (val) => (
                <span className="text-center block text-orange-600">
                    {val || "0"}%
                </span>
            ),
        },
        {
            key: "ck_nt",
            title: "Tiền CK",
            dataIndex: "ck_nt",
            width: 120,
            render: (val) => (
                <span className="text-center block text-orange-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "tien_nt2",
            title: "Thành tiền",
            dataIndex: "tien_nt2",
            width: 120,
            render: (val) => (
                <span className="text-center block text-red-600 font-medium">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "thue_suat",
            title: "Thuế suất (%)",
            dataIndex: "thue_suat",
            width: 120,
            render: (val) => (
                <span className="text-center block">
                    {val || "0"}%
                </span>
            ),
        },
        {
            key: "thue_nt",
            title: "Tiền thuế",
            dataIndex: "thue_nt",
            width: 120,
            render: (val) => (
                <span className="text-center block text-purple-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "tk_vt",
            title: "TK vật tư",
            dataIndex: "tk_vt",
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
        fetchDonBanHangData,

        // Modals
        isOpenCreate,
        openModalCreate,
        closeModalCreate,
        isOpenEdit,
        openModalEdit,
        closeModalEdit,
        selectedEditId,
        setSelectedEditId,

        // Print functionality
        printRef,
        printData,
        handlePrintClick,
    };
};