import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useAccounts, useCreateAccount, useGroupAccounts } from "../../../hooks/useAccounts";
import SearchableSelect from "./SearchableSelect";

export const ModalCreateAccount = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
  const [formData, setFormData] = useState({
    tk0: "",
    ten_tk: "",
    tk_me: "",
    ma_nt: "",
    nh_tk: "",
  });

  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [listSearchTerm, setListSearchTerm] = useState("");
  const createAccountMutation = useCreateAccount();
  const [errors, setErrors] = useState({
    tk0: "",
    ten_tk: "",
  });

  const { data: groupAccountsResponse, isLoading: isGroupLoading } = useGroupAccounts({
    search: groupSearchTerm,
    page: 1,
    limit: 50,
  });

  const { data: accountsResponse, isLoading } = useAccounts({
    search: listSearchTerm,
    page: 1,
    limit: 50,
  });

  const groupAccounts = groupAccountsResponse?.data || [];
  const accountsList = accountsResponse?.data || [];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGroupSearch = (searchTerm) => {
    setGroupSearchTerm(searchTerm);
  };

  const handleListSearch = (searchTerm) => {
    setListSearchTerm(searchTerm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    setErrors({ tk0: "", ten_tk: "" });

    if (!formData.tk0.trim()) {
      setErrors(prev => ({ ...prev, tk: "Vui lòng nhập mã tài khoản" }));
      hasError = true;
    }

    if (!formData.ten_tk.trim()) {
      setErrors(prev => ({ ...prev, ten_tk: "Vui lòng nhập tên tài khoản" }));
      hasError = true;
    }

    if (hasError) return;

    try {
      await createAccountMutation.mutateAsync({
        ...formData,
        tk_me: formData.tk_me || undefined,
        ma_nt: formData.ma_nt || undefined,
        nh_tk: formData.nh_tk || undefined,
      });

      // Reset form
      setFormData({
        tk0: "",
        ten_tk: "",
        tk_me: "",
        ma_nt: "",
        nh_tk: "",
      });
      setErrors({ tk0: "", ten_tk: "" });
      setGroupSearchTerm("");
      setListSearchTerm("");

      onSaveCreate();
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('tk')) {
          setErrors(prev => ({ ...prev, tk: "Mã tài khoản đã tồn tại" }));
        }
      }
    }
  };

  const handleClose = () => {
    setFormData({
      tk0: "",
      ten_tk: "",
      tk_me: "",
      ma_nt: "",
      nh_tk: "",
    });
    setErrors({ tk0: "", ten_tk: "" });
    setGroupSearchTerm("");
    setListSearchTerm("");
    closeModalCreate();
  };

  const groupOptions = groupAccounts.map(item => ({
    value: item.ma_nh,
    label: item.ten_nh,
    loai_nh: item.loai_nh
  }));

  const accountOptions = accountsList.map(item => ({
    value: item.tk0,
    label: item.ten_tk,
  }));

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} className="max-w-[700px] max-h-[90vh] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Thêm mới tài khoản
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Nhập thông tin tài khoản mới vào hệ thống.
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Thông tin tài khoản
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Mã tài khoản *</Label>
                  <Input
                    type="text"
                    value={formData.tk0}
                    onChange={(e) => {
                      handleInputChange('tk0', e.target.value);
                      if (errors.tk0) {
                        setErrors((prev) => ({ ...prev, tk0: "" }));
                      }
                    }}
                    placeholder="Nhập mã tài khoản"
                    maxLength={16}
                    required
                  />
                  {errors.tk0 && (
                    <p className="mt-1 text-sm text-red-500">{errors.tk0}</p>
                  )}
                </div>

                <div>
                  <Label>Tên tài khoản *</Label>
                  <Input
                    type="text"
                    value={formData.ten_tk}
                    onChange={(e) => {
                      handleInputChange('ten_tk', e.target.value);
                      if (errors.ten_tk) {
                        setErrors((prev) => ({ ...prev, ten_tk: "" }));
                      }
                    }}
                    placeholder="Nhập tên tài khoản"
                    required
                  />
                  {errors.ten_tk && (
                    <p className="mt-1 text-sm text-red-500">{errors.ten_tk}</p>
                  )}
                </div>

                <div>
                  <Label>Tài khoản mẹ</Label>
                  <SearchableSelect
                    value={formData.tk_me}
                    onChange={(value) => handleInputChange('tk_me', value)}
                    options={accountOptions}
                    placeholder="Chọn tài khoản"
                    searchPlaceholder="Tìm kiếm tài khoản..."
                    loading={isLoading}
                    onSearch={handleListSearch}
                    displayKey="label"
                    valueKey="value"
                  />
                </div>

                <div>
                  <Label>Mã ngoại tệ</Label>
                  <Input
                    type="text"
                    value={formData.ma_nt}
                    onChange={(e) => handleInputChange('ma_nt', e.target.value)}
                    placeholder="Nhập mã ngoại tệ (VD: VND, USD)"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Loại tài khoản</Label>
                  <SearchableSelect
                    value={formData.nh_tk}
                    onChange={(value) => handleInputChange('nh_tk', value)}
                    options={groupOptions}
                    placeholder="Chọn loại tài khoản"
                    searchPlaceholder="Tìm kiếm loại tài khoản..."
                    loading={isGroupLoading}
                    onSearch={handleGroupSearch}
                    displayKey="label"
                    valueKey="value"
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
              disabled={createAccountMutation.isLoading}
            >
              {createAccountMutation.isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};