import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalendarIcon, Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import AccountSelectionPopup from "../../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../../components/general/CustomerSelectionPopup";
import TableBasic from "../../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../../components/ui/modal";
import { Tabs } from "../../../components/ui/tabs";
import { useAccounts } from "../../../hooks/useAccounts";
import { useCustomers } from "../../../hooks/useCustomer";
import { useSaveCt46Accounting } from "../../../hooks/usePhieuChi";

// Constants cho CT46 (Phiếu chi)
const INITIAL_CT46_DATA = [
    {
        id: 1,
        tk_i: "",
        ten_tk: "",
        so_ct0: "",
        dien_giaii: "",
        tien: "",
        thue_suat: "",
        thue: "",
        tt: "",
        tk_thue_i: "",
        loai_hd: "",
        ma_ms: "",
        kh_mau_hd: "",
        ma_kh_t: "",
        so_seri0: "",
        ten_kh_t: "",
        dia_chi_t: "",
        mst_t: "",
        ten_vt_t: "",
        ma_thue_i: "",
        ghi_chu_t: "",
        ngay_ct: "",
        ma_ms: ""
    },
];

const INITIAL_CT46GT_DATA = [
    {
        id: 1,
        so_ct0: "",
        tk_thue_no: "",
        tien: "",
        thue_suat: "",
        thue: "",
        tt: "",
        tk_thue_i: "",
        loai_hd: "",
        ma_ms: "",
        mau_bc: "",
        ma_kh: "",
        so_seri0: "",
        ten_kh: "",
        dia_chi: "",
        ma_so_thue: "",
        ten_vt: "",
        ma_thue: "",
        ghi_chu: "",
        t_thue: "",
        t_tien: "",
        t_tt: "",
        ngay_ct0: ""
    }
];

const STATUS_OPTIONS = [
    { value: "1", label: "Đã ghi sổ cái" },
    { value: "2", label: "Chưa ghi sổ cái" },
];

const FLATPICKR_OPTIONS = {
    dateFormat: "Y-m-d",
    locale: Vietnamese,
};

