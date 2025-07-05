import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";

import { Modal } from "../../../components/ui/modal";

import { useAccounts } from "../../../hooks/useAccounts";
import { useCreateDmvt } from "../../../hooks/useDmvt";
import { useMaterialGroups } from "../../../hooks/useMaterialGroup";
import SearchableSelect from "../account/SearchableSelect";



export const ModalCreateMaterial = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
  const [formData, setFormData] = useState({
    ten_vt: "",
    dvt: "",
    vt_ton_kho: "1",
    loai_vt: "21",
    tk_vt: "",
    sua_tk_vt: "0",
    tk_dt: "",
    tk_dtnb: "",
    tk_ck: "",
    tk_nvl: "",
    tk_gv: "",
    tk_km: "",
    nh_vt1: "",
    nh_vt2: "",
    nh_vt3: "",
    sl_min: "0.000",
    sl_max: "0.000",
    ghi_chu: "",
    status: "1"
  });

  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [materialGroupSearchTerm, setMaterialGroupSearchTerm] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState({
    tk_vt: null,
    tk_dt: null,
    tk_dtnb: null,
    tk_ck: null,
    tk_gv: null,
    tk_km: null
  });
  console.log(selectedAccounts);

  const { data: accountsData, isLoading: isLoadingAccounts } = useAccounts({
    search: accountSearchTerm,
    limit: 100,
  });

  const { data: materialGroupsData, isLoading: isLoadingMaterialGroups } = useMaterialGroups({
    search: materialGroupSearchTerm || undefined,
    limit: 100,
  });

  const createMaterialMutation = useCreateDmvt();
  const [errors, setErrors] = useState({
    ten_vt: "",
  });

  // Prepare options cho SearchableSelect
  const accountOptions = accountsData?.data?.map(account => ({
    value: account.tk0,
    displayKey: account.ten_tk,
    valueKey: account.tk0,
  })) || [];

  const materialGroupOptions = materialGroupsData?.data || [];

  // Filter options để tránh trùng lặp cho nhóm vật tư
  const getFilteredMaterialGroupOptions = (currentField) => {
    const selectedValues = [formData.nh_vt1, formData.nh_vt2, formData.nh_vt3].filter(Boolean);
    return materialGroupOptions.filter(option => {
      // Nếu là giá trị hiện tại của field này thì vẫn hiển thị
      if (option.ma_nh === formData[currentField]) return true;
      // Nếu đã được chọn ở field khác thì loại bỏ
      return !selectedValues.includes(option.ma_nh);
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle account selection cho từng loại tài khoản
  const handleAccountSelect = (accountType, accountCode) => {
    const account = accountsData?.data?.find(acc => acc.tk0 === accountCode);
    setSelectedAccounts(prev => ({
      ...prev,
      [accountType]: account
    }));
    setFormData(prev => ({
      ...prev,
      [accountType]: accountCode
    }));
  };

  // Handle account search
  const handleAccountSearch = (searchTerm) => {
    setAccountSearchTerm(searchTerm);
  };

  // Handle material group search
  const handleMaterialGroupSearch = (searchTerm) => {
    setMaterialGroupSearchTerm(searchTerm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!formData.ten_vt.trim()) {
      setErrors(prev => ({ ...prev, ten_vt: "Vui lòng nhập tên vật tư" }));
      hasError = true;
    }

    if (hasError) return;
    console.log(formData);
    try {
      await createMaterialMutation.mutateAsync({
        ten_vt: formData.ten_vt,
        dvt: formData.dvt,
        vt_ton_kho: formData.vt_ton_kho,
        loai_vt: formData.loai_vt,
        tk_vt: formData.tk_vt,
        sua_tk_vt: formData.sua_tk_vt,
        tk_dt: formData.tk_dt,
        tk_dtnb: formData.tk_dtnb,
        tk_ck: formData.tk_ck,
        tk_nvl: formData.tk_nvl,
        tk_gv: formData.tk_gv,
        tk_km: formData.tk_km,
        nh_vt1: formData.nh_vt1,
        nh_vt2: formData.nh_vt2,
        nh_vt3: formData.nh_vt3,
        sl_min: formData.sl_min,
        sl_max: formData.sl_max,
        ghi_chu: formData.ghi_chu,
        status: formData.status,
      });

      setFormData({
        ten_vt: "",
        dvt: "",
        vt_ton_kho: "1",
        loai_vt: "21",
        tk_vt: "",
        sua_tk_vt: "0",
        tk_dt: "",
        tk_dtnb: "",
        tk_ck: "",
        tk_nvl: "",
        tk_gv: "",
        tk_km: "",
        nh_vt1: "",
        nh_vt2: "",
        nh_vt3: "",
        sl_min: "0.000",
        sl_max: "0.000",
        ghi_chu: "",
        status: "1"
      });
      setSelectedAccounts({
        tk_vt: null,
        tk_dt: null,
        tk_dtnb: null,
        tk_ck: null,
        tk_gv: null,
        tk_km: null
      });
      setAccountSearchTerm("");
      setMaterialGroupSearchTerm("");
      setErrors({ ten_vt: "" });

      onSaveCreate();
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      ten_vt: "",
      dvt: "",
      vt_ton_kho: "1",
      loai_vt: "21",
      tk_vt: "",
      sua_tk_vt: "0",
      tk_dt: "",
      tk_dtnb: "",
      tk_ck: "",
      tk_nvl: "",
      tk_gv: "",
      tk_km: "",
      nh_vt1: "",
      nh_vt2: "",
      nh_vt3: "",
      sl_min: "0.000",
      sl_max: "0.000",
      ghi_chu: "",
      status: "1"
    });
    setSelectedAccounts({
      tk_vt: null,
      tk_dt: null,
      tk_dtnb: null,
      tk_ck: null,
      tk_gv: null,
      tk_km: null
    });
    setAccountSearchTerm("");
    setMaterialGroupSearchTerm("");
    setErrors({ ten_vt: "" });
    closeModalCreate();
  };

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} className="w-full max-w-[900px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Thêm mới vật tư
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Nhập thông tin vật tư mới vào hệ thống.
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[550px] overflow-y-auto px-2 pb-3">
            {/* Tab 1: Thông tin vật tư */}
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                1. Thông tin vật tư
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Tên vật tư *</Label>
                  <Input
                    type="text"
                    value={formData.ten_vt}
                    onChange={(e) => {
                      handleInputChange('ten_vt', e.target.value);
                      if (errors.ten_vt) {
                        setErrors((prev) => ({ ...prev, ten_vt: "" }));
                      }
                    }}
                    placeholder="Nhập tên vật tư"
                    required
                  />
                  {errors.ten_vt && (
                    <p className="mt-1 text-sm text-red-500">{errors.ten_vt}</p>
                  )}
                </div>

                <div>
                  <Label>Đơn vị tính</Label>
                  <Input
                    type="text"
                    value={formData.dvt}
                    onChange={(e) => handleInputChange('dvt', e.target.value)}
                    placeholder="kg"
                  />
                </div>

                <div>
                  <Label>Theo dõi tồn kho</Label>
                  <select
                    value={formData.vt_ton_kho}
                    onChange={(e) => handleInputChange('vt_ton_kho', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="0">0 - Không theo dõi tồn kho</option>
                    <option value="1">1 - Theo dõi tồn kho</option>
                  </select>
                </div>

                <div>
                  <Label>Loại vật tư</Label>
                  <select
                    value={formData.loai_vt}
                    onChange={(e) => handleInputChange('loai_vt', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="21">Nguyên vật liệu</option>
                  </select>
                </div>

                <div>
                  <Label>Tài khoản kho</Label>
                  <SearchableSelect
                    value={formData.tk_vt}
                    onChange={(value) => handleAccountSelect('tk_vt', value)}
                    options={accountOptions}
                    placeholder="Chọn tài khoản kho"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Sửa tài khoản kho</Label>
                  <select
                    value={formData.sua_tk_vt}
                    onChange={(e) => handleInputChange('sua_tk_vt', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="0">0 - Không được sửa</option>
                    <option value="1">1 - Được sửa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tab 2: Thông tin khác */}
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                2. Thông tin khác
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Tài khoản doanh thu</Label>
                  <SearchableSelect
                    value={formData.tk_dt}
                    onChange={(value) => handleAccountSelect('tk_dt', value)}
                    options={accountOptions}
                    placeholder="Chọn tài khoản doanh thu"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Tài khoản hàng bán bị trả lại</Label>
                  <SearchableSelect
                    value={formData.tk_tl}
                    onChange={(value) => handleAccountSelect('tk_tl', value)}
                    options={accountOptions}
                    placeholder="112"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Tài khoản doanh thu nội bộ</Label>
                  <SearchableSelect
                    value={formData.tk_dtnb}
                    onChange={(value) => handleAccountSelect('tk_dtnb', value)}
                    options={accountOptions}
                    placeholder="Chọn tài khoản"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Tài khoản chiết khấu giá vật tư</Label>
                  <SearchableSelect
                    value={formData.tk_ck}
                    onChange={(value) => handleAccountSelect('tk_ck', value)}
                    options={accountOptions}
                    placeholder="Chọn tài khoản"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Tài khoản nguyên vật liệu</Label>
                  <SearchableSelect
                    value={formData.tk_nvl}
                    onChange={(value) => handleAccountSelect('tk_nvl', value)}
                    options={accountOptions}
                    placeholder="Chọn tài khoản"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Tài khoản giá vốn</Label>
                  <SearchableSelect
                    value={formData.tk_gv}
                    onChange={(value) => handleAccountSelect('tk_gv', value)}
                    options={accountOptions}
                    placeholder="112"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Tài khoản sản phẩm dở dang</Label>
                  <SearchableSelect
                    value={formData.tk_spdd}
                    onChange={(value) => handleAccountSelect('tk_spdd', value)}
                    options={accountOptions}
                    placeholder="Chọn tài khoản"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Tài khoản có khuyến mãi</Label>
                  <SearchableSelect
                    value={formData.tk_km}
                    onChange={(value) => handleAccountSelect('tk_km', value)}
                    options={accountOptions}
                    placeholder="1131"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoadingAccounts}
                    onSearch={handleAccountSearch}
                    displayKey="displayKey"
                    valueKey="valueKey"
                  />
                </div>

                <div>
                  <Label>Số lượng tồn tối thiểu</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.sl_min}
                    onChange={(e) => handleInputChange('sl_min', e.target.value)}
                    placeholder="0.000"
                  />
                </div>

                <div>
                  <Label>Số lượng tồn tối đa</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.sl_max}
                    onChange={(e) => handleInputChange('sl_max', e.target.value)}
                    placeholder="0.000"
                  />
                </div>

                <div>
                  <Label>Trạng thái</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="0">0 - Không sử dụng</option>
                    <option value="1">1 - Sử dụng</option>
                  </select>
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

            {/* Tab 3: Phân nhóm vật tư */}
            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                3. Phân nhóm vật tư
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <Label>Nhóm vật tư 1</Label>
                  <SearchableSelect
                    value={formData.nh_vt1}
                    onChange={(value) => handleInputChange('nh_vt1', value)}
                    options={getFilteredMaterialGroupOptions('nh_vt1')}
                    placeholder="Chọn nhóm vật tư 1"
                    searchPlaceholder="Tìm kiếm nhóm vật tư..."
                    loading={isLoadingMaterialGroups}
                    onSearch={handleMaterialGroupSearch}
                    displayKey="ten_nh"
                    valueKey="ma_nh"
                  />
                </div>

                <div>
                  <Label>Nhóm vật tư 2</Label>
                  <SearchableSelect
                    value={formData.nh_vt2}
                    onChange={(value) => handleInputChange('nh_vt2', value)}
                    options={getFilteredMaterialGroupOptions('nh_vt2')}
                    placeholder="Chọn nhóm vật tư 2"
                    searchPlaceholder="Tìm kiếm nhóm vật tư..."
                    loading={isLoadingMaterialGroups}
                    onSearch={handleMaterialGroupSearch}
                    displayKey="ten_nh"
                    valueKey="ma_nh"
                  />
                </div>

                <div>
                  <Label>Nhóm vật tư 3</Label>
                  <SearchableSelect
                    value={formData.nh_vt3}
                    onChange={(value) => handleInputChange('nh_vt3', value)}
                    options={getFilteredMaterialGroupOptions('nh_vt3')}
                    placeholder="Chọn nhóm vật tư 3"
                    searchPlaceholder="Tìm kiếm nhóm vật tư..."
                    loading={isLoadingMaterialGroups}
                    onSearch={handleMaterialGroupSearch}
                    displayKey="ten_nh"
                    valueKey="ma_nh"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" type="button" onClick={handleClose}>
              Hủy bỏ
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={createMaterialMutation.isLoading}
            >
              {createMaterialMutation.isLoading ? "Đang lưu..." : "Nhận"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};