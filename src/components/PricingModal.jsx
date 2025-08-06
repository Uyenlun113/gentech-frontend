import { Calculator, X } from 'lucide-react';
import Label from './form/Label';
import Input from './form/input/InputField';

export default function PricingModal({
    showModal,
    onClose,
    onSubmit,
    pricingData,
    onInputChange
}) {
    if (!showModal) return null;

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
                <div className="overflow-auto max-h-[calc(85vh-140px)] bg-blue-50">
                    <div className="space-y-1">
                        {/* Thông tin cơ bản */}
                        <div className="rounded-lg p-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-gray-700">Kỳ</Label>
                                    <Input
                                        type="text"
                                        className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                                        value={pricingData.ky}
                                        onChange={(e) => onInputChange('ky', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-gray-700">Năm</Label>
                                    <Input
                                        type="text"
                                        className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                        value={pricingData.nam}
                                        onChange={(e) => onInputChange('nam', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-gray-700">Mã kho</Label>
                                    <Input
                                        type="text"
                                        className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                        value={pricingData.maKho}
                                        onChange={(e) => onInputChange('maKho', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-gray-700">Mã vật tư</Label>
                                    <Input
                                        type="text"
                                        className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                        value={pricingData.maVatTu}
                                        onChange={(e) => onInputChange('maVatTu', e.target.value)}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className=" rounded-lg p-4 pt-0">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-gray-700">Tài khoản vật tư</Label>
                                    <Input
                                        type="text"
                                        className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                        value={pricingData.taiKhoanVatTu}
                                        onChange={(e) => onInputChange('taiKhoanVatTu', e.target.value)}
                                    />
                                </div>

                                {/* 3 nhóm vật tư trên cùng 1 hàng */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Nhóm vật tư 1</Label>
                                        <Input
                                            type="text"
                                            className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                            value={pricingData.nhomVatTu1}
                                            onChange={(e) => onInputChange('nhomVatTu1', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Nhóm vật tư 2</Label>
                                        <Input
                                            type="text"
                                            className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                            value={pricingData.nhomVatTu2}
                                            onChange={(e) => onInputChange('nhomVatTu2', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-sm font-medium text-gray-700">Nhóm vật tư 3</Label>
                                        <Input
                                            type="text"
                                            className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                            value={pricingData.nhomVatTu3}
                                            onChange={(e) => onInputChange('nhomVatTu3', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cấu hình tính giá */}
                        <div className=" rounded-lg p-4 pt-0">
                            <div className="space-y-6">
                                {/* Tạo px chênh lệch */}
                                <div className="flex gap-6">
                                    <Label className="text-sm font-medium text-gray-700">Tạo phiếu xuất chênh lệch giá trị tồn kho</Label>
                                    <div className="flex items-start gap-4">
                                        <select
                                            className="h-9 w-16 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                            value={pricingData.taoPxChenhLech}
                                            onChange={(e) => onInputChange('taoPxChenhLech', e.target.value)}
                                        >
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                                                <div>1. Không tạo px chênh lệch giá trị tồn kho</div>
                                                <div>2. Tạo px chênh lệch cho các trường hợp số lượng = 0, tiền khác 0</div>
                                                <div>3. Tạo px chênh lệch cho trường hợp ps chênh lệch có phiếu xuất</div>
                                                <div>4. Tạo px chênh lệch cho tất cả các trường hợp có ps chênh lệch</div>
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
                                            value={pricingData.capNhatGiaTrungBinh}
                                            onChange={(e) => onInputChange('capNhatGiaTrungBinh', e.target.value)}
                                        >
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                        </select>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                                                <div>1. Tính giá trung bình rồi cập nhật vào thẻ kho</div>
                                                <div>2. Tính giá trung bình rồi cập nhật vào thẻ kho và sổ cái</div>
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
                                            value={pricingData.xuLyKhiHoachToan}
                                            onChange={(e) => onInputChange('xuLyKhiHoachToan', e.target.value)}
                                        >
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                        </select>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
                                                <div>1. Không nhóm khi lưu vào sổ cái</div>
                                                <div>2. Nhóm khi lưu vào sổ cái</div>
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
                                        className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                        placeholder="dd/mm/yyyy"
                                        value={pricingData.ngayBatDau}
                                        onChange={(e) => onInputChange('ngayBatDau', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-gray-700">Mã ĐVCS</Label>
                                    <Input
                                        type="text"
                                        className="h-9 border-gray-300 focus:border-blue-500 focus:ring-blue-500  bg-white"
                                        value={pricingData.maDVCS}
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
                            onClick={onSubmit}
                            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                            Nhận
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}