import { Calculator, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccounts } from '../hooks/useAccounts';
import { useDmkho } from '../hooks/useDmkho';
import { useDmvt } from '../hooks/useDmvt';
import { useMaterialGroups } from '../hooks/useMaterialGroup';
import SearchableSelect from '../pages/category/account/SearchableSelect';
import Label from './form/Label';
import Input from './form/input/InputField';

// Custom hook for debounced value
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function PricingModal({
    showModal,
    onClose,
    onSubmit,
    pricingData,
    onInputChange
}) {
    // Search states
    const [accountSearchTerm, setAccountSearchTerm] = useState("");
    const [materialGroupSearchTerm, setMaterialGroupSearchTerm] = useState("");
    const [maKhoSearch, setMaKhoSearch] = useState("");
    const [debouncedVtSearch, setDebouncedVtSearch] = useState("");

    // Debounced search terms
    const debouncedAccountSearch = useDebounce(accountSearchTerm, 300);
    const debouncedMaterialGroupSearch = useDebounce(materialGroupSearchTerm, 300);
    const debouncedKhoSearch = useDebounce(maKhoSearch, 300);
    const debouncedVatTuSearch = useDebounce(debouncedVtSearch, 300);

    // Set current month and year when modal opens
    useEffect(() => {
        if (showModal) {
            const now = new Date();
            const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so add 1
            const currentYear = now.getFullYear();

            // Only set if values are empty or default
            if (!pricingData.ky || pricingData.ky === '') {
                onInputChange('ky', currentMonth.toString());
            }
            if (!pricingData.nam || pricingData.nam === '') {
                onInputChange('nam', currentYear.toString());
            }
        }
    }, [showModal, pricingData.ky, pricingData.nam, onInputChange]);

    // API calls with debounced values
    const { data: accountsData, isLoading: isLoadingAccounts } = useAccounts({
        search: debouncedAccountSearch,
        limit: 100,
    });

    const materialGroupParams = useMemo(() => ({
        search: debouncedMaterialGroupSearch || undefined,
        limit: 100,
    }), [debouncedMaterialGroupSearch]);

    const { data: materialGroupsData, isLoading: isLoadingMaterialGroups } = useMaterialGroups(materialGroupParams);

    const { data: dmkhoData = [] } = useDmkho(debouncedKhoSearch ? { search: debouncedKhoSearch } : {});

    const { data: vatTuData = [] } = useDmvt(
        { search: debouncedVatTuSearch || "" },
        { enabled: !!debouncedVatTuSearch && debouncedVatTuSearch.length > 0 }
    );

    // Options mapping
    const accountOptions = accountsData?.data?.map(account => ({
        value: account.tk0,
        displayKey: account.ten_tk,
        valueKey: account.tk0,
    })) || [];

    const materialGroupOptions = materialGroupsData?.data?.map(group => ({
        value: group.ma_nh,
        displayKey: group.ten_nh,
        valueKey: group.ma_nh,
    })) || [];

    const khoOptions = dmkhoData?.data?.map(kho => ({
        value: kho.ma_kho,
        displayKey: kho.ten_kho,
        valueKey: kho.ma_kho,
    })) || [];

    const vatTuOptions = vatTuData?.data?.map(vt => ({
        value: vt.ma_vt,
        displayKey: vt.ten_vt,
        valueKey: vt.ma_vt,
    })) || [];

    // Event handlers
    const handleAccountSearch = useCallback((searchTerm) => {
        setAccountSearchTerm(searchTerm);
    }, []);

    const handleMaterialGroupSearch = useCallback((searchTerm) => {
        setMaterialGroupSearchTerm(searchTerm);
    }, []);

    const handleKhoSearch = useCallback((searchTerm) => {
        setMaKhoSearch(searchTerm);
    }, []);

    const handleVatTuSearch = useCallback((searchTerm) => {
        setDebouncedVtSearch(searchTerm);
    }, []);

    const handleInputChange = (field, value) => {
        onInputChange(field, value);
    };

    const handleAccountSelect = (field, value) => {
        onInputChange(field, value);
    };

    // Filter material groups to avoid duplicates
    const getFilteredMaterialGroupOptions = useCallback((currentField) => {
        return materialGroupOptions.filter(option => {
            const selectedValues = [
                pricingData.nhomVatTu1,
                pricingData.nhomVatTu2,
                pricingData.nhomVatTu3
            ];

            // Remove current field's value from comparison
            const otherSelectedValues = selectedValues.filter((_, index) => {
                const fields = ['nhomVatTu1', 'nhomVatTu2', 'nhomVatTu3'];
                return fields[index] !== currentField;
            });

            return !otherSelectedValues.includes(option.value);
        });
    }, [materialGroupOptions, pricingData.nhomVatTu1, pricingData.nhomVatTu2, pricingData.nhomVatTu3]);

    if (!showModal) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-[950px] max-h-[85vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-100 to-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calculator className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Tính giá trung bình tháng</h2>
                            <p className="text-sm text-gray-600">Cấu hình tham số tính giá</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-70 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSubmit}>
                    <div className="overflow-auto max-h-[calc(85vh-140px)] bg-blue-50">
                        <div className="space-y-1">
                            {/* Thông tin cơ bản */}
                            <div className="rounded-lg p-4">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Kỳ</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="12"
                                            className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                            value={pricingData.ky || ''}
                                            onChange={(e) => onInputChange('ky', e.target.value)}
                                            placeholder="Tháng (1-12)"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Năm</Label>
                                        <Input
                                            type="number"
                                            min="1900"
                                            max="2100"
                                            className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                            value={pricingData.nam || ''}
                                            onChange={(e) => onInputChange('nam', e.target.value)}
                                            placeholder="Năm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Mã kho</Label>
                                        <SearchableSelect
                                            value={pricingData.maKho || ''}
                                            onChange={(value) => handleAccountSelect('maKho', value)}
                                            options={khoOptions}
                                            searchPlaceholder="Tìm kiếm mã kho..."
                                            loading={false}
                                            onSearch={handleKhoSearch}
                                            displayKey="displayKey"
                                            valueKey="valueKey"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Mã vật tư</Label>
                                        <SearchableSelect
                                            value={pricingData.maVatTu || ''}
                                            onChange={(value) => handleAccountSelect('maVatTu', value)}
                                            options={vatTuOptions}
                                            searchPlaceholder="Tìm kiếm mã vật tư..."
                                            loading={false}
                                            onSearch={handleVatTuSearch}
                                            displayKey="displayKey"
                                            valueKey="valueKey"
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg p-4 pt-0">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Tài khoản vật tư</Label>
                                        <SearchableSelect
                                            value={pricingData.taiKhoanVatTu || ''}
                                            onChange={(value) => handleAccountSelect('taiKhoanVatTu', value)}
                                            options={accountOptions}
                                            searchPlaceholder="Tìm kiếm tài khoản..."
                                            loading={isLoadingAccounts}
                                            onSearch={handleAccountSearch}
                                            displayKey="displayKey"
                                            valueKey="valueKey"
                                            className="h-8 text-sm"
                                        />
                                    </div>

                                    {/* 3 nhóm vật tư trên cùng 1 hàng */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Nhóm vật tư 1</Label>
                                            <SearchableSelect
                                                value={pricingData.nhomVatTu1 || ''}
                                                onChange={(value) => handleInputChange('nhomVatTu1', value)}
                                                options={getFilteredMaterialGroupOptions('nhomVatTu1')}
                                                placeholder="Chọn nhóm vật tư 1"
                                                searchPlaceholder="Tìm kiếm nhóm vật tư..."
                                                loading={isLoadingMaterialGroups}
                                                onSearch={handleMaterialGroupSearch}
                                                displayKey="displayKey"
                                                valueKey="valueKey"
                                                className="h-8 text-sm flex-1 bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Nhóm vật tư 2</Label>
                                            <SearchableSelect
                                                value={pricingData.nhomVatTu2 || ''}
                                                onChange={(value) => handleInputChange('nhomVatTu2', value)}
                                                options={getFilteredMaterialGroupOptions('nhomVatTu2')}
                                                placeholder="Chọn nhóm vật tư 2"
                                                searchPlaceholder="Tìm kiếm nhóm vật tư..."
                                                loading={isLoadingMaterialGroups}
                                                onSearch={handleMaterialGroupSearch}
                                                displayKey="displayKey"
                                                valueKey="valueKey"
                                                className="h-8 text-sm flex-1 bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-sm font-medium text-gray-700">Nhóm vật tư 3</Label>
                                            <SearchableSelect
                                                value={pricingData.nhomVatTu3 || ''}
                                                onChange={(value) => handleInputChange('nhomVatTu3', value)}
                                                options={getFilteredMaterialGroupOptions('nhomVatTu3')}
                                                placeholder="Chọn nhóm vật tư 3"
                                                searchPlaceholder="Tìm kiếm nhóm vật tư..."
                                                loading={isLoadingMaterialGroups}
                                                onSearch={handleMaterialGroupSearch}
                                                displayKey="displayKey"
                                                valueKey="valueKey"
                                                className="h-8 text-sm flex-1 bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rest of the component remains the same */}
                            <div className="rounded-lg p-4 pt-0">
                                <div className="space-y-6">
                                    {/* Tạo px chênh lệch */}
                                    <div className="flex gap-6">
                                        <Label className="text-sm font-medium text-gray-700">Tạo phiếu xuất chênh lệch giá trị tồn kho</Label>
                                        <div className="flex items-start gap-4">
                                            <select
                                                className="h-9 w-16 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                                value={pricingData.taoPxChenhLech || '0'}
                                                onChange={(e) => onInputChange('taoPxChenhLech', e.target.value)}
                                            >
                                                <option value="0">0</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                                                    <div>0. Không tạo px chênh lệch giá trị tồn kho</div>
                                                    <div>1. Tạo px chênh lệch cho các trường hợp số lượng = 0, tiền khác 0</div>
                                                    <div>2. Tạo px chênh lệch cho trường hợp ps chênh lệch có phiếu xuất</div>
                                                    <div>3. Tạo px chênh lệch cho tất cả các trường hợp có ps chênh lệch</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cập nhật giá trung bình */}
                                    <div className="flex gap-6">
                                        <Label className="text-sm font-medium text-gray-700">Cập nhật giá trung bình</Label>
                                        <div className="flex items-start gap-4">
                                            <select
                                                className="h-9 w-16 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                                value={pricingData.capNhatGiaTrungBinh || '0'}
                                                onChange={(e) => onInputChange('capNhatGiaTrungBinh', e.target.value)}
                                            >
                                                <option value="0">0</option>
                                                <option value="1">1</option>
                                            </select>
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                                                    <div>0. Không cập nhật</div>
                                                    <div>1. Tính giá trung bình rồi cập nhật vào thẻ kho và sổ cái</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Xử lý khi hoạch toán */}
                                    <div className="flex gap-6">
                                        <Label className="text-sm font-medium text-gray-700">Xử lý khi hoạch toán chênh lệch giá tồn kho</Label>
                                        <div className="flex items-start gap-4">
                                            <select
                                                className="h-9 w-16 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                                value={pricingData.xuLyKhiHoachToan || '0'}
                                                onChange={(e) => onInputChange('xuLyKhiHoachToan', e.target.value)}
                                            >
                                                <option value="0">0</option>
                                                <option value="1">1</option>
                                            </select>
                                            <div className="flex-1">
                                                <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                                                    <div>0. Không nhóm khi lưu vào sổ cái</div>
                                                    <div>1. Nhóm khi lưu vào sổ cái</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin bổ sung */}
                            <div className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Ngày bắt đầu áp giá xuất tức thời</Label>
                                        <Input
                                            type="text"
                                            className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                            placeholder="dd/mm/yyyy"
                                            value={pricingData.ngayBatDau || ''}
                                            onChange={(e) => onInputChange('ngayBatDau', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Mã ĐVCS</Label>
                                        <Input
                                            type="text"
                                            className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                            value={pricingData.maDVCS || ''}
                                            onChange={(e) => onInputChange('maDVCS', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="p-1 bg-gray-200 rounded text-xs font-mono">F5</div>
                            <span>Tra cứu</span>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Nhận
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}