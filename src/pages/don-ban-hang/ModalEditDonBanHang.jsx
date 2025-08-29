import { useQueries } from "@tanstack/react-query";
import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalendarIcon, Edit, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import AccountSelectionPopup from "../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../components/general/CustomerSelectionPopup";
import WarehouseSelectionPopup from "../../components/general/dmkPopup";
import MaterialSelectionPopup from "../../components/general/dmvtPopup";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../components/ui/modal";
import { Tabs } from "../../components/ui/tabs";
import { useAccounts } from "../../hooks/useAccounts";
import { useCustomers } from "../../hooks/useCustomer";
import { useDmkho } from "../../hooks/useDmkho";
import { useDmvt } from "../../hooks/useDmvt";
import { useGetDonBanHangBySttRec, useUpdatePhieu } from "../../hooks/useDonBanHang";
import DmkhoService from "../../services/dmkho";
import dmvtService from "../../services/dmvt";

const STATUS_OPTIONS = [
    { value: "1", label: "Ghi vào sổ cái" },
    { value: "2", label: "Chưa ghi sổ cái" },
];

const FLATPICKR_OPTIONS = {
    dateFormat: "Y-m-d",
    locale: Vietnamese,
};

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const ModalEditDonBanHang = ({ isOpenEdit, closeModalEdit, editingId }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ma_kh: "",
        dia_chi: "",
        ma_so_thue: "",
        ong_ba: "",
        dien_giai: "",
        ma_qs: "",
        so_ct: "",
        ngay_ct: "",
        ngay_lct: "",
        tk_thue_no: "",
        status: "1",
        ma_dvcs: "",
        ty_gia: "1.00",
        ma_hd_me: "",
        ma_nx: "",
    });

    const [hangHoaData, setHangHoaData] = useState([]);

    // State cho detail queries
    const [detailQueries, setDetailQueries] = useState({
        vatTuCodes: [],
        khoCodes: []
    });

    // Search states với debounce
    const [searchStates, setSearchStates] = useState({
        tkSearch: "",
        tkSearchRowId: null,
        tkSearchField: null,
        maKhSearch: "",
        maKhSearchRowId: null,
        vtSearch: "",
        vtSearchRowId: null,
        khoSearch: "",
        khoSearchRowId: null,
        maNxSearch: "",
        searchContext: null,
        showAccountPopup: false,
        showCustomerPopup: false,
        showVatTuPopup: false,
        showKhoPopup: false,
        showMaNxAccountPopup: false,
    });

    const hangHoaTableRef = useRef(null);

    // Debounced search values
    const debouncedTkSearch = useDebounce(searchStates.tkSearch, 600);
    const debouncedMaKhSearch = useDebounce(searchStates.maKhSearch, 600);
    const debouncedVtSearch = useDebounce(searchStates.vtSearch, 600);
    const debouncedKhoSearch = useDebounce(searchStates.khoSearch, 600);
    const debouncedMaNxSearch = useDebounce(searchStates.maNxSearch, 600);

    // React Query calls
    const { data: editData, isLoading: isLoadingEdit } = useGetDonBanHangBySttRec(editingId);

    const { data: accountRawData = {} } = useAccounts(
        { search: debouncedTkSearch || "" },
        { enabled: !!debouncedTkSearch && debouncedTkSearch.length > 0 }
    );

    const { data: customerData = [] } = useCustomers(
        { search: debouncedMaKhSearch || "" },
        { enabled: !!debouncedMaKhSearch && debouncedMaKhSearch.length > 0 }
    );

    const { data: vatTuData = [] } = useDmvt(
        { search: debouncedVtSearch || "" },
        { enabled: !!debouncedVtSearch && debouncedVtSearch.length > 0 }
    );

    const { data: khoData = [] } = useDmkho(
        { search: debouncedKhoSearch || "" },
        { enabled: !!debouncedKhoSearch && debouncedKhoSearch.length > 0 }
    );

    const { data: maNxAccountRawData = {} } = useAccounts(
        { search: debouncedMaNxSearch || "" },
        { enabled: !!debouncedMaNxSearch && debouncedMaNxSearch.length > 0 }
    );

    const { mutateAsync: updateDonBanHang, isPending } = useUpdatePhieu();

    // useQueries để fetch thông tin vật tư và kho
    const vatTuDataArray = useQueries({
        queries: detailQueries.vatTuCodes.map(ma_vt => ({
            queryKey: ["dmvt", ma_vt],
            queryFn: () => dmvtService.getDmvtById(ma_vt),
            staleTime: 0,
            refetchOnWindowFocus: false,
            enabled: !!ma_vt,
        }))
    });

    const khoDataArray = useQueries({
        queries: detailQueries.khoCodes.map(ma_kho => ({
            queryKey: ["dmkho", ma_kho],
            queryFn: () => DmkhoService.getDmkhoById(ma_kho),
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            enabled: !!ma_kho,
        }))
    });

    const vatTuDetailQueries = vatTuDataArray.map(q => q.data);
    const khoDetailQueries = khoDataArray.map(q => q.data);

    // Load data khi mở modal edit
    useEffect(() => {
        if (editData && isOpenEdit) {
            const data = editData.data || editData;
            setFormData({
                ma_kh: data.ma_kh || "",
                dia_chi: data.dia_chi || "",
                ma_so_thue: data.ma_so_thue || "",
                ong_ba: data.ong_ba || "",
                dien_giai: data.dien_giai || "",
                ma_qs: data.ma_qs || "",
                so_ct: data.so_ct || "",
                ngay_ct: data.ngay_ct ? new Date(data.ngay_ct).toISOString().split('T')[0] : "",
                ngay_lct: data.ngay_lct ? new Date(data.ngay_lct).toISOString().split('T')[0] : "",
                tk_thue_no: data.tk_thue_no || "",
                status: data.status || "1",
                ma_dvcs: data.ma_dvcs || "",
                ty_gia: data.ty_gia || "1.00",
                ma_hd_me: data.ma_hd_me || "",
                ma_nx: data.ma_nx || "",
            });

            // Load hàng hóa data
            if (data.hangHoa && Array.isArray(data.hangHoa)) {
                const vatTuCodes = [];
                const khoCodes = [];

                const hangHoaWithId = data.hangHoa.map((item, index) => {
                    // Collect mã vật tư và mã kho để fetch thông tin
                    if (item.ma_vt && !vatTuCodes.includes(item.ma_vt)) {
                        vatTuCodes.push(item.ma_vt);
                    }
                    if (item.ma_kho_i && !khoCodes.includes(item.ma_kho_i)) {
                        khoCodes.push(item.ma_kho_i);
                    }

                    return {
                        id: index + 1,
                        ma_kho_i: item.ma_kho_i || "",
                        ma_vt: item.ma_vt || "",
                        so_luong: item.so_luong || "",
                        gia_nt: item.gia_nt || "",
                        gia_nt2: item.gia_nt2 || "",
                        tien_nt: item.tien_nt || "",
                        tien_nt2: item.tien_nt2 || "",
                        tk_vt: item.tk_vt || "",
                        thue_nt: item.thue_nt || "",
                        tl_ck: item.tl_ck || "",
                        ck_nt: item.ck_nt || "",
                        thue_suat: item.thue_suat || "",
                        ma_thue: item.ma_thue || "",
                        han_gh_i: item.han_gh_i ? new Date(item.han_gh_i).toISOString().split('T')[0] : "",
                        ten_vt: "",
                        dvt: "",
                        ten_kho: "",
                    };
                });

                setHangHoaData(hangHoaWithId);

                // Set detail queries để fetch thông tin
                setDetailQueries({
                    vatTuCodes: [...new Set(vatTuCodes)],
                    khoCodes: [...new Set(khoCodes)]
                });
            }
        }
    }, [editData, isOpenEdit]);

    // Effect để update thông tin vật tư khi có data
    useEffect(() => {
        detailQueries.vatTuCodes.forEach((ma_vt, index) => {
            const vatTuDetail = vatTuDetailQueries[index];
            if (!vatTuDetail) return;

            setHangHoaData(prev => {
                const updated = prev.map(item => {
                    if (item.ma_vt === ma_vt) {
                        const shouldUpdate =
                            vatTuDetail.ten_vt !== item.ten_vt ||
                            vatTuDetail.dvt !== item.dvt ||
                            vatTuDetail.tk_vt !== item.tk_vt;
                        if (shouldUpdate) {
                            return {
                                ...item,
                                ten_vt: vatTuDetail.ten_vt || item.ten_vt,
                                dvt: vatTuDetail.don_vi_tinh || vatTuDetail.dvt || item.dvt,
                                tk_vt: vatTuDetail.tk_vt || item.tk_vt,
                            };
                        }
                    }
                    return item;
                });
                return updated;
            });
        });
    }, [JSON.stringify(vatTuDetailQueries)]);

    // Effect để update thông tin kho khi có data
    useEffect(() => {
        if (khoDetailQueries.length > 0) {
            detailQueries.khoCodes.forEach((ma_kho, index) => {
                const khoDetail = khoDetailQueries[index];
                if (!khoDetail) return;

                setHangHoaData(prev => {
                    const updated = prev.map(item => {
                        if (item.ma_kho_i === ma_kho) {
                            const newTenKho = khoDetail.data?.ten_kho || item.ten_kho;
                            const newTkVt = item.tk_vt || khoDetail.tk_dl || khoDetail.tk_vt || "";
                            const shouldUpdate =
                                item.ten_kho !== newTenKho ||
                                item.tk_vt !== newTkVt;
                            if (shouldUpdate) {
                                return {
                                    ...item,
                                    ten_kho: newTenKho,
                                    tk_vt: newTkVt,
                                };
                            }
                        }
                        return item;
                    });
                    return updated;
                });
            });
        }
    }, [JSON.stringify(khoDetailQueries)]);

    // Tính tổng tiền theo đúng khuôn mẫu
    const totals = useMemo(() => {
        const totalSoLuong = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.so_luong) || 0;
            return sum + value;
        }, 0);

        // Tổng tiền hàng (trước chiết khấu)
        const totalTienHang = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.tien_nt) || 0;
            return sum + value;
        }, 0);

        // Tổng chiết khấu
        const totalChietKhau = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.ck_nt) || 0;
            return sum + value;
        }, 0);

        // Tổng tiền sau chiết khấu
        const totalTienSauCK = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.tien_nt2) || 0;
            return sum + value;
        }, 0);

        // Tổng tiền thuế GTGT
        const totalThueGtgt = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.thue_nt) || 0;
            return sum + value;
        }, 0);

        // Tổng cộng thanh toán = tiền sau CK + thuế
        const totalThanhTien = totalTienSauCK + totalThueGtgt;

        return {
            totalSoLuong,
            totalTienHang,
            totalChietKhau,
            totalTienSauCK,
            totalThueGtgt,
            totalThanhTien
        };
    }, [hangHoaData]);

    // Auto show/hide popups
    useEffect(() => {
        setSearchStates(prev => ({
            ...prev,
            showAccountPopup: !!debouncedTkSearch && debouncedTkSearch.length > 0
        }));
    }, [debouncedTkSearch]);

    useEffect(() => {
        setSearchStates(prev => ({
            ...prev,
            showCustomerPopup: !!debouncedMaKhSearch && debouncedMaKhSearch.length > 0
        }));
    }, [debouncedMaKhSearch]);

    useEffect(() => {
        setSearchStates(prev => ({
            ...prev,
            showVatTuPopup: !!debouncedVtSearch && debouncedVtSearch.length > 0
        }));
    }, [debouncedVtSearch]);

    useEffect(() => {
        setSearchStates(prev => ({
            ...prev,
            showKhoPopup: !!debouncedKhoSearch && debouncedKhoSearch.length > 0
        }));
    }, [debouncedKhoSearch]);

    useEffect(() => {
        setSearchStates(prev => ({
            ...prev,
            showMaNxAccountPopup: !!debouncedMaNxSearch && debouncedMaNxSearch.length > 0
        }));
    }, [debouncedMaNxSearch]);

    // Handlers
    const handleFormChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleDateChange = useCallback((date, field) => {
        const formattedDate = date[0]?.toLocaleDateString("en-CA");
        handleFormChange(field, formattedDate);
    }, [handleFormChange]);

    const handleHangHoaChange = useCallback((id, field, value) => {
        setHangHoaData(prev => {
            const newData = prev.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };

                    // Tự động tính tiền theo đúng khuôn mẫu
                    if (field === "so_luong" || field === "gia_nt") {
                        const soLuong = parseFloat(field === "so_luong" ? value : item.so_luong) || 0;
                        const gia = parseFloat(field === "gia_nt" ? value : item.gia_nt) || 0;

                        // Tiền hàng = số lượng × đơn giá
                        const tienHang = soLuong * gia;
                        updatedItem.tien_nt = tienHang.toString();

                        // Tính chiết khấu
                        const tlCK = parseFloat(item.tl_ck) || 0;
                        const tienCK = (tienHang * tlCK) / 100;
                        updatedItem.ck_nt = tienCK.toString();

                        // Tiền sau chiết khấu
                        const tienSauCK = tienHang - tienCK;
                        updatedItem.tien_nt2 = tienSauCK.toString();

                        // Đơn giá sau chiết khấu
                        updatedItem.gia_nt2 = soLuong > 0 ? (tienSauCK / soLuong).toString() : "0";

                        // Tính thuế GTGT
                        const thueSuat = parseFloat(item.thue_suat) || 0;
                        const tienThue = (tienSauCK * thueSuat) / 100;
                        updatedItem.thue_nt = tienThue.toString();
                    }

                    // Tính lại khi thay đổi tỷ lệ chiết khấu
                    if (field === "tl_ck") {
                        const soLuong = parseFloat(item.so_luong) || 0;
                        const gia = parseFloat(item.gia_nt) || 0;
                        const tienHang = soLuong * gia;

                        const tlCK = parseFloat(value) || 0;
                        const tienCK = (tienHang * tlCK) / 100;
                        updatedItem.ck_nt = tienCK.toString();

                        const tienSauCK = tienHang - tienCK;
                        updatedItem.tien_nt2 = tienSauCK.toString();
                        updatedItem.gia_nt2 = soLuong > 0 ? (tienSauCK / soLuong).toString() : "0";

                        // Tính lại thuế
                        const thueSuat = parseFloat(item.thue_suat) || 0;
                        const tienThue = (tienSauCK * thueSuat) / 100;
                        updatedItem.thue_nt = tienThue.toString();
                    }

                    // Tính thuế khi thay đổi thuế suất
                    if (field === "thue_suat") {
                        const tienSauCK = parseFloat(item.tien_nt2) || 0;
                        const thueSuat = parseFloat(value) || 0;
                        const tienThue = (tienSauCK * thueSuat) / 100;
                        updatedItem.thue_nt = tienThue.toString();
                    }

                    return updatedItem;
                }
                return item;
            });
            return newData;
        });

        // Search logic
        if (field === "ma_vt") {
            setSearchStates(prev => ({
                ...prev,
                vtSearch: value,
                vtSearchRowId: id,
                searchContext: "hangHoa",
            }));
        }
        if (field === "tk_vt") {
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: "tk_vt",
                searchContext: "hangHoa",
            }));
        }
        if (field === "ma_kho_i") {
            setSearchStates(prev => ({
                ...prev,
                khoSearch: value,
                khoSearchRowId: id,
                searchContext: "hangHoa",
            }));
        }
    }, []);

    const handleMainFormCustomerSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            maKhSearch: value,
            maKhSearchRowId: "main-form",
            searchContext: "mainForm",
        }));
    }, []);

    const handleMaNxAccountSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            maNxSearch: value,
            searchContext: "maNx",
        }));
    }, []);

    const handleAccountSelect = useCallback((id, account) => {
        if (searchStates.searchContext === "mainForm") {
            handleFormChange("tk_thue_no", account.tk.trim());
        } else if (searchStates.searchContext === "hangHoa") {
            setHangHoaData(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, [searchStates.tkSearchField]: account.tk.trim() }
                        : item
                )
            );
        } else if (searchStates.searchContext === "maNx") {
            handleFormChange("ma_nx", account.tk.trim());
        }

        // Clear search state
        setSearchStates(prev => ({
            ...prev,
            showAccountPopup: false,
            tkSearch: "",
            tkSearchField: null,
            searchContext: null
        }));
    }, [searchStates.tkSearchField, searchStates.searchContext, handleFormChange]);

    const handleCustomerSelect = useCallback((id, customer) => {
        if (searchStates.searchContext === "mainForm") {
            handleFormChange("ma_kh", customer.ma_kh.trim() || "");
            handleFormChange("dia_chi", customer.dia_chi || "");
            handleFormChange("ma_so_thue", customer.ma_so_thue || "");
        }

        // Clear search state
        setSearchStates(prev => ({
            ...prev,
            showCustomerPopup: false,
            maKhSearch: "",
            searchContext: null
        }));
    }, [searchStates.searchContext, handleFormChange]);

    const handleVatTuSelect = useCallback((id, vatTu) => {
        if (searchStates.searchContext === "hangHoa") {
            setHangHoaData(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            ma_vt: vatTu.ma_vt || "",
                            ten_vt: vatTu.ten_vt || "",
                            dvt: vatTu.dvt || ""
                        }
                        : item
                )
            );
        }

        // Clear search state
        setSearchStates(prev => ({
            ...prev,
            showVatTuPopup: false,
            vtSearch: "",
            searchContext: null
        }));
    }, [searchStates.searchContext]);

    const handleKhoSelect = useCallback((id, kho) => {
        if (searchStates.searchContext === "hangHoa") {
            setHangHoaData(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            ma_kho_i: kho.ma_kho || "",
                            ten_kho: kho.ten_kho || "",
                            tk_vt: kho.tk_dl || ""
                        }
                        : item
                )
            );
        }

        // Clear search state
        setSearchStates(prev => ({
            ...prev,
            showKhoPopup: false,
            khoSearch: "",
            searchContext: null
        }));
    }, [searchStates.searchContext]);

    const handleMaNxAccountSelect = useCallback((account) => {
        handleFormChange("ma_nx", account.tk.trim());

        // Clear search state
        setSearchStates(prev => ({
            ...prev,
            showMaNxAccountPopup: false,
            maNxSearch: "",
            searchContext: null
        }));
    }, [handleFormChange]);

    const addHangHoaRow = useCallback(() => {
        setHangHoaData(prev => [
            ...prev,
            {
                id: prev.length + 1,
                ma_kho_i: "",
                ma_vt: "",
                ten_vt: "",
                so_luong: "",
                gia_nt: "",
                gia_nt2: "",
                tien_nt: "",
                tien_nt2: "",
                tk_vt: "",
                thue_nt: "",
                tl_ck: "",
                ck_nt: "",
                thue_suat: "",
                ma_thue: "",
                dvt: "",
                ten_kho: "",
                han_gh_i: "",
            }
        ]);

        setTimeout(() => {
            if (hangHoaTableRef.current) {
                const tableContainer = hangHoaTableRef.current.querySelector('.overflow-x-auto');
                if (tableContainer) {
                    tableContainer.scrollTop = tableContainer.scrollHeight;
                }
            }
        }, 100);
    }, []);

    const deleteHangHoaRow = useCallback((id) => {
        setHangHoaData(prev => prev.filter(item => item.id !== id));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            ma_kh: "",
            dia_chi: "",
            ma_so_thue: "",
            ong_ba: "",
            dien_giai: "",
            ma_qs: "",
            so_ct: "",
            ngay_ct: "",
            ngay_lct: "",
            tk_thue_no: "",
            status: "1",
            ma_dvcs: "",
            ty_gia: "1.00",
            ma_hd_me: "",
            ma_nx: "",
        });
        setHangHoaData([]);
        setDetailQueries({
            vatTuCodes: [],
            khoCodes: []
        });
        setSearchStates({
            tkSearch: "",
            tkSearchRowId: null,
            tkSearchField: null,
            maKhSearch: "",
            maKhSearchRowId: null,
            vtSearch: "",
            vtSearchRowId: null,
            khoSearch: "",
            khoSearchRowId: null,
            maNxSearch: "",
            searchContext: null,
            showAccountPopup: false,
            showCustomerPopup: false,
            showVatTuPopup: false,
            showKhoPopup: false,
            showMaNxAccountPopup: false,
        });
    }, []);

    const validateForm = useCallback(() => {
        if (!formData.so_ct) {
            toast.error("Vui lòng nhập số chứng từ");
            return false;
        }
        if (!formData.ma_kh) {
            toast.error("Vui lòng nhập mã khách hàng");
            return false;
        }
        if (!formData.ngay_lct) {
            toast.error("Vui lòng nhập ngày lập chứng từ");
            return false;
        }

        const validHangHoaRows = hangHoaData.filter(row =>
            row.ma_vt && parseFloat(row.tien_nt2) > 0
        );
        if (validHangHoaRows.length === 0) {
            toast.error("Vui lòng nhập ít nhất một dòng hàng hóa hợp lệ");
            return false;
        }

        return true;
    }, [formData, hangHoaData]);

    const handleSave = useCallback(async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const payload = {
                // Dmhd - Đầu phiếu
                phieu: {
                    ma_kh: formData.ma_kh?.trim() || "",
                    dia_chi: formData.dia_chi?.trim() || "",
                    ma_so_thue: formData.ma_so_thue?.trim() || "",
                    dien_giai: formData.dien_giai?.trim() || "",
                    ma_qs: formData.ma_qs?.trim() || "",
                    t_so_luong: totals.totalSoLuong,
                    t_tien_nt2: totals.totalTienSauCK,
                    t_thue: totals.totalThueGtgt,
                    t_tt_nt: totals.totalThanhTien,
                    t_ck: totals.totalChietKhau,
                    tk_thue_no: formData.tk_thue_no?.trim() || "",
                    status: formData.status,
                    ma_dvcs: formData.ma_dvcs?.trim() || "",
                    so_ct: formData.so_ct?.trim() || "",
                    ong_ba: formData.ong_ba?.trim() || "",
                    ty_gia: String(formData.ty_gia ?? '').trim() || "1.00",
                    ma_hd_me: formData.ma_hd_me?.trim() || "",
                    ma_nx: formData.ma_nx?.trim() || "",
                    ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : new Date().toISOString(),
                    ngay_lct: formData.ngay_lct ? new Date(formData.ngay_lct).toISOString() : new Date().toISOString(),
                },
                // Dmhdct - Hàng hóa
                hangHoa: hangHoaData
                    .filter(row => row.ma_vt && parseFloat(row.tien_nt2) > 0)
                    .map(({ ma_kho_i, ma_vt, thue_nt, tien_nt2, tien_nt, gia_nt2, gia_nt, tl_ck, ck_nt, thue_suat, tk_vt, so_luong, ma_thue, han_gh_i }) => ({
                        ma_kho_i: ma_kho_i?.trim() || "",
                        ma_vt: ma_vt?.trim() || "",
                        ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : new Date().toISOString(),
                        han_gh_i: han_gh_i ? new Date(han_gh_i).toISOString() : new Date().toISOString(),
                        thue_nt: Number(thue_nt) || 0,
                        tien_nt2: Number(tien_nt2) || 0,
                        tien_nt: Number(tien_nt) || 0,
                        gia_nt2: Number(gia_nt2) || 0,
                        gia_nt: Number(gia_nt) || 0,
                        tl_ck: Number(tl_ck) || 0,
                        ck_nt: Number(ck_nt) || 0,
                        thue_suat: Number(thue_suat) || 0,
                        tk_vt: tk_vt?.trim() || "",
                        so_luong: Number(so_luong) || 0,
                        ma_thue: ma_thue?.trim() || "",
                    })),
            };

            await updateDonBanHang({ stt_rec: editingId, data: payload });
            closeModalEdit();
            resetForm();
            navigate("/don-ban-hang");
            toast.success("Cập nhật đơn bán hàng thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi cập nhật đơn bán hàng: " + (err?.message || "Không xác định"));
        }
    }, [formData, hangHoaData, totals, updateDonBanHang, editingId, closeModalEdit, resetForm, navigate, validateForm]);

    const handleClose = useCallback(() => {
        resetForm();
        closeModalEdit();
    }, [resetForm, closeModalEdit]);

    // Columns cho bảng hàng hóa (giống như trong create modal)
    const hangHoaColumns = [
        {
            key: "ma_kho_i",
            title: "Mã kho",
            dataIndex: "ma_kho_i",
            width: 120,
            fixed: "left",
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={11}
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "ma_kho_i", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "ten_kho",
            title: "Tên kho",
            dataIndex: "ten_kho",
            width: 140,
            render: (text) => (
                <div className="text-xs text-gray-600 truncate" title={text}>
                    {text || ""}
                </div>
            ),
        },
        {
            key: "ma_vt",
            title: "Mã vật tư",
            dataIndex: "ma_vt",
            width: 120,
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={12}
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "ma_vt", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "ten_vt",
            title: "Tên vật tư",
            dataIndex: "ten_vt",
            width: 200,
            render: (text) => (
                <div className="text-xs text-gray-600 truncate" title={text}>
                    {text || ""}
                </div>
            ),
        },
        {
            key: "dvt",
            title: "ĐVT",
            dataIndex: "dvt",
            width: 80,
            render: (text) => (
                <div className="text-xs text-center text-gray-600">
                    {text || ""}
                </div>
            ),
        },
        {
            key: "so_luong",
            title: "Số lượng",
            dataIndex: "so_luong",
            width: 100,
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={13}
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "so_luong", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                />
            ),
        },
        {
            key: "gia_nt",
            title: "Đơn giá",
            dataIndex: "gia_nt",
            width: 120,
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={14}
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "gia_nt", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                />
            ),
        },
        {
            key: "tien_nt",
            title: "Tiền hàng",
            dataIndex: "tien_nt",
            width: 120,
            render: (text) => (
                <div className="text-xs text-right text-blue-600 font-medium">
                    {parseFloat(text || 0).toLocaleString('vi-VN')}
                </div>
            ),
        },
        {
            key: "tl_ck",
            title: "TL CK (%)",
            dataIndex: "tl_ck",
            width: 100,
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={15}
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "tl_ck", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                    min="0"
                    max="100"
                />
            ),
        },
        {
            key: "ck_nt",
            title: "Tiền CK",
            dataIndex: "ck_nt",
            width: 120,
            render: (text) => (
                <div className="text-xs text-right text-orange-600">
                    {parseFloat(text || 0).toLocaleString('vi-VN')}
                </div>
            ),
        },
        {
            key: "gia_nt2",
            title: "Giá sau CK",
            dataIndex: "gia_nt2",
            width: 120,
            render: (text) => (
                <div className="text-xs text-right text-green-600">
                    {parseFloat(text || 0).toLocaleString('vi-VN')}
                </div>
            ),
        },
        {
            key: "tien_nt2",
            title: "Thành tiền",
            dataIndex: "tien_nt2",
            width: 120,
            render: (text) => (
                <div className="text-xs text-right text-red-600 font-medium">
                    {parseFloat(text || 0).toLocaleString('vi-VN')}
                </div>
            ),
        },
        {
            key: "thue_suat",
            title: "Thuế suất (%)",
            dataIndex: "thue_suat",
            width: 120,
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={16}
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "thue_suat", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                    min="0"
                    max="100"
                />
            ),
        },
        {
            key: "thue_nt",
            title: "Tiền thuế",
            dataIndex: "thue_nt",
            width: 120,
            render: (text) => (
                <div className="text-xs text-right text-purple-600">
                    {parseFloat(text || 0).toLocaleString('vi-VN')}
                </div>
            ),
        },
        {
            key: "tk_vt",
            title: "TK vật tư",
            dataIndex: "tk_vt",
            width: 120,
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={17}
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "tk_vt", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "han_gh_i",
            title: "Hạn giao hàng",
            dataIndex: "han_gh_i",
            width: 140,
            render: (text, record) => (
                <input
                    onKeyDown={handleKeyDown}
                    tabIndex={18}
                    type="date"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "han_gh_i", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "action",
            title: "Thao tác",
            fixed: "right",
            width: 80,
            render: (_, record) => (
                <button
                    onClick={() => deleteHangHoaRow(record.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Xóa dòng"
                >
                    <Trash2 size={14} />
                </button>
            ),
        },
    ];

    if (isLoadingEdit) {
        return (
            <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-7xl m-4">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </Modal>
        );
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            // Lấy tabIndex từ element hiện tại thay vì biến tabIndex không tồn tại
            const currentTabIndex = parseInt(e.target.tabIndex) || 0;
            const nextInput = document.querySelector(`input[tabindex="${currentTabIndex + 1}"]`);

            if (nextInput) {
                nextInput.focus();
                nextInput.select();
            }
        }
    };
    return (
        <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-7xl m-4">
            <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
                {/* Header - Màu blue */}
                <div className="flex-shrink-0 p-2 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Edit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                Sửa đơn bán hàng
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Chỉnh sửa thông tin đơn bán hàng với giao diện tối ưu
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

                {/* Content - Background blue */}
                <div className="flex-1 overflow-y-auto bg-blue-50">
                    {/* Form thông tin cơ bản */}
                    <div className="border-b border-gray-100">
                        <div className="dark:bg-gray-800 rounded-xl p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                                {/* Cột trái - 70% (7 cột) */}
                                <div className="lg:col-span-7 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã khách <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={1}
                                            type="text"
                                            value={formData.ma_kh}
                                            onChange={(e) => {
                                                handleFormChange("ma_kh", e.target.value);
                                                handleMainFormCustomerSearch(e.target.value);
                                            }}
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Địa chỉ
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={2}
                                            type="text"
                                            value={formData.dia_chi}
                                            onChange={(e) => handleFormChange("dia_chi", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px] ml-4">
                                            MST
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={3}
                                            type="text"
                                            value={formData.ma_so_thue}
                                            onChange={(e) => handleFormChange("ma_so_thue", e.target.value)}
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Người nhận hàng
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={4}
                                            type="text"
                                            value={formData.ong_ba}
                                            onChange={(e) => handleFormChange("ong_ba", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Diễn giải
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={5}
                                            type="text"
                                            value={formData.dien_giai}
                                            onChange={(e) => handleFormChange("dien_giai", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số đơn hàng mẹ
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={6}
                                            type="text"
                                            value={formData.ma_hd_me}
                                            onChange={(e) => handleFormChange("ma_hd_me", e.target.value)}
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px] ">
                                            Mã NX
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={7}
                                            type="text"
                                            value={formData.ma_nx}
                                            onChange={(e) => {
                                                handleFormChange("ma_nx", e.target.value);
                                                handleMaNxAccountSearch(e.target.value);
                                            }}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Cột phải - 30% (3 cột) */}
                                <div className="lg:col-span-3 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày HT
                                        </Label>
                                        <div className="relative flex-1">
                                            <Flatpickr
                                                value={formData.ngay_ct}
                                                onChange={(date) => handleDateChange(date, "ngay_ct")}
                                                options={FLATPICKR_OPTIONS}
                                                placeholder="Chọn ngày..."
                                                className="w-full h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                            <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày lập phiếu <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative flex-1">
                                            <Flatpickr
                                                value={formData.ngay_lct}
                                                onChange={(date) => handleDateChange(date, "ngay_lct")}
                                                options={FLATPICKR_OPTIONS}
                                                placeholder="Chọn ngày..."
                                                className="w-full h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            />
                                            <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Quyển sổ
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={8}
                                            type="text"
                                            value={formData.ma_qs}
                                            onChange={(e) => handleFormChange("ma_qs", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số phiếu <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            onKeyDown={handleKeyDown}
                                            tabIndex={9}
                                            type="text"
                                            value={formData.so_ct}
                                            onChange={(e) => handleFormChange("so_ct", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Xử lý
                                        </Label>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden flex-1">
                                            <span className="px-3 py-2 bg-gray-50 text-gray-700 font-medium border-r border-gray-300 text-sm">
                                                VND
                                            </span>
                                            <input
                                                onKeyDown={handleKeyDown}
                                                tabIndex={10}
                                                type="text"
                                                value={formData.ty_gia}
                                                onChange={(e) => handleFormChange("ty_gia", e.target.value)}
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
                                                defaultValue={formData.status}
                                                options={STATUS_OPTIONS}
                                                onChange={(value) => handleFormChange("status", value)}
                                                className="w-full h-9 text-sm bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bảng hàng hóa với Tabs */}
                    <div className="px-6">
                        <Tabs
                            tabs={[
                                {
                                    label: "1. Hàng hóa",
                                    content: (
                                        <TableBasic
                                            data={hangHoaData}
                                            columns={hangHoaColumns}
                                            onDeleteRow={deleteHangHoaRow}
                                            showAddButton={true}
                                            addButtonText="Thêm dòng hàng hóa"
                                            maxHeight="max-h-80"
                                            className="w-full"
                                        />
                                    ),
                                },
                            ]}
                            onAddRow={() => {
                                addHangHoaRow();
                            }}
                            onChangeTab={(tabIndex) => {
                            }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                        {/* Summary info theo đúng khuôn mẫu */}
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Số lượng:</span>
                                <span className="font-semibold text-blue-600">
                                    {totals.totalSoLuong.toLocaleString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Cộng tiền hàng:</span>
                                <span className="font-semibold text-blue-600">
                                    {totals.totalTienHang.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Chiết khấu:</span>
                                <span className="font-semibold text-orange-600">
                                    {totals.totalChietKhau.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tiền sau CK:</span>
                                <span className="font-semibold text-green-600">
                                    {totals.totalTienSauCK.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tiền thuế GTGT:</span>
                                <span className="font-semibold text-purple-600">
                                    {totals.totalThueGtgt.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tổng cộng TT:</span>
                                <span className="font-semibold text-red-600">
                                    {totals.totalThanhTien.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                        </div>

                        {/* Action buttons - Màu blue */}
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
                                className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                <Save size={16} />
                                {isPending ? "Đang cập nhật..." : "Cập nhật đơn bán hàng"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Popups */}
                {searchStates.showAccountPopup && (
                    <AccountSelectionPopup
                        isOpen={true}
                        onClose={() => setSearchStates(prev => ({ ...prev, showAccountPopup: false, tkSearch: "" }))}
                        onSelect={(account) => {
                            if (searchStates.searchContext === "mainForm") {
                                handleAccountSelect("main-form", account);
                            } else {
                                handleAccountSelect(searchStates.tkSearchRowId, account);
                            }
                        }}
                        accounts={accountRawData.data || []}
                        searchValue={searchStates.tkSearch}
                        onSearchChange={(value) => setSearchStates(prev => ({ ...prev, tkSearch: value }))}
                    />
                )}

                {searchStates.showCustomerPopup && (
                    <CustomerSelectionPopup
                        isOpen={true}
                        onClose={() => setSearchStates(prev => ({ ...prev, showCustomerPopup: false, maKhSearch: "" }))}
                        onSelect={(customer) => {
                            if (searchStates.searchContext === "mainForm") {
                                handleCustomerSelect("main-form", customer);
                            } else {
                                handleCustomerSelect(searchStates.maKhSearchRowId, customer);
                            }
                        }}
                        customers={customerData.data || []}
                        searchValue={searchStates.maKhSearch}
                    />
                )}

                {searchStates.showVatTuPopup && (
                    <MaterialSelectionPopup
                        isOpen={searchStates.showVatTuPopup}
                        onClose={() => setSearchStates(prev => ({ ...prev, showVatTuPopup: false, vtSearch: "" }))}
                        onSelect={(vatTu) => {
                            handleVatTuSelect(searchStates.vtSearchRowId, vatTu);
                        }}
                        materials={Array.isArray(vatTuData?.data) ? vatTuData.data : []}
                        searchValue={searchStates.vtSearch}
                        rowId={searchStates.vtSearchRowId}
                    />
                )}

                {searchStates.showKhoPopup && (
                    <WarehouseSelectionPopup
                        isOpen={searchStates.showKhoPopup}
                        onClose={() => setSearchStates(prev => ({ ...prev, showKhoPopup: false, khoSearch: "" }))}
                        onSelect={(kho) => {
                            handleKhoSelect(searchStates.khoSearchRowId, kho);
                        }}
                        warehouses={Array.isArray(khoData?.data) ? khoData.data : []}
                        searchValue={searchStates.khoSearch}
                        rowId={searchStates.khoSearchRowId}
                        onSearch={(value) => setSearchStates(prev => ({ ...prev, khoSearch: value }))}
                    />
                )}

                {/* Popup cho Mã NX Account */}
                {searchStates.showMaNxAccountPopup && (
                    <AccountSelectionPopup
                        isOpen={true}
                        onClose={() => setSearchStates(prev => ({
                            ...prev,
                            showMaNxAccountPopup: false,
                            maNxSearch: ""
                        }))}
                        onSelect={handleMaNxAccountSelect}
                        accounts={maNxAccountRawData.data || []}
                        searchValue={searchStates.maNxSearch}
                        onSearchChange={(value) => setSearchStates(prev => ({
                            ...prev,
                            maNxSearch: value
                        }))}
                    />
                )}
            </div>
        </Modal>
    );
};