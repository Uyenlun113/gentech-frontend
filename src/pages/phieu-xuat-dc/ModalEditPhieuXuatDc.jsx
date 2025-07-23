import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import WarehouseSelectionPopup from "../../components/general/dmkPopup";
import MaterialSelectionPopup from "../../components/general/dmvtPopup";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../components/ui/modal";
import { Tabs } from "../../components/ui/tabs";
import { useDmkho } from "../../hooks/useDmkho";
import { useDmvt } from "../../hooks/useDmvt";
import { useGetPhieuXuatDc, useUpdatePhieuXuatDc } from "../../hooks/usePhieuxuatdc";
import dmvtService from "../../services/dmvt";

// Constants cho CT85 (Phiếu xuất điều chuyển)
const INITIAL_CT85_DATA = [
    {
        id: 1,
        ma_vt: "",
        ten_vt: "",
        tk_vt: "",
        don_vi_tinh: "",
        ton_kho: 0,
        so_luong: "",
        don_gia: "",
        ma_nx_i: "",
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

    const [formData, setFormData] = useState({
        ongBa: "",
        dienGiai: "",
        maKho: "",
        tenKho: "",
        maKhon: "",
        tenKhon: "",
        tSoLuong: 0,
        tyGia: 1,
        maQs: "",
        ngayLct: "",
        ngayCtPhieu: "",
        trangThai: "1",
        hd_lenhdd: "",
        soCt: "",
    });

    const [ct85Data, setCt85Data] = useState(INITIAL_CT85_DATA);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // State cho DMVT search
    const [dmvtSearchTerm, setDmvtSearchTerm] = useState("");
    const [dmvtData, setDmvtData] = useState({ data: [] });
    const [dmvtLoading, setDmvtLoading] = useState(false);

    // State cho Kho search
    const [maKhoSearch, setMaKhoSearch] = useState("");

    const [searchStates, setSearchStates] = useState({
        vtSearch: "",
        vtSearchRowId: null,
        khoSearch: "",
        khoSearchRowId: null,
        searchContext: null,
        showVatTuPopup: false,
        showKhoPopup: false,
        maVtSearch: "",
        maVtSearchRowId: null,
        maKhoTableSearch: "",
        maKhoTableSearchRowId: null,
        showDmvtPopup: false,
        showDmkhoPopup: false,
    });

    const ct85TableRef = useRef(null);

    const { data: vatTuData = [] } = useDmvt(
        searchStates.vtSearch ? { search: searchStates.vtSearch } : {}
    );
    const { data: khoData = [] } = useDmkho(
        searchStates.khoSearch ? { search: searchStates.khoSearch } : {}
    );

    const { data: dmkhoTableData = [] } = useDmkho(
        searchStates.maKhoTableSearch ? { search: searchStates.maKhoTableSearch } : {}
    );

    const { data: editData, isLoading: isLoadingEdit } = useGetPhieuXuatDc(editingId);
    const { mutateAsync: updatePhieuXuatDc, isPending } = useUpdatePhieuXuatDc();

    const fetchDmvtData = useCallback(async (searchTerm = "") => {
        setDmvtLoading(true);
        try {
            const response = await dmvtService.getDmvt({
                search: searchTerm,
                page: 1,
                limit: 999
            });

            setDmvtData({
                data: response?.data || response || []
            });
        } catch (error) {
            console.error('❌ Error fetching DMVT data:', error);
            setDmvtData({ data: [] });
        } finally {
            setDmvtLoading(false);
        }
    }, []);

    const formatNumber = (number) => {
        if (!number) return "0";
        return new Intl.NumberFormat("vi-VN").format(number);
    };

    // Load dữ liệu khi mở modal edit
    useEffect(() => {
        if (editData && editingId && isOpenEdit && !isDataLoaded) {
            const phieuData = editData.phieu || {};
            const vatTuData = editData.vatTu || [];

            if (phieuData) {
                setFormData({
                    ongBa: phieuData.ong_ba || "",
                    dienGiai: phieuData.dien_giai || "",
                    maKho: phieuData.ma_kho || "",
                    tenKho: phieuData.ten_kho || "",
                    maKhon: phieuData.ma_khon || "",
                    tenKhon: phieuData.ten_khon || "",
                    tSoLuong: phieuData.t_so_luong || 0,
                    tyGia: phieuData.ty_gia || 1,
                    maQs: phieuData.ma_qs || "",
                    ngayLct: phieuData.ngay_lct || "",
                    ngayCtPhieu: phieuData.ngay_ct || "",
                    trangThai: phieuData.status || "1",
                    hd_lenhdd: phieuData.hd_lenhdd || "",
                    soCt: phieuData.so_ct || "",
                });

                if (vatTuData.length > 0) {
                    const mappedCt85 = vatTuData.map((item, index) => ({
                        id: index + 1,
                        ma_vt: item.ma_vt || "",
                        ten_vt: item.vatTu.ten_vt || "",
                        tk_vt: item.tk_vt || "",
                        don_vi_tinh: item.vatTu.dvt || "",
                        ton_kho: item.ton_kho || 0,
                        so_luong: item.so_luong?.toString() || "",
                        don_gia: item.don_gia?.toString() || "",
                        ma_nx_i: item.ma_nx_i || "",
                    }));
                    setCt85Data(mappedCt85);
                }

                setIsDataLoaded(true);
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

    // Tính tổng số lượng và thành tiền
    const totals = useMemo(() => {
        const totalSoLuong = ct85Data.reduce((sum, item) => {
            const value = parseFloat(item.so_luong) || 0;
            return sum + value;
        }, 0);

        const totalThanhTien = ct85Data.reduce((sum, item) => {
            const soLuong = parseFloat(item.so_luong) || 0;
            const donGia = parseFloat(item.don_gia) || 0;
            return sum + (soLuong * donGia);
        }, 0);

        return { totalSoLuong, totalThanhTien };
    }, [ct85Data]);

    // Debounce search cho main form
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchStates(prev => ({
                ...prev,
                showVatTuPopup: prev.vtSearch !== "",
            }));
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.vtSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchStates(prev => ({
                ...prev,
                showKhoPopup: prev.khoSearch !== "",
            }));
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.khoSearch]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchStates.maVtSearch && searchStates.maVtSearch.length > 0) {
                console.log('🔍 Searching for material:', searchStates.maVtSearch);
                setDmvtSearchTerm(searchStates.maVtSearch);
                fetchDmvtData(searchStates.maVtSearch);
                setSearchStates(prev => ({ ...prev, showDmvtPopup: true }));
            } else {
                setSearchStates(prev => ({ ...prev, showDmvtPopup: false }));
                setDmvtSearchTerm("");
                setDmvtData({ data: [] });
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchStates.maVtSearch, fetchDmvtData]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchStates.maKhoTableSearch && searchStates.maKhoTableSearch.length > 0) {
                console.log('🔍 Searching for warehouse:', searchStates.maKhoTableSearch);
                setMaKhoSearch(searchStates.maKhoTableSearch);
                setSearchStates(prev => ({ ...prev, showDmkhoPopup: true }));
            } else {
                setSearchStates(prev => ({ ...prev, showDmkhoPopup: false }));
                setMaKhoSearch("");
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchStates.maKhoTableSearch]);

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
            const newData = prev.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };

                    // Auto calculate thanh_tien when so_luong or don_gia changes
                    if (field === "so_luong" || field === "don_gia") {
                        const soLuong = parseFloat(field === "so_luong" ? value : item.so_luong) || 0;
                        const donGia = parseFloat(field === "don_gia" ? value : item.don_gia) || 0;
                        updatedItem.thanh_tien = soLuong * donGia;
                    }

                    // Trigger popup vật tư khi nhập mã vật tư cho table
                    if (field === "ma_vt" && value && value.trim()) {
                        setSearchStates(prev => ({
                            ...prev,
                            maVtSearch: value.trim(),
                            maVtSearchRowId: id
                        }));
                    }

                    return updatedItem;
                }
                return item;
            });
            return newData;
        });
    }, []);

    const handleMainFormKhoSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            khoSearch: value,
            khoSearchRowId: "main-form",
            searchContext: "mainForm"
        }));
    }, []);

    const handleMainFormKhoNhanSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            khoSearch: value,
            khoSearchRowId: "main-form-nhan",
            searchContext: "mainFormReceive"
        }));
    }, []);

    const handleVatTuSelect = useCallback((id, vatTu) => {
        if (!vatTu || typeof vatTu !== 'object') {
            console.error('Invalid vatTu object:', vatTu);
            console.error('ID received:', id);
            return;
        }

        setCt85Data(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        ma_vt: vatTu.ma_vt?.toString().trim() || "",
                        ten_vt: vatTu.ten_vt || "",
                        tk_vt: vatTu.tk_vt || "",
                        don_vi_tinh: vatTu.don_vi_tinh || vatTu.dvt || vatTu.dv_tinh || "",
                        ton_kho: vatTu.ton_kho || 0,
                        don_gia: vatTu.don_gia || '',
                    }
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
        if (!kho || typeof kho !== 'object') {
            console.error('Invalid kho object:', kho);
            console.error('ID received:', id);
            return;
        }
        if (searchStates.searchContext === "mainForm") {
            handleFormChange("maKho", kho.ma_kho?.toString().trim() || "");
            handleFormChange("tenKho", kho.ten_kho?.toString().trim() || "");
        } else if (searchStates.searchContext === "mainFormReceive") {
            handleFormChange("maKhon", kho.ma_kho?.toString().trim() || "");
            handleFormChange("tenKhon", kho.ten_kho?.toString().trim() || "");
        }

        setSearchStates(prev => ({
            ...prev,
            showKhoPopup: false,
            khoSearch: "",
            searchContext: null
        }));
    }, [searchStates.searchContext, handleFormChange]);

    const handleDmvtSelect = useCallback((dmvt) => {
        if (!dmvt || !searchStates.maVtSearchRowId) {
            console.error('DMVT object or row ID is null/undefined');
            return;
        }

        setCt85Data(prev =>
            prev.map(item =>
                item.id === searchStates.maVtSearchRowId
                    ? {
                        ...item,
                        ma_vt: dmvt.ma_vt || dmvt.code || "",
                        ten_vt: dmvt.ten_vt || dmvt.name || "",
                        tk_vt: dmvt.tk_vt || "",
                        ma_nx_i: dmvt.tk_ck,
                        don_vi_tinh: dmvt.don_vi_tinh || dmvt.dvt || dmvt.dv_tinh || "",
                        ton_kho: dmvt.ton_kho || 0,
                        don_gia: dmvt.don_gia || ''
                    }
                    : item
            )
        );

        setSearchStates(prev => ({
            ...prev,
            showDmvtPopup: false,
            maVtSearch: "",
            maVtSearchRowId: null
        }));

        setDmvtSearchTerm("");
        setDmvtData({ data: [] });
    }, [searchStates.maVtSearchRowId]);

    const handleDmkhoSelect = useCallback((kho) => {
        if (!kho || !searchStates.maKhoTableSearchRowId) {
            console.error('Kho object or row ID is null/undefined');
            return;
        }

        setCt85Data(prev =>
            prev.map(item =>
                item.id === searchStates.maKhoTableSearchRowId
                    ? {
                        ...item,
                        ma_kho_i: kho.ma_kho || kho.code || "",
                        ten_kho: kho.ten_kho || kho.name || ""
                    }
                    : item
            )
        );

        setSearchStates(prev => ({
            ...prev,
            showDmkhoPopup: false,
            maKhoTableSearch: "",
            maKhoTableSearchRowId: null
        }));

        setMaKhoSearch("");
    }, [searchStates.maKhoTableSearchRowId]);

    const handleDmvtSearch = useCallback((searchTerm) => {
        console.log('🔍 DMVT search from popup:', searchTerm);
        setDmvtSearchTerm(searchTerm);
        fetchDmvtData(searchTerm);
    }, [fetchDmvtData]);

    const handleDmkhoSearch = useCallback((searchTerm) => {
        console.log('🔍 Dmkho search from popup:', searchTerm);
        setMaKhoSearch(searchTerm);
    }, []);

    const addCt85Row = useCallback(() => {
        console.log('🆕 Adding new CT85 row');

        setCt85Data(prev => {
            const newRowId = Math.max(...prev.map(item => item.id), 0) + 1;
            const newRow = {
                id: newRowId,
                ma_vt: "",
                ten_vt: "",
                tk_vt: "",
                don_vi_tinh: "",
                ton_kho: 0,
                so_luong: "",
                don_gia: "",
                ma_nx_i: "",
            };

            console.log('🆕 New row created:', newRow);
            return [...prev, newRow];
        });

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
        console.log('🗑️ Deleting CT85 row:', id);
        setCt85Data(prev => prev.filter(item => item.id !== id));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            ongBa: "",
            dienGiai: "",
            maKho: "",
            tenKho: "",
            maKhon: "",
            tenKhon: "",
            tSoLuong: 0,
            tyGia: 1,
            maQs: "",
            ngayLct: "",
            ngayCtPhieu: "",
            trangThai: "1",
            hd_lenhdd: "",
            soCt: "",
        });
        setCt85Data(INITIAL_CT85_DATA);
        setDmvtSearchTerm("");
        setDmvtData({ data: [] });
        setMaKhoSearch("");
        setSearchStates({
            vtSearch: "",
            vtSearchRowId: null,
            khoSearch: "",
            khoSearchRowId: null,
            searchContext: null,
            showVatTuPopup: false,
            showKhoPopup: false,
            maVtSearch: "",
            maVtSearchRowId: null,
            maKhoTableSearch: "",
            maKhoTableSearchRowId: null,
            showDmvtPopup: false,
            showDmkhoPopup: false,
        });
    }, []);

    const validateForm = useCallback(() => {
        if (!formData.maQs) {
            toast.error("Vui lòng nhập mã quyển sổ");
            return false;
        }
        if (!formData.maKho) {
            toast.error("Vui lòng nhập mã kho xuất");
            return false;
        }
        if (!formData.maKhon) {
            toast.error("Vui lòng nhập mã kho nhận");
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
                    ong_ba: formData.ongBa.trim() || "",
                    dien_giai: formData.dienGiai.trim() || "",
                    ma_kho: formData.maKho.trim() || "",
                    ma_khon: formData.maKhon.trim() || "",
                    t_so_luong: totals.totalSoLuong,
                    ty_gia: formData.tyGia,
                    ma_qs: formData.maQs.trim() || "",
                    ngay_lct: formData.ngayLct ? new Date(formData.ngayLct).toISOString() : undefined,
                    ngay_ct: formData.ngayCtPhieu ? new Date(formData.ngayCtPhieu).toISOString() : undefined,
                    status: formData.trangThai.trim() || "1",
                    hd_lenhdd: formData.hd_lenhdd.trim() || "",
                    so_ct: formData.soCt.trim() || "",
                },
                vatTu: ct85Data
                    .filter(row => row.ma_vt && parseFloat(row.so_luong) > 0)
                    .map(({ ma_vt, tk_vt, ma_nx_i, so_luong }) => ({
                        ma_vt: ma_vt?.toString().trim() || "",
                        tk_vt: tk_vt?.toString().trim() || "",
                        ma_nx_i: ma_nx_i?.toString().trim() || "",
                        so_luong: Number(so_luong) || 0,
                    })),
            };
            console.log('editingId:', editingId);
            console.log('payload:', payload);
            await updatePhieuXuatDc({ stt_rec: editingId, data: payload });
            closeModalEdit();
            resetForm();
            navigate("/phieu-xuat-dc");
        } catch (err) {
            console.error('Error updating phieu:', err);
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
            key: "ma_vt",
            title: "Mã vật tư",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_vt || ""}
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
                    {row.ten_vt || ""}
                </div>
            )
        },
        {
            key: "don_vi_tinh",
            title: "Đơn vị tính",
            width: 100,
            render: (val, row) => (
                <div className="text-gray-800 font-medium">
                    {row.don_vi_tinh || ""}
                </div>
            )
        },
        {
            key: "ton_kho",
            title: "Tồn kho",
            width: 100,
            render: (val, row) => (
                <div className="text-gray-800 font-medium text-right">
                    {formatNumber(row.ton_kho || 0)}
                </div>
            )
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-center text-sm text-blue-600 p-2 rounded ">
                            {formatNumber(totals.totalSoLuong)}
                        </div>
                    );
                }
                return (
                    <Input
                        type="number"
                        value={row.so_luong || ""}
                        onChange={(e) => handleCt85Change(row.id, "so_luong", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "don_gia",
            title: "Đơn giá",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        type="number"
                        value={row.don_gia || ''}
                        onChange={(e) => handleCt85Change(row.id, "don_gia", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "thanh_tien",
            title: "Thành tiền",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-sm text-blue-600 rounded">
                            {formatNumber(totals.totalThanhTien)}
                        </div>
                    );
                }
                const thanhTien = (parseFloat(row.so_luong) || 0) * (parseFloat(row.don_gia) || 0);
                return (
                    <div className="text-right text-green-600 font-medium">
                        {formatNumber(thanhTien)}
                    </div>
                );
            },
        },
        {
            key: "ma_nx_i",
            title: "TK nợ",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_nx_i || ''}
                        onChange={(e) => handleCt85Change(row.id, "ma_nx_i", e.target.value)}
                        placeholder="TK nợ"
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "tk_vt",
            title: "TK có",
            width: 100,
            render: (val, row) => (
                <div className="text-gray-800 font-medium">
                    {row.tk_vt || ""}
                </div>
            )
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
                            type="button"
                            onClick={() => deleteCt85Row(row.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors p-1"
                            title="Xóa dòng"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];

    // Data với total row
    const ct85DataWithTotal = useMemo(() => {
        return [
            ...ct85Data,
            {
                id: 'total',
                ma_vt: '',
                ten_vt: '',
                tk_vt: '',
                don_vi_tinh: '',
                ton_kho: 0,
                so_luong: totals.totalSoLuong,
                don_gia: '',
                ma_nx_i: '',
            }
        ];
    }, [ct85Data, totals]);

    // Loading state
    if (isLoadingEdit) {
        return (
            <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-7xl m-4">
                <div className="relative w-full h-full bg-white dark:bg-gray-900 flex items-center justify-center">
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
            <div className="relative w-full h-full bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 p-2 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-green-900 rounded-lg">
                                    <Plus className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                Chỉnh sửa phiếu xuất điều chuyển
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Cập nhật thông tin phiếu xuất điều chuyển #{formData.soCt || formData.maQs}
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
                <div className="flex-1 overflow-y-auto bg-blue-50">
                    {/* Form thông tin cơ bản */}
                    <div className="border-b border-gray-100">
                        <div className="dark:bg-gray-800 rounded-xl p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                                {/* Cột trái - 70% */}
                                <div className="lg:col-span-7 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã kho Xuất <span className="text-red-500">*</span>
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
                                        <span className="text-gray-600 text-sm">{formData.tenKho}</span>
                                    </div>

                                    {/* Mã kho nhận */}
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã kho Nhận <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.maKhon}
                                            onChange={(e) => {
                                                handleFormChange("maKhon", e.target.value);
                                                handleMainFormKhoNhanSearch(e.target.value);
                                            }}
                                            placeholder="KHO02"
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                        <span className="text-gray-600 text-sm">{formData.tenKhon}</span>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Người nhận hàng
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ongBa}
                                            onChange={(e) => handleFormChange("ongBa", e.target.value)}
                                            placeholder="Nguyễn Văn A"
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
                                            placeholder="Nhập diễn giải..."
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số hợp đồng
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.hd_lenhdd}
                                            onChange={(e) => handleFormChange("hd_lenhdd", e.target.value)}
                                            placeholder="HD-001"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Cột phải - 30% */}
                                <div className="lg:col-span-3 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã quyển sổ <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.maQs}
                                            onChange={(e) => handleFormChange("maQs", e.target.value)}
                                            placeholder="XDC001"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số chứng từ
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.soCt}
                                            onChange={(e) => handleFormChange("soCt", e.target.value)}
                                            placeholder="001"
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

                        {/* Tabs section */}
                        <div className="px-6">
                            <Tabs
                                tabs={[
                                    {
                                        label: "Hạch toán",
                                        content: (
                                            <div className="bg-white rounded-lg border border-gray-200" ref={ct85TableRef}>
                                                <TableBasic
                                                    data={ct85DataWithTotal}
                                                    columns={ct85Columns}

                                                    onDeleteRow={deleteCt85Row}
                                                    showAddButton={true}
                                                    addButtonText="Thêm dòng"
                                                    maxHeight="max-h-80"
                                                    className="w-full"
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                                onAddRow={addCt85Row}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-800">
                        <div className="flex justify-between items-center">
                            {/* Summary info */}
                            <div className="flex gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Tổng số lượng:</span>
                                    <span className="font-semibold text-green-600">
                                        {formatNumber(totals.totalSoLuong)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Tổng thành tiền:</span>
                                    <span className="font-semibold text-blue-600">
                                        {formatNumber(totals.totalThanhTien)} VND
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
                                    className={`px-6 py-2.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    <Save size={16} />
                                    {isPending ? "Đang cập nhật..." : "Cập nhật phiếu"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Material Selection Popup for main form */}
                    {searchStates.showVatTuPopup && (
                        <MaterialSelectionPopup
                            isOpen={searchStates.showVatTuPopup}
                            onClose={() => setSearchStates(prev => ({ ...prev, showVatTuPopup: false }))}
                            onSelect={(vatTu) => {
                                console.log('🎯 Material selected from popup:', vatTu);
                                handleVatTuSelect(searchStates.vtSearchRowId, vatTu);
                            }}
                            materials={Array.isArray(vatTuData?.data) ? vatTuData.data : []}
                            searchValue={searchStates.vtSearch}
                            rowId={searchStates.vtSearchRowId}
                        />
                    )}

                    {/* Warehouse Selection Popup for main form */}
                    {searchStates.showKhoPopup && (
                        <WarehouseSelectionPopup
                            isOpen={searchStates.showKhoPopup}
                            onClose={() => setSearchStates(prev => ({ ...prev, showKhoPopup: false }))}
                            onSelect={(kho) => {
                                console.log('🏠 Warehouse selected from popup:', kho);
                                handleKhoSelect(searchStates.khoSearchRowId, kho);
                            }}
                            warehouses={Array.isArray(khoData?.data) ? khoData.data : []}
                            searchValue={searchStates.khoSearch}
                            rowId={searchStates.khoSearchRowId}
                            onSearch={(value) => setSearchStates(prev => ({ ...prev, khoSearch: value }))}
                        />
                    )}

                    {/* DMVT Popup for table */}
                    {searchStates.showDmvtPopup && (
                        <MaterialSelectionPopup
                            isOpen={searchStates.showDmvtPopup}
                            onClose={() => {
                                setSearchStates(prev => ({
                                    ...prev,
                                    showDmvtPopup: false,
                                    maVtSearch: "",
                                    maVtSearchRowId: null
                                }));
                                setDmvtSearchTerm("");
                                setDmvtData({ data: [] });
                            }}
                            onSelect={(dmvt) => {
                                console.log('🎯 DMVT selected from table popup:', dmvt);
                                handleDmvtSelect(dmvt);
                            }}
                            onSearch={handleDmvtSearch}
                            materials={dmvtData.data || []}
                            searchValue={dmvtSearchTerm}
                            loading={dmvtLoading}
                            rowId={searchStates.maVtSearchRowId}
                        />
                    )}

                    {/* DMKHO Popup for table */}
                    {searchStates.showDmkhoPopup && (
                        <WarehouseSelectionPopup
                            isOpen={searchStates.showDmkhoPopup}
                            onClose={() => {
                                setSearchStates(prev => ({
                                    ...prev,
                                    showDmkhoPopup: false,
                                    maKhoTableSearch: "",
                                    maKhoTableSearchRowId: null
                                }));
                                setMaKhoSearch("");
                            }}
                            onSelect={(kho) => {
                                console.log('🏠 DMKHO selected from table popup:', kho);
                                handleDmkhoSelect(kho);
                            }}
                            onSearch={handleDmkhoSearch}
                            warehouses={dmkhoTableData.data || []}
                            searchValue={maKhoSearch}
                            loading={false}
                            rowId={searchStates.maKhoTableSearchRowId}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
};