import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import "react-datepicker/dist/react-datepicker.css";
import { useUpdateGiayBaoNo } from "../../hooks/usegiaybaono";
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

export const ModalEditGiayBaoNo = ({ isOpenEdit, closeModalEdit, selectedGiayBaoNo }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    so_ct: "",
    ong_ba: "",
    ngay_lct: "",
    ngay_ct: "",
    tk: "",
    ma_gd: "",
    ma_kh: "",
    dia_chi: "",
    dien_giai: "",
    ma_qs: "",
    loai_ct: "Đã ghi sổ cái",
    mst: "",
    ma_nt: "VND",
    ty_gia: "1",
  });

  // State cho customer search
  const [maKhSearch, setMaKhSearch] = useState("");

  // State cho account dropdown (tài khoản nợ)
  const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});

  const { mutateAsync: updateGiayBaoNo, isPending } = useUpdateGiayBaoNo();
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
  });

  const INITIAL_ACCOUNTING_DATA = [
    {
      id: 1,
      stt_rec: "1",
      tk_i: "",
      tk_me: "",
      ten_tk: "",
      ps_co: "",
      dien_giai: ""
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
      if (item.tk_i && !item.ten_tk) {
        try {
          const accountData = await accountDirectoryApi.getAccount(item.tk_i);
          return {
            ...item,
            ten_tk: accountData?.ten_tk || ""
          };
        } catch (error) {
          console.warn(`Cannot fetch account name for ${item.tk_i}:`, error);
          return item;
        }
      }
      return item;
    });

    return Promise.all(promises);
  }, []);

  // Load data when selectedGiayBaoNo changes
  useEffect(() => {
    if (selectedGiayBaoNo && isOpenEdit) {
      setFormData({
        so_ct: selectedGiayBaoNo.so_ct || "",
        ong_ba: selectedGiayBaoNo.ong_ba || "",
        ngay_lct: selectedGiayBaoNo.ngay_lct ? new Date(selectedGiayBaoNo.ngay_lct).toLocaleDateString("en-CA") : "",
        ngay_ct: selectedGiayBaoNo.ngay_ct ? new Date(selectedGiayBaoNo.ngay_ct).toLocaleDateString("en-CA") : "",
        tk: selectedGiayBaoNo.tk || "",
        ma_gd: selectedGiayBaoNo.ma_gd || "",
        ma_kh: selectedGiayBaoNo.ma_kh || "",
        dia_chi: selectedGiayBaoNo.dia_chi || "",
        dien_giai: selectedGiayBaoNo.dien_giai || "",
        ma_qs: selectedGiayBaoNo.ma_qs || "",
        loai_ct: selectedGiayBaoNo.loai_ct || "Đã ghi sổ cái",
        mst: selectedGiayBaoNo.mst || "",
        ma_nt: selectedGiayBaoNo.ma_nt || "VND",
        ty_gia: selectedGiayBaoNo.ty_gia || "1",
      });

      // Set search values for existing data
      setMaKhSearch(selectedGiayBaoNo.ma_kh || "");
      setMaTaiKhoanSearch(selectedGiayBaoNo.tk || "");

      // Load tai_khoan_list data
      if (selectedGiayBaoNo.tai_khoan_list && selectedGiayBaoNo.tai_khoan_list.length > 0) {
        const hachToanDataFromServer = selectedGiayBaoNo.tai_khoan_list.map((item, index) => ({
          id: index + 1,
          stt_rec: (index + 1).toString(),
          tk_i: item.tk_i || item.tk_so || "",
          tk_me: item.tk_me || "",
          ten_tk: item.ten_tk || "",
          ps_co: item.ps_co || "",
          dien_giai: item.dien_giai || ""
        }));
        setHachToanData(hachToanDataFromServer);
        fetchAccountNames(hachToanDataFromServer).then(updatedRows => {
          setHachToanData(updatedRows);
        });
      } else {
        setHachToanData(INITIAL_ACCOUNTING_DATA);
      }

      // Load hopDongThue data - THÊM MỚI
      if (selectedGiayBaoNo.hopDongThue && selectedGiayBaoNo.hopDongThue.length > 0) {
        const hopDongThueDataFromServer = selectedGiayBaoNo.hopDongThue.map((item, index) => ({
          id: index + 1,
          so_ct0: item.so_ct0 || "",
          ma_ms: item.ma_ms || "",
          kh_mau_hd: item.kh_mau_hd || "",
          so_seri0: item.so_seri0 || "",
          ngay_ct: item.ngay_ct || "",
          ma_kh: item.ma_kh || "",
          ten_kh: item.ten_kh || "",
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
      if (selectedGiayBaoNo.tk && accountData.data) {
        const accountInfo = accountData.data.find(acc => acc.tk === selectedGiayBaoNo.tk);
        if (accountInfo) {
          setSelectedAccount(accountInfo);
        }
      }
    } else if (!isOpenEdit) {
      resetForm();
    }
  }, [selectedGiayBaoNo, isOpenEdit, accountData.data, fetchAccountNames]);

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

  // Thêm handleHopDongThueChange
  const handleHopDongThueChange = useCallback((id, field, value) => {
    setHopDongThueData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
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
    if (!selectedGiayBaoNo) {
      console.error("Không có dữ liệu phiếu thu để cập nhật");
      return false;
    }

    const validAccountingRows = hachToanData.filter(row =>
      row.tk_i && (parseFloat(row.ps_co) > 0)
    );
    if (validAccountingRows.length === 0) {
      console.error("Vui lòng nhập ít nhất một dòng hạch toán hợp lệ");
      return false;
    }

    return true;
  }, [formData, hachToanData, selectedGiayBaoNo]);

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

  // Handle account selection
  const handleMainAccountSelect = (account) => {
    setFormData(prev => ({
      ...prev,
      tk: account.tk.trim()
    }));
    setSelectedAccount(account);
    setMaTaiKhoanSearch(account.tk.trim());
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
            ? { ...item, tk_i: account.tk.trim(), ten_tk: account.ten_tk, tk_me: account.tk_me.trim() }
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
            return { ...item, ma_kh_i: customer.ma_kh || "", ten_kh: customer.ten_kh || "" };
          }
          if (id === 1 && index > 0) {
            return { ...item, ma_kh_i: customer.ma_kh || "", ten_kh: customer.ten_kh || "" };
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
      const value = parseFloat(item.ps_co) || 0;
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
        tk_i: "",
        tk_me: "",
        ten_tk: "",
        ps_co: "",
        dien_giai: "",
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
    return [
      ...hachToanData,
      {
        id: 'total',
        stt_rec: 'Tổng',
        tk_i: '',
        ten_tk: '',
        ma_kh: '',
        ten_kh: '',
        ps_co: totals.totalPsCo,
        nh_dk: '',
        dien_giai: ''
      }
    ];
  }, [hachToanData, totals]);

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
      key: "tk_i",
      title: "Tài khoản",
      width: 150,
      fixed: "left",
      render: (val, row) => {
        if (row.id === 'total') {
          return <div className="font-bold text-gray-900"></div>;
        }
        return (
          <Input
            value={row.tk_i}
            onChange={(e) => handleHachToanChange(row.id, "tk_i", e.target.value)}
            placeholder="Nhập mã TK..."
            className="w-full"
          />
        );
      },
    },
    {
      key: "ten_tk",
      title: "Tên tài khoản",
      width: 200,
      render: (val, row) => (
        <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
          {row.ten_tk}
        </div>
      )
    },
    {
      key: "ps_co",
      title: "PS Có",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') {
          return (
            <div className="text-right text-[16px] text-green-600 p-2 rounded px-7">
              {totals.totalPsCo.toLocaleString('vi-VN')}
            </div>
          );
        }
        return (
          <Input
            type="number"
            value={row.ps_co}
            onChange={(e) => handleHachToanChange(row.id, "ps_co", e.target.value)}
            placeholder="0"
            className="w-full text-right"
          />
        );
      },
    },
    {
      key: "dien_giai",
      title: "Diễn giải",
      width: 200,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.dien_giai}
            onChange={(e) => handleHachToanChange(row.id, "dien_giai", e.target.value)}
            placeholder="Nhập diễn giải..."
            className="w-full"
            title="Mỗi dòng có thể có diễn giải riêng"
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

  // Thêm hopDongThueColumns - COPY từ ModalCreateGiayBaoNo
  const hopDongThueColumns = [
    {
      key: "stt",
      fixed: "left",
      title: "STT",
      width: 80,
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
      width: 150,
      render: (val, row) => (
        <Input
          value={row.so_ct0}
          onChange={(e) => handleHopDongThueChange(row.id, "so_ct0", e.target.value)}
          placeholder="Nhập nhóm..."
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
          onChange={(e) => handleHopDongThueChange(row.id, "ma_ms", e.target.value)}
          placeholder="Nhập số hóa đơn..."
          className="w-full"
        />
      ),
    },
    {
      key: "kh_mau_hd",
      title: "Mẫu hóa đơn",
      width: 150,
      render: (val, row) => (
        <Input
          value={row.kh_mau_hd}
          onChange={(e) => handleHopDongThueChange(row.id, "kh_mau_hd", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "so_seri0", e.target.value)}
          placeholder="Nhập số seri..."
          className="w-full"
        />
      ),
    },
    {
      key: "ngay_ct",
      title: "Ngày hóa đơn",
      width: 150,
      render: (val, row) => (
        <div className="relative">
          <Flatpickr
            value={row.ngay_ct ? row.ngay_ct.split("T")[0] : ""}
            onChange={(date) =>
              handleHopDongThueChange(row.id, "ngay_ct", date?.[0]?.toISOString() || "")
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
          onChange={(e) => handleHopDongThueChange(row.id, "ma_kh", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "ten_kh", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "dia_chi", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "ma_so_thue", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "ten_vt", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "t_tien", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "ma_thue", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "thue_suat", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "t_thue", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "t_tt", e.target.value)}
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
          onChange={(e) => handleHopDongThueChange(row.id, "tk_thue_no", e.target.value)}
          placeholder="Nhập TK thuế..."
          className="w-full"
        />
      ),
    },
    {
      key: "tk_du",
      title: "Tài khoản đối ứng",
      width: 150,
      render: (val, row) => (
        <Input
          value={row.tk_du}
          onChange={(e) => handleHopDongThueChange(row.id, "tk_du", e.target.value)}
          placeholder="Nhập TK đối ứng..."
          className="w-full"
        />
      ),
    },
    {
      key: "action",
      title: "Hành động",
      fixed: "right",
      width: 100,
      render: (_, row) => (
        <div className="flex items-center justify-center">
          <button
            onClick={() => deleteHopDongThueRow(row.id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa dòng"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

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
    if (field === "tk_i") {
      setSearchStates(prev => ({
        ...prev,
        tkSearch: value,
        tkSearchRowId: id,
        tkSearchField: "tk_i"
      }));
    }
    if (field === "ma_kh_i") {
      setSearchStates(prev => ({
        ...prev,
        maKhSearch: value,
        maKhSearchRowId: id,
        searchContext: "hachToan"
      }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      so_ct: "",
      ong_ba: "",
      ngay_lct: "",
      ngay_ct: "",
      tk: "",
      ma_gd: "",
      ma_kh: "",
      dia_chi: "",
      dien_giai: "",
      ma_qs: "",
      loai_ct: "Đã ghi sổ cái",
      mst: "",
      ma_nt: "VND",
      ty_gia: "1",
    });
    setHachToanData(INITIAL_ACCOUNTING_DATA);
    setHopDongThueData(INITIAL_TAX_CONTRACT_DATA); // Reset hợp đồng thuế
    setSelectedAccount(null);
    setMaTaiKhoanSearch("");
    setMaKhSearch("");
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
        ma_gd: formData.ma_gd?.trim() || "",
        ma_kh: formData.ma_kh?.trim() || "",
        dia_chi: formData.dia_chi?.trim() || "",
        ong_ba: formData.ong_ba?.trim() || "",
        dien_giai: formData.dien_giai?.trim() || "",
        ngay_ct: formData.ngay_ct,
        ngay_lct: formData.ngay_lct,
        ma_qs: formData.ma_qs?.trim() || "",
        so_ct: formData.so_ct?.trim() || "",
        ma_nt: formData.ma_nt?.trim() || "VND",
        ty_gia: Number(formData.ty_gia) || 1,
        loai_ct: formData.loai_ct?.trim() || "",
        tong_tien: totals.totalPsCo || 0,
        han_thanh_toan: 0,
        tk: formData.tk?.trim() || "",

        tai_khoan_list: hachToanData
          .filter(row => row.tk_i && parseFloat(row.ps_co) > 0)
          .map(({ tk_i, ps_co, dien_giai, tk_me }) => ({
            tk_i: tk_i?.trim() || "",
            tk_me: tk_me?.trim() || "",
            ps_co: Number(ps_co) || 0,
            dien_giai: dien_giai?.trim() || "",
          })),
        // Thêm hopDongThue vào payload
        hopDongThue: hopDongThueData
          .filter(row => row.ma_kh || row.ma_ms)
          .map(({
            so_ct0, ma_ms, kh_mau_hd, so_seri0, ngay_ct,
            ma_kh, ten_kh, dia_chi, ma_so_thue, ten_vt,
            t_tien, ma_thue, thue_suat, t_thue, tk_thue_no, tk_du, t_tt
          }) => ({
            so_ct0: so_ct0?.trim() || "",
            ma_ms: ma_ms?.trim() || "",
            kh_mau_hd: kh_mau_hd?.trim() || "",
            so_seri0: so_seri0?.trim() || "",
            ngay_ct,
            ma_kh: ma_kh?.trim() || "",
            ten_kh: ten_kh?.trim() || "",
            dia_chi: dia_chi?.trim() || "",
            ma_so_thue: ma_so_thue?.trim() || "",
            ten_vt: ten_vt?.trim() || "",
            t_tien,
            ma_thue: ma_thue?.trim() || "",
            thue_suat,
            t_thue,
            tk_thue_no: tk_thue_no?.trim() || "",
            tk_du: tk_du?.trim() || "",
            t_tt,
          })),
      };

      await updateGiayBaoNo({
        stt_rec: selectedGiayBaoNo.stt_rec,
        data: payload
      });
      closeModalEdit();
      resetForm();
      navigate("/chung-tu/bao-no");
    } catch (err) {
      console.error(err);
    }
  }, [formData, hachToanData, hopDongThueData, totals, updateGiayBaoNo, closeModalEdit, resetForm, navigate, validateForm, selectedGiayBaoNo]);

  return (
    <Modal isOpen={isOpenEdit} onClose={handleClose} title="Cập nhật phiếu thu" className="w-full max-w-7xl m-1 border-2">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-shrink-0 px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Cập nhật Giấy báo nợ Ngân Hàng
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Cập nhật thông tin Giấy báo nợ Ngân Hàng trong hệ thống
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
                    <div className="flex items-center gap-2">
                      <Label className="text-xs min-w-[110px]">Loại phiếu thu</Label>
                      <Input
                        value={formData.ma_gd}
                        onChange={e => handleChange("ma_gd", e.target.value)}
                        placeholder="2"
                        className="h-8 text-sm flex-1 bg-white"
                      />
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
                        <Input value={formData.dia_chi} disabled className="h-8 text-sm bg-white" />
                      </div>
                      <Label className="text-xs col-span-1 flex items-center justify-end col-span-1">MST</Label>
                      <div className="col-span-3">
                        <Input value={formData.mst} disabled className="h-8 text-sm bg-white" />
                      </div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Người nộp tiền</Label>
                      <div className="col-span-6">
                        <Input value={formData.ong_ba} disabled className="h-8 text-sm flex-1 col-span-6 bg-white" />
                      </div>
                      <div className="col-span-3"></div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Lý do nộp</Label>
                      <div className="col-span-10">
                        <Input
                          value={formData.dien_giai}
                          onChange={e => handleChange("dien_giai", e.target.value)}
                          className="h-8 text-sm flex-1 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-2">Tk nợ</Label>
                      <div className="relative col-span-6">
                        <Input
                          value={maTaiKhoanSearch}
                          onChange={e => {
                            const value = e.target.value;
                            setMaTaiKhoanSearch(value);
                            handleChange("tk", value);
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
                      <Label className="text-xs col-span-6 text-left">Số phiếu thu</Label>
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
                        addButtonText="Thêm dòng"
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
                {
                  label: "Hợp đồng thuế",
                  content: (
                    <div className="" ref={hopDongThueTableRef}>
                      <TableBasic
                        data={hopDongThueData}
                        columns={hopDongThueColumns}
                        onAddRow={addHopDongThueRow}
                        onDeleteRow={deleteHopDongThueRow}
                        showAddButton={true}
                        addButtonText="Thêm dòng"
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
                } else if (activeTab === 1) {
                  addHopDongThueRow();
                }
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
            {isPending ? "Đang cập nhật..." : "Cập nhật"}
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
    </Modal>
  );
};