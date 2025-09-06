import { Plus, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useCreateCustomer } from "../../../hooks/useCustomer";
import { useCustomerGroups } from "../../../hooks/useCustomerGroups";
import SearchableSelect from "../account/SearchableSelect";

export const ModalCreateCustomer = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
  const [formData, setFormData] = useState({
    ten_kh: "",
    doi_tac: "",
    e_mail: "",
    dien_thoai: "",
    dia_chi: "",
    ma_so_thue: "",
    ma_tra_cuu: "",
    tk_nh: "",
    ten_nh: "",
    ghi_chu: "",
    nh_kh1: "",
    nh_kh2: "",
    nh_kh3: "",
  });

  const createCustomerMutation = useCreateCustomer();
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

  const [errors, setErrors] = useState({
    ten_kh: "",
  });

  // Input refs cho Enter navigation
  const inputRefs = useRef({
    tenKhRef: null,
    doiTacRef: null,
    emailRef: null,
    dienThoaiRef: null,
    diaChiRef: null,
    maSoThueRef: null,
    maTraCuuRef: null,
    tkNhRef: null,
    tenNhRef: null,
    ghiChuRef: null,
    nhKh1Ref: null,
    nhKh2Ref: null,
    nhKh3Ref: null,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler xử lý Enter navigation
  const handleEnterPress = useCallback((currentField) => {
    const fieldOrder = ['ten_kh', 'doi_tac', 'e_mail', 'dien_thoai', 'dia_chi', 'ma_so_thue', 'ma_tra_cuu', 'tk_nh', 'ten_nh', 'ghi_chu', 'nh_kh1', 'nh_kh2', 'nh_kh3'];
    const currentIndex = fieldOrder.indexOf(currentField);

    if (currentIndex < fieldOrder.length - 1) {
      const nextField = fieldOrder[currentIndex + 1];
      const nextRef = inputRefs.current[`${nextField.charAt(0).toUpperCase() + nextField.slice(1).replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())}Ref`];

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
    setErrors({ ten_kh: "" });
    if (!formData.ten_kh.trim()) {
      setErrors(prev => ({ ...prev, ten_kh: "Vui lòng nhập tên khách hàng" }));
      hasError = true;
    }

    if (hasError) return;

    try {
      await createCustomerMutation.mutateAsync({
        ...formData,
        doi_tac: formData.doi_tac || undefined,
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
        status: "1",
      });
      setFormData({
        ten_kh: "",
        e_mail: "",
        doi_tac: "",
        dien_thoai: "",
        dia_chi: "",
        ma_so_thue: "",
        ma_tra_cuu: "",
        tk_nh: "",
        ten_nh: "",
        ghi_chu: "",
        nh_kh1: "",
        nh_kh2: "",
        nh_kh3: "",
      });
      setErrors({ ten_kh: "" });

      onSaveCreate();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      ten_kh: "",
      e_mail: "",
      doi_tac: "",
      dien_thoai: "",
      dia_chi: "",
      ma_so_thue: "",
      ma_tra_cuu: "",
      tk_nh: "",
      ten_nh: "",
      ghi_chu: "",
      nh_kh1: "",
      nh_kh2: "",
      nh_kh3: "",
    });
    setErrors({ ten_kh: "" });
    setSearchTerm("");
    closeModalCreate();
  };

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
                Thêm mới khách hàng
              </h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Nhập thông tin khách hàng mới vào hệ thống
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
                Thông tin cơ bản
              </h5>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Tên khách hàng *
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.tenKhRef}
                      type="text"
                      value={formData.ten_kh}
                      onChange={(e) => {
                        handleInputChange('ten_kh', e.target.value);
                        if (errors.ten_kh) {
                          setErrors((prev) => ({ ...prev, ten_kh: "" }));
                        }
                      }}
                      onEnterPress={() => handleEnterPress('ten_kh')}
                      placeholder="Nhập tên khách hàng"
                      required
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={1}
                    />
                    {errors.ten_kh && (
                      <p className="mt-1 text-sm text-red-500">{errors.ten_kh}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Đối tác
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.doiTacRef}
                      type="text"
                      value={formData.doi_tac}
                      onChange={(e) => handleInputChange('doi_tac', e.target.value)}
                      onEnterPress={() => handleEnterPress('doi_tac')}
                      placeholder="Nhập đối tác"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={2}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Email
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.emailRef}
                      type="email"
                      value={formData.e_mail}
                      onChange={(e) => handleInputChange('e_mail', e.target.value)}
                      onEnterPress={() => handleEnterPress('e_mail')}
                      placeholder="Nhập email"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={3}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Số điện thoại
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.dienThoaiRef}
                      type="text"
                      value={formData.dien_thoai}
                      onChange={(e) => handleInputChange('dien_thoai', e.target.value)}
                      onEnterPress={() => handleEnterPress('dien_thoai')}
                      placeholder="Nhập số điện thoại"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={4}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Địa chỉ
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.diaChiRef}
                      type="text"
                      value={formData.dia_chi}
                      onChange={(e) => handleInputChange('dia_chi', e.target.value)}
                      onEnterPress={() => handleEnterPress('dia_chi')}
                      placeholder="Nhập địa chỉ"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={5}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Thông tin bổ sung
              </h5>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Mã số thuế
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.maSoThueRef}
                      type="text"
                      value={formData.ma_so_thue}
                      onChange={(e) => handleInputChange('ma_so_thue', e.target.value)}
                      onEnterPress={() => handleEnterPress('ma_so_thue')}
                      placeholder="Nhập mã số thuế"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={6}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Mã tra cứu
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.maTraCuuRef}
                      type="text"
                      value={formData.ma_tra_cuu}
                      onChange={(e) => handleInputChange('ma_tra_cuu', e.target.value)}
                      onEnterPress={() => handleEnterPress('ma_tra_cuu')}
                      placeholder="Nhập mã tra cứu"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={7}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Tài khoản ngân hàng
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.tkNhRef}
                      type="text"
                      value={formData.tk_nh}
                      onChange={(e) => handleInputChange('tk_nh', e.target.value)}
                      onEnterPress={() => handleEnterPress('tk_nh')}
                      placeholder="Nhập số tài khoản"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={8}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Tên ngân hàng
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.tenNhRef}
                      type="text"
                      value={formData.ten_nh}
                      onChange={(e) => handleInputChange('ten_nh', e.target.value)}
                      onEnterPress={() => handleEnterPress('ten_nh')}
                      placeholder="Nhập tên ngân hàng"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={9}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Ghi chú
                  </Label>
                  <div className="flex-1">
                    <Input
                      inputRef={inputRefs.current.ghiChuRef}
                      type="text"
                      value={formData.ghi_chu}
                      onChange={(e) => handleInputChange('ghi_chu', e.target.value)}
                      onEnterPress={() => handleEnterPress('ghi_chu')}
                      placeholder="Nhập ghi chú"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={10}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Phân nhóm khách hàng
              </h5>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4">
                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Nhóm khách 1
                  </Label>
                  <div className="flex-1">
                    <SearchableSelect
                      ref={inputRefs.current.nhKh1Ref}
                      value={formData.nh_kh1}
                      onChange={(value) => handleInputChange('nh_kh1', value)}
                      options={getFilteredOptions('nh_kh1')}
                      placeholder="Chọn nhóm khách hàng 1"
                      searchPlaceholder="Tìm kiếm nhóm khách hàng..."
                      loading={loadingGroups}
                      onSearch={setSearchTerm}
                      displayKey="ten_nh"
                      valueKey="ma_nh"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={11}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Nhóm khách 2
                  </Label>
                  <div className="flex-1">
                    <SearchableSelect
                      ref={inputRefs.current.nhKh2Ref}
                      value={formData.nh_kh2}
                      onChange={(value) => handleInputChange('nh_kh2', value)}
                      options={getFilteredOptions('nh_kh2')}
                      placeholder="Chọn nhóm khách hàng 2"
                      searchPlaceholder="Tìm kiếm nhóm khách hàng..."
                      loading={loadingGroups}
                      onSearch={setSearchTerm}
                      displayKey="ten_nh"
                      valueKey="ma_nh"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={12}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                    Nhóm khách 3
                  </Label>
                  <div className="flex-1">
                    <SearchableSelect
                      ref={inputRefs.current.nhKh3Ref}
                      value={formData.nh_kh3}
                      onChange={(value) => handleInputChange('nh_kh3', value)}
                      options={getFilteredOptions('nh_kh3')}
                      placeholder="Chọn nhóm khách hàng 3"
                      searchPlaceholder="Tìm kiếm nhóm khách hàng..."
                      loading={loadingGroups}
                      onSearch={setSearchTerm}
                      displayKey="ten_nh"
                      valueKey="ma_nh"
                      className="w-full h-9 text-sm bg-white"
                      tabIndex={13}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 pb-4 lg:justify-end bg-blue-50">
            <Button size="sm" variant="outline" type="button" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={createCustomerMutation.isLoading}
            >
              {createCustomerMutation.isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};