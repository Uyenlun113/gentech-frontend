import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useAccounts, useDeleteAccount } from "../../../hooks/useAccounts";
import { useModal } from "../../../hooks/useModal";
export const useListAccount = () => {
  const [rangePickerValue, setRangePickerValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

  // Parse date range
  const dateRange = rangePickerValue ? rangePickerValue.split(" to ") : [];
  const dateFrom = dateRange[0] || undefined;
  const dateTo = dateRange[1] || undefined;
  const [loaiTk, setLoaiTk] = useState("");

  // Query params
  const queryParams = {
    search: searchValue || undefined,
    dateFrom,
    dateTo,
    page: currentPage,
    limit: 14,
    nh_tk: loaiTk || undefined,
  };

  // Fetch data
  const { data: accountData, isLoading, error, refetch } = useAccounts(queryParams);
  const deleteAccountMutation = useDeleteAccount();

  // Thêm STT vào data
  const dataTableWithSTT = (accountData?.data || []).map((item, index) => ({
    ...item,
    stt: (currentPage - 1) * queryParams.limit + index + 1
  }));

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    account: null,
  });

  // Edit confirmation state
  const [confirmEdit, setConfirmEdit] = useState({
    open: false,
    account: null,
  });

  const handleSaveCreate = () => {
    closeModalCreate();
  };

  const handleSaveEdit = () => {
    closeModalEdit();
  };

  const handleEditAccount = (record) => {
    setConfirmEdit({
      open: true,
      account: record,
    });
  };

  const confirmEditAccount = () => {
    setSelectedAccount(confirmEdit.account);
    setConfirmEdit({ open: false, account: null });
    openModalEdit();
  };

  const cancelEditAccount = () => {
    setConfirmEdit({ open: false, account: null });
  };

  const handleDeleteAccount = (record) => {
    setConfirmDelete({
      open: true,
      account: record,
    });
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync(confirmDelete.account.tk0);
    } catch (error) {
      console.error("Xoá thất bại:", error);
    } finally {
      setConfirmDelete({ open: false, account: null });
    }
  };

  const cancelDeleteAccount = () => {
    setConfirmDelete({ open: false, account: null });
  };

  const columnsTable = [
    {
      key: "stt",
      title: "STT",
      fixed: "left",
      align: "center",
      width: 80,
      render: (_, record) => {
        return <div className="text-center">{record?.stt}</div>;
      }
    },
    {
      key: "tk0",
      title: "Mã tài khoản",
      fixed: "left",
      align: "center",
      width: 120,
      render: (_, record) => {
        return <div className="text-center">{record?.tk0}</div>;
      },
    },
    {
      key: "ten_tk",
      title: "Tên tài khoản",
      fixed: "left",
      width: 200,
      render: (_, record) => {
        return <div className="text-center">{record?.ten_tk}</div>;
      },
    },
    {
      key: "tk_me",
      title: "Tài khoản mẹ",
      width: 150,
    },
    {
      key: "ma_nt",
      title: "Mã ngoại tệ",
      width: 120,
    },
    {
      key: "nh_tk",
      title: "Loại tài khoản",
      width: 150,
    },
    {
      key: "action",
      title: "Thao tác",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-3 justify-center">
          <button className="text-gray-500 hover:text-amber-500" title="Sửa" onClick={() => handleEditAccount(record)}>
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
    selectedAccount,

    // Data - sử dụng data đã thêm STT
    dataTable: dataTableWithSTT,
    columnsTable,
    pagination: accountData?.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 },

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

    // Form handlers
    handleRangePicker,
    handleSearch,
    handleChangePage,
    handleSaveCreate,
    handleSaveEdit,

    // Utility
    refetch,
    loaiTk,
    setLoaiTk,

    // Delete confirmation
    confirmDelete,
    confirmDeleteAccount,
    cancelDeleteAccount,

    // Edit confirmation
    confirmEdit,
    confirmEditAccount,
    cancelEditAccount,
  };
};