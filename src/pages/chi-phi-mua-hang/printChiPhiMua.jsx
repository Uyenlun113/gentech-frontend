import { forwardRef } from "react";
import toWords from 'vn-num2words';

const formatDateVN = (dateInput) => {
    const date = new Date(dateInput)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day} THÁNG ${month} NĂM ${year}`
}

const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const PrintContent = forwardRef(({ data }, ref) => {
    const currentData = data
    return (
        <div
            ref={ref}
            className="w-[210mm] h-[297mm] p-6 text-sm text-black bg-white"
            style={{ fontFamily: "Times New Roman, serif" }}
        >
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="font-bold text-lg mb-2">PHIẾU NHẬP CHI PHÍ MUA HÀNG</h1>
                <div className="text-sm mb-4">NGÀY {formatDateVN(currentData.ngay_ct || new Date())}</div>
                <div className="text-right text-sm">Số: {currentData.stt_rec}</div>
            </div>

            {/* Thông tin chung */}
            <div className="mb-4 space-y-1 text-sm">
                <div className="flex">
                    <span className="w-32">Người giao hàng:</span>
                    <span>{currentData.ong_ba}</span>
                </div>
                <div className="flex">
                    <span className="w-32">Đơn vị:</span>
                    <span>{currentData.don_vi || "107 - CN Tổng công ty Bưu điện Việt Nam-Bưu điện TP Hà Nội"}</span>
                </div>
                <div className="flex">
                    <span className="w-32">Địa chỉ:</span>
                    <span>{currentData.dia_chi}</span>
                </div>
                <div className="flex space-x-8">
                    <div className="flex">
                        <span className="w-20">Số hóa đơn:</span>
                        <span>{currentData.ma_qs}</span>
                    </div>
                    <div className="flex">
                        <span className="w-12">Serial:</span>
                        <span>{currentData.so_ct}</span>
                    </div>
                    <div className="flex">
                        <span className="w-12">Ngày:</span>
                        <span>{currentData.ngay_ct}</span>
                    </div>
                </div>
                <div className="flex">
                    <span className="w-32">Nội dung:</span>
                    <span>{currentData.dien_giai}</span>
                </div>
                <div className="flex">
                    <span className="w-32">Tài khoản có:</span>
                    <span>{currentData.tk_thue_no}</span>
                </div>
            </div>

            {/* Bảng chi tiết */}
            <div className="mb-4">
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-green-100">
                            <th className="border border-black p-2 w-12">STT</th>
                            <th className="border border-black p-2 w-20">MÃ KHO</th>
                            <th className="border border-black p-2 w-20">MÃ VẬT TƯ</th>
                            <th className="border border-black p-2">TÊN VẬT TƯ</th>
                            <th className="border border-black p-2 w-16">TK</th>
                            <th className="border border-black p-2 w-16">ĐVT</th>
                            <th className="border border-black p-2 w-24">TIỀN CHI PHÍ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.ct73?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-2 text-center">{index + 1}</td>
                                <td className="border border-black p-2">{item.ma_kho_i}</td>
                                <td className="border border-black p-2">{item.ma_vt}</td>
                                <td className="border border-black p-2">{item.ten_vt}</td>
                                <td className="border border-black p-2 text-center">{item.tk_vt}</td>
                                <td className="border border-black p-2 text-center">{item.dvt}</td>
                                <td className="border border-black p-2 text-right">{item.cp_nt}</td>
                            </tr>
                        ))}

                        {/* Các dòng trống */}
                        {Array.from({ length: Math.max(0, 10 - (currentData.ct73?.length || 0)) }, (_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-2 py-3"></td>
                                <td className="border border-black p-2 py-3"></td>
                                <td className="border border-black p-2 py-3"></td>
                                <td className="border border-black p-2 py-3"></td>
                                <td className="border border-black p-2 py-3"></td>
                                <td className="border border-black p-2 py-3"></td>
                                <td className="border border-black p-2 py-3"></td>
                            </tr>
                        ))}

                        {/* Dòng tổng cộng */}
                        <tr>
                            <td colSpan="6" className="border border-black p-2 text-right font-bold">
                                CỘNG TIỀN CHI PHÍ:
                            </td>
                            <td className="border border-black p-2 text-right font-bold">
                                {currentData.t_cp_nt}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6" className="border border-black p-2 text-right font-bold">
                                TIỀN THUẾ GTGT:
                            </td>
                            <td className="border border-black p-2 text-right font-bold">
                                {currentData.t_thue}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="6" className="border border-black p-2 text-right font-bold">
                                TỔNG TIỀN THANH TOÁN:
                            </td>
                            <td className="border border-black p-2 text-right font-bold">
                                {currentData.t_tt_nt}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ghi chú */}
            <div className="text-xs mb-4 text-right">
                <div>Số tiền (viết bằng chữ): {currentData.t_tt_nt ? capitalizeFirstLetter(toWords(parseInt(currentData.t_tt_nt))) + " đồng chẵn" : "Một triệu sáu trăm năm mươi nghìn đồng chẵn"}</div>
            </div>

            {/* Chữ ký */}
            <div className="grid grid-cols-3 text-center text-xs gap-8 min-h-[160px]">
                {/* Cột 1: Người giao hàng */}
                <div className="flex flex-col justify-center">
                    <div className="font-bold mb-1">NGƯỜI GIAO HÀNG</div>
                    <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                </div>

                {/* Cột 2: Người nhận hàng */}
                <div className="flex flex-col justify-center">
                    <div className="font-bold mb-1">NGƯỜI NHẬN HÀNG</div>
                    <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                </div>

                {/* Cột 3: Thủ kho */}
                <div className="flex flex-col justify-between h-full">
                    <div className="text-center text-xs">Ngày ..... tháng ..... năm .........</div>

                    <div className="text-center">
                        <div className="font-bold mb-1">THỦ KHO</div>
                        <div className="text-[10px] mb-8">(Ký, họ tên)</div>
                    </div>

                    <div className="text-center text-xs mt-2">Họ và tên thủ kho</div>
                </div>
            </div>
        </div>
    )
})

PrintContent.displayName = 'PrintContent';

export default PrintContent;