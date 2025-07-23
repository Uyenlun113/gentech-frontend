// components/CdvtModal.jsx
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../components/ui/button/Button";

import { useCreateCdvt, useUpdateCdvt } from "../../hooks/useCdvt";

import { useDmkho } from "../../hooks/useDmkho";
import { useDmvt } from "../../hooks/useDmvt";
import SearchableSelect from "../category/account/SearchableSelect";

const CdvtModal = ({ isOpen, onClose, editData, ma_kho, nam }) => {
    const [formData, setFormData] = useState({
        ma_vt: "",
        ten_vt: "",
        ton00: 0,
        du00: 0,
        du_nt00: 0,
    });

    const [searchVattu, setSearchVattu] = useState("");
    const [searchKho] = useState("");

    const createMutation = useCreateCdvt();
    const updateMutation = useUpdateCdvt();

    // Hooks để lấy dữ liệu
    const { data: khoList, isLoading: isLoadingKho } = useDmkho(searchKho);
    const { data: vattu, isLoading: isLoadingVattu } = useDmvt(searchVattu);
    const vattuList = vattu?.data || [];

    const isEditing = !!editData;
    const isLoading = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setFormData({
                    ma_vt: editData.ma_vt || "",
                    ten_vt: editData.ten_vt || "",
                    ton00: editData.ton00 || 0,
                    du00: editData.du00 || 0,
                    du_nt00: editData.du_nt00 || 0,
                });
            } else {
                setFormData({
                    ma_vt: "",
                    ten_vt: "",
                    ton00: 0,
                    du00: 0,
                    du_nt00: 0,
                });
            }
        }
    }, [isOpen, editData]);

    // Khi chọn vật tư từ dropdown, tự động fill tên vật tư
    const handleVattuChange = (selectedMaVt) => {
        const selectedVattu = vattuList?.find(vt => vt.ma_vt === selectedMaVt);
        setFormData(prev => ({
            ...prev,
            ma_vt: selectedMaVt,
            ten_vt: selectedVattu?.ten_vt || ""
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('ton') || name.includes('du') ? Number(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.ma_vt.trim()) {
            toast.error("Vui lòng chọn mã vật tư");
            return;
        }

        const submitData = {
            ma_vt: formData.ma_vt,
            ton00: formData.ton00,
            du00: formData.du00,
            du_nt00: formData.du_nt00,
            ma_kho,
            nam: parseInt(nam)
        };

        try {
            if (isEditing) {
                await updateMutation.mutateAsync(submitData);
                toast.success("Cập nhật vật tư thành công!");
            } else {
                await createMutation.mutateAsync(submitData);
                toast.success("Thêm vật tư thành công!");
            }
            onClose();
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error(
                isEditing
                    ? "Lỗi khi cập nhật: " + (error?.message || "Không xác định")
                    : "Lỗi khi thêm mới: " + (error?.message || "Không xác định")
            );
        }
    };

    // Lấy tên kho từ danh sách
    const selectedKho = khoList?.data.find(kho => kho.ma_kho === ma_kho);
    const tenKho = selectedKho?.ten_kho || ma_kho;

    // Format options cho SearchableSelect
    const vattuOptions = vattuList?.map(vt => ({
        value: vt.ma_vt,
        displayValue: vt.ten_vt || vt.ma_vt,
        ma_vt: vt.ma_vt,
        ten_vt: vt.ten_vt
    })) || [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <div className="relative bg-blue-50 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] max-w-[40vw] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {isEditing ? "Cập nhật số dư vật tư ban đầu" : "Thêm số dư vật tư ban đầu"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Mã kho & Năm (read-only) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kho
                            </label>
                            <div className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 flex items-center">
                                {ma_kho} - {tenKho}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Năm
                            </label>
                            <div className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 flex items-center">
                                {nam}
                            </div>
                        </div>
                    </div>

                    {/* Mã vật tư - SearchableSelect (có thể sửa cả khi editing) */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-40">
                            Vật tư <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-1">
                            <SearchableSelect
                                value={formData.ma_vt}
                                onChange={handleVattuChange}
                                options={vattuOptions}
                                placeholder="Chọn vật tư"
                                searchPlaceholder="Tìm kiếm mã vật tư, tên vật tư..."
                                loading={isLoadingVattu}
                                onSearch={setSearchVattu}
                                displayKey="displayValue"
                                valueKey="value"
                                className={isLoading ? "opacity-50 cursor-not-allowed " : ""}
                            />
                        </div>
                    </div>

                    {/* Tên vật tư - nằm ngang cùng label */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 w-40">
                            Tên vật tư
                        </label>
                        <input
                            type="text"
                            name="ten_vt"
                            value={formData.ten_vt}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                            placeholder="Tên vật tư"
                            readOnly
                        />
                    </div>


                    {/* Số liệu */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Tồn đầu */}
                        <div className="space-y-4">
                            {/* Tồn đầu */}
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="ton00"
                                    className="text-sm font-medium text-gray-700 w-40"
                                >
                                    Tồn đầu
                                </label>
                                <input
                                    id="ton00"
                                    type="number"
                                    name="ton00"
                                    value={formData.ton00}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                />
                            </div>

                            {/* Dư đầu (VNĐ) */}
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="du00"
                                    className="text-sm font-medium text-gray-700 w-40"
                                >
                                    Dư đầu (VNĐ)
                                </label>
                                <input
                                    id="du00"
                                    type="number"
                                    name="du00"
                                    value={formData.du00}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                />
                            </div>

                            {/* Dư đầu ngoại tệ */}
                            <div className="flex items-center gap-4">
                                <label
                                    htmlFor="du_nt00"
                                    className="text-sm font-medium text-gray-700 w-40"
                                >
                                    Dư đầu ngoại tệ
                                </label>
                                <input
                                    id="du_nt00"
                                    type="number"
                                    name="du_nt00"
                                    value={formData.du_nt00}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="0"
                                    step="1"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading || !formData.ma_vt}
                        >
                            {isLoading ? "Đang xử lý..." : (isEditing ? "Cập nhật" : "Thêm mới")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CdvtModal;