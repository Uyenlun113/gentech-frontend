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
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../components/ui/modal";
import { Tabs } from "../../components/ui/tabs";
import { useAccounts } from "../../hooks/useAccounts";
import { useCustomers } from "../../hooks/useCustomer";
import { useGetHdBanDvBySttRec, useUpdateHdBanDv } from "../../hooks/useHdBanDv";

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

export const ModalEditHdBanDv = ({ isOpenEdit, closeModalEdit, editingId }) => {
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
        ma_nx: "",
        tk_thue_no: "",
        tk_thue_no_name: "",
        status: "1",
        ma_dvcs: "",
        ty_gia: "1.00",
        ma_hd_me: "",
        ten_kh: "",
        so_seri: "",
        ht_tt: "",
        han_tt: "",
        ten_vtthue: "",
        ma_thck: "",
        nhom_hang: "",
        gia_chu_thue: "",
        ma_ck_t: "",
        hinh_thuc_tt: "",
    });

    const [hangHoaData, setHangHoaData] = useState([]);

    // Search states với debounce
    const [searchStates, setSearchStates] = useState({
        tkSearch: "",
        tkSearchRowId: null,
        tkSearchField: null,
        maKhSearch: "",
        maKhSearchRowId: null,
        maNxSearch: "",
        searchContext: null,
        showAccountPopup: false,
        showCustomerPopup: false,
        showMaNxAccountPopup: false,
    });

    const hangHoaTableRef = useRef(null);

    // Debounced search values
    const debouncedTkSearch = useDebounce(searchStates.tkSearch, 600);
    const debouncedMaKhSearch = useDebounce(searchStates.maKhSearch, 600);
    const debouncedMaNxSearch = useDebounce(searchStates.maNxSearch, 600);

    // React Query calls
    const { data: editData, isLoading: isLoadingEdit } = useGetHdBanDvBySttRec(editingId);

    const { data: accountRawData = {} } = useAccounts(
        { search: debouncedTkSearch || "" },
        { enabled: !!debouncedTkSearch && debouncedTkSearch.length > 0 }
    );

    const { data: customerData = [] } = useCustomers(
        { search: debouncedMaKhSearch || "" },
        { enabled: !!debouncedMaKhSearch && debouncedMaKhSearch.length > 0 }
    );

    const { data: maNxAccountRawData = {} } = useAccounts(
        { search: debouncedMaNxSearch || "" },
        { enabled: !!debouncedMaNxSearch && debouncedMaNxSearch.length > 0 }
    );

    const { mutateAsync: updateHdBanDv, isPending } = useUpdateHdBanDv();

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
                ma_nx: data.ma_nx || "",
                tk_thue_no: data.tk_thue_no || "",
                tk_thue_no_name: data.tk_thue_no_name || "",
                status: data.status || "1",
                ma_dvcs: data.ma_dvcs || "",
                ty_gia: data.ty_gia || "1.00",
                ma_hd_me: data.ma_hd_me || "",
                ten_kh: data.ten_kh || "",
                so_seri: data.so_seri || "",
                ht_tt: data.ht_tt || "",
                han_tt: data.han_tt || "",
                ten_vtthue: data.ten_vtthue || "",
                ma_thck: data.ma_thck || "",
                ma_ck_t: data.ma_thck || "",
                hinh_thuc_tt: data.ht_tt || "",
                nhom_hang: data.ten_vtthue || "",
            });

            // Load hang hoa data với tên field giống file create
            if (data.hangHoa && Array.isArray(data.hangHoa)) {
                const hangHoaWithId = data.hangHoa.map((item, index) => ({
                    id: index + 1,
                    tk_dt: item.tk_dt || item.tk_doanh_thu || "",
                    ten_tk: item.tkDtInfo.ten_tk || "",
                    dien_giaii: item.dien_giaii || item.dien_giai || "",
                    dvt: item.dvt || "",
                    so_luong: item.so_luong || "",
                    gia_nt2: item.gia_nt2 || item.don_gia || "",
                    tien2: item.tien2 || item.thanh_tien || "",
                    tl_ck: item.tl_ck || "",
                    ck_nt: item.ck_nt || item.tien_ck || "",
                    tk_ck: item.tk_ck || "",
                    ma_thue_i: item.ma_thue_i || item.ma_thue || "",
                    thue_suati: item.thue_suati || item.t_suat || "",
                    thue: item.thue || item.tien_thue || "",
                    tk_thue_i: item.tk_thue_i || item.tk_thue || "",
                }));

                setHangHoaData(hangHoaWithId);
            }
        }
    }, [editData, isOpenEdit]);

    // Tính tổng tiền theo đúng khuôn mẫu
    const totals = useMemo(() => {
        const totalSoLuong = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.so_luong) || 0;
            return sum + value;
        }, 0);

        // Tổng thành tiền (trước chiết khấu)
        const totalThanhTien = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.tien2) || 0;
            return sum + value;
        }, 0);

        // Tổng chiết khấu
        const totalTienCK = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.ck_nt) || 0;
            return sum + value;
        }, 0);

        // Tổng tiền sau chiết khấu
        const totalTienSauCK = totalThanhTien - totalTienCK;

        // Tổng tiền thuế GTGT
        const totalTienThue = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.thue) || 0;
            return sum + value;
        }, 0);

        // Tổng cộng thanh toán = tiền sau CK + thuế
        const totalTongTienTT = totalTienSauCK + totalTienThue;

        return {
            totalSoLuong,
            totalThanhTien,
            totalTienCK,
            totalTienSauCK,
            totalTienThue,
            totalTongTienTT
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
                    if (field === "so_luong" || field === "gia_nt2") {
                        const soLuong = parseFloat(field === "so_luong" ? value : item.so_luong) || 0;
                        const donGia = parseFloat(field === "gia_nt2" ? value : item.gia_nt2) || 0;

                        // Thành tiền = số lượng × đơn giá
                        const thanhTien = soLuong * donGia;
                        updatedItem.tien2 = thanhTien.toString();

                        // Tính chiết khấu
                        const tlCK = parseFloat(item.tl_ck) || 0;
                        const tienCK = (thanhTien * tlCK) / 100;
                        updatedItem.ck_nt = tienCK.toString();

                        // Tính thuế GTGT trên tiền sau chiết khấu
                        const tienSauCK = thanhTien - tienCK;
                        const tSuat = parseFloat(item.thue_suati) || 0;
                        const tienThue = (tienSauCK * tSuat) / 100;
                        updatedItem.thue = tienThue.toString();

                        // Giá chủ thuế = tiền sau CK + thuế
                        updatedItem.gia_chu_thue = (tienSauCK + tienThue).toString();
                    }

                    // Tính lại khi thay đổi tỷ lệ chiết khấu
                    if (field === "tl_ck") {
                        const soLuong = parseFloat(item.so_luong) || 0;
                        const donGia = parseFloat(item.gia_nt2) || 0;
                        const thanhTien = soLuong * donGia;

                        const tlCK = parseFloat(value) || 0;
                        const tienCK = (thanhTien * tlCK) / 100;
                        updatedItem.ck_nt = tienCK.toString();

                        const tienSauCK = thanhTien - tienCK;
                        const tSuat = parseFloat(item.thue_suati) || 0;
                        const tienThue = (tienSauCK * tSuat) / 100;
                        updatedItem.thue = tienThue.toString();
                        updatedItem.gia_chu_thue = (tienSauCK + tienThue).toString();
                    }

                    // Tính thuế khi thay đổi thuế suất
                    if (field === "thue_suati") {
                        const thanhTien = parseFloat(item.tien2) || 0;
                        const tienCK = parseFloat(item.ck_nt) || 0;
                        const tienSauCK = thanhTien - tienCK;
                        const tSuat = parseFloat(value) || 0;
                        const tienThue = (tienSauCK * tSuat) / 100;
                        updatedItem.thue = tienThue.toString();
                        updatedItem.gia_chu_thue = (tienSauCK + tienThue).toString();
                    }

                    return updatedItem;
                }
                return item;
            });
            return newData;
        });

        // Search logic for account fields
        if (field === "tk_dt" || field === "tk_ck" || field === "tk_thue_i") {
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: field,
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
                        ? {
                            ...item,
                            [searchStates.tkSearchField]: account.tk.trim(),
                            // Nếu chọn tk doanh thu thì fill luôn tên tài khoản
                            ...(searchStates.tkSearchField === "tk_dt" ? { ten_tk: account.ten_tk?.trim() || "" } : {})
                        }
                        : item
                )
            );
        } else if (searchStates.searchContext === "maNx") {
            handleFormChange("ma_nx", account.tk.trim());
            // Tự động fill tk_thue_no từ ma_nx
            handleFormChange("tk_thue_no", account.tk.trim());
            handleFormChange("tk_thue_no_name", account.ten_tk?.trim() || "");
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
            handleFormChange("ten_kh", customer.ten_kh || "");
        }

        // Clear search state
        setSearchStates(prev => ({
            ...prev,
            showCustomerPopup: false,
            maKhSearch: "",
            searchContext: null
        }));
    }, [searchStates.searchContext, handleFormChange]);

    const handleMaNxAccountSelect = useCallback((account) => {
        handleFormChange("ma_nx", account.tk.trim());
        // Tự động fill tk_thue_no từ ma_nx
        handleFormChange("tk_thue_no", account.tk.trim());
        handleFormChange("tk_thue_no_name", account.ten_tk?.trim() || "");

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
                tk_dt: "",
                ten_tk: "",
                dien_giaii: "",
                dvt: "kg",
                so_luong: "",
                gia_nt2: "",
                tien2: "",
                tl_ck: "",
                ck_nt: "",
                tk_ck: "",
                ma_thue_i: "",
                thue_suati: "",
                thue: "",
                tk_thue_i: "",
                cuc_thue: "",
                nhom_hang: "1",
                gia_chu_thue: "",
                ma_ck_t: "",
                han_tt: "",
                hinh_thuc_tt: "",
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
            ma_nx: "",
            tk_thue_no: "",
            tk_thue_no_name: "",
            status: "1",
            ma_dvcs: "",
            ty_gia: "1.00",
            ma_hd_me: "",
            ten_kh: "",
            so_seri: "",
            ht_tt: "",
            han_tt: "",
            ten_vtthue: "",
            ma_thck: "",
            nhom_hang: "",
            gia_chu_thue: "",
            ma_ck_t: "",
            hinh_thuc_tt: "",
        });
        setHangHoaData([]);
        setSearchStates({
            tkSearch: "",
            tkSearchRowId: null,
            tkSearchField: null,
            maKhSearch: "",
            maKhSearchRowId: null,
            maNxSearch: "",
            searchContext: null,
            showAccountPopup: false,
            showCustomerPopup: false,
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
            row.tk_dt && parseFloat(row.tien2) > 0
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
                phieu: {
                    ma_kh: formData.ma_kh?.trim() || "",
                    dia_chi: formData.dia_chi?.trim() || "",
                    ma_so_thue: formData.ma_so_thue?.trim() || "",
                    dien_giai: formData.dien_giai?.trim() || "",
                    ma_qs: formData.ma_qs?.trim() || "",
                    tien_hg_nt: totals.totalThanhTien,
                    t_ck: totals.totalTienCK,
                    t_tien_nt2: totals.totalTienSauCK,
                    t_thue: totals.totalTienThue,
                    t_tt_nt: totals.totalTongTienTT,
                    tk_thue_no: formData.tk_thue_no?.trim() || "",
                    ma_nx: formData.ma_nx?.trim() || "",
                    status: formData.status,
                    ma_dvcs: formData.ma_dvcs?.trim() || "",
                    so_ct: formData.so_ct?.trim() || "",
                    ong_ba: formData.ong_ba?.trim() || "",
                    ten_kh: formData.ten_kh?.trim() || "",
                    so_seri: formData.so_seri?.trim() || "",
                    ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : new Date().toISOString(),
                    ngay_lct: formData.ngay_lct ? new Date(formData.ngay_lct).toISOString() : new Date().toISOString(),
                    ten_vtthue: formData.nhom_hang?.trim() || "",
                    ma_thck: formData.ma_ck_t?.trim() || "",
                    han_tt: formData.han_tt,
                    ht_tt: formData.hinh_thuc_tt?.trim() || "",
                },
                hangHoa: hangHoaData
                    .filter(row => row.tk_dt && parseFloat(row.tien2) > 0)
                    .map(({ tk_dt, dien_giaii, dvt, so_luong, gia_nt2, tien2, tl_ck, ck_nt, tk_ck, ma_thue_i, thue_suati, thue, tk_thue_i }) => ({
                        so_ct: formData.so_ct?.trim() || "",
                        tk_dt: tk_dt?.trim() || "",
                        dien_giaii: dien_giaii?.trim() || "",
                        dvt: dvt?.trim() || "",
                        so_luong: Number(so_luong) || 0,
                        gia_nt2: Number(gia_nt2) || 0,
                        tien2: Number(tien2) || 0,
                        tl_ck: Number(tl_ck) || 0,
                        ck_nt: Number(ck_nt) || 0,
                        tk_ck: tk_ck?.trim() || "",
                        ma_thue_i: ma_thue_i?.trim() || "",
                        thue_suati: Number(thue_suati) || 0,
                        thue: Number(thue) || 0,
                        tk_thue_i: tk_thue_i?.trim() || "",
                        ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : new Date().toISOString(),
                    })),
            };


            await updateHdBanDv({ stt_rec: editingId, data: payload });
            closeModalEdit();
            resetForm();
            navigate("/hd-ban-dv");
            toast.success("Cập nhật hóa đơn bán dịch vụ thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi cập nhật hóa đơn bán dịch vụ: " + (err?.message || "Không xác định"));
        }
    }, [formData, hangHoaData, totals, updateHdBanDv, editingId, closeModalEdit, resetForm, navigate, validateForm]);

    const handleClose = useCallback(() => {
        resetForm();
        closeModalEdit();
    }, [resetForm, closeModalEdit]);

    // Columns cho bảng hàng hóa theo đúng ảnh
    const hangHoaColumns = [
        {
            key: "tk_dt",
            title: "Tk doanh thu",
            dataIndex: "tk_dt",
            width: 120,
            fixed: "left",
            render: (text, record) => (
                <input
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "tk_dt", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                />
            ),
        },
        {
            key: "ten_tk",
            title: "Tên tài khoản",
            dataIndex: "ten_tk",
            width: 200,
            render: (text, record) => (
                <input
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "ten_tk", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "dien_giaii",
            title: "Diễn giải",
            dataIndex: "dien_giaii",
            width: 200,
            render: (text, record) => (
                <input
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "dien_giaii", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "dvt",
            title: "Đvt",
            dataIndex: "dvt",
            width: 80,
            render: (text, record) => (
                <input
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "dvt", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "so_luong",
            title: "Số lượng",
            dataIndex: "so_luong",
            width: 100,
            render: (text, record) => (
                <input
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "so_luong", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "gia_nt2",
            title: "Đơn giá",
            dataIndex: "gia_nt2",
            width: 120,
            render: (text, record) => (
                <input
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "gia_nt2", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                />
            ),
        },
        {
            key: "tien2",
            title: "Thành tiền",
            dataIndex: "tien2",
            width: 120,
            render: (text, record) => (
                <input
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "tien2", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    readOnly
                />
            ),
        },
        {
            key: "tl_ck",
            title: "Tỷ lệ ck (%)",
            dataIndex: "tl_ck",
            width: 100,
            render: (text, record) => (
                <input
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "tl_ck", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                />
            ),
        },
        {
            key: "ck_nt",
            title: "Tiền ck",
            dataIndex: "ck_nt",
            width: 120,
            render: (text, record) => (
                <input
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "ck_nt", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    readOnly
                />
            ),
        },
        {
            key: "tk_ck",
            title: "Tk ck",
            dataIndex: "tk_ck",
            width: 100,
            render: (text, record) => (
                <input
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "tk_ck", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "ma_thue_i",
            title: "Mã thuế",
            dataIndex: "ma_thue_i",
            width: 100,
            render: (text, record) => (
                <input
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "ma_thue_i", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                />
            ),
        },
        {
            key: "thue_suati",
            title: "T.suất (%)",
            dataIndex: "thue_suati",
            width: 100,
            render: (text, record) => (
                <input
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "thue_suati", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right"
                />
            ),
        },
        {
            key: "thue",
            title: "Tiền thuế",
            dataIndex: "thue",
            width: 120,
            render: (text, record) => (
                <input
                    type="number"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "thue", e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-right bg-gray-50"
                    readOnly
                />
            ),
        },
        {
            key: "tk_thue_i",
            title: "Tk thuế",
            dataIndex: "tk_thue_i",
            width: 100,
            render: (text, record) => (
                <input
                    type="text"
                    value={text || ""}
                    onChange={(e) => handleHangHoaChange(record.id, "tk_thue_i", e.target.value)}
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
            <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-[1400px] m-4">
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-[1400px] m-4">
            <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex-shrink-0 p-2 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-green-900 rounded-lg">
                                    <Edit className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                Sửa hóa đơn bán dịch vụ
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Chỉnh sửa thông tin hóa đơn bán dịch vụ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-blue-50">
                    {/* Form thông tin cơ bản */}
                    <div className="border-b border-gray-100">
                        <div className="dark:bg-gray-800 rounded-xl py-2 px-4">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                                {/* Cột trái - 70% (7 cột) */}
                                <div className="lg:col-span-7 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã khách <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ma_kh}
                                            onChange={(e) => {
                                                handleFormChange("ma_kh", e.target.value);
                                                handleMainFormCustomerSearch(e.target.value);
                                            }}
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Địa chỉ
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.dia_chi}
                                            onChange={(e) => handleFormChange("dia_chi", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px] ml-4">
                                            MST
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ma_so_thue}
                                            onChange={(e) => handleFormChange("ma_so_thue", e.target.value)}
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Người mua hàng
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ong_ba}
                                            onChange={(e) => handleFormChange("ong_ba", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Diễn giải chung
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.dien_giai}
                                            onChange={(e) => handleFormChange("dien_giai", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            TK nợ
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ma_nx}
                                            onChange={(e) => {
                                                handleFormChange("ma_nx", e.target.value);
                                                handleMaNxAccountSearch(e.target.value);
                                            }}
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px] ml-4">
                                            {formData.tk_thue_no_name}
                                        </Label>
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
                                                value={formData.ty_gia}
                                                onChange={(e) => handleFormChange("ty_gia", e.target.value)}
                                                className="flex-1 px-3 py-2 text-sm focus:outline-none h-9 border-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Cột phải - 30% (3 cột) */}
                                <div className="lg:col-span-3 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày ht
                                        </Label>
                                        <div className="relative flex-1">
                                            <Flatpickr
                                                value={formData.ngay_ct}
                                                onChange={(date) => handleDateChange(date, "ngay_ct")}
                                                options={FLATPICKR_OPTIONS}
                                                placeholder="Chọn ngày..."
                                                className="w-full h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            />
                                            <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày lập hd <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative flex-1">
                                            <Flatpickr
                                                value={formData.ngay_lct}
                                                onChange={(date) => handleDateChange(date, "ngay_lct")}
                                                options={FLATPICKR_OPTIONS}
                                                placeholder="Chọn ngày..."
                                                className="w-full h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                            />
                                            <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Q.sổ (Ký hiệu)
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ma_qs}
                                            onChange={(e) => handleFormChange("ma_qs", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số seri
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.so_seri}
                                            onChange={(e) => handleFormChange("so_seri", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số hóa đơn <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.so_ct}
                                            onChange={(e) => handleFormChange("so_ct", e.target.value)}
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                        />
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

                    <div className="px-6">
                        <Tabs
                            tabs={[
                                {
                                    label: "1. Hạch toán",
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
                                console.log("Changed to tab:", tabIndex);
                            }}
                        />
                    </div>
                </div>

                {/* Footer - Tổng cộng */}
                <div className="flex-shrink-0 px-6 py-1 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        {/* Cột 1 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium text-gray-700 min-w-[100px] flex-shrink-0">Tk đối ứng Tk thuế:</Label>
                                <input
                                    type="text"
                                    value={formData.tk_thue_no}
                                    onChange={(e) => handleFormChange("tk_thue_no", e.target.value)}
                                    className="flex-1 h-8 px-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    readOnly
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium text-gray-700 min-w-[100px] flex-shrink-0">Nhóm hàng:</Label>
                                <input
                                    type="text"
                                    value={formData.nhom_hang}
                                    onChange={(e) => handleFormChange("nhom_hang", e.target.value)}
                                    className="flex-1 h-8 px-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium text-gray-700 min-w-[100px] flex-shrink-0">Mã c/k t:</Label>
                                <input
                                    type="text"
                                    value={formData.ma_ck_t}
                                    onChange={(e) => handleFormChange("ma_ck_t", e.target.value)}
                                    className="flex-1 h-8 px-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium text-gray-700 min-w-[100px] flex-shrink-0">Hạn tt:</Label>
                                <input
                                    type="text"
                                    value={formData.han_tt}
                                    onChange={(e) => handleFormChange("han_tt", e.target.value)}
                                    className="flex-1 h-8 px-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium text-gray-700 min-w-[100px] flex-shrink-0">Hình thức tt:</Label>
                                <input
                                    type="text"
                                    value={formData.hinh_thuc_tt}
                                    onChange={(e) => handleFormChange("hinh_thuc_tt", e.target.value)}
                                    className="flex-1 h-8 px-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>
                        <div></div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600 min-w-[100px]">Cộng tổng tiền:</span>
                                <span className="font-semibold text-green-600">{totals.totalThanhTien.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600 min-w-[100px]">Tiền ck:</span>
                                <span className="font-semibold text-orange-600">{totals.totalTienCK.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600 min-w-[100px]">Tiền sau ck:</span>
                                <span className="font-semibold text-green-600">{totals.totalTienSauCK.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600 min-w-[100px]">Tiền thuế GTGT:</span>
                                <span className="font-semibold text-purple-600">{totals.totalTienThue.toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-t border-gray-300 pt-2">
                                <span className="text-gray-800 font-medium min-w-[100px]">Tổng tiền tt:</span>
                                <span className="font-bold text-red-600 text-sm">{totals.totalTongTienTT.toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 mt-4 pt-4">
                        <button
                            onClick={handleClose}
                            className="px-6 py-2.5 text-sm font-medium text-white hover:text-gray-700 bg-red-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
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
                            {isPending ? "Đang cập nhật..." : "Cập nhật hóa đơn"}
                        </button>
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
        </Modal >
    );
}