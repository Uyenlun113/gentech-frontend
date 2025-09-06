import { Plus, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useAccounts, useCreateAccount, useGroupAccounts } from "../../../hooks/useAccounts";
import SearchableSelect from "./SearchableSelect";

const CN_OPTIONS = [
  { value: 1, label: "Có" },
  { value: 0, label: "Không" },
]

const SC_OPTIONS = [
  { value: 1, label: "Là TK sổ cái" },
  { value: 0, label: "Không là TK sổ cái" },
]

export const ModalCreateAccount = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
  const [formData, setFormData] = useState({
    tk0: "",
    ten_tk: "",
    tk_me: "",
    ma_nt: "",
    nh_tk: "",
    tk_cn: 0,
    tk_sc: 0,
  });

  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [listSearchTerm, setListSearchTerm] = useState("");
  const createAccountMutation = useCreateAccount();
  const [errors, setErrors] = useState({
    tk0: "",
    ten_tk: "",
  });

  // Input refs cho Enter navigation
  const inputRefs = useRef({
    tk0Ref: null,
    tenTkRef: null,
    tkMeRef: null,
    maNtRef: null,
    nhTkRef: null,
    tkCnRef: null,
    tkScRef: null,
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

  // Handler xử lý Enter navigation
  const handleEnterPress = useCallback((currentField) => {
    const fieldOrder = ['tk0', 'ten_tk', 'ma_nt', 'tk_me', 'nh_tk', 'tk_cn', 'tk_sc'];
    const currentIndex = fieldOrder.indexOf(currentField);

    if (currentIndex < fieldOrder.length - 1) {
      const nextField = fieldOrder[currentIndex + 1];
      const nextRef = inputRefs.current[`${nextField}Ref`];

      setTimeout(() => {
        if (nextRef && nextRef.current) {
          nextRef.current.focus();
        }
      }, 50);
    } else {
      // Nếu là field cuối cùng, submit form
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      document.querySelector('form').dispatchEvent(submitEvent);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    setErrors({ tk0: "", ten_tk: "" });

    if (!formData.tk0.trim()) {
      setErrors(prev => ({ ...prev, tk0: "Vui lòng nhập mã tài khoản" }));
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
        tk_cn: formData.tk_cn || undefined,
        tk_sc: formData.tk_sc || undefined
      });

      // Reset form
      setFormData({
        tk0: "",
        ten_tk: "",
        tk_me: "",
        ma_nt: "",
        nh_tk: "",
        tk_cn: 0,
        tk_sc: 0,
      });
      setErrors({ tk0: "", ten_tk: "" });
      setGroupSearchTerm("");
      setListSearchTerm("");

      onSaveCreate();
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('tk')) {
          setErrors(prev => ({ ...prev, tk0: "Mã tài khoản đã tồn tại" }));
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
      tk_cn: 1,
      tk_sc: 1,
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
    <Modal isOpen={isOpenCreate} onClose={handleClose} className="max-w-7xl max-h-[90vh] m-4">
      <div className="relative w-full h-full rounded-3xl bg-white dark:bg-gray-900 flex flex-col overflow-hidden shadow-2xl">
        <div className="flex-shrink-0 p-2 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-100 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                Thêm tài khoản mới
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin tài khoản mới với giao diện tối ưu
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar overflow-y-auto p-4 bg-blue-50">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Thông tin tài khoản
              </h5>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Mã tài khoản *
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.tk0Ref}
                      type="text"
                      value={formData.tk0}
                      onChange={(e) => {
                        handleInputChange('tk0', e.target.value);
                        if (errors.tk0) {
                          setErrors((prev) => ({ ...prev, tk0: "" }));
                        }
                      }}
                      onEnterPress={() => handleEnterPress('tk0')}
                      placeholder="Nhập mã tài khoản"
                      maxLength={16}
                      required
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={1}
                    />
                    {errors.tk0 && (
                      <p className="mt-1 text-sm text-red-500">{errors.tk0}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Tên tài khoản *
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.tenTkRef}
                      type="text"
                      value={formData.ten_tk}
                      onChange={(e) => {
                        handleInputChange('ten_tk', e.target.value);
                        if (errors.ten_tk) {
                          setErrors((prev) => ({ ...prev, ten_tk: "" }));
                        }
                      }}
                      onEnterPress={() => handleEnterPress('ten_tk')}
                      placeholder="Nhập tên tài khoản"
                      required
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={2}
                    />
                    {errors.ten_tk && (
                      <p className="mt-1 text-sm text-red-500">{errors.ten_tk}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Tài khoản mẹ
                  </Label>
                  <div className="flex-1">
                    <SearchableSelect
                      ref={inputRefs.current.tkMeRef}
                      value={formData.tk_me}
                      onChange={(value) => handleInputChange('tk_me', value)}
                      options={accountOptions}
                      placeholder="Chọn tài khoản"
                      searchPlaceholder="Tìm kiếm tài khoản..."
                      loading={isLoading}
                      onSearch={handleListSearch}
                      displayKey="label"
                      valueKey="value"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={4}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Mã ngoại tệ
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.maNtRef}
                      type="text"
                      value={formData.ma_nt}
                      onChange={(e) => handleInputChange('ma_nt', e.target.value)}
                      onEnterPress={() => handleEnterPress('ma_nt')}
                      placeholder="Nhập mã ngoại tệ (VD: VND, USD)"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={3}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Loại tài khoản
                  </Label>
                  <div className="flex-1">
                    <SearchableSelect
                      ref={inputRefs.current.nhTkRef}
                      value={formData.nh_tk}
                      onChange={(value) => handleInputChange('nh_tk', value)}
                      options={groupOptions}
                      placeholder="Chọn loại tài khoản"
                      searchPlaceholder="Tìm kiếm loại tài khoản..."
                      loading={isGroupLoading}
                      onSearch={handleGroupSearch}
                      displayKey="label"
                      valueKey="value"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={5}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    TK có theo dõi công nợ
                  </Label>
                  <div className="flex-1">
                    <Select
                      ref={inputRefs.current.tkCnRef}
                      defaultValue={formData.tk_cn}
                      options={CN_OPTIONS}
                      onChange={(value) => handleInputChange("tk_cn", value)}
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={6}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Tài khoản sổ cái
                  </Label>
                  <div className="flex-1">
                    <Select
                      ref={inputRefs.current.tkScRef}
                      defaultValue={formData.tk_sc}
                      options={SC_OPTIONS}
                      onChange={(value) => handleInputChange("tk_sc", value)}
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={7}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 pb-4 lg:justify-end bg-blue-50">
            <Button size="sm" variant="outline" type="button" onClick={handleClose} >
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