import { Plus, Save, X } from "lucide-react";
import { useCallback, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/ui/modal";
import { useAccounts } from "../../../hooks/useAccounts";
import { useCreateDmvt } from "../../../hooks/useDmvt";
import { useMaterialGroups } from "../../../hooks/useMaterialGroup";
import SearchableSelect from "../account/SearchableSelect";

export const ModalCreateMaterial = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
  const [formData, setFormData] = useState({
    // ma_vt: "",
    ten_vt: "",
    // ten_vt2: "",
    dvt: "",
    vt_ton_kho: "1",
    gia_ton: 1,
    loai_vt: "21",
    tk_vt: "",
    sua_tk_vt: "0",
    tk_dt: "",
    tk_dtnb: "",
    tk_ck: "",
    tk_nvl: "",
    tk_gv: "",
    tk_km: "",
    tk_tl: "",
    // tk_ck_dat_hang: "",
    tk_spdd: "",
    nh_vt1: "",
    nh_vt2: "",
    nh_vt3: "",
    sl_min: "0.000",
    sl_max: "0.000",
    ghi_chu: "",
    status: "1",
    // ma_tra_cuu: ""
  });

  const [accountSearchTerm, setAccountSearchTerm] = useState("");
  const [materialGroupSearchTerm, setMaterialGroupSearchTerm] = useState("");

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
  const accountOptions = (accountsData?.data || []).map(account => ({
    value: account.tk0,
    displayKey: account.ten_tk,
    valueKey: account.tk0,
  }));

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

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle account selection cho từng loại tài khoản
  const handleAccountSelect = useCallback((accountType, accountCode) => {
    setFormData(prev => ({
      ...prev,
      [accountType]: accountCode
    }));
  }, []);

  // Handle account search
  const handleAccountSearch = useCallback((searchTerm) => {
    setAccountSearchTerm(searchTerm);
  }, []);

  // Handle material group search
  const handleMaterialGroupSearch = useCallback((searchTerm) => {
    setMaterialGroupSearchTerm(searchTerm);
  }, []);

  // Handle Enter key navigation (bỏ qua field disabled và không focus được)
  const handleFormFieldEnter = useCallback((currentField) => {
    const fieldOrder = [
      "ten_vt", "dvt", "vt_ton_kho", "gia_ton", "loai_vt", "tk_vt",
      "sua_tk_vt", "tk_dt", "tk_dtnb", "tk_ck", "tk_gv", "tk_km",
      "tk_tl", "tk_spdd", "nh_vt1", "nh_vt2", "nh_vt3",
      "sl_min", "sl_max", "ghi_chu", "status"
    ];

    const focusFirstFocusableInField = (fieldName) => {
      const container = document.querySelector(`[data-form-field="${fieldName}"]`);
      if (!container) return false;
      const candidate = container.querySelector(
        'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), [role="combobox"], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (candidate) {
        candidate.focus();
        if (typeof candidate.select === 'function') {
          candidate.select();
        }
        return true;
      }
      return false;
    };

    const currentIndex = fieldOrder.indexOf(currentField);
    for (let i = currentIndex + 1; i < fieldOrder.length; i++) {
      if (focusFirstFocusableInField(fieldOrder[i])) {
        return;
      }
    }

    // Cuối form hoặc không tìm thấy field phù hợp -> focus nút Lưu
    setTimeout(() => {
      const saveButton = document.querySelector('[data-save-button]');
      if (saveButton) {
        saveButton.focus();
      }
    }, 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!formData.ten_vt.trim()) {
      setErrors(prev => ({ ...prev, ten_vt: "Vui lòng nhập tên vật tư" }));
      hasError = true;
    }

    if (hasError) return;

    try {
      await createMaterialMutation.mutateAsync({
        // ma_vt: formData.ma_vt,
        ten_vt: formData.ten_vt,
        // ten_vt2: formData.ten_vt2,
        dvt: formData.dvt,
        vt_ton_kho: formData.vt_ton_kho,
        gia_ton: formData.gia_ton,
        loai_vt: formData.loai_vt,
        tk_vt: formData.tk_vt,
        sua_tk_vt: formData.sua_tk_vt,
        tk_dt: formData.tk_dt,
        tk_dtnb: formData.tk_dtnb,
        tk_ck: formData.tk_ck,
        tk_nvl: formData.tk_nvl,
        tk_gv: formData.tk_gv,
        tk_km: formData.tk_km,
        tk_tl: formData.tk_tl,
        // tk_ck_dat_hang: formData.tk_ck_dat_hang,
        tk_spdd: formData.tk_spdd,
        nh_vt1: formData.nh_vt1,
        nh_vt2: formData.nh_vt2,
        nh_vt3: formData.nh_vt3,
        sl_min: formData.sl_min,
        sl_max: formData.sl_max,
        ghi_chu: formData.ghi_chu,
        status: formData.status,
        // ma_tra_cuu: formData.ma_tra_cuu,
      });

      // Reset form
      setFormData({
        // ma_vt: "",
        ten_vt: "",
        // ten_vt2: "",
        dvt: "",
        vt_ton_kho: "1",
        gia_ton: 1,
        loai_vt: "21",
        tk_vt: "",
        sua_tk_vt: "0",
        tk_dt: "",
        tk_dtnb: "",
        tk_ck: "",
        tk_nvl: "",
        tk_gv: "",
        tk_km: "",
        tk_tl: "",
        // tk_ck_dat_hang: "",
        tk_spdd: "",
        nh_vt1: "",
        nh_vt2: "",
        nh_vt3: "",
        sl_min: "0.000",
        sl_max: "0.000",
        ghi_chu: "",
        status: "1",
        // ma_tra_cuu: ""
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
      // ma_vt: "",
      ten_vt: "",
      // ten_vt2: "",
      dvt: "",
      vt_ton_kho: "1",
      gia_ton: 1,
      loai_vt: "21",
      tk_vt: "",
      sua_tk_vt: "0",
      tk_dt: "",
      tk_dtnb: "",
      tk_ck: "",
      tk_nvl: "",
      tk_gv: "",
      tk_km: "",
      tk_tl: "",
      // tk_ck_dat_hang: "",
      tk_spdd: "",
      nh_vt1: "",
      nh_vt2: "",
      nh_vt3: "",
      sl_min: "0.000",
      sl_max: "0.000",
      ghi_chu: "",
      status: "1",
      // ma_tra_cuu: ""
    });
    setAccountSearchTerm("");
    setMaterialGroupSearchTerm("");
    setErrors({ ten_vt: "" });
    closeModalCreate();
  };

  const isPending = createMaterialMutation.isPending;

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} title="Thêm mới vật tư" className="w-full max-w-7xl m-1 border-2">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-shrink-0 px-6 lg:px-8 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Tạo vật tư mới
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin vật tư mới vào hệ thống
              </p>
            </div>
          </div>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="px-4 py-3 bg-blue-50">

            <div className="gap-x-8 gap-y-2">
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[15%]">Tên vật tư *</Label>
                  <div className="w-[87.5%]" data-form-field="ten_vt">
                    <Input
                      type="text"
                      value={formData.ten_vt}
                      onChange={(e) => {
                        handleInputChange('ten_vt', e.target.value);
                        if (errors.ten_vt) {
                          setErrors((prev) => ({ ...prev, ten_vt: "" }));
                        }
                      }}
                      onEnterPress={() => handleFormFieldEnter('ten_vt')}
                      placeholder="Nhập tên vật tư"
                      className="h-8 text-sm w-full bg-white"
                      required
                    />
                  </div>

                  {errors.ten_vt && (
                    <p className="mt-1 text-sm text-red-500">{errors.ten_vt}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-2"></div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {/* Cột trái */}
              <div className="space-y-2 mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">Đơn vị tính</Label>
                  <div className="w-[70%]" data-form-field="dvt">
                    <Input
                      type="text"
                      value={formData.dvt}
                      onChange={(e) => handleInputChange('dvt', e.target.value)}
                      onEnterPress={() => handleFormFieldEnter('dvt')}
                      placeholder=""
                      className="h-8 text-sm w-full bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs basis-[30%]">Theo dõi tồn kho</Label>
                  <div className="flex gap-2 items-center basis-[70%]">
                    <div className="basis-3/5" data-form-field="vt_ton_kho">
                      <Input
                        type="text"
                        value={formData.vt_ton_kho}
                        onChange={(e) => handleInputChange('vt_ton_kho', e.target.value)}
                        onEnterPress={() => handleFormFieldEnter('vt_ton_kho')}
                        placeholder="1"
                        className="h-8 text-sm w-full bg-white"
                      />
                    </div>
                    <span className="text-xs text-gray-600 basis-2/5">
                      <div>0 - Không theo dõi tồn kho,</div>
                      <div>1 - Theo dõi tồn kho</div>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs basis-[30%]">Cách tính giá tồn kho</Label>
                  <div className="flex items-center gap-2 basis-[70%]">
                    <div className="basis-3/5" data-form-field="gia_ton">
                      <Input
                        type="number"
                        value={formData.gia_ton}
                        onChange={(e) => handleInputChange('gia_ton', e.target.value)}
                        onEnterPress={() => handleFormFieldEnter('gia_ton')}
                        placeholder="1"
                        className="h-8 text-sm w-full bg-white"
                        disabled
                      />
                    </div>
                    <span className="text-xs text-gray-600 basis-2/5">Trung bình tháng</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">Loại vật tư</Label>
                  <div className="w-[70%]" data-form-field="loai_vt">
                    <Input
                      type="text"
                      value={formData.loai_vt}
                      onChange={(e) => handleInputChange('loai_vt', e.target.value)}
                      onEnterPress={() => handleFormFieldEnter('loai_vt')}
                      placeholder=""
                      className="h-8 text-sm w-full bg-white"
                    />
                  </div>

                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">Tài khoản kho</Label>
                  <div className="w-[70%]" data-form-field="tk_vt">
                    <SearchableSelect
                      value={formData.tk_vt}
                      onChange={(value) => {
                        handleAccountSelect('tk_vt', value);
                        handleFormFieldEnter('tk_vt');
                      }}
                      options={accountOptions}
                      placeholder="Chọn tài khoản kho"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm"
                    />
                  </div>

                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs basis-[30%]">Sửa tài khoản khoản</Label>
                  <div className="flex items-center gap-2 basis-[70%]">
                    <div className="basis-3/5" data-form-field="sua_tk_vt">
                      <Input
                        type="text"
                        value={formData.sua_tk_vt}
                        onChange={(e) => handleInputChange('sua_tk_vt', e.target.value)}
                        onEnterPress={() => handleFormFieldEnter('sua_tk_vt')}
                        placeholder="0"
                        className="h-8 text-sm w-full bg-white"
                      />
                    </div>
                    <span className="text-xs text-gray-600 basis-2/5">
                      <div>0 - Không được sửa,</div>
                      <div>1 - Được sửa</div>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK doanh thu</Label>
                  <div className="w-[70%]" data-form-field="tk_dt">
                    <SearchableSelect
                      value={formData.tk_dt}
                      onChange={(value) => {
                        handleAccountSelect('tk_dt', value);
                        handleFormFieldEnter('tk_dt');
                      }}
                      options={accountOptions}
                      placeholder="Chọn tài khoản doanh thu"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK doanh thu nội bộ</Label>
                  <div className="w-[70%]" data-form-field="tk_dtnb">
                    <SearchableSelect
                      value={formData.tk_dtnb}
                      onChange={(value) => {
                        handleAccountSelect('tk_dtnb', value);
                        handleFormFieldEnter('tk_dtnb');
                      }}
                      options={accountOptions}
                      placeholder="Chọn tài khoản"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK chiết khấu</Label>
                  <div className="w-[70%]" data-form-field="tk_ck">
                    <SearchableSelect
                      value={formData.tk_ck}
                      onChange={(value) => {
                        handleAccountSelect('tk_ck', value);
                        handleFormFieldEnter('tk_ck');
                      }}
                      options={accountOptions}
                      placeholder="Chọn tài khoản"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK giá vốn</Label>
                  <div className="w-[70%]" data-form-field="tk_gv">
                    <SearchableSelect
                      value={formData.tk_gv}
                      onChange={(value) => {
                        handleAccountSelect('tk_gv', value);
                        handleFormFieldEnter('tk_gv');
                      }}
                      options={accountOptions}
                      placeholder="112"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK có khuyến mãi</Label>
                  <div className="w-[70%]" data-form-field="tk_km">
                    <SearchableSelect
                      value={formData.tk_km}
                      onChange={(value) => {
                        handleAccountSelect('tk_km', value);
                        handleFormFieldEnter('tk_km');
                      }}
                      options={accountOptions}
                      placeholder="1131"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">Nhóm vật tư 1, 2, 3</Label>
                  <div className="w-[70%]">
                    <Input
                      type="text"
                      value={formData.nh_vt1}
                      onChange={(e) => handleInputChange('nh_vt1', e.target.value)}
                      placeholder="Nhóm vật tư 1"
                      className="h-8 text-sm bg-white w-[100%]" // 👈 dùng w-40 (~10rem)
                    />
                  </div>
                </div> */}


              </div>

              {/* Cột phải */}
              <div className="space-y-2 mb-2">

                {/* Spacers để căn chỉnh với các field ở cột trái */}
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-8"></div>
                ))}

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK hàng bán bị trả lại</Label>
                  <div className="w-[70%]" data-form-field="tk_tl">
                    <SearchableSelect
                      value={formData.tk_tl}
                      onChange={(value) => {
                        handleAccountSelect('tk_tl', value);
                        handleFormFieldEnter('tk_tl');
                      }}
                      options={accountOptions}
                      placeholder="112"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm"
                    />
                  </div>

                </div>

                {/* <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK chiết khấu giá vật tư</Label>
                  <div className="w-[70%]">
                    <Input
                      type="text"
                      value={formData.tk_ck_dat_hang}
                      onChange={(e) => handleInputChange('tk_ck_dat_hang', e.target.value)}
                      placeholder=""
                      className="h-8 text-sm flex-1 bg-white"
                    />
                  </div>

                </div> */}
                <div className="h-8"></div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK nguyên vật liệu</Label>
                  <div className="w-[70%]" data-form-field="tk_nvl">
                    <SearchableSelect
                      value={formData.tk_nvl}
                      onChange={(value) => {
                        handleAccountSelect('tk_nvl', value);
                        handleFormFieldEnter('tk_nvl');
                      }}
                      options={accountOptions}
                      placeholder="Chọn tài khoản nguyên vật liệu"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm flex-1 bg-white"
                    />
                  </div>

                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">TK sản phẩm dở dang</Label>
                  <div className="w-[70%]" data-form-field="tk_spdd">
                    <SearchableSelect
                      value={formData.tk_spdd}
                      onChange={(value) => {
                        handleAccountSelect('tk_spdd', value);
                        handleFormFieldEnter('tk_spdd');
                      }}
                      options={accountOptions}
                      placeholder="Chọn tài khoản"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoadingAccounts}
                      onSearch={handleAccountSearch}
                      displayKey="displayKey"
                      valueKey="valueKey"
                      className="h-8 text-sm flex-1 bg-white"
                    />
                  </div>

                </div>

                {/* Spacers cho alignment */}
                <div className="h-8"></div>



              </div>
            </div>
            <div className="gap-x-8 gap-y-2">
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[15%]">Nhóm vật tư 1, 2, 3</Label>
                  <div className="w-[87.5%]">
                    <div className="grid grid-cols-3 gap-2">
                      <div data-form-field="nh_vt1">
                        <SearchableSelect
                          value={formData.nh_vt1}
                          onChange={(value) => {
                            handleInputChange('nh_vt1', value);
                            handleFormFieldEnter('nh_vt1');
                          }}
                          onEnterPress={() => handleFormFieldEnter('nh_vt1')}
                          options={getFilteredMaterialGroupOptions('nh_vt1')}
                          placeholder="Chọn nhóm vật tư 1"
                          searchPlaceholder="Tìm kiếm nhóm vật tư..."
                          loading={isLoadingMaterialGroups}
                          onSearch={handleMaterialGroupSearch}
                          displayKey="ten_nh"
                          valueKey="ma_nh"
                          className="h-8 text-sm flex-1 bg-white"
                        />
                      </div>
                      <div data-form-field="nh_vt2">
                        <SearchableSelect
                          value={formData.nh_vt2}
                          onChange={(value) => {
                            handleInputChange('nh_vt2', value);
                            handleFormFieldEnter('nh_vt2');
                          }}
                          onEnterPress={() => handleFormFieldEnter('nh_vt2')}
                          options={getFilteredMaterialGroupOptions('nh_vt2')}
                          placeholder="Chọn nhóm vật tư 2"
                          searchPlaceholder="Tìm kiếm nhóm vật tư..."
                          loading={isLoadingMaterialGroups}
                          onSearch={handleMaterialGroupSearch}
                          displayKey="ten_nh"
                          valueKey="ma_nh"
                          className="h-8 text-sm flex-1 bg-white"
                        />
                      </div>
                      <div data-form-field="nh_vt3">
                        <SearchableSelect
                          value={formData.nh_vt3}
                          onChange={(value) => {
                            handleInputChange('nh_vt3', value);
                            handleFormFieldEnter('nh_vt3');
                          }}
                          onEnterPress={() => handleFormFieldEnter('nh_vt3')}
                          options={getFilteredMaterialGroupOptions('nh_vt3')}
                          placeholder="Chọn nhóm vật tư 3"
                          searchPlaceholder="Tìm kiếm nhóm vật tư..."
                          loading={isLoadingMaterialGroups}
                          onSearch={handleMaterialGroupSearch}
                          displayKey="ten_nh"
                          valueKey="ma_nh"
                          className="h-8 text-sm flex-1 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="space-y-2 mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">SL tồn tối thiểu</Label>
                  <div className="w-[70%]" data-form-field="sl_min">
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.sl_min}
                      onChange={(e) => handleInputChange('sl_min', e.target.value)}
                      onEnterPress={() => handleFormFieldEnter('sl_min')}
                      placeholder="0,000"
                      className="h-8 text-sm w-full bg-white text-right"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[30%]">SL tồn tối đa</Label>
                  <div className="w-[70%]" data-form-field="sl_max">
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.sl_max}
                      onChange={(e) => handleInputChange('sl_max', e.target.value)}
                      onEnterPress={() => handleFormFieldEnter('sl_max')}
                      placeholder="0,000"
                      className="h-8 text-sm w-full bg-white text-right"
                    />
                  </div>

                </div>
              </div>
            </div>
            <div className="gap-x-8 gap-y-2">
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs w-[15%]">Ghi chú</Label>
                  <div className="w-[87.5%]" data-form-field="ghi_chu">
                    <Input
                      type="text"
                      value={formData.ghi_chu}
                      onChange={(e) => handleInputChange('ghi_chu', e.target.value)}
                      onEnterPress={() => handleFormFieldEnter('ghi_chu')}
                      placeholder=""
                      className="h-8 text-sm w-full bg-white"
                    />
                  </div>

                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs basis-[30%]">Trạng thái</Label>
                  <div className="flex items-center gap-2 basis-[70%]">
                    <div className="basis-3/5" data-form-field="status">
                      <Input
                        type="text"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        onEnterPress={() => handleFormFieldEnter('status')}
                        placeholder="1"
                        className="h-8 text-sm w-full bg-white"
                      />
                    </div>
                    <span className="text-xs text-gray-600 basis-2/5">
                      <div>0 - Không sử dụng,</div>
                      <div>1 - Sử dụng</div>       
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 justify-end bg-gray-50 dark:bg-gray-800 flex-shrink-0 rounded-b-3xl">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-medium text-white dark:text-gray-700 bg-red-600 border border-gray-300 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              data-save-button
              className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <Save size={16} />
              {isPending ? "Đang lưu..." : "Lưu lại"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};