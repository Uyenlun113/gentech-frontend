import { useState } from "react";
import Label from "../../../components/form/Label";

import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import { useAccounts } from "../../../hooks/useAccounts";
import { useCreateDmkho } from "../../../hooks/useDmkho";
import SearchableSelect from "../account/SearchableSelect";


export const ModalCreateWarehouse = ({ isOpenCreate, closeModalCreate, onSaveCreate }) => {
    const [formData, setFormData] = useState({
        ma_kho: "",
        ten_kho: "",
        ma_dvcs: "CTY",
        tk_dl: "",
        status: "1", // 0 - Không sử dụng, 1 - Sử dụng
    });

    const [isAgent, setIsAgent] = useState(false);
    const [searchAccount, setSearchAccount] = useState("");

    const createWarehouseMutation = useCreateDmkho();
    const { data: accountsData, isLoading: accountsLoading } = useAccounts({
        search: searchAccount,
        limit: 50
    });

    const [errors, setErrors] = useState({
        ma_kho: "",
        ten_kho: "",
        ma_dvcs: "",
        tk_dl: "",
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleAgentToggle = (checked) => {
        setIsAgent(checked);
        if (!checked) {
            setFormData(prev => ({ ...prev, tk_dl: "" }));
        }
    };

    const handleAccountSearch = (searchTerm) => {
        setSearchAccount(searchTerm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;
        setErrors({ ma_kho: "", ten_kho: "", ma_dvcs: "", tk_dl: "" });

        if (!formData.ma_kho.trim()) {
            setErrors((prev) => ({ ...prev, ma_kho: "Vui lòng nhập mã kho" }));
            hasError = true;
        }

        if (!formData.ten_kho.trim()) {
            setErrors((prev) => ({ ...prev, ten_kho: "Vui lòng nhập tên kho" }));
            hasError = true;
        }

        if (isAgent && !formData.tk_dl.trim()) {
            setErrors((prev) => ({ ...prev, tk_dl: "Vui lòng chọn tài khoản đại lý" }));
            hasError = true;
        }

        if (hasError) return;
        console.log(formData);
        console.log("typeof ma_kho:", typeof formData.ma_kho);
        try {
            await createWarehouseMutation.mutateAsync({
                ma_kho: formData.ma_kho.trim(),
                ten_kho: formData.ten_kho.trim(),
                ma_dvcs: formData.ma_dvcs.trim(),
                tk_dl: isAgent ? formData.tk_dl.trim() : "",
                status: formData.status,
            });

            setFormData({
                ma_kho: "",
                ten_kho: "",
                ma_dvcs: "",
                tk_dl: "",
                status: "0",
            });
            setIsAgent(false);
            setErrors({ ma_kho: "", ten_kho: "", ma_dvcs: "", tk_dl: "" });
            onSaveCreate();
        } catch (error) {
            console.error("Error creating warehouse:", error);
            if (error.response?.data?.message) {
                const errorMessages = Array.isArray(error.response.data.message)
                    ? error.response.data.message
                    : [error.response.data.message];

                errorMessages.forEach(msg => {
                    if (msg.includes("ma_kho")) {
                        setErrors((prev) => ({ ...prev, ma_kho: "Mã kho đã tồn tại hoặc không hợp lệ" }));
                    }
                });
            }
        }
    };

    const handleClose = () => {
        setFormData({
            ma_kho: "",
            ten_kho: "",
            ma_dvcs: "",
            tk_dl: "",
            status: "0",
        });
        setIsAgent(false);
        setErrors({ ma_kho: "", ten_kho: "", ma_dvcs: "", tk_dl: "" });
        closeModalCreate();
    };

    return (
        <Modal isOpen={isOpenCreate} onClose={handleClose} className="max-w-[700px] max-h-[90vh] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Thêm kho hàng
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        Nhập thông tin kho hàng mới vào hệ thống.
                    </p>
                </div>

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
                        <div className="space-y-5">
                            {/* Tab Navigation */}
                            <div className="border-b border-gray-200 dark:border-gray-700">
                                <nav className="-mb-px flex space-x-8">
                                    <button
                                        type="button"
                                        className="border-b-2 border-brand-500 py-2 px-1 text-sm font-medium text-brand-600"
                                    >
                                        1. Thông tin chính
                                    </button>
                                </nav>
                            </div>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                <div>
                                    <Label>Mã kho *</Label>
                                    <Input
                                        type="text"
                                        value={formData.ma_kho}
                                        onChange={(e) => handleInputChange("ma_kho", e.target.value)}
                                        placeholder="Nhập mã kho"
                                        required
                                    />
                                    {errors.ma_kho && <p className="mt-1 text-sm text-red-500">{errors.ma_kho}</p>}
                                </div>

                                <div>
                                    <Label>Tên kho *</Label>
                                    <Input
                                        type="text"
                                        value={formData.ten_kho}
                                        onChange={(e) => handleInputChange("ten_kho", e.target.value)}
                                        placeholder="Nhập tên kho"
                                        required
                                    />
                                    {errors.ten_kho && <p className="mt-1 text-sm text-red-500">{errors.ten_kho}</p>}
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="agent-checkbox"
                                        checked={isAgent}
                                        onChange={(e) => handleAgentToggle(e.target.checked)}
                                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                                    />
                                    <Label htmlFor="agent-checkbox">Kho đại lý</Label>
                                </div>

                                <div className="col-span-2">
                                    <Label>Tài khoản hàng tồn tại đại lý {isAgent && "*"}</Label>
                                    <div className={`${!isAgent ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <SearchableSelect
                                            value={formData.tk_dl}
                                            onChange={(value) => handleInputChange("tk_dl", value)}
                                            options={accountsData?.data || []}
                                            placeholder="Chọn tài khoản"
                                            searchPlaceholder="Tìm kiếm tài khoản..."
                                            loading={accountsLoading}
                                            onSearch={handleAccountSearch}
                                            displayKey="ten_tk"
                                            valueKey="tk"
                                            disabled={!isAgent}
                                        />
                                    </div>
                                    {errors.tk_dl && <p className="mt-1 text-sm text-red-500">{errors.tk_dl}</p>}
                                </div>

                                <div>
                                    <Label>Trạng thái</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="1"
                                                checked={formData.status === "1"}
                                                onChange={(e) => handleInputChange("status", e.target.value)}
                                                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">1 - Sử dụng</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="0"
                                                checked={formData.status === "0"}
                                                onChange={(e) => handleInputChange("status", e.target.value)}
                                                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">0 - Không sử dụng</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                        <Button size="sm" variant="outline" type="button" onClick={handleClose}>
                            Hủy
                        </Button>
                        <Button size="sm" type="submit" disabled={createWarehouseMutation.isLoading}>
                            {createWarehouseMutation.isLoading ? "Đang lưu..." : "Nhận"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};