export const ModalCreateCt46PaymentVoucher = ({ isOpenCreate, closeModalCreate }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        loaiPhieuChi: "",
        maKhachHang: "",
        taiKhoanCo: "",
        maNgoaiTe: "VND",
        diaChiKhachHang: "",
        maSoThue: "",
        ongBa: "",
        liDoChi: "",
        tyGia: 1,
        trangThai: "1",
        ngayHachToan: "",
        ngayLapChungTu: "",
        quyenSo: "",
        soPhieuChi: "",
        tenKhachHang: "",
        tenTaiKhoanCo: "",
    });

    const [ct46Data, setCt46Data] = useState(INITIAL_CT46_DATA);
    const [ct46gtData, setCt46gtData] = useState(INITIAL_CT46GT_DATA);

    const [searchStates, setSearchStates] = useState({
        tkSearch: "",
        tkSearchRowId: null,
        tkSearchField: null,
        maKhSearch: "",
        maKhSearchRowId: null,
        searchContext: null,
        showAccountPopup: false,
        showCustomerPopup: false,
    });

    const ct46TableRef = useRef(null);
    const ct46gtTableRef = useRef(null);

    const { data: accountRawData = {} } = useAccounts(
        searchStates.tkSearch ? { search: searchStates.tkSearch } : {}
    );
    const { data: customerData = [] } = useCustomers(
        searchStates.maKhSearch ? { search: searchStates.maKhSearch } : {}
    );
    const { mutateAsync: saveCt46Accounting, isPending } = useSaveCt46Accounting();

    // Tính tổng tiền - PS nợ và thành tiền
    const totals = useMemo(() => {
        const totalTien = ct46Data.reduce((sum, item) => {
            const value = parseFloat(item.tien) || 0;
            return sum + value;
        }, 0);

        const totalTt = ct46Data.reduce((sum, item) => {
            const value = parseFloat(item.tt) || 0;
            return sum + value;
        }, 0);

        return { totalTien, totalTt };
    }, [ct46Data]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchStates.tkSearch) {
                setSearchStates(prev => ({ ...prev, showAccountPopup: true }));
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.tkSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchStates.maKhSearch) {
                setSearchStates(prev => ({ ...prev, showCustomerPopup: true }));
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.maKhSearch]);

    // Handlers
    const handleFormChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleDateChange = useCallback((date, field) => {
        const formattedDate = date[0]?.toLocaleDateString("en-CA");
        handleFormChange(field, formattedDate);
    }, [handleFormChange]);

    const handleCt46Change = useCallback((id, field, value) => {
        setCt46Data(prev => {
            const newData = prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );
            if (field === "tien" || field === "thue_suat") {
                const currentRow = newData.find(item => item.id === id);
                const tien = parseFloat(currentRow.tien) || 0;
                const thueSuat = parseFloat(currentRow.thue_suat) || 0;
                const thue = (tien * thueSuat) / 100;
                const tt = tien + thue;

                return newData.map(item =>
                    item.id === id
                        ? { ...item, thue: thue.toString(), tt: tt.toString() }
                        : item
                );
            }

            return newData;
        });

        // Search logic
        if (field === "tk_i") {
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: "tk_i",
                searchContext: "ct46"
            }));
        }
        if (field === "ma_kh_t") {
            setSearchStates(prev => ({
                ...prev,
                maKhSearch: value,
                maKhSearchRowId: id,
                searchContext: "ct46"
            }));
        }
    }, []);

    const handleCt46gtChange = useCallback((id, field, value) => {
        setCt46gtData(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );

        if (field === "ma_kh") {
            setSearchStates(prev => ({
                ...prev,
                maKhSearch: value,
                maKhSearchRowId: id,
                searchContext: "ct46gt"
            }));
        }

        if (field === "tk_thue_no" || field === "tk_thue_i") {
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: field,
                searchContext: "ct46gt"
            }));
        }
    }, []);

    // NEW: Handle search for main form fields
    const handleMainFormAccountSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            tkSearch: value,
            tkSearchRowId: "main-form",
            tkSearchField: "taiKhoan",
            searchContext: "mainForm"
        }));
    }, []);

    const handleMainFormCustomerSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            maKhSearch: value,
            maKhSearchRowId: "main-form",
            searchContext: "mainForm"
        }));
    }, []);

    const handleAccountSelect = useCallback((id, account) => {
        if (searchStates.searchContext === "mainForm") {
            // Update main form account field
            handleFormChange("taiKhoanCo", account.tk.trim());
            handleFormChange("tenTaiKhoanCo", account.ten_tk);
        } else if (searchStates.searchContext === "ct46") {
            setCt46Data(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, [searchStates.tkSearchField]: account.tk.trim(), ten_tk: account.ten_tk }
                        : item
                )
            );
        } else {
            const fieldToUpdate = searchStates.tkSearchField || "tk_thue_no";
            setCt46gtData(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, [fieldToUpdate]: account.tk.trim() }
                        : item
                )
            );
        }

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
            handleFormChange("maKhachHang", customer.ma_kh.trim() || "");
            handleFormChange("diaChiKhachHang", customer.dia_chi || "");
            handleFormChange("maSoThue", customer.ma_so_thue || "");
            handleFormChange("tenKhachHang", customer.ten_kh || "");
        } else if (searchStates.searchContext === "ct46") {
            setCt46Data(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            ma_kh_t: customer.ma_kh || "",
                            ten_kh_t: customer.ten_kh || "",
                            dia_chi_t: customer.dia_chi || "",
                            mst_t: customer.ma_so_thue || ""
                        }
                        : item
                )
            );
        } else {
            setCt46gtData(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            ma_kh: customer.ma_kh || "",
                            ten_kh: customer.ten_kh || "",
                            dia_chi: customer.dia_chi || "",
                            ma_so_thue: customer.ma_so_thue || ""
                        }
                        : item
                )
            );
        }

        setSearchStates(prev => ({
            ...prev,
            showCustomerPopup: false,
            maKhSearch: "",
            searchContext: null
        }));
    }, [searchStates.searchContext, handleFormChange]);

    const addCt46Row = useCallback(() => {
        setCt46Data(prev => [
            ...prev,
            {
                id: prev.length + 1,
                tk_i: "",
                ten_tk: "",
                so_ct0: "",
                dien_giaii: "",
                tien: "",
                thue_suat: "",
                thue: "",
                tt: "",
                tk_thue_i: "",
                loai_hd: "",
                ma_ms: "",
                kh_mau_hd: "",
                ma_kh_t: "",
                so_seri0: "",
                ten_kh_t: "",
                dia_chi_t: "",
                mst_t: "",
                ten_vt_t: "",
                ma_thue_i: "",
                ghi_chu_t: "",
                ngay_ct: "",
                ma_ms: ""
            }
        ]);

        setTimeout(() => {
            if (ct46TableRef.current) {
                const tableContainer = ct46TableRef.current.querySelector('.overflow-x-auto');
                if (tableContainer) {
                    tableContainer.scrollTop = tableContainer.scrollHeight;
                }
            }
        }, 100);
    }, []);

    const deleteCt46Row = useCallback((id) => {
        setCt46Data(prev => prev.filter(item => item.id !== id));
    }, []);

    const addCt46gtRow = useCallback(() => {
        setCt46gtData(prev => [
            ...prev,
            {
                id: prev.length + 1,
                so_ct0: "",
                tk_thue_no: "",
                tien: "",
                thue_suat: "",
                thue: "",
                tt: "",
                tk_thue_i: "",
                loai_hd: "",
                ma_ms: "",
                mau_bc: "",
                ma_kh: "",
                so_seri0: "",
                ten_kh: "",
                dia_chi: "",
                ma_so_thue: "",
                ten_vt: "",
                ma_thue: "",
                ghi_chu: "",
                t_thue: "",
                t_tien: "",
                t_tt: "",
                ngay_ct0: ""
            }
        ]);

        setTimeout(() => {
            if (ct46gtTableRef.current) {
                const tableContainer = ct46gtTableRef.current.querySelector('.overflow-x-auto');
                if (tableContainer) {
                    tableContainer.scrollTop = tableContainer.scrollHeight;
                }
            }
        }, 100);
    }, []);

    const deleteCt46gtRow = useCallback((id) => {
        setCt46gtData(prev => prev.filter(item => item.id !== id));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            loaiPhieuChi: "",
            maKhachHang: "",
            taiKhoanCo: "",
            maNgoaiTe: "VND",
            diaChiKhachHang: "",
            maSoThue: "",
            ongBa: "",
            liDoChi: "",
            tyGia: 1,
            trangThai: "1",
            ngayHachToan: "",
            ngayLapChungTu: "",
            quyenSo: "",
            soPhieuChi: "",
            tenKhachHang: "",
            tenTaiKhoanCo: "",
        });
        setCt46Data(INITIAL_CT46_DATA);
        setCt46gtData(INITIAL_CT46GT_DATA);
        setSearchStates({
            tkSearch: "",
            tkSearchRowId: null,
            tkSearchField: null,
            maKhSearch: "",
            maKhSearchRowId: null,
            searchContext: null,
            showAccountPopup: false,
            showCustomerPopup: false,
        });
    }, []);

    const validateForm = useCallback(() => {
        if (!formData.soPhieuChi) {
            toast.error("Vui lòng nhập số chứng từ");
            return false;
        }
        if (!formData.maKhachHang) {
            toast.error("Vui lòng nhập mã khách hàng");
            return false;
        }
        if (!formData.ngayLapChungTu) {
            toast.error("Vui lòng nhập ngày lập chứng từ");
            return false;
        }
        if (!formData.taiKhoanCo) {
            toast.error("Vui lòng nhập tài khoản");
            return false;
        }

        const validCt46Rows = ct46Data.filter(row =>
            row.tk_i && parseFloat(row.tien) > 0
        );
        if (validCt46Rows.length === 0) {
            toast.error("Vui lòng nhập ít nhất một dòng hạch toán hợp lệ");
            return false;
        }

        return true;
    }, [formData, ct46Data]);

    const handleSave = useCallback(async () => {
        if (!validateForm()) {
            return;
        }
        try {
            const payload = {
                phieu: {
                    ma_gd: formData.loaiPhieuChi,
                    ma_kh: formData.maKhachHang,
                    dia_chi: formData.diaChiKhachHang,
                    ong_ba: formData.ongBa,
                    dien_giai: formData.liDoChi,
                    ngay_ct: formData.ngayHachToan ? new Date(formData.ngayHachToan).toISOString() : undefined,
                    ngay_lct: formData.ngayLapChungTu ? new Date(formData.ngayLapChungTu).toISOString() : undefined,
                    ma_qs: formData.quyenSo,
                    so_ct: formData.soPhieuChi,
                    ma_nt: formData.maNgoaiTe,
                    ty_gia: formData.tyGia,
                    tk: formData.taiKhoanCo,
                    status: formData.trangThai
                },
                hachToan: ct46Data
                    .filter(row => row.tk_i && parseFloat(row.tien) > 0)
                    .map(({ tk_i, so_ct0, dien_giaii, tien, thue_suat, thue, tt, tk_thue_i, loai_hd, kh_mau_hd, ma_kh_t, so_seri0, ten_kh_t, dia_chi_t, mst_t, ten_vt_t, ma_thue_i, ghi_chu_t, ngay_ct, ma_ms }) => ({
                        tk_i: tk_i?.trim() || "",
                        so_ct0: so_ct0?.trim() || "",
                        dien_giaii: dien_giaii?.trim() || "",
                        tien: Number(tien) || 0,
                        thue_suat: Number(thue_suat) || 0,
                        thue: Number(thue) || 0,
                        tt: Number(tt) || 0,
                        tk_thue_i: tk_thue_i?.trim() || "",
                        loai_hd: loai_hd?.trim() || "",
                        kh_mau_hd: kh_mau_hd?.trim() || "",
                        ma_kh_t: ma_kh_t?.trim() || "",
                        so_seri0: so_seri0?.trim() || "",
                        ten_kh_t: ten_kh_t?.trim() || "",
                        dia_chi_t: dia_chi_t?.trim() || "",
                        mst_t: mst_t?.trim() || "",
                        ten_vt_t: ten_vt_t?.trim() || "",
                        ma_thue_i: ma_thue_i?.trim() || "",
                        ghi_chu_t: ghi_chu_t?.trim() || "",
                        ngay_ct: ngay_ct?.trim() || "",
                        ma_ms: ma_ms?.trim() || ""
                    })),
                hopDongThue: ct46gtData
                    .filter(row => row.ma_kh || row.so_ct0)
                    .map(({
                        so_ct0, tk_thue_no, tien, thue_suat, thue, tt, tk_thue_i, loai_hd, ma_ms, mau_bc,
                        ma_kh, so_seri0, ten_kh, dia_chi, ma_so_thue, ten_vt, ma_thue, ghi_chu, t_thue, t_tien, t_tt, ngay_ct0
                    }) => ({
                        so_ct0: so_ct0?.trim() || "",
                        tk_thue_no: tk_thue_no?.trim() || "",
                        tien: Number(tien) || 0,
                        thue_suat: Number(thue_suat) || 0,
                        thue: Number(thue) || 0,
                        tt: Number(tt) || 0,
                        tk_thue_i: tk_thue_i?.trim() || "",
                        loai_hd: loai_hd?.trim() || "",
                        ma_ms: ma_ms?.trim() || "",
                        mau_bc: mau_bc?.trim() || "",
                        ma_kh: ma_kh?.trim() || "",
                        so_seri0: so_seri0?.trim() || "",
                        ten_kh: ten_kh?.trim() || "",
                        dia_chi: dia_chi?.trim() || "",
                        ma_so_thue: ma_so_thue?.trim() || "",
                        ten_vt: ten_vt?.trim() || "",
                        ma_thue: ma_thue?.trim() || "",
                        ghi_chu: ghi_chu?.trim() || "",
                        t_thue: t_thue?.trim() || "",
                        t_tien: t_tien?.trim() || "",
                        t_tt: t_tt?.trim() || "",
                        ngay_ct0: ngay_ct0?.trim() || ""
                    })),
            };
            await saveCt46Accounting(payload);
            closeModalCreate();
            resetForm();
            navigate("/phieu-chi-tien-mat");
        } catch (err) {
            console.error(err);
        }
    }, [formData, ct46Data, ct46gtData, totals, saveCt46Accounting, closeModalCreate, resetForm, navigate, validateForm]);

    const handleClose = useCallback(() => {
        resetForm();
        closeModalCreate();
    }, [resetForm, closeModalCreate]);

    // Table columns cho CT46
    const ct46Columns = [
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
            key: "tk_i",
            title: "Tài khoản nợ",
            width: 100,
            fixed: "left",
            render: (val, row) => {
                if (row.id === 'total') {
                    return <div className="font-bold text-gray-900"></div>;
                }
                return (
                    <Input
                        value={row.tk_i}
                        onChange={(e) => handleCt46Change(row.id, "tk_i", e.target.value)}
                        placeholder="Nhập mã TK..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "ten_tk",
            title: "Tên tài khoản",
            fixed: "left",
            width: 150,
            render: (val, row) => (
                <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
                    {row.ten_tk}
                </div>
            )
        },
        {
            key: "tien",
            title: "PS nợ",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-lg text-blue-600 p-2 rounded ">
                            {totals.totalTien.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    <Input
                        value={row.tien}
                        onChange={(e) => handleCt46Change(row.id, "tien", e.target.value)}
                        placeholder="Ps nợ"
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "dien_giaii",
            title: "Diễn giải",
            width: 150,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.dien_giaii}
                        onChange={(e) => handleCt46Change(row.id, "dien_giaii", e.target.value)}
                        placeholder="Diễn giải..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "loai_hd",
            title: "HĐ",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        type="number"
                        value={row.loai_hd}
                        onChange={(e) => handleCt46Change(row.id, "loai_hd", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "so_ct0",
            title: "Nhóm",
            width: 80,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.so_ct0}
                        onChange={(e) => handleCt46Change(row.id, "so_ct0", e.target.value)}
                        placeholder="Nhóm"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "ngay_ct",
            title: "Ngày hóa đơn",
            width: 150,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <div className="relative">
                        <Flatpickr
                            value={row.ngay_ct ? row.ngay_ct.split("T")[0] : ""}
                            onChange={(date) =>
                                handleCt46Change(row.id, "ngay_ct", date?.[0]?.toISOString() || "")
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
            key: "so_seri0",
            title: "Số seri",
            width: 80,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.so_seri0}
                        onChange={(e) => handleCt46Change(row.id, "so_seri0", e.target.value)}
                        placeholder="Số seri"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "ma_ms",
            title: "Số HĐ",
            width: 80,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_ms}
                        onChange={(e) => handleCt46Change(row.id, "ma_ms", e.target.value)}
                        placeholder="Số HĐ"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "kh_mau_hd",
            title: "Mẫu hóa đơn",
            width: 80,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.kh_mau_hd}
                        onChange={(e) => handleCt46Change(row.id, "kh_mau_hd", e.target.value)}
                        placeholder="Mẫu HĐ"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "ma_kh_t",
            title: "Mã khách hàng",
            width: 150,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_kh_t}
                        onChange={(e) => handleCt46Change(row.id, "ma_kh_t", e.target.value)}
                        placeholder="Nhập mã KH..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "ten_kh_t",
            title: "Tên khách hàng",
            width: 200,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ten_kh_t}
                        onChange={(e) => handleCt46Change(row.id, "ten_kh_t", e.target.value)}
                        placeholder="Tên khách hàng..."
                        className="w-full"
                        readOnly
                    />
                );
            }
        },
        {
            key: "dia_chi_t",
            title: "Địa chỉ",
            width: 200,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.dia_chi_t}
                        onChange={(e) => handleCt46Change(row.id, "dia_chi_t", e.target.value)}
                        placeholder="Nhập địa chỉ..."
                        className="w-full"
                    />
                );
            }
        },
        {
            key: "mst_t",
            title: "Mã số thuế",
            width: 150,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.mst_t}
                        onChange={(e) => handleCt46Change(row.id, "mst_t", e.target.value)}
                        placeholder="Nhập mã số thuế..."
                        className="w-full"
                    />
                );
            }
        },
        {
            key: "ten_vt_t",
            title: "Hàng hóa, dịch vụ",
            width: 200,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ten_vt_t}
                        onChange={(e) => handleCt46Change(row.id, "ten_vt_t", e.target.value)}
                        placeholder="Nhập hàng hóa, dịch vụ..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "thue_suat",
            title: "Thuế suất %",
            width: 80,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        type="number"
                        value={row.thue_suat}
                        onChange={(e) => handleCt46Change(row.id, "thue_suat", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "thue",
            title: "Tiền thuế",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-lg text-green-600 p-2 rounded px-7">
                            0
                        </div>
                    );
                }
                return (
                    <Input
                        type="number"
                        value={row.thue}
                        onChange={(e) => handleCt46Change(row.id, "thue", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                        readOnly
                    />
                );
            },
        },
        {
            key: "tt",
            title: "Thành tiền",
            width: 100,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-lg text-purple-600 p-2 rounded px-7">
                            {totals.totalTt.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    <Input
                        type="number"
                        value={row.tt}
                        onChange={(e) => handleCt46Change(row.id, "tt", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                        readOnly
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
                            onClick={() => deleteCt46Row(row.id)}
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

    // Thêm dòng tổng vào data CT46 - chỉ tính tổng PS nợ
    const ct46DataWithTotal = useMemo(() => {
        return [
            ...ct46Data,
            {
                id: 'total',
                tk_i: '',
                ten_tk: '',
                so_ct0: '',
                dien_giaii: '',
                tien: totals.totalTien,
                thue_suat: '',
                thue: '',
                tt: ''
            }
        ];
    }, [ct46Data, totals]);

    // Table columns cho CT46GT
    const ct46gtColumns = [
        {
            key: "stt",
            fixed: "left",
            title: "STT",
            width: 50,
            render: (val, row) => (
                <div className="text-center font-medium text-gray-700">
                    {row.id}
                </div>
            )
        },
        {
            key: "so_ct0",
            title: "Nhóm",
            fixed: "left",
            width: 100,
            render: (val, row) => (
                <Input
                    value={row.so_ct0}
                    onChange={(e) => handleCt46gtChange(row.id, "so_ct0", e.target.value)}
                    placeholder="Số CT..."
                    className="w-full"
                />
            ),
        },
        {
            key: "ma_ms",
            title: "Số hóa đơn",
            width: 150,
            fixed: "left",
            render: (val, row) => (
                <Input
                    value={row.ma_ms}
                    onChange={(e) => handleCt46gtChange(row.id, "ma_ms", e.target.value)}
                    placeholder="Nhập số hóa đơn..."
                    className="w-full"
                />
            ),
        },
        {
            key: "mau_bc",
            title: "Mẫu hóa đơn",
            width: 150,
            render: (val, row) => (
                <Input
                    value={row.mau_bc}
                    onChange={(e) => handleCt46gtChange(row.id, "mau_bc", e.target.value)}
                    placeholder="Nhập mẫu hóa đơn..."
                    className="w-full"
                />
            ),
        },
        {
            key: "so_seri0",
            title: "Số seri",
            width: 150,
            render: (val, row) => (
                <Input
                    value={row.so_seri0}
                    onChange={(e) => handleCt46gtChange(row.id, "so_seri0", e.target.value)}
                    placeholder="Nhập số seri..."
                    className="w-full"
                />
            ),
        },
        {
            key: "ngay_ct0",
            title: "Ngày hóa đơn",
            width: 150,
            render: (val, row) => (
                <div className="relative">
                    <Flatpickr
                        value={row.ngay_ct0 ? row.ngay_ct0.split("T")[0] : ""}
                        onChange={(date) =>
                            handleCt46gtChange(row.id, "ngay_ct0", date?.[0]?.toISOString() || "")
                        }
                        options={{
                            dateFormat: "Y-m-d",
                            allowInput: true,
                        }}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-800 dark:text-white"
                    />
                    <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            ),
        },
        {
            key: "ma_kh",
            title: "Mã khách hàng",
            width: 150,
            render: (val, row) => (
                <Input
                    value={row.ma_kh}
                    onChange={(e) => handleCt46gtChange(row.id, "ma_kh", e.target.value)}
                    placeholder="Nhập mã KH..."
                    className="w-full"
                />
            ),
        },
        {
            key: "ten_kh",
            title: "Tên khách hàng",
            width: 200,
            render: (val, row) => (
                <Input
                    value={row.ten_kh}
                    onChange={(e) => handleCt46gtChange(row.id, "ten_kh", e.target.value)}
                    placeholder="Tên khách hàng..."
                    className="w-full"
                    readOnly
                />
            )
        },
        {
            key: "dia_chi",
            title: "Địa chỉ",
            width: 200,
            render: (val, row) => (
                <Input
                    value={row.dia_chi}
                    onChange={(e) => handleCt46gtChange(row.id, "dia_chi", e.target.value)}
                    placeholder="Nhập địa chỉ..."
                    className="w-full"
                />
            )
        },
        {
            key: "ma_so_thue",
            title: "Mã số thuế",
            width: 150,
            render: (val, row) => (
                <Input
                    value={row.ma_so_thue}
                    onChange={(e) => handleCt46gtChange(row.id, "ma_so_thue", e.target.value)}
                    placeholder="Nhập mã số thuế..."
                    className="w-full"
                />
            )
        },
        {
            key: "ten_vt",
            title: "Hàng hóa, dịch vụ",
            width: 200,
            render: (val, row) => (
                <Input
                    value={row.ten_vt}
                    onChange={(e) => handleCt46gtChange(row.id, "ten_vt", e.target.value)}
                    placeholder="Nhập hàng hóa, dịch vụ..."
                    className="w-full"
                />
            ),
        },
        {
            key: "t_tien",
            title: "Tiền hàng",
            width: 120,
            render: (val, row) => (
                <Input
                    type="text"
                    value={row.t_tien}
                    onChange={(e) => handleCt46gtChange(row.id, "t_tien", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "ma_thue",
            title: "Mã thuế",
            width: 100,
            render: (val, row) => (
                <Input
                    value={row.ma_thue}
                    onChange={(e) => handleCt46gtChange(row.id, "ma_thue", e.target.value)}
                    placeholder="Nhập mã thuế..."
                    className="w-full"
                />
            ),
        },
        {
            key: "thue_suat",
            title: "%",
            width: 80,
            render: (val, row) => (
                <Input
                    type="text"
                    value={row.thue_suat}
                    onChange={(e) => handleCt46gtChange(row.id, "thue_suat", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "t_thue",
            title: "Tiền thuế",
            width: 120,
            render: (val, row) => (
                <Input
                    type="text"
                    value={row.t_thue}
                    onChange={(e) => handleCt46gtChange(row.id, "t_thue", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "t_tt",
            title: "TT",
            width: 120,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.t_tt}
                    onChange={(e) => handleCt46gtChange(row.id, "t_tt", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "tk_thue_no",
            title: "Tài khoản thuế",
            width: 150,
            render: (val, row) => (
                <Input
                    value={row.tk_thue_no}
                    onChange={(e) => handleCt46gtChange(row.id, "tk_thue_no", e.target.value)}
                    placeholder="Nhập TK thuế..."
                    className="w-full"
                />
            ),
        },
        {
            key: "action",
            title: "Hành động",
            fixed: "right",
            width: 80,
            render: (_, row) => (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => deleteCt46gtRow(row.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa dòng"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Modal isOpen={isOpenCreate} onClose={closeModalCreate} className="w-full max-w-7xl m-4">
            <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex-shrink-0 p-2 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                Tạo phiếu chi
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Nhập thông tin phiếu chi mới với giao diện tối ưu
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
                    {/* Form thông tin cơ bản - LAYOUT 7-3 */}
                    <div className="border-b border-gray-100">
                        <div className="dark:bg-gray-800 rounded-xl p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                                {/* Cột trái - 70% (7 cột) */}
                                <div className="lg:col-span-7 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Loại phiếu chi
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.loaiPhieuChi}
                                            onChange={(e) => handleFormChange("loaiPhieuChi", e.target.value)}
                                            placeholder="8"
                                            className="w-24 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[200px] ml-4">
                                            T/T chi phí trực tiếp bằng tiền
                                        </Label>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Mã khách hàng <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.maKhachHang}
                                            onChange={(e) => {
                                                handleFormChange("maKhachHang", e.target.value);
                                                handleMainFormCustomerSearch(e.target.value);
                                            }}
                                            placeholder="KH005"
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <input
                                            type="text"
                                            value={formData.tenKhachHang}
                                            onChange={(e) => handleFormChange("tenKhachHang", e.target.value)}
                                            readOnly
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 ml-4"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Địa chỉ
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.diaChiKhachHang}
                                            onChange={(e) => handleFormChange("diaChiKhachHang", e.target.value)}
                                            placeholder="Nhập địa chỉ khách hàng"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px] ml-4">
                                            MST
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.maSoThue}
                                            onChange={(e) => handleFormChange("maSoThue", e.target.value)}
                                            placeholder="Mã số thuế"
                                            readOnly
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Người nhận
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ongBa}
                                            onChange={(e) => handleFormChange("ongBa", e.target.value)}
                                            placeholder="Tên người nhận"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Lý do chi
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.liDoChi}
                                            onChange={(e) => handleFormChange("liDoChi", e.target.value)}
                                            placeholder="Nhập lý do chi tiền"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            TK có <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.taiKhoanCo}
                                            onChange={(e) => {
                                                handleFormChange("taiKhoanCo", e.target.value);
                                                handleMainFormAccountSearch(e.target.value);
                                            }}
                                            placeholder="2111"
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <input
                                            type="text"
                                            value={formData.tenTaiKhoanCo}
                                            onChange={(e) => handleFormChange("tenTaiKhoanCo", e.target.value)}
                                            readOnly
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 ml-4"
                                        />
                                    </div>
                                </div>

                                {/* Cột phải - 30% (3 cột) */}
                                <div className="lg:col-span-3 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày hạch toán
                                        </Label>
                                        <Flatpickr
                                            value={formData.ngayHachToan}
                                            onChange={(date) => handleDateChange(date, "ngayHachToan")}
                                            options={FLATPICKR_OPTIONS}
                                            placeholder="Chọn ngày..."
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày lập phiếu <span className="text-red-500">*</span>
                                        </Label>
                                        <Flatpickr
                                            value={formData.ngayLapChungTu}
                                            onChange={(date) => handleDateChange(date, "ngayLapChungTu")}
                                            options={FLATPICKR_OPTIONS}
                                            placeholder="Chọn ngày..."
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Quyển sổ
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.quyenSo}
                                            onChange={(e) => handleFormChange("quyenSo", e.target.value)}
                                            placeholder="PC001"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số phiếu chi <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.soPhieuChi}
                                            onChange={(e) => handleFormChange("soPhieuChi", e.target.value)}
                                            placeholder="PC00010"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    </div>

                    {/* Tabs */}
                    <div className="px-6">
                        <Tabs
                            tabs={[
                                {
                                    label: "Hạch toán",
                                    content: (
                                        <div className="bg-white rounded-lg border border-gray-200" ref={ct46TableRef}>
                                            <TableBasic
                                                data={ct46DataWithTotal}
                                                columns={ct46Columns}
                                                onDeleteRow={deleteCt46Row}
                                                showAddButton={true}
                                                maxHeight="max-h-80"
                                                className="w-full"
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    label: "Hợp đồng thuế",
                                    content: (
                                        <div className="bg-white rounded-lg border border-gray-200" ref={ct46gtTableRef}>
                                            <TableBasic
                                                data={ct46gtData}
                                                columns={ct46gtColumns}
                                                onAddRow={addCt46gtRow}
                                                onDeleteRow={deleteCt46gtRow}
                                                showAddButton={true}
                                                addButtonText="Thêm dòng"
                                                maxHeight="max-h-80"
                                                className="w-full"
                                            />
                                        </div>
                                    ),
                                },
                            ]}
                            onAddRow={(activeTab) => {
                                if (activeTab === 0) {
                                    addCt46Row();
                                } else if (activeTab === 1) {
                                    addCt46gtRow();
                                }
                            }}
                            onChangeTab={(tabIndex) => {
                                console.log('Changed to tab:', tabIndex);
                            }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                        {/* Summary info - chỉ hiển thị tổng PS nợ */}
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tổng PS nợ:</span>
                                <span className="font-semibold text-blue-600">
                                    {totals.totalTien.toLocaleString('vi-VN')} VND
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
                                className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                <Save size={16} />
                                {isPending ? "Đang lưu..." : "Lưu phiếu chi"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Popups */}
                {searchStates.showAccountPopup && (
                    <AccountSelectionPopup
                        isOpen={true}
                        onClose={() => setSearchStates(prev => ({ ...prev, showAccountPopup: false }))}
                        onSelect={(account) => {
                            if (searchStates.searchContext === "mainForm") {
                                handleAccountSelect("main-form", account);
                            } else {
                                handleAccountSelect(searchStates.tkSearchRowId, account);
                            }
                        }}
                        accounts={accountRawData.data || []}
                        searchValue={searchStates.tkSearch}
                    />
                )}

                {searchStates.showCustomerPopup && (
                    <CustomerSelectionPopup
                        isOpen={true}
                        onClose={() => setSearchStates(prev => ({ ...prev, showCustomerPopup: false }))}
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
            </div>
        </Modal>
    );
};