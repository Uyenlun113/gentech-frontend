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
import { useSaveGeneralAccounting } from "../../../hooks/useGeneralAccounting";
import { CalenderIcon } from "../../../icons";

// Constants
const INITIAL_ACCOUNTING_DATA = [
  {
    id: 1,
    stt_rec: "1",
    tk_i: "",
    ten_tk: "",
    ma_kh_i: "",
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
    so_ct0: "",
    ma_ms: "",
    kh_mau_hd: "",
    so_seri0: "",
    ngay_ct0: "",
    ma_kh: "",
    ten_kh: "",
    dia_chi: "",
    ma_so_thue: "",
    ten_vt: "",
    t_tien: "",
    ma_thue: "",
    thue_suat: "",
    t_tt: "",
    t_thue: "",
    tk_thue_no: "",
    tk_du: ""
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

  const [formData, setFormData] = useState({
    ngayHachToan: "",
    ngayLapChungTu: "",
    quyenSo: "",
    soChungTu: "",
    tyGia: 1,
    trangThai: "1",
    dienGiaiChung: "",
  });

  const [hachToanData, setHachToanData] = useState(INITIAL_ACCOUNTING_DATA);
  const [hopDongThueData, setHopDongThueData] = useState(INITIAL_TAX_CONTRACT_DATA);

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

  const hachToanTableRef = useRef(null);
  const hopDongThueTableRef = useRef(null);

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

  // UPDATED: Handlers with auto-fill description logic
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

  // UPDATED: handleHachToanChange với two-way sync cho diễn giải
  const handleHachToanChange = useCallback((id, field, value) => {
    setHachToanData(prev => {
      // Cập nhật giá trị cho dòng hiện tại
      const newData = prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );

      if (id === 1) {
        // Auto-fill từ dòng đầu tiên xuống các dòng khác
        if (field === "ma_kh_i" || field === "ten_kh" || field === "nh_dk") {
          return newData.map((item, index) => {
            if (index === 0) return item;
            return { ...item, [field]: value };
          });
        }

        // NEW: Two-way sync cho diễn giải
        if (field === "dien_giaii") {
          // Cập nhật "Diễn giải chung" ở đầu phiếu
          setFormData(prevForm => ({
            ...prevForm,
            dienGiaiChung: value
          }));

          // Fill xuống tất cả dòng khác
          return newData.map((item, index) => {
            if (index === 0) return item; // Giữ nguyên dòng đầu
            return { ...item, dien_giaii: value }; // Fill xuống các dòng khác
          });
        }
      }

      // Auto-reverse PS logic
      if ((field === "ps_no" || field === "ps_co") && id % 2 === 1) {
        const nextRowId = id + 1;
        const currentRow = newData.find(item => item.id === id);
        const psNo = parseFloat(currentRow?.ps_no) || 0;
        const psCo = parseFloat(currentRow?.ps_co) || 0;
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

  const handleAccountSelect = useCallback((id, account) => {
    if (searchStates.tkSearchField === "tk_i") {
      setHachToanData(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, tk_i: account.tk.trim(), ten_tk: account.ten_tk }
            : item
        )
      );
    } else {
      const fieldToUpdate = searchStates.tkSearchField || "tk_thue_no";
      setHopDongThueData(prev =>
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
      tkSearchField: null
    }));
  }, [searchStates.tkSearchField]);

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

  // UPDATED: addHachToanRow với auto-fill diễn giải
  const addHachToanRow = useCallback(() => {
    setHachToanData(prev => {
      const newRowId = prev.length + 1;
      const isEvenRow = newRowId % 2 === 0;

      const newRow = {
        id: newRowId,
        stt_rec: newRowId.toString(),
        tk_i: "",
        ten_tk: "",
        ma_kh_i: prev.length > 0 ? prev[0].ma_kh_i : "",
        ten_kh: prev.length > 0 ? prev[0].ten_kh : "",
        ps_no: "",
        ps_co: "",
        nh_dk: prev.length > 0 ? prev[0].nh_dk : "",
        dien_giaii: formData.dienGiaiChung || "",
      };

      if (isEvenRow && prev.length > 0) {
        const previousRow = prev[prev.length - 1];
        const prevPsNo = parseFloat(previousRow?.ps_no) || 0;
        const prevPsCo = parseFloat(previousRow?.ps_co) || 0;

        newRow.ps_no = prevPsCo > 0 ? String(prevPsCo) : "";
        newRow.ps_co = prevPsNo > 0 ? String(prevPsNo) : "";
      }

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
  }, [formData.dienGiaiChung]); // Thêm dependency

  const deleteHachToanRow = useCallback((id) => {
    setHachToanData(prev => prev.filter(item => item.id !== id));
  }, []);

  const addHopDongThueRow = useCallback(() => {
    setHopDongThueData(prev => [
      ...prev,
      {
        id: prev.length + 1,
        so_ct0: "",
        ma_ms: "",
        kh_mau_hd: "",
        so_seri0: "",
        ngay_ct0: "",
        ma_kh: "",
        ten_kh: "",
        dia_chi: "",
        ma_so_thue: "",
        ten_vt: "",
        t_tien: "",
        ma_thue: "",
        thue_suat: "",
        t_thue: "",
        tk_thue_no: "",
        tk_du: ""
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
      tkSearchField: null,
      maKhSearch: "",
      maKhSearchRowId: null,
      searchContext: null,
      showAccountPopup: false,
      showCustomerPopup: false,
    });
  }, []);

  const validateForm = useCallback(() => {
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

    if (Math.abs(totals.totalPsNo - totals.totalPsCo) > 0.01) {
      toast.error("Tổng PS Nợ và PS Có phải bằng nhau!");
      return false;
    }

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
          ma_qs: formData.quyenSo?.trim() || "",
          so_ct: formData.soChungTu?.trim() || "",
          ngay_lct: formData.ngayLapChungTu,
          ps_no: totals.totalPsNo,
          ps_co: totals.totalPsCo,
          nh_dk: hachToanData[0]?.nh_dk?.trim() || "",
          dien_giai: formData.dienGiaiChung?.trim() || "",
          ty_giaf: formData.tyGia,
        },
        hachToan: hachToanData
          .filter(row => row.tk_i && (parseFloat(row.ps_no) > 0 || parseFloat(row.ps_co) > 0))
          .map(({ tk_i, ps_no, ps_co, nh_dk, dien_giaii, ma_kh_i }) => ({
            tk_i: tk_i?.trim() || "",
            ps_no: Number(ps_no) || 0,
            ps_co: Number(ps_co) || 0,
            nh_dk: nh_dk?.trim() || "",
            dien_giaii: dien_giaii?.trim() || "",
            ma_kh_i: ma_kh_i?.trim() || "",
          })),
        hopDongThue: hopDongThueData
          .filter(row => row.ma_kh || row.ma_ms)
          .map(({
            so_ct0, ma_ms, kh_mau_hd, so_seri0, ngay_ct0,
            ma_kh, ten_kh, dia_chi, ma_so_thue, ten_vt,
            t_tien, ma_thue, thue_suat, t_thue, tk_thue_no, tk_du, t_tt
          }) => ({
            so_ct0: so_ct0?.trim() || "",
            ma_ms: ma_ms?.trim() || "",
            kh_mau_hd: kh_mau_hd?.trim() || "",
            so_seri0: so_seri0?.trim() || "",
            ngay_ct0,
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
      await saveAccounting(payload);
      closeModalCreate();
      resetForm();
      navigate("/general-ledger/list");
    } catch (err) {
      console.error(err);
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
      key: "ma_kh_i",
      title: "Mã khách hàng",
      width: 150,
      render: (val, row) => {
        if (row.id === 'total') return <div></div>;
        return (
          <Input
            value={row.ma_kh_i}
            onChange={(e) => handleHachToanChange(row.id, "ma_kh_i", e.target.value)}
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
        <div className={`text-gray-800 ${row.id === 'total' ? 'font-bold' : 'font-medium'} `}>
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
            <div className="text-right text-[16px] text-blue-600 p-2 rounded px-7">
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
            <div className="text-right text-[16px] text-green-600 p-2 rounded  px-7">
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
            placeholder={formData.dienGiaiChung || "Diễn giải..."} // Hiển thị diễn giải chung làm placeholder
            className="w-full"
            title="Diễn giải sẽ đồng bộ với 'Diễn giải chung' ở đầu phiếu"
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
              onClick={() => deleteHachToanRow(row.id)}
              className=" text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa dòng"
            >
              <Trash2 size={18} />
            </button>
          </div>
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

  // Bảng hợp đồng thuế với tìm kiếm tài khoản
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
      key: "ngay_ct0",
      title: "Ngày hóa đơn",
      width: 150,
      render: (val, row) => (
        <div className="relative">
          <Flatpickr
            value={row.ngay_ct0 ? row.ngay_ct0.split("T")[0] : ""}
            onChange={(date) =>
              handleHopDongThueChange(row.id, "ngay_ct0", date?.[0]?.toISOString() || "")
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

  return (
    <Modal isOpen={isOpenCreate} onClose={closeModalCreate} className="w-full max-w-7xl m-4">
      <div className="relative w-full h-full rounded-3xl bg-blue-50 dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 p-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
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
            {/* <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button> */}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Form thông tin cơ bản */}
          <div className="border-0 px-6 py-2">
            {/* Grid với tỷ lệ 70-30 */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
              {/* Cột 1 - 70% */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex gap-2 items-center">
                  <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Số chứng từ <span className="text-red-500">*</span>
                  </Label>
                  <input
                    type="text"
                    value={formData.soChungTu}
                    onChange={(e) => handleFormChange("soChungTu", e.target.value)}
                    placeholder="Nhập số chứng từ..."
                    className="flex-1 h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Quyển sổ
                  </Label>
                  <input
                    type="text"
                    value={formData.quyenSo}
                    onChange={(e) => handleFormChange("quyenSo", e.target.value)}
                    placeholder="Nhập quyển sổ..."
                    className="flex-1 h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Ngày hạch toán <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex-1">
                    <Flatpickr
                      value={formData.ngayHachToan}
                      onChange={(date) => handleDateChange(date, "ngayHachToan")}
                      options={FLATPICKR_OPTIONS}
                      placeholder="Chọn ngày hạch toán"
                      className="w-full h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Ngày lập chứng từ <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative flex-1">
                    <Flatpickr
                      value={formData.ngayLapChungTu}
                      onChange={(date) => handleDateChange(date, "ngayLapChungTu")}
                      options={FLATPICKR_OPTIONS}
                      placeholder="Chọn ngày lập chứng từ"
                      className="w-full h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <CalenderIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Cột 2 - 30% */}
              <div className="lg:col-span-3 space-y-3">
                <div className="flex gap-2 items-center">
                  <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                    Tỷ giá
                  </Label>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-200 flex-1">
                    <span className="px-2 py-1.5 bg-gray-50 text-gray-700 font-medium border-r border-gray-300 text-xs">
                      VND
                    </span>
                    <input
                      type="number"
                      value={formData.tyGia}
                      onChange={(e) => handleFormChange("tyGia", e.target.value)}
                      placeholder="0"
                      className="flex-1 px-3 py-1.5 text-sm text-gray-900 focus:outline-none dark:bg-gray-800 dark:text-white border-none h-9"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                    Trạng thái
                  </Label>
                  <div className="flex-1">
                    <Select
                      defaultValue={formData.trangThai}
                      options={STATUS_OPTIONS}
                      onChange={(value) => handleFormChange("trangThai", value)}
                      className="w-full h-9 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Diễn giải chung - Full width */}
            <div className="flex gap-2 items-center mt-3">
              <Label className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                Diễn giải chung
              </Label>
              <input
                type="text"
                value={formData.dienGiaiChung}
                onChange={(e) => handleFormChange("dienGiaiChung", e.target.value)}
                placeholder="Nhập diễn giải chung (sẽ áp dụng cho tất cả dòng hạch toán)..."
                className="flex-1 h-9 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                title="Diễn giải này sẽ tự động điền vào tất cả dòng trong tab hạch toán"
              />
            </div>
          </div>

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
                // Xử lý thêm dòng dựa trên tab đang active
                if (activeTab === 0) {
                  addHachToanRow(); // Tab Hạch toán
                } else if (activeTab === 1) {
                  addHopDongThueRow(); // Tab Hợp đồng thuế
                }
              }}
              onChangeTab={(tabIndex) => {
                // Optional: xử lý khi đổi tab
                console.log('Changed to tab:', tabIndex);
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-white dark:text-gray-700 bg-red-600 border border-gray-300 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
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