import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

import { useGiayBaoCos, useDeleteGiayBaoCo } from "../../hooks/usegiaybaoco";
import { useModal } from "../../hooks/useModal";

export const useListGiayBaoCo = () => {
    const [rangePickerValue, setRangePickerValue] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGiayBaoCo, setSelectedGiayBaoCo] = useState(null);

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
    const { data: cashReceiptData, isLoading, error, refetch } = useGiayBaoCos(queryParams);
    const deleteGiayBaoCoMutation = useDeleteGiayBaoCo();
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

    const handleEditGiayBaoCo = (record) => {
        setSelectedGiayBaoCo(record);
        openModalEdit();
    };

    const handleDeleteGiayBaoCo = (record) => {
        setConfirmDelete({
            open: true,
            cashReceipt: record,
        });
    };

    const confirmDeleteGiayBaoCo = async () => {
        try {
            await deleteGiayBaoCoMutation.mutateAsync(confirmDelete.cashReceipt.stt_rec);
            refetch();
        } catch (error) {
            console.error("Xoá thất bại:", error);
        } finally {
            setConfirmDelete({ open: false, cashReceipt: null });
        }
    };

    const cancelDeleteGiayBaoCo = () => {
        setConfirmDelete({ open: false, cashReceipt: null });
    };

    // Định nghĩa các cột của bảng, thêm các trường mới
    const columnsTable = [
        {
            key: "so_ct",
            title: "Số phiếu thu",
            fixed: "left",
            width: 100,
        },
        {
            key: "ong_ba",
            title: "Đối tác",
            fixed: "left",
            width: 150,
        },
        {
            key: "ngay_lct",
            title: "Ngày lập phiếu thu",
            // fixed: "left",
            width: 150,
        },
        {
            key: "ngay_ct",
            title: "Ngày hạch toán",
            // fixed: "left",
            width: 150,
        },
        {
            key: "tk",
            title: "Tài khoản nợ",
            width: 150,
        },
        {
            key: "ma_gd",
            title: "Loại phiếu thu",
            width: 100,
        },
        {
            key: "ma_kh",
            title: "Mã khách",
            width: 150,
        },
        {
            key: "dia_chi",
            title: "Địa chỉ",
            width: 250,
        },
        {
            key: "dien_giai",
            title: "Lý do nộp",
            width: 200,
        },
        {
            key: "ma_qs",
            title: "Quyển số",
            width: 100,
        },
        {
            key: "loai_ct",
            title: "Trạng thái",
            width: 100,
        },
        {
            key: "MST",
            title: "MST",
            width: 80,
        },
        {
            key: "ma_nt",
            title: "TGGD(Tỷ giá giao dịch)",
            width: 50,
        },
        {
            key: "ty_gia",
            title: "Mức tỷ giá giao dịch",
            width: 50,
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
                        onClick={() => handleEditGiayBaoCo(record)}
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDeleteGiayBaoCo(record)}
                        className="text-gray-500 hover:text-red-500"
                        title="Xoá"
                        disabled={deleteGiayBaoCoMutation.isLoading}
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
        // Ví dụ: setSelectedGiayBaoCo({ ...selectedGiayBaoCo, [field]: value });
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

    // Sửa lại trong useListGiayBaoCo.js

    return {
        // Modal states
        isOpenCreate,
        isOpenEdit,
        isOpenDetail,
        selectedGiayBaoCo,

        // Data
        dataTable: cashReceiptData?.data || [],
        columnsTable,
        pagination: cashReceiptData?.pagination || { page: 1, limit: 5, total: 0, totalPages: 0 },

        // Form states
        rangePickerValue,
        searchValue,

        // Loading states
        isLoading,
        error,
        isDeleting: deleteGiayBaoCoMutation.isLoading,

        // Modal handlers
        openModalCreate,
        openModalEdit, // Thêm dòng này
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
        setSelectedGiayBaoCo, // Thêm dòng này
        setConfirmDelete, // Thêm dòng này

        // Delete confirmation
        confirmDelete,
        confirmDeleteGiayBaoCo,
        cancelDeleteGiayBaoCo,
    };
};
