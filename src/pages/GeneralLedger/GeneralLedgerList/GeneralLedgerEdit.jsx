import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import AccountSelectionPopup from "../../../components/general/AccountSelectionPopup";
import CustomerSelectionPopup from "../../../components/general/CustomerSelectionPopup";
import TableBasic from "../../../components/tables/BasicTables/BasicTableOne";
import Button from "../../../components/ui/button/Button";
import { Tabs } from "../../../components/ui/tabs";
import { useAccounts } from "../../../hooks/useAccounts";
import { useCustomers } from "../../../hooks/useCustomer";
import { useGetGeneralAccountingById, useUpdateGeneralAccounting } from "../../../hooks/useGeneralAccounting.js";
import { CalenderIcon } from "../../../icons";

export default function GeneralLedgerUpdate() {
  const { stt_rec } = useParams();
  console.log("🔍 stt_rec from params:", stt_rec);
  const navigate = useNavigate();

  // States for form data
  const [ngayHachToan, setNgayHachToan] = useState("");
  const [ngayLapChungTu, setNgayLapChungTu] = useState("");
  const [quyenSo, setQuyenSo] = useState("");
  const [soChungTu, setSoChungTu] = useState("");
  const [tyGia, setTyGia] = useState(0);
  const [trangThai, setTrangThai] = useState("");
  const [dienGiaiChung, setDienGiaiChung] = useState("");

  const [hachToanData, setHachToanData] = useState([]);
  const [hopDongThueData, setHopDongThueData] = useState([]);

  // Search states for popups
  const [tkSearch, setTkSearch] = useState("");
  const [tkSearchRowId, setTkSearchRowId] = useState(null);
  const [maKhSearch, setMaKhSearch] = useState("");
  const [maKhSearchRowId, setMaKhSearchRowId] = useState(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);

  // Fetch data
  const { data: recordData, isLoading: isLoadingRecord } = useGetGeneralAccountingById(stt_rec);
  console.log("📦 recordData:", recordData);
  console.log("⏳ isLoadingRecord:", isLoadingRecord);
  const { data: accountRawData = {} } = useAccounts(tkSearch ? { search: tkSearch } : {});
  const { data: customerData = [] } = useCustomers(maKhSearch ? { search: maKhSearch } : {});

  // Update mutation
  const { mutateAsync: updateAccounting, isPending: isUpdating } = useUpdateGeneralAccounting();

  // Load data when record is fetched
  useEffect(() => {
    console.log("🔍 recordData trong useEffect:", recordData);

    if (recordData && recordData.phieu) {
      const data = recordData; // Không cần .data nữa

      // Fill main form data từ phieu
      const phieu = data.phieu;
      setNgayHachToan(phieu.ngay_ct ? phieu.ngay_ct.split("T")[0] : "");
      setNgayLapChungTu(phieu.ngay_lct ? phieu.ngay_lct.split("T")[0] : "");
      setQuyenSo(phieu.quyen_so || "");
      setSoChungTu(phieu.ma_ct?.trim() || "");
      setTyGia(phieu.ty_giaf || 0);
      setDienGiaiChung(phieu.dien_giai || "");

      console.log("📝 Đã set form data:", {
        ngayHachToan: phieu.ngay_ct ? phieu.ngay_ct.split("T")[0] : "",
        ngayLapChungTu: phieu.ngay_lct ? phieu.ngay_lct.split("T")[0] : "",
        soChungTu: phieu.ma_ct?.trim(),
        tyGia: phieu.ty_giaf,
        dienGiai: phieu.dien_giai,
      });

      // Fill hach toan data
      if (data.hachToan && Array.isArray(data.hachToan) && data.hachToan.length > 0) {
        setHachToanData(
          data.hachToan.map((item, index) => ({
            id: index + 1,
            stt_rec: (index + 1).toString(),
            tk_i: item.tk_i?.trim() || "",
            ten_tk: item.ten_tk || "",
            ps_no: item.ps_no || "",
            ps_co: item.ps_co || "",
            nh_dk: item.nh_dk?.trim() || "",
            dien_giaii: item.dien_giaii || "",
          }))
        );
        console.log("📊 Đã set hachToanData:", data.hachToan);
      } else {
        setHachToanData([
          {
            id: 1,
            stt_rec: "1",
            tk_i: "",
            ten_tk: "",
            ps_no: "",
            ps_co: "",
            nh_dk: "",
            dien_giaii: "",
          },
        ]);
        console.log("📊 Set hachToanData mặc định");
      }

      // Fill hop dong thue data
      if (data.hopDongThue && Array.isArray(data.hopDongThue) && data.hopDongThue.length > 0) {
        setHopDongThueData(
          data.hopDongThue.map((item, index) => ({
            id: index + 1,
            so_seri0: item.so_seri0 || "",
            ma_kh: item.ma_kh || "",
            ten_kh: item.ten_kh || "",
          }))
        );
        console.log("📋 Đã set hopDongThueData:", data.hopDongThue);
      } else {
        setHopDongThueData([
          {
            id: 1,
            so_seri0: "",
            ma_kh: "",
            ten_kh: "",
          },
        ]);
        console.log("📋 Set hopDongThueData mặc định");
      }
    } else {
      console.log("❌ recordData không hợp lệ:", recordData);
    }
  }, [recordData]);

  // Popup handling
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

  const handleDateChange = (date, field) => {
    const formattedDate = date[0]?.toLocaleDateString("en-CA");
    field === "ngayHachToan" ? setNgayHachToan(formattedDate) : setNgayLapChungTu(formattedDate);
  };

  const handleHachToanChange = (id, field, value) => {
    setHachToanData((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    if (field === "tk_i") {
      setTkSearch(value);
      setTkSearchRowId(id);
    }
  };

  const handleAccountSelect = (id, account) => {
    setHachToanData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, tk_i: account.tk.trim(), ten_tk: account.ten_tk } : item))
    );
    setShowAccountPopup(false);
    setTkSearch("");
  };

  const addHachToanRow = () => {
    setHachToanData((prev) => [
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
  };

  const deleteHachToanRow = (id) => {
    setHachToanData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleHopDongThueChange = (id, field, value) => {
    setHopDongThueData((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    if (field === "ma_kh") {
      setMaKhSearch(value);
      setMaKhSearchRowId(id);
    }
  };

  const handleCustomerSelect = (id, customer) => {
    setHopDongThueData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ma_kh: customer.ma_kh, ten_kh: customer.ten_kh } : item))
    );
    setShowCustomerPopup(false);
    setMaKhSearch("");
  };

  const addHopDongThueRow = () => {
    setHopDongThueData((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        so_seri0: "",
        ma_kh: "",
        ten_kh: "",
      },
    ]);
  };

  const deleteHopDongThueRow = (id) => {
    setHopDongThueData((prev) => prev.filter((item) => item.id !== id));
  };

  const hachToanColumns = [
    { key: "stt_rec", title: "STT", width: 80, render: (val, row) => row.stt_rec },
    {
      key: "tk_i",
      title: "Tài khoản",
      width: 200,
      render: (val, row) => (
        <Input
          value={row.tk_i}
          onChange={(e) => handleHachToanChange(row.id, "tk_i", e.target.value)}
          placeholder="Nhập mã TK..."
        />
      ),
    },
    { key: "ten_tk", title: "Tên tài khoản", width: 250, render: (val, row) => <span>{row.ten_tk}</span> },
    {
      key: "ps_no",
      title: "PS Nợ",
      width: 200,
      render: (val, row) => (
        <Input
          type="number"
          value={row.ps_no}
          onChange={(e) => handleHachToanChange(row.id, "ps_no", e.target.value)}
        />
      ),
    },
    {
      key: "ps_co",
      title: "PS Có",
      width: 200,
      render: (val, row) => (
        <Input
          type="number"
          value={row.ps_co}
          onChange={(e) => handleHachToanChange(row.id, "ps_co", e.target.value)}
        />
      ),
    },
    {
      key: "nh_dk",
      title: "NH ĐK",
      width: 200,
      render: (val, row) => (
        <Input value={row.nh_dk} onChange={(e) => handleHachToanChange(row.id, "nh_dk", e.target.value)} />
      ),
    },
    {
      key: "dien_giaii",
      title: "Diễn giải",
      width: 200,
      render: (val, row) => (
        <Input value={row.dien_giaii} onChange={(e) => handleHachToanChange(row.id, "dien_giaii", e.target.value)} />
      ),
    },
    {
      key: "action",
      title: "Hành động",
      width: 100,
      render: (_, row) => (
        <button onClick={() => deleteHachToanRow(row.id)}>
          <Trash2 color="#e20303" />
        </button>
      ),
    },
  ];

  const hopDongThueColumns = [
    {
      key: "so_seri0",
      title: "Số seri",
      width: 150,
      render: (val, row) => (
        <Input value={row.so_seri0} onChange={(e) => handleHopDongThueChange(row.id, "so_seri0", e.target.value)} />
      ),
    },
    {
      key: "ma_kh",
      title: "Mã KH",
      width: 150,
      render: (val, row) => (
        <Input
          value={row.ma_kh}
          onChange={(e) => handleHopDongThueChange(row.id, "ma_kh", e.target.value)}
          placeholder="Nhập mã KH..."
        />
      ),
    },
    { key: "ten_kh", title: "Tên KH", width: 200, render: (val, row) => <span>{row.ten_kh}</span> },
    {
      key: "action",
      title: "Hành động",
      width: 100,
      render: (_, row) => (
        <button onClick={() => deleteHopDongThueRow(row.id)}>
          <Trash2 color="#e20303" />
        </button>
      ),
    },
  ];

  const handleUpdate = async () => {
    try {
      const payload = {
        phieu: {
          ma_ct: soChungTu,
          ngay_lct: ngayLapChungTu,
          dien_giai: dienGiaiChung,
          ty_giaf: Number(tyGia),
        },
        hachToan: hachToanData.map(({ tk_i, ps_no, ps_co, nh_dk, dien_giaii }) => ({
          tk_i,
          ps_no: Number(ps_no || 0),
          ps_co: Number(ps_co || 0),
          nh_dk,
          dien_giaii,
        })),
        hopDongThue: hopDongThueData.map(({ so_seri0, ma_kh, ten_kh }) => ({
          so_seri0,
          ma_kh,
          ten_kh,
        })),
      };

      await updateAccounting({ stt_rec, payload });
      toast.success("Cập nhật thành công!");
      navigate("/general-ledger/list");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật: " + (err?.message || "Không xác định"));
    }
  };

  const handleCancel = () => {
    navigate("/general-ledger/list");
  };

  if (isLoadingRecord) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Cập nhật phiếu kế toán tổng hợp" description="Cập nhật phiếu kế toán tổng hợp" />
      <PageBreadcrumb
        pageTitle="Cập nhật phiếu kế toán tổng hợp"
        breadcrumbItems={[
          { title: "Trang chủ", href: "/" },
          { title: "Danh sách phiếu kế toán", href: "/general-ledger/list" },
          { title: "Cập nhật" },
        ]}
      />

      <div className="space-y-6">
        {/* Header với nút quay lại */}
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline" startIcon={<ArrowLeft className="size-4" />} onClick={handleCancel}>
            Quay lại
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cập nhật phiếu kế toán - {soChungTu || stt_rec}
          </h1>
        </div>

        {/* Form chính */}
        <ComponentCard>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 mb-6">
            <div>
              <Label>Ngày hạch toán </Label>
              <div className="relative w-full flatpickr-wrapper">
                <Flatpickr
                  value={ngayHachToan}
                  onChange={(date) => handleDateChange(date, "ngayHachToan")}
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
                  onChange={(date) => handleDateChange(date, "ngayLapChungTu")}
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
              <Label>Quyển sổ</Label>
              <Input value={quyenSo} onChange={(e) => setQuyenSo(e.target.value)} />
            </div>
            <div>
              <Label>Số chứng từ</Label>
              <Input value={soChungTu} onChange={(e) => setSoChungTu(e.target.value)} />
            </div>
            <div>
              <Label>Tỷ giá</Label>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <span className="px-4 text-gray-700 font-medium select-none">VND</span>
                <input
                  type="number"
                  value={tyGia}
                  onChange={(e) => setTyGia(e.target.value)}
                  placeholder="Nhập tỷ giá"
                  className="flex-1 px-4 py-2.5 focus:outline-none text-sm text-gray-900 "
                />
              </div>
            </div>
            <div>
              <Label>Trạng thái</Label>
              <Select value={trangThai} options={statusOptions} onChange={setTrangThai} />
            </div>
          </div>
          <div>
            <Label>Diễn giải</Label>
            <TextArea value={dienGiaiChung} onChange={(val) => setDienGiaiChung(val)} rows={4} />
          </div>
        </ComponentCard>

        {/* Tabs */}
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
                ),
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
                ),
              },
            ]}
          />
        </ComponentCard>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <Button onClick={handleCancel} variant="outline" disabled={isUpdating}>
            Hủy bỏ
          </Button>
          <Button onClick={handleUpdate} variant="primary" disabled={isUpdating}>
            {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </div>

      {/* Popups */}
      {showAccountPopup && (
        <AccountSelectionPopup
          isOpen={true}
          onClose={() => setShowAccountPopup(false)}
          onSelect={(account) => handleAccountSelect(tkSearchRowId, account)}
          accounts={accountRawData.data || []}
          searchValue={tkSearch}
        />
      )}
      {showCustomerPopup && (
        <CustomerSelectionPopup
          isOpen={true}
          onClose={() => setShowCustomerPopup(false)}
          onSelect={(customer) => handleCustomerSelect(maKhSearchRowId, customer)}
          customers={customerData.data || []}
          searchValue={maKhSearch}
        />
      )}
    </>
  );
}
