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

  // State cho danh sách tài khoản
  const [taiKhoanList, setTaiKhoanList] = useState([
    {
      tk_so: "",
      tk_me: "",
      ten_tai_khoan: "",
      ps_co: 0,
      dien_giai: ""
    }
  ]);

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

  // Xử lý thay đổi dữ liệu tài khoản
  const handleTaiKhoanChange = (index, field, value) => {
    const newList = [...taiKhoanList];
    newList[index] = {
      ...newList[index],
      [field]: field === 'ps_co' ? Number(value) || 0 : value
    };
    setTaiKhoanList(newList);
  };

  // Thêm dòng mới
  const addTaiKhoan = () => {
    setTaiKhoanList([...taiKhoanList, {
      tk_so: "",
      tk_me: "",
      ten_tai_khoan: "",
      ps_co: 0,
      dien_giai: ""
    }]);
  };

  // Xóa dòng
  const removeTaiKhoan = (index) => {
    if (taiKhoanList.length > 1) {
      const newList = taiKhoanList.filter((_, i) => i !== index);
      setTaiKhoanList(newList);
    }
  };

  // Tính tổng tiền
  const getTongTien = () => {
    return taiKhoanList.reduce((total, item) => total + (item.ps_co || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ma_gd: formData.ma_gd || "2",
      ma_kh: formData.ma_kh,
      dia_chi: formData.dia_chi,
      // mst: formData.MST,
      ong_ba: formData.ong_ba,
      dien_giai: formData.dien_giai,
      ngay_ct: formData.ngay_ct ? new Date(formData.ngay_ct).toISOString() : undefined,
      ngay_lct: formData.ngay_lct ? new Date(formData.ngay_lct).toISOString() : undefined,
      ma_qs: formData.ma_qs,
      so_ct: formData.so_ct ? formData.so_ct : "2",
      ma_nt: formData.ma_nt || "VND",
      ty_gia: formData.ty_gia ? Number(formData.ty_gia) : 1,
      loai_ct: "PT",
      tai_khoan_list: taiKhoanList,
      tong_tien: getTongTien(),
      han_thanh_toan: 0
    };
    
    await createCashReceiptMutation.mutateAsync(dataToSave);
    resetForm();
    closeModalCreate();
  };

  const resetForm = () => {
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
    setTaiKhoanList([{
      tk_so: "",
      tk_me: "",
      ten_tai_khoan: "",
      ps_co: 0,
      dien_giai: ""
    }]);
  };

  const handleClose = () => {
    resetForm();
    closeModalCreate();
  };

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới phiếu thu" className="max-w-[900px] m-4 h-[900px]">
      <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 h-[900px]">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Thông tin phiếu thu
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Nhập thông tin phiếu thu tiền vào hệ thống.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="custom-scrollbar h-[680px] overflow-y-auto px-2 pb-3">
            {/* Thông tin chung */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2 mb-6">
              <div><Label>Số phiếu thu</Label><Input value={formData.so_ct} onChange={e => handleChange("so_ct", e.target.value)} placeholder="2" /></div>
              <div><Label>Đối tác</Label><Input value={formData.ong_ba} onChange={e => handleChange("ong_ba", e.target.value)} /></div>
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
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
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

            {/* Danh sách tài khoản */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Danh sách tài khoản
                </h5>
                <Button type="button" variant="outline" size="sm" onClick={addTaiKhoan}>
                  + Thêm dòng
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">STT</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">TK số</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">TK mẹ</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Tên tài khoản</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Phát sinh có</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Diễn giải</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taiKhoanList.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            value={item.tk_so}
                            onChange={e => handleTaiKhoanChange(index, 'tk_so', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="TK số"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            value={item.tk_me}
                            onChange={e => handleTaiKhoanChange(index, 'tk_me', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="TK mẹ"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            value={item.ten_tai_khoan}
                            onChange={e => handleTaiKhoanChange(index, 'ten_tai_khoan', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Tên tài khoản"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            type="number"
                            value={item.ps_co}
                            onChange={e => handleTaiKhoanChange(index, 'ps_co', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="0"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                          <Input
                            value={item.dien_giai}
                            onChange={e => handleTaiKhoanChange(index, 'dien_giai', e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Diễn giải"
                          />
                        </td>
                        <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                          {taiKhoanList.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTaiKhoan(index)}
                              className="h-8 px-2 text-red-600 hover:text-red-700"
                            >
                              Xóa
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan="4" className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 text-right">
                        Tổng tiền:
                      </td>
                      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {getTongTien().toLocaleString()}
                      </td>
                      <td colSpan="2" className="border border-gray-300 dark:border-gray-600"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
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