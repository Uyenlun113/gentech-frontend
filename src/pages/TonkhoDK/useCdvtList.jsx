// hooks/useCdvtListData.js
import { Edit2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { useCdvtList, useDeleteCdvt } from "../../hooks/useCdvt";
import { useModal } from "../../hooks/useModal";

export const useCdvtListData = (ma_kho, nam) => {
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const [recordToDelete, setRecordToDelete] = useState(null);
    const [editData, setEditData] = useState(null);

    // Modal management
    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();

    // API hooks
    const { data: response, isLoading, error, refetch } = useCdvtList(ma_kho, nam, page, limit);
    const deleteMutation = useDeleteCdvt();

    // Data processing
    const cdvtData = response?.data || [];
    const total = response?.total || 0;
    const totalPages = response?.totalPages || 1;

    const loading = isLoading || deleteMutation.isPending;

    // Format functions
    const formatNumber = (number) => {
        if (!number) return "0";
        return new Intl.NumberFormat("vi-VN").format(number);
    };

    const formatCurrency = (number) => {
        if (!number) return "0.00";
        return Number(number).toFixed(2);
    };

    // Event handlers
    const handleDeleteClick = (record, e) => {
        e.stopPropagation();
        setRecordToDelete(record);
        openModalDelete();
    };

    const handleEditClick = (record, e) => {
        e.stopPropagation();
        setEditData(record);
        openModalEdit();
    };

    const handleConfirmDelete = async () => {
        if (!recordToDelete?.ma_vt) {
            toast.error("Không có thông tin vật tư để xóa");
            return;
        }

        try {
            await deleteMutation.mutateAsync({
                ma_vt: recordToDelete.ma_vt,
                ma_kho,
                nam: parseInt(nam)
            });
            closeModalDelete();
            setRecordToDelete(null);
            refetch();
        } catch (error) {
            console.error("Error deleting record:", error);
            toast.error("Lỗi khi xóa: " + (error?.message || "Không xác định"));
        }
    };

    const handleCancelDelete = () => {
        closeModalDelete();
        setRecordToDelete(null);
    };

    const handleRowClick = (record) => {
        // Có thể implement logic để hiển thị chi tiết nếu cần
        console.log("Row clicked:", record);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1); // Reset về trang đầu khi search
    };

    const handleOpenCreate = () => {
        setEditData(null);
        openModalCreate();
    };

    // Filtered data based on search term
    const filteredDataTable = useMemo(() => {
        let filtered = cdvtData.map((item, index) => {
            const vt = item.vatTu || {};

            return {
                ...item,
                stt: (page - 1) * limit + index + 1,
                ten_vt: vt.ten_vt,
                nh_vt1: vt.nh_vt1,
                nh_vt2: vt.nh_vt2,
                nh_vt3: vt.nh_vt3,
            };
        });

        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.ma_vt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.ten_vt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.ma_kho?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    }, [cdvtData, searchTerm, page, limit]);


    // Table columns configuration
    const columnsTable = [
        {
            key: "stt",
            title: "STT",
            width: 60,
            fixed: "left",
            render: (_, record) => {
                return <div className="font-medium text-center">{record?.stt}</div>;
            },
        },
        {
            key: "ma_kho",
            title: "Mã kho",
            width: 100,
            fixed: "left",
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "ma_vt",
            title: "Mã vật tư",
            width: 120,
            fixed: "left",
            render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
        },
        {
            key: "ten_vt",
            title: "Tên vật tư",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ton00",
            title: "Tồn đầu",
            width: 120,
            render: (val) => (
                <div className="font-mono text-sm text-center text-blue-600">
                    {formatNumber(val)}
                </div>
            ),
        },
        {
            key: "du00",
            title: "Dư đầu",
            width: 120,
            render: (val) => (
                <div className="font-mono text-sm text-center text-green-600">
                    {formatNumber(val)}
                </div>
            ),
        },
        {
            key: "du_nt00",
            title: "Dư đầu NT",
            width: 120,
            render: (val) => (
                <div className="font-mono text-sm text-center text-purple-600">
                    {formatCurrency(val)}
                </div>
            ),
        },
        {
            key: "nh_vt1",
            title: "Nhóm vật tư 1",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "nh_vt2",
            title: "Nhóm vật tư 2",
            width: 200,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "nh_vt3",
            title: "Nhóm vật tư 3",
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
                            onClick={(e) => handleEditClick(record, e)}
                            disabled={loading}
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={(e) => handleDeleteClick(record, e)}
                            className="text-gray-500 hover:text-red-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa"
                            disabled={loading}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];

    // Mock fetchCdvtData function for compatibility with ShowMoreTables
    const fetchCdvtData = () => {
        return Promise.resolve([]);
    };

    // Error handling
    useEffect(() => {
        if (error) {
            toast.error("Có lỗi xảy ra khi tải dữ liệu: " + (error?.message || "Không xác định"));
        }
    }, [error]);

    return {
        dataTable: filteredDataTable,
        columnsTable,
        loading,
        currentPage: page,
        totalItems: total,
        totalPages,
        recordToDelete,
        isOpenDelete,
        isOpenCreate,
        isOpenEdit,
        editData,
        handleChangePage,
        handleSearch,
        handleRowClick,
        handleConfirmDelete,
        handleCancelDelete,
        handleOpenCreate,
        closeModalCreate,
        closeModalEdit,
        fetchCdvtData,
        refetch,
    };
};