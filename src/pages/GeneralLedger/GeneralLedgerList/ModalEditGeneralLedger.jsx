import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Calendar, Edit3, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";
import { Tabs } from "../../../components/ui/tabs";
import { useAccounts } from "../../../hooks/useAccounts";
import { useCustomers } from "../../../hooks/useCustomer";
import { useGetGeneralAccountingById, useUpdateGeneralAccounting } from "../../../hooks/useGeneralAccounting";
import { CalenderIcon } from "../../../icons";

// Constants
const STATUS_OPTIONS = [
  { value: "1", label: "Đã ghi sổ cái" },
  { value: "2", label: "Chưa ghi sổ cái" },
];

const FLATPICKR_OPTIONS = {
  dateFormat: "Y-m-d",
  locale: Vietnamese,
};

const INITIAL_ACCOUNTING_ROW = {
  id: 1,
  stt_rec: "1",
  tk_i: "",
  ten_tk: "",
  ps_no: "",
  ps_co: "",
  nh_dk: "",
  dien_giaii: "",
};

const INITIAL_TAX_CONTRACT_ROW = {
  id: 1,
  so_seri0: "",
  ma_kh: "",
  ten_kh: "",
};

export const ModalEditGeneralLedger = ({ isOpenEdit, closeModalEdit, stt_rec }) => {
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

  const [hachToanData, setHachToanData] = useState([INITIAL_ACCOUNTING_ROW]);
  const [hopDongThueData, setHopDongThueData] = useState([INITIAL_TAX_CONTRACT_ROW]);

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
  const { data: recordData, isLoading: isLoadingRecord } = useGetGeneralAccountingById(stt_rec);
  const { data: accountRawData = {} } = useAccounts(
    searchStates.tkSearch ? { search: searchStates.tkSearch } : {}
  );
  const { data: customerData = [] } = useCustomers(
    searchStates.maKhSearch ? { search: searchStates.maKhSearch } : {}
  );
  const { mutateAsync: updateAccounting, isPending: isUpdating } = useUpdateGeneralAccounting();

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

  // Hàm lấy tên tài khoản từ API khi load data
  const fetchAccountName = useCallback(async (tk_i) => {
    if (!tk_i) return "";
    try {
      // Gọi API lấy thông tin tài khoản theo mã
      const response = await fetch(`/api/accounts/by-code/${tk_i}`);
      if (response.ok) {
        const account = await response.json();
        return account.ten_tk || "";
      }
    } catch (error) {
      console.error("Lỗi khi lấy tên tài khoản:", error);
    }
    return "";
  }, []);

  // Load data when record is fetched
  useEffect(() => {
    if (recordData?.phieu) {
      const { phieu, hachToan = [], hopDongThue = [] } = recordData;

      // Set form data from phieu
      setFormData({
        ngayHachToan: phieu.ngay_ct ? phieu.ngay_ct.split("T")[0] : "",
        ngayLapChungTu: phieu.ngay_lct ? phieu.ngay_lct.split("T")[0] : "",
        quyenSo: phieu.ma_ct?.trim() || "",
        soChungTu: phieu.so_ct?.trim() || "",
        tyGia: phieu.ty_giaf || 0,
        // Sửa lại mapping trạng thái
        trangThai: phieu.trang_thai || phieu.status || "1",
        dienGiaiChung: phieu.dien_giai || "",
      });

      // Set accounting data và lấy tên tài khoản
      if (hachToan.length > 0) {
        const loadAccountNames = async () => {
          const updatedHachToan = await Promise.all(
            hachToan.map(async (item, index) => {
              const ten_tk = item.ten_tk || await fetchAccountName(item.tk_i);
              return {
                id: index + 1,
                stt_rec: (index + 1).toString(),
                tk_i: item.tk_i?.trim() || "",
                ten_tk: ten_tk,
                ps_no: item.ps_no || "",
                ps_co: item.ps_co || "",
                nh_dk: item.nh_dk?.trim() || "",
                dien_giaii: item.dien_giaii || "",
              };
            })
          );
          setHachToanData(updatedHachToan);
        };
        loadAccountNames();
      }

      // Set tax contract data
      if (hopDongThue.length > 0) {
        setHopDongThueData(
          hopDongThue.map((item, index) => ({
            id: index + 1,
            so_seri0: item.so_seri0 || "",
            ma_kh: item.ma_kh || "",
            ten_kh: item.ten_kh || "",
          }))
        );
      }
    }
  }, [recordData, fetchAccountName]);

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
    setHachToanData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

    if (field === "tk_i") {
      setSearchStates(prev => ({
        ...prev,
        tkSearch: value,
        tkSearchRowId: id
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
    setHopDongThueData(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ma_kh: customer.ma_kh, ten_kh: customer.ten_kh }
          : item
      )
    );
    setSearchStates(prev => ({
      ...prev,
      showCustomerPopup: false,
      maKhSearch: ""
    }));
  }, []);

  const addHachToanRow = useCallback(() => {
    setHachToanData(prev => [
      ...prev,
      {
        id: prev.length + 1,
        stt_rec: (prev.length + 1).toString(),
        tk_i: "",
        ten_tk: "",
        ps_no: "",
        ps_co: "",
        nh_dk: "",
        dien_giaii: "",
      },
    ]);
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

  const handleUpdate = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        phieu: {
          ma_ct: formData.quyenSo,
          so_ct: formData.soChungTu,
          ngay_lct: formData.ngayLapChungTu,
          ps_no: totals.totalPsNo,
          ps_co: totals.totalPsCo,
          dien_giai: formData.dienGiaiChung,
          ty_giaf: Number(formData.tyGia),
          trang_thai: formData.trangThai,
        },
        hachToan: hachToanData
          .filter(row => row.tk_i && (parseFloat(row.ps_no) > 0 || parseFloat(row.ps_co) > 0))
          .map(({ tk_i, ps_no, ps_co, nh_dk, dien_giaii }) => ({
            tk_i,
            ps_no: Number(ps_no || 0),
            ps_co: Number(ps_co || 0),
            nh_dk,
            dien_giaii,
          })),
        hopDongThue: hopDongThueData
          .filter(row => row.so_seri0 || row.ma_kh)
          .map(({ so_seri0, ma_kh, ten_kh }) => ({
            so_seri0,
            ma_kh,
            ten_kh,
          })),
      };

      await updateAccounting({ stt_rec, payload });
      closeModalEdit();
      toast.success("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật: " + (err?.message || "Không xác định"));
    }
  }, [formData, hachToanData, hopDongThueData, totals, updateAccounting, stt_rec, closeModalEdit, navigate, validateForm]);

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
      width: 200,
      fixed: "left",
      render: (val, row) => {
        if (row.id === 'total') {
          return <div className="font-bold text-gray-900">TỔNG CỘNG</div>;
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
      width: 250,
      render: (val, row) => (
        <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'}`}>
          {row.ten_tk}
        </div>
      )
    },
    {
      key: "ps_no",
      title: "PS Nợ",
      width: 200,
      render: (val, row) => {
        if (row.id === 'total') {
          return (
            <div className="text-right font-bold text-lg text-blue-600 bg-blue-50 p-2 rounded">
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
      width: 200,
      render: (val, row) => {
        if (row.id === 'total') {
          return (
            <div className="text-right font-bold text-lg text-green-600 bg-green-50 p-2 rounded">
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
      width: 200,
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

  // Loading state
  if (isLoadingRecord) {
    return (
      <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-orange-100 rounded-full"></div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            Đang tải dữ liệu
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Vui lòng chờ trong giây lát...
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpenEdit} onClose={closeModalEdit} className="w-full max-w-7xl h-[90vh] m-4">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 px-6 lg:px-8 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-orange-600" />
                Cập nhật phiếu kế toán
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Chỉnh sửa thông tin phiếu kế toán #{stt_rec}
              </p>
            </div>
            <button
              onClick={closeModalEdit}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isUpdating}
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
                <Calendar className="w-5 h-5 text-orange-600" />
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
                      className="w-full h-11 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                      className="w-full h-11 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500">
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
                <span className="font-medium">Cảnh báo: Tổng PS Nợ và PS Có chưa cân đối!</span>
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
                      {/* Nút thêm dòng */}
                      <div className="mb-4">
                        <button
                          onClick={addHachToanRow}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Thêm dòng
                        </button>
                      </div>

                      {/* Bảng hạch toán */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              {hachToanColumns.map((col) => (
                                <th
                                  key={col.key}
                                  className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900"
                                  style={{ width: col.width }}
                                >
                                  {col.title}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {hachToanDataWithTotal.map((row, index) => (
                              <tr
                                key={row.id}
                                className={row.id === 'total' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'}
                              >
                                {hachToanColumns.map((col) => (
                                  <td
                                    key={col.key}
                                    className="border border-gray-300 px-2 py-2"
                                    style={{ width: col.width }}
                                  >
                                    {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ),
                },
                {
                  label: "Hợp đồng thuế",
                  content: (
                    <div className="">
                      {/* Nút thêm dòng */}
                      <div className="mb-4">
                        <button
                          onClick={addHopDongThueRow}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Thêm dòng
                        </button>
                      </div>

                      {/* Bảng hợp đồng thuế */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-gray-50">
                              {hopDongThueColumns.map((col) => (
                                <th
                                  key={col.key}
                                  className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900"
                                  style={{ width: col.width }}
                                >
                                  {col.title}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {hopDongThueData.map((row, index) => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                {hopDongThueColumns.map((col) => (
                                  <td
                                    key={col.key}
                                    className="border border-gray-300 px-2 py-2"
                                    style={{ width: col.width }}
                                  >
                                    {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
              onClick={closeModalEdit}
              disabled={isUpdating}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
              Hủy bỏ
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className={`px-6 py-2.5 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Cập nhật
                </>
              )}
            </button>
          </div>
        </div>

        {/* Popups */}
        {searchStates.showAccountPopup && accountRawData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Chọn tài khoản</h3>
              <div className="space-y-2">
                {accountRawData.data?.map((account) => (
                  <div
                    key={account.tk}
                    onClick={() => handleAccountSelect(searchStates.tkSearchRowId, account)}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded border"
                  >
                    <div className="font-medium">{account.tk}</div>
                    <div className="text-sm text-gray-600">{account.ten_tk}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSearchStates(prev => ({ ...prev, showAccountPopup: false }))}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {searchStates.showCustomerPopup && customerData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Chọn khách hàng</h3>
              <div className="space-y-2">
                {customerData.data?.map((customer) => (
                  <div
                    key={customer.ma_kh}
                    onClick={() => handleCustomerSelect(searchStates.maKhSearchRowId, customer)}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded border"
                  >
                    <div className="font-medium">{customer.ma_kh}</div>
                    <div className="text-sm text-gray-600">{customer.ten_kh}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSearchStates(prev => ({ ...prev, showCustomerPopup: false }))}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};