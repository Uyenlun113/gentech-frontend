import { Pencil, Trash, Printer } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";


import { useModal } from "../../hooks/useModal";
import { useDeletePhieuXuatDc, useGetAllPhieuXuatDc } from "../../hooks/usePhieuxuatdc";
import phieuXuatDcApi from "../../services/phieuxuatdc";
import { useReactToPrint } from "react-to-print";

export const usePhieuXuatDcList = () => {
    const [selectedEditId, setSelectedEditId] = useState();

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

    const [rangePickerValue, setRangePickerValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showCt85Table, setShowCt85Table] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const { isOpen: isOpenDelete, openModal: openModalDelete, closeModal: closeModalDelete } = useModal();
    const { data: fetchPhieuXuatDcData, isLoading: isLoadingPhieuXuatDc, refetch: refetchPhieuXuatDcData } = useGetAllPhieuXuatDc();
    const printRef = useRef();
    const [printData, setPrintData] = useState(null);
    const deleteMutation = useDeletePhieuXuatDc();

    const dataTable = useMemo(() => {
        if (fetchPhieuXuatDcData?.data?.items && Array.isArray(fetchPhieuXuatDcData.data.items)) {
            return fetchPhieuXuatDcData.data.items;
        }
        else if (fetchPhieuXuatDcData?.items && Array.isArray(fetchPhieuXuatDcData.items)) {
            return fetchPhieuXuatDcData.items;
        }
        else if (fetchPhieuXuatDcData?.data && Array.isArray(fetchPhieuXuatDcData.data)) {
            return fetchPhieuXuatDcData.data;
        }
        else if (Array.isArray(fetchPhieuXuatDcData)) {
            return fetchPhieuXuatDcData;
        }

        return [];
    }, [fetchPhieuXuatDcData]);

    useEffect(() => {
        setLoading(isLoadingPhieuXuatDc || deleteMutation.isPending);
    }, [isLoadingPhieuXuatDc, deleteMutation.isPending]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const formatNumber = (number) => {
        if (!number) return "0";
        return new Intl.NumberFormat("vi-VN").format(number);
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
                handleCloseCt85Table();
            }
            closeModalDelete();
            setRecordToDelete(null);
            refetchPhieuXuatDcData();
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

        try {
            const res = await phieuXuatDcApi.getCt85Data(record.stt_rec);
            let ct85Data = [];

            if (res?.status === 200 && Array.isArray(res.data)) {
                ct85Data = res.data;
            } else if (Array.isArray(res)) {
                ct85Data = res;
            } else if (res?.data && Array.isArray(res.data)) {
                ct85Data = res.data;
            } else {
                console.warn("CT85 API returned unexpected format:", res);
                ct85Data = [];
            }

            const children = ct85Data.map((item, index) => ({
                ...item,
                stt: index + 1,
            }));

            record.children = children;
            setSelectedRecord(record);
            setShowCt85Table(true);

            if (children.length === 0) {
                toast.info("Không có dữ liệu chi tiết cho bản ghi này");
            }

        } catch (error) {
            console.error("Failed to fetch CT85 data:", error);

            // More detailed error handling
            let errorMessage = "Không thể tải dữ liệu chi tiết";

            if (error.response?.status === 500) {
                errorMessage = "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
            } else if (error.response?.status === 404) {
                errorMessage = "Không tìm thấy dữ liệu chi tiết cho bản ghi này";
            } else if (error.response?.status === 403) {
                errorMessage = "Không có quyền truy cập dữ liệu chi tiết";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        }
    };

    const handleCloseCt85Table = () => {
        setShowCt85Table(false);
        setSelectedRecord(null);
    };

    const handleOpenEdit = (stt_rec) => {
        setSelectedEditId(stt_rec);
        openModalEdit();
    };

    const [soLuongMap, setSoLuongMap] = useState({});

    // Calculate total quantity for each record with improved error handling
    useEffect(() => {
        const fetchAllCt85Data = async () => {
            if (!dataTable?.length) {
                console.warn("Không có dataTable để tính tổng số lượng");
                setSoLuongMap({});
                return;
            }

            try {
                // Filter out invalid stt_rec values with better validation
                const sttRecList = dataTable
                    .map((item) => {
                        const sttRec = item.stt_rec?.toString()?.trim();
                        // Validate that stt_rec is a valid number
                        const sttRecNumber = Number(sttRec);
                        if (sttRec && !isNaN(sttRecNumber) && sttRecNumber > 0) {
                            return sttRec;
                        }
                        return null;
                    })
                    .filter(Boolean);
                if (sttRecList.length === 0) {
                    console.warn("Không có stt_rec hợp lệ");
                    setSoLuongMap({});
                    return;
                }
                const uniqueSttRecList = [...new Set(sttRecList)];
                const res = await phieuXuatDcApi.getCt85Data(uniqueSttRecList);
                let ct85Data = [];
                if (res?.status === 200 && Array.isArray(res.data)) {
                    ct85Data = res.data;
                } else if (Array.isArray(res)) {
                    ct85Data = res;
                } else if (res?.data && Array.isArray(res.data)) {
                    ct85Data = res.data;
                } else {
                    console.warn("CT85 bulk API không trả về dữ liệu hợp lệ:", res);
                    setSoLuongMap({});
                    return;
                }
                const newSoLuongMap = {};
                ct85Data.forEach((item) => {
                    const key = item.stt_rec?.toString()?.trim();
                    const soLuongValue = parseFloat(item.so_luong) || 0;

                    if (key && !isNaN(soLuongValue)) {
                        if (!newSoLuongMap[key]) {
                            newSoLuongMap[key] = 0;
                        }
                        newSoLuongMap[key] += soLuongValue;
                    }
                });
                setSoLuongMap(newSoLuongMap);

            } catch (err) {
                console.error("Lỗi khi fetch CT85 all:", err);
                if (err.response?.status === 500) {
                    console.warn("Lỗi máy chủ khi tính tổng số lượng. Sử dụng giá trị mặc định.");
                }
                setSoLuongMap({});
            }
        };

        fetchAllCt85Data();
    }, [dataTable]);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Phiếu_xuất_kho_dc_${printData?.so_ct || 'PT001'}`,
        pageStyle: `
                @page {
                    size: A4;
                    margin: 0.5in;
                }
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                        margin: 0;
                        padding: 0;
                    }
                }
            `,
        onAfterPrint: () => {
            console.log('Print completed');
        },
        onPrintError: (errorLocation, error) => {
            console.error('Print error:', errorLocation, error);
        }
    });
    const getData = async (record) => {
        const res = await phieuXuatDcApi.getPhieuXuatDc(record.stt_rec);
        return res
    }

    // Function để xử lý in phiếu thu
    const handlePrintFun = async (record) => {
        let data = await getData(record)
        console.log('Print data being set --------------------------:', data);
        setPrintData(data);
        // Delay để đảm bảo data được set và component được render
        setTimeout(() => {
            if (printRef.current) {
                console.log('Print ref found, starting print...');
                handlePrint();
            } else {
                console.error('Print ref not found!');
            }
        }, 200);
    };
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
            title: "Ngày lập CT",
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
            width: 120,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "t_so_luong",
            title: "Tổng số lượng",
            width: 140,
            render: (_, record) => {
                const sttRecKey = record.stt_rec?.toString()?.trim();
                const calculatedTotal = soLuongMap[sttRecKey];
                const fallbackTotal = record.t_so_luong || 0;
                const displayTotal = calculatedTotal !== undefined ? calculatedTotal : fallbackTotal;

                return (
                    <div className="font-mono text-sm text-center text-green-600">
                        {formatNumber(displayTotal)}
                    </div>
                );
            },
        },
        {
            key: "ma_kho",
            title: "Mã kho",
            width: 120,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ong_ba",
            title: "Người xuất",
            width: 180,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
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
            render: (val) => <div className="text-center">{formatNumber(val)}</div>,
        },
        {
            key: "action",
            title: "Thao tác",
            fixed: "right",
            width: 100,
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <button
                            className="text-gray-500 hover:text-amber-500"
                            title="In"
                            onClick={() => handlePrintFun(record)}
                        >
                            <Printer size={18} />
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

    // Columns for Ct85 sub-table
    const columnsSubTable = [
        {
            key: "stt",
            title: "STT",
            width: 50,
            fixed: "left",
            render: (_, record) => <div className="text-center">{record.stt}</div>,
        },
        {
            key: "ma_vt",
            title: "Mã vật tư",
            fixed: "left",
            width: 120,
            render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
        },
        {
            key: "tk_vt",
            title: "TK vật tư",
            width: 100,
            render: (val) => <div className="font-mono text-center">{val || "-"}</div>,
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 120,
            render: (val) => (
                <span className="text-center block text-green-600">
                    {formatNumber(val)}
                </span>
            ),
        },
        {
            key: "ngay_ct",
            title: "Ngày CT",
            width: 120,
            render: (val) => (
                <div className="text-center">
                    {formatDate(val)}
                </div>
            ),
        },
    ];

    // Filtered data based on search term and date range
    const filteredDataTable = useMemo(() => {
        let filtered = [...dataTable];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (item) =>
                    item.ma_ct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.stt_rec?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.ma_kho?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.dien_giai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.ong_ba?.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Mock fetchCt85Data function for compatibility
    const fetchCt85Data = () => {
        // This function would be used by ShowMoreTables component
        return Promise.resolve([]);
    };

    return {
        dataTable: filteredDataTable,
        columnsTable,
        columnsSubTable,
        rangePickerValue,
        loading,
        searchTerm,
        selectedRecord,
        showCt85Table,
        recordToDelete,
        isOpenDelete,
        handleRangePicker,
        handleChangePage,
        handleSearch,
        handleRowClick,
        handleCloseCt85Table,
        handleConfirmDelete,
        handleCancelDelete,
        setSelectedRecord,
        deleteMutation,
        fetchCt85Data,
        fetchPhieuXuatDcData,
        isOpenCreate,
        openModalCreate,
        closeModalCreate,
        isOpenEdit,
        openModalEdit,
        closeModalEdit,
        selectedEditId,
        setSelectedEditId,
        soLuongMap,
        // Additional props for compatibility
        currentPage: 1,
        totalItems: filteredDataTable.length,
        printRef,
        printData,
    };
};
