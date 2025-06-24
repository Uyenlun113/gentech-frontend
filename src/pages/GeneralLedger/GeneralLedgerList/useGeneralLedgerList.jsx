import { Eye, Pencil, Trash } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFetchCt11Data, useGetGeneralAccounting } from "../../../hooks/useGeneralAccounting.TS";
import { useModal } from "../../../hooks/useModal";
import generalLedgerApi from "../../../services/generalLedger";

export const useGeneralLedgerList = () => {
  const [rangePickerValue, setRangePickerValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showCt11Table, setShowCt11Table] = useState(false);

  const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
  const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();
  const { isOpen: isOpenDetail, openModal: openModalDetail, closeModal: closeModalDetail } = useModal();

  // Fetch Ph11 data với staleTime để tránh gọi API không cần thiết
  const {
    data: fetchPh11Data,
    isLoading: isLoadingPh11,
    refetch: refetchPh11Data
  } = useGetGeneralAccounting();

  console.log("🚀 ~ useGeneralLedgerList ~ fetchPh11Data:", fetchPh11Data);
  const {
    data: fetchCt11Data,
    isLoading: isLoadingCt11,
    error: errorCt11
  } = useFetchCt11Data(selectedRecord?.stt_rec || "", {
    enabled: !!selectedRecord?.stt_rec, // Chỉ gọi API khi có stt_rec
  });

  console.log("🚀 ~ useGeneralLedgerList ~ fetchCt11Data:", fetchCt11Data);

  // Xử lý dữ liệu từ API response
  const dataTable = useMemo(() => {
    if (fetchPh11Data?.status === 200 && fetchPh11Data?.items) {
      return fetchPh11Data.items;
    }
    return [];
  }, [fetchPh11Data]);

  // Xử lý dữ liệu CT11
  const dataCt11Table = useMemo(() => {
    if (fetchCt11Data?.status === 200 && fetchCt11Data?.data) {
      return fetchCt11Data.data;
    }
    return [];
  }, [fetchCt11Data]);

  // Cập nhật loading state
  useEffect(() => {
    setLoading(isLoadingPh11 || isLoadingCt11);
  }, [isLoadingPh11, isLoadingCt11]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleSaveCreate = () => {
    console.log("Saving changes...");
    closeModalCreate();
    refetchPh11Data(); // Sử dụng refetch thay vì gọi lại toàn bộ hook
  };

  const handleSaveEdit = () => {
    console.log("Saving changes...");
    closeModalEdit();
    refetchPh11Data();
  };

  const handleDelete = async (record) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      try {
        console.log('Deleting:', record);
        // Thêm logic xóa ở đây
        refetchPh11Data();
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleRowClick = async (record) => {
    setSelectedRecord(record);
    setShowCt11Table(true);
    console.log('Selected record:', record);

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
    }
  };

  const handleCloseCt11Table = () => {
    setShowCt11Table(false);
    setSelectedRecord(null);
  };

  const columnsTable = [
    {
      key: "ma_ct",
      title: "Mã chứng từ",
      fixed: "left",
      width: 120,
      render: (val) => <span className="font-medium">{val || '-'}</span>
    },
    {
      key: "stt_rec",
      title: "STT Record",
      fixed: "left",
      width: 140,
      render: (val) => <span className="font-mono text-sm">{val || '-'}</span>
    },
    {
      key: "ngay_lct",
      title: "Ngày lập chứng từ",
      width: 140,
      render: (val) => formatDate(val)
    },
    {
      key: "ngay_ct",
      title: "Ngày chứng từ",
      width: 140,
      render: (val) => formatDate(val)
    },
    {
      key: "dien_giai",
      title: "Diễn giải",
      width: 250,
      render: (val) => (
        <div className="max-w-xs truncate" title={val}>
          {val || '-'}
        </div>
      )
    },
    {
      key: "ty_giaf",
      title: "Tỷ giá",
      width: 120,
      render: (val) => formatCurrency(val)
    },
    {
      key: "action",
      title: "Thao tác",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-blue-500 p-1"
            title="Xem chi tiết"
            onClick={(e) => {
              e.stopPropagation();
              openModalDetail();
            }}
          >
            <Eye size={16} />
          </button>
          <button
            className="text-gray-500 hover:text-amber-500 p-1"
            title="Sửa"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRecord(record);
              openModalEdit();
            }}
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(record);
            }}
            className="text-gray-500 hover:text-red-500 p-1"
            title="Xóa"
          >
            <Trash size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Columns for Ct11 sub-table
  const columnsSubTable = [
    {
      key: "tk_i",
      title: "Tài khoản",
      width: 120,
      render: (val) => <span className="font-mono">{val || '-'}</span>
    },
    {
      key: "ps_no",
      title: "PS Nợ",
      width: 120,
      render: (val) => (
        <span className="text-right block">
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: "ps_co",
      title: "PS Có",
      width: 120,
      render: (val) => (
        <span className="text-right block">
          {formatCurrency(val)}
        </span>
      )
    },
    {
      key: "nh_dk",
      title: "NH ĐK",
      width: 80,
      render: (val) => val || '-'
    },
    {
      key: "dien_giaii",
      title: "Diễn giải",
      width: 250,
      render: (val) => (
        <div className="max-w-xs truncate" title={val}>
          {val || '-'}
        </div>
      )
    },
    {
      key: "ngay_ct",
      title: "Ngày chứng từ",
      width: 120,
      render: (val) => formatDate(val)
    }
  ];

  // Filtered data based on search term và date range
  const filteredDataTable = useMemo(() => {
    let filtered = [...dataTable];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.ma_ct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stt_rec?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dien_giai?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (rangePickerValue && rangePickerValue.length === 2) {
      const [startDate, endDate] = rangePickerValue;
      filtered = filtered.filter(item => {
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
    console.log('Page changed to:', page);
    // Add pagination logic here
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return {
    isOpenCreate,
    isOpenEdit,
    isOpenDetail,
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
    openModalCreate,
    closeModalCreate,
    closeModalEdit,
    closeModalDetail,
    handleRangePicker,
    handleChangePage,
    handleSaveCreate,
    handleSaveEdit,
    handleSearch,
    handleRowClick,
    handleCloseCt11Table,
    setSelectedRecord,
  };
};