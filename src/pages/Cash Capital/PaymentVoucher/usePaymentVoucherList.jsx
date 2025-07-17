import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal";

import { useCt46List, useDeleteCt46Accounting, useFetchCt46Data } from "../../../hooks/usePhieuChi";
import ct46Api from "../../../services/phieu-chi";

export const usePaymentVoucherList = () => {
    const [selectedEditId, setSelectedEditId] = useState();

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

    const [rangePickerValue, setRangePickerValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showCt46Table, setShowCt46Table] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
    const { data: fetchPh46Data, isLoading: isLoadingPh46, refetch: refetchPh46Data } = useCt46List();
    const {
        data: fetchCt46Data,
        isLoading: isLoadingCt46,
        error: errorCt46,
    } = useFetchCt46Data(selectedRecord?.stt_rec || "", {
        enabled: !!selectedRecord?.stt_rec,
    });

    const deleteMutation = useDeleteCt46Accounting();
    const dataTable = useMemo(() => {
        if (fetchPh46Data?.data?.items && Array.isArray(fetchPh46Data.data.items)) {
            return fetchPh46Data.data.items;
        }
        else if (fetchPh46Data?.items && Array.isArray(fetchPh46Data.items)) {
            return fetchPh46Data.items;
        }
        else if (fetchPh46Data?.data && Array.isArray(fetchPh46Data.data)) {
            return fetchPh46Data.data;
        }
        else if (Array.isArray(fetchPh46Data)) {
            return fetchPh46Data;
        }

        return [];
    }, [fetchPh46Data]);

    const dataCt46Table = useMemo(() => {
        if (fetchCt46Data?.status === 200 && Array.isArray(fetchCt46Data.data)) {
            return fetchCt46Data.data;
        }
        return [];
    }, [fetchCt46Data?.status, fetchCt46Data?.data]);

    useEffect(() => {
        setLoading(isLoadingPh46 || isLoadingCt46 || deleteMutation.isPending);
    }, [isLoadingPh46, isLoadingCt46, deleteMutation.isPending]);

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
            if (selectedRecord?.stt_rec === recordToDelete.stt_rec) {
                handleCloseCt46Table();
            }
            closeModalDelete();
            setRecordToDelete(null);
            refetchPh46Data();
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
            const res = await ct46Api.fetchCt46Data(record.stt_rec);
            if (Array.isArray(res)) {
                const children = res.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                }));
                record.children = children;
            } else {
                record.children = [];
            }

            setSelectedRecord(record);
            setShowCt46Table(true);
        } catch (error) {
            console.error("Failed to fetch CT46 data:", error);
            toast.error("Không thể tải dữ liệu chi tiết");
        }
    };

    const handleCloseCt46Table = () => {
        setShowCt46Table(false);
        setSelectedRecord(null);
    };

    const handleOpenEdit = (id) => {
        setSelectedEditId(id);
        openModalEdit();
    };

    const [tienMap, setTienMap] = useState({});

    // FIX: Improved tienMap calculation
    useEffect(() => {
        const fetchAllCt46Data = async () => {
            if (!dataTable?.length) {
                console.warn("Không có dataTable để tính tổng tiền");
                setTienMap({});
                return;
            }

            try {
                // Filter out invalid stt_rec values
                const sttRecList = dataTable
                    .map((item) => item.stt_rec?.toString()?.trim())
                    .filter(Boolean)
                    .filter((item) => item !== "");

                if (sttRecList.length === 0) {
                    console.warn("Không có stt_rec hợp lệ");
                    setTienMap({});
                    return;
                }
                // Remove duplicates
                const uniqueSttRecList = [...new Set(sttRecList)];
                const res = await ct46Api.fetchCt46Data(uniqueSttRecList);

                let ct46Data = [];

                // Handle different response formats
                if (res?.status === 200 && Array.isArray(res.data)) {
                    ct46Data = res.data;
                } else if (Array.isArray(res)) {
                    ct46Data = res;
                } else if (res?.data && Array.isArray(res.data)) {
                    ct46Data = res.data;
                } else {
                    console.warn("CT46 API không trả về dữ liệu hợp lệ:", res);
                    setTienMap({});
                    return;
                }

                // Calculate tien sum for each stt_rec
                const newTienMap = {};
                ct46Data.forEach((item) => {
                    const key = item.stt_rec?.toString()?.trim();
                    const tienValue = parseFloat(item.tien) || 0;

                    if (key) {
                        if (!newTienMap[key]) {
                            newTienMap[key] = 0;
                        }
                        newTienMap[key] += tienValue;
                    }
                });
                setTienMap(newTienMap);

            } catch (err) {
                console.error("Lỗi khi fetch CT46 all:", err);
                setTienMap({});
            }
        };

        fetchAllCt46Data();
    }, [dataTable]); // Changed dependency to just dataTable

    const columnsTable = [
        {
            key: "stt",
            title: "STT",
            width: 50,
            fixed: "left",
            render: (_, record) => {
                return <div className="font-medium text-center">{record?.stt}</div>;
            },
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
            title: "Số phiếu chi",
            fixed: "left",
            width: 120,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "tien_total",
            title: "Tổng tiền tt ngoại tệ",
            width: 140,
            render: (_, record) => {
                // FIX: Improved total calculation with better fallback
                const sttRecKey = record.stt_rec?.toString()?.trim();
                const calculatedTotal = tienMap[sttRecKey];
                const fallbackTotal = record.t_tien || record.tien_total || 0;
                const displayTotal = calculatedTotal !== undefined ? calculatedTotal : fallbackTotal;

                return (
                    <div className="font-mono text-sm text-center text-blue-600">
                        {formatCurrency(displayTotal)}
                    </div>
                );
            },
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
            key: "ma_nt",
            title: "Mã ngoại tệ",
            width: 180,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },

        {
            key: "tk",
            title: "Tài khoản",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ty_gia",
            title: "Tỷ giá",
            width: 100,
            render: (val) => <div className="text-center">{formatCurrency(val)}</div>,
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
                            onClick={() => handleOpenEdit(record?.stt_rec)}
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

    // Columns for Ct46 sub-table
    const columnsSubTable = [
        {
            key: "stt",
            title: "STT",
            width: 50,
            fixed: "left",
            render: (_, record) => <div className="text-center">{record.stt}</div>,
        },
        {
            key: "tk_i",
            title: "Tài khoản nợ",
            fixed: "left",
            width: 150,
            render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
        },
        {
            key: "tien",
            title: "Phát sinh nợ ngoại tệ",
            width: 200,
            render: (val) => (
                <span className="text-center block text-blue-600">
                    {formatCurrency(val)}
                </span>
            ),
        },
        {
            key: "dien_giaii",
            title: "Diễn giải",
            width: 200,
            render: (val) => (
                <div className="text-center truncate" title={val}>
                    {val || "-"}
                </div>
            ),
        },
    ];

    // Filtered data based on search term và date range
    const filteredDataTable = useMemo(() => {
        let filtered = [...dataTable];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.so_ct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.stt_rec?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.ma_kh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.dien_giai?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by date range
        if (rangePickerValue && rangePickerValue.length === 2) {
            const [startDate, endDate] = rangePickerValue;
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.ngay_lct || item.ngay_ct);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        return filtered.map((item, index) => ({
            ...item,
            stt: index + 1,
        }));
    }, [dataTable, searchTerm, rangePickerValue]);

    const handleRangePicker = (date) => {
        setRangePickerValue(date);
    };

    const handleChangePage = (page) => {
        console.log("Page changed to:", page);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    return {
        dataTable: filteredDataTable,
        dataCt46Table,
        columnsTable,
        columnsSubTable,
        rangePickerValue,
        loading,
        searchTerm,
        selectedRecord,
        showCt46Table,
        isLoadingCt46,
        errorCt46,
        recordToDelete,
        isOpenDelete,
        handleRangePicker,
        handleChangePage,
        handleSearch,
        handleRowClick,
        handleCloseCt46Table,
        handleConfirmDelete,
        handleCancelDelete,
        setSelectedRecord,
        deleteMutation,
        fetchCt46Data,
        fetchPh46Data,
        isOpenCreate,
        openModalCreate,
        closeModalCreate,
        isOpenEdit,
        openModalEdit,
        closeModalEdit,
        selectedEditId,
        setSelectedEditId,
        tienMap,
    };
};