import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";

export const ModalCreateCashReceipt = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
  const [formData, setFormData] = useState({
    loaiPhieuThu: "",
    maKhach: "",
    diaChi: "",
    nguoiNop: "",
    lyDoNop: "",
    tkNo: "",
    ngayHachToan: "",
    ngayLapPhieu: "",
    quyenSo: "",
    soPhieuThu: "",
    tggd: "",
    trangThai: "Đã ghi sổ cái",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi onSaveCreate kèm dữ liệu
    onSaveCreate(formData);
    // Reset sau khi lưu
    setFormData({
      loaiPhieuThu: "",
      maKhach: "",
      diaChi: "",
      nguoiNop: "",
      lyDoNop: "",
      tkNo: "",
      ngayHachToan: "",
      ngayLapPhieu: "",
      quyenSo: "",
      soPhieuThu: "",
      tggd: "",
      trangThai: "Đã ghi sổ cái",
    });
  };

  const handleClose = () => {
    setFormData({
      loaiPhieuThu: "",
      maKhach: "",
      diaChi: "",
      nguoiNop: "",
      lyDoNop: "",
      tkNo: "",
      ngayHachToan: "",
      ngayLapPhieu: "",
      quyenSo: "",
      soPhieuThu: "",
      tggd: "",
      trangThai: "Đã ghi sổ cái",
    });
    closeModalCreate();
  };

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới phiếu thu" className="max-w-[700px] m-4 h-[800px] ">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 h-[800px]">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Thông tin phiếu thu
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Nhập thông tin phiếu thu tiền vào hệ thống.
          </p>
        </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="custom-scrollbar h-[550px] overflow-y-auto px-2 pb-3">
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2">
            <div><Label>Loại phiếu thu</Label><Input value={formData.loaiPhieuThu} onChange={e => handleChange("loaiPhieuThu", e.target.value)} /></div>
            <div><Label>Mã khách</Label><Input value={formData.maKhach} onChange={e => handleChange("maKhach", e.target.value)} /></div>
            <div className="col-span-2"><Label>Địa chỉ</Label><Input value={formData.diaChi} onChange={e => handleChange("diaChi", e.target.value)} /></div>
            <div><Label>Người nộp</Label><Input value={formData.nguoiNop} onChange={e => handleChange("nguoiNop", e.target.value)} /></div>
            <div><Label>Lý do nộp</Label><Input value={formData.lyDoNop} onChange={e => handleChange("lyDoNop", e.target.value)} /></div>
            <div><Label>Tài khoản nợ</Label><Input value={formData.tkNo} onChange={e => handleChange("tkNo", e.target.value)} /></div>
            <div><Label>Ngày hạch toán</Label><Input type="date" value={formData.ngayHachToan} onChange={e => handleChange("ngayHachToan", e.target.value)} /></div>
            <div><Label>Ngày lập phiếu</Label><Input type="date" value={formData.ngayLapPhieu} onChange={e => handleChange("ngayLapPhieu", e.target.value)} /></div>
            <div><Label>Quyển sổ</Label><Input value={formData.quyenSo} onChange={e => handleChange("quyenSo", e.target.value)} /></div>
            <div><Label>Số phiếu thu</Label><Input value={formData.soPhieuThu} onChange={e => handleChange("soPhieuThu", e.target.value)} /></div>
            <div><Label>Thời gian giao dịch</Label><Input value={formData.tggd} onChange={e => handleChange("tggd", e.target.value)} /></div>
            <div><Label>Trạng thái</Label><Input value={formData.trangThai} disabled /></div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button variant="outline" type="button" onClick={handleClose}>Hủy</Button>
          <Button type="submit">Lưu</Button>
        </div>
        </form>
      </div>
    </Modal>
  );
};
