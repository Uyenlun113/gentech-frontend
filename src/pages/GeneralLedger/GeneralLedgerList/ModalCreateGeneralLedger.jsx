import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Calendar, Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import AccountSelectionPopup from "../../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../../components/general/CustomerSelectionPopup";
import TableBasic from "../../../components/tables/BasicTables/BasicTableOne";
import { Modal } from "../../../components/ui/modal";
import { Tabs } from "../../../components/ui/tabs";
import { useAccounts } from "../../../hooks/useAccounts";
import { useCustomers } from "../../../hooks/useCustomer";
import { useSaveGeneralAccounting } from "../../../hooks/useGeneralAccounting";
import { CalenderIcon } from "../../../icons";

// Constants
const INITIAL_ACCOUNTING_DATA = [
  {
    id: 1,
    stt_rec: "1",
    tk_i: "",
    ten_tk: "",
    ma_kh: "",
    ten_kh: "",
    ps_no: "",
    ps_co: "",
    nh_dk: "",
    dien_giaii: ""
  },
];

const INITIAL_TAX_CONTRACT_DATA = [
  {
    id: 1,
    so_seri0: "",
    ma_kh: "",
    ten_kh: ""
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

export const ModalCreateGeneralLedger = ({ isOpenCreate, closeModalCreate }) => {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    ngayHachToan: "",
    ngayLapChungTu: "",
    quyenSo: "",
    soChungTu: "",
    tyGia: 0,
    trangThai: "1",
    dienGiaiChung: "",
  });

  const [hachToanData, setHachToanData] = useState(INITIAL_ACCOUNTING_DATA);
  const [hopDongThueData, setHopDongThueData] = useState(INITIAL_TAX_CONTRACT_DATA);

  // Search states
  const [searchStates, setSearchStates] = useState({
    tkSearch: "",
    tkSearchRowId: null,
    maKhSearch: "",
    maKhSearchRowId: null,
    showAccountPopup: false,
    showCustomerPopup: false,
  });

  // Hooks
  const { data: accountRawData = {} } = useAccounts(
    searchStates.tkSearch ? { search: searchStates.tkSearch } : {}
  );
  const { data: customerData = [] } = useCustomers(
    searchStates.maKhSearch ? { search: searchStates.maKhSearch } : {}
  );
  const { mutateAsync: saveAccounting, isPending } = useSaveGeneralAccounting();

  // Tính tổng PS Nợ và PS Có
  const totals = useMemo(() => {
    const totalPsNo = hachToanData.reduce((sum, item) => {
      const value = parseFloat(item.ps_no) || 0;
      return sum + value;
    }, 0);

    const totalPsCo = hachToanData.reduce((sum, item) => {
      const value = parseFloat(item.ps_co) || 0;
      return sum + value;
    }, 0);

    return { totalPsNo, totalPsCo };
  }, [hachToanData]);

  // Debounced search effects
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

  const handleHachToanChange = useCallback((id, field, value) => {
    setHachToanData(prev => {
      // Cập nhật giá trị cho dòng hiện tại
      const newData = prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );

      // Auto-fill logic khi nhập vào dòng đầu tiên (id === 1)
      if (id === 1) {
        // Fill mã khách hàng, tên khách hàng, NH ĐK xuống các dòng sau
        if (field === "ma_kh" || field === "ten_kh" || field === "nh_dk") {
          return newData.map((item, index) => {
            if (index === 0) return item; // Giữ nguyên dòng đầu
            return { ...item, [field]: value }; // Fill xuống các dòng sau
          });
        }
      }

      // Auto-fill PS cho dòng chẵn khi nhập PS ở dòng lẻ
      if ((field === "ps_no" || field === "ps_co") && id % 2 === 1) { // Dòng lẻ (1, 3, 5...)
        const nextRowId = id + 1;
        const currentRow = newData.find(item => item.id === id);
        const psNo = parseFloat(currentRow?.ps_no) || 0;
        const psCo = parseFloat(currentRow?.ps_co) || 0;

        // Cập nhật dòng chẵn liền sau nếu tồn tại
        return newData.map(item => {
          if (item.id === nextRowId) {
            return {
              ...item,
              ps_no: psCo > 0 ? String(psCo) : "",
              ps_co: psNo > 0 ? String(psNo) : ""
            };
          }
          return item;
        });
      }

      return newData;
    });

    // Handle search for account
    if (field === "tk_i") {
      setSearchStates(prev => ({
        ...prev,
        tkSearch: value,
        tkSearchRowId: id
      }));
    }

    // Handle search for customer in accounting tab
    if (field === "ma_kh") {
      setSearchStates(prev => ({
        ...prev,
        maKhSearch: value,
        maKhSearchRowId: id
      }));
    }
  }, []);

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
        maKhSearchRowId: id
      }));
    }
  }, []);

  const handleAccountSelect = useCallback((id, account) => {
    setHachToanData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, tk_i: account.tk.trim(), ten_tk: account.ten_tk }
          : item
      )
    );
    setSearchStates(prev => ({
      ...prev,
      showAccountPopup: false,
      tkSearch: ""
    }));
  }, []);

  const handleCustomerSelect = useCallback((id, customer) => {
    // Kiểm tra xem có phải từ tab hạch toán không
    const isFromAccounting = hachToanData.some(item => item.id === id);

    if (isFromAccounting) {
      // Cập nhật bảng hạch toán
      setHachToanData(prev =>
        prev.map((item, index) => {
          if (item.id === id) {
            return { ...item, ma_kh: customer.ma_kh, ten_kh: customer.ten_kh };
          }
          // Nếu đang cập nhật dòng đầu tiên, fill xuống các dòng sau
          if (id === 1 && index > 0) {
            return { ...item, ma_kh: customer.ma_kh, ten_kh: customer.ten_kh };
          }
          return item;
        })
      );
    } else {
      // Cập nhật bảng hợp đồng thuế
      setHopDongThueData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ma_kh: customer.ma_kh, ten_kh: customer.ten_kh }
            : item
        )
      );
    }

    setSearchStates(prev => ({
      ...prev,
      showCustomerPopup: false,
      maKhSearch: ""
    }));
  }, [hachToanData]);

  const addHachToanRow = useCallback(() => {
    setHachToanData(prev => {
      const newRowId = prev.length + 1;
      const isEvenRow = newRowId % 2 === 0; // Dòng chẵn (2, 4, 6...)

      const newRow = {
        id: newRowId,
        stt_rec: newRowId.toString(),
        tk_i: "",
        ten_tk: "",
        ma_kh: prev.length > 0 ? prev[0].ma_kh : "", // Fill mã KH từ dòng đầu
        ten_kh: prev.length > 0 ? prev[0].ten_kh : "", // Fill tên KH từ dòng đầu
        ps_no: "",
        ps_co: "",
        nh_dk: prev.length > 0 ? prev[0].nh_dk : "", // Fill NH ĐK từ dòng đầu
        dien_giaii: "",
      };

      // Nếu là dòng chẵn (2, 4, 6...), tự động đảo ngược PS của dòng liền trước
      if (isEvenRow && prev.length > 0) {
        const previousRow = prev[prev.length - 1];
        const prevPsNo = parseFloat(previousRow?.ps_no) || 0;
        const prevPsCo = parseFloat(previousRow?.ps_co) || 0;

        newRow.ps_no = prevPsCo > 0 ? String(prevPsCo) : "";
        newRow.ps_co = prevPsNo > 0 ? String(prevPsNo) : "";
      }
      // Nếu là dòng lẻ (1, 3, 5...), để trống PS cho user tự nhập

      return [...prev, newRow];
    });
  }, []);

  const deleteHachToanRow = useCallback((id) => {
    setHachToanData(prev => prev.filter(item => item.id !== id));
  }, []);

  const addHopDongThueRow = useCallback(() => {
    setHopDongThueData(prev => [
      ...prev,
      { id: prev.length + 1, so_seri0: "", ma_kh: "", ten_kh: "" }
    ]);
  }, []);

  const deleteHopDongThueRow = useCallback((id) => {
    setHopDongThueData(prev => prev.filter(item => item.id !== id));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      ngayHachToan: "",
      ngayLapChungTu: "",
      quyenSo: "",
      soChungTu: "",
      tyGia: 0,
      trangThai: "1",
      dienGiaiChung: "",
    });
    setHachToanData(INITIAL_ACCOUNTING_DATA);
    setHopDongThueData(INITIAL_TAX_CONTRACT_DATA);
    setSearchStates({
      tkSearch: "",
      tkSearchRowId: null,
      maKhSearch: "",
      maKhSearchRowId: null,
      showAccountPopup: false,
      showCustomerPopup: false,
    });
  }, []);

  const validateForm = useCallback(() => {
    // Kiểm tra các trường bắt buộc
    if (!formData.ngayHachToan) {
      toast.error("Vui lòng nhập ngày hạch toán");
      return false;
    }
    if (!formData.ngayLapChungTu) {
      toast.error("Vui lòng nhập ngày lập chứng từ");
      return false;
    }
    if (!formData.soChungTu) {
      toast.error("Vui lòng nhập số chứng từ");
      return false;
    }

    // Kiểm tra cân đối PS Nợ và PS Có
    if (Math.abs(totals.totalPsNo - totals.totalPsCo) > 0.01) {
      toast.error("Tổng PS Nợ và PS Có phải bằng nhau!");
      return false;
    }

    // Kiểm tra ít nhất có 1 dòng hạch toán hợp lệ
    const validAccountingRows = hachToanData.filter(row =>
      row.tk_i && (parseFloat(row.ps_no) > 0 || parseFloat(row.ps_co) > 0)
    );
    if (validAccountingRows.length === 0) {
      toast.error("Vui lòng nhập ít nhất một dòng hạch toán hợp lệ");
      return false;
    }

    return true;
  }, [formData, totals, hachToanData]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        phieu: {
          ma_qs: formData.quyenSo,
          so_ct: formData.soChungTu,
          ngay_lct: formData.ngayLapChungTu,
          ps_no: totals.totalPsNo,
          ps_co: totals.totalPsCo,
          nh_dk: hachToanData[0]?.nh_dk || "",
          dien_giai: formData.dienGiaiChung,
          ty_giaf: formData.tyGia,
        },
        hachToan: hachToanData
          .filter(row => row.tk_i && (parseFloat(row.ps_no) > 0 || parseFloat(row.ps_co) > 0))
          .map(({ tk_i, ps_no, ps_co, nh_dk, dien_giaii, ma_kh }) => ({
            tk_i,
            ps_no: Number(ps_no) || 0,
            ps_co: Number(ps_co) || 0,
            nh_dk,
            dien_giaii,
            ma_kh,
          })),
        hopDongThue: hopDongThueData
          .filter(row => row.so_seri0 || row.ma_kh)
          .map(({ so_seri0, ma_kh, ten_kh }) => ({
            so_seri0,
            ma_kh,
            ten_kh,
          })),
      };

      await saveAccounting(payload);
      closeModalCreate();
      toast.success("Lưu thành công!");
      resetForm();
      navigate("/general-ledger/list");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu: " + (err?.message || "Không xác định"));
    }
  }, [formData, hachToanData, hopDongThueData, totals, saveAccounting, closeModalCreate, resetForm, navigate, validateForm]);

  const handleClose = useCallback(() => {
    resetForm();
    closeModalCreate();
  }, [resetForm, closeModalCreate]);

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
      key: "ma_kh",
      title: "Mã khách hàng",
      width: 150,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.ma_kh}
            onChange={(e) => handleHachToanChange(row.id, "ma_kh", e.target.value)}
            placeholder="Nhập mã KH..."
            className="w-full"
          />
        );
      },
    },
    {
      key: "ten_kh",
      title: "Tên khách hàng",
      width: 200,
      render: (val, row) => (
        <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
          {row.ten_kh}
        </div>
      )
    },
    {
      key: "ps_no",
      title: "PS Nợ",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') {
          return (
            <div className="text-right text-lg text-blue-600 p-2 rounded">
              {totals.totalPsNo.toLocaleString('vi-VN')}
            </div>
          );
        }
        return (
          <Input
            type="number"
            value={row.ps_no}
            onChange={(e) => handleHachToanChange(row.id, "ps_no", e.target.value)}
            placeholder="0"
            className="w-full text-right"
          />
        );
      },
    },
    {
      key: "ps_co",
      title: "PS Có",
      width: 120,
      render: (val, row) => {
        if (row.id === 'total') {
          return (
            <div className="text-right text-lg text-green-600 p-2 rounded">
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
      key: "nh_dk",
      title: "NH ĐK",
      width: 150,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.nh_dk}
            onChange={(e) => handleHachToanChange(row.id, "nh_dk", e.target.value)}
            placeholder="Nhập NH ĐK..."
            className="w-full"
          />
        );
      },
    },
    {
      key: "dien_giaii",
      title: "Diễn giải",
      width: 200,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.dien_giaii}
            onChange={(e) => handleHachToanChange(row.id, "dien_giaii", e.target.value)}
            placeholder="Diễn giải..."
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
          <button
            onClick={() => deleteHachToanRow(row.id)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa dòng"
          >
            <Trash2 size={18} />
          </button>
        );
      },
    },
  ];

  // Thêm dòng tổng vào data
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
        ps_no: totals.totalPsNo,
        ps_co: totals.totalPsCo,
        nh_dk: '',
        dien_giaii: ''
      }
    ];
  }, [hachToanData, totals]);

  const hopDongThueColumns = [
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
        <div className="text-gray-800 font-medium">
          {row.ten_kh}
        </div>
      )
    },
    {
      key: "action",
      title: "Hành động",
      width: 100,
      render: (_, row) => (
        <button
          onClick={() => deleteHopDongThueRow(row.id)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          title="Xóa dòng"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ];

  return (
    <Modal isOpen={isOpenCreate} onClose={closeModalCreate} className="w-full max-w-7xl h-[90vh] m-4">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 px-6 lg:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Tạo phiếu kế toán
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin phiếu kế toán mới vào hệ thống
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
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Form thông tin cơ bản */}
          <ComponentCard className="shadow-lg border-0">
            <div className="">
              <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Thông tin cơ bản
              </h5>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày hạch toán <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Flatpickr
                      value={formData.ngayHachToan}
                      onChange={(date) => handleDateChange(date, "ngayHachToan")}
                      options={FLATPICKR_OPTIONS}
                      placeholder="Chọn ngày hạch toán"
                      className="w-full h-11 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <CalenderIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày lập chứng từ <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Flatpickr
                      value={formData.ngayLapChungTu}
                      onChange={(date) => handleDateChange(date, "ngayLapChungTu")}
                      options={FLATPICKR_OPTIONS}
                      placeholder="Chọn ngày lập chứng từ"
                      className="w-full h-11 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <CalenderIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quyển sổ
                  </Label>
                  <Input
                    value={formData.quyenSo}
                    onChange={(e) => handleFormChange("quyenSo", e.target.value)}
                    placeholder="Nhập quyển sổ..."
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Số chứng từ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.soChungTu}
                    onChange={(e) => handleFormChange("soChungTu", e.target.value)}
                    placeholder="Nhập số chứng từ..."
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tỷ giá
                  </Label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <span className="px-4 py-2.5 bg-gray-50 text-gray-700 font-medium border-r border-gray-300 text-sm">
                      VND
                    </span>
                    <input
                      type="number"
                      value={formData.tyGia}
                      onChange={(e) => handleFormChange("tyGia", e.target.value)}
                      placeholder="0"
                      className="flex-1 px-4 py-2.5 text-sm text-gray-900 focus:outline-none dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </Label>
                  <Select
                    value={formData.trangThai}
                    options={STATUS_OPTIONS}
                    onChange={(value) => handleFormChange("trangThai", value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Diễn giải
                </Label>
                <TextArea
                  value={formData.dienGiaiChung}
                  onChange={(val) => handleFormChange("dienGiaiChung", val)}
                  rows={4}
                  placeholder="Nhập diễn giải chung..."
                  className="w-full resize-none"
                />
              </div>
            </div>
          </ComponentCard>

          {/* Hiển thị cảnh báo nếu không cân đối */}
          {Math.abs(totals.totalPsNo - totals.totalPsCo) > 0.01 && (
            <div className="mx-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Tổng ps nợ phải bằng ps có!</span>
              </div>
              <p className="mt-1 text-sm text-red-600">
                PS Nợ: {totals.totalPsNo.toLocaleString('vi-VN')} | PS Có: {totals.totalPsCo.toLocaleString('vi-VN')} |
                Chênh lệch: {Math.abs(totals.totalPsNo - totals.totalPsCo).toLocaleString('vi-VN')}
              </p>
            </div>
          )}

          {/* Tabs */}
          <ComponentCard className="shadow-lg border-0">
            <Tabs
              tabs={[
                {
                  label: "Hạch toán",
                  content: (
                    <div className="">
                      <TableBasic
                        data={hachToanDataWithTotal}
                        columns={hachToanColumns}
                        onAddRow={addHachToanRow}
                        onDeleteRow={deleteHachToanRow}
                        showAddButton={true}
                        addButtonText="Thêm dòng"
                        className="w-full"
                      />
                    </div>
                  ),
                },
                {
                  label: "Hợp đồng thuế",
                  content: (
                    <div className="">
                      <TableBasic
                        data={hopDongThueData}
                        columns={hopDongThueColumns}
                        onAddRow={addHopDongThueRow}
                        onDeleteRow={deleteHopDongThueRow}
                        showAddButton={true}
                        addButtonText="Thêm dòng"
                        className="w-full"
                      />
                    </div>
                  ),
                },
              ]}
            />
          </ComponentCard>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
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

        {searchStates.showCustomerPopup && (
          <CustomerSelectionPopup
            isOpen={true}
            onClose={() => setSearchStates(prev => ({ ...prev, showCustomerPopup: false }))}
            onSelect={(customer) => handleCustomerSelect(searchStates.maKhSearchRowId, customer)}
            customers={customerData.data || []}
            searchValue={searchStates.maKhSearch}
          />
        )}
      </div>
    </Modal>
  );
};