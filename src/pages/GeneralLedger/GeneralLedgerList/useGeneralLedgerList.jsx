import { Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useDeleteGeneralAccounting,
  useFetchCt11Data,
  useGetGeneralAccounting,
} from "../../../hooks/useGeneralAccounting.js";
import { useModal } from "../../../hooks/useModal";
import generalLedgerApi from "../../../services/generalLedger";

export const useGeneralLedgerList = () => {
  const [selectedEditId, setSelectedEditId] = useState();

  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

  const [rangePickerValue, setRangePickerValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCt11Table, setShowCt11Table] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const { data: fetchPh11Data, isLoading: isLoadingPh11, refetch: refetchPh11Data } = useGetGeneralAccounting();
  const {
    data: fetchCt11Data,
    isLoading: isLoadingCt11,
    error: errorCt11,
  } = useFetchCt11Data(selectedRecord?.stt_rec || "", {
    enabled: !!selectedRecord?.stt_rec,
  });

  const deleteMutation = useDeleteGeneralAccounting();

  const dataTable = useMemo(() => {
    if (fetchPh11Data?.status === 200 && fetchPh11Data?.items) {
      return fetchPh11Data.items;
    }
    return [];
  }, [fetchPh11Data]);

  const dataCt11Table = useMemo(() => {
    if (fetchCt11Data?.status === 200 && fetchCt11Data?.data) {
      return fetchCt11Data.data;
    }
    return [];
  }, [fetchCt11Data]);

  useEffect(() => {
    setLoading(isLoadingPh11 || isLoadingCt11 || deleteMutation.isPending);
  }, [isLoadingPh11, isLoadingCt11, deleteMutation.isPending]);

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
      console.log("Deleting:", recordToDelete);

      await deleteMutation.mutateAsync(recordToDelete.stt_rec);

      toast.success("Xóa thành công!");
      if (selectedRecord?.stt_rec === recordToDelete.stt_rec) {
        handleCloseCt11Table();
      }

      closeModalDelete();
      setRecordToDelete(null);
      refetchPh11Data();
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
    setSelectedRecord(record);
    setShowCt11Table(true);
    console.log("Selected record:", record);

    try {
      const res = await generalLedgerApi.fetchCt11Data(record.stt_rec);
      if (res?.status === 200 && Array.isArray(res.data)) {
        record.children = res.data;
      } else {
        record.children = [];
      }
    } catch (error) {
      console.error("Failed to fetch CT11 data:", error);
      record.children = [];
      toast.error("Không thể tải dữ liệu chi tiết");
    }
  };

  const handleCloseCt11Table = () => {
    setShowCt11Table(false);
    setSelectedRecord(null);
  };

  const handleOpenEdit = (id) => {
    setSelectedEditId(id);
    openModalEdit();
  };

  const columnsTable = [
    {
      key: "ma_ct",
      title: "Mã chứng từ",
      fixed: "left",
      width: 100,
      render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
    },
    {
      key: "stt_rec",
      title: "STT Record",
      fixed: "left",
      width: 140,
      render: (val) => <div className="font-mono text-sm text-center">{val || "-"}</div>,
    },
    {
      key: "ngay_lct",
      title: "Ngày lập chứng từ",
      width: 140,
      render: (val) => formatDate(val),
    },
    {
      key: "ngay_ct",
      title: "Ngày chứng từ",
      width: 140,
      render: (val) => formatDate(val),
    },
    {
      key: "dien_giai",
      title: "Diễn giải",
      width: 150,
      render: (val) => (
        <div className="max-w-xs truncate text-center" title={val}>
          {val || "-"}
        </div>
      ),
    },
    {
      key: "ty_giaf",
      title: "Tỷ giá",
      width: 120,
      render: (val) => formatCurrency(val),
    },
    {
      key: "action",
      title: "Thao tác",
      fixed: "right",
      width: 100,
      render: (_, record) => {
        console.log(record);
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

  // Columns for Ct11 sub-table
  const columnsSubTable = [
    {
      key: "tk_i",
      title: "Tài khoản",
      fixed: "left",
      width: 120,
      render: (val) => <span className="font-mono">{val || "-"}</span>,
    },
    {
      key: "ps_no",
      title: "PS Nợ",
      width: 120,
      render: (val) => <span className="text-center block">{formatCurrency(val)}</span>,
    },
    {
      key: "ps_co",
      title: "PS Có",
      width: 120,
      render: (val) => <span className="text-center block">{formatCurrency(val)}</span>,
    },
    {
      key: "nh_dk",
      title: "NH ĐK",
      width: 80,
      render: (val) => val || "-",
    },
    {
      key: "dien_giaii",
      title: "Diễn giải",
      width: 250,
      render: (val) => (
        <div className="text-center truncate" title={val}>
          {val || "-"}
        </div>
      ),
    },
    {
      key: "ngay_ct",
      title: "Ngày chứng từ",
      width: 120,
      render: (val) => formatDate(val),
    },
  ];

  // Filtered data based on search term và date range
  const filteredDataTable = useMemo(() => {
    let filtered = [...dataTable];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.ma_ct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.stt_rec?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.dien_giai?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (rangePickerValue && rangePickerValue.length === 2) {
      const [startDate, endDate] = rangePickerValue;
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.ngay_ct);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filtered;
  }, [dataTable, searchTerm, rangePickerValue]);

  const handleRangePicker = (date) => {
    setRangePickerValue(date);
  };

  const handleChangePage = (page) => {
    console.log("Page changed to:", page);
    // Add pagination logic here
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return {
    dataTable: filteredDataTable,
    dataCt11Table,
    columnsTable,
    columnsSubTable,
    rangePickerValue,
    loading,
    searchTerm,
    selectedRecord,
    showCt11Table,
    isLoadingCt11,
    errorCt11,
    recordToDelete,
    isOpenDelete,
    handleRangePicker,
    handleChangePage,
    handleSearch,
    handleRowClick,
    handleCloseCt11Table,
    handleConfirmDelete,
    handleCancelDelete,
    setSelectedRecord,
    // Export thêm các state và function cần thiết
    deleteMutation,
    fetchCt11Data,
    fetchPh11Data,
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
