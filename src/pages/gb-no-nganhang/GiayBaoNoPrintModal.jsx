import { useEffect, useState } from 'react';
import { useCustomer } from '../../hooks/useCustomer';

const GiayBaoNoPrintModal = ({ isOpen, onClose, selectedGiayBaoNo, onPrint }) => {
    const [formData, setFormData] = useState({
        // Settings
        tiengViet: 'vi',
        donVi: 'VND',
        mauSo: 'LBP245/246/248',
        dienGiaiCuuGoc: '',
        soCuuGocKemTheo: '0',
        soLien: '1',

        // Bank info
        tenNganHang: '',
        taiKhoan: '',
        tenDonViNhanTien: '',
        diaChi: '',
        soTaiKhoan: '',
        taiNganHang: '',
        diaChiNH: '',
        tinhThanh: '',
        noiDungThanhToan: '',
        mucDichThanhToan: '',
        hinhThucThanhToan: '',
        tinhPhiTrongNuoc: '',
        tinhPhiNgoaiNuoc: '',

        // Additional info
        seqNo: '',
        ngay: new Date().toISOString().split('T')[0],
        soTienBangSo: '',
        soTienBangChu: '',
        deNghiNhQuyDoi: '',
        tyGia: '',
        phiNgoai: false,
        phiTrong: true,
        noiDung: ''
    });

    const { data } = useCustomer(selectedGiayBaoNo?.ma_kh);
    const userData = data?.data || {};

    // useEffect để reset form khi đóng modal
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                tiengViet: 'vi',
                donVi: 'VND',
                mauSo: 'LBP245/246/248',
                dienGiaiCuuGoc: '',
                soCuuGocKemTheo: '0',
                soLien: '1',

                // Bank info
                tenNganHang: '',
                taiKhoan: '',
                tenDonViNhanTien: '',
                diaChi: '',
                soTaiKhoan: '',
                taiNganHang: '',
                diaChiNH: '',
                tinhThanh: '',
                noiDungThanhToan: '',
                mucDichThanhToan: '1',
                hinhThucThanhToan: '1',
                tinhPhiTrongNuoc: '1',
                tinhPhiNgoaiNuoc: '1',

                // Additional info
                seqNo: '',
                ngay: new Date().toISOString().split('T')[0],
                soTienBangSo: '',
                soTienBangChu: '',
                deNghiNhQuyDoi: '',
                tyGia: '',
                phiNgoai: false,
                phiTrong: true,
                noiDung: ''
            });
        }
    }, [isOpen]);

    // useEffect riêng để fill data khi có userData
    useEffect(() => {
        if (selectedGiayBaoNo && isOpen && userData && Object.keys(userData).length > 0) {
            setFormData(prev => ({
                ...prev,
                tenDonViNhanTien: userData.ten_kh || 'fdsgsdg',
                diaChi: userData?.dia_chi || 'hanoi',
                soTaiKhoan: userData?.tk_nh,
                taiNganHang: userData?.ten_nh,
                noiDungThanhToan: selectedGiayBaoNo?.dien_giai || 'hihi',
                soTienBangSo: selectedGiayBaoNo?.tong_tien || '10.000',
            }));
        }
    }, [selectedGiayBaoNo, isOpen, userData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePrint = () => {
        onPrint(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-blue-100 text-black p-4">
                    <h2 className="text-lg font-semibold">Thông tin in Giấy báo nợ</h2>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 bg-blue-50">
                    {/* Top Settings Row */}
                    <div className="flex gap-6 mb-4">
                        <div>
                            <select
                                value={formData.tiengViet}
                                onChange={(e) => handleInputChange('tiengViet', e.target.value)}
                                className="w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="vi">Tiếng Việt</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={formData.donVi}
                                onChange={(e) => handleInputChange('donVi', e.target.value)}
                                className="w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="VND">VND</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <div >
                            <select
                                value={formData.mauSo}
                                onChange={(e) => handleInputChange('mauSo', e.target.value)}
                                className="w-[440px] border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="LBP245/246/248">LBP245/246/248</option>
                            </select>
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="mb-6 items-center">
                        <div className="flex gap-4 items-center">
                            <label className="text-sm text-gray-700">Diễn giải chứng từ gốc :</label>
                            <input
                                type="text"
                                value={formData.dienGiaiCuuGoc}
                                onChange={(e) => handleInputChange('dienGiaiCuuGoc', e.target.value)}
                                className="w-[450px] h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex gap-8 items-center mt-2">
                            <label className="text-sm text-gray-700">Số c.từ gốc kèm theo:</label>
                            <input
                                type="text"
                                value={formData.soCuuGocKemTheo}
                                onChange={(e) => handleInputChange('soCuuGocKemTheo', e.target.value)}
                                className="w-[350px] h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                        <div className="flex gap-8 items-center mt-2">
                            <label className="text-sm text-gray-700">Số liên</label>
                            <input
                                type="text"
                                value={formData.soLien}
                                onChange={(e) => handleInputChange('soLien', e.target.value)}
                                className="w-[250px] h-9 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* Main Form Table */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <tbody className="bg-gray-50">
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100 w-48">
                                        Tên ngân hàng
                                    </td>
                                    <td className="border-b border-gray-300 px-3 ">
                                        <input
                                            type="text"
                                            value={formData.tenNganHang}
                                            onChange={(e) => handleInputChange('tenNganHang', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3  text-sm font-medium bg-gray-100">
                                        Tài khoản
                                    </td>
                                    <td className="border-b border-gray-300 px-3 ">
                                        <input
                                            type="text"
                                            value={formData.taiKhoan}
                                            onChange={(e) => handleInputChange('taiKhoan', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Tên đơn vị nhận tiền
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <input
                                            type="text"
                                            value={formData.tenDonViNhanTien}
                                            onChange={(e) => handleInputChange('tenDonViNhanTien', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3  text-sm font-medium bg-gray-100">
                                        Địa chỉ
                                    </td>
                                    <td className="border-b border-gray-300 px-3 ">
                                        <input
                                            type="text"
                                            value={formData.diaChi}
                                            onChange={(e) => handleInputChange('diaChi', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Số tài khoản
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <input
                                            type="text"
                                            value={formData.soTaiKhoan}
                                            onChange={(e) => handleInputChange('soTaiKhoan', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Tại ngân hàng
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <input
                                            type="text"
                                            value={formData.taiNganHang}
                                            onChange={(e) => handleInputChange('taiNganHang', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Địa chỉ
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <input
                                            type="text"
                                            value={formData.diaChiNH}
                                            onChange={(e) => handleInputChange('diaChiNH', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Tỉnh thành
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <input
                                            type="text"
                                            value={formData.tinhThanh}
                                            onChange={(e) => handleInputChange('tinhThanh', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Nội dung thanh toán
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <input
                                            type="text"
                                            value={formData.noiDungThanhToan}
                                            onChange={(e) => handleInputChange('noiDungThanhToan', e.target.value)}
                                            className="w-full border-0 bg-transparent text-sm focus:outline-none"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Mục đích thanh toán
                                    </td>
                                    <td className="border-b border-gray-300 px-3 ">
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={formData.mucDichThanhToan}
                                                onChange={(e) => handleInputChange('mucDichThanhToan', e.target.value)}
                                                className="border-0 bg-transparent text-sm focus:outline-none"
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                            <span className="text-sm text-gray-600">1 - Ứng trước thanh toán, 2 - Thực hiện thanh toán</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Hình thức thanh toán
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={formData.hinhThucThanhToan}
                                                onChange={(e) => handleInputChange('hinhThucThanhToan', e.target.value)}
                                                className="border-0 bg-transparent text-sm focus:outline-none"
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </select>
                                            <span className="text-sm text-gray-600">1 - Thú, 2 - Điện, 3 - Telex, Swift, 4 - Sec</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-3 text-sm font-medium bg-gray-100">
                                        Tính phí trong nước vào
                                    </td>
                                    <td className="border-b border-gray-300 px-3">
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={formData.tinhPhiTrongNuoc}
                                                onChange={(e) => handleInputChange('tinhPhiTrongNuoc', e.target.value)}
                                                className="border-0 bg-transparent text-sm focus:outline-none"
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                            <span className="text-sm text-gray-600">1 - Chúng tôi, 2 - Người thụ hưởng</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-sm font-medium bg-gray-100">
                                        Tính phí ngoại nước vào
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={formData.tinhPhiNgoaiNuoc}
                                                onChange={(e) => handleInputChange('tinhPhiNgoaiNuoc', e.target.value)}
                                                className="border-0 bg-transparent text-sm focus:outline-none"
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                            </select>
                                            <span className="text-sm text-gray-600">1 - Chúng tôi, 2 - Người thụ hưởng</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-blue-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
                    <button
                        onClick={handlePrint}
                        className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        In
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        Quay ra
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GiayBaoNoPrintModal;