import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import Badge from "../../../components/ui/badge/Badge";
import { useDeleteDmvt, useDmvt } from '../../../hooks/useDmvt';
import { useModal } from "../../../hooks/useModal";

export const useListMaterial = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();


    // Parse date range
    const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
    const dateFrom = dateRange[0] || undefined;
    const dateTo = dateRange[1] || undefined;
    const [status, setStatus] = useState("");

    // Query params
    const queryParams = {
        search: searchValue || undefined,
        dateFrom,
        dateTo,
        page: currentPage,
        limit: 10,
        status: status || undefined,
    };

    // Fetch data
    const { data: materialData, isLoading, error, refetch } = useDmvt(queryParams);
    const deleteMaterialMutation = useDeleteDmvt();
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        material: null,
    });

    const handleSaveCreate = () => {
        refetch();
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        refetch();
        closeModalEdit();
    };

    const handleEditMaterial = (record) => {
        setSelectedMaterial(record);
        openModalEdit();
    };

    const handleDeleteMaterial = (record) => {
        setConfirmDelete({
            open: true,
            material: record,
        });
    };

    const confirmDeleteMaterial = async () => {
        try {
            await deleteMaterialMutation.mutateAsync(confirmDelete.material.ma_vt);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, material: null });
        }
    };

    const cancelDeleteMaterial = () => {
        setConfirmDelete({ open: false, material: null });
    };

    const columnsTable = [
        {
            key: "ma_vt",
            title: "Mã vật tư",
            fixed: "left",
            width: 150,
            render: (val) => {
                return <div className="text-center">{val}</div>;
            },
        },
        {
            key: "ten_vt",
            title: "Tên vật tư",
            fixed: "left",
            width: 200,
            render: (val) => {
                return <div className="text-center">{val}</div>;
            },
        },
        {
            key: "dvt",
            title: "Đơn vị tính",
            width: 120,
        },
        {
            key: "loai_vt",
            title: "Loại vật tư",
            width: 150,
            render: (val) => {
                const loaiVT = val === "21" ? "Nguyên vật liệu" : "Khác";
                return <span>{loaiVT}</span>;
            },
        },
        {
            key: "vt_ton_kho",
            title: "Theo dõi tồn kho",
            width: 150,
            render: (val) => {
                const text = val === "1" ? "Có" : "Không";
                const badgeColor = val === "1" ? "success" : "warning";
                return (
                    <Badge size="sm" color={badgeColor}>
                        {text}
                    </Badge>
                );
            },
        },
        {
            key: "tk_vt",
            title: "Tài khoản kho",
            width: 150,
        },
        {
            key: "tk_dt",
            title: "TK doanh thu",
            width: 150,
        },
        {
            key: "tk_gv",
            title: "TK giá vốn",
            width: 150,
        },
        {
            key: "nh_vt1",
            title: "Nhóm vật tư 1",
            width: 120,
        },
        {
            key: "nh_vt2",
            title: "Nhóm vật tư 2",
            width: 120,
        },
        {
            key: "nh_vt3",
            title: "Nhóm vật tư 3",
            width: 120,
        },
        {
            key: "sl_min",
            title: "SL tồn tối thiểu",
            width: 150,
            render: (val) => {
                return <span>{parseFloat(val || 0).toFixed(3)}</span>;
            },
        },
        {
            key: "sl_max",
            title: "SL tồn tối đa",
            width: 150,
            render: (val) => {
                return <span>{parseFloat(val || 0).toFixed(3)}</span>;
            },
        },
        {
            key: "ghi_chu",
            title: "Ghi chú",
            width: 200,
        },
        {
            key: "status",
            title: "Trạng thái",
            width: 150,
            render: (val) => {
                const statusText = val === "1" ? "Sử dụng" : val === "0" ? "Không sử dụng" : "Không xác định";
                const badgeColor = val === "1" ? "success" : val === "0" ? "warning" : "error";

                return (
                    <Badge size="sm" color={badgeColor}>
                        {statusText}
                    </Badge>
                );
            },
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
                        onClick={() => handleEditMaterial(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteMaterial(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deleteMaterialMutation.isLoading}
                    >
                        <Trash size={18} />
                    </button>
                </div>
            ),
        },
    ];

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
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    return {
        // Modal states
        isOpenCreate,
        isOpenEdit,
        selectedMaterial,

        // Data
        dataTable: materialData?.data || [],
        columnsTable,
        pagination: materialData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },

        // Form states
        rangePickerValue,
        searchValue,

        // Loading states
        isLoading,
        error,
        isDeleting: deleteMaterialMutation.isLoading,

        // Modal handlers
        openModalCreate,
        closeModalCreate,
        closeModalEdit,

        // Form handlers
        handleRangePicker,
        handleSearch,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,

        // Utility
        refetch,
        status,
        setStatus,

        confirmDelete,
        confirmDeleteMaterial,
        cancelDeleteMaterial,
    };
};