const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0";
    const value = Array.isArray(amount) ? amount[0] : amount;
    return new Intl.NumberFormat("vi-VN").format(value);
};

export const printBcDonBanHang = {
    invoiceSummary: (data1, data2, filterInfo, totals) => {
        // Group data2 by so_ct for easier lookup
        const data2BySoCt = {};
        data2.forEach(detail => {
            if (!data2BySoCt[detail.so_ct]) {
                data2BySoCt[detail.so_ct] = [];
            }
            data2BySoCt[detail.so_ct].push(detail);
        });

        // Generate rows
        let allRows = '';

        data1.forEach(record => {
            const matchingRecords = data2BySoCt[record.so_ct] || [];
            if (!matchingRecords.length) return;

            // Generate detail rows for this invoice
            matchingRecords.forEach((detail, idx) => {
                allRows += `
                    <tr>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">
                            ${idx === 0 ? formatDate(record.ngay_ct) : ''}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">
                            ${idx === 0 ? record.so_ct : ''}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">
                            ${idx === 0 ? (record.ma_dt || '') : ''}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:left;">
                            ${detail.ma_kh || ''}<br/>${detail.dien_giai || ''}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">
                            ${detail.ma_vt || ''}<br/>${detail.ten_vt || ''}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">
                            ${detail.ma_bp || ''}<br/>${detail.dvt || ''}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:center;">
                            ${detail.ma_kho || ''}<br/>${detail.ma_nx || ''}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:right;">
                            ${formatCurrency(detail.so_luong)}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:right;">
                            ${formatCurrency(detail.gia_von)}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:right;">
                            ${formatCurrency(detail.tien_von)}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:right;">
                            ${formatCurrency(detail.gia_ban)}
                        </td>
                        <td style="border:1px solid #000; padding:4px; text-align:right;">
                            ${formatCurrency(detail.tien_hang)}
                        </td>
                    </tr>
                `;
            });

            // Calculate totals for this invoice
            const tongTienHang = matchingRecords.reduce((sum, d) => sum + (d.tien_hang || 0), 0);
            const tongTienThue = matchingRecords.reduce((sum, d) => sum + (d.tien_thue || 0), 0);
            const tongThanhToan = tongTienHang + tongTienThue;

            // Add summary rows for this invoice
            allRows += `
                <tr style="background:#f5f5f5;">
                    <td colspan="11" style="border:1px solid #000; text-align:right; font-weight:bold; padding:4px;">Tiền hàng:</td>
                    <td style="border:1px solid #000; text-align:right; font-weight:bold; padding:4px;">${formatCurrency(tongTienHang)}</td>
                </tr>
                <tr style="background:#f5f5f5;">
                    <td colspan="11" style="border:1px solid #000; text-align:right; padding:4px;">Tiền thuế:</td>
                    <td style="border:1px solid #000; text-align:right; padding:4px;">${formatCurrency(tongTienThue)}</td>
                </tr>
                <tr style="background:#f5f5f5;">
                    <td colspan="11" style="border:1px solid #000; text-align:right; font-weight:bold; padding:4px;">Tổng tiền thanh toán:</td>
                    <td style="border:1px solid #000; text-align:right; font-weight:bold; padding:4px;">${formatCurrency(tongThanhToan)}</td>
                </tr>
            `;
        });

        return `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
            <!-- Header -->
            <div style="text-align: left; margin-bottom: 5px; font-size: 11px;">
                PHẦN MỀM CHƯA ĐĂNG KÝ BẢN QUYỀN<br/>
                LIÊN HỆ VỚI FAST ĐỂ BIẾT THÊM CHI TIẾT
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; text-transform: uppercase;">
                    BẢNG KÊ HOÁ ĐƠN BÁN HÀNG
                </h2>
                <div style="font-size: 12px; margin-bottom: 20px;">
                    TỪ NGÀY: ${formatDate(filterInfo?.ngay_ct1) || "01-08-2025"} ĐẾN NGÀY: ${formatDate(filterInfo?.ngay_ct2) || "31-08-2025"}
                </div>
            </div>

            <!-- Main Table -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
                <thead>
                    <tr>
                        <th colspan="3" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            CHỨNG TỪ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 150px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            DIỄN GIẢI
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 120px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            MÃ VT<br/>TÊN VT
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            MÃ BP<br/>DVT
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            MÃ KHO<br/>MÃ NX
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            SỐ LƯỢNG
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            GIÁ VỐN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            TIỀN VỐN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            GIÁ BÁN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            TIỀN HÀNG
                        </th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 70px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            NGÀY
                        </th>
                        <th style="border: 1px solid #000; padding: 6px; width: 70px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            SỐ
                        </th>
                        <th style="border: 1px solid #000; padding: 6px; width: 70px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                            MÃ ĐT
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${allRows}
                </tbody>
            </table>

            <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;"></div>
                <div style="text-align: right; font-size: 12px;">
                    <table style="border-collapse: collapse; margin-left: auto;">
                        <tr>
                            <td style="padding: 4px 20px 4px 0; text-align: right; font-weight: bold;">TỔNG TIỀN HÀNG:</td>
                            <td style="padding: 4px 0; text-align: right; font-weight: bold;">${formatCurrency(totals?.tong_tien_hang || 4830)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 20px 4px 0; text-align: right; font-weight: bold;">TỔNG TIỀN THUẾ:</td>
                            <td style="padding: 4px 0; text-align: right; font-weight: bold;">${formatCurrency(totals?.tong_tien_thue || 466)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 4px 20px 4px 0; text-align: right; font-weight: bold;">TỔNG TIỀN THANH TOÁN:</td>
                            <td style="padding: 4px 0; text-align: right; font-weight: bold;">${formatCurrency(totals?.tong_tien_thanh_toan || 5296)}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- Date and Signature Section -->
            <div style="margin-top: 40px;">
                <div style="text-align: center; margin-bottom: 20px; font-size: 11px;">
                    Ngày ..... tháng ..... năm .........
                </div>
                
                <div style="display: flex; justify-content: space-around; font-size: 11px; text-align: center;">
                    <div style="width: 200px;">
                        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP BIỂU</div>
                        <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                    </div>
                    <div style="width: 200px;">
                        <div style="font-weight: bold; margin-bottom: 5px;">KẾ TOÁN TRƯỞNG</div>
                        <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: left; margin-top: 20px; font-size: 10px;">
                Trang: 1, ${new Date().toLocaleDateString("vi-VN")}
            </div>
        </div>
        `;
    }
};