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
    },
    salesAndServiceInvoice: (data1, filterInfo, totals) => {
        const { tienHang, tienCK, tienThue, tongThanhToan } = totals;
        const fromDate = filterInfo?.StartDate || '01-08-2025';
        const toDate = filterInfo?.EndDate || '31-08-2025';
        const rows = data1.map(item => `
        <tr>
            <td style="text-align: center; padding: 4px; border: 1px solid #000;">
                ${formatDate(item.ngay_ct)}
            </td>
            <td style="text-align: center; padding: 4px; border: 1px solid #000;">
                ${item.so_ct?.trim() || ''}
            </td>
            <td style="padding: 4px; border: 1px solid #000;">
                ${item.dien_giai || ''}
            </td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">
                ${formatCurrency(item.tien)}
            </td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">
                ${formatCurrency(item.ck)}
            </td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">
                ${formatCurrency(item.thue)}
            </td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">
                ${formatCurrency(item.t_tt)}
            </td>
        </tr>
    `).join('');

        return `
        <div style="width: 100%; font-family: Arial, sans-serif; font-size: 12px;">
            <!-- Header -->
           <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>

            <!-- Title -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 16px; font-weight: bold;">
                    BẢNG KÊ HOÁ ĐƠN BÁN HÀNG VÀ DỊCH VỤ
                </h2>
                <div style="margin-top: 5px; font-size: 12px;">
                    TỪ NGÀY: ${fromDate} ĐẾN NGÀY: ${toDate}
                </div>
            </div>

            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
               <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 120px;">CHỨNG TỪ</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 200px;">DIỄN GIẢI</th>
                            <th rowspan="2" style="border: 1px solid #000; padding:6px; text-align: center; width: 100px;">TIỀN HÀNG</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN CK</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN THUẾ</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">TỔNG TIỀN TT</th>
                        </tr>
                        <tr>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 70px;">NGÀY</th>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 50px;">SỐ</th>
                        </tr>
                    </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>

            <!-- Summary -->
            <div style="text-align: right; margin-bottom: 30px;">
                <table style="margin-left: auto; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 20px 4px 0; font-weight: bold;">TỔNG TIỀN HÀNG:</td>
                        <td style="padding: 4px; text-align: right; font-weight: bold; min-width: 100px;">
                            ${formatCurrency(tienHang)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 20px 4px 0; font-weight: bold;">TỔNG TIỀN CHIẾT KHẤU:</td>
                        <td style="padding: 4px; text-align: right; font-weight: bold;">
                            ${formatCurrency(tienCK)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 20px 4px 0; font-weight: bold;">TỔNG TIỀN THUẾ:</td>
                        <td style="padding: 4px; text-align: right; font-weight: bold;">
                            ${formatCurrency(tienThue)}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 20px 4px 0; font-weight: bold;">TỔNG TIỀN THANH TOÁN:</td>
                        <td style="padding: 4px; text-align: right; font-weight: bold;">
                            ${formatCurrency(tongThanhToan)}
                        </td>
                    </tr>
                </table>
            </div>

           <div style="text-align: right; font-size: 11px; margin-top: 20px; margin-right: 30px;"> 
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
    `;
    },
    invoiceOfAnItem: (data2, filterInfo) => {
        const fromDate = filterInfo?.StartDate || '01-08-2025';
        const toDate = filterInfo?.EndDate || '31-08-2025';
        const rows = data2.map(item => `
            <tr>
                <td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatDate(item.ngay_ct)}</td>
                <td style="text-align: center; padding: 4px; border: 1px solid #000;">${item.so_ct?.trim() || ''}</td>
                <td style="padding: 4px; border: 1px solid #000;">${item.ma_kh || ''}</td>
                <td style="padding: 4px; border: 1px solid #000;">${item.ten_kh || ''}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.so_luong || 0)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.gia || 0)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.tien)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.ck)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.thue)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.pt)}</td>
            </tr>
            `).join('');

        // Dòng tổng
        const totalRow = `
                <tr style="font-weight: bold; background-color: #f0f0f0;">
                    <!-- Gộp 4 ô đầu với border -->
                    <td colspan="4" style="padding: 4px 0 4px 8px; text-align: right; border: 1px solid #000;">TỔNG CỘNG:</td>

                    <!-- Các ô còn lại mỗi ô có border riêng -->
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(data2.reduce((sum, i) => sum + (i.so_luong || 0), 0))}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(data2.reduce((sum, i) => sum + (i.tien || 0), 0))}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(data2.reduce((sum, i) => sum + (i.ck || 0), 0))}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(data2.reduce((sum, i) => sum + (i.thue || 0), 0))}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(data2.reduce((sum, i) => sum + (i.pt || 0), 0))}</td>
                </tr>
                `;
        return `
        <div style="width: 100%; font-family: Arial, sans-serif; font-size: 12px;">
            <!-- Header -->
           <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>

            <!-- Title -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 16px; font-weight: bold;">
                    BẢNG KÊ HOÁ ĐƠN CỦA MỘT MẶT HÀNG
                </h2>
                <div style="margin-top: 5px; font-size: 12px;">
                    TỪ NGÀY: ${fromDate} ĐẾN NGÀY: ${toDate}
                </div>
            </div>

            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
               <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 120px;">CHỨNG TỪ</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">MÃ KHÁCH</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">TÊN KHÁCH</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">SỐ LƯỢNG</th>
                            <th rowspan="2" style="border: 1px solid #000; padding:6px; text-align: center; width: 100px;">GIÁ BÁN</th>
                            <th rowspan="2" style="border: 1px solid #000; padding:6px; text-align: center; width: 100px;">TIỀN HÀNG</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN CK</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN THUẾ</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">TỔNG TIỀN TT</th>
                        </tr>
                        <tr>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 70px;">NGÀY</th>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 50px;">SỐ</th>
                        </tr>
                    </thead>
                <tbody>
                   ${rows}
                    ${totalRow}
                </tbody>
            </table>

           <div style="text-align: right; font-size: 11px; margin-top: 20px; margin-right: 30px;"> 
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
    `;
    },
    invoiceByCustomerGroup: (data2, filterInfo) => {
        const fromDate = filterInfo?.StartDate || '01-08-2025';
        const toDate = filterInfo?.EndDate || '31-08-2025';

        const rows = data2.map((item, index) => `
        <tr>
            <td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatDate(item.ngay_ct)}</td>
            <td style="text-align: center; padding: 4px; border: 1px solid #000;">${item.so_ct?.trim() || ''}</td>
            <td style="padding: 4px; border: 1px solid #000;">${item.dien_giai || ''}</td>
            ${index === 0
                ? `
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                  `
                : `
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.so_luong || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.gia || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.tien)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.ck)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.thue)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.pt)}</td>
                  `
            }
        </tr>
    `).join('');

        // Bỏ item đầu tiên khi tính tổng
        const dataForSum = data2.slice(1);

        const totalRow = `
     <tr style="font-weight: bold; background-color: #f0f0f0;">
        <td colspan="3" style="padding: 4px 0 4px 8px; text-align: right; border: 1px solid #000;">CỘNG:</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.so_luong || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.tien || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.ck || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.thue || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.pt || 0), 0))}</td>
    </tr>
    <tr style="font-weight: bold; background-color: #f0f0f0;">
        <td colspan="3" style="padding: 4px 0 4px 8px; text-align: right; border: 1px solid #000;">TỔNG CỘNG:</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.so_luong || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.tien || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.ck || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.thue || 0), 0))}</td>
        <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(dataForSum.reduce((sum, i) => sum + (i.pt || 0), 0))}</td>
    </tr>
    `;
        return `
        <div style="width: 100%; font-family: Arial, sans-serif; font-size: 12px;">
            <!-- Header -->
           <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>

            <!-- Title -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 16px; font-weight: bold;">
                    BẢNG KÊ HOÁ ĐƠN CỦA MỘT MẶT HÀNG
                </h2>
                <div style="margin-top: 5px; font-size: 12px;">
                    TỪ NGÀY: ${fromDate} ĐẾN NGÀY: ${toDate}
                </div>
            </div>

            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
               <thead>
                        <tr style="background-color: #f0f0f0;">
                            <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 120px;">CHỨNG TỪ</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 150px;">DIỄN GIẢI</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">SỐ LƯỢNG</th>
                            <th rowspan="2" style="border: 1px solid #000; padding:6px; text-align: center; width: 100px;">GIÁ BÁN</th>
                            <th rowspan="2" style="border: 1px solid #000; padding:6px; text-align: center; width: 100px;">TIỀN HÀNG</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN CK</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN THUẾ</th>
                            <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">TỔNG TIỀN TT</th>
                        </tr>
                        <tr>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 70px;">NGÀY</th>
                            <th style="border: 1px solid #000; padding: 6px; background-color: #E8F5E8; text-align: center; width: 50px;">SỐ</th>
                        </tr>
                    </thead>
                <tbody>
                   ${rows}
                    ${totalRow}
                </tbody>
            </table>

           <div style="text-align: right; font-size: 11px; margin-top: 20px; margin-right: 30px;"> 
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
    `;
    },
    invoiceBySales: (data2, filterInfo) => {
        const fromDate = filterInfo?.StartDate || '01-08-2025';
        const toDate = filterInfo?.EndDate || '31-08-2025';
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit'
            });
        };
        const formatCurrency = (value) => {
            if (!value && value !== 0) return '';
            return new Intl.NumberFormat('vi-VN').format(Math.round(value));
        };
        const groupedData = {};
        data2.forEach(item => {
            const key = item.ma_nx?.trim() || 'unknown';
            if (!groupedData[key]) {
                groupedData[key] = {
                    header: null,
                    items: []
                };
            }

            if (item.fTag === 1) {
                groupedData[key].header = item;
            } else if (item.fTag === 0) {
                groupedData[key].items.push(item);
            }
        });

        let allRows = '';
        let grandTotalQuantity = 0;
        let grandTotalAmount = 0;
        let grandTotalDiscount = 0;
        let grandTotalTax = 0;
        let grandTotalPayment = 0;
        Object.keys(groupedData).forEach(groupKey => {
            const group = groupedData[groupKey];
            const header = group.header;
            const items = group.items;
            if (items.length === 0) return;
            if (header) {
                allRows += `
                <tr style="font-weight: bold; background-color: #f5f5f5;">
                    <td colspan="3" style="padding: 4px 8px; border: 1px solid #000; text-align: right;">${header.ten_kh || header.ten_kh2 || ''}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                </tr>
            `;
            }

            // Detail rows cho nhóm
            items.forEach(item => {
                allRows += `
                <tr>
                    <td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatDate(item.ngay_ct)}</td>
                    <td style="text-align: center; padding: 4px; border: 1px solid #000;">${item.so_ct_trim || item.so_ct?.trim() || ''}</td>
                    <td style="padding: 4px; border: 1px solid #000;">${item.ten_kh || ''}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.so_luong || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.gia || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.tien || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.ck || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.thue || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.pt || 0)}</td>
                </tr>
            `;
            });
            const subtotalQuantity = items.reduce((sum, i) => sum + (Number(i.so_luong) || 0), 0);
            const subtotalAmount = items.reduce((sum, i) => sum + (Number(i.tien) || 0), 0);
            const subtotalDiscount = items.reduce((sum, i) => sum + (Number(i.ck) || 0), 0);
            const subtotalTax = items.reduce((sum, i) => sum + (Number(i.thue) || 0), 0);
            const subtotalPayment = items.reduce((sum, i) => sum + (Number(i.pt) || 0), 0);
            allRows += `
            <tr style="font-weight: bold;">
                <td colspan="3" style="padding: 4px 8px; text-align: right; border: 1px solid #000;">Cộng:</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalQuantity)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalAmount)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalDiscount)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalTax)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalPayment)}</td>
            </tr>
        `;

            // Cộng vào grand total (CHỈ cộng từ các subtotal, KHÔNG cộng header)
            grandTotalQuantity += subtotalQuantity;
            grandTotalAmount += subtotalAmount;
            grandTotalDiscount += subtotalDiscount;
            grandTotalTax += subtotalTax;
            grandTotalPayment += subtotalPayment;
        });

        // Grand total row
        const grandTotalRow = `
        <tr style="font-weight: bold; background-color: #f0f0f0;">
            <td colspan="3" style="padding: 4px 8px; text-align: right; border: 1px solid #000;">TỔNG CỘNG:</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalQuantity)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalAmount)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalDiscount)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalTax)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalPayment)}</td>
        </tr>
    `;

        return `
        <div style="width: 100%; font-family: Arial, sans-serif; font-size: 12px;">
            <!-- Header -->
            <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>

            <!-- Title -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 14px; font-weight: bold;">
                    BẢNG KÊ HOÁ ĐƠN CỦA MỘT MẶT HÀNG NHÓM THEO DẠNG XUẤT BÁN
                </h2>
                <div style="margin-top: 5px; font-size: 12px;">
                    TỪ NGÀY: ${fromDate} ĐẾN NGÀY: ${toDate}
                </div>
            </div>

            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; text-align: center;">CHỨNG TỪ</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 150px;">KHÁCH HÀNG</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">SỐ LƯỢNG</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">GIÁ BÁN</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN HÀNG</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN CK</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN THUẾ</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">TỔNG TIỀN TT</th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 50px;">NGÀY</th>
                        <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 50px;">SỐ</th>
                    </tr>
                </thead>
                <tbody>
                    ${allRows}
                    ${grandTotalRow}
                </tbody>
            </table>

            <div style="text-align: right; font-size: 11px; margin-top: 20px; margin-right: 30px;"> 
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
    `;
    },
    invoiceByCustomerProductGroup: (data2, filterInfo) => {
        const fromDate = filterInfo?.StartDate || '01-08-2025';
        const toDate = filterInfo?.EndDate || '31-08-2025';
        const customerName = filterInfo?.CustomerName || 'KH008 - PHẠM THỊ UYÊN';
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit'
            });
        };

        // Helper function to format currency
        const formatCurrency = (value) => {
            if (!value && value !== 0) return '0';
            return new Intl.NumberFormat('vi-VN').format(Math.round(value));
        };

        // Debug: Kiểm tra dữ liệu đầu vào
        console.log('Data2 received:', data2);

        if (!data2 || data2.length === 0) {
            return `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h3>KHÔNG CÓ DỮ LIỆU</h3>
            </div>
        `;
        }

        // Nhóm dữ liệu theo ma_vt (mã vật tư)
        const groupedData = {};

        data2.forEach(item => {
            const key = item.ma_vt?.trim() || 'unknown';
            if (!groupedData[key]) {
                groupedData[key] = {
                    header: null,
                    items: []
                };
            }

            if (item.fTag === 1) {
                groupedData[key].header = item;
            } else if (item.fTag === 0) {
                groupedData[key].items.push(item);
            }
        });

        let allRows = '';
        let grandTotalQuantity = 0;
        let grandTotalAmount = 0;
        let grandTotalDiscount = 0;
        let grandTotalTax = 0;
        let grandTotalPayment = 0;

        console.log('Grouped Data:', groupedData);

        // Tạo rows cho từng nhóm mặt hàng
        Object.keys(groupedData).forEach(groupKey => {
            const group = groupedData[groupKey];
            const header = group.header;
            const items = group.items;

            if (items.length === 0) return; // Skip nếu không có items

            // Header row cho nhóm mặt hàng (không tính vào tổng)
            if (header) {
                allRows += `
                <tr style="font-weight: bold; background-color: #e8f5e8;">
                    <td colspan="3" style="padding: 4px 8px; border: 1px solid #000;text-align: center;">${header.dien_giai || header.dien_giai2 || ''}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                </tr>
            `;
            }

            // Detail rows cho nhóm
            items.forEach(item => {
                allRows += `
                <tr>
                    <td style="text-align: center; padding: 4px; border: 1px solid #000;">${formatDate(item.ngay_ct)}</td>
                    <td style="text-align: center; padding: 4px; border: 1px solid #000;">${item.so_ct?.trim() || ''}</td>
                    <td style="padding: 4px; border: 1px solid #000;">${item.dien_giai || ''}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.so_luong || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.gia || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.tien || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.ck || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.thue || 0)}</td>
                    <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(item.pt || 0)}</td>
                </tr>
            `;
            });

            // Tính subtotal cho nhóm (CHỈ tính các items có fTag=0)
            const subtotalQuantity = items.reduce((sum, i) => sum + (Number(i.so_luong) || 0), 0);
            const subtotalAmount = items.reduce((sum, i) => sum + (Number(i.tien) || 0), 0);
            const subtotalDiscount = items.reduce((sum, i) => sum + (Number(i.ck) || 0), 0);
            const subtotalTax = items.reduce((sum, i) => sum + (Number(i.thue) || 0), 0);
            const subtotalPayment = items.reduce((sum, i) => sum + (Number(i.pt) || 0), 0);

            // Subtotal row - "Cộng:" cho từng nhóm
            allRows += `
            <tr style="font-weight: bold;">
                <td colspan="3" style="padding: 4px 8px; text-align: right; border: 1px solid #000;">Cộng:</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalQuantity)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalAmount)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalDiscount)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalTax)}</td>
                <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(subtotalPayment)}</td>
            </tr>
        `;

            // Cộng vào grand total (CHỈ cộng từ các subtotal)
            grandTotalQuantity += subtotalQuantity;
            grandTotalAmount += subtotalAmount;
            grandTotalDiscount += subtotalDiscount;
            grandTotalTax += subtotalTax;
            grandTotalPayment += subtotalPayment;
        });

        // Grand total row - "TỔNG CỘNG:"
        const grandTotalRow = `
        <tr style="font-weight: bold; background-color: #f0f0f0;">
            <td colspan="3" style="padding: 4px 8px; text-align: right; border: 1px solid #000;">TỔNG CỘNG:</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalQuantity)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;"></td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalAmount)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalDiscount)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalTax)}</td>
            <td style="text-align: right; padding: 4px; border: 1px solid #000;">${formatCurrency(grandTotalPayment)}</td>
        </tr>
    `;

        return `
        <div style="width: 100%; font-family: Arial, sans-serif; font-size: 12px;">
            <!-- Header -->
            <div style="font-size: 10px; margin-bottom: 5px;">
               Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>

            <!-- Title -->
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 14px; font-weight: bold;">
                    BẢNG KÊ HOÁ ĐƠN CỦA MỘT KHÁCH HÀNG NHÓM THEO MẶT HÀNG
                </h2>
                <div style="margin-top: 5px; font-size: 12px;">
                    KHÁCH HÀNG: ${customerName}<br/>
                    TỪ NGÀY: ${fromDate} ĐẾN NGÀY: ${toDate}
                </div>
            </div>

            <!-- Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
                <thead>
                    <tr style="background-color: #e8f5e8;">
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; text-align: center;">CHỨNG TỪ</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 200px;">DIỄN GIẢI</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">SỐ LƯỢNG</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">GIÁ BÁN</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN HÀNG</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN CK</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 80px;">TIỀN THUẾ</th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; text-align: center; width: 100px;">TỔNG TIỀN TT</th>
                    </tr>
                    <tr style="background-color: #e8f5e8;">
                        <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 50px;">NGÀY</th>
                        <th style="border: 1px solid #000; padding: 6px; text-align: center; width: 50px;">SỐ</th>
                    </tr>
                </thead>
                <tbody>
                    ${allRows}
                    ${grandTotalRow}
                </tbody>
            </table>

            <div style="text-align: right; font-size: 11px; margin-top: 20px; margin-right: 30px;"> 
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
    `;
    }
};
