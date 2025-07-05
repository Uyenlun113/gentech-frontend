import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import Badge from "../../../components/ui/badge/Badge";
import { useCustomers, useDeleteCustomer } from '../../../hooks/useCustomer';
import { useModal } from "../../../hooks/useModal";
export const useListCustomer = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

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
    const { data: customerData, isLoading, error, refetch } = useCustomers(queryParams);
    const deleteCustomerMutation = useDeleteCustomer();
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        customer: null,
    });
    const handleSaveCreate = () => {
        refetch();
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        refetch();
        closeModalEdit();
    };

    const handleEditCustomer = (record) => {
        setSelectedCustomer(record);
        openModalEdit();
    };

    const handleDeleteCustomer = (record) => {
        setConfirmDelete({
            open: true,
            customer: record,
        });
    };

    const confirmDeleteCustomer = async () => {
        try {
            await deleteCustomerMutation.mutateAsync(confirmDelete.customer.ma_kh);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, customer: null });
        }
    };

    const cancelDeleteCustomer = () => {
        setConfirmDelete({ open: false, customer: null });
    };

    const columnsTable = [
        {
            key: "ma_kh",
            title: "Mã khách hàng",
            fixed: "left",
            width: 150,
        },
        {
            key: "ten_kh",
            title: "Tên khách hàng",
            fixed: "left",
            width: 200,
        },
        {
            key: "e_mail",
            title: "Email",
            width: 200,
        },
        {
            key: "dien_thoai",
            title: "Số điện thoại",
            width: 150,
        },
        {
            key: "nh_kh1",
            title: "Nhóm khách 1",
            width: 150,
        },
        {
            key: "nh_kh2",
            title: "Nhóm khách 2",
            width: 150,
        },
        {
            key: "nh_kh3",
            title: "Nhóm khách 3",
            width: 150,

        },
        {
            key: "dia_chi",
            title: "Địa chỉ",
            width: 250,
        },
        {
            key: "ma_so_thue",
            title: "Mã số thuế",
            width: 150,
        },
        {
            key: "ma_tra_cuu",
            title: "Mã tra cứu",
            width: 150,
        },
        {
            key: "tk_nh",
            title: "Tài khoản ngân hàng",
            width: 180,
        },
        {
            key: "ten_nh",
            title: "Tên ngân hàng",
            width: 200,
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
                        onClick={() => handleEditCustomer(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteCustomer(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deleteCustomerMutation.isLoading}
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
        selectedCustomer,

        // Data
        dataTable: customerData?.data || [],
        columnsTable,
        pagination: customerData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },

        // Form states
        rangePickerValue,
        searchValue,

        // Loading states
        isLoading,
        error,
        isDeleting: deleteCustomerMutation.isLoading,

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
        confirmDeleteCustomer,
        cancelDeleteCustomer,
    };
};