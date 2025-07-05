import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useDeleteDmkho, useDmkho } from "../../../hooks/useDmkho";
import { useModal } from "../../../hooks/useModal";

export const useListWarehouse = () => {
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

    // Query params
    const queryParams = {
        search: searchValue || undefined,
        page: currentPage,
        limit: 15,
    };

    // Fetch data
    const { data: warehouseData, isLoading, error, refetch } = useDmkho(queryParams);
    const deleteWarehouseMutation = useDeleteDmkho();

    // Delete confirmation state
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        warehouse: null,
    });

    // Edit confirmation state
    const [confirmEdit, setConfirmEdit] = useState({
        open: false,
        warehouse: null,
    });

    const handleSaveCreate = () => {
        closeModalCreate();
        refetch();
    };

    const handleSaveEdit = () => {
        closeModalEdit();
        refetch();
    };

    const handleEditWarehouse = (record) => {
        setConfirmEdit({
            open: true,
            warehouse: record,
        });
    };

    const confirmEditWarehouse = () => {
        setSelectedWarehouse(confirmEdit.warehouse);
        setConfirmEdit({ open: false, warehouse: null });
        openModalEdit();
    };

    const cancelEditWarehouse = () => {
        setConfirmEdit({ open: false, warehouse: null });
    };

    const handleDeleteWarehouse = (record) => {
        setConfirmDelete({
            open: true,
            warehouse: record,
        });
    };

    const confirmDeleteWarehouse = async () => {
        try {
            await deleteWarehouseMutation.mutateAsync(confirmDelete.warehouse.ma_kho);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, warehouse: null });
        }
    };

    const cancelDeleteWarehouse = () => {
        setConfirmDelete({ open: false, warehouse: null });
    };

    const columnsTable = [
        {
            key: "ma_kho",
            title: "Mã kho",
            fixed: "left",
            width: 150,
            render: (_, record) => {
                return <div className="font-medium text-center">{record?.ma_kho}</div>;
            },
        },
        {
            key: "ten_kho",
            title: "Tên kho",
            render: (_, record) => {
                return <div>{record?.ten_kho}</div>;
            },
        },
        {
            key: "ma_dvcs",
            title: "Mã đơn vị cơ sở",
            render: (_, record) => {
                return <div>{record?.ma_dvcs || "-"}</div>;
            },
        },
        {
            key: "tk_dl",
            title: "Tài khoản đại lý",
            render: (_, record) => {
                return (
                    <div className="text-center">
                        {record?.tk_dl ? (
                            <span >
                                {record.tk_dl}
                            </span>
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                    </div>
                );
            },
        },
        {
            key: "status",
            title: "Trạng thái",
            align: "center",
            width: 120,
            render: (_, record) => {
                const isActive = record?.status === "1";
                return (
                    <div className="text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                            }`}>
                            {isActive ? "Sử dụng" : "Không sử dụng"}
                        </span>
                    </div>
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
                        onClick={() => handleEditWarehouse(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteWarehouse(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deleteWarehouseMutation.isLoading}
                    >
                        <Trash size={18} />
                    </button>
                </div>
            ),
        },
    ];

    const handleSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
    };

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    return {
        isOpenCreate,
        isOpenEdit,
        selectedWarehouse,
        dataTable: warehouseData?.data || [],
        columnsTable,
        pagination: warehouseData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
        searchValue,
        isLoading,
        error,
        isDeleting: deleteWarehouseMutation.isLoading,
        openModalCreate,
        closeModalCreate,
        closeModalEdit,
        handleSearch,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,
        refetch,
        confirmDelete,
        confirmDeleteWarehouse,
        cancelDeleteWarehouse,

        // Edit confirmation
        confirmEdit,
        confirmEditWarehouse,
        cancelEditWarehouse,
    };
};