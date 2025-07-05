import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useCustomerGroups, useDeleteCustomerGroup } from "../../../hooks/useCustomerGroups";
import { useModal } from "../../../hooks/useModal";

export const useListCustomerGroup = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomerGroup, setSelectedCustomerGroup] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

    // Parse date range
    const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
    const dateFrom = dateRange[0] || undefined;
    const dateTo = dateRange[1] || undefined;

    // Query params
    const queryParams = {
        search: searchValue || undefined,
        dateFrom,
        dateTo,
        page: currentPage,
        limit: 15,
    };

    // Fetch data
    const { data: customerGroupsData, isLoading, error, refetch } = useCustomerGroups(queryParams);
    const deleteCustomerGroupMutation = useDeleteCustomerGroup();

    // Delete confirmation state
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        customerGroup: null,
    });

    // Edit confirmation state
    const [confirmEdit, setConfirmEdit] = useState({
        open: false,
        customerGroup: null,
    });

    const handleSaveCreate = () => {
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        closeModalEdit();
    };

    const handleEditCustomerGroup = (record) => {
        setConfirmEdit({
            open: true,
            customerGroup: record,
        });
    };

    const confirmEditCustomerGroup = () => {
        setSelectedCustomerGroup(confirmEdit.customerGroup);
        setConfirmEdit({ open: false, customerGroup: null });
        openModalEdit();
    };

    const cancelEditCustomerGroup = () => {
        setConfirmEdit({ open: false, customerGroup: null });
    };

    const handleDeleteCustomerGroup = (record) => {
        setConfirmDelete({
            open: true,
            customerGroup: record,
        });
    };

    const confirmDeleteCustomerGroup = async () => {
        try {
            await deleteCustomerGroupMutation.mutateAsync({
                ma_kh: confirmDelete.customerGroup.ma_nh,
                loai_nh: confirmDelete.customerGroup.loai_nh
            });
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, customerGroup: null });
        }
    };

    const cancelDeleteCustomerGroup = () => {
        setConfirmDelete({ open: false, customerGroup: null });
    };

    const columnsTable = [
        {
            key: "loai_nh",
            title: "Loại nhóm",
            fixed: "left",
            align: "center",
            width: 120,
            render: (_, record) => {
                return <div className="text-center">{record?.loai_nh}</div>;
            },
        },
        {
            key: "ma_nh",
            title: "Mã nhóm đối tượng",
            fixed: "left",
            width: 300,
            render: (_, record) => {
                return <div className="text-center">{record?.ma_nh}</div>;
            },
        },
        {
            key: "ten_nh",
            title: "Tên nhóm khách hàng",
            render: (_, record) => {
                return <div className="text-center ">{record?.ten_nh}</div>;
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
                        onClick={() => handleEditCustomerGroup(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteCustomerGroup(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deleteCustomerGroupMutation.isLoading}
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
        setCurrentPage(1);
    };

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    return {
        isOpenCreate,
        isOpenEdit,
        selectedCustomerGroup,
        dataTable: customerGroupsData?.data || [],
        columnsTable,
        pagination: customerGroupsData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 },
        rangePickerValue,
        searchValue,
        isLoading,
        error,
        isDeleting: deleteCustomerGroupMutation.isLoading,
        openModalCreate,
        closeModalCreate,
        closeModalEdit,
        handleRangePicker,
        handleSearch,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,
        refetch,
        confirmDelete,
        confirmDeleteCustomerGroup,
        cancelDeleteCustomerGroup,

        // Edit confirmation
        confirmEdit,
        confirmEditCustomerGroup,
        cancelEditCustomerGroup,
    };
};