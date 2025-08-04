import { forwardRef } from "react";
import toWords from 'vn-num2words';

const formatDateVN = (dateInput) => {
    const date = new Date(dateInput)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
}

const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const PrintContent = forwardRef(({ data }, ref) => {
    const totalPages = Math.ceil((data?.transactions?.length || 0) / 25); // 25 rows per page

    return (
        <div
            ref={ref}
            className="w-[297mm] h-[210mm] p-4 text-sm text-black bg-white"
            style={{ fontFamily: "Times New Roman, serif" }}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div className="text-xs">
                    <div className="text-xs leading-tight">Công ty công nghệ Gentech</div>
                    <div className="text-xs leading-tight">Tầng 02, chung cư CT3 Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội</div>
                </div>
                <div className="text-xs text-right">
                    <div>Mã số thuế: {data?.ma_so_thue || "0104929879"}</div>
                    <div>Mẫu số: {data?.mau_so || "S05 - DNN"}</div>
                    <div className="text-[10px]">
                        (Ban hành theo Thông tư số 133/2016/TT-BTC
                        <br />
                        ngày 26/8/2016 của Bộ Tài chính)
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="text-center mb-2">
                <h1 className="font-bold text-xl mb-1">SỔ TIỀN GỬI NGÂN HÀNG</h1>
                <div className="text-sm space-y-0.5">
                    <div>NƠI MỞ TÀI KHOẢN GIAO DỊCH:</div>
                    <div>SỐ HIỆU TÀI KHOẢN TẠI NƠI GỬI:</div>
                    <div>TÀI KHOẢN: {data?.tai_khoan || "1111 - TIỀN MẶT VND"}</div>
                    <div>TỪ NGÀY: {formatDateVN(data?.tu_ngay || "01-07-2025")} ĐẾN NGÀY: {formatDateVN(data?.den_ngay || "31-08-2025")}</div>
                </div>
            </div>

            {/* Summary Info */}
            <div className="flex justify-end mb-2">
                <div className="text-xs">
                    <div className="flex justify-between gap-8">
                        <span>SỐ DƯ ĐẦU KỲ:</span>
                        <span>{data?.so_du_dau_ky?.toLocaleString("vi-VN") || "0"}</span>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="mb-2">
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-16" rowSpan="2">
                                NGÀY, THÁNG GHI SỐ
                            </th>
                            <th className="border border-black p-1 w-16" rowSpan="2">
                                SỐ HIỆU
                            </th>
                            <th className="border border-black p-1 w-16" rowSpan="2">
                                NGÀY, THÁNG
                            </th>
                            <th className="border border-black p-1" rowSpan="2">
                                DIỄN GIẢI
                            </th>
                            <th className="border border-black p-1 w-12" rowSpan="2">
                                TK ĐỐI ỨNG
                            </th>
                            <th className="border border-black p-1" colSpan="3">
                                SỐ TIỀN
                            </th>
                            <th className="border border-black p-1 w-20" rowSpan="2">
                                GHI CHÚ
                            </th>
                        </tr>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-24">THU (GỜI VÀO)</th>
                            <th className="border border-black p-1 w-24">CHI (RÚT RA)</th>
                            <th className="border border-black p-1 w-24">CÒN LẠI</th>
                        </tr>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 text-center">A</th>
                            <th className="border border-black p-1 text-center">B</th>
                            <th className="border border-black p-1 text-center">C</th>
                            <th className="border border-black p-1 text-center">D</th>
                            <th className="border border-black p-1 text-center">E</th>
                            <th className="border border-black p-1 text-center">1</th>
                            <th className="border border-black p-1 text-center">2</th>
                            <th className="border border-black p-1 text-center">3</th>
                            <th className="border border-black p-1 text-center">F</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.transactions?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-1 text-center text-[10px]">{formatDateVN(item?.ngay_ct)}</td>
                                <td className="border border-black p-1 text-[10px]">{item?.so_ct}</td>
                                <td className="border border-black p-1 text-center text-[10px]">{formatDateVN(item?.ngay_ct)}</td>
                                <td className="border border-black p-1 text-[10px]">{item?.dien_giai}</td>
                                <td className="border border-black p-1 text-center text-[10px]">{item?.tk_doi_ung}</td>
                                <td className="border border-black p-1 text-right text-[10px]">
                                    {item?.thu ? item.thu.toLocaleString("vi-VN") : ""}
                                </td>
                                <td className="border border-black p-1 text-right text-[10px]">
                                    {item?.chi ? item.chi.toLocaleString("vi-VN") : ""}
                                </td>
                                <td className="border border-black p-1 text-right text-[10px]">
                                    {item?.con_lai?.toLocaleString("vi-VN")}
                                </td>
                                <td className="border border-black p-1 text-[10px]">{item?.ghi_chu || ""}</td>
                            </tr>
                        ))}

                        {/* Empty rows to fill the page */}
                        {Array.from({ length: Math.max(0, 15 - (data?.transactions?.length || 0)) }, (_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                                <td className="border border-black p-1 py-1"></td>
                            </tr>
                        ))}

                        {/* Summary row */}
                        <tr>
                            <td colSpan="4" className="border border-black p-1 text-center font-bold text-xs">
                                CỘNG CHUYỂN SANG TRANG SAU:
                            </td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1 text-right font-bold text-xs">
                                {data?.tong_thu?.toLocaleString("vi-VN") || "2.136.112.220"}
                            </td>
                            <td className="border border-black p-1 text-right font-bold text-xs">
                                {data?.tong_chi?.toLocaleString("vi-VN") || "30.000.000"}
                            </td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer with summary information */}
            <div className="text-xs mb-2 space-y-1">
                <div>Số nay có {data?.so_trang || "03"} trang, đánh số từ trang 01 đến trang {data?.so_trang || "03"}</div>
                <div>Ngày mở sổ: {formatDateVN(data?.ngay_mo_so || "01-07-2025")}</div>
                <div className="mt-2 flex justify-end">
                    <div className="space-y-1 text-right">
                        <div>TỔNG PHÁT SINH NỢ: {data?.tong_phat_sinh_no?.toLocaleString("vi-VN") || "2.517.705.085"}</div>
                        <div>TỔNG PHÁT SINH CÓ: {data?.tong_phat_sinh_co?.toLocaleString("vi-VN") || "35.608.709"}</div>
                        <div>SỐ DƯ NỢ CUỐI KỲ: {data?.so_du_no_cuoi_ky?.toLocaleString("vi-VN") || "2.482.096.376"}</div>
                    </div>
                </div>
            </div>

            {/* Signature section */}
            <div className="grid grid-cols-3 grid-rows-3 text-center text-xs gap-x-4 gap-y-1 min-h-[120px]">
                {/* Hàng 1 - Ngày tháng */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div className="text-xs">Ngày ... tháng ... năm .....</div> {/* Cột 4 */}

                {/* Hàng 2 - Tiêu đề chính */}
                <div className="font-bold">NGƯỜI LẬP PHIẾU</div>
                <div className="font-bold">KẾ TOÁN TRƯỞNG</div>
                <div className="font-bold">GIÁM ĐỐC</div>

                {/* Hàng 3 - Ghi chú ký tên */}
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Ký, họ tên,đóng dấu)</div>
            </div>

            {/* Page number */}
            <div className="text-xs text-left mt-2">
                Trang: {data?.current_page || "1"}, {formatDateVN(new Date())}
            </div>
        </div>
    )
})

export default PrintContent;