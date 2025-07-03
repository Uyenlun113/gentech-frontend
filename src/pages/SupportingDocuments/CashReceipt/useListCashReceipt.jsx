import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useAccounts, useDeleteAccount } from "../../../hooks/useAccounts";
import { useModal } from "../../../hooks/useModal";

export const useListCashReceipt = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
    const { isOpen: isOpenDetail, openModal: openModalDetail, closeModal: closeModalDetail } = useModal();

    // Parse date range
    const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
    const dateFrom = dateRange[0] || undefined;
    const dateTo = dateRange[1] || undefined;
    const [loaiTk, setLoaiTk] = useState("");

    // Query params (Thêm các trường mới vào query)
    const queryParams = {
        search: searchValue || undefined,
        dateFrom,
        dateTo,
        page: currentPage,
        limit: 15,
        // Các trường mới
        loaiPhieuThu: null,
        maKhach: null,
        diaChi: null,
        nguoiNop: null,
        lyDoNop: null,
        tkNo: null,
        ngayHachToan: null,
        ngayLapPhieu: null,
        quyenSo: null,
        soPhieuThu: null,
        tggd: null,
        trangThai: null,
        MST: null,
    };

    // Fetch data
    const { data: accountData, isLoading, error, refetch } = useAccounts(queryParams);
    const deleteAccountMutation = useDeleteAccount();
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        account: null,
    });

    const handleSaveCreate = () => {
        refetch();
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        refetch();
        closeModalEdit();
    };

    const handleEditAccount = (record) => {
        setSelectedAccount(record);
        openModalEdit();
    };

    const handleDeleteAccount = (record) => {
        setConfirmDelete({
            open: true,
            account: record,
        });
    };

    const confirmDeleteAccount = async () => {
        try {
            await deleteAccountMutation.mutateAsync(confirmDelete.account.tk);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, account: null });
        }
    };

    const cancelDeleteAccount = () => {
        setConfirmDelete({ open: false, account: null });
    };

    // Định nghĩa các cột của bảng, thêm các trường mới
    const columnsTable = [
    {
        key: "soPhieuThu",
        title: "Số phiếu thu",
        fixed: "left",
        width: 150,
    },
    {
        key: "ngayHachToan",
        title: "Ngày hạch toán",
        fixed: "left",
        width: 150,
    },
    {
        key: "tkNo",
        title: "Tài khoản nợ",
        width: 150,
    },
    {
        key: "loaiPhieuThu",
        title: "Loại phiếu thu",
        width: 150,
    },
    {
        key: "maKhach",
        title: "Mã khách",
        width: 150,
    },
    {
        key: "diaChi",
        title: "Địa chỉ",
        width: 200,
    },
    {
        key: "nguoiNop",
        title: "Người nộp",
        width: 150,
    },
    {
        key: "lyDoNop",
        title: "Lý do nộp",
        width: 200,
    },
    {
        key: "quyenSo",
        title: "Quyển số",
        width: 100,
    },
    {
        key: "soPhieuThu",
        title: "Số phiếu thu",
        width: 150,
    },
    {
        key: "tggd",
        title: "T/g giao dịch",
        width: 150,
    },
    {
        key: "trangThai",
        title: "Trạng thái",
        width: 150,
    },
    {
        key: "MST",
        title: "MST",
        width: 150,
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
                    onClick={() => handleEditAccount(record)}
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={() => handleDeleteAccount(record)}
                    className="text-gray-500 hover:text-red-500"
                    title="Xoá"
                    disabled={deleteAccountMutation.isLoading}
                >
                    <Trash size={18} />
                </button>
            </div>
        ),
    },
];


    // Các hàm xử lý input cho các trường mới nếu cần
    const handleInputChange = (field, value) => {
        // Cập nhật giá trị cho các trường mới nếu có form chỉnh sửa
        // Ví dụ: setSelectedAccount({ ...selectedAccount, [field]: value });
    };

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
        // Modal states
        isOpenCreate,
        isOpenEdit,
        isOpenDetail,
        selectedAccount,

        // Data
        dataTable: accountData?.data || [],
        columnsTable,
        pagination: accountData?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },

        // Form states
        rangePickerValue,
        searchValue,

        // Loading states
        isLoading,
        error,
        isDeleting: deleteAccountMutation.isLoading,

        // Modal handlers
        openModalCreate,
        closeModalCreate,
        closeModalEdit,
        closeModalDetail,

        // Form handlers
        handleRangePicker,
        handleSearch,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,

        // Utility
        refetch,
        setLoaiTk,
        handleInputChange,

        confirmDelete,
        confirmDeleteAccount,
        cancelDeleteAccount,
    };
};
