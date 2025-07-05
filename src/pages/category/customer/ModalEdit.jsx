import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";

import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useUpdateCustomer } from "../../../hooks/useCustomer";
import { useCustomerGroups } from "../../../hooks/useCustomerGroups";
import SearchableSelect from "../account/SearchableSelect";


export const ModalEditCustomer = ({ isOpenEdit, closeModalEdit, onSaveEdit, selectedCustomer }) => {
  const [formData, setFormData] = useState({
    ten_kh: "",
    e_mail: "",
    dien_thoai: "",
    dia_chi: "",
    ma_so_thue: "",
    ma_tra_cuu: "",
    tk_nh: "",
    ten_nh: "",
    ghi_chu: "",
    status: "",
    nh_kh1: "",
    nh_kh2: "",
    nh_kh3: "",
  });

  const updateCustomerMutation = useUpdateCustomer();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch customer groups data
  const { data: customerGroupsData, isLoading: loadingGroups } = useCustomerGroups({
    search: searchTerm || undefined,
    limit: 100,
  });

  const customerGroupOptions = customerGroupsData?.data || [];

  // Filter options để tránh trùng lặp
  const getFilteredOptions = (currentField) => {
    const selectedValues = [formData.nh_kh1, formData.nh_kh2, formData.nh_kh3].filter(Boolean);
    return customerGroupOptions.filter(option => {
      // Nếu là giá trị hiện tại của field này thì vẫn hiển thị
      if (option.ma_nh === formData[currentField]) return true;
      // Nếu đã được chọn ở field khác thì loại bỏ
      return !selectedValues.includes(option.ma_nh);
    });
  };

  // Populate form when selectedCustomer changes
  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        ten_kh: selectedCustomer.ten_kh || "",
        e_mail: selectedCustomer.e_mail || "",
        dien_thoai: selectedCustomer.dien_thoai || "",
        dia_chi: selectedCustomer.dia_chi || "",
        ma_so_thue: selectedCustomer.ma_so_thue || "",
        ma_tra_cuu: selectedCustomer.ma_tra_cuu || "",
        tk_nh: selectedCustomer.tk_nh || "",
        ten_nh: selectedCustomer.ten_nh || "",
        ghi_chu: selectedCustomer.ghi_chu || "",
        status: selectedCustomer.status || "",
        nh_kh1: selectedCustomer.nh_kh1 || "",
        nh_kh2: selectedCustomer.nh_kh2 || "",
        nh_kh3: selectedCustomer.nh_kh3 || "",
      });
    }
  }, [selectedCustomer]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCustomer) return;

    try {
      // Validate required fields
      if (!formData.ten_kh.trim()) {
        alert("Vui lòng nhập tên khách hàng");
        return;
      }

      await updateCustomerMutation.mutateAsync({
        ma_kh: selectedCustomer.ma_kh,
        data: {
          ...formData,
          // Remove empty fields
          e_mail: formData.e_mail || undefined,
          dien_thoai: formData.dien_thoai || undefined,
          dia_chi: formData.dia_chi || undefined,
          ma_so_thue: formData.ma_so_thue || undefined,
          ma_tra_cuu: formData.ma_tra_cuu || undefined,
          tk_nh: formData.tk_nh || undefined,
          ten_nh: formData.ten_nh || undefined,
          ghi_chu: formData.ghi_chu || undefined,
          nh_kh1: formData.nh_kh1 || undefined,
          nh_kh2: formData.nh_kh2 || undefined,
          nh_kh3: formData.nh_kh3 || undefined,
        }
      });

      onSaveEdit();
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const handleClose = () => {
    closeModalEdit();
  };

  return (
    <Modal isOpen={isOpenEdit} onClose={handleClose} className="max-w-[900px] m-4">
      <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Chỉnh sửa khách hàng
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Cập nhật thông tin khách hàng.
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[500px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Thông tin cơ bản
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label>Tên khách hàng *</Label>
                  <Input
                    type="text"
                    value={formData.ten_kh}
                    onChange={(e) => handleInputChange('ten_kh', e.target.value)}
                    placeholder="Nhập tên khách hàng"
                    required
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.e_mail}
                    onChange={(e) => handleInputChange('e_mail', e.target.value)}
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <Label>Số điện thoại</Label>
                  <Input
                    type="text"
                    value={formData.dien_thoai}
                    onChange={(e) => handleInputChange('dien_thoai', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    type="text"
                    value={formData.dia_chi}
                    onChange={(e) => handleInputChange('dia_chi', e.target.value)}
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                <div>
                  <Label>Trạng thái</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="1">Sử dụng</option>
                    <option value="0">Không sử dụng</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Thông tin bổ sung
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Mã số thuế</Label>
                  <Input
                    type="text"
                    value={formData.ma_so_thue}
                    onChange={(e) => handleInputChange('ma_so_thue', e.target.value)}
                    placeholder="Nhập mã số thuế"
                  />
                </div>

                <div>
                  <Label>Mã tra cứu</Label>
                  <Input
                    type="text"
                    value={formData.ma_tra_cuu}
                    onChange={(e) => handleInputChange('ma_tra_cuu', e.target.value)}
                    placeholder="Nhập mã tra cứu"
                  />
                </div>

                <div>
                  <Label>Tài khoản ngân hàng</Label>
                  <Input
                    type="text"
                    value={formData.tk_nh}
                    onChange={(e) => handleInputChange('tk_nh', e.target.value)}
                    placeholder="Nhập số tài khoản"
                  />
                </div>

                <div>
                  <Label>Tên ngân hàng</Label>
                  <Input
                    type="text"
                    value={formData.ten_nh}
                    onChange={(e) => handleInputChange('ten_nh', e.target.value)}
                    placeholder="Nhập tên ngân hàng"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Ghi chú</Label>
                  <Input
                    type="text"
                    value={formData.ghi_chu}
                    onChange={(e) => handleInputChange('ghi_chu', e.target.value)}
                    placeholder="Nhập ghi chú"
                  />
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Phân nhóm khách hàng
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <Label>Nhóm khách 1</Label>
                  <SearchableSelect
                    value={formData.nh_kh1}
                    onChange={(value) => handleInputChange('nh_kh1', value)}
                    options={getFilteredOptions('nh_kh1')}
                    placeholder="Chọn nhóm khách hàng 1"
                    searchPlaceholder="Tìm kiếm nhóm khách hàng..."
                    loading={loadingGroups}
                    onSearch={setSearchTerm}
                    displayKey="ten_nh"
                    valueKey="ma_nh"
                  />
                </div>

                <div>
                  <Label>Nhóm khách 2</Label>
                  <SearchableSelect
                    value={formData.nh_kh2}
                    onChange={(value) => handleInputChange('nh_kh2', value)}
                    options={getFilteredOptions('nh_kh2')}
                    placeholder="Chọn nhóm khách hàng 2"
                    searchPlaceholder="Tìm kiếm nhóm khách hàng..."
                    loading={loadingGroups}
                    onSearch={setSearchTerm}
                    displayKey="ten_nh"
                    valueKey="ma_nh"
                  />
                </div>

                <div>
                  <Label>Nhóm khách 3</Label>
                  <SearchableSelect
                    value={formData.nh_kh3}
                    onChange={(value) => handleInputChange('nh_kh3', value)}
                    options={getFilteredOptions('nh_kh3')}
                    placeholder="Chọn nhóm khách hàng 3"
                    searchPlaceholder="Tìm kiếm nhóm khách hàng..."
                    loading={loadingGroups}
                    onSearch={setSearchTerm}
                    displayKey="ten_nh"
                    valueKey="ma_nh"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" type="button" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={updateCustomerMutation.isLoading}
            >
              {updateCustomerMutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};