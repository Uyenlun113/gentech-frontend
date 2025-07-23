import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalendarIcon, Edit, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Input from "../../components/form/input/InputField";
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
import { usePhieuMuaById, useUpdatePhieuMua } from "../../hooks/usePhieumua";

// Constants cho Phiếu mua
const INITIAL_HANG_HOA_DATA = [
    {
        id: 1,
        ma_kho_i: "",
        ten_kho: "",
        ma_vt: "",
        ten_vt: "",
        so_luong: "",
        gia: "",
        tien_nt: "",
        tien_nt0: "",
        tk_vt: "",
        thue_nt: "",
    },
];

const INITIAL_CHI_PHI_DATA = [
    {
        id: 1,
        ma_vt: "",
        ten_vt: "",
        so_luong: "",
        tien_hang: "",
        tien_chi_phi: "",
        tk_no: "",
    },
];

const INITIAL_HD_THUE_DATA = [
    {
        id: 1,
        so_ct0: "",
        so_seri0: "",
        ma_gd: "",
        ma_hd: "",
        ngay_ct0: "",
        ma_kh: "",
        ten_kh: "",
        dia_chi: "",
        ma_so_thue: "",
        ma_kho: "",
        ten_vt: "",
        gia: "",
        so_luong: "",
        t_tien: "",
        thue_suat: "",
        t_thue: "",
        han_tt: "",
        t_tt: "",
        tk_thue_no: "",
    },
];

const STATUS_OPTIONS = [
    { value: "1", label: "Ghi vào sổ cái" },
    { value: "2", label: "Chưa ghi sổ cái" },
];

const FLATPICKR_OPTIONS = {
    dateFormat: "Y-m-d",
    locale: Vietnamese,
};

