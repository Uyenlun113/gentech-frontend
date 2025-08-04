import { forwardRef } from "react";
import toWords from 'vn-num2words';

const formatDateVN = (dateInput) => {
    const date = new Date(dateInput)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}`
}

const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const PrintContent = forwardRef(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[297mm] h-[210mm] p-4 text-sm text-black bg-white"
            style={{ fontFamily: "Times New Roman, serif" }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="text-xs">
                    <div className="text-xs leading-tight">Công ty công nghệ Gentech</div>
                    <div className="text-xs leading-tight">Tầng 02, chung cư CT3 Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội</div>
                </div>
                <div className="text-xs text-right">
                    <div>SỐ DƯ ĐẦU KỲ: {data?.so_du_dau_ky?.toLocaleString("vi-VN") || "0"}</div>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
                <h1 className="font-bold text-xl mb-2">SỔ CHI TIẾT CỦA MỘT TÀI KHOẢN</h1>
                <div className="text-sm space-y-1">
                    <div>TÀI KHOẢN: {data?.tai_khoan || "1111 - TIỀN MẶT VND"}</div>
                    <div>TỪ NGÀY: {data?.tu_ngay || "01-07-2025"} ĐẾN NGÀY: {data?.den_ngay || "31-08-2025"}</div>
                </div>
            </div>

            {/* Main Table */}
            <div className="mb-4">
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1" colSpan="2">
                                CHỨNG TỪ
                            </th>
                            <th className="border border-black p-1" rowSpan="2">
                                KHÁCH HÀNG
                            </th>
                            <th className="border border-black p-1" rowSpan="2">
                                DIỄN GIẢI
                            </th>
                            <th className="border border-black p-1 w-16" rowSpan="2">
                                TK Đ.ỨNG
                            </th>
                            <th className="border border-black p-1" colSpan="2">
                                SỐ PHÁT SINH
                            </th>
                        </tr>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-16">NGÀY</th>
                            <th className="border border-black p-1 w-16">SỐ</th>
                            <th className="border border-black p-1 w-20">NỢ</th>
                            <th className="border border-black p-1 w-20">CÓ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.transactions?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-1 text-center text-[10px]">{formatDateVN(item?.ngay_ct)}</td>
                                <td className="border border-black p-1 text-[10px]">{item?.so_ct}</td>
                                <td className="border border-black p-1 text-[10px]">{item?.khach_hang}</td>
                                <td className="border border-black p-1 text-[10px]">{item?.dien_giai}</td>
                                <td className="border border-black p-1 text-center text-[10px]">{item?.tk_doi_ung}</td>
                                <td className="border border-black p-1 text-right text-[10px]">
                                    {item?.no ? item.no.toLocaleString("vi-VN") : ""}
                                </td>
                                <td className="border border-black p-1 text-right text-[10px]">
                                    {item?.co ? item.co.toLocaleString("vi-VN") : ""}
                                </td>
                            </tr>
                        ))}

                        {/* Empty rows to fill the page */}
                        {Array.from({ length: Math.max(0, 20 - (data?.transactions?.length || 0)) }, (_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end mb-4">
                    <div className="text-xs space-y-1">
                        <div className="flex justify-between gap-8">
                            <span className="font-bold">TỔNG PHÁT SINH NỢ:</span>
                            <span className="font-bold">{data?.tong_phat_sinh_no?.toLocaleString("vi-VN") || "2.517.705.085"}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="font-bold">TỔNG PHÁT SINH CÓ:</span>
                            <span className="font-bold">{data?.tong_phat_sinh_co?.toLocaleString("vi-VN") || "35.608.709"}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                            <span className="font-bold">SỐ DƯ NỢ CUỐI KỲ:</span>
                            <span className="font-bold">{data?.so_du_no_cuoi_ky?.toLocaleString("vi-VN") || "2.482.096.376"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature section */}
            <div className="grid grid-cols-2 grid-rows-3 text-center text-xs gap-x-4 gap-y-1 min-h-[120px]">
                {/* Hàng 1 - Ngày tháng */}
                <div></div> {/* Cột 1 trống */}
                <div className="text-xs">Ngày ... tháng ... năm .....</div> {/* Cột 4 */}

                {/* Hàng 2 - Tiêu đề chính */}
                <div className="font-bold">NGƯỜI LẬP PHIẾU</div>
                <div className="font-bold">KẾ TOÁN TRƯỞNG</div>

                {/* Hàng 3 - Ghi chú ký tên */}
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Ký, họ tên)</div>
            </div>

            {/* Page number */}
            <div className="text-xs text-left mt-4">
                Trang: {data?.current_page || "1"}, {data?.ngay_in || "04-08-2025"}
            </div>
        </div >
    )
})

export default PrintContent;