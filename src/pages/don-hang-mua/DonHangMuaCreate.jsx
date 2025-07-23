import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateDonHangMua } from "../../hooks/usedonhangmua";
import { useCustomers } from "../../hooks/useCustomer";
import { useAccounts } from "../../hooks/useAccounts";
import { Plus, Trash2, X, Save } from "lucide-react";
import { Tabs } from "../../components/ui/tabs";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import AccountSelectionPopup from "../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../components/general/CustomerSelectionPopup";
import DmvtPopup from "../../components/general/dmvtPopup";
import DmkPopup from "../../components/general/dmkPopup";
import { useNavigate } from "react-router";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import dmvtService from "../../services/dmvt";
import { useDmkho } from "../../hooks/useDmkho";

export const ModalCreateDonHangMua = ({ isOpenCreate, closeModalCreate }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        so_ct: "",
        ong_ba: "",
        // ngay_lct: "",
        ngay_ky: "",
        tk: "",
        // ma_gd: "",
        ma_kh: "",
        dia_chi: "",
        dien_giai: "",
        ma_hdm: "",
        ma_hdm_me: "",
        loai_ct: "1",
        mst: "",
        ma_nt: "VND",
        ty_gia: "1",
        ma_nx: "",
    });

    // State cho customer search
    const [maKhSearch, setMaKhSearch] = useState("");

    // State cho account dropdown (tài khoản nợ)
    const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
    const [maTaiKhoanSearch2, setMaTaiKhoanSearch2] = useState("");
    const [selectedAccount, setSelectedAccount] = useState(null);

    // State cho DMVT search - THÊM MỚI
    const [dmvtSearchTerm, setDmvtSearchTerm] = useState("");
    const [dmvtData, setDmvtData] = useState({ data: [] });
    const [dmvtLoading, setDmvtLoading] = useState(false);

    // State cho Kho search - THÊM MỚI
    const [maKhoSearch, setMaKhoSearch] = useState("");

    // State để lưu trữ giá trị gốc của mã vật tư
    const [originalMaVt, setOriginalMaVt] = useState({});

    // THÊM STATE CHO CHI PHÍ
    const [chiPhiData, setChiPhiData] = useState([]);

    const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
    const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});
    const { data: accountRawData2 = {} } = useAccounts(
        maTaiKhoanSearch2 ? { search: maTaiKhoanSearch2 } : {}
    );

    // Hook để lấy danh sách kho - THÊM MỚI
    const { data: dmkhoData = [] } = useDmkho(maKhoSearch ? { search: maKhoSearch } : {});

    const { mutateAsync: saveDonHangMua, isPending } = useCreateDonHangMua();
    const hangHoaTableRef = useRef(null);

    const [searchStates, setSearchStates] = useState({
        tkSearch: "",
        tkSearch2: "",
        tkSearchRowId: null,
        tkSearchRowId2: null,
        tkSearchField: null,
        maKhSearch: "",
        maKhSearchRowId: null,
        // Thêm state cho vật tư popup
        maVtSearch: "",
        maVtSearchRowId: null,
        // Thêm state cho kho popup
        maKhoSearch: "",
        maKhoSearchRowId: null,
        searchContext: null,
        showAccountPopup: false,
        showAccountPopup2: false,
        showMainCustomerPopup: false,
        showDmvtPopup: false,
        showDmkhoPopup: false,
        showMainAccountPopup: false, // THÊM MỚI cho popup tài khoản chính
    });

    const INITIAL_HANG_HOA_DATA = [
        {
            id: 1,
            stt_rec: "1",
            ma_vt: "",
            ten_vt: "",
            // dvt: "",
            ma_kho_i: "",
            so_luong: 0,
            gia_nt0: 0,        // Giá gốc n.tệ
            cp_nt: 0,          // Tiền cp n.tệ
            gia_nt: 0,         // Giá n.tệ
            tien_nt: 0,
            tien_nt0: 0,        // Tiền n.tệ
            tk_vt: "",
            gia0: 0,           // Giá gốc VNĐ
            cp: 0,             // Tiền cp VNĐ
            gia: 0,            // Giá VNĐ
            tien: 0,
            ma_thue: "",
            thue_suat: 0,         // Tiền VNĐ
            thue: 0,
            tien0: 0, // Tiền hàng VNĐ
        },
    ];

    const FLATPICKR_OPTIONS = {
        dateFormat: "Y-m-d",
        locale: Vietnamese,
    };

    const [hangHoaData, setHangHoaData] = useState(INITIAL_HANG_HOA_DATA);

    // Hook để lấy danh sách vật tư - CẬP NHẬT
    const fetchDmvtData = useCallback(async (searchTerm = "") => {
        setDmvtLoading(true);
        try {
            console.log('🔍 Fetching DMVT data with search term:', searchTerm);

            // Gọi API danh sách vật tư (kể cả khi searchTerm rỗng)
            const response = await dmvtService.getDmvt({
                search: searchTerm, // Có thể là empty string
                page: 1,
                limit: 20
            });

            console.log('✅ DMVT data received:', response);

            // Cập nhật dữ liệu vật tư
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

    // Hook để lấy tên vật tư cho từng dòng hàng hóa
    const fetchMaterialNames = useCallback(async (hangHoaArray) => {
        const promises = hangHoaArray.map(async (item) => {
            if (item.ma_vt && !item.ten_vt) {
                try {
                    const materialData = await dmvtService.getDmvtById(item.ma_vt);
                    console.log(`Fetched material for ${item.ma_vt}:`, materialData);
                    return {
                        ...item,
                        ten_vt: materialData.ten_vt || "",
                        dvt: materialData.dvt || ""
                    };
                } catch (error) {
                    console.warn(`Cannot fetch material name for ${item.ma_vt}:`, error);
                    return item;
                }
            }
            return item;
        });

        return Promise.all(promises);
    }, []);

    // FUNCTION ĐỂ ĐỒNG BỘ CHI PHÍ VỚI HÀNG HÓA
    const syncChiPhiWithHangHoa = useCallback((hangHoaList) => {
        const newChiPhiData = hangHoaList.map((item, index) => ({
            id: item.id,
            stt_rec: (index + 1).toString(),
            ma_vt: item.ma_vt || "",
            ten_vt: item.ten_vt || "",
            tien_hang: item.tien0 || 0, // Tiền hàng từ bảng hàng hóa
            cp: item.cp || 0, // Chi phí từ trường cp của hàng hóa
        }));
        setChiPhiData(newChiPhiData);
    }, []);

    // ĐỊNH NGHĨA handleHangHoaChange TRƯỚC KHI SỬ DỤNG
    const handleHangHoaChange = useCallback((id, field, value) => {
        console.log(`🔄 handleHangHoaChange: id=${id}, field=${field}, value=${value}`);

        setHangHoaData(prev => {
            const newData = prev.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };

                    // Auto calculate tien when so_luong or gia changes (VNĐ)
                    if (field === "so_luong" || field === "gia0") {
                        const soLuong = parseFloat(field === "so_luong" ? value : item.so_luong) || 0;
                        const gia = parseFloat(field === "gia0" ? value : item.gia0) || 0;
                        updatedItem.tien0 = soLuong * gia;
                    }
                    //thue_suat
                    if (field === "thue_suat") {
                        const thueSuat = parseFloat(field === "thue_suat" ? value : item.thue_suat) || 0;

                        updatedItem.thue = (updatedItem.tien0 * thueSuat) / 100;
                    }

                    // Auto calculate tien_nt when so_luong or gia_nt changes (ngoại tệ)
                    if (field === "so_luong" || field === "gia_nt") {
                        const soLuong = parseFloat(field === "so_luong" ? value : item.so_luong) || 0;
                        const giaNt = parseFloat(field === "gia_nt" ? value : item.gia_nt) || 0;
                        updatedItem.tien_nt = soLuong * giaNt;
                    }

                    // Auto sync prices between VNĐ and foreign currency based on exchange rate
                    const tyGia = parseFloat(formData.ty_gia) || 1;

                    if (field === "gia_nt0") {
                        updatedItem.gia0 = parseFloat(value || 0) * tyGia;
                    } else if (field === "gia0") {
                        updatedItem.gia_nt0 = parseFloat(value || 0) / tyGia;
                    }

                    if (field === "gia_nt") {
                        updatedItem.gia = parseFloat(value || 0) * tyGia;
                    } else if (field === "gia") {
                        updatedItem.gia_nt = parseFloat(value || 0) / tyGia;
                    }

                    if (field === "cp_nt") {
                        updatedItem.cp = parseFloat(value || 0) * tyGia;
                    } else if (field === "cp") {
                        updatedItem.cp_nt = parseFloat(value || 0) / tyGia;
                    }

                    // Xử lý tìm kiếm mã vật tư
                    if (field === "ma_vt") {
                        console.log(`🔍 Triggering material search for: "${value}"`);
                        // Luôn trigger search khi có thay đổi (kể cả xóa text)
                        setSearchStates(prev => ({
                            ...prev,
                            maVtSearch: value || "", // Đảm bảo không bị undefined
                            maVtSearchRowId: id
                        }));
                    }

                    // Trigger popup kho khi nhập mã kho
                    if (field === "ma_kho_i" && value && value.trim()) {
                        setSearchStates(prev => ({
                            ...prev,
                            maKhoSearch: value.trim(),
                            maKhoSearchRowId: id
                        }));
                    }

                    return updatedItem;
                }
                return item;
            });

            // ĐỒNG BỘ CHI PHÍ SAU KHI CẬP NHẬT HÀNG HÓA
            syncChiPhiWithHangHoa(newData);

            return newData;
        });

        if (field === "tk_vt") {
            // Tài khoản nợ → Popup 1
            setSearchStates(prev => ({
                ...prev,
                tkSearch: value,
                tkSearchRowId: id,
                tkSearchField: field,
                showAccountPopup: true
            }));
        }
    }, [formData.ty_gia, syncChiPhiWithHangHoa]);

    // HANDLE CHI PHÍ CHANGE
    const handleChiPhiChange = useCallback((id, field, value) => {
        if (field !== "cp") return; // Chỉ cho phép sửa trường cp

        setChiPhiData(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, [field]: parseFloat(value) || 0 }
                    : item
            )
        );

        // Đồng thời cập nhật lại hangHoaData với giá trị cp mới
        setHangHoaData(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, cp: parseFloat(value) || 0 }
                    : item
            )
        );
    }, []);

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
            if (searchStates.tkSearch2) {
                setSearchStates(prev => ({ ...prev, showAccountPopup2: true }));
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchStates.tkSearch2]);

    // Debounce customer search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (maKhSearch && maKhSearch.length > 0) {
                console.log('🔍 Searching for customer:', maKhSearch);
            } else {
                setSearchStates(prev => ({ ...prev, showMainCustomerPopup: false }));
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [maKhSearch]);

    // Debounce account search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (maTaiKhoanSearch && maTaiKhoanSearch.length > 0) {
                console.log('🔍 Searching for main account:', maTaiKhoanSearch);
            } else {
                setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [maTaiKhoanSearch]);

    // Debounce vật tư search - CẬP NHẬT
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const searchTerm = searchStates.maVtSearch || "";
            console.log('🔍 Material search effect triggered. Search term:', `"${searchTerm}"`);

            // Luôn gọi API, kể cả khi search term rỗng
            setDmvtSearchTerm(searchTerm);
            fetchDmvtData(searchTerm);

            // Chỉ hiển thị popup khi có ít nhất 1 ký tự
            if (searchTerm.length > 0) {
                console.log('📋 Showing DMVT popup');
                setSearchStates(prev => ({ ...prev, showDmvtPopup: true }));
            } else {
                console.log('❌ Hiding DMVT popup (empty search)');
                setSearchStates(prev => ({ ...prev, showDmvtPopup: false }));
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchStates.maVtSearch, fetchDmvtData]);

    // Debounce kho search - THÊM MỚI
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchStates.maKhoSearch && searchStates.maKhoSearch.length > 0) {
                console.log('🔍 Searching for warehouse:', searchStates.maKhoSearch);
                setMaKhoSearch(searchStates.maKhoSearch);
                setSearchStates(prev => ({ ...prev, showDmkhoPopup: true }));
            } else {
                setSearchStates(prev => ({ ...prev, showDmkhoPopup: false }));
                setMaKhoSearch("");
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchStates.maKhoSearch]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Trigger customer search when ma_kh changes
        if (field === 'ma_kh') {
            setMaKhSearch(value);
        }

        // Trigger account search when tk changes
        if (field === 'tk') {
            setMaTaiKhoanSearch(value);
        }

        // Auto update exchange rate when currency changes
        if (field === 'ma_nt') {
            const exchangeRate = value === 'USD' ? 25000 : 1;
            setFormData(prev => ({
                ...prev,
                [field]: value,
                ty_gia: exchangeRate
            }));
        }
    };

    const validateForm = useCallback(() => {
        if (!formData.ngay_ky) {
            console.error("Vui lòng nhập Ngày dh");
            return false;
        }
        if (!formData.so_ct) {
            console.error("Vui lòng nhập số chứng từ");
            return false;
        }

        const validHangHoaRows = hangHoaData.filter(row =>
            row.ma_vt && (parseFloat(row.so_luong) > 0)
        );
        if (validHangHoaRows.length === 0) {
            console.error("Vui lòng nhập ít nhất một dòng hàng hóa hợp lệ");
            return false;
        }

        return true;
    }, [formData, hangHoaData]);

    // Handle customer selection
    const handleMainCustomerSelect = (customer) => {
        if (!customer) {
            console.error('Customer object is null or undefined');
            return;
        }

        console.log('Selected customer:', customer);

        setFormData(prev => ({
            ...prev,
            mst: customer.ma_so_thue || "",
            ma_kh: customer.ma_kh || "",
            ong_ba: customer.ten_kh || "",
            dia_chi: customer.dia_chi || ""
        }));

        setMaKhSearch(customer.ma_kh || "");

        setSearchStates(prev => ({
            ...prev,
            showMainCustomerPopup: false
        }));
    };

    const handleMainAccountSelect = (account) => {
        console.log('Selected main account:', account);

        setFormData(prev => ({
            ...prev,
            ma_nx: account.tk.trim()
        }));

        setSelectedAccount(account);

        setSearchStates(prev => ({
            ...prev,
            showMainAccountPopup: false
        }));
    };

    // Handle account selection for table
    const handleAccountSelect = useCallback((id, account) => {
        setHangHoaData(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, tk_vt: account.tk.trim(), ten_tk: account.ten_tk }
                    : item
            )
        );

        setSearchStates(prev => ({
            ...prev,
            showAccountPopup: false,
            tkSearch: "",
            tkSearchField: null
        }));
    }, []);

    const handleAccountSelect2 = useCallback((id, account) => {
        setHangHoaData(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        // ma_nx_i: account.tk.trim(),
                    }
                    : item
            )
        );

        setSearchStates(prev => ({
            ...prev,
            showAccountPopup2: false,
            tkSearch2: "",
            tkSearchField2: null,
        }));
    }, []);

    // Handle vật tư selection - CẬP NHẬT
    const handleDmvtSelect = useCallback((dmvt) => {
        if (!dmvt || !searchStates.maVtSearchRowId) {
            console.error('DMVT object or row ID is null/undefined');
            return;
        }

        console.log('Selected DMVT:', dmvt);
        console.log('Row ID:', searchStates.maVtSearchRowId);

        // Cập nhật dữ liệu hàng hóa với vật tư đã chọn
        setHangHoaData(prev => {
            const newData = prev.map(item =>
                item.id === searchStates.maVtSearchRowId
                    ? {
                        ...item,
                        ma_vt: dmvt.ma_vt || dmvt.code || "",
                        ten_vt: dmvt.ten_vt || dmvt.name || "",
                    }
                    : item
            );

            // ĐỒNG BỘ CHI PHÍ SAU KHI CHỌN VẬT TƯ
            syncChiPhiWithHangHoa(newData);
            return newData;
        });

        // Cập nhật original value với giá trị mới
        setOriginalMaVt(prev => ({
            ...prev,
            [searchStates.maVtSearchRowId]: dmvt.ma_vt || dmvt.code || ""
        }));

        // Đóng popup và reset search state
        setSearchStates(prev => ({
            ...prev,
            showDmvtPopup: false,
            maVtSearch: "",
            maVtSearchRowId: null
        }));

        // Reset DMVT data
        setDmvtSearchTerm("");
        setDmvtData({ data: [] });
    }, [searchStates.maVtSearchRowId, syncChiPhiWithHangHoa]);

    // Handle kho selection - THÊM MỚI
    const handleDmkhoSelect = useCallback((kho) => {
        if (!kho || !searchStates.maKhoSearchRowId) {
            console.error('Kho object or row ID is null/undefined');
            return;
        }

        console.log('Selected Kho:', kho);
        console.log('Row ID:', searchStates.maKhoSearchRowId);

        // Cập nhật dữ liệu hàng hóa với kho đã chọn
        setHangHoaData(prev =>
            prev.map(item =>
                item.id === searchStates.maKhoSearchRowId
                    ? {
                        ...item,
                        ma_kho_i: kho.ma_kho?.trim() || "",
                        ten_kho: kho.ten_kho || ""
                    }
                    : item
            )
        );

        // Đóng popup và reset search state
        setSearchStates(prev => ({
            ...prev,
            showDmkhoPopup: false,
            maKhoSearch: "",
            maKhoSearchRowId: null
        }));

        // Reset kho search
        setMaKhoSearch("");
    }, [searchStates.maKhoSearchRowId]);

    // Handle DMVT search từ popup - CẬP NHẬT
    const handleDmvtSearch = useCallback((searchTerm) => {
        console.log('🔍 DMVT search from popup:', searchTerm);
        setDmvtSearchTerm(searchTerm || "");
        fetchDmvtData(searchTerm || ""); // Luôn gọi API, kể cả khi searchTerm rỗng
    }, [fetchDmvtData]);

    // Handle Dmkho search từ popup - THÊM MỚI
    const handleDmkhoSearch = useCallback((searchTerm) => {
        console.log('🔍 Dmkho search from popup:', searchTerm);
        setMaKhoSearch(searchTerm);
    }, []);

    const handleFormChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (field === "dienGiaiChung") {
            setHangHoaData(prevHangHoa =>
                prevHangHoa.map(item => ({
                    ...item,
                    dien_giai: value
                }))
            );
        }
    }, []);

    const handleDateChange = useCallback((date, field) => {
        const formattedDate = date[0]?.toLocaleDateString("en-CA");
        handleFormChange(field, formattedDate);
    }, [handleFormChange]);

    // Calculate totals
    const totals = useMemo(() => {
        const totalTien0 = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.tien0) || 0;
            return sum + value;
        }, 0);
        const totalTien = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.tien) || 0;
            return sum + value;
        }, 0);

        const totalTienNT = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.tien_nt) || 0;
            return sum + value;
        }, 0);

        const totalSoLuong = hangHoaData.reduce((sum, item) => {
            const value = parseFloat(item.so_luong) || 0;
            return sum + value;
        }, 0);

        return { totalTien, totalTienNT, totalSoLuong, totalTien0 };
    }, [hangHoaData]);

    // Calculate chi phí totals
    const chiPhiTotals = useMemo(() => {
        const totalTienHang = chiPhiData.reduce((sum, item) => {
            const value = parseFloat(item.tien_hang) || 0;
            return sum + value;
        }, 0);

        const totalChiPhi = chiPhiData.reduce((sum, item) => {
            const value = parseFloat(item.cp) || 0; // Đổi từ tien_chi_phi sang cp
            return sum + value;
        }, 0);

        return { totalTienHang, totalChiPhi };
    }, [chiPhiData]);

    const { data: accountRawData = {} } = useAccounts(
        searchStates.tkSearch ? { search: searchStates.tkSearch } : {}
    );

    const handleClose = () => {
        resetForm();
        closeModalCreate();
    };

    const addHangHoaRow = useCallback((e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setHangHoaData(prev => {
            const newRowId = prev.length + 1;

            const newRow = {
                id: newRowId,
                stt_rec: newRowId.toString(),
                ma_vt: "",
                ten_vt: "",
                ma_kho_i: "",
                so_luong: 0,
                gia_nt0: 0,
                cp_nt: 0,
                gia_nt: 0,
                tien_nt: 0,
                tien_nt0: 0,
                tk_vt: "",
                gia0: 0,
                cp: 0,
                gia: 0,
                tien: 0,
                ma_thue: "",
                thue_suat: 0,
                thue: 0,
                tien0: 0,
            };

            const newData = [...prev, newRow];

            // ĐỒNG BỘ CHI PHÍ KHI THÊM DÒNG MỚI
            syncChiPhiWithHangHoa(newData);

            return newData;
        });

        setTimeout(() => {
            if (hangHoaTableRef.current) {
                const tableContainer = hangHoaTableRef.current.querySelector('.overflow-x-auto');
                if (tableContainer) {
                    tableContainer.scrollTop = tableContainer.scrollHeight;
                }
            }
        }, 100);
    }, [syncChiPhiWithHangHoa]);

    const hangHoaDataWithTotal = useMemo(() => {
        return [
            ...hangHoaData,
            {
                id: 'total',
                stt_rec: 'Tổng',
                ma_vt: '',
                ten_vt: '',
                ma_kho_i: '',
                so_luong: totals.totalSoLuong,
                gia_nt0: '',
                cp_nt: '',
                gia_nt: '',
                tien_nt: totals.totalTienNT,
                tien_nt0: 0,
                tk_vt: '',
                gia0: '',
                cp: '',
                gia: '',
                tien: totals.totalTien,
                ma_thue: '',
                thue_suat: '',
                thue: 0,
                tien0: totals.totalTien0,
            }
        ];
    }, [hangHoaData, totals]);

    // CHI PHÍ DATA WITH TOTAL
    const chiPhiDataWithTotal = useMemo(() => {
        return [
            ...chiPhiData,
            {
                id: 'total',
                stt_rec: 'Tổng',
                ma_vt: '',
                ten_vt: '',
                tien_hang: chiPhiTotals.totalTienHang,
                cp: chiPhiTotals.totalChiPhi, // Đổi từ tien_chi_phi sang cp
            }
        ];
    }, [chiPhiData, chiPhiTotals]);

    // Table columns for hang hoa
    const hangHoaColumns = [
        {
            key: "stt_rec",
            fixed: "left",
            title: "STT",
            width: 80,
            render: (val, row) => (
                <div className="text-center font-medium text-gray-700">
                    {row.id === 'total' ? 'Tổng' : row.stt_rec}
                </div>
            )
        },
        {
            key: "ma_vt",
            title: "Mã vật tư",
            width: 150,
            fixed: "left",
            render: (val, row) => {
                if (row.id === 'total') {
                    return <div className="font-bold text-gray-900"></div>;
                }
                return (
                    <Input
                        value={row.ma_vt}
                        onChange={(e) => {
                            console.log(`📝 Input onChange: ${e.target.value}`);
                            handleHangHoaChange(row.id, "ma_vt", e.target.value);
                        }}
                        onFocus={(e) => {
                            console.log(`🎯 Input onFocus: current value = "${e.target.value}"`);
                            // Lưu giá trị gốc khi focus
                            setOriginalMaVt(prev => ({
                                ...prev,
                                [row.id]: row.ma_vt
                            }));
                            // Chọn toàn bộ text để dễ thay thế
                            e.target.select();
                        }}
                        onBlur={(e) => {
                            console.log(`👋 Input onBlur: value = "${e.target.value}", showPopup = ${searchStates.showDmvtPopup}`);
                            // Nếu không có giá trị mới và không đang tìm kiếm
                            if (!e.target.value.trim() && !searchStates.showDmvtPopup) {
                                // Khôi phục giá trị gốc
                                const original = originalMaVt[row.id] || "";
                                console.log(`🔄 Restoring original value: "${original}"`);
                                handleHangHoaChange(row.id, "ma_vt", original);
                            }
                        }}
                        placeholder="Nhập mã vt..."
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
            key: "dvt",
            title: "Đơn vị tính",
            width: 100,
            render: (val, row) => (
                <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
                    {row.dvt}
                </div>
            )
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
                        placeholder="Mã kho"
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-[16px] text-blue-600 p-2 rounded px-7">
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
            key: "gia0",
            title: "Đơn giá",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.gia0}
                        onChange={(e) => handleHangHoaChange(row.id, "gia0", e.target.value)}
                        placeholder="Mã kho"
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "tien0",
            title: "Tiền hàng",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-[16px] text-green-600 p-2 rounded px-7">
                            {totals.totalTien0.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    // <Input
                    //     type="number"
                    //     value={row.tien0}
                    //     onChange={(e) => handleHangHoaChange(row.id, "tien0", e.target.value)}
                    //     placeholder="0"
                    //     className="w-full text-right"
                    // />
                    <div className="w-full text-right p-2">
                        {(row.tien0 || 0).toLocaleString('vi-VN')}
                    </div>
                );
            },
        },

        {
            key: "ma_thue",
            title: "Mã thuế",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.ma_thue}
                        onChange={(e) => handleHangHoaChange(row.id, "ma_thue", e.target.value)}
                        placeholder="Mã Thuế"
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "thue_suat",
            title: "Thuế suất",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <Input
                        value={row.thue_suat}
                        onChange={(e) => handleHangHoaChange(row.id, "thue_suat", e.target.value)}
                        placeholder="Thuế suất"
                        className="w-full"
                    />
                );
            },
        },
        {
            key: "thue",
            title: "Tiền thuế",
            width: 120,
            render: (val, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    // <Input
                    //     value={row.thue}
                    //     onChange={(e) => handleHangHoaChange(row.id, "thue", e.target.value)}
                    //     placeholder="Tiền thuế"
                    //     className="w-full"
                    // />
                    <div className="w-full text-right p-2">
                        {(row.thue || 0).toLocaleString('vi-VN')}
                    </div>
                );
            },
        },
        {
            key: "action",
            title: "Hành động",
            fixed: "right",
            width: 100,
            render: (_, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteHangHoaRow(row.id, e);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors p-1"
                            title="Xóa dòng"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            },
        },
    ];

    // CHI PHÍ COLUMNS
    const chiPhiColumns = [
        {
            key: "stt_rec",
            fixed: "left",
            title: "STT",
            width: 80,
            render: (val, row) => (
                <div className="text-center font-medium text-gray-700">
                    {row.id === 'total' ? 'Tổng' : row.stt_rec}
                </div>
            )
        },
        {
            key: "ma_vt",
            title: "Mã vật tư",
            width: 150,
            fixed: "left",
            render: (val, row) => (
                <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
                    {row.ma_vt}
                </div>
            )
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
            key: "tien_hang",
            title: "Tiền hàng",
            width: 150,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-[16px] text-blue-600 p-2 rounded px-7">
                            {chiPhiTotals.totalTienHang.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    <div className="text-right text-gray-700 p-2">
                        {(parseFloat(row.tien_hang) || 0).toLocaleString('vi-VN')}
                    </div>
                );
            },
        },
        {
            key: "cp",
            title: "Tiền chi phí",
            width: 150,
            render: (val, row) => {
                if (row.id === 'total') {
                    return (
                        <div className="text-right text-[16px] text-green-600 p-2 rounded px-7">
                            {chiPhiTotals.totalChiPhi.toLocaleString('vi-VN')}
                        </div>
                    );
                }
                return (
                    <Input
                        type="number"
                        value={row.cp}
                        onChange={(e) => handleChiPhiChange(row.id, "cp", e.target.value)}
                        placeholder="0"
                        className="w-full text-right"
                    />
                );
            },
        },
        {
            key: "action",
            title: "Hành động",
            fixed: "right",
            width: 100,
            render: (_, row) => {
                if (row.id === 'total') return <div></div>;
                return (
                    <div className="flex items-center justify-center">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteHangHoaRow(row.id, e);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors p-1"
                            title="Xóa dòng"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            },
        },
    ];

    const deleteHangHoaRow = useCallback((id, e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setHangHoaData(prev => {
            const newData = prev.filter(item => item.id !== id);
            // ĐỒNG BỘ CHI PHÍ SAU KHI XÓA DÒNG
            syncChiPhiWithHangHoa(newData);
            return newData;
        });
    }, [syncChiPhiWithHangHoa]);

    const resetForm = useCallback(() => {
        setFormData({
            so_ct: "",
            ong_ba: "",
            // ngay_lct: "",
            ngay_ky: "",
            tk: "",
            // ma_gd: "",
            ma_kh: "",
            dia_chi: "",
            dien_giai: "",
            ma_hdm: "",
            ma_hdm_me: "",
            loai_ct: "1",
            mst: "",
            ma_nt: "VND",
            ty_gia: "1",
            ma_nx: "",
        });
        setHangHoaData(INITIAL_HANG_HOA_DATA);
        setChiPhiData([]); // Reset chi phí data
        setOriginalMaVt({});
        setSelectedAccount(null);
        setMaTaiKhoanSearch("");
        setMaTaiKhoanSearch2("");
        setMaKhSearch("");
        setDmvtSearchTerm("");
        setDmvtData({ data: [] });
        setMaKhoSearch("");
        setSearchStates({
            tkSearch: "",
            tkSearch2: "",
            tkSearchRowId: null,
            tkSearchRowId2: null,
            tkSearchField: null,
            maKhSearch: "",
            maKhSearchRowId: null,
            maVtSearch: "",
            maVtSearchRowId: null,
            maKhoSearch: "",
            maKhoSearchRowId: null,
            searchContext: null,
            showAccountPopup: false,
            showAccountPopup2: false,
            showMainCustomerPopup: false,
            showDmvtPopup: false,
            showDmkhoPopup: false,
            showMainAccountPopup: false,
        });
    }, []);

    const handleSave = useCallback(async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const payload = {
                // ma_gd: formData.ma_gd?.trim() || "",
                ma_kh: formData.ma_kh?.trim() || "",
                dia_chi: formData.dia_chi?.trim() || "",
                ong_ba: formData.ong_ba?.trim() || "",
                dien_giai: formData.dien_giai?.trim() || "",
                ngay_ky: formData.ngay_ky,
                // ngay_lct: formData.ngay_lct,
                ma_hdm: formData.ma_hdm?.trim() || "",
                ma_hdm_me: formData.ma_hdm_me?.trim() || "",
                so_ct: formData.so_ct?.trim() || "",
                ma_nt: formData.ma_nt?.trim() || "VND",
                ty_gia: Number(formData.ty_gia) || 1,
                loai_ct: formData.loai_ct?.trim() || "1",
                ma_nx: formData.ma_nx?.trim() || "",

                // Updated hang_hoa_list với tất cả các trường mới
                hang_hoa_list: hangHoaData
                    .filter(row => row.ma_vt && parseFloat(row.so_luong) > 0)
                    .map(({
                        ma_vt,
                        ten_vt,
                        ma_kho_i,
                        so_luong,
                        gia_nt0,
                        cp_nt,
                        gia_nt,
                        tien_nt,
                        tk_vt,
                        gia0,
                        cp,
                        gia,
                        tien,
                        ma_thue,
                        tien_nt0,
                        thue_suat,
                        thue,
                        tien0,
                    }) => ({
                        ma_vt: ma_vt?.trim() || "",
                        ten_vt: ten_vt?.trim() || "",
                        ma_kho_i: ma_kho_i?.trim() || "",
                        so_luong: Number(so_luong) || 0,
                        gia_nt0: Number(gia_nt0) || 0,
                        cp_nt: Number(cp_nt) || 0,
                        gia_nt: Number(gia_nt) || 0,
                        tien_nt: Number(tien_nt) || 0,
                        tien_nt0: Number(tien_nt0) || 0,
                        tk_vt: tk_vt?.trim() || "",
                        gia0: Number(gia0) || 0,
                        cp: Number(cp) || 0,
                        gia: Number(gia) || 0,
                        tien: Number(tien) || 0,
                        ma_thue: ma_thue.trim() || "",
                        thue_suat: Number(thue_suat) || 0,
                        thue: Number(thue) || 0,
                        tien0: Number(tien0) || 0,
                    })),

                // THÊM CHI PHÍ DATA VÀO PAYLOAD
                t_cp: chiPhiData.reduce((sum, item) => sum + (parseFloat(item.cp) || 0), 0),
            };

            await saveDonHangMua(payload);
            closeModalCreate();
            resetForm();
            navigate("/chung-tu/don-dat-hang-mua");
        } catch (err) {
            console.error(err);
        }
    }, [formData, hangHoaData, chiPhiData, totals, saveDonHangMua, closeModalCreate, resetForm, navigate, validateForm]);

    return (
        <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới đơn hàng kho" className="w-full max-w-7xl m-1 border-2">
            <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
                <div className="flex-shrink-0 px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Plus className="w-6 h-6 text-blue-600" />
                                Tạo Đơn hàng nội địa
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Nhập thông tin Đơn hàng nội địa mới vào hệ thống
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="flex-1 min-h-0 flex flex-col bg-blue-50">
                    {/* Form fields section */}
                    <div className="h-[45%] px-6 py-4 flex-shrink-0">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                            {/* Left panel - General info */}
                            <div className="dark:border-gray-600 rounded-lg flex flex-col lg:col-span-3">
                                <div className="p-3 flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 grid-cols-12">
                                            <Label className="text-xs min-w-[110px] col-span-2">Mã khách</Label>
                                            <div className="col-span-6">
                                                <div className="relative flex-1">
                                                    <Input
                                                        value={maKhSearch}
                                                        onChange={e => {
                                                            const value = e.target.value;
                                                            setMaKhSearch(value);
                                                            handleChange("ma_kh", value);
                                                            if (value.length > 0) {
                                                                setSearchStates(prev => ({ ...prev, showMainCustomerPopup: true }));
                                                            } else {
                                                                setSearchStates(prev => ({ ...prev, showMainCustomerPopup: false }));
                                                            }
                                                        }}
                                                        placeholder="Nhập mã khách hàng..."
                                                        onFocus={() => {
                                                            if (maKhSearch.length > 0) {
                                                                setSearchStates(prev => ({ ...prev, showMainCustomerPopup: true }));
                                                            }
                                                        }}
                                                        className="h-8 text-sm w-full bg-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-3"></div>
                                        </div>

                                        {/* Địa chỉ & MST chung hàng */}
                                        <div className="grid grid-cols-12 gap-2 items-center">
                                            {/* Label Địa chỉ */}
                                            <Label className="text-xs col-span-1 flex items-center col-span-2">Địa chỉ</Label>
                                            <div className="col-span-10">
                                                {/* Input Địa chỉ */}
                                                <Input value={formData.dia_chi} className="h-8 text-sm bg-white" onChange={e => handleChange("dia_chi", e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="grid items-center gap-2 grid-cols-12">
                                            <Label className="text-xs min-w-[110px] col-span-2">Người giao hàng</Label>
                                            <div className="col-span-10">
                                                <Input value={formData.ong_ba} className="h-8 text-sm flex-1 col-span-6 bg-white" onChange={e => handleChange("ong_ba", e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="grid items-center gap-2 grid-cols-12">
                                            <Label className="text-xs min-w-[110px] col-span-2">Lý do nhập</Label>
                                            <div className="col-span-10">
                                                <Input
                                                    value={formData.dien_giai}
                                                    onChange={e => handleChange("dien_giai", e.target.value)}
                                                    className="h-8 text-sm flex-1 bg-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid items-center gap-2 grid-cols-12">
                                            <Label className="text-xs min-w-[110px] col-span-2">Mã nx (tk có)</Label>
                                            <div className="col-span-6">
                                                <Input
                                                    value={formData.ma_nx}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        handleChange("ma_nx", value);
                                                        // CHỈ hiển thị popup khi user thực sự nhập/thay đổi
                                                        if (value && value.trim().length > 0) {
                                                            setMaTaiKhoanSearch(value);
                                                            setSearchStates(prev => ({ ...prev, showMainAccountPopup: true }));
                                                        } else {
                                                            setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
                                                            setMaTaiKhoanSearch("");
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        // CHỈ hiển thị popup nếu có giá trị và user đang focus để tìm kiếm
                                                        if (formData.ma_nx && formData.ma_nx.length > 0) {
                                                            setMaTaiKhoanSearch(formData.ma_nx);
                                                            setSearchStates(prev => ({ ...prev, showMainAccountPopup: true }));
                                                        }
                                                    }}
                                                    onBlur={() => {
                                                        // Đóng popup sau delay ngắn để cho phép click chọn
                                                        setTimeout(() => {
                                                            setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
                                                        }, 200);
                                                    }}
                                                    placeholder="Nhập mã tài khoản..."
                                                    className="h-8 text-sm w-full bg-white"
                                                />
                                            </div>
                                            <div className="col-span-4 flex items-center justify-start pl-2">
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {selectedAccount ? selectedAccount.ten_tk : "Chưa chọn tài khoản"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right panel - Document info */}
                            <div className="dark:border-gray-600 rounded-lg flex flex-col lg:col-span-2">
                                <div className="p-3 flex-1 overflow-y-auto">
                                    <div className="space-y-2">
                                        <div className="grid gap-2 items-center grid-cols-12">
                                            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[120px] col-span-6">
                                                Ngày dh <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="col-span-5">
                                                <div className="flex-1">
                                                    <Flatpickr
                                                        value={formData.ngay_ky}
                                                        onChange={(date) => handleDateChange(date, "ngay_ky")}
                                                        options={FLATPICKR_OPTIONS}
                                                        placeholder="Chọn Ngày dh"
                                                        className="w-full h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-1"></div>
                                        </div>

                                        <div className="grid grid-cols-12 items-center gap-2">
                                            <Label className="text-xs col-span-6 text-left">Quyển số</Label>
                                            <div className="col-span-5">
                                                <Input
                                                    value={formData.so_ct}
                                                    onChange={e => handleChange("so_ct", e.target.value)}
                                                    className="h-8 text-sm bg-white"
                                                />
                                            </div>
                                            <div className="col-span-1"></div>
                                        </div>

                                        <div className="grid grid-cols-12 items-center gap-2">
                                            <Label className="text-xs col-span-6 text-left">Số đơn hàng</Label>
                                            <div className="col-span-5">
                                                <Input
                                                    value={formData.ma_hdm}
                                                    onChange={e => handleChange("ma_hdm", e.target.value)}
                                                    className="h-8 text-sm bg-white"
                                                />
                                            </div>
                                            <div className="col-span-1"></div>
                                        </div>

                                        <div className="grid grid-cols-12 items-center gap-2">
                                            <Label className="text-xs col-span-6 text-left">Số đơn hàng mẹ</Label>
                                            <div className="col-span-5">
                                                <Input
                                                    value={formData.ma_hdm_me}
                                                    onChange={e => handleChange("ma_hdm_me", e.target.value)}
                                                    className="h-8 text-sm bg-white"
                                                />
                                            </div>
                                            <div className="col-span-1"></div>
                                        </div>

                                        <div className="grid grid-cols-12 items-center gap-2">
                                            <Label className="text-xs col-span-4 text-left">TGGD</Label>
                                            <div className="col-span-2 flex items-center">
                                                <select
                                                    value={formData.ma_nt || "VND"}
                                                    onChange={e => handleChange("ma_nt", e.target.value)}
                                                    className="h-8 w-full rounded-lg border px-3 text-xs text-gray-700 dark:text-white bg-white dark:bg-gray-900 appearance-none"
                                                >
                                                    <option value="VND">VND</option>
                                                    <option value="USD">USD</option>
                                                </select>
                                            </div>
                                            <div className="col-span-5">
                                                <Input
                                                    value={formData.ty_gia}
                                                    onChange={e => handleChange("ty_gia", e.target.value)}
                                                    disabled
                                                    placeholder="1,00"
                                                    className="h-8 w-full text-sm text-right bg-gray-50 dark:bg-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-12 items-center gap-2">
                                            <Label className="text-xs col-span-6 text-left">Trạng thái</Label>
                                            <select
                                                value={formData.loai_ct}
                                                onChange={e => handleChange("loai_ct", e.target.value)}
                                                className="col-span-5 h-8 rounded-lg border px-3 text-xs"
                                            >
                                                <option value="Đã ghi sổ cái">Đã ghi sổ cái</option>
                                                <option value="Chưa ghi sổ cái">Chưa ghi sổ cái</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hang Hoa section */}
                    <div className="flex justify-between shadow-lg border-0 px-6">
                        <Tabs
                            tabs={[
                                {
                                    label: "Hàng hóa",
                                    content: (
                                        <div className="" ref={hangHoaTableRef}>
                                            <TableBasic
                                                data={hangHoaDataWithTotal}
                                                columns={hangHoaColumns}
                                                onDeleteRow={deleteHangHoaRow}
                                                showAddButton={true}
                                                addButtonText="Thêm dòng"
                                                onAddRow={(e) => {
                                                    if (e) {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }
                                                    addHangHoaRow(e);
                                                }}
                                                maxHeight="max-h-72"
                                                className="w-full"
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    label: "Chi phí",
                                    content: (
                                        <div className="">
                                            <TableBasic
                                                data={chiPhiDataWithTotal}
                                                columns={chiPhiColumns}
                                                onDeleteRow={deleteHangHoaRow} // Sử dụng cùng function để đồng bộ
                                                showAddButton={true} // Cho phép thêm từ tab Chi phí
                                                addButtonText="Thêm dòng"
                                                onAddRow={(e) => {
                                                    if (e) {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                    }
                                                    addHangHoaRow(e); // Sử dụng cùng function để đồng bộ
                                                }}
                                                maxHeight="max-h-72"
                                                className="w-full"
                                            />
                                        </div>
                                    ),
                                },
                            ]}
                            onAddRow={(activeTab) => {
                                // Cả hai tab đều sử dụng cùng function addHangHoaRow
                                addHangHoaRow();
                            }}
                        />
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 justify-end bg-gray-50 dark:bg-gray-800 flex-shrink-0 rounded-b-3xl">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 text-sm font-medium text-white dark:text-gray-700 bg-red-600 border border-gray-300 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                    >
                        <X size={16} />
                        Hủy bỏ
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isPending}
                        className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <Save size={16} />
                        {isPending ? "Đang lưu..." : "Lưu lại"}
                    </button>
                </div>
            </div>

            {/* Popups */}
            {searchStates.showAccountPopup && (
                <AccountSelectionPopup
                    isOpen={true}
                    onClose={() => setSearchStates(prev => ({ ...prev, showAccountPopup: false }))}
                    onSelect={(account) => handleAccountSelect(searchStates.tkSearchRowId, account)}
                    accounts={accountRawData.data || []}
                    searchValue={searchStates.tkSearch}
                />
            )}
            {searchStates.showAccountPopup2 && (
                <AccountSelectionPopup
                    isOpen={true}
                    onClose={() => setSearchStates(prev => ({
                        ...prev,
                        showAccountPopup2: false,
                        tkSearch2: "",
                        tkSearchField2: null,
                        tkSearchRowId2: null
                    }))}
                    onSelect={(account) => handleAccountSelect2(searchStates.tkSearchRowId2, account)}
                    accounts={accountRawData2.data || []}
                    searchValue={searchStates.tkSearch2}
                />
            )}

            {searchStates.showMainCustomerPopup && (
                <CustomerSelectionPopup
                    isOpen={true}
                    onClose={() => setSearchStates(prev => ({ ...prev, showMainCustomerPopup: false }))}
                    onSelect={(customer) => handleMainCustomerSelect(customer)}
                    customers={customerData.data || []}
                    searchValue={maKhSearch}
                />
            )}

            {/* DMVT Popup - ĐÃ SỬA */}
            {searchStates.showDmvtPopup && (
                <DmvtPopup
                    isOpen={true}
                    onClose={() => {
                        console.log('🔴 Closing DMVT popup');
                        setSearchStates(prev => ({
                            ...prev,
                            showDmvtPopup: false,
                            maVtSearch: "",
                            maVtSearchRowId: null
                        }));
                        setDmvtSearchTerm("");
                        setDmvtData({ data: [] });
                    }}
                    onSelect={handleDmvtSelect}
                    onSearch={handleDmvtSearch}
                    materials={dmvtData.data || []}
                    searchValue={dmvtSearchTerm}
                    loading={dmvtLoading}
                />
            )}

            {/* DMKHO Popup - THÊM MỚI */}
            {searchStates.showDmkhoPopup && (
                <DmkPopup
                    isOpen={true}
                    onClose={() => {
                        setSearchStates(prev => ({
                            ...prev,
                            showDmkhoPopup: false,
                            maKhoSearch: "",
                            maKhoSearchRowId: null
                        }));
                        setMaKhoSearch("");
                    }}
                    onSelect={handleDmkhoSelect}
                    onSearch={handleDmkhoSearch}
                    warehouses={dmkhoData.data || []}
                    searchValue={maKhoSearch}
                />
            )}
            {searchStates.showMainAccountPopup && (
                <AccountSelectionPopup
                    isOpen={true}
                    onClose={() => setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }))}
                    onSelect={(account) => handleMainAccountSelect(account)}
                    accounts={accountData.data || []}
                    searchValue={maTaiKhoanSearch}
                />
            )}
        </Modal>
    );
};