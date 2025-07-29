import { Pencil, Printer, Trash } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/useModal";

import { useCt46ById, useCt46List, useDeleteCt46Accounting } from "../../../hooks/usePhieuChi";
import ct46Api from "../../../services/phieu-chi";

export const usePaymentVoucherList = () => {
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
  const [showCt46Table, setShowCt46Table] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
  const { data: fetchPh46Data, isLoading: isLoadingPh46, refetch: refetchPh46Data } = useCt46List();

  // Sử dụng useCt46ById để lấy detail data cho việc in
  const {
    data: ct46DetailData,
    isLoading: isLoadingCt46Detail,
  } = useCt46ById(selectedPrintId, {
    enabled: !!selectedPrintId,
  });

  const {
    data: fetchCt46Data,
    isLoading: isLoadingCt46,
    error: errorCt46,
  } = useCt46ById(selectedRecord?.stt_rec || "", {
    enabled: !!selectedRecord?.stt_rec,
  });

  const deleteMutation = useDeleteCt46Accounting();

  // Print functionality
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Phiếu Chi - ${printData?.phieuData?.so_ct || 'PC'}`,
  });

  const handlePrintClick = async (record, e) => {
    e.stopPropagation();

    try {
      // Set selected print ID để trigger useCt46ById
      setSelectedPrintId(record.stt_rec);

      // Đợi data load xong
      setTimeout(() => {
        if (ct46DetailData) {
          const phieuData = ct46DetailData.phieu || record;
          const hachToanData = ct46DetailData.hachToan || [];

          // Tính tổng tiền từ hachToan
          const totalAmount = hachToanData.reduce((sum, item) => {
            return sum + (parseFloat(item.tien) || parseFloat(item.tt) || 0);
          }, 0);

          // Set print data
          setPrintData({
            phieuData: phieuData,
            hachToanData: hachToanData,
            totalAmount: totalAmount || phieuData?.t_tien || 0
          });

          // Trigger print
          setTimeout(() => {
            handlePrint();
          }, 100);
        }
      }, 500);

    } catch (error) {
      console.error("Error fetching data for print:", error);
      toast.error("Không thể tải dữ liệu để in");
    }
  };

  // Effect để xử lý khi có ct46DetailData mới
  useEffect(() => {
    if (ct46DetailData && selectedPrintId) {
      const phieuData = ct46DetailData.phieu;
      const hachToanData = ct46DetailData.hachToan || [];

      // Tính tổng tiền từ hachToan
      const totalAmount = hachToanData.reduce((sum, item) => {
        return sum + (parseFloat(item.tien) || parseFloat(item.tt) || 0);
      }, 0);

      // Set print data
      setPrintData({
        phieuData: phieuData,
        hachToanData: hachToanData,
        totalAmount: totalAmount || phieuData?.t_tien || 0
      });

      // Trigger print
      setTimeout(() => {
        handlePrint();
        setSelectedPrintId(null); // Reset sau khi in
      }, 100);
    }
  }, [ct46DetailData, selectedPrintId]);

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
    if (fetchCt46Data?.hachToan && Array.isArray(fetchCt46Data.hachToan)) {
      return fetchCt46Data.hachToan.map((item, index) => ({
        ...item,
        stt: index + 1,
      }));
    }
    return [];
  }, [fetchCt46Data]);

  useEffect(() => {
    setLoading(isLoadingPh46 || isLoadingCt46 || isLoadingCt46Detail || deleteMutation.isPending);
  }, [isLoadingPh46, isLoadingCt46, isLoadingCt46Detail, deleteMutation.isPending]);

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
    setSelectedRecord(record);
    setShowCt46Table(true);
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

  // Tính tổng tiền cho từng phiếu từ hachToan
  useEffect(() => {
    const fetchAllCt46Data = async () => {
      if (!dataTable?.length) {
        console.warn("Không có dataTable để tính tổng tiền");
        setTienMap({});
        return;
      }

      try {
        const newTienMap = {};

        // Với mỗi record, fetch detail để tính tổng
        for (const record of dataTable) {
          const sttRec = record.stt_rec?.toString()?.trim();
          if (sttRec) {
            try {
              const detailData = await ct46Api.getCt46ById(sttRec);
              if (detailData?.hachToan && Array.isArray(detailData.hachToan)) {
                const total = detailData.hachToan.reduce((sum, item) => {
                  return sum + (parseFloat(item.tien) || parseFloat(item.tt) || 0);
                }, 0);
                newTienMap[sttRec] = total;
              }
            } catch (err) {
              console.warn(`Không thể fetch detail cho ${sttRec}:`, err);
            }
          }
        }

        setTienMap(newTienMap);

      } catch (err) {
        console.error("Lỗi khi fetch CT46 all:", err);
        setTienMap({});
      }
    };

    fetchAllCt46Data();
  }, [dataTable]);

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
      width: 130,
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2 justify-center">
            <button
              className="text-gray-500 hover:text-blue-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="In phiếu chi"
              onClick={(e) => handlePrintClick(record, e)}
              disabled={isLoadingCt46Detail}
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

  // Columns for hachToan sub-table
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
      title: "Số tiền",
      width: 150,
      render: (val) => (
        <span className="text-center block text-blue-600">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: "thue",
      title: "Thuế",
      width: 150,
      render: (val) => (
        <span className="text-center block text-green-600">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: "tt",
      title: "Tổng thanh toán",
      width: 150,
      render: (val) => (
        <span className="text-center block text-red-600 font-semibold">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: "dien_giai",
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
    printRef,
    printData,
    handlePrintClick,
  };
};