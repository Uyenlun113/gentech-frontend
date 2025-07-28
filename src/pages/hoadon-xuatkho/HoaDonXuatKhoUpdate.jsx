import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import "react-datepicker/dist/react-datepicker.css";
import { useUpdateHoaDonXuatKho } from "../../hooks/usehoadonxuatkho";
import { useCustomers } from "../../hooks/useCustomer";
import { useAccounts } from "../../hooks/useAccounts";
import { Plus, Trash2, X, Save, CalendarIcon } from "lucide-react";
import { Tabs } from "../../components/ui/tabs";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import AccountSelectionPopup from "../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../components/general/CustomerSelectionPopup";
import { useNavigate } from "react-router";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalenderIcon } from "../../icons";
import accountDirectoryApi from "../../services/account-directory";
import DmvtPopup from "../../components/general/dmvtPopup";
import DmkPopup from "../../components/general/dmkPopup";
import { useDmvt } from "../../hooks/useDmvt";
import { useDmkho } from "../../hooks/useDmkho";

export const ModalEditHoaDonXuatKho = ({ isOpenEdit, closeModalEdit, selectedHoaDonXuatKho }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    so_ct: "",
    ong_ba: "",
    ngay_lct: "",
    ngay_ct: "",
    ma_nx: "",
    ma_kh: "",
    dia_chi: "",
    dien_giai: "",
    ma_qs: "",
    loai_ct: "Đã ghi sổ cái",//status
    ma_so_thue: "",
    ma_nt: "VND",
    ty_gia: "1",
    ma_gd: "",
    ma_bp: "",
    so_seri: "",
    sl_in: "",
    ma_thue: "",
    thue_suat: "",
    tk_no: "",
    tk_co: "",
    ten_vtthue: "",
    gc_thue: "",
    ht_tt: "",
    t_so_luong: "",
    t_tien: "",
    t_thue: "",
    t_tt: "",
  });


  // State cho customer search
  const [maKhSearch, setMaKhSearch] = useState("");

  // State cho account dropdown (tài khoản nợ)
  const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [maVtSearch, setMaVtSearch] = useState("");
  const [maKho, setMaKho] = useState("");

  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});
  const { data: materialData = [] } = useDmvt(maVtSearch ? { search: maVtSearch } : {});
  const { data: dmkhoData = [] } = useDmkho(maKho ? { search: maKho } : {});

  const { mutateAsync: updateHoaDonXuatKho, isPending } = useUpdateHoaDonXuatKho();
  const hachToanTableRef = useRef(null);
  const hopDongThueTableRef = useRef(null); // Thêm ref cho bảng hợp đồng thuế

  const [searchStates, setSearchStates] = useState({
    tkSearch: "",
    tkSearchRowId: null,
    tkSearchField: null,
    maKhSearch: "",
    maKhSearchRowId: null,
    searchContext: null,
    showAccountPopup: false,
    showMainAccountPopup: false,
    showMainCustomerPopup: false,
    showCustomerPopup: false, // Thêm cho customer popup trong bảng

    maKhoSearch: "",
    maKhoSearchRowId: null,
    showDmkPopup: false,

    maVtSearch: "",
    maVtSearchRowId: null,
    showDmvtPopup: false,
  });

  const INITIAL_ACCOUNTING_DATA = [
    {
      id: 1,
      stt_rec: "1",
      ma_vt: "",
      ten_vt: "",
      dvt: "",
      ma_kho_i: "",
      so_luong: 0,
      gia2: 0,
      tien2: 0,
      gia: 0,
      tien: 0,
      tk_dt: "",
      tk_vt: "",
      tk_gv: "",
    },
  ];

  // Thêm INITIAL_TAX_CONTRACT_DATA
  const INITIAL_TAX_CONTRACT_DATA = [
    {
      id: 1,
      so_ct0: "",
      ma_ms: "",
      kh_mau_hd: "",
      so_seri0: "",
      ngay_ct: "",
      ma_kh: "",
      ten_kh: "",
      dia_chi: "",
      ma_so_thue: "",
      ten_vt: "",
      t_tien: 0,
      ma_thue: "",
      thue_suat: 0,
      t_tt: 0,
      t_thue: 0,
      tk_thue_no: "",
      tk_du: ""
    }
  ];

  const FLATPICKR_OPTIONS = {
    dateFormat: "Y-m-d",
    locale: Vietnamese,
  };

  const [hachToanData, setHachToanData] = useState(INITIAL_ACCOUNTING_DATA);
  const [hopDongThueData, setHopDongThueData] = useState(INITIAL_TAX_CONTRACT_DATA); // Thêm state cho hợp đồng thuế

  // Hook để lấy tên tài khoản cho từng dòng hạch toán
  const fetchAccountNames = useCallback(async (hachToanArray) => {
    const promises = hachToanArray.map(async (item) => {
      if (item.tk_vt && !item.ten_tk) {
        try {
          const accountData = await accountDirectoryApi.getAccount(item.tk_vt);
          return {
            ...item,
            ten_tk: accountData?.ten_tk || ""
          };
        } catch (error) {
          console.warn(`Cannot fetch account name for ${item.tk_vt}:`, error);
          return item;
        }
      }
      return item;
    });

    return Promise.all(promises);
  }, []);

  // Load data when selectedHoaDonXuatKho changes
  useEffect(() => {
    if (selectedHoaDonXuatKho && isOpenEdit) {
      setFormData({
        so_ct: selectedHoaDonXuatKho.so_ct || "",
        ong_ba: selectedHoaDonXuatKho.ong_ba || "",
        ngay_lct: selectedHoaDonXuatKho.ngay_lct ? new Date(selectedHoaDonXuatKho.ngay_lct).toLocaleDateString("en-CA") : "",
        ngay_ct: selectedHoaDonXuatKho.ngay_ct ? new Date(selectedHoaDonXuatKho.ngay_ct).toLocaleDateString("en-CA") : "",
        ma_nx: selectedHoaDonXuatKho.ma_nx || "",
        ma_kh: selectedHoaDonXuatKho.ma_kh || "",
        dia_chi: selectedHoaDonXuatKho.dia_chi || "",
        dien_giai: selectedHoaDonXuatKho.dien_giai || "",
        ma_qs: selectedHoaDonXuatKho.ma_qs || "",
        loai_ct: selectedHoaDonXuatKho.loai_ct || "Đã ghi sổ cái",
        ma_so_thue: selectedHoaDonXuatKho.ma_so_thue || "",
        ma_nt: selectedHoaDonXuatKho.ma_nt || "VND",
        ty_gia: selectedHoaDonXuatKho.ty_gia || "1",
        ma_gd: selectedHoaDonXuatKho.ma_gd || "",
        ma_bp: selectedHoaDonXuatKho.ma_bp || "",
        so_seri: selectedHoaDonXuatKho.so_seri || "",
        sl_in: selectedHoaDonXuatKho.sl_in || "",
        ma_thue: selectedHoaDonXuatKho.ma_thue || "",
        thue_suat: selectedHoaDonXuatKho.thue_suat || "",
        tk_no: selectedHoaDonXuatKho.tk_no || "",
        tk_co: selectedHoaDonXuatKho.tk_co || "",
        ten_vtthue: selectedHoaDonXuatKho.ten_vtthue || "",
        gc_thue: selectedHoaDonXuatKho.gc_thue || "",
        ht_tt: selectedHoaDonXuatKho.ht_tt || "",
        t_so_luong: selectedHoaDonXuatKho.t_so_luong || "",
        t_tien: selectedHoaDonXuatKho.t_tien || "",
        t_thue: selectedHoaDonXuatKho.t_thue || "",
        t_tt: selectedHoaDonXuatKho.t_tt || "",

        // ma_thue: "",
        // thue_suat: "",
        // tk_no:"",
        // tk_co:"",
        // ten_vtthue:"",
        // gc_thue:"",
        // ht_tt:"",
        // t_so_luong:"",
        // t_tien:"",
        // t_thue:"",
        // t_tt:"",
      });

      // Set search values for existing data
      setMaKhSearch(selectedHoaDonXuatKho.ma_kh || "");
      setMaTaiKhoanSearch(selectedHoaDonXuatKho.ma_nx || "");

      // Load hachToanList data
      if (selectedHoaDonXuatKho.hachToanList && selectedHoaDonXuatKho.hachToanList.length > 0) {
        const hachToanDataFromServer = selectedHoaDonXuatKho.hachToanList.map((item, index) => ({
          id: index + 1,
          stt_rec: (index + 1).toString(),
          ma_vt: item.ma_vt || "",
          ten_vt: item.ten_vt || "",
          dvt: item.dvt || "",
          ma_kho_i: item.ma_kho_i || "",
          so_luong: item.so_luong || 0,
          gia2: item.gia2 || 0,
          tien2: item.tien2 || 0,
          gia: item.gia || 0,
          tien: item.tien || 0,
          tk_dt: item.tk_dt || "",
          tk_vt: item.tk_vt || "",
          tk_gv: item.tk_gv || "",
        }));
        setHachToanData(hachToanDataFromServer);
      } else {
        setHachToanData(INITIAL_ACCOUNTING_DATA);
      }

      // Load hopDongThue data - THÊM MỚI
      if (selectedHoaDonXuatKho.hopDongThue && selectedHoaDonXuatKho.hopDongThue.length > 0) {
        const hopDongThueDataFromServer = selectedHoaDonXuatKho.hopDongThue.map((item, index) => ({
          id: index + 1,
          so_ct0: item.so_ct0 || "",
          ma_ms: item.ma_ms || "",
          kh_mau_hd: item.kh_mau_hd || "",
          so_seri0: item.so_seri0 || "",
          ngay_ct: item.ngay_ct || "",
          ma_kh: item.ma_kh.trim() || "",
          ten_kh: item.ten_kh.trim() || "",
          dia_chi: item.dia_chi || "",
          ma_so_thue: item.ma_so_thue || "",
          ten_vt: item.ten_vt || "",
          t_tien: item.t_tien || 0,
          ma_thue: item.ma_thue || "",
          thue_suat: item.thue_suat || 0,
          t_thue: item.t_thue || 0,
          tk_thue_no: item.tk_thue_no || "",
          tk_du: item.tk_du || "",
          t_tt: item.t_tt || 0,
        }));
        setHopDongThueData(hopDongThueDataFromServer);
      } else {
        setHopDongThueData(INITIAL_TAX_CONTRACT_DATA);
      }

      // Load account info for the main account if exists
      if (selectedHoaDonXuatKho.ma_nx && accountData.data) {
        const accountInfo = accountData.data.find(acc => acc.tk === selectedHoaDonXuatKho.ma_nx);
        if (accountInfo) {
          setSelectedAccount(accountInfo);
        }
      }
    } else if (!isOpenEdit) {
      resetForm();
    }
  }, [selectedHoaDonXuatKho, isOpenEdit, accountData.data, fetchAccountNames]);

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

  // Debounce customer search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maKhSearch && maKhSearch.length > 0) {
        // console.log('🔍 Searching for customer:', maKhSearch);
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
        // console.log('🔍 Searching for main account:', maTaiKhoanSearch);
      } else {
        setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maTaiKhoanSearch]);

  // Thêm handleHopDongThueChange
  const handleHopDongThueChange = useCallback((id, field, value) => {
    setHopDongThueData(prev =>
      prev.map(item => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [field]: value };

        // Tự động tính tiền thuế nếu thay đổi "thue_suat" hoặc "t_tien"
        const t_tien = parseFloat(field === "t_tien" ? value : item.t_tien) || 0;
        const thue_suat = parseFloat(field === "thue_suat" ? value : item.thue_suat) || 0;

        if (field === "t_tien" || field === "thue_suat") {
          updatedItem.t_thue = (t_tien * thue_suat) / 100;
        }

        return updatedItem;
      })
    );
    if (field === "ma_kh") {
      setSearchStates(prev => ({
        ...prev,
        maKhSearch: value,
        maKhSearchRowId: id,
        searchContext: "hopDongThue"
      }));
    }

    if (field === "tk_thue_no" || field === "tk_du") {
      setSearchStates(prev => ({
        ...prev,
        tkSearch: value,
        tkSearchRowId: id,
        tkSearchField: field,
        searchContext: "hopDongThue"
      }));
    }
  }, []);

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
    if (field === 'ma_nx') {
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
    if (!formData.ngay_ct) {
      console.error("Vui lòng nhập ngày hạch toán");
      return false;
    }
    if (!formData.ngay_lct) {
      console.error("Vui lòng nhập ngày lập chứng từ");
      return false;
    }
    if (!formData.so_ct) {
      console.error("Vui lòng nhập số chứng từ");
      return false;
    }
    if (!selectedHoaDonXuatKho) {
      console.error("Không có dữ liệu phiếu thu để cập nhật");
      return false;
    }

    const validAccountingRows = hachToanData.filter(row =>
      row.tk_vt && (parseFloat(row.tien) > 0)
    );
    if (validAccountingRows.length === 0) {
      console.error("Vui lòng nhập ít nhất một dòng hạch toán hợp lệ");
      return false;
    }

    return true;
  }, [formData, hachToanData, selectedHoaDonXuatKho]);

  // Handle customer selection
  const handleMainCustomerSelect = (customer) => {
    if (!customer) {
      console.error('Customer object is null or undefined');
      return;
    }

    // console.log('Selected customer:', customer);

    setFormData(prev => ({
      ...prev,
      ma_so_thue: customer.ma_so_thue || "",
      ma_kh: customer.ma_kh.trim() || "",
      ong_ba: customer.ten_kh.trim() || "",
      dia_chi: customer.dia_chi || ""
    }));

    setMaKhSearch(customer.ma_kh || "");

    setSearchStates(prev => ({
      ...prev,
      showMainCustomerPopup: false
    }));
  };

  // Handle account selection
  const handleMainAccountSelect = (account) => {
    setFormData(prev => ({
      ...prev,
      ma_nx: account.ma_nx.trim()
    }));
    setSelectedAccount(account);
    setMaTaiKhoanSearch(account.ma_nx.trim());
    setSearchStates(prev => ({
      ...prev,
      showMainAccountPopup: false
    }));
  };

  // Handle account selection for table - CẬP NHẬT để hỗ trợ cả hachToan và hopDongThue
  const handleAccountSelect = useCallback((id, account) => {
    // Kiểm tra context để xác định cần cập nhật bảng nào
    if (searchStates.searchContext === "hopDongThue") {
      // Xử lý cho bảng hợp đồng thuế
      const fieldToUpdate = searchStates.tkSearchField || "tk_thue_no";
      setHopDongThueData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, [fieldToUpdate]: account.tk.trim() }
            : item
        )
      );
    } else {
      // Xử lý cho bảng hạch toán (logic cũ)
      setHachToanData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, tk_vt: account.tk.trim(), ten_tk: account.ten_tk }
            : item
        )
      );
    }

    // Reset search states
    setSearchStates(prev => ({
      ...prev,
      showAccountPopup: false,
      tkSearch: "",
      tkSearchField: null,
      searchContext: null
    }));
  }, [searchStates.searchContext, searchStates.tkSearchField]);

  // Thêm handleCustomerSelect
  const handleCustomerSelect = useCallback((id, customer) => {
    if (searchStates.searchContext === "hachToan") {
      setHachToanData(prev =>
        prev.map((item, index) => {
          if (item.id === id) {
            return { ...item, ma_kh_i: customer.ma_kh.trim() || "", ten_kh: customer.ten_kh.trim() || "" };
          }
          if (id === 1 && index > 0) {
            return { ...item, ma_kh_i: customer.ma_kh.trim() || "", ten_kh: customer.ten_kh.trim() || "" };
          }
          return item;
        })
      );
    } else {
      setHopDongThueData(prev => {
        const newData = prev.map(item =>
          item.id === id
            ? {
              ...item,
              ma_kh: customer.ma_kh || "",
              ten_kh: customer.ten_kh || "",
              dia_chi: customer.dia_chi || "",
              ma_so_thue: customer.ma_so_thue || ""
            }
            : item
        );
        return newData;
      });
    }

    setSearchStates(prev => ({
      ...prev,
      showCustomerPopup: false,
      maKhSearch: "",
      searchContext: null
    }));
  }, [searchStates.searchContext]);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === "dienGiaiChung") {
      setHachToanData(prevHachToan =>
        prevHachToan.map(item => ({
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
    const totalPsCo = hachToanData.reduce((sum, item) => {
      const value = parseFloat(item.tien) || 0;
      return sum + value;
    }, 0);

    return { totalPsCo };
  }, [hachToanData]);

  const { data: accountRawData = {} } = useAccounts(
    searchStates.tkSearch ? { search: searchStates.tkSearch } : {}
  );

  const handleClose = () => {
    resetForm();
    closeModalEdit();
  };

  const addHachToanRow = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setHachToanData(prev => {
      const newRowId = prev.length + 1;

      const newRow = {
        id: newRowId,
        stt_rec: newRowId.toString(),
        tk_vt: "",
        tien: 0,
        dien_giaii: "",
      };

      return [...prev, newRow];
    });

    setTimeout(() => {
      if (hachToanTableRef.current) {
        const tableContainer = hachToanTableRef.current.querySelector('.overflow-x-auto');
        if (tableContainer) {
          tableContainer.scrollTop = tableContainer.scrollHeight;
        }
      }
    }, 100);
  }, []);

  // Thêm addHopDongThueRow
  const addHopDongThueRow = useCallback(() => {
    setHopDongThueData(prev => [
      ...prev,
      {
        id: prev.length + 1,
        so_ct0: "",
        ma_ms: "",
        kh_mau_hd: "",
        so_seri0: "",
        ngay_ct: "",
        ma_kh: "",
        ten_kh: "",
        dia_chi: "",
        ma_so_thue: "",
        ten_vt: "",
        t_tien: 0,
        ma_thue: "",
        thue_suat: 0,
        t_thue: 0,
        tk_thue_no: "",
        tk_du: "",
        t_tt: 0,
      }
    ]);

    setTimeout(() => {
      if (hopDongThueTableRef.current) {
        const tableContainer = hopDongThueTableRef.current.querySelector('.overflow-x-auto');
        if (tableContainer) {
          tableContainer.scrollTop = tableContainer.scrollHeight;
        }
      }
    }, 100);
  }, []);

  const hachToanDataWithTotal = useMemo(() => {
    const totalTien = hachToanData.reduce((sum, item) => {
      const value = parseFloat(item.tien) || 0;
      return sum + value;
    }, 0);
    const totalSoLuong = hachToanData.reduce((sum, item) => {
      const value = parseFloat(item.so_luong) || 0;
      return sum + value;
    }, 0);

    return [
      ...hachToanData,
      {
        id: 'total',
        stt_rec: 'Tổng',
        ma_vt: "",
        ten_vt: "",
        dvt: "",
        ma_kho_i: "",
        so_luong: totalSoLuong,
        gia2: 0,
        tien2: 0,
        gia: 0,
        tien: totalTien,
        tk_dt: "",
        tk_vt: "",
        tk_gv: "",
      }
    ];
  }, [hachToanData]);

  // Table columns
  const hachToanColumns = [
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
      width: 120,
      fixed: "left",
      render: (val, row) => {
        if (row.id === 'total') {
          return <div className="font-bold text-gray-900"></div>;
        }
        return (
          <Input
            value={row.ma_vt}
            onChange={(e) => handleHachToanChange(row.id, "ma_vt", e.target.value)}
            placeholder="Mã VT..."
            className="w-full"
            onFocus={() => {
              setMaVtSearch(row.ma_vt);
              if (row.ma_vt.length > 0) {
                setSearchStates(prev => ({
                  ...prev,
                  showDmvtPopup: true,
                  maVtSearch: row.ma_vt,
                  maVtSearchRowId: row.id
                }));
              }
            }}
          />
        );
      },
    },
    {
      key: "ten_vt",
      title: "Tên vật tư",
      width: 180,
      render: (val, row) => (
        <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'} text-sm`}>
          {row.ten_vt}
        </div>
      )
    },
    {
      key: "dvt",
      title: "ĐVT",
      width: 80,
      render: (val, row) => (
        <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'} text-sm text-center`}>
          {row.dvt}
        </div>
      )
    },
    {
      key: "ma_kho_i",
      title: "Mã kho",
      width: 100,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.ma_kho_i}
            onChange={(e) => handleHachToanChange(row.id, "ma_kho_i", e.target.value)}
            placeholder="Mã kho..."
            className="w-full"
            onFocus={() => {
              setMaKho(row.ma_kho_i);
              setSearchStates(prev => ({
                ...prev,
                showDmkPopup: true,
                maKhoSearch: row.ma_kho_i,
                maKhoSearchRowId: row.id
              }));
            }}
          />
        );
      },
    },
    {
      key: "so_luong",
      title: "Số lượng",
      width: 100,
      render: (val, row) => (
        <Input
          value={row.so_luong}
          onChange={(e) => handleHachToanChange(row.id, "so_luong", e.target.value)}
          placeholder="0"
          className="w-full text-right"
          type="number"
        />
      ),
    },
    {
      key: "gia",
      title: "Đơn giá",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.gia}
            onChange={(e) => handleHachToanChange(row.id, "gia", e.target.value)}
            placeholder="0"
            className="w-full text-right"
            type="number"
          />
        );
      },
    },
    {
      key: "tien",
      title: "Thành tiền",
      width: 120,
      render: (val, row) => (
        <Input
          value={row.tien}
          onChange={(e) => handleHachToanChange(row.id, "tien", e.target.value)}
          placeholder="0"
          className="w-full text-right"
          type="number"
        />
      ),
    },
    {
      key: "tk_dt",
      title: "TK doanh thu",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.tk_dt}
            onChange={(e) => handleHachToanChange(row.id, "tk_dt", e.target.value)}
            placeholder="TK DT..."
            className="w-full"
          />
        );
      },
    },
    {
      key: "tk_vt",
      title: "TK vật tư",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.tk_vt}
            onChange={(e) => handleHachToanChange(row.id, "tk_vt", e.target.value)}
            placeholder="TK VT..."
            className="w-full"
          />
        );
      },
    },
    {
      key: "tk_gv",
      title: "TK giá vốn",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.tk_gv}
            onChange={(e) => handleHachToanChange(row.id, "tk_gv", e.target.value)}
            placeholder="TK GV..."
            className="w-full"
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
                deleteHachToanRow(row.id, e);
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
  const handleWarehouseSelect = useCallback((id, warehouse) => {
    setHachToanData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ma_kho_i: warehouse.ma_kho?.trim() || "" }
          : item
      )
    );
    setSearchStates(prev => ({
      ...prev,
      showDmkPopup: false,
      maKhoSearch: "",
      maKhoSearchRowId: null
    }));
  }, []);

  const deleteHachToanRow = useCallback((id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setHachToanData(prev => prev.filter(item => item.id !== id));
  }, []);

  // Thêm deleteHopDongThueRow
  const deleteHopDongThueRow = useCallback((id) => {
    setHopDongThueData(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleHachToanChange = useCallback((id, field, value) => {
    setHachToanData(prev => {
      const newData = prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      return newData;
    });
    // Search logic
    if (field === "ma_vt") {
      setMaVtSearch(value);
      setSearchStates(prev => ({
        ...prev,
        maVtSearch: value,
        maVtSearchRowId: id,
        showDmvtPopup: value.length > 0
      }));
    }

    // Search logic for warehouse code
    if (field === "ma_kho_i") {
      setMaKho(value);
      setSearchStates(prev => ({
        ...prev,
        maKhoSearch: value,
        maKhoSearchRowId: id,
        showDmkPopup: value.length > 0
      }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      so_ct: "",
      ong_ba: "",
      ngay_lct: "",
      ngay_ct: "",
      ma_nx: "",
      ma_kh: "",
      dia_chi: "",
      dien_giai: "",
      ma_qs: "",
      loai_ct: "Đã ghi sổ cái",
      ma_so_thue: "",
      ma_nt: "VND",
      ty_gia: "1",
    });
    setHachToanData(INITIAL_ACCOUNTING_DATA);
    setHopDongThueData(INITIAL_TAX_CONTRACT_DATA); // Reset hợp đồng thuế
    setSelectedAccount(null);
    setMaTaiKhoanSearch("");
    setMaKhSearch("");
    setMaVtSearch("");
    setMaKho("");
    setSearchStates({
      tkSearch: "",
      tkSearchRowId: null,
      tkSearchField: null,
      maKhSearch: "",
      maKhSearchRowId: null,
      searchContext: null,
      showAccountPopup: false,
      showMainAccountPopup: false,
      showMainCustomerPopup: false,
      showCustomerPopup: false,
    });
  }, []);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const payload = {
        // ...các trường chung...
        hachToanList: hachToanData
          .filter(row => row.ma_vt && parseFloat(row.so_luong) > 0)
          .map(({ ma_vt, ma_kho_i, so_luong, gia2, tien2, gia, tien, tk_dt, tk_vt, tk_gv }) => ({
            ma_vt: ma_vt?.trim() || "",
            ma_kho_i: ma_kho_i?.trim() || "",
            so_luong: Number(so_luong) || 0,
            gia2: Number(gia2) || 0,
            tien2: Number(tien2) || 0,
            gia: Number(gia) || 0,
            tien: Number(tien) || 0,
            tk_dt: tk_dt?.trim() || "",
            tk_vt: tk_vt?.trim() || "",
            tk_gv: tk_gv?.trim() || "",
          })),
      };
      await updateHoaDonXuatKho({
        stt_rec: selectedHoaDonXuatKho.stt_rec,
        data: payload
      });
      closeModalEdit();
      resetForm();
      navigate("/chung-tu/hoa-don-ban-hang");
    } catch (err) {
      console.error(err);
    }
  }, [formData, hachToanData, updateHoaDonXuatKho, closeModalEdit, resetForm, navigate, validateForm, selectedHoaDonXuatKho]);
  const handleMaterialSelect = useCallback((id, material) => {
    setHachToanData(prev =>
      prev.map(item =>
        item.id === id
          ? {
            ...item,
            ma_vt: material.ma_vt?.trim() || "",
            ten_vt: material.ten_vt?.trim() || "",
            dvt: material.dvt?.trim() || ""
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
  }, []);
  return (
    <Modal isOpen={isOpenEdit} onClose={handleClose} title="Cập nhật phiếu thu" className="w-full max-w-7xl m-1 border-2">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-shrink-0 px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Cập nhật Hóa đơn bán hàng kiêm phiếu xuất kho
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Cập nhật thông tin Hóa đơn bán hàng kiêm phiếu xuất kho trong hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-h-0 overflow-auto bg-blue-50">
          {/* Form fields section */}
          <div className="h-[45%] px-6 py-4 flex-shrink-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              {/* Left panel - General info */}
              <div className="dark:border-gray-600 rounded-lg flex flex-col lg:col-span-3">
                <div className="p-3 flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Loại giao dịch</Label>
                      <div className="col-span-6">
                        <div className="relative flex-1">
                          <Input value={formData.ma_gd} className="h-8 text-sm flex-1 col-span-6 bg-white" onChange={e => handleChange("ma_gd", e.target.value)} />
                        </div>
                      </div>
                      <div className="col-span-3"></div>
                    </div>

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

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <Label className="text-xs col-span-1 flex items-center col-span-2">Địa chỉ</Label>
                      <div className="col-span-6">
                        <Input value={formData.dia_chi} className="h-8 text-sm bg-white" onChange={e => handleChange("dia_chi", e.target.value)} />
                      </div>
                      <Label className="text-xs col-span-1 flex items-center justify-end col-span-1">MST</Label>
                      <div className="col-span-3">
                        <Input value={formData.ma_so_thue} className="h-8 text-sm bg-white" onChange={e => handleChange("ma_so_thue", e.target.value)} />
                      </div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Người nhận</Label>
                      <div className="col-span-6">
                        <Input value={formData.ong_ba} className="h-8 text-sm flex-1 col-span-6 bg-white" onChange={e => handleChange("ong_ba", e.target.value)} />
                      </div>
                      <div className="col-span-3"></div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Diễn giải</Label>
                      <div className="col-span-10">
                        <Input
                          value={formData.dien_giai}
                          onChange={e => handleChange("dien_giai", e.target.value)}
                          className="h-8 text-sm flex-1 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-2">Mã NX</Label>
                      <div className="relative col-span-6">
                        <Input
                          value={maTaiKhoanSearch}
                          onChange={e => {
                            const value = e.target.value;
                            setMaTaiKhoanSearch(value);
                            handleChange("ma_nx", value);
                            if (value.length > 0) {
                              setSearchStates(prev => ({ ...prev, showMainAccountPopup: true }));
                            } else {
                              setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
                            }
                          }}
                          placeholder="Nhập mã tài khoản..."
                          onFocus={() => {
                            if (maTaiKhoanSearch.length > 0) {
                              setSearchStates(prev => ({ ...prev, showMainAccountPopup: true }));
                            }
                          }}
                          className="h-8 text-sm w-full bg-white"
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {selectedAccount ? selectedAccount.ten_tk : "Chưa chọn tài khoản"}
                        </span>
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Mã bộ phận</Label>
                      <div className="col-span-6">
                        <Input value={formData.ma_bp} className="h-8 text-sm flex-1 col-span-6 bg-white" onChange={e => handleChange("ma_bp", e.target.value)} />
                      </div>
                      <div className="col-span-3"></div>
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
                        Ngày hạch toán <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-5">
                        <div className="flex-1">
                          <Flatpickr
                            value={formData.ngay_ct}
                            onChange={(date) => handleDateChange(date, "ngay_ct")}
                            options={FLATPICKR_OPTIONS}
                            placeholder="Chọn ngày hạch toán"
                            className="w-full h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid gap-2 items-center grid-cols-12">
                      <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[120px] col-span-6">
                        Ngày lập chứng từ <span className="text-red-500">*</span>
                      </Label>
                      <div className="col-span-5">
                        <div className="relative flex-1">
                          <Flatpickr
                            value={formData.ngay_lct}
                            onChange={(date) => handleDateChange(date, "ngay_lct")}
                            options={FLATPICKR_OPTIONS}
                            placeholder="Chọn ngày lập chứng từ"
                            className="w-full h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                          <CalenderIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Quyển số</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.ma_qs}
                          onChange={e => handleChange("ma_qs", e.target.value)}
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Số seri</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.so_seri}
                          onChange={e => handleChange("so_seri", e.target.value)}
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Số chứng từ</Label>
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
                      <Label className="text-xs col-span-4 text-left">Tiền tệ</Label>
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
                      <Label className="text-xs col-span-6 text-left">Số lần in</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.sl_in}
                          onChange={e => handleChange("sl_in", e.target.value)}
                          type="number"
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accounting section */}
          <div className="flex justify-between shadow-lg border-0 px-6">
            <Tabs
              tabs={[
                {
                  label: "Hạch toán",
                  content: (
                    <div className="" ref={hachToanTableRef}>
                      <TableBasic
                        data={hachToanDataWithTotal}
                        columns={hachToanColumns}
                        onDeleteRow={deleteHachToanRow}
                        showAddButton={true}
                        addButtonText="Thêm dòng vật tư"
                        onAddRow={(e) => {
                          if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                          addHachToanRow(e);
                        }}
                        maxHeight="max-h-72"
                        className="w-full"
                      />
                    </div>
                  ),
                },
              ]}
              onAddRow={(activeTab) => {
                if (activeTab === 0) {
                  addHachToanRow();
                }
              }}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 justify-end bg-gray-50 dark:bg-gray-800 flex-shrink-0 rounded-b-3xl">
          <div className="flex-1 min-h-0 flex flex-col bg-blue-50">
            {/* Form fields section */}
            <div className="h-[20%] px-6 py-4 flex-shrink-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                {/* Cột 1 */}
                <div className="dark:border-gray-600 rounded-lg flex flex-col">
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs min-w-[110px] col-span-4">Mã thuế</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.ma_thue}
                        className="h-6 text-sm bg-white"
                        onChange={e => handleChange("ma_thue", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Thuế suất (%)</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.thue_suat}
                        className="h-6 text-sm bg-white"
                        onChange={e => handleChange("thue_suat", e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">TK thuế</Label>
                    <div className="col-span-4">
                      <Input
                        value={formData.tk_no}
                        className="h-6 text-sm bg-white"
                        onChange={e => handleChange("tk_no", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        value={formData.tk_co}
                        className="h-6 text-sm bg-white"
                        onChange={e => handleChange("tk_co", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Cột 2 */}
                <div className="dark:border-gray-600 rounded-lg flex flex-col">

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Nhóm hàng</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.ten_vtthue}
                        onChange={e => handleChange("ten_vtthue", e.target.value)}
                        className="h-6 text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Ghi chú thuế</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.gc_thue}
                        onChange={e => handleChange("gc_thue", e.target.value)}
                        className="h-6 text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Hình thức TT</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.ht_tt}
                        onChange={e => handleChange("ht_tt", e.target.value)}
                        className="h-6 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Cột 3: để trống cho các field khác sau này */}
                <div className="dark:border-gray-600 rounded-lg flex flex-col">
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Số lượng</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.t_so_luong}
                        disabled
                        className="h-6 text-sm bg-gray-100 text-right"
                      />
                    </div>
                  </div>
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">C.tiền hàng</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.t_tien}
                        disabled
                        className="h-6 text-sm bg-gray-100 text-right"
                      />
                    </div>
                  </div>
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Tt.GTGT</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.t_thue}
                        disabled
                        className="h-6 text-sm bg-gray-100 text-right"
                      />
                    </div>
                  </div>
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Tổng tiền tt</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.t_tt}
                        disabled
                        className="h-6 text-sm bg-gray-100 text-right"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
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
            disabled
            className="px-6 py-2.5 text-sm font-medium text-white 
             bg-blue-400 opacity-50 cursor-not-allowed
             border border-transparent rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
             transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Cập nhật
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

      {searchStates.showMainAccountPopup && (
        <AccountSelectionPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }))}
          onSelect={(account) => handleMainAccountSelect(account)}
          accounts={accountData.data || []}
          searchValue={maTaiKhoanSearch}
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

      {searchStates.showCustomerPopup && (
        <CustomerSelectionPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showCustomerPopup: false }))}
          onSelect={(customer) => handleCustomerSelect(searchStates.maKhSearchRowId, customer)}
          customers={customerData.data || []}
          searchValue={searchStates.maKhSearch}
        />
      )}
      {searchStates.showDmkPopup && (
        <DmkPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showDmkPopup: false }))}
          onSelect={(warehouse) => handleWarehouseSelect(searchStates.maKhoSearchRowId, warehouse)}
          warehouses={dmkhoData.data || []}
          searchValue={searchStates.maKhoSearch}
        />
      )}
      {searchStates.showDmvtPopup && (
        <DmvtPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showDmvtPopup: false }))}
          onSelect={(material) => handleMaterialSelect(searchStates.maVtSearchRowId, material)}
          materials={materialData.data || []}
          searchValue={searchStates.maVtSearch}
        />
      )}
    </Modal>
  );
};