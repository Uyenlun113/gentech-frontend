import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAccounts } from '../../hooks/useAccounts';
import { useCustomers } from "../../hooks/useCustomer";
import { useSaveGeneralAccounting } from "../../hooks/useGeneralAccounting.js";
import { CalenderIcon } from "../../icons";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Label from "../form/Label";
import Select from "../form/Select";
import TableBasic from "../tables/BasicTables/BasicTableOne";
import { Tabs } from "../ui/tabs";
import AccountSelectionPopup from "./AccountSelectionPopup";
import CustomerSelectionPopup from "./CustomerSelectionPopup";

export default function GeneralForm() {
  // Initial states
  const initialHachToanData = [
    { id: 1, stt_rec: '1', tk_i: '', ten_tk: '', ps_no: '', ps_co: '', nh_dk: '', dien_giaii: '' }
  ];
  const initialHopDongThueData = [{ id: 1, so_seri00: '', ma_kh: '', ten_kh: '' }];

  const [ngayHachToan, setNgayHachToan] = useState("");
  const [ngayLapChungTu, setNgayLapChungTu] = useState("");
  const [quyenSo, setQuyenSo] = useState("");
  const [soChungTu, setSoChungTu] = useState("");
  const [tyGia, setTyGia] = useState(0);
  const [trangThai, setTrangThai] = useState("");
  const [dienGiaiChung, setDienGiaiChung] = useState("");

  const [hachToanData, setHachToanData] = useState(initialHachToanData);
  const [hopDongThueData, setHopDongThueData] = useState(initialHopDongThueData);

  const [tkSearch, setTkSearch] = useState("");
  const [tkSearchRowId, setTkSearchRowId] = useState(null);
  const [maKhSearch, setMaKhSearch] = useState("");
  const [maKhSearchRowId, setMaKhSearchRowId] = useState(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);

  const { data: accountRawData = {} } = useAccounts(tkSearch ? { search: tkSearch } : {});
  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (tkSearch) {
        setShowAccountPopup(true);
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [tkSearch]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (maKhSearch) {
        setShowCustomerPopup(true);
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [maKhSearch]);

  const statusOptions = [
    { value: "1", label: "Đã ghi sổ cái" },
    { value: "0", label: "Chưa ghi sổ cái" },
  ];

  // Reset form function
  const resetForm = () => {
    setNgayHachToan("");
    setNgayLapChungTu("");
    setQuyenSo("");
    setSoChungTu("");
    setTyGia(0);
    setTrangThai("");
    setDienGiaiChung("");
    setHachToanData(initialHachToanData);
    setHopDongThueData(initialHopDongThueData);
    setTkSearch("");
    setTkSearchRowId(null);
    setMaKhSearch("");
    setMaKhSearchRowId(null);
    setShowAccountPopup(false);
    setShowCustomerPopup(false);
  };

  const handleDateChange = (date, field) => {
    const formattedDate = date[0]?.toLocaleDateString('en-CA');
    field === 'ngayHachToan' ? setNgayHachToan(formattedDate) : setNgayLapChungTu(formattedDate);
  };

  const handleHachToanChange = (id, field, value) => {
    setHachToanData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    if (field === 'tk_i') {
      setTkSearch(value);
      setTkSearchRowId(id);
    }
  };

  const handleAccountSelect = (id, account) => {
    setHachToanData(prev => prev.map(item =>
      item.id === id ? { ...item, tk_i: account.tk.trim(), ten_tk: account.ten_tk } : item
    ));
    setShowAccountPopup(false);
    setTkSearch("");
  };

  const addHachToanRow = () => setHachToanData(prev => [...prev, { id: prev.length + 1, stt_rec: (prev.length + 1).toString(), tk_i: '', ten_tk: '', ps_no: '', ps_co: '', nh_dk: '', dien_giaii: '' }]);
  const deleteHachToanRow = (id) => setHachToanData(prev => prev.filter(item => item.id !== id));

  const handleHopDongThueChange = (id, field, value) => {
    setHopDongThueData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    if (field === 'ma_kh') {
      setMaKhSearch(value);
      setMaKhSearchRowId(id);
    }
  };
  const navigate = useNavigate();
  const handleCustomerSelect = (id, customer) => {
    setHopDongThueData(prev => prev.map(item =>
      item.id === id ? { ...item, ma_kh: customer.ma_kh, ten_kh: customer.ten_kh } : item
    ));
    setShowCustomerPopup(false);
    setMaKhSearch("");
  };

  const addHopDongThueRow = () => setHopDongThueData(prev => [...prev, { id: prev.length + 1, so_seri00: '', ma_kh: '', ten_kh: '' }]);
  const deleteHopDongThueRow = (id) => setHopDongThueData(prev => prev.filter(item => item.id !== id));

  const hachToanColumns = [
    { key: "stt_rec", title: "STT", width: 80, render: (val, row) => row.stt_rec },
    {
      key: "tk_i", title: "Tài khoản", width: 200, render: (val, row) => (
        <Input
          value={row.tk_i}
          onChange={e => handleHachToanChange(row.id, 'tk_i', e.target.value)}
          placeholder="Nhập mã TK..."
        />
      )
    },
    { key: "ten_tk", title: "Tên tài khoản", width: 250, render: (val, row) => <span>{row.ten_tk}</span> },
    { key: "ps_no", title: "PS Nợ", width: 200, render: (val, row) => <Input type="number" value={row.ps_no} onChange={e => handleHachToanChange(row.id, 'ps_no', e.target.value)} /> },
    { key: "ps_co", title: "PS Có", width: 200, render: (val, row) => <Input type="number" value={row.ps_co} onChange={e => handleHachToanChange(row.id, 'ps_co', e.target.value)} /> },
    { key: "nh_dk", title: "NH ĐK", width: 200, render: (val, row) => <Input value={row.nh_dk} onChange={e => handleHachToanChange(row.id, 'nh_dk', e.target.value)} /> },
    { key: "dien_giaii", title: "Diễn giải", width: 200, render: (val, row) => <Input value={row.dien_giai} onChange={e => handleHachToanChange(row.id, 'dien_giaii', e.target.value)} /> },
    { key: "action", title: "Hành động", width: 100, render: (_, row) => <button onClick={() => deleteHachToanRow(row.id)} ><Trash2 color="#e20303" /></button> },
  ];

  const hopDongThueColumns = [
    { key: "so_seri00", title: "Số seri", width: 150, render: (val, row) => <Input value={row.so_seri00} onChange={e => handleHopDongThueChange(row.id, 'so_seri00', e.target.value)} /> },
    {
      key: "ma_kh", title: "Mã KH", width: 150, render: (val, row) => (
        <Input
          value={row.ma_kh}
          onChange={e => handleHopDongThueChange(row.id, 'ma_kh', e.target.value)}
          placeholder="Nhập mã KH..."
        />
      )
    },
    { key: "ten_kh", title: "Tên KH", width: 200, render: (val, row) => <span>{row.ten_kh}</span> },
    { key: "action", title: "Hành động", width: 100, render: (_, row) => <button onClick={() => deleteHopDongThueRow(row.id)} ><Trash2 color="#e20303" /></button> },
  ];

  const { mutateAsync: saveAccounting, isPending } = useSaveGeneralAccounting();

  const handleSave = async () => {
    try {
      const payload = {
        phieu: {
          ma_ct: soChungTu,
          ngay_lct: ngayLapChungTu,
          ps_no: hachToanData.reduce((sum, x) => sum + Number(x.ps_no || 0), 0),
          ps_co: hachToanData.reduce((sum, x) => sum + Number(x.ps_co || 0), 0),
          nh_dk: hachToanData[0]?.nh_dk || "",
          dien_giai: dienGiaiChung,
          ty_giaf: tyGia,
        },
        hachToan: hachToanData.map(({ tk_i, ps_no, ps_co, nh_dk, dien_giaii }) => ({
          tk_i,
          ps_no: Number(ps_no),
          ps_co: Number(ps_co),
          nh_dk,
          dien_giaii,
        })),
        hopDongThue: hopDongThueData.map(({ so_seri00, ma_kh, ten_kh }) => ({
          so_seri00,
          ma_kh,
          ten_kh,
        })),
      };

      const result = await saveAccounting(payload);
      toast.success("Lưu thành công!");
      resetForm();
      navigate("/general-ledger/list");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi lưu: " + (err?.message || "Không xác định"));
    }
  };

  return (
    <>
      <ComponentCard>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
          <div>
            <Label>Ngày hạch toán </Label>
            <div className="relative w-full flatpickr-wrapper">
              <Flatpickr
                value={ngayHachToan}
                onChange={date => handleDateChange(date, 'ngayHachToan')}
                options={{
                  dateFormat: "Y-m-d",
                  locale: Vietnamese,
                }}
                placeholder="dd-mm-yyyy"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon className="size-6" />
              </span>
            </div>
          </div>
          <div>
            <Label>Ngày lập chứng từ </Label>
            <div className="relative w-full flatpickr-wrapper">
              <Flatpickr
                value={ngayLapChungTu}
                onChange={date => handleDateChange(date, 'ngayLapChungTu')}
                options={{
                  dateFormat: "Y-m-d",
                  locale: Vietnamese,
                }}
                placeholder="dd-mm-yyyy"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon className="size-6" />
              </span>
            </div>
          </div>
          <div><Label>Quyển sổ</Label><Input value={quyenSo} onChange={e => setQuyenSo(e.target.value)} /></div>
          <div><Label>Số chứng từ</Label><Input value={soChungTu} onChange={e => setSoChungTu(e.target.value)} /></div>
          <div>
            <Label>Tỷ giá</Label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-4 text-gray-700 font-medium select-none">VND</span>
              <input
                type="number"
                value={tyGia}
                onChange={e => setTyGia(e.target.value)}
                placeholder="Nhập tỷ giá"
                className="flex-1 px-4 py-2.5 focus:outline-none text-sm text-gray-900 "
              />
            </div>
          </div>
          <div><Label>Trạng thái</Label><Select defaultValue={"1"} options={statusOptions} onChange={setTrangThai} /></div>
        </div>
        <div><Label>Diễn giải</Label><TextArea value={dienGiaiChung} onChange={val => setDienGiaiChung(val)} rows={4} /></div>
      </ComponentCard>
      <ComponentCard>
        <Tabs
          tabs={[
            {
              label: "Hạch toán",
              content: (
                <TableBasic
                  data={hachToanData}
                  columns={hachToanColumns}
                  onAddRow={addHachToanRow}
                  onDeleteRow={deleteHachToanRow}
                  showAddButton={true}
                  addButtonText="Thêm dòng "
                />
              )
            },
            {
              label: "Hợp đồng thuế",
              content: (
                <TableBasic
                  data={hopDongThueData}
                  columns={hopDongThueColumns}
                  onAddRow={addHopDongThueRow}
                  onDeleteRow={deleteHopDongThueRow}
                  showAddButton={true}
                  addButtonText="Thêm dòng"
                />
              )
            }
          ]}
        />
      </ComponentCard>
      <div className="flex justify-end mt-4 gap-4">
        <button
          onClick={resetForm}
          className="px-4 py-2 ml-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Hủy bỏ
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPending ? "Đang lưu..." : "Lưu lại"}
        </button>
      </div>

      {showAccountPopup && (
        <AccountSelectionPopup
          isOpen={true}
          onClose={() => setShowAccountPopup(false)}
          onSelect={account => handleAccountSelect(tkSearchRowId, account)}
          accounts={accountRawData.data || []}
          searchValue={tkSearch}
        />
      )}
      {showCustomerPopup && (
        <CustomerSelectionPopup
          isOpen={true}
          onClose={() => setShowCustomerPopup(false)}
          onSelect={customer => handleCustomerSelect(maKhSearchRowId, customer)}
          customers={customerData.data || []}
          searchValue={maKhSearch}
        />
      )}
    </>
  );
}