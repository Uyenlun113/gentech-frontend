import { useState, useCallback, useMemo, useRef } from "react";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateGiayBaoCo } from "../../hooks/usegiaybaoco";
import { useCustomers } from "../../hooks/useCustomer";
import { useAccounts } from "../../hooks/useAccounts";
import { useEffect } from "react";
import { Plus, Trash2, X, Save } from "lucide-react";
import { Tabs } from "../../components/ui/tabs";
import TableBasic from "../../components/tables/BasicTables/BasicTableOne";
import AccountSelectionPopup from "../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../components/general/CustomerSelectionPopup";
import { useNavigate } from "react-router";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalenderIcon } from "../../icons";

export const ModalCreateGiayBaoCo = ({ isOpenCreate, closeModalCreate }) => {
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
    ma_nt: "",
    ty_gia: "",
  });

  // State cho customer search
  const [maKhSearch, setMaKhSearch] = useState("");

  // State cho account dropdown (tài khoản nợ) - CẬP NHẬT
  const [maTaiKhoanSearch, setMaTaiKhoanSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null); // Thêm state để lưu tài khoản đã chọn

  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});
  const { data: accountData = [] } = useAccounts(maTaiKhoanSearch ? { search: maTaiKhoanSearch } : {});

  const { mutateAsync: saveGiayBaoCo, isPending } = useCreateGiayBaoCo();
  const hachToanTableRef = useRef(null);

  const [searchStates, setSearchStates] = useState({
    tkSearch: "",
    tkSearchRowId: null,
    tkSearchField: null,
    maKhSearch: "",
    maKhSearchRowId: null,
    searchContext: null,
    showAccountPopup: false,
    // Thêm state cho tài khoản nợ popup
    showMainAccountPopup: false,
    showMainCustomerPopup: false, // Thêm state cho customer popup chính
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

  // Debounce customer search - CẬP NHẬT để sử dụng popup
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maKhSearch && maKhSearch.length > 0) {
        // Chỉ log, không hiển thị popup tự động
      } else {
        setSearchStates(prev => ({ ...prev, showMainCustomerPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maKhSearch]);

  // Debounce account search cho tài khoản nợ - CẬP NHẬT
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maTaiKhoanSearch && maTaiKhoanSearch.length > 0) {
        // Chỉ hiển thị popup, không hiển thị dropdown
      } else {
        setSearchStates(prev => ({ ...prev, showMainAccountPopup: false }));
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [maTaiKhoanSearch]);


  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Trigger customer search when ma_kh changes
    if (field === 'ma_kh') {
      setMaKhSearch(value);
    }

    // Trigger account search when tk changes - CẬP NHẬT
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

    const validAccountingRows = hachToanData.filter(row =>
      row.tk_i && (parseFloat(row.ps_co) > 0)
    );
    if (validAccountingRows.length === 0) {
      console.error("Vui lòng nhập ít nhất một dòng hạch toán hợp lệ");
      return false;
    }

    return true;
  }, [formData, hachToanData]);

  // Handle customer selection cho form chính - SỬA ĐỂ ĐIỀN ĐẦY ĐỦ THÔNG TIN
  const handleMainCustomerSelect = (customer) => {
    if (!customer) {
      console.error('Customer object is null or undefined');
      return;
    }

    // Cập nhật form với thông tin khách hàng
    setFormData(prev => ({
      ...prev,
      mst: customer.ma_so_thue || "",
      ma_kh: customer.ma_kh || "",
      ong_ba: customer.ten_kh || "",
      dia_chi: customer.dia_chi || ""
    }));

    // Cập nhật search value để hiển thị mã khách hàng trong input
    setMaKhSearch(customer.ma_kh || "");

    // Đóng popup
    setSearchStates(prev => ({
      ...prev,
      showMainCustomerPopup: false
    }));
  };

  // Handle account selection cho tài khoản nợ - CẬP NHẬT
  const handleMainAccountSelect = (account) => {
    setFormData(prev => ({
      ...prev,
      tk: account.tk.trim()
    }));
    setSelectedAccount(account); // Lưu thông tin tài khoản đã chọn
    setMaTaiKhoanSearch(account.tk.trim());
    setSearchStates(prev => ({
      ...prev,
      showMainAccountPopup: false
    }));
  };

  // Handle account selection cho bảng hạch toán
  const handleAccountSelect = useCallback((id, account) => {
    setHachToanData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, tk_i: account.tk.trim(), ten_tk: account.ten_tk, tk_me: account.tk_me.trim() }
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

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // AUTO-FILL: Khi thay đổi "dienGiaiChung", fill xuống tất cả dòng hạch toán
    if (field === "dienGiaiChung") {
      setHachToanData(prevHachToan =>
        prevHachToan.map(item => ({
          ...item,
          dien_giaii: value // Fill diễn giải chung xuống tất cả dòng
        }))
      );
    }
  }, []);
  const handleDateChange = useCallback((date, field) => {
    const formattedDate = date[0]?.toLocaleDateString("en-CA");
    handleFormChange(field, formattedDate);
  }, [handleFormChange]);


  // Tính tổng PS Có
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
    closeModalCreate();
  };

  // SỬA addHachToanRow để ngăn form submit
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

    // Scroll to bottom after adding row
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

  // Table columns với dòng tổng
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
              type="button" // QUAN TRỌNG: Luôn là button
              onClick={(e) => {
                e.preventDefault(); // Ngăn form submit
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
    // QUAN TRỌNG: Ngăn form submit
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setHachToanData(prev => prev.filter(item => item.id !== id));
  }, []);

  // SỬA LOGIC handleHachToanChange - BỎ AUTO-FILL DIỄN GIẢI
  const handleHachToanChange = useCallback((id, field, value) => {
    setHachToanData(prev => {
      // Cập nhật giá trị cho dòng hiện tại - KHÔNG auto-fill diễn giải
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
      ty_gia: "",
    });
    setHachToanData(INITIAL_ACCOUNTING_DATA);
    setSelectedAccount(null); // Reset tài khoản đã chọn
    setMaTaiKhoanSearch(""); // Reset search
    setMaKhSearch(""); // Reset customer search
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
        ty_gia: Number(formData.ty_gia) || 0,
        loai_ct: formData.loai_ct?.trim() || "",
        tong_tien: totals.totalPsCo || 0,
        han_thanh_toan: 0, // Gán mặc định 0 nếu bạn chưa có trường này trong form
        tk: formData.tk?.trim() || "",

        tai_khoan_list: hachToanData
          .filter(row => row.tk_i && parseFloat(row.ps_co) > 0)
          .map(({ tk_i, ps_co, dien_giai, tk_me }) => ({
            tk_i: tk_i?.trim() || "",
            tk_me: tk_me?.trim() || "",
            ps_co: Number(ps_co) || 0,
            dien_giai: dien_giai?.trim() || "",
          })),
      };

      await saveGiayBaoCo(payload);
      closeModalCreate();
      resetForm();
      navigate("/chung-tu/bao-co");
    } catch (err) {
      console.error(err);
    }
  }, [formData, hachToanData, totals, saveGiayBaoCo, closeModalCreate, resetForm, navigate, validateForm]);

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới giấy" className="w-full max-w-7xl m-1 border-2">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-shrink-0 px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Tạo Giấy báo có Ngân Hàng
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin Giấy báo có Ngân Hàng mới vào hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Content area - KHÔNG scroll, chia thành 2 phần cố định */}
        <div className="flex-1 min-h-0 flex flex-col bg-blue-50">

          {/* Phần 1: 2 khung thông tin - 60% chiều cao */}
          <div className="h-[45%] px-6 py-4 flex-shrink-0">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              {/* Khung trái - Thông tin chung */}
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
                      <div className="col-span-6" >
                        <div className="relative flex-1">
                          <Input
                            value={maKhSearch}
                            onChange={e => {
                              const value = e.target.value;
                              setMaKhSearch(value);
                              handleChange("ma_kh", value);
                              // Hiển thị popup khi có giá trị
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
                      <div className="col-span-6">
                        {/* Input Địa chỉ */}
                        <Input value={formData.dia_chi} className="h-8 text-sm bg-white" onChange={e => handleChange("dia_chi", e.target.value)} />
                      </div>
                      <Label className="text-xs col-span-1 flex items-center justify-end col-span-1">MST</Label>
                      <div className="col-span-3">
                        {/* Input MST */}
                        <Input value={formData.mst} className="h-8 text-sm bg-white" onChange={e => handleChange("mst", e.target.value)} />
                      </div>
                    </div>

                    <div className="grid items-center gap-2 grid-cols-12">
                      <Label className="text-xs min-w-[110px] col-span-2">Người nộp tiền</Label>
                      <div className="col-span-6">
                        <Input value={formData.ong_ba} className="h-8 text-sm flex-1 col-span-6 bg-white" onChange={e => handleChange("ong_ba", e.target.value)} />
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

                    {/* CẬP NHẬT phần Tk nợ */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      {/* Label */}
                      <Label className="text-xs col-span-2">Tk nợ</Label>

                      {/* Input chọn tài khoản */}
                      <div className="relative col-span-6">
                        <Input
                          value={maTaiKhoanSearch}
                          onChange={e => {
                            const value = e.target.value;
                            setMaTaiKhoanSearch(value);
                            handleChange("tk", value);
                            // Hiển thị popup khi có giá trị
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

                      {/* Text hiển thị tên tài khoản động */}
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

              {/* Khung phải - Chứng từ */}
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
                        <div className="relative flex-1 ">
                          <Flatpickr
                            value={formData.ngay_lct}
                            onChange={(date) => handleDateChange(date, "ngay_lct")}
                            options={FLATPICKR_OPTIONS}
                            placeholder="Chọn ngày lập chứng từ"
                            className="w-full h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                          <CalenderIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div></div>
                      <div className="col-span-1"></div>
                    </div>
                    {/* Quyển số */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Quyển số</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.ma_qs}
                          onChange={e => handleChange("ma_qs", e.target.value)}
                          className="h-8 text-sm col-span-8 bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    {/* Số phiếu thu */}
                    <div className="grid grid-cols-12 items-center gap-2">
                      <Label className="text-xs col-span-6 text-left">Số phiếu thu</Label>
                      <div className="col-span-5">
                        <Input
                          value={formData.so_ct}
                          onChange={e => handleChange("so_ct", e.target.value)}
                          className="h-8 text-sm col-span-8 bg-white"
                        />
                      </div>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-2">
                      {/* Label TGGD */}
                      <Label className="text-xs col-span-4 text-left">TGGD</Label>

                      {/* Select VND (4 phần) */}
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

                      {/* Input tỷ giá (5 phần còn lại) */}
                      <div className="col-span-5">
                        <Input
                          value={formData.ty_gia}
                          onChange={e => handleChange("ty_gia", e.target.value)}
                          disabled
                          placeholder="1,00"
                          className="h-8 w-full text-sm text-right bg-gray-50 dark:bg-gray-800 bg-white"
                        />
                      </div>
                    </div>

                    {/* Trạng thái */}
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

          {/* Phần 2: Hạch toán - 40% chiều cao */}
          {/* Tabs */}
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
                          // QUAN TRỌNG: Truyền event và ngăn form submit
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
                // Xử lý thêm dòng dựa trên tab đang active
                if (activeTab === 0) {
                  addHachToanRow(); // Tab Hạch toán
                } else if (activeTab === 1) {
                  addHopDongThueRow(); // Tab Hợp đồng thuế
                }
              }}
            />
          </div>
        </div>

        {/* Footer buttons - CỐ ĐỊNH */}
        <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 justify-end bg-gray-50 dark:bg-gray-800 flex-shrink-0 rounded-b-3xl">
          <button
            type="button" // QUAN TRỌNG: Thêm type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-sm font-medium text-white dark:text-gray-700 bg-red-600 border border-gray-300 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Hủy bỏ
          </button>
          <button
            type="button" // QUAN TRỌNG: Thêm type="button"
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
    </Modal>
  );
};