const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "";
    const value = Array.isArray(amount) ? amount[0] : amount;
    return new Intl.NumberFormat("vi-VN").format(value);
};

const renderInvoiceTableGrouped = (data1, data2) => {
    // Nhóm data1 theo stt_rec
    const grouped = data1.reduce((acc, item) => {
        if (!acc[item.stt_rec]) acc[item.stt_rec] = [];
        acc[item.stt_rec].push(item);
        return acc;
    }, {});

    // Nhóm data2 theo stt_rec
    const detailsBySttRec = data2.reduce((acc, detail) => {
        if (!acc[detail.stt_rec]) acc[detail.stt_rec] = [];
        acc[detail.stt_rec].push(detail);
        return acc;
    }, {});

    let grandTienHang = 0;
    let grandTienThue = 0;
    let grandThanhToan = 0;

    const rows = Object.keys(grouped).map(stt_rec => {
        const record = grouped[stt_rec][0];
        const details = detailsBySttRec[stt_rec] || [];

        if (!details.length) return '';

        // Hàng đầu tiên: Thông tin chứng từ
        let groupRows = `
            <tr>
                <td style="border: 1px solid #000;border-bottom: none; padding: 4px; text-align: center; ">
                    ${formatDate(record.ngay_ct)}
                </td>
                <td style="border: 1px solid #000;border-bottom: none; padding: 4px; text-align: center;">
                    ${record.so_ct || ''}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                    ${(record.ten_kh || '')} ${(record.dien_giai || '')}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                </td>
                 <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                     ${record.ma_kho || ''}<br/>${record.ma_nx || ''}
                </td>
                 <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                </td>
                 <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                </td>
                 <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                </td>
                 <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                </td>

            </tr>
        `;

        // Chi tiết vật tư
        groupRows += details.map(d => `
            <tr>
                <td style="border: 1px solid #000;border-top: none;"></td>
                <td style="border: 1px solid #000;border-top: none;"></td>
                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                    ${d.ma_vt || ''} - ${d.ten_vt || ''}
                </td>
                 <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                    ${d.ma_bp || ''}<br/>${d.dvt || ''}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                  
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                    ${formatCurrency(d.so_luong)}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                    ${formatCurrency(d.gia)}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                    ${formatCurrency(d.tien)}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                    ${formatCurrency(d.gia2)}
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                    ${formatCurrency(d.tien2)}
                </td>
            </tr>
        `).join('');

        // Tính tổng nhóm
        const tongTienHang = details.reduce((sum, d) => sum + (parseFloat(d.tien2?.toString().replace(/,/g, '')) || 0), 0);
        const tongTienThue = details.reduce((sum, d) => sum + (parseFloat(d.thue?.toString().replace(/,/g, '')) || 0), 0);
        const tongThanhToan = tongTienHang + tongTienThue;

        grandTienHang += tongTienHang;
        grandTienThue += tongTienThue;
        grandThanhToan += tongThanhToan;

        // Hàng cộng theo nhóm
        groupRows += `
            <tr>
                <td colspan="9" style="border: 1px solid #000; padding: 4px; text-align: right;">Tiền hàng:</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatCurrency(tongTienHang)}</td>
            </tr>
            <tr>
                <td colspan="9" style="border: 1px solid #000; padding: 4px; text-align: right;">Tiền thuế:</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">${formatCurrency(tongTienThue)}</td>
            </tr>
            <tr>
                <td colspan="9" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">Tổng tiền thanh toán:</td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">${formatCurrency(tongThanhToan)}</td>
            </tr>
        `;

        return groupRows;
    }).join('');
    const grandTong = `
<div style="margin-top: 30px; text-align: right; font-weight: bold; font-size: 12px;">
    <div>TỔNG TIỀN HÀNG : ${formatCurrency(grandTienHang)}</div>
    <div>TỔNG TIỀN THUẾ : ${formatCurrency(grandTienThue)}</div>
    <div>TỔNG TIỀN THANH TOÁN : ${formatCurrency(grandThanhToan)}</div>
</div>
`;

    return { rows, grandTong };
};

export const printBcDonBanHang = {
    invoiceSummary: (data1, data2, filterInfo) => {
        const { rows, grandTong } = renderInvoiceTableGrouped(data1, data2);
        return `
            <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
                <div style="text-align: center; margin-bottom: 20px;">
                 <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>
                </div>
                    <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; text-transform: uppercase;">
                        BẢNG KÊ HOÁ ĐƠN BÁN HÀNG
                    </h2>
                    <div style="font-size: 12px; margin-bottom: 20px;">
                        TỪ NGÀY: ${formatDate(filterInfo?.StartDate) || ''} ĐẾN NGÀY: ${formatDate(filterInfo?.EndDate) || ''}
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
                    <thead>
                        <tr>
                            <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">CHỨNG TỪ</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">DIỄN GIẢI</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">MÃ BP / DVT</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">MÃ KHO / MÃ NX</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">SỐ LƯỢNG</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">GIÁ VỐN</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">TIỀN VỐN</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">GIÁ BÁN</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">TIỀN HÀNG</th>
                        </tr>
                        <tr>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">NGÀY</th>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center;">SỐ</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${rows}
                    </tbody>
                </table>
                  ${grandTong}
                   <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
                Ngày......tháng.....năm........
            </div>
            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">NGƯỜI LẬP BIỂU</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">KẾ TOÁN TRƯỞNG</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                </div>
            </div>
        </div>
            </div>
        `;
    }
};
