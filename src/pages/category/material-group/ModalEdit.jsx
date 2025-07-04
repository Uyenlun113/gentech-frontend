import { useEffect, useState } from "react";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useUpdateMaterialGroup } from "../../../hooks/useMaterialGroup";

export const ModalEditMaterialGroup = ({ isOpenEdit, closeModalEdit, onSaveEdit, selectedMaterialGroup }) => {
  const [formData, setFormData] = useState({
    loai_nh: "",
    ma_nh: "",
    ten_nh: "",
  });

  const updateMaterialGroupMutation = useUpdateMaterialGroup();
  const [errors, setErrors] = useState({
    loai_nh: "",
    ma_nh: "",
    ten_nh: "",
  });

  useEffect(() => {
    if (selectedMaterialGroup) {
      setFormData({
        loai_nh: selectedMaterialGroup.loai_nh?.toString() || "",
        ma_nh: selectedMaterialGroup.ma_nh || "",
        ten_nh: selectedMaterialGroup.ten_nh?.trim() || "",
      });
    }
  }, [selectedMaterialGroup]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLoaiNhChange = (e) => {
    const value = e.target.value;
    if (value === "" || value === "1" || value === "2" || value === "3") {
      handleInputChange("loai_nh", value);
      if (errors.loai_nh) {
        setErrors((prev) => ({ ...prev, loai_nh: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMaterialGroup) return;

    let hasError = false;
    setErrors({ loai_nh: "", ma_nh: "", ten_nh: "" });
    if (!formData.loai_nh.trim()) {
      setErrors((prev) => ({ ...prev, loai_nh: "Vui lòng nhập loại nhóm" }));
      hasError = true;
    } else if (!["1", "2", "3"].includes(formData.loai_nh)) {
      setErrors((prev) => ({ ...prev, loai_nh: "Loại nhóm chỉ được nhập 1, 2, hoặc 3" }));
      hasError = true;
    }

    if (!formData.ma_nh.trim()) {
      setErrors((prev) => ({ ...prev, ma_nh: "Vui lòng nhập mã nhóm vật tư" }));
      hasError = true;
    }

    if (!formData.ten_nh.trim()) {
      setErrors((prev) => ({ ...prev, ten_nh: "Vui lòng nhập tên nhóm vật tư" }));
      hasError = true;
    }

    if (hasError) return;

    try {
      await updateMaterialGroupMutation.mutateAsync({
        ma_nh: selectedMaterialGroup.ma_nh, loai_nh: selectedMaterialGroup.loai_nh,
        data: {
          loai_nh: parseInt(formData.loai_nh),
          ma_nh: formData.ma_nh.trim(),
          ten_nh: formData.ten_nh.trim(),
        },
      });

      onSaveEdit();
    } catch (error) {
      console.error("Error updating material group:", error);
      if (error.response?.data?.message) {
        const errorMessages = Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message];

        errorMessages.forEach(msg => {
          if (msg.includes("loai_nh")) {
            setErrors((prev) => ({ ...prev, loai_nh: "Loại nhóm không hợp lệ" }));
          }
          if (msg.includes("ma_nh")) {
            setErrors((prev) => ({ ...prev, ma_nh: "Mã nhóm đã tồn tại hoặc không hợp lệ" }));
          }
        });
      }
    }
  };

  const handleClose = () => {
    setErrors({ loai_nh: "", ma_nh: "", ten_nh: "" });
    closeModalEdit();
  };

  return (
    <Modal isOpen={isOpenEdit} onClose={handleClose} className="max-w-[700px] max-h-[90vh] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Chỉnh sửa nhóm vật tư hàng hoá
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Cập nhật thông tin nhóm vật tư hàng hoá.
          </p>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Loại nhóm * (1, 2, hoặc 3)</Label>
                  <Input
                    type="text"
                    value={formData.loai_nh}
                    onChange={handleLoaiNhChange}
                    placeholder="1, 2, hoặc 3"
                    maxLength={1}
                    required
                    style={{
                      textAlign: "center",
                      fontSize: "16px",
                      fontWeight: "bold"
                    }}
                  />
                  {errors.loai_nh && <p className="mt-1 text-sm text-red-500">{errors.loai_nh}</p>}
                  <p className="mt-1 text-xs text-gray-500">Chỉ được nhập: 1, 2, hoặc 3</p>
                </div>

                <div>
                  <Label>Mã nhóm vật tư *</Label>
                  <Input
                    type="text"
                    value={formData.ma_nh}
                    onChange={(e) => {
                      handleInputChange("ma_nh", e.target.value);
                      if (errors.ma_nh) {
                        setErrors((prev) => ({ ...prev, ma_nh: "" }));
                      }
                    }}
                    placeholder="Nhập mã nhóm vật tư"
                    required
                  />
                  {errors.ma_nh && <p className="mt-1 text-sm text-red-500">{errors.ma_nh}</p>}
                </div>

                <div className="col-span-2">
                  <Label>Tên nhóm vật tư *</Label>
                  <Input
                    type="text"
                    value={formData.ten_nh}
                    onChange={(e) => {
                      handleInputChange("ten_nh", e.target.value);
                      if (errors.ten_nh) {
                        setErrors((prev) => ({ ...prev, ten_nh: "" }));
                      }
                    }}
                    placeholder="Nhập tên nhóm vật tư"
                    required
                  />
                  {errors.ten_nh && <p className="mt-1 text-sm text-red-500">{errors.ten_nh}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" type="button" onClick={handleClose}>
              Hủy
            </Button>
            <Button size="sm" type="submit" disabled={updateMaterialGroupMutation.isLoading}>
              {updateMaterialGroupMutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};