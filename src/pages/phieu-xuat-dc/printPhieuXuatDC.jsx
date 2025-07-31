
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
    return (
        <div
            ref={ref}
            className="w-[210mm] h-[297mm] p-4 text-sm text-black bg-white"
            style={{ fontFamily: "Times New Roman, serif" }}
        >
            {/* Header với thông tin phần mềm và mã số thuế */}
            <div className="flex justify-between items-start mb-2">
                <div className="text-xs text-center">
                    <div className="text-xs leading-tight">Công ty công nghệ Gentech</div>
                    <div className="text-xs leading-tight">Tầng 02, chung cư CT3 Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội</div>
                </div>
                <div className="text-xs text-center">
                    <div>Mã số thuế: {data?.ma_so_thue}</div>
                    <div>Mẫu số: 01-VT</div>
                    <div className="text-[10px]">
                        (Ban hành theo Thông tư số 133/2016/TT-BTC
                        <br />
                        ngày 26/8/2016 của Bộ Tài chính)
                    </div>
                </div>
            </div>

            {/* Tiêu đề và thông tin phiếu */}

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1"></div>
                <div className="text-center flex-1">
                    <h1 className="font-bold text-xl mb-2">PHIẾU XUẤT KHO</h1>
                    <div className="text-sm">NGÀY {formatDateVN(data?.ngay_ct || new Date())}</div>
                    <div className="text-sm">Số: {data?.so_ct || "PN0002"}</div>
                </div>
                <div className="flex-1 text-xs">
                    <div className="flex justify-center">
                        {/* Cột 1: Nhãn */}
                        <div className="text-right pr-2">
                            <div><strong>Nợ:</strong></div>
                            {data?.vatTu?.slice(1).map((_, index) => (
                                <div key={`n-label-${index}`}>&nbsp;</div>
                            ))}
                            <div className="mt-2"><strong>Có:</strong></div>
                            {data?.vatTu?.slice(1).map((_, index) => (
                                <div key={`c-label-${index}`}>&nbsp;</div>
                            ))}
                        </div>

                        {/* Cột 2: Dữ liệu */}
                        <div className="pl-2">
                            {data?.vatTu?.map((item, index) => (
                                <div key={`n-${index}`}>{item.tk_vt}</div>
                            ))}
                            <div className="mt-2" />
                            {data?.vatTu?.map((item, index) => (
                                <div key={`c-${index}`}>{item.ma_nx_i}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thông tin giao hàng */}
            <div className="mb-4 space-y-1 text-xs">
                <div className="flex">
                    <span className="font-medium">- Họ và tên người nhận: {data?.ong_ba}</span>
                    <span className="font-medium ml-6">địa chỉ(bộ phận):</span>
                </div>
                <div className="flex">
                    <span className="font-medium">- Theo: </span>
                    <span className="ml-20">số</span>
                    <span className="ml-8">ngày</span>
                    <span className="ml-8">tháng</span>
                    <span className="ml-8">năm</span>
                    <span className="ml-16">của</span>
                </div>
                <div className="flex">
                    <span className="font-medium">- Xuất tại kho: {data?.ma_kho || "KH01"}</span>
                    <span className="font-medium ml-4">địa điểm:</span>
                </div>
            </div>

            {/* Bảng chi tiết phiếu nhập kho */}
            <div className="mb-4">
                <table className="w-full border-collapse border border-black text-xs">
                    <thead>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-8" rowSpan="2">
                                STT
                            </th>
                            <th className="border border-black p-1" rowSpan="2">
                                TÊN, NHÃN HIỆU, QUY CÁCH, PHẨM CHẤT
                                <br />
                                VẬT TƯ, DỤNG CỤ, SẢN PHẨM HÀNG HÓA
                            </th>
                            <th className="border border-black p-1 w-16" rowSpan="2">
                                MÃ SỐ
                            </th>
                            <th className="border border-black p-1 w-12" rowSpan="2">
                                ĐVT
                            </th>
                            <th className="border border-black p-1" colSpan="2">
                                SỐ LƯỢNG
                            </th>
                            <th className="border border-black p-1 w-20" rowSpan="2">
                                ĐƠN GIÁ
                            </th>
                            <th className="border border-black p-1 w-24" rowSpan="2">
                                THÀNH TIỀN
                            </th>
                        </tr>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 w-16">YÊU CẦU</th>
                            <th className="border border-black p-1 w-16">THỰC XUẤT</th>
                        </tr>
                        <tr className="bg-green-50">
                            <th className="border border-black p-1 text-center">A</th>
                            <th className="border border-black p-1 text-center">B</th>
                            <th className="border border-black p-1 text-center">C</th>
                            <th className="border border-black p-1 text-center">D</th>
                            <th className="border border-black p-1 text-center">1</th>
                            <th className="border border-black p-1 text-center">2</th>
                            <th className="border border-black p-1 text-center">3</th>
                            <th className="border border-black p-1 text-center">4</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.vatTu?.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black p-1 text-center">{index + 1}</td>
                                <td className="border border-black p-1">{item?.vatTu?.ten_vt || "noname"}</td>
                                <td className="border border-black p-1">{item?.ma_vt}</td>
                                <td className="border border-black p-1 text-center">{item?.vatTu?.dvt || "nodvt"}</td>
                                <td className="border border-black p-1 text-right">
                                    {/* {item?.so_luong?.toLocaleString("vi-VN") || "10.000"} */}
                                </td>
                                <td className="border border-black p-1 text-right">
                                    {item?.so_luong?.toLocaleString("vi-VN") || "10.000"}
                                </td>
                                <td className="border border-black p-1 text-right">{item?.gia?.toLocaleString("vi-VN") || "20.00"}</td>
                                <td className="border border-black p-1 text-right">
                                    {item?.tien?.toLocaleString("vi-VN") || "1.434"}
                                </td>
                            </tr>
                        ))}

                        {/* Các dòng trống */}
                        {Array.from({ length: Math.max(0, 10 - (data?.vatTu?.length || 1)) }, (_, i) => (
                            <tr key={`empty-${i}`}>
                                <td className="border border-black p-1 py-3 text-center"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                                <td className="border border-black p-1 py-3"></td>
                            </tr>
                        ))}

                        {/* Dòng tổng cộng */}
                        <tr>
                            <td colSpan="7" className="border border-black p-1 text-center font-bold">
                                CỘNG:
                            </td>
                            <td className="border border-black p-1 text-right font-bold">
                                {data?.phieu?.t_tien_nt?.toLocaleString("vi-VN") || "1.434"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Ghi chú */}
            <div className="text-xs mb-4 space-y-1">
                <div>{data?.phieu?.t_tien_nt ? `- Số tiền (viết bằng chữ): ${capitalizeFirstLetter(toWords(data?.phieu?.t_tien_nt))} đồng` : ""}</div>
                <div>- Số chứng từ gốc kèm theo: 0</div>
            </div>

            <div className="grid grid-cols-5 grid-rows-6 text-center text-xs gap-x-4 gap-y-1 min-h-[120px]">
                {/* Hàng 1 - Ngày tháng */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 3 trống */}
                <div></div> {/* Cột 3 trống */}
                <div className="text-xs">Ngày ... tháng ... năm .....</div> {/* Cột 4 */}

                {/* Hàng 2 - Tiêu đề chính */}
                <div className="font-bold">NGƯỜI LẬP PHIẾU</div>
                <div className="font-bold">NGƯỜI NHẬN HÀNG</div>
                <div className="font-bold">THỦ KHO</div>
                <div className="font-bold">KẾ TOÁN TRƯỞNG</div>
                <div className="font-bold">GIÁM ĐỐC</div>

                {/* Hàng 3 - Ghi chú ký tên */}
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div className="text-[10px]">(Hoặc bộ phận có nhu cầu nhập)</div>
                <div className="text-[10px]">(Ký, họ tên)</div>

                {/* Hàng 4 - Ký tên KẾ TOÁN TRƯỞNG */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 3 trống */}
                <div className="text-[10px]">(Ký, họ tên)</div>
                <div></div> {/* Cột 3 trống */}

                {/* Hàng 5 - Thông tin bổ sung */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 2 trống */}
                <div></div> {/* Cột 4 trống */}
                <div></div> {/* Cột 5 trống */}

                {/* Hàng 5 - Thông tin bổ sung */}
                <div></div> {/* Cột 1 trống */}
                <div></div> {/* Cột 2 trống */}
                <div className="text-xs">Họ và tên thủ kho</div>
                <div></div> {/* Cột 4 trống */}
                <div></div> {/* Cột 4 trống */}
            </div>
        </div>
    )
})
export default PrintContent;