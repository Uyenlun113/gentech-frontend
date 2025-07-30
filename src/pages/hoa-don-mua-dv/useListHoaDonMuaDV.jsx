import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useHoaDonMuaDVs, useDeleteHoaDonMuaDV } from "../../hooks/usehoadonmuadv";
import { useModal } from "../../hooks/useModal";

export const useListHoaDonMuaDV = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedHoaDonMuaDV, setSelectedHoaDonMuaDV] = useState(null);

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
        limit: 5,
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
    const { data: cashReceiptData, isLoading, error, refetch } = useHoaDonMuaDVs(queryParams);
    const deleteHoaDonMuaDVMutation = useDeleteHoaDonMuaDV();
    const [confirmDelete, setConfirmDelete] = useState({
        open: false,
        cashReceipt: null,
    });

    const handleSaveCreate = () => {
        refetch();
        closeModalCreate();
    };

    const handleSaveEdit = () => {
        refetch();
        closeModalEdit();
    };

    const handleEditHoaDonMuaDV = (record) => {
        setSelectedHoaDonMuaDV(record);
        openModalEdit();
    };

    const handleDeleteHoaDonMuaDV = (record) => {
        setConfirmDelete({
            open: true,
            cashReceipt: record,
        });
    };

    const confirmDeleteHoaDonMuaDV = async () => {
        try {
            await deleteHoaDonMuaDVMutation.mutateAsync(confirmDelete.cashReceipt.stt_rec);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, cashReceipt: null });
        }
    };

    const cancelDeleteHoaDonMuaDV = () => {
        setConfirmDelete({ open: false, cashReceipt: null });
    };

    // Định nghĩa các cột của bảng, thêm các trường mới
    // const columnsTable = [
    //     {
    //         key: "ngay_ct",
    //         title: "Ngày chứng từ",
    //         fixed: "left",
    //         width: 150,
    //     },
    //     {
    //         key: "so_ct",
    //         title: "Số phiếu thu",
    //         fixed: "left",
    //         width: 100,
    //     },
    //     {
    //         key: "ma_kh",
    //         title: "Mã khách",
    //         width: 150,
    //     },
    //     {
    //         key: "ten_kh",
    //         title: "Tên khách hàng",
    //         width: 150,
    //     },
    //     {
    //         key: "dien_giai",
    //         title: "Diễn giải",
    //         width: 200,
    //     },
    //     {
    //         key: "ma_nx",
    //         title: "Mã nx",
    //         width: 150,
    //     },
    //     // {
    //     //     key: "tk_thue_no",
    //     //     title: "TK Thuế",
    //     //     width: 100,
    //     // },
    //     {
    //         key: "t_tien",
    //         title: "Tiền hàng VNĐ",
    //         width: 250,
    //     },
    //     {
    //         key: "t_thue",
    //         title: "Tiền thuế VNĐ",
    //         width: 100,
    //     },
    //     {
    //         key: "t_tt",
    //         title: "Tổng tiền tt VNĐ",
    //         width: 100,
    //     },
    //     {
    //         key: "ma_nt",
    //         title: "Mã ngoại tệ",
    //         width: 80,
    //     },
    //     {
    //         key: "ty_gia",
    //         title: "Tỷ giá",
    //         width: 50,
    //     },
    //     {
    //         key: "date",
    //         title: "Ngày cập nhật",
    //         width: 100,
    //     },
    //     {
    //         key: "time",
    //         title: "Giờ cập nhật",
    //         width: 100,
    //     },
    //     {
    //         key: "action",
    //         title: "Thao tác",
    //         fixed: "right",
    //         width: 120,
    //         render: (_, record) => (
    //             <div className="flex items-center gap-3 justify-center">
    //                 <button
    //                     className="text-gray-500 hover:text-amber-500"
    //                     title="Sửa"
    //                     onClick={() => handleEditHoaDonMuaDV(record)}
    //                 >
    //                     <Pencil size={18} />
    //                 </button>
    //                 <button
    //                     onClick={() => handleDeleteHoaDonMuaDV(record)}
    //                     className="text-gray-500 hover:text-red-500"
    //                     title="Xoá"
    //                     disabled={deleteHoaDonMuaDVMutation.isLoading}
    //                 >
    //                     <Trash size={18} />
    //                 </button>
    //             </div>
    //         ),
    //     },
    // ];

    // Các hàm xử lý input cho các trường mới nếu cần
    const handleInputChange = (field, value) => {
        // Cập nhật giá trị cho các trường mới nếu có form chỉnh sửa
        // Ví dụ: setSelectedHoaDonMuaDV({ ...selectedHoaDonMuaDV, [field]: value });
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
        selectedHoaDonMuaDV,

        // Data
        dataTable: cashReceiptData?.data || [],
        // columnsTable,
        pagination: cashReceiptData?.pagination || { page: 1, limit: 5, total: 0, totalPages: 0 },

        // Form states
        rangePickerValue,
        searchValue,

        // Loading states
        isLoading,
        error,
        isDeleting: deleteHoaDonMuaDVMutation.isLoading,

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
        confirmDeleteHoaDonMuaDV,
        cancelDeleteHoaDonMuaDV,
        handleDeleteHoaDonMuaDV,
        handleEditHoaDonMuaDV,
    };
};
