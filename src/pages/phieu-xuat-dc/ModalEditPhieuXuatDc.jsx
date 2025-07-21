import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalendarIcon, Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDmkho } from "../../hooks/useDmkho";
import { useDmvt } from "../../hooks/useDmvt";

import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import SearchableSelect from "../category/account/SearchableSelect";
import { useGetPhieuXuatDc, useUpdatePhieuXuatDc } from "../../hooks/usePhieuxuatdc";
import { Modal } from "../../components/ui/modal";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";

// Constants cho CT85 (Phiếu xuất điều chuyển)
const INITIAL_CT85_DATA = [
    {
        id: 1,
        ma_ct: "",
        ngay_ct: "",
        ma_vt: "",
        ten_vt: "",
        tk_vt: "",
        ma_nx_i: "",
        so_luong: "",
    },
];

const STATUS_OPTIONS = [
    { value: "1", label: "Đã ghi sổ cái" },
    { value: "2", label: "Chưa ghi sổ cái" },
];

const FLATPICKR_OPTIONS = {
    dateFormat: "Y-m-d",
    locale: Vietnamese,
};

export const ModalEditPhieuXuatDc = ({ isOpenEdit, closeModalEdit, editingId }) => {
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        ongBa: "",
        dienGiai: "",
        maKho: "",
        maKhon: "",
        tSoLuong: 0,
        tyGia: 1,
        maCt: "",
        ngayLct: "",
        ngayCtPhieu: "",
        trangThai: "1",
    });

    const [ct85Data, setCt85Data] = useState(INITIAL_CT85_DATA);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Search states
    const [searchStates, setSearchStates] = useState({
        vtSearch: "",
        vtSearchRowId: null,
        khoSearch: "",
        khoSearchRowId: null,
        searchContext: null,
        showVatTuPopup: false,
        showKhoPopup: false,
    });

    // Refs for table containers
    const ct85TableRef = useRef(null);

    // Hooks
    const { data: vatTuData = [] } = useDmvt(
        searchStates.vtSearch ? { search: searchStates.vtSearch } : {}
    );
    const { data: khoData = [] } = useDmkho(
        searchStates.khoSearch ? { search: searchStates.khoSearch } : {}
    );
    const { mutateAsync: updatePhieuXuatDc, isPending } = useUpdatePhieuXuatDc();

    const { data: editData, isLoading: isLoadingEdit } = useGetPhieuXuatDc(editingId);

    useEffect(() => {
        if (editData && editingId && isOpenEdit && !isDataLoaded) {
            const phieuData = editData.phieu || {};
            const vatTuData = editData.vatTu || [];

            if (phieuData) {
                // Set form phiếu
                setFormData({
                    ongBa: phieuData.ong_ba || "",
                    dienGiai: phieuData.dien_giai || "",
                    maKho: phieuData.ma_kho || "",
                    maKhon: phieuData.ma_khon || "",
                    tSoLuong: phieuData.t_so_luong || 0,
                    tyGia: phieuData.ty_gia || 1,
                    maCt: phieuData.ma_ct || "",
                    ngayLct: phieuData.ngay_lct || "",
                    ngayCtPhieu: phieuData.ngay_ct || "",
                    trangThai: phieuData.status || "1",
                });

                // Set dữ liệu vật tư CT85
                if (vatTuData.length > 0) {
                    const mappedCt85 = vatTuData.map((item, index) => ({
                        id: index + 1,
                        ma_ct: item.ma_ct || "",
                        ngay_ct: item.ngay_ct || "",
                        ma_vt: item.ma_vt || "",
                        ten_vt: item.ten_vt || "",
                        tk_vt: item.tk_vt || "",
                        ma_nx_i: item.ma_nx_i || "",
                        so_luong: item.so_luong?.toString() || "",
                    }));

                    setCt85Data(mappedCt85);
                }

                setIsDataLoaded(true);
            } else {
                console.error("Không tìm thấy dữ liệu phiếu trong editData:", editData);
            }
        }
    }, [editData, editingId, isOpenEdit, isDataLoaded]);

    useEffect(() => {
        if (!isOpenEdit) {
            setIsDataLoaded(false);
            resetForm();
        } else if (isOpenEdit && editingId) {
            setIsDataLoaded(false);
        }
    }, [isOpenEdit, editingId]);

    // Tính tổng số lượng
    const totals = useMemo(() => {
        const totalSoLuong = ct85Data.reduce((sum, item) => {
            const value = parseFloat(item.so_luong) || 0;
            return sum + value;
        }, 0);

        return { totalSoLuong };
    }, [ct85Data]);

    // Debounced search effects
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchStates.vtSearch) {
                setSearchStates(prev => ({ ...prev, showVatTuPopup: true }));
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.vtSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchStates.khoSearch) {
                setSearchStates(prev => ({ ...prev, showKhoPopup: true }));
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.khoSearch]);

    // Handlers
    const handleFormChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleDateChange = useCallback((date, field) => {
        const formattedDate = date[0]?.toLocaleDateString("en-CA");
        handleFormChange(field, formattedDate);
    }, [handleFormChange]);

    const handleCt85Change = useCallback((id, field, value) => {
        setCt85Data(prev => {
            const newData = prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            return newData;
        });

        // Search logic
        if (field === "ma_vt") {
            setSearchStates(prev => ({
                ...prev,
                vtSearch: value,
                vtSearchRowId: id,
                searchContext: "ct85"
            }));
        }
        if (field === "ma_nx_i") {
            setSearchStates(prev => ({
                ...prev,
                khoSearch: value,
                khoSearchRowId: id,
                searchContext: "ct85"
            }));
        }
    }, []);

    // Handle search for main form fields
    const handleMainFormKhoSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            khoSearch: value,
            khoSearchRowId: "main-form",
            searchContext: "mainForm"
        }));
    }, []);

    const handleVatTuSelect = useCallback((id, vatTu) => {
        setCt85Data(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, ma_vt: vatTu.ma_vt.trim(), ten_vt: vatTu.ten_vt, tk_vt: vatTu.tk_vt }
                    : item
            )
        );

        setSearchStates(prev => ({
            ...prev,
            showVatTuPopup: false,
            vtSearch: "",
            searchContext: null
        }));
    }, []);

    const handleKhoSelect = useCallback((id, kho) => {
        if (searchStates.searchContext === "mainForm") {
            handleFormChange("maKho", kho.ma_kho.trim());
            handleFormChange("maKhon", kho.ma_kho.trim());
        } else {
            setCt85Data(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, ma_nx_i: kho.ma_kho.trim() }
                        : item
                )
            );
        }

        setSearchStates(prev => ({
            ...prev,
            showKhoPopup: false,
            khoSearch: "",
            searchContext: null
        }));
    }, [searchStates.searchContext, handleFormChange]);

    const addCt85Row = useCallback(() => {
        setCt85Data(prev => [
            ...prev,
            {
                id: prev.length + 1,
                ma_ct: "",
                ngay_ct: "",
                ma_vt: "",
                ten_vt: "",
                tk_vt: "",
                ma_nx_i: "",
                so_luong: "",
            }
        ]);

        setTimeout(() => {
            if (ct85TableRef.current) {
                const tableContainer = ct85TableRef.current.querySelector('.overflow-x-auto');
                if (tableContainer) {
                    tableContainer.scrollTop = tableContainer.scrollHeight;
                }
            }
        }, 100);
    }, []);

    const deleteCt85Row = useCallback((id) => {
        setCt85Data(prev => prev.filter(item => item.id !== id));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            ongBa: "",
            dienGiai: "",
            maKho: "",
            maKhon: "",
            tSoLuong: 0,
            tyGia: 1,
            maCt: "",
            ngayLct: "",
            ngayCtPhieu: "",
            trangThai: "1",
        });
        setCt85Data(INITIAL_CT85_DATA);
        setSearchStates({
            vtSearch: "",
            vtSearchRowId: null,
            khoSearch: "",
            khoSearchRowId: null,
            searchContext: null,
            showVatTuPopup: false,
            showKhoPopup: false,
        });
        setIsDataLoaded(false);
    }, []);

    const validateForm = useCallback(() => {
        if (!formData.maCt) {
            toast.error("Vui lòng nhập mã chứng từ");
            return false;
        }
        if (!formData.maKho) {
            toast.error("Vui lòng nhập mã kho");
            return false;
        }
        if (!formData.ngayLct) {
            toast.error("Vui lòng nhập ngày lập chứng từ");
            return false;
        }

        const validCt85Rows = ct85Data.filter(row =>
            row.ma_vt && parseFloat(row.so_luong) > 0
        );
        if (validCt85Rows.length === 0) {
            toast.error("Vui lòng nhập ít nhất một dòng vật tư hợp lệ");
            return false;
        }

        return true;
    }, [formData, ct85Data]);

    const handleSave = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const payload = {
                phieu: {
                    ong_ba: formData.ongBa?.trim() || "",
                    dien_giai: formData.dienGiai?.trim() || "",
                    ma_kho: formData.maKho?.trim() || "",
                    ma_khon: formData.maKhon?.trim() || "",
                    t_so_luong: totals.totalSoLuong,
                    ty_gia: formData.tyGia || 1,
                    ma_ct: formData.maCt?.trim() || "",
                    ngay_lct: formData.ngayLct,
                    ngay_ct: formData.ngayCtPhieu,
                    status: formData.trangThai
                },
                vatTu: ct85Data
                    .filter(row => row.ma_vt && parseFloat(row.so_luong) > 0)
                    .map(({ ma_ct, ngay_ct, ma_vt, tk_vt, ma_nx_i, so_luong }) => ({
                        ma_ct: ma_ct?.trim() || "",
                        ngay_ct: ngay_ct ? new Date(ngay_ct).toISOString() : null,
                        ma_vt: ma_vt?.trim() || "",
                        tk_vt: tk_vt?.trim() || "",
                        ma_nx_i: ma_nx_i?.trim() || "",
                        so_luong: Number(so_luong) || 0,
                    }))
            };

            await updatePhieuXuatDc(editingId, payload);
            closeModalEdit();
            resetForm();
            navigate("/phieu-xuat-dieu-chuyen");
        } catch (err) {
            console.error(err);
        }
    }, [formData, ct85Data, totals, updatePhieuXuatDc, closeModalEdit, resetForm, navigate, validateForm, editingId]);

    const handleClose = useCallback(() => {
        resetForm();
        closeModalEdit();
    }, [resetForm, closeModalEdit]);

    // Table columns cho CT85
    const ct85Columns = [
        {
            key: "stt_rec",
            fixed: "left",
            title: "STT",
            width: 50,
            render: (val, row) => (
                <div className="text-center font-medium text-gray-700">
                    {row.id === 'total' ? 'Tổng' : row.id}
                </div>
            )
        },
        {
            key: "ma_ct",
            title: "Mã chứng từ",
            width: 120,
            fixed: "left",
            render: (val, row) => {
                if (row.id === 'total') {
                    return <div className="font-bold text-gray-900"></div>;
                }
                return (
                    <Input
                        value={row.ma_ct}
                        onChange={(e) => handleCt85Change(row.id, "ma_ct", e.target.value)}
                        placeholder="Nhập mã CT..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "ngay_ct",
            title: "Ngày chứng từ",
            width: 150,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <div className="relative">
                        <Flatpickr
                            value={row.ngay_ct ? row.ngay_ct.split("T")[0] : ""}
                            onChange={(date) =>
                                handleCt85Change(row.id, "ngay_ct", date?.[0]?.toISOString() || "")
                            }
                            options={{
                                dateFormat: "Y-m-d",
                                allowInput: true,
                            }}
                            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-800 dark:text-white"
                        />
                        <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                );
            },
        },
        {
            key: "ma_vt",
            title: "Mã vật tư",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_vt}
                        onChange={(e) => handleCt85Change(row.id, "ma_vt", e.target.value)}
                        placeholder="Nhập mã VT..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "ten_vt",
            title: "Tên vật tư",
            width: 200,
            render: (val, row) => (
                <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
                    {row.ten_vt}
                </div>
            )
        },
        {
            key: "tk_vt",
            title: "TK vật tư",
            width: 100,
            render: (val, row) => (
                <div className="text-gray-800 font-medium">
                    {row.tk_vt}
                </div>
            )
        },
        {
            key: "ma_nx_i",
            title: "Mã kho",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_nx_i}
                        onChange={(e) => handleCt85Change(row.id, "ma_nx_i", e.target.value)}
                        placeholder="Mã kho..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-lg text-green-600 p-2 rounded ">
                            {totals.totalSoLuong.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    <Input
                        type="number"
                        value={row.so_luong}
                        onChange={(e) => handleCt85Change(row.id, "so_luong", e.target.value)}
                        placeholder="Số lượng"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "action",
            title: "Hành động",
            fixed: "right",
            width: 80,
            render: (_, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => deleteCt85Row(row.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa dòng"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];

    // Thêm dòng tổng vào data CT85
    const ct85DataWithTotal = useMemo(() => {
        return [
            ...ct85Data,
            {
                id: 'total',
                ma_ct: '',
                ngay_ct: '',
                ma_vt: '',
                ten_vt: '',
                tk_vt: '',
                ma_nx_i: '',
                so_luong: totals.totalSoLuong,
            }
        ];
    }, [ct85Data, totals]);

    // Loading state
    if (isLoadingEdit) {
        return (
            <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-7xl m-4">
                <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-7xl m-4">
            <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex-shrink-0 p-2 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-100 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                Chỉnh sửa phiếu xuất điều chuyển
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Cập nhật thông tin phiếu xuất DC #{formData.maCt}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-green-50">
                    {/* Form thông tin cơ bản */}
                    <div className="border-b border-gray-100">
                        <div className="dark:bg-gray-800 rounded-xl p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                                {/* Cột trái - 70% */}
                                <div className="lg:col-span-7 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Người xuất
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ongBa}
                                            onChange={(e) => handleFormChange("ongBa", e.target.value)}
                                            placeholder="Tên người xuất"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Diễn giải
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.dienGiai}
                                            onChange={(e) => handleFormChange("dienGiai", e.target.value)}
                                            placeholder="Nhập diễn giải"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã kho <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.maKho}
                                            onChange={(e) => {
                                                handleFormChange("maKho", e.target.value);
                                                handleMainFormKhoSearch(e.target.value);
                                            }}
                                            placeholder="KHO01"
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Tỷ giá
                                        </Label>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-1">
                                            <span className="px-3 py-2 bg-gray-50 text-gray-700 font-medium border-r border-gray-300 text-sm">
                                                VND
                                            </span>
                                            <input
                                                type="number"
                                                value={formData.tyGia}
                                                onChange={(e) => handleFormChange("tyGia", e.target.value)}
                                                placeholder="1.00"
                                                className="flex-1 px-3 py-2 text-sm focus:outline-none h-9 border-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Cột phải - 30% */}
                                <div className="lg:col-span-3 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã chứng từ <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.maCt}
                                            onChange={(e) => handleFormChange("maCt", e.target.value)}
                                            placeholder="XDC001"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày lập CT <span className="text-red-500">*</span>
                                        </Label>
                                        <Flatpickr
                                            value={formData.ngayLct}
                                            onChange={(date) => handleDateChange(date, "ngayLct")}
                                            options={FLATPICKR_OPTIONS}
                                            placeholder="Chọn ngày..."
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày chứng từ
                                        </Label>
                                        <Flatpickr
                                            value={formData.ngayCtPhieu}
                                            onChange={(date) => handleDateChange(date, "ngayCtPhieu")}
                                            options={FLATPICKR_OPTIONS}
                                            placeholder="Chọn ngày..."
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Trạng thái
                                        </Label>
                                        <div className="flex-1">
                                            <Select
                                                defaultValue={formData.trangThai}
                                                options={STATUS_OPTIONS}
                                                onChange={(value) => handleFormChange("trangThai", value)}
                                                className="w-full h-9 text-sm bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết vật tư */}
                    <div className="px-6">
                        <div className="py-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết vật tư xuất</h3>
                            <div className="bg-white rounded-lg border border-gray-200" ref={ct85TableRef}>
                                <TableBasic
                                    data={ct85DataWithTotal}
                                    columns={ct85Columns}
                                    onAddRow={addCt85Row}
                                    onDeleteRow={deleteCt85Row}
                                    showAddButton={true}
                                    addButtonText="Thêm vật tư"
                                    maxHeight="max-h-80"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                        {/* Summary info */}
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tổng số lượng:</span>
                                <span className="font-semibold text-green-600">
                                    {totals.totalSoLuong.toLocaleString('vi-VN')}
                                </span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 border border-gray-300 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className={`px-6 py-2.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                <Save size={16} />
                                {isPending ? "Đang cập nhật..." : "Cập nhật phiếu xuất DC"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Popups */}
                {searchStates.showVatTuPopup && (
                    <SearchableSelect
                        isOpen={true}
                        onClose={() => setSearchStates(prev => ({ ...prev, showVatTuPopup: false }))}
                        onSelect={(vatTu) => handleVatTuSelect(searchStates.vtSearchRowId, vatTu)}
                        vatTus={vatTuData.data || []}
                        searchValue={searchStates.khoSearch}
                        onSearchChange={(value) => setSearchStates(prev => ({ ...prev, khoSearch: value }))}
                    />
                )}

                {searchStates.showKhoPopup && (
                    <SearchableSelect
                        isOpen={true}
                        onClose={() => setSearchStates(prev => ({ ...prev, showKhoPopup: false }))}
                        onSelect={(kho) => handleKhoSelect(searchStates.khoSearchRowId, kho)}
                        items={khoData.data || []}
                        searchValue={searchStates.khoSearch}
                        onSearchChange={(value) => setSearchStates(prev => ({ ...prev, khoSearch: value }))}
                    />
                )}
            </div>
        </Modal>
    );
}