import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalenderIcon } from "../../../icons";
import { useCreateCashReceipt } from "../../../hooks/useCashReceipt";

export const ModalCreateCashReceipt = ({ isOpenCreate, closeModalCreate }) => {
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
    MST: "",
    ma_nt: "",
    ty_gia: "",
  });

  const createCashReceiptMutation = useCreateCashReceipt();

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date[0]?.toLocaleDateString("en-CA") || ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = {
      ma_gd: "2",
      ma_kh: "KH001",
      dia_chi: "123 Đường Lê Lợi, Hà Nội",
      mst: "0101234567",
      ong_ba: "Nguyễn Văn B",
      dien_giai: "Thu tiền đặt cọc hợp đồng",
      ngay_ct: "2025-07-04T00:00:00.000Z",
      ngay_lct: "2025-07-04T00:00:00.000Z",
      ma_qs: "PT001",
      so_ct: "PT001",
      ma_nt: "VND",
      ty_gia: 1,
      loai_ct: "PT"
    };

    // const dataToSave = {
    //   ma_gd: formData.ma_gd || "2",
    //   ma_kh: formData.ma_kh,
    //   dia_chi: formData.dia_chi,
    //   mst: formData.MST,
    //   ong_ba: formData.ong_ba,
    //   dien_giai: formData.dien_giai,
    //   ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : undefined,
    //   ngay_lct: formData.ngay_lct ? new Date(formData.ngay_lct).toISOString() : undefined,
    //   ma_qs: formData.ma_qs,
    //   so_ct: formData.so_ct ? formData.so_ct : "2",
    //   ma_nt: formData.ma_nt || "VND",
    //   ty_gia: formData.ty_gia ? Number(formData.ty_gia) : 1,
    //   loai_ct: "PT",
    // };
    await createCashReceiptMutation.mutateAsync(dataToSave);
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
      MST: "",
      ma_nt: "",
      ty_gia: "",
    });
    closeModalCreate();
  };

  const handleClose = () => {
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
      MST: "",
      ma_nt: "",
      ty_gia: "",
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
              <div><Label>Số phiếu thu</Label><Input value={formData.so_ct} onChange={e => handleChange("so_ct", e.target.value)} placeholder="2" /></div>
              <div><Label>Người nộp</Label><Input value={formData.ong_ba} onChange={e => handleChange("ong_ba", e.target.value)} /></div>
              <div>
                <Label>Ngày lập phiếu thu</Label>
                <div className="relative w-full flatpickr-wrapper">
                  <Flatpickr
                    value={formData.ngay_lct}
                    onChange={date => handleDateChange(date, "ngay_lct")}
                    options={{
                      dateFormat: "Y-m-d",
                      locale: Vietnamese,
                    }}
                    placeholder="dd-mm-yyyy"
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                  /> <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon className="size-6" />
                  </span>
                </div>
              </div>
              <div>
                <Label>Ngày hạch toán</Label>
                <div className="relative w-full flatpickr-wrapper">
                  <Flatpickr
                    value={formData.ngay_ct}
                    onChange={date => handleDateChange(date, "ngay_ct")}
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
              <div><Label>Tài khoản nợ</Label><Input value={formData.tk} onChange={e => handleChange("tk", e.target.value)} /></div>
              <div><Label>Loại phiếu thu</Label><Input value={formData.ma_gd} onChange={e => handleChange("ma_gd", e.target.value)} /></div>
              <div><Label>Mã khách</Label><Input value={formData.ma_kh} onChange={e => handleChange("ma_kh", e.target.value)} /></div>
              <div className="col-span-2"><Label>Địa chỉ</Label><Input value={formData.dia_chi} onChange={e => handleChange("dia_chi", e.target.value)} /></div>
              <div className="col-span-2"><Label>Lý do nộp</Label><Input value={formData.dien_giai} onChange={e => handleChange("dien_giai", e.target.value)} /></div>
              <div><Label>Quyển số</Label><Input value={formData.ma_qs} onChange={e => handleChange("ma_qs", e.target.value)} /></div>
              <div><Label>Trạng thái</Label><Input value={formData.loai_ct} disabled /></div>
              <div><Label>Mã số thuế</Label><Input value={formData.MST} onChange={e => handleChange("MST", e.target.value)} /></div>
              <div><Label>TGGD (Tỷ giá giao dịch)</Label><Input value={formData.ma_nt} onChange={e => handleChange("ma_nt", e.target.value)} /></div>
              <div><Label>Mức tỷ giá giao dịch</Label><Input value={formData.ty_gia} onChange={e => handleChange("ty_gia", e.target.value)} /></div>
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
