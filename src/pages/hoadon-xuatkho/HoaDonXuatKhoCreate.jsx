import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import AccountSelectionPopup from "../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../components/general/CustomerSelectionPopup";
import DmkPopup from "../../components/general/dmkPopup";
import DmvtPopup from "../../components/general/dmvtPopup";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../components/ui/modal";
import { Tabs } from "../../components/ui/tabs";
import { useAccounts } from "../../hooks/useAccounts";
import { useCustomers } from "../../hooks/useCustomer";
import { useDmkho } from "../../hooks/useDmkho";
import { useDmvt } from "../../hooks/useDmvt";
import { useCreateHoaDonXuatKho } from "../../hooks/usehoadonxuatkho";
import { CalenderIcon } from "../../icons";

export const ModalCreateHoaDonXuatKho = ({ isOpenCreate, closeModalCreate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    so_ct: "",
    ong_ba: "",
    ngay_lct: "",
    ngay_ct: "",
    ma_nx: "",
    ma_gd: "",
    ma_kh: "",
    dia_chi: "",
    ma_so_thue: "",
    dien_giai: "",
    ma_qs: "",
    so_seri: "",
    ma_nt: "VND",
    ty_gia: 1,
    ma_bp: "",
    sl_in: 0,
    ma_thue: "",
    thue_suat: 0,
    tk_no: "",
    tk_co: "",
    ten_vtthue: "",
    gc_thue: "",
    ht_tt: "",
    sua_tien: false,
    px_gia_dd: false,
  });

  // State cho customer search
  const [maKhSearch, setMaKhSearch] = useState("");

  // State cho account dropdown (tài khoản nợ)
  const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  // State cho material search
  const [maVtSearch, setMaVtSearch] = useState("");
  const [maKho, setMaKho] = useState("");

  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});
  const { data: materialData = [] } = useDmvt(maVtSearch ? { search: maVtSearch } : {});
  const { data: dmkhoData = [] } = useDmkho(maKho ? { search: maKho } : {});

  const { mutateAsync: saveHoaDonXuatKho, isPending } = useCreateHoaDonXuatKho();
  const hachToanTableRef = useRef(null);

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
    showCustomerPopup: false,
    // Add material search states
    maVtSearch: "",
    maVtSearchRowId: null,
    showDmvtPopup: false,
    // Add warehouse search states
    maKhoSearch: "",
    maKhoSearchRowId: null,
    showDmkPopup: false,
  });

  // Updated initial data structure to match new DTO
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

  const FLATPICKR_OPTIONS = {
    dateFormat: "Y-m-d",
    locale: Vietnamese,
  };

  const [hachToanData, setHachToanData] = useState(INITIAL_ACCOUNTING_DATA);

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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maKhSearch && maKhSearch.length > 0) {
      } else {
        setSearchStates(prev => ({ ...prev, showMainCustomerPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maKhSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maTaiKhoanSearch && maTaiKhoanSearch.length > 0) {
      } else {
        setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maTaiKhoanSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchStates.maVtSearch) {
        setSearchStates(prev => ({ ...prev, showDmvtPopup: true }));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchStates.maVtSearch]);

  // Debounce material search - similar to customer search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maVtSearch && maVtSearch.length > 0) {
      } else {
        setSearchStates(prev => ({ ...prev, showDmvtPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maVtSearch]);

  // Debounce warehouse search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maKho && maKho.length > 0) {
      } else {
        setSearchStates(prev => ({ ...prev, showDmkPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maKho]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchStates.maKhoSearch) {
        setSearchStates(prev => ({ ...prev, showDmkPopup: true }));
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [searchStates.maKhoSearch]);

  // Handle material selection
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

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'ma_kh') {
      setMaKhSearch(value);
    }

    if (field === 'ma_nx') {
      setMaTaiKhoanSearch(value);
    }

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

    const validAccountingRows = hachToanData.filter(row =>
      row.ma_vt && (parseFloat(row.so_luong) > 0)
    );
    if (validAccountingRows.length === 0) {
      console.error("Vui lòng nhập ít nhất một dòng hạch toán hợp lệ");
      return false;
    }

    return true;
  }, [formData, hachToanData]);

  const handleMainCustomerSelect = (customer) => {
    if (!customer) {
      console.error('Customer object is null or undefined');
      return;
    }

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

  const handleMainAccountSelect = (account) => {
    setFormData(prev => ({
      ...prev,
      ma_nx: account.tk.trim()
    }));
    setSelectedAccount(account);
    setMaTaiKhoanSearch(account.tk.trim());
    setSearchStates(prev => ({
      ...prev,
      showMainAccountPopup: false
    }));
  };

  const handleAccountSelect = useCallback((id, account) => {
    const fieldToUpdate = searchStates.tkSearchField || "tk_vt";

    setHachToanData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, [fieldToUpdate]: account.tk.trim(), ten_tk: account.ten_tk }
          : item
      )
    );

    setSearchStates(prev => ({
      ...prev,
      showAccountPopup: false,
      tkSearch: "",
      tkSearchField: null
    }));
  }, [searchStates.tkSearchField]);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDateChange = useCallback((date, field) => {
    const formattedDate = date[0]?.toLocaleDateString("en-CA");
    handleFormChange(field, formattedDate);
  }, [handleFormChange]);

  const totals = useMemo(() => {
    const totalTien = hachToanData.reduce((sum, item) => {
      const value = parseFloat(item.tien) || 0;
      return sum + value;
    }, 0);
    const totalSoLuong = hachToanData.reduce((sum, item) => {
      const value = parseFloat(item.so_luong) || 0;
      return sum + value;
    }, 0);

    return { totalTien, totalSoLuong };
  }, [hachToanData]);

  const { data: accountRawData = {} } = useAccounts(
    searchStates.tkSearch ? { search: searchStates.tkSearch } : {}
  );

  const handleClose = () => {
    resetForm();
    closeModalCreate();
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

  // Updated columns to match new DTO structure
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
      key: "gia2",
      title: "Đơn giá",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.gia2}
            onChange={(e) => handleHachToanChange(row.id, "gia2", e.target.value)}
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
      render: (val, row) => {
        if (row.id === 'total') {
          return (
            <div className="text-right text-[16px] text-green-600 p-2 rounded px-7">
              {totals.totalTien.toLocaleString('vi-VN')}
            </div>
          );
        }
        return (
          <Input
            type="number"
            value={row.tien}
            onChange={(e) => handleHachToanChange(row.id, "tien", e.target.value)}
            placeholder="0"
            className="w-full text-right"
            disabled={!formData.sua_tien}
            style={{
              backgroundColor: formData.sua_tien ? 'white' : '#f9fafb',
              cursor: formData.sua_tien ? 'text' : 'not-allowed'
            }}
          />
        );
      },
    },
    {
      key: "gia",
      title: "Giá vốn",
      width: 120,
      render: (val, row) => (
        <Input
          value={row.gia}
          onChange={(e) => handleHachToanChange(row.id, "gia", e.target.value)}
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

  const deleteHachToanRow = useCallback((id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setHachToanData(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleHachToanChange = useCallback((id, field, value) => {
    setHachToanData(prev => {
      const newData = prev.map(item => {
        if (item.id !== id) return item;

        const updatedItem = { ...item, [field]: value };

        if (field === "so_luong" || field === "gia2") {
          const soLuong = parseFloat(field === "so_luong" ? value : item.so_luong) || 0;
          const gia = parseFloat(field === "gia2" ? value : item.gia2) || 0;

          // Nếu không cho phép sửa trường tiền, tự động tính toán
          if (!formData.sua_tien) {
            updatedItem.tien = soLuong * gia;
          }
        }

        // Nếu trường tiền được sửa trực tiếp và checkbox "sửa trường tiền" được bật
        if (field === "tien" && !formData.sua_tien) {
          // Không cho phép sửa, giữ nguyên giá trị tính toán
          const soLuong = parseFloat(item.so_luong) || 0;
          const gia = parseFloat(item.gia2) || 0;
          updatedItem.tien = soLuong * gia;
        }

        return updatedItem;
      });

      return newData;
    });

    // Search logic for material code
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

    // Search logic for account fields
    if (["tk_dt", "tk_vt", "tk_gv"].includes(field)) {
      setSearchStates(prev => ({
        ...prev,
        tkSearch: value,
        tkSearchRowId: id,
        tkSearchField: field
      }));
    }
  }, [formData.sua_tien]);

  const resetForm = useCallback(() => {
    setFormData({
      so_ct: "",
      ong_ba: "",
      ngay_lct: "",
      ngay_ct: "",
      ma_nx: "",
      ma_gd: "",
      ma_kh: "",
      dia_chi: "",
      ma_so_thue: "",
      dien_giai: "",
      ma_qs: "",
      so_seri: "",
      ma_nt: "VND",
      ty_gia: 1,
      ma_bp: "",
      sl_in: 0,
      ma_thue: "",
      thue_suat: 0,
      tk_no: "",
      tk_co: "",
      ten_vtthue: "",
      gc_thue: "",
      ht_tt: "",
      sua_tien: false,
      px_gia_dd: false,
    });
    setHachToanData(INITIAL_ACCOUNTING_DATA);
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
      maVtSearch: "",
      maVtSearchRowId: null,
      showDmvtPopup: false,
      maKhoSearch: "",
      maKhoSearchRowId: null,
      showDmkPopup: false,
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
        ma_so_thue: formData.ma_so_thue?.trim() || "",
        ong_ba: formData.ong_ba?.trim() || "",
        dien_giai: formData.dien_giai?.trim() || "",
        ma_nx: formData.ma_nx?.trim() || "",
        ma_bp: formData.ma_bp?.trim() || "",
        ngay_ct: formData.ngay_ct,
        ngay_lct: formData.ngay_lct,
        ma_qs: formData.ma_qs?.trim() || "",
        so_seri: formData.so_seri?.trim() || "",
        so_ct: formData.so_ct?.trim() || "",
        ma_nt: formData.ma_nt?.trim() || "VND",
        ty_gia: Number(formData.ty_gia) || 1,
        sl_in: Number(formData.sl_in) || 0,
        ma_thue: formData.ma_thue?.trim() || "",
        thue_suat: Number(formData.thue_suat) || 0,
        tk_no: formData.tk_no?.trim() || "",
        tk_co: formData.tk_co?.trim() || "",
        ten_vtthue: formData.ten_vtthue?.trim() || "",
        gc_thue: formData.gc_thue?.trim() || "",
        ht_tt: formData.ht_tt?.trim() || "",
        sua_tien: formData.sua_tien,
        px_gia_dd: formData.px_gia_dd,

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

      await saveHoaDonXuatKho(payload);
      closeModalCreate();
      resetForm();
      navigate("/chung-tu/hoa-don-ban-hang");
    } catch (err) {
      console.error(err);
    }
  }, [formData, hachToanData, saveHoaDonXuatKho, closeModalCreate, resetForm, navigate, validateForm]);

  const handleCustomerSelect = useCallback(() => {
    // Handle customer selection for table rows if needed
    setSearchStates(prev => ({
      ...prev,
      showCustomerPopup: false,
      maKhSearch: "",
      searchContext: null
    }));
  }, []);
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
  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới hóa đơn xuất kho" className="w-full max-w-7xl m-1 border-2">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-shrink-0 px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Tạo Hóa đơn bán hàng kiêm phiếu xuất kho
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin Hóa đơn bán hàng kiêm phiếu xuất kho mới vào hệ thống
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col bg-blue-50">
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

                    {/* Additional tax fields */}
                    {/* <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Mã thuế</Label>
                      <div className="col-span-3">
                        <Input value={formData.ma_thue} className="h-8 text-sm bg-white" onChange={e => handleChange("ma_thue", e.target.value)} />
                      </div>
                      <Label className="text-xs col-span-2 text-center">Thuế suất (%)</Label>
                      <div className="col-span-3">
                        <Input value={formData.thue_suat} className="h-8 text-sm bg-white" onChange={e => handleChange("thue_suat", e.target.value)} type="number" />
                      </div>
                      <div className="col-span-2"></div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">TK nợ</Label>
                      <div className="col-span-3">
                        <Input value={formData.tk_no} className="h-8 text-sm bg-white" onChange={e => handleChange("tk_no", e.target.value)} />
                      </div>
                      <Label className="text-xs col-span-2 text-center">TK có</Label>
                      <div className="col-span-3">
                        <Input value={formData.tk_co} className="h-8 text-sm bg-white" onChange={e => handleChange("tk_co", e.target.value)} />
                      </div>
                      <div className="col-span-2"></div>
                    </div> */}
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

                    {/* <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Tên VT thuế</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.ten_vtthue}
                          onChange={e => handleChange("ten_vtthue", e.target.value)}
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Ghi chú thuế</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.gc_thue}
                          onChange={e => handleChange("gc_thue", e.target.value)}
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Hình thức TT</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.ht_tt}
                          onChange={e => handleChange("ht_tt", e.target.value)}
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div> */}
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
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-2 flex justify-end">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.sua_tien}
                              onChange={(e) => handleChange("sua_tien", e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <Label className="text-sm font-medium text-gray-700">Sửa trường tiền</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formData.px_gia_dd}
                              onChange={(e) => handleChange("px_gia_dd", e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <Label className="text-sm font-medium text-gray-700">
                              Xuất theo giá vốn đích danh cho VT giá TB
                            </Label>
                          </div>
                        </div>
                      </div>
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
            <div className="h-[45%] px-6 py-4 flex-shrink-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                {/* Cột 1 */}
                <div className="dark:border-gray-600 rounded-lg flex flex-col">
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs min-w-[110px] col-span-4">Mã thuế</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.ma_thue}
                        className="h-8 text-sm bg-white"
                        onChange={e => handleChange("ma_thue", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Thuế suất (%)</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.thue_suat}
                        className="h-8 text-sm bg-white"
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
                        className="h-8 text-sm bg-white"
                        onChange={e => handleChange("tk_no", e.target.value)}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        value={formData.tk_co}
                        className="h-8 text-sm bg-white"
                        onChange={e => handleChange("tk_co", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Nhóm hàng</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.ten_vtthue}
                        onChange={e => handleChange("ten_vtthue", e.target.value)}
                        className="h-8 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Cột 2 */}
                <div className="dark:border-gray-600 rounded-lg flex flex-col">
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Ghi chú thuế</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.gc_thue}
                        onChange={e => handleChange("gc_thue", e.target.value)}
                        className="h-8 text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Hình thức TT</Label>
                    <div className="col-span-8">
                      <Input
                        value={formData.ht_tt}
                        onChange={e => handleChange("ht_tt", e.target.value)}
                        className="h-8 text-sm bg-white"
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
                        value={totals.totalSoLuong}
                        disabled
                        className="h-8 text-sm bg-gray-100 text-right"
                      />
                    </div>
                  </div>
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Cộng tiền hàng</Label>
                    <div className="col-span-8">
                      <Input
                        value={totals.totalTien}
                        disabled
                        className="h-8 text-sm bg-gray-100 text-right"
                      />
                    </div>
                  </div>
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Tiền thuế GTGT</Label>
                    <div className="col-span-8">
                      <Input
                        value={
                          totals.totalTien && formData.thue_suat
                            ? ((totals.totalTien * Number(formData.thue_suat)) / 100).toFixed(2)
                            : "0"
                        }
                        disabled
                        className="h-8 text-sm bg-gray-100 text-right"
                      />
                    </div>
                  </div>
                  <div className="grid items-center gap-2 grid-cols-12">
                    <Label className="text-xs col-span-4">Tổng tiền tt</Label>
                    <div className="col-span-8">
                      <Input
                        value={
                          totals.totalTien && formData.thue_suat
                            ? (
                              totals.totalTien +
                              (totals.totalTien * Number(formData.thue_suat) / 100)
                            ).toFixed(2)
                            : totals.totalTien?.toFixed(2) || "0"
                        }
                        disabled
                        className="h-8 text-sm bg-gray-100 text-right"
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
            onClick={handleSave}
            disabled={isPending}
            className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
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

      {/* Popup cho tài khoản nợ chính */}
      {searchStates.showMainAccountPopup && (
        <AccountSelectionPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }))}
          onSelect={(account) => handleMainAccountSelect(account)}
          accounts={accountData.data || []}
          searchValue={maTaiKhoanSearch}
        />
      )}

      {/* Popup cho khách hàng chính */}
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

      {/* Material Selection Popup */}
      {searchStates.showDmvtPopup && (
        <DmvtPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showDmvtPopup: false }))}
          onSelect={(material) => handleMaterialSelect(searchStates.maVtSearchRowId, material)}
          materials={materialData.data || []}
          searchValue={searchStates.maVtSearch}
        />
      )}

      {/* Warehouse Selection Popup */}
      {searchStates.showDmkPopup && (
        <DmkPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showDmkPopup: false }))}
          onSelect={(warehouse) => handleWarehouseSelect(searchStates.maKhoSearchRowId, warehouse)}
          warehouses={dmkhoData.data || []}
          searchValue={searchStates.maKhoSearch}
        />
      )}
    </Modal>
  );
};