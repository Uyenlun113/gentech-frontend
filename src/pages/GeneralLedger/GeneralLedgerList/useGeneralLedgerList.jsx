import { Pencil, Printer, Trash } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import {
  useDeleteGeneralAccounting,
  useFetchCt11Data,
  useGetGeneralAccounting,
  useGetGeneralAccountingById,
} from "../../../hooks/useGeneralAccounting.js";
import { useModal } from "../../../hooks/useModal";
import generalLedgerApi from "../../../services/generalLedger";

export const useGeneralLedgerList = () => {
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
  const [showCt11Table, setShowCt11Table] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const { data: fetchPh11Data, isLoading: isLoadingPh11, refetch: refetchPh11Data } = useGetGeneralAccounting();

  // Sử dụng useGetGeneralAccountingById để lấy detail data cho việc in
  const {
    data: generalDetailData,
    isLoading: isLoadingGeneralDetail,
  } = useGetGeneralAccountingById(selectedPrintId, {
    enabled: !!selectedPrintId,
  });

  const {
    data: fetchCt11Data,
    isLoading: isLoadingCt11,
    error: errorCt11,
  } = useFetchCt11Data(selectedRecord?.stt_rec || "", {
    enabled: !!selectedRecord?.stt_rec,
  });

  const deleteMutation = useDeleteGeneralAccounting();

  // Print functionality - giống như phiếu chi
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Phieu_Ke_Toan_Tong_Hop_${printData?.phieu?.so_ct || 'PK'}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `,
  });

  const handlePrintClick = async (record, e) => {
    e.stopPropagation();
    try {
      setSelectedPrintId(record.stt_rec);

    } catch (error) {
      console.error("Error fetching data for print:", error);
      toast.error("Không thể tải dữ liệu để in");
    }
  };
  useEffect(() => {
    if (generalDetailData && selectedPrintId) {
      const phieuData = generalDetailData.phieu;
      const hachToanData = generalDetailData.hachToan || [];

      if (phieuData) {
        // Set print data
        setPrintData({
          phieu: phieuData,
          hachToan: hachToanData,
        });

        // Trigger print
        setTimeout(() => {
          handlePrint();
          setSelectedPrintId(null); // Reset sau khi in
        }, 100);
      }
    }
  }, [generalDetailData, selectedPrintId]);

  const dataTable = useMemo(() => {
    if (fetchPh11Data?.status === 200 && fetchPh11Data?.items) {
      return fetchPh11Data.items;
    }
    return [];
  }, [fetchPh11Data]);

  const dataCt11Table = useMemo(() => {
    if (fetchCt11Data?.status === 200 && Array.isArray(fetchCt11Data.data)) {
      return fetchCt11Data.data
    }
    return [];
  }, [fetchCt11Data?.status, fetchCt11Data?.data]);

  useEffect(() => {
    setLoading(isLoadingPh11 || isLoadingCt11 || isLoadingGeneralDetail || deleteMutation.isPending);
  }, [isLoadingPh11, isLoadingCt11, isLoadingGeneralDetail, deleteMutation.isPending]);

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

    try {
      const res = await generalLedgerApi.fetchCt11Data(record.stt_rec);
      if (res?.status === 200 && Array.isArray(res.data)) {
        record.children = res.data.map((item, index) => ({
          ...item,
          stt: index + 1,
        }));
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

  const [psCoMap, setPsCoMap] = useState({});

  useEffect(() => {
    const fetchAllCt11Data = async () => {
      if (!dataTable?.length) {
        console.warn("Không có dataTable để tính ps_co");
        return;
      }

      try {
        const sttRecList = [...new Set(dataTable.map((item) => item.stt_rec?.trim?.()))];
        const res = await generalLedgerApi.fetchCt11Data(sttRecList);
        if (res?.status === 200 && Array.isArray(res.data)) {
          const psMap = {};
          res.data.forEach((item) => {
            const key = item.stt_rec?.trim?.();
            const psCoValue = parseFloat(item.ps_co) || 0;
            if (key) {
              if (!psMap[key]) psMap[key] = 0;
              psMap[key] += psCoValue;
            }
          });
          setPsCoMap(psMap);
        }
      } catch (err) {
        console.error("Lỗi khi fetch CT11 all:", err);
      }
    };

    fetchAllCt11Data();
  }, [JSON.stringify(dataTable)]);

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
      title: "Ngày lập chứng từ",
      fixed: "left",
      width: 140,
      render: (val) => {
        return <div className="font-medium text-center">{formatDate(val)}</div>;
      },
    },
    {
      key: "so_ct",
      title: "Số chứng từ",
      fixed: "left",
      width: 100,
      render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
    },
    {
      key: "ps_co_total",
      title: "Tổng PS ngoại tệ",
      width: 140,
      render: (_, record) => (
        <div className="font-mono text-sm text-center">
          {formatCurrency(psCoMap[record.stt_rec] || 0)}
        </div>
      ),
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
      width: 130,
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2 justify-center">
            <button
              className="text-gray-500 hover:text-blue-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="In phiếu"
              onClick={(e) => handlePrintClick(record, e)}
              disabled={isLoadingGeneralDetail}
            >
              <Printer size={16} />
            </button>
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
      key: "stt",
      title: "STT",
      width: 50,
      fixed: "left",
      render: (_, record) => <div className="text-center">{record.stt}</div>,
    },
    {
      key: "tk_i",
      title: "Tài khoản",
      fixed: "left",
      width: 120,
      render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
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
    psCoMap,
    printRef,
    printData,
    handlePrintClick,
  };
};