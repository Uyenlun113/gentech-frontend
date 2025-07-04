import { useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useCreateMaterialGroup } from "../../../hooks/useMaterialGroup";

export const ModalCreateMaterialGroup = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
  const [formData, setFormData] = useState({
    loai_nh: "",
    ma_nh: "",
    ten_nh: "",
  });

  const createMaterialGroupMutation = useCreateMaterialGroup();
  const [errors, setErrors] = useState({
    loai_nh: "",
    ma_nh: "",
    ten_nh: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    setErrors({ loai_nh: "", ma_nh: "", ten_nh: "" });

    if (!formData.loai_nh.trim()) {
      setErrors((prev) => ({ ...prev, tk: "Vui lòng nhập loại nhóm" }));
      hasError = true;
    }

    if (!formData.ma_nh.trim()) {
      setErrors((prev) => ({ ...prev, ma_nh: "Vui lòng nhập mẫu nhóm vật tư" }));
      hasError = true;
    }

    if (!formData.ten_nh.trim()) {
      setErrors((prev) => ({ ...prev, ten_nh: "Vui lòng nhập tên nhóm vật tư" }));
      hasError = true;
    }
    if (hasError) return;

    try {
      await createMaterialGroupMutation.mutateAsync({
        ...formData,
        tk_me: formData.tk_me || undefined,
        ma_nh: formData.ma_nh || undefined,
        ten_nh: formData.ten_nh || undefined,
      });

      // Reset form
      setFormData({
        loai_nh: "",
        ma_nh: "",
        ten_nh: "",
      });
      setErrors({ loai_nh: "", ma_nh: "", ten_nh: "" });
      onSaveCreate();
    } catch (error) {
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("tk")) {
          setErrors((prev) => ({ ...prev, tk: "Mã tài khoản đã tồn tại" }));
        }
      }
    }
  };

  const handleClose = () => {
    setFormData({
      loai_nh: "",
      ma_nh: "",
      ten_nh: "",
    });
    setErrors({ loai_nh: "", ma_nh: "", ten_nh: "" });
    closeModalCreate();
  };

  return (
    <Modal isOpen={isOpenCreate} onClose={handleClose} className="max-w-[700px] max-h-[90vh] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Thêm mới nhóm vật tư hàng hoá
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Nhập thông tin nhóm vật tư hàng hoá mới vào hệ thống.
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Loại nhóm *</Label>
                  <Input
                    type="text"
                    value={formData.loai_nh}
                    onChange={(e) => {
                      handleInputChange("loai_nh", e.target.value);
                      if (errors.loai_nh) {
                        setErrors((prev) => ({ ...prev, loai_nh: "" }));
                      }
                    }}
                    placeholder="Nhập loại nhóm"
                    maxLength={16}
                    required
                  />
                  {errors.loai_nh && <p className="mt-1 text-sm text-red-500">{errors.loai_nh}</p>}
                </div>

                <div>
                  <Label>Mã nhóm đầu tư *</Label>
                  <Input
                    type="text"
                    value={formData.ma_nh}
                    onChange={(e) => {
                      handleInputChange("ma_nh", e.target.value);
                      if (errors.ma_nh) {
                        setErrors((prev) => ({ ...prev, ma_nh: "" }));
                      }
                    }}
                    placeholder="Nhập mã nhóm đầu tư"
                    required
                  />
                  {errors.ma_nh && <p className="mt-1 text-sm text-red-500">{errors.ma_nh}</p>}
                </div>

                <div className="col-span-2">
                  <Label>Tên nhóm vật tư</Label>
                  <Input
                    type="text"
                    value={formData.ten_nh}
                    onChange={(e) => handleInputChange("ten_nh", e.target.value)}
                    placeholder="Nhập tên nhóm vật tư"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" type="button" onClick={handleClose}>
              Hủy
            </Button>
            <Button size="sm" type="submit" disabled={createMaterialGroupMutation.isLoading}>
              {createMaterialGroupMutation.isLoading ? "Đang lưu..." : "Lưu lại"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
