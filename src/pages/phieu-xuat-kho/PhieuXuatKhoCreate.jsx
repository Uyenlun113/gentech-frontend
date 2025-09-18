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
import { useCreatePhieuXuatKho } from "../../hooks/usephieuxuatkho";
import { CalenderIcon } from "../../icons";
import dmvtService from "../../services/dmvt";

export const ModalCreatePhieuXuatKho = ({ isOpenCreate, closeModalCreate }) => {
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
    sua_tien: false,
    px_gia_dd: false,
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

  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});
  const { data: accountRawData2 = {} } = useAccounts(
    maTaiKhoanSearch2 ? { search: maTaiKhoanSearch2 } : {}
  );

  // Hook để lấy danh sách kho - THÊM MỚI
  const { data: dmkhoData = [] } = useDmkho(maKhoSearch ? { search: maKhoSearch } : {});

  // Hook để lấy danh sách vật tư - THÊM MỚI
  const fetchDmvtData = useCallback(async (searchTerm = "") => {
    setDmvtLoading(true);
    try {

      // Gọi API danh sách vật tư
      const response = await dmvtService.getDmvt({
        search: searchTerm,
        page: 1,
        limit: 20
      });

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

  const { mutateAsync: savePhieuXuatKho, isPending } = useCreatePhieuXuatKho();
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
    // Thêm state cho kho popup - THÊM MỚI
    maKhoSearch: "",
    maKhoSearchRowId: null,
    searchContext: null,
    showAccountPopup: false,
    showAccountPopup2: false,
    showMainAccountPopup: false,
    showMainCustomerPopup: false,
    showDmvtPopup: false, // Popup chọn vật tư
    showDmkhoPopup: false, // Popup chọn kho - THÊM MỚI
  });

  const INITIAL_HANG_HOA_DATA = [
    {
      id: 1,
      stt_rec: "1",
      ma_vt: "",
      ten_vt: "",
      ma_kho_i: "",
      so_luong: "",
      gia: "",
      tien: "",
      tk_vt: "",
      ma_nx_i: "",
      dien_giai: ""
    },
  ];

  const FLATPICKR_OPTIONS = {
    dateFormat: "Y-m-d",
    locale: Vietnamese,
  };

  const [hangHoaData, setHangHoaData] = useState(INITIAL_HANG_HOA_DATA);

  // Hook để lấy tên vật tư cho từng dòng hàng hóa
  const fetchMaterialNames = useCallback(async (hangHoaArray) => {
    const promises = hangHoaArray.map(async (item) => {
      if (item.ma_vt && !item.ten_vt) {
        try {
          const materialData = await dmvtService.getDmvtById(item.ma_vt);
          return {
            ...item,
            ten_vt: materialData?.ten_vt || materialData?.name || ""
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
      } else {
        setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maTaiKhoanSearch]);

  // Debounce vật tư search - CẬP NHẬT ĐỂ GỌI API
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchStates.maVtSearch && searchStates.maVtSearch.length > 0) {
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

  // Debounce kho search - THÊM MỚI
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchStates.maKhoSearch && searchStates.maKhoSearch.length > 0) {
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
            ma_nx_i: account.tk.trim(),
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

    // Cập nhật dữ liệu hàng hóa với vật tư đã chọn
    setHangHoaData(prev =>
      prev.map(item =>
        item.id === searchStates.maVtSearchRowId
          ? {
            ...item,
            ma_vt: dmvt.ma_vt || dmvt.code || "",
            ten_vt: dmvt.ten_vt || dmvt.name || ""
          }
          : item
      )
    );

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
  }, [searchStates.maVtSearchRowId]);

  // Handle kho selection - THÊM MỚI
  const handleDmkhoSelect = useCallback((kho) => {
    if (!kho || !searchStates.maKhoSearchRowId) {
      console.error('Kho object or row ID is null/undefined');
      return;
    }

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

  // Handle DMVT search từ popup - THÊM MỚI
  const handleDmvtSearch = useCallback((searchTerm) => {
    setDmvtSearchTerm(searchTerm);
    fetchDmvtData(searchTerm);
  }, [fetchDmvtData]);

  // Handle Dmkho search từ popup - THÊM MỚI
  const handleDmkhoSearch = useCallback((searchTerm) => {
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
    const totalTien = hangHoaData.reduce((sum, item) => {
      const value = parseFloat(item.tien) || 0;
      return sum + value;
    }, 0);

    const totalSoLuong = hangHoaData.reduce((sum, item) => {
      const value = parseFloat(item.so_luong) || 0;
      return sum + value;
    }, 0);

    return { totalTien, totalSoLuong };
  }, [hangHoaData]);

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
        so_luong: "",
        gia: "",
        tien: "",
        tk_vt: "",
        ma_nx_i: "",
        dien_giai: "",
      };

      return [...prev, newRow];
    });

    setTimeout(() => {
      if (hangHoaTableRef.current) {
        const tableContainer = hangHoaTableRef.current.querySelector('.overflow-x-auto');
        if (tableContainer) {
          tableContainer.scrollTop = tableContainer.scrollHeight;
        }
      }
    }, 100);
  }, []);

  const handleEnterPressOnLastField = useCallback((currentRowId) => {
    // Add new row
    setHangHoaData(prev => {
      const newRowId = prev.length + 1;
      const newRow = {
        id: newRowId,
        stt_rec: newRowId.toString(),
        ma_vt: "",
        ten_vt: "",
        ma_kho_i: "",
        so_luong: "",
        gia: "",
        tien: "",
        tk_vt: "",
        ma_nx_i: "",
        dien_giai: "",
      };
      return [...prev, newRow];
    });

    // Focus on first field of new row after a short delay
    setTimeout(() => {
      // Calculate the tabIndex for the first field (ma_vt) of the new row
      const newRowTabIndex = 9 + (hangHoaData.length * 7); // 9 is base tabIndex for ma_vt, 7 fields per row (excluding disabled tien)
      const firstFieldOfNewRow = document.querySelector(`input[tabindex="${newRowTabIndex}"]`);
      if (firstFieldOfNewRow) {
        firstFieldOfNewRow.focus();
        firstFieldOfNewRow.select();
      }

      // Scroll to bottom of table
      if (hangHoaTableRef.current) {
        const tableContainer = hangHoaTableRef.current.querySelector('.overflow-x-auto');
        if (tableContainer) {
          tableContainer.scrollTop = tableContainer.scrollHeight;
        }
      }
    }, 150);
  }, [hangHoaData.length]);

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
        gia: '',
        tien: totals.totalTien,
        tk_vt: '',
        ma_nx_i: '',
        dien_giai: ''
      }
    ];
  }, [hangHoaData, totals]);

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
            tabIndex={9 + ((row.id - 1) * 7)}
            value={row.ma_vt}
            onChange={(e) => handleHangHoaChange(row.id, "ma_vt", e.target.value)}
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
      key: "ma_kho_i",
      title: "Mã kho",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            tabIndex={10 + ((row.id - 1) * 7)}
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
            tabIndex={11 + ((row.id - 1) * 7)}
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
      title: "Giá",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            tabIndex={12 + ((row.id - 1) * 7)}
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
      key: "tien",
      title: "Tiền",
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
            // tabIndex={13}
            type="number"
            value={row.tien}
            onChange={(e) => handleHangHoaChange(row.id, "tien", e.target.value)}
            placeholder="0"
            className="w-full text-right"
            disabled={!formData.sua_tien} // Disable khi không được phép sửa
            style={{
              backgroundColor: formData.sua_tien ? 'white' : '#f9fafb',
              cursor: formData.sua_tien ? 'text' : 'not-allowed'
            }}
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
            tabIndex={13 + ((row.id - 1) * 7)}
            value={row.tk_vt}
            onChange={(e) => handleHangHoaChange(row.id, "tk_vt", e.target.value)}
            placeholder="TK"
            className="w-full"
          />
        );
      },
    },

    {
      key: "ma_nx_i",
      title: "TK có",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            tabIndex={14 + ((row.id - 1) * 7)}
            value={row.ma_nx_i}
            onChange={(e) => handleHangHoaChange(row.id, "ma_nx_i", e.target.value)}
            placeholder="TK"
            className="w-full"
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
            tabIndex={15 + ((row.id - 1) * 7)}
            value={row.dien_giai}
            onChange={(e) => handleHangHoaChange(row.id, "dien_giai", e.target.value)}
            placeholder="Nhập diễn giải..."
            className="w-full"
            title="Mỗi dòng có thể có diễn giải riêng"
            onEnterPress={() => handleEnterPressOnLastField(row.id)}
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
    setHangHoaData(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleHangHoaChange = useCallback((id, field, value) => {
    setHangHoaData(prev => {
      const newData = prev.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Logic tính toán tiền dựa trên checkbox
          if (field === "so_luong" || field === "gia") {
            const soLuong = parseFloat(field === "so_luong" ? value : item.so_luong) || 0;
            const gia = parseFloat(field === "gia" ? value : item.gia) || 0;

            // Nếu không cho phép sửa trường tiền, tự động tính toán
            if (!formData.sua_tien) {
              updatedItem.tien = soLuong * gia;
            }
          }

          // Nếu trường tiền được sửa trực tiếp và checkbox "sửa trường tiền" được bật
          if (field === "tien" && !formData.sua_tien) {
            // Không cho phép sửa, giữ nguyên giá trị tính toán
            const soLuong = parseFloat(item.so_luong) || 0;
            const gia = parseFloat(item.gia) || 0;
            updatedItem.tien = soLuong * gia;
          }

          // Trigger popup vật tư khi nhập mã vật tư
          if (field === "ma_vt" && value && value.trim()) {
            setSearchStates(prev => ({
              ...prev,
              maVtSearch: value.trim(),
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
      return newData;
    });

    if (field === "tk_vt") {
      setSearchStates(prev => ({
        ...prev,
        tkSearch: value,
        tkSearchRowId: id,
        tkSearchField: field,
        showAccountPopup: true
      }));
    } else if (field === "ma_nx_i") {
      setSearchStates(prev => ({
        ...prev,
        tkSearch2: value,
        tkSearchRowId2: id,
        tkSearchField2: field,
        showAccountPopup2: true
      }));
    }
  }, [formData.sua_tien]);

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
      sua_tien: false,
      px_gia_dd: false,
    });
    setHangHoaData(INITIAL_HANG_HOA_DATA);
    setSelectedAccount(null);
    setMaTaiKhoanSearch("");
    setMaTaiKhoanSearch2("");
    setMaKhSearch("");
    setDmvtSearchTerm("");
    setDmvtData({ data: [] });
    setMaKhoSearch(""); // THÊM MỚI
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
      maKhoSearch: "", // THÊM MỚI
      maKhoSearchRowId: null, // THÊM MỚI
      searchContext: null,
      showAccountPopup: false,
      showAccountPopup2: false,
      showMainAccountPopup: false,
      showMainCustomerPopup: false,
      showDmvtPopup: false,
      showDmkhoPopup: false, // THÊM MỚI
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
        sua_tien: formData.sua_tien ? 1 : 0,
        px_gia_dd: formData.px_gia_dd ? 1 : 0,

        // Updated to match backend structure
        hang_hoa_list: hangHoaData
          .filter(row => row.ma_vt && parseFloat(row.so_luong) > 0)
          .map(({ ma_vt, ma_kho_i, so_luong, gia, tien, tk_vt, ma_nx_i, dien_giai }) => ({
            ma_vt: ma_vt?.trim() || "",
            ma_kho_i: ma_kho_i?.trim() || "",
            so_luong: Number(so_luong) || 0,
            gia: Number(gia) || 0,
            tien: Number(tien) || 0,
            tk_vt: tk_vt?.trim() || "",
            ma_nx_i: ma_nx_i?.trim() || "",
            dien_giai: dien_giai?.trim() || "",
          })),
      };

      await savePhieuXuatKho(payload);
      closeModalCreate();
      resetForm();
      navigate("/chung-tu/phieu-xuat-kho");
    } catch (err) {
      console.error(err);
    }
  }, [formData, hangHoaData, totals, savePhieuXuatKho, closeModalCreate, resetForm, navigate, validateForm]);

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới phiếu xuất kho" className="w-full max-w-7xl m-1 border-2">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-shrink-0 px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Tạo phiếu xuất kho
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin phiếu xuất kho mới vào hệ thống
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
                      <Label className="text-xs min-w-[110px]">Loại phiếu xuất</Label>
                      <Input
                        tabIndex={1}
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
                            tabIndex={2}
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
                      <Label className="text-xs col-span-1 flex items-center col-span-2">Địa chỉ</Label>
                      <div className="col-span-6">
                        <Input
                          tabIndex={3} value={formData.dia_chi} className="h-8 text-sm bg-white" onChange={e => handleChange("dia_chi", e.target.value)} />
                      </div>
                      <Label className="text-xs col-span-1 flex items-center justify-end col-span-1">MST</Label>
                      <div className="col-span-3">
                        <Input
                          tabIndex={4} value={formData.mst} className="h-8 text-sm bg-white" onChange={e => handleChange("mst", e.target.value)} />
                      </div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Người giao hàng</Label>
                      <div className="col-span-6">
                        <Input
                          tabIndex={5} value={formData.ong_ba} className="h-8 text-sm flex-1 col-span-6 bg-white" onChange={e => handleChange("ong_ba", e.target.value)} />
                      </div>
                      <div className="col-span-3"></div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Lý do xuất</Label>
                      <div className="col-span-10">
                        <Input
                          tabIndex={6}
                          value={formData.dien_giai}
                          onChange={e => handleChange("dien_giai", e.target.value)}
                          className="h-8 text-sm flex-1 bg-white"
                        />
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
                          tabIndex={7}
                          value={formData.ma_qs}
                          onChange={e => handleChange("ma_qs", e.target.value)}
                          className="h-8 text-sm bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Số phiếu xuất</Label>
                      <div className="col-span-5">
                        <Input
                          tabIndex={8}
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
                          // tabIndex={1}
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
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-2 flex justify-end">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Input
                              // tabIndex={1}
                              type="checkbox"
                              checked={formData.sua_tien}
                              onChange={(e) => handleChange("sua_tien", e.target.checked)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <Label className="text-sm font-medium text-gray-700">Sửa trường tiền</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              // tabIndex={1}
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
                    </div>
                  ),
                },
              ]}
              onAddRow={(activeTab) => {
                if (activeTab === 0) {
                  addHangHoaRow();
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

      {searchStates.showMainAccountPopup && (
        <AccountSelectionPopup
          isOpen={true}
          onClose={() => setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }))}
          onSelect={(account) => handleMainAccountSelect(account)}
          accounts={accountData.data || []}
          searchValue={maTaiKhoanSearch}
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

      {/* DMVT Popup - CẬP NHẬT VỚI API DATA */}
      {searchStates.showDmvtPopup && (
        <DmvtPopup
          isOpen={true}
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
    </Modal>
  );
};