export const ModalEditPhieuMua = ({ isOpenEdit, closeModalEdit, editingId }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ma_kh: "",
        ten_kh: "",
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
        loai_pb: "",
    });

    const [hangHoaData, setHangHoaData] = useState(INITIAL_HANG_HOA_DATA);
    const [chiPhiData, setChiPhiData] = useState(INITIAL_CHI_PHI_DATA);
    const [hdThueData, setHdThueData] = useState(INITIAL_HD_THUE_DATA);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // State riêng cho form chi phí
    const [chiPhiFormData, setChiPhiFormData] = useState({
        ma_kh: "",
        tk_co: "",
        tong_chi_phi: "",
    });

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
        searchContext: null,
        showAccountPopup: false,
        showCustomerPopup: false,
        showVatTuPopup: false,
        showKhoPopup: false,
    });

    const hangHoaTableRef = useRef(null);
    const chiPhiTableRef = useRef(null);
    const hdThueTableRef = useRef(null);

    const [searchParams, setSearchParams] = useState({});

    useEffect(() => {
        setSearchParams({
            search: searchStates.tkSearch || "",
        });
    }, [searchStates.tkSearch]);

    const { data: accountRawData = {} } = useAccounts(searchParams);
    const { data: customerData = [] } = useCustomers(
        searchStates.maKhSearch ? { search: searchStates.maKhSearch } : {}
    );
    const { data: vatTuData = [] } = useDmvt(
        searchStates.vtSearch ? { search: searchStates.vtSearch } : {}
    );
    const { data: khoData = [] } = useDmkho(
        searchStates.khoSearch ? { search: searchStates.khoSearch } : {}
    );
    const { mutateAsync: updatePhieuMua, isPending } = useUpdatePhieuMua();
    const { data: editData, isLoading: isLoadingEdit } = usePhieuMuaById(editingId);

    useEffect(() => {
        if (editData && editingId && isOpenEdit && !isDataLoaded) {
            const phieuData = editData || {};
            const hangHoaDataFromAPI = editData.ct71 || [];
            const hdThueDataFromAPI = editData.ct71gt || [];
            console.log("editData:", hangHoaDataFromAPI);
            if (phieuData) {
                setFormData({
                    ma_kh: phieuData.ma_kh || "",
                    ten_kh: phieuData.ten_kh || "",
                    dia_chi: phieuData.dia_chi || "",
                    ma_so_thue: phieuData.ma_so_thue || "",
                    ong_ba: phieuData.ong_ba || "",
                    dien_giai: phieuData.dien_giai || "",
                    ma_qs: phieuData.ma_qs || "",
                    so_ct: phieuData.so_ct || "",
                    ngay_ct: phieuData.ngay_ct || "",
                    ngay_lct: phieuData.ngay_lct || "",
                    tk_thue_no: phieuData.tk_thue_no || "",
                    status: phieuData.status || "1",
                    ma_dvcs: phieuData.ma_dvcs || "",
                    loai_pb: phieuData.loai_pb || "",
                });

                // Set dữ liệu hàng hóa
                if (hangHoaDataFromAPI.length > 0) {
                    const mappedHangHoa = hangHoaDataFromAPI.map((item) => ({
                        ma_kho_i: item.ma_kho_i || "",
                        ten_kho: item.ten_kho || "",
                        ma_vt: item.ma_vt || "",
                        ten_vt: item.ten_vt || "",
                        so_luong: item.so_luong?.toString() || "",
                        gia: item.gia?.toString() || "",
                        tien_nt: item.tien_nt?.toString() || "",
                        tien_nt0: item.tien_nt0?.toString() || "",
                        tk_vt: item.tk_vt || "",
                        thue_nt: item.thue_nt?.toString() || "",
                    }));
                    setHangHoaData(mappedHangHoa);

                    // Auto generate chi phí data
                    const mappedChiPhi = mappedHangHoa.map((item) => ({
                        id: item.id,
                        ma_vt: item.ma_vt,
                        ten_vt: item.ten_vt,
                        so_luong: item.so_luong,
                        tien_hang: item.tien_nt,
                        tien_chi_phi: "",
                        tk_no: "",
                    }));
                    setChiPhiData(mappedChiPhi);
                }

                // Set dữ liệu hóa đơn thuế
                if (hdThueDataFromAPI.length > 0) {
                    const mappedHdThue = hdThueDataFromAPI.map((item, index) => ({
                        id: index + 1,
                        so_ct0: item.so_ct0 || "",
                        so_seri0: item.so_seri0 || "",
                        ma_gd: item.ma_gd || "",
                        ma_hd: item.ma_hd || "",
                        ngay_ct0: item.ngay_ct0 || "",
                        ma_kh: item.ma_kh || "",
                        ten_kh: item.ten_kh || "",
                        dia_chi: item.dia_chi || "",
                        ma_so_thue: item.ma_so_thue || "",
                        ma_kho: item.ma_kho || "",
                        ten_vt: item.ten_vt || "",
                        gia: item.gia?.toString() || "",
                        so_luong: item.so_luong?.toString() || "",
                        t_tien: item.t_tien?.toString() || "",
                        thue_suat: item.thue_suat?.toString() || "",
                        t_thue: item.t_thue?.toString() || "",
                        han_tt: item.han_tt?.toString() || "",
                        t_tt: item.t_tt?.toString() || "",
                        tk_thue_no: item.tk_thue_no || "",
                    }));
                    setHdThueData(mappedHdThue);
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

    // Tính tổng tiền
    const totals = useMemo(() => {
        const totalSoLuong = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.so_luong) || 0;
            return sum + value;
        }, 0);

        const totalTienHang = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.tien_nt) || 0;
            return sum + value;
        }, 0);

        const totalChiPhi = chiPhiData.reduce((sum, item) => {
            const value = parseFloat(item.tien_chi_phi) || 0;
            return sum + value;
        }, 0);

        const totalThueGtgt = hdThueData.reduce((sum, item) => {
            const value = parseFloat(item.t_thue) || 0;
            return sum + value;
        }, 0);

        const totalThanhTien = totalTienHang + totalChiPhi + totalThueGtgt;

        return { totalSoLuong, totalTienHang, totalChiPhi, totalThueGtgt, totalThanhTien };
    }, [hangHoaData, chiPhiData, hdThueData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchStates(prev => ({
                ...prev,
                showAccountPopup: prev.tkSearch !== "",
            }));
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.tkSearch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchStates(prev => ({
                ...prev,
                showCustomerPopup: prev.maKhSearch !== "",
            }));
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.maKhSearch]);

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
            const newData = prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );

            // Tự động tính toán tiền hàng
            if (field === "so_luong" || field === "gia") {
                const currentRow = newData.find(item => item.id === id);
                const soLuong = parseFloat(currentRow.so_luong) || 0;
                const gia = parseFloat(currentRow.gia) || 0;
                const tienNt = soLuong * gia;

                return newData.map(item =>
                    item.id === id
                        ? { ...item, tien_nt: tienNt.toString(), tien_nt0: tienNt.toString() }
                        : item
                );
            }

            return newData;
        });

        // Auto fill từ hàng hóa sang chi phí
        if (field === "ma_vt" || field === "ten_vt" || field === "so_luong" || field === "tien_nt") {
            const hangHoaRow = hangHoaData.find(item => item.id === id) || {};
            const updatedRow = { ...hangHoaRow, [field]: value };

            setChiPhiData(prev => {
                const existingChiPhiRow = prev.find(item => item.id === id);
                if (existingChiPhiRow) {
                    return prev.map(item =>
                        item.id === id ? {
                            ...item,
                            ma_vt: updatedRow.ma_vt || "",
                            ten_vt: updatedRow.ten_vt || "",
                            so_luong: updatedRow.so_luong || "",
                            tien_hang: updatedRow.tien_nt || "",
                        } : item
                    );
                } else if (updatedRow.ma_vt || updatedRow.tien_nt) {
                    return [
                        ...prev,
                        {
                            id: id,
                            ma_vt: updatedRow.ma_vt || "",
                            ten_vt: updatedRow.ten_vt || "",
                            so_luong: updatedRow.so_luong || "",
                            tien_hang: updatedRow.tien_nt || "",
                            tien_chi_phi: "",
                            tk_no: "",
                        }
                    ];
                }
                return prev;
            });
        }

        // Search logic
        if (field === "ma_vt") {
            setSearchStates(prev => ({
                ...prev,
                vtSearch: value,
                vtSearchRowId: id,
                searchContext: "hangHoa"
            }));
        }
        if (field === "ma_kho_i") {
            setSearchStates(prev => ({
                ...prev,
                khoSearch: value,
                khoSearchRowId: id,
                searchContext: "hangHoa"
            }));
        }
        if (field === "tk_vt") {
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: "tk_vt",
                searchContext: "hangHoa"
            }));
        }
    }, [hangHoaData]);

    const handleChiPhiChange = useCallback((id, field, value) => {
        setChiPhiData(prev => {
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
                searchContext: "chiPhi"
            }));
        }
        if (field === "tk_no") {
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: "tk_no",
                searchContext: "chiPhi"
            }));
        }
    }, []);

    const handleHdThueChange = useCallback((id, field, value) => {
        setHdThueData(prev => {
            const newData = prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            );

            // Tự động tính toán thuế và tổng tiền
            if (field === "so_luong" || field === "gia") {
                const currentRow = newData.find(item => item.id === id);
                const soLuong = parseFloat(currentRow.so_luong) || 0;
                const gia = parseFloat(currentRow.gia) || 0;
                const tTien = soLuong * gia;

                return newData.map(item =>
                    item.id === id
                        ? { ...item, t_tien: tTien.toString() }
                        : item
                );
            }

            if (field === "t_tien" || field === "thue_suat") {
                const currentRow = newData.find(item => item.id === id);
                const tTien = parseFloat(currentRow.t_tien) || 0;
                const thueSuat = parseFloat(currentRow.thue_suat) || 0;
                const tThue = (tTien * thueSuat) / 100;
                const tTt = tTien + tThue;

                return newData.map(item =>
                    item.id === id
                        ? { ...item, t_thue: tThue.toString(), t_tt: tTt.toString() }
                        : item
                );
            }

            return newData;
        });

        // Auto fill thông tin khách hàng từ form chính khi nhập mã khách hàng
        if (field === "ma_kh" && !value) {
            setHdThueData(prev =>
                prev.map(item =>
                    item.id === id ? {
                        ...item,
                        ma_kh: formData.ma_kh,
                        ten_kh: formData.ten_kh,
                        dia_chi: formData.dia_chi,
                        ma_so_thue: formData.ma_so_thue,
                    } : item
                )
            );
        }

        // Search logic
        if (field === "ma_kh") {
            setSearchStates(prev => ({
                ...prev,
                maKhSearch: value,
                maKhSearchRowId: id,
                searchContext: "hdThue"
            }));
        }
        if (field === "tk_thue_no") {
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: "tk_thue_no",
                searchContext: "hdThue"
            }));
        }
        if (field === "ma_kho") {
            setSearchStates(prev => ({
                ...prev,
                khoSearch: value,
                khoSearchRowId: id,
                searchContext: "hdThue"
            }));
        }
    }, [formData]);

    // Handle search for main form fields
    const handleMainFormAccountSearch = useCallback((value) => {
        setSearchStates(prev => ({
            ...prev,
            tkSearch: value,
            tkSearchRowId: "main-form",
            tkSearchField: "tk_thue_no",
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
            handleFormChange("tk_thue_no", account.tk.trim());
        } else if (searchStates.searchContext === "hangHoa") {
            setHangHoaData(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, [searchStates.tkSearchField]: account.tk.trim() }
                        : item
                )
            );
        } else if (searchStates.searchContext === "chiPhi") {
            setChiPhiData(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, [searchStates.tkSearchField]: account.tk.trim() }
                        : item
                )
            );
        } else if (searchStates.searchContext === "hdThue") {
            setHdThueData(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, [searchStates.tkSearchField]: account.tk.trim() }
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
            handleFormChange("ma_kh", customer.ma_kh.trim() || "");
            handleFormChange("dia_chi", customer.dia_chi || "");
            handleFormChange("ma_so_thue", customer.ma_so_thue || "");
            handleFormChange("ten_kh", customer.ten_kh || "");
        } else if (searchStates.searchContext === "hdThue") {
            setHdThueData(prev =>
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

    const handleVatTuSelect = useCallback((id, vatTu) => {
        if (searchStates.searchContext === "hangHoa") {
            setHangHoaData(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            ma_vt: vatTu.ma_vt || "",
                            ten_vt: vatTu.ten_vt || ""
                        }
                        : item
                )
            );
        } else if (searchStates.searchContext === "chiPhi") {
            setChiPhiData(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            ma_vt: vatTu.ma_vt || "",
                            ten_vt: vatTu.ten_vt || ""
                        }
                        : item
                )
            );
        }

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
                            ten_kho: kho.ten_kho || ""
                        }
                        : item
                )
            );
        } else if (searchStates.searchContext === "hdThue") {
            setHdThueData(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                            ...item,
                            ma_kho: kho.ma_kho || ""
                        }
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
    }, [searchStates.searchContext]);

    const addHangHoaRow = useCallback(() => {
        setHangHoaData(prev => [
            ...prev,
            {
                id: prev.length + 1,
                ma_kho_i: "",
                ten_kho: "",
                ma_vt: "",
                ten_vt: "",
                so_luong: "",
                gia: "",
                tien_nt: "",
                tien_nt0: "",
                tk_vt: "",
                thue_nt: "",
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
        setChiPhiData(prev => prev.filter(item => item.id !== id));
    }, []);

    const addChiPhiRow = useCallback(() => {
        setChiPhiData(prev => [
            ...prev,
            {
                id: prev.length + 1,
                ma_vt: "",
                ten_vt: "",
                so_luong: "",
                tien_hang: "",
                tien_chi_phi: "",
                tk_no: "",
            }
        ]);

        setTimeout(() => {
            if (chiPhiTableRef.current) {
                const tableContainer = chiPhiTableRef.current.querySelector('.overflow-x-auto');
                if (tableContainer) {
                    tableContainer.scrollTop = tableContainer.scrollHeight;
                }
            }
        }, 100);
    }, []);

    const deleteChiPhiRow = useCallback((id) => {
        setChiPhiData(prev => prev.filter(item => item.id !== id));
    }, []);

    const addHdThueRow = useCallback(() => {
        setHdThueData(prev => [
            ...prev,
            {
                id: prev.length + 1,
                so_ct0: "",
                so_seri0: "",
                ma_gd: "",
                ma_hd: "",
                ngay_ct0: "",
                ma_kh: formData.ma_kh || "",
                ten_kh: formData.ten_kh || "",
                dia_chi: formData.dia_chi || "",
                ma_so_thue: formData.ma_so_thue || "",
                ma_kho: "",
                ten_vt: "",
                gia: "",
                so_luong: "",
                t_tien: "",
                thue_suat: "",
                t_thue: "",
                han_tt: "",
                t_tt: "",
                tk_thue_no: "",
            }
        ]);

        setTimeout(() => {
            if (hdThueTableRef.current) {
                const tableContainer = hdThueTableRef.current.querySelector('.overflow-x-auto');
                if (tableContainer) {
                    tableContainer.scrollTop = tableContainer.scrollHeight;
                }
            }
        }, 100);
    }, [formData]);

    const deleteHdThueRow = useCallback((id) => {
        setHdThueData(prev => prev.filter(item => item.id !== id));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({
            ma_kh: "",
            ten_kh: "",
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
            loai_pb: "",
        });
        setHangHoaData(INITIAL_HANG_HOA_DATA);
        setChiPhiData(INITIAL_CHI_PHI_DATA);

        setHangHoaData(INITIAL_HANG_HOA_DATA);
        setChiPhiData(INITIAL_CHI_PHI_DATA);
        setHdThueData(INITIAL_HD_THUE_DATA);
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
            searchContext: null,
            showAccountPopup: false,
            showCustomerPopup: false,
            showVatTuPopup: false,
            showKhoPopup: false,
        });
        setIsDataLoaded(false);
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
            row.ma_vt && parseFloat(row.tien_nt) > 0
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
                    t_so_luong: totals.totalSoLuong,
                    t_tien_nt: totals.totalTienHang,
                    t_tien_nt0: totals.totalTienHang,
                    t_cp_nt: totals.totalChiPhi,
                    t_thue: totals.totalThueGtgt,
                    t_tt_nt: totals.totalThanhTien,
                    tk_thue_no: formData.tk_thue_no?.trim() || "",
                    status: formData.status,
                    ma_dvcs: formData.ma_dvcs?.trim() || "",
                    so_ct: formData.so_ct?.trim() || "",
                    ong_ba: formData.ong_ba?.trim() || "",
                    loai_pb: formData.loai_pb?.trim() || "",
                    ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : new Date().toISOString(),
                    ngay_lct: formData.ngay_lct ? new Date(formData.ngay_lct).toISOString() : new Date().toISOString(),
                },
                hangHoa: hangHoaData
                    .filter(row => row.ma_vt && parseFloat(row.tien_nt) > 0)
                    .map(({ ma_kho_i, ma_vt, gia, thue_nt, tien_nt, tien_nt0, tk_vt, so_luong }) => ({
                        ma_kho_i: ma_kho_i?.trim() || "",
                        ma_vt: ma_vt?.trim() || "",
                        ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : new Date().toISOString(),
                        gia: Number(gia) || 0,
                        thue_nt: Number(thue_nt) || 0,
                        tien_nt: Number(tien_nt) || 0,
                        tien_nt0: Number(tien_nt0) || 0,
                        tk_vt: tk_vt?.trim() || "",
                        so_luong: Number(so_luong) || 0,
                    })),
                hdThue: hdThueData
                    .filter(row => row.ma_kh || row.so_ct0)
                    .map(({
                        so_ct0, ma_gd, ma_hd, ma_kho, ten_vt, so_luong, gia, t_thue,
                        so_seri0, ma_kh, ten_kh, ngay_ct0, dia_chi, ma_so_thue, t_tien, thue_suat, han_tt, t_tt, tk_thue_no
                    }) => ({
                        ma_gd: ma_gd?.trim() || "",
                        ma_hd: ma_hd?.trim() || "",
                        ma_kho: ma_kho?.trim() || "",
                        ten_vt: ten_vt?.trim() || "",
                        so_luong: Number(so_luong) || 0,
                        gia: Number(gia) || 0,
                        t_thue: Number(t_thue) || 0,
                        so_ct0: so_ct0?.trim() || "",
                        so_seri0: so_seri0?.trim() || "",
                        ma_kh: ma_kh?.trim() || "",
                        ten_kh: ten_kh?.trim() || "",
                        ma_dvcs: formData.ma_dvcs?.trim() || "",
                        ngay_ct0: ngay_ct0 ? new Date(ngay_ct0).toISOString() : undefined,
                        dia_chi: dia_chi?.trim() || "",
                        ma_so_thue: ma_so_thue?.trim() || "",
                        t_tien: Number(t_tien) || 0,
                        thue_suat: Number(thue_suat) || 0,
                        han_tt: Number(han_tt) || 0,
                        t_tt: Number(t_tt) || 0,
                        tk_thue_no: tk_thue_no?.trim() || "",
                    })),
            };

            await updatePhieuMua({ stt_rec: editingId, data: payload });
            closeModalEdit();
            resetForm();
            navigate("/phieu-mua");
            toast.success("Cập nhật phiếu mua thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi khi cập nhật phiếu mua: " + (err?.message || "Không xác định"));
        }
    }, [formData, hangHoaData, hdThueData, totals, updatePhieuMua, closeModalEdit, resetForm, navigate, validateForm, editingId]);

    const handleClose = useCallback(() => {
        resetForm();
        closeModalEdit();
    }, [resetForm, closeModalEdit]);

    // Table columns cho Hàng hóa
    const hangHoaColumns = [
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
            fixed: "left",
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_vt}
                        onChange={(e) => handleHangHoaChange(row.id, "ma_vt", e.target.value)}
                        placeholder="Nhập mã VT..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "ten_vt",
            title: "Tên vật tư",
            fixed: "left",
            width: 200,
            render: (val, row) => (
                <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
                    {row.ten_vt}
                </div>
            )
        },
        {
            key: "dvt",
            title: "ĐVT",
            width: 80,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <div className="text-center text-gray-600">
                        {row.dvt || "-"}
                    </div>
                );
            },
        },
        {
            key: "ma_kho_i",
            title: "Mã kho",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_kho_i}
                        onChange={(e) => handleHangHoaChange(row.id, "ma_kho_i", e.target.value)}
                        placeholder="Nhập mã kho..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "ten_kho",
            title: "Tên kho",
            width: 150,
            render: (val, row) => (
                <div className="text-gray-600 text-center">
                    {row.ten_kho || "-"}
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
                        <div className="text-right text-lg text-blue-600 p-2 rounded">
                            {totals.totalSoLuong.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    <Input
                        type="number"
                        value={row.so_luong}
                        onChange={(e) => handleHangHoaChange(row.id, "so_luong", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "gia",
            title: "Đơn giá",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        type="number"
                        value={row.gia}
                        onChange={(e) => handleHangHoaChange(row.id, "gia", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "tien_nt",
            title: "Tiền hàng",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-lg text-green-600 p-2 rounded">
                            {totals.totalTienHang.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    <Input
                        type="number"
                        value={row.tien_nt}
                        onChange={(e) => handleHangHoaChange(row.id, "tien_nt", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                        readOnly
                    />
                );
            },
        },
        {
            key: "tk_vt",
            title: "TK nợ",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.tk_vt}
                        onChange={(e) => handleHangHoaChange(row.id, "tk_vt", e.target.value)}
                        placeholder="Nhập TK..."
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "ma_du_an",
            title: "Mã dự án",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_du_an}
                        onChange={(e) => handleHangHoaChange(row.id, "ma_du_an", e.target.value)}
                        placeholder="Mã dự án..."
                        className="w-full"
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
                            onClick={() => deleteHangHoaRow(row.id)}
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

    // Thêm dòng tổng vào data Hàng hóa
    const hangHoaDataWithTotal = useMemo(() => {
        return [
            ...hangHoaData,
            {
                id: 'total',
                ma_vt: '',
                ten_vt: '',
                dvt: '',
                ma_kho_i: '',
                ten_kho: '',
                so_luong: totals.totalSoLuong,
                gia: '',
                tien_nt: totals.totalTienHang,
                tk_vt: '',
                ma_du_an: ''
            }
        ];
    }, [hangHoaData, totals]);

    // Table columns cho Chi phí
    const chiPhiColumns = [
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
            key: "ma_vt",
            title: "Mã vật tư",
            fixed: "left",
            width: 120,
            render: (val, row) => (
                <Input
                    value={row.ma_vt}
                    onChange={(e) => handleChiPhiChange(row.id, "ma_vt", e.target.value)}
                    placeholder="Nhập mã VT..."
                    className="w-full"
                />
            ),
        },
        {
            key: "ten_vt",
            title: "Tên vật tư",
            width: 200,
            render: (val, row) => (
                <div className="text-gray-800 font-medium">
                    {row.ten_vt}
                </div>
            )
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 100,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.so_luong}
                    onChange={(e) => handleChiPhiChange(row.id, "so_luong", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "tien_hang",
            title: "Tiền hàng",
            width: 120,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.tien_hang}
                    onChange={(e) => handleChiPhiChange(row.id, "tien_hang", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                    readOnly
                />
            ),
        },
        {
            key: "tien_chi_phi",
            title: "Tiền chi phí",
            width: 120,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.tien_chi_phi}
                    onChange={(e) => handleChiPhiChange(row.id, "tien_chi_phi", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "tk_no",
            title: "TK nợ",
            width: 120,
            render: (val, row) => (
                <Input
                    value={row.tk_no}
                    onChange={(e) => handleChiPhiChange(row.id, "tk_no", e.target.value)}
                    placeholder="Nhập TK..."
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
                        onClick={() => deleteChiPhiRow(row.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa dòng"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    // Table columns cho HĐ Thuế
    const hdThueColumns = [
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
                    onChange={(e) => handleHdThueChange(row.id, "so_ct0", e.target.value)}
                    placeholder="Nhóm..."
                    className="w-full"
                />
            ),
        },
        {
            key: "so_seri0",
            title: "Số seri",
            width: 120,
            render: (val, row) => (
                <Input
                    value={row.so_seri0}
                    onChange={(e) => handleHdThueChange(row.id, "so_seri0", e.target.value)}
                    placeholder="Số seri..."
                    className="w-full"
                />
            ),
        },
        {
            key: "ma_gd",
            title: "Mẫu hóa đơn",
            width: 120,
            render: (val, row) => (
                <Input
                    value={row.ma_gd}
                    onChange={(e) => handleHdThueChange(row.id, "ma_gd", e.target.value)}
                    placeholder="Mẫu HĐ..."
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
                            handleHdThueChange(row.id, "ngay_ct0", date?.[0]?.toISOString() || "")
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
            title: "Mã khách",
            width: 120,
            render: (val, row) => (
                <Input
                    value={row.ma_kh}
                    onChange={(e) => handleHdThueChange(row.id, "ma_kh", e.target.value)}
                    placeholder="Mã khách..."
                    className="w-full"
                />
            ),
        },
        {
            key: "ten_kh",
            title: "Tên khách",
            width: 200,
            render: (val, row) => (
                <Input
                    value={row.ten_kh}
                    onChange={(e) => handleHdThueChange(row.id, "ten_kh", e.target.value)}
                    placeholder="Tên khách..."
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
                    onChange={(e) => handleHdThueChange(row.id, "dia_chi", e.target.value)}
                    placeholder="Địa chỉ..."
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
                    onChange={(e) => handleHdThueChange(row.id, "ma_so_thue", e.target.value)}
                    placeholder="MST..."
                    className="w-full"
                />
            )
        },
        {
            key: "ma_kho",
            title: "Mã kho",
            width: 120,
            render: (val, row) => (
                <Input
                    value={row.ma_kho}
                    onChange={(e) => handleHdThueChange(row.id, "ma_kho", e.target.value)}
                    placeholder="Mã kho..."
                    className="w-full"
                />
            ),
        },
        {
            key: "ten_vt",
            title: "Hàng hóa, dịch vụ",
            width: 200,
            render: (val, row) => (
                <Input
                    value={row.ten_vt}
                    onChange={(e) => handleHdThueChange(row.id, "ten_vt", e.target.value)}
                    placeholder="Hàng hóa, DV..."
                    className="w-full"
                />
            ),
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 100,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.so_luong}
                    onChange={(e) => handleHdThueChange(row.id, "so_luong", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "gia",
            title: "Giá",
            width: 120,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.gia}
                    onChange={(e) => handleHdThueChange(row.id, "gia", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                />
            ),
        },
        {
            key: "t_tien",
            title: "Tiền hàng",
            width: 120,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.t_tien}
                    onChange={(e) => handleHdThueChange(row.id, "t_tien", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                    readOnly
                />
            ),
        },
        {
            key: "thue_suat",
            title: "Thuế suất (%)",
            width: 100,
            render: (val, row) => (
                <Input
                    type="number"
                    value={row.thue_suat}
                    onChange={(e) => handleHdThueChange(row.id, "thue_suat", e.target.value)}
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
                    type="number"
                    value={row.t_thue}
                    onChange={(e) => handleHdThueChange(row.id, "t_thue", e.target.value)}
                    placeholder="0"
                    className="w-full text-right"
                    readOnly
                />
            ),
        },
        {
            key: "tk_thue_no",
            title: "TK thuế",
            width: 120,
            render: (val, row) => (
                <Input
                    value={row.tk_thue_no}
                    onChange={(e) => handleHdThueChange(row.id, "tk_thue_no", e.target.value)}
                    placeholder="TK thuế..."
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
                        onClick={() => deleteHdThueRow(row.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa dòng"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ),
        },
    ];

    // Loading state
    if (isLoadingEdit) {
        return (
            <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-7xl m-4">
                <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
                <div className="flex-shrink-0 p-2 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Edit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                Chỉnh sửa phiếu nhập mua
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Cập nhật thông tin phiếu nhập mua #{formData.so_ct}
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
                                            placeholder="KH005"
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <input
                                            type="text"
                                            value={formData.ten_kh}
                                            onChange={(e) => handleFormChange("ten_kh", e.target.value)}
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
                                            value={formData.dia_chi}
                                            onChange={(e) => handleFormChange("dia_chi", e.target.value)}
                                            placeholder="Nhập địa chỉ khách hàng"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px] ml-4">
                                            MST
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ma_so_thue}
                                            onChange={(e) => handleFormChange("ma_so_thue", e.target.value)}
                                            placeholder="Mã số thuế"
                                            readOnly
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Người giao hàng
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.ong_ba}
                                            onChange={(e) => handleFormChange("ong_ba", e.target.value)}
                                            placeholder="Tên người giao hàng"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Diễn giải
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.dien_giai}
                                            onChange={(e) => handleFormChange("dien_giai", e.target.value)}
                                            placeholder="Nhập diễn giải"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            TK có
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.tk_thue_no}
                                            onChange={(e) => {
                                                handleFormChange("tk_thue_no", e.target.value);
                                                handleMainFormAccountSearch(e.target.value);
                                            }}
                                            placeholder="1111"
                                            className="w-32 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Cột phải - 30% (3 cột) */}
                                <div className="lg:col-span-3 space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Ngày HT
                                        </Label>
                                        <Flatpickr
                                            value={formData.ngay_ct}
                                            onChange={(date) => handleDateChange(date, "ngay_ct")}
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
                                            value={formData.ngay_lct}
                                            onChange={(date) => handleDateChange(date, "ngay_lct")}
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
                                            value={formData.ma_qs}
                                            onChange={(e) => handleFormChange("ma_qs", e.target.value)}
                                            placeholder="PN001"
                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Số phiếu <span className="text-red-500">*</span>
                                        </Label>
                                        <input
                                            type="text"
                                            value={formData.so_ct}
                                            onChange={(e) => handleFormChange("so_ct", e.target.value)}
                                            placeholder="PN00010"
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
                                                type="number"
                                                value="1.00"
                                                readOnly
                                                className="flex-1 px-3 py-2 text-sm focus:outline-none h-9 border-none bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center">
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                                            Trạng thái
                                        </Label>
                                        <div className="flex-1">
                                            <Select
                                                value={formData.status}
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

                    {/* Tabs */}
                    <div className="px-6">
                        <Tabs
                            tabs={[
                                {
                                    label: "1. Hàng hóa",
                                    content: (
                                        <div className="bg-white rounded-lg border border-gray-200" ref={hangHoaTableRef}>
                                            <TableBasic
                                                data={hangHoaDataWithTotal}
                                                columns={hangHoaColumns}
                                                onDeleteRow={deleteHangHoaRow}
                                                showAddButton={true}
                                                maxHeight="max-h-80"
                                                className="w-full"
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    label: "2. Chi phí",
                                    content: (
                                        <div className="space-y-4">
                                            {/* Form fields ở trên - 1 hàng ngang */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                <div className="grid grid-cols-6 gap-4 items-center">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-sm font-medium text-gray-700 min-w-[60px]">
                                                            Mã khách
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            value={formData.ma_kh}
                                                            readOnly
                                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-sm font-medium text-gray-700 min-w-[50px]">
                                                            TK có
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            value={formData.tk_thue_no}
                                                            readOnly
                                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-sm font-medium text-gray-700 min-w-[70px]">
                                                            Tổng chi phí
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            value={totals.totalChiPhi.toLocaleString('vi-VN')}
                                                            readOnly
                                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-yellow-50 text-red-600 font-medium text-right"
                                                        />
                                                    </div>

                                                    <div className="flex justify-center">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                                        >
                                                            Chi tiết
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-sm font-medium text-gray-700 min-w-[80px]">
                                                            Loại phân bổ
                                                        </Label>
                                                        <select
                                                            value={formData.loai_pb}
                                                            onChange={(e) => handleFormChange("loai_pb", e.target.value)}
                                                            className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        >
                                                            <option value="1">1 - Tiền</option>
                                                            <option value="2">2 - Số lượng</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex justify-center">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                                        >
                                                            PB tự động
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bảng chi phí ở dưới */}
                                            <div className="bg-white rounded-lg border border-gray-200" ref={chiPhiTableRef}>
                                                <TableBasic
                                                    data={chiPhiData}
                                                    columns={chiPhiColumns}
                                                    onAddRow={addChiPhiRow}
                                                    onDeleteRow={deleteChiPhiRow}
                                                    showAddButton={true}
                                                    addButtonText="Thêm dòng"
                                                    maxHeight="max-h-80"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    label: "3. HĐ Thuế",
                                    content: (
                                        <div className="bg-white rounded-lg border border-gray-200" ref={hdThueTableRef}>
                                            <TableBasic
                                                data={hdThueData}
                                                columns={hdThueColumns}
                                                onAddRow={addHdThueRow}
                                                onDeleteRow={deleteHdThueRow}
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
                                    addHangHoaRow();
                                } else if (activeTab === 1) {
                                    addChiPhiRow();
                                } else if (activeTab === 2) {
                                    addHdThueRow();
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
                        {/* Summary info */}
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Số lượng:</span>
                                <span className="font-semibold text-blue-600">
                                    {totals.totalSoLuong.toLocaleString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Cộng tiền hàng:</span>
                                <span className="font-semibold text-green-600">
                                    {totals.totalTienHang.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tiền chi phí:</span>
                                <span className="font-semibold text-orange-600">
                                    {totals.totalChiPhi.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tiền thuế GTGT:</span>
                                <span className="font-semibold text-purple-600">
                                    {totals.totalThueGtgt.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Tổng tiền TT:</span>
                                <span className="font-semibold text-red-600">
                                    {totals.totalThanhTien.toLocaleString('vi-VN')} VND
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
                                {isPending ? "Đang cập nhật..." : "Cập nhật phiếu nhập"}
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
                        onSearchChange={(value) => setSearchStates(prev => ({ ...prev, tkSearch: value }))}
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
            </div>
        </Modal>
    );
};

