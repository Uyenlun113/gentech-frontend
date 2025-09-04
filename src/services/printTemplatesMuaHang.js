const formatDate = (dateString) => {
    if (!dateString) return "";

    // Nếu định dạng là dd-mm-yyyy
    const parts = dateString.split("-");
    if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) return "";
        return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
    }

    // Nếu là định dạng khác thì fallback
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
const formatISODate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}`;
};

const renderTable = (data, total) => {
    // Nhóm data theo stt_rec
    const grouped = data.reduce((acc, item) => {
        if (!acc[item.stt_rec]) acc[item.stt_rec] = [];
        acc[item.stt_rec].push(item);
        return acc;
    }, {});

    let grandTotal = 0; // Tổng cộng của tất cả nhóm

    const content = Object.keys(grouped)
        .map((stt_rec) => {
            const rows = grouped[stt_rec]
                .map(
                    (record) => `
                        <tr>
                            <td style="border: 1px solid #000; border-bottom: none; padding: 4px; text-align: center;">
                                ${formatISODate(record.ngay_ct)}
                            </td>
                            <td style="border: 1px solid #000; border-bottom: none; padding: 4px; text-align: center;">
                                ${record.so_ct}
                            </td>
                            <td style="border: 1px solid #000; padding: 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <!-- Cột 1: 70% -->
                                        <td style="width: 70%; text-align: left; vertical-align: top; padding: 4px; border-right: 1px solid #000;">
                                            <div style="font-size: 10px;">
                                                ${record.ten_kh + " - " + record.ma_kh || ""}
                                            </div>
                                            <div style="font-size: 10px;">
                                                ${record.dien_giai || ""}
                                            </div>
                                        </td>
                                        <!-- Cột 2: 30% -->
                                        <td style="width: 30%; text-align: center; vertical-align: top; padding: 4px;">
                                            <div style="font-size: 10px;">
                                                ${record.ma_kho || ""}
                                            </div>
                                            <div style="font-size: 10px;">
                                                ${record.ma_nx || ""}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${record.so_luong || ""}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${record.gia || ""}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${record.tien || ""}
                            </td>
                        </tr>
                    `
                )
                .join("");

            // Hàng total theo từng nhóm
            const totalRow = total.find((t) => t.stt_rec === stt_rec);

            // Tính tổng thành tiền của nhóm
            const tongThanhTien = total
                .filter(t => t.stt_rec === stt_rec)
                .reduce((sum, r) => {
                    const tien = parseFloat(r.tien?.toString().replace(/,/g, "")) || 0;
                    return sum + tien;
                }, 0);

            grandTotal += tongThanhTien; // cộng dồn vào tổng lớn

            const totalHtml = totalRow
                ? `
                    <tr>
                        <td></td>
                        <td style="border-left: 1px solid #000;"></td>
                        <td style="border: 1px solid #000; padding: 0;">
                            <div style="display: flex; width: 100%;">
                                <!-- Cột 1: diễn giải -->
                                <div style="width: 70%; padding: 4px; border-right: 1px solid #000; text-align: left;">
                                    ${totalRow.dien_giai || "Tổng cộng"}
                                </div>
                                <!-- Cột 2: DVT -->
                                <div style="width: 30%; padding: 4px; text-align: center;">
                                    ${totalRow.dvt || ""}
                                </div>
                            </div>
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${totalRow.so_luong || ""}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${totalRow.gia || ""}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${totalRow.tien || ""}
                        </td>
                    </tr>

                    <!-- Hàng Cộng -->
                    <tr>
                        <td colspan="4" style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold;">
                            Cộng
                        </td>
                        <td style="border: 1px solid #000;"></td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                            ${tongThanhTien.toLocaleString()}
                        </td>
                    </tr>
                `
                : "";

            return rows + totalHtml;
        })
        .join("");

    // Thêm hàng Tổng Cộng cuối bảng
    const grandTotalHtml = `
        <tr>
            <td colspan="4" style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold;">
                TỔNG CỘNG
            </td>
            <td style="border: 1px solid #000; "></td>
            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold; ">
                ${grandTotal.toLocaleString()}
            </td>
        </tr>
    `;

    return content + grandTotalHtml;
};



export const printTemplatesMuaHang = {
    // Template cho Sổ quỹ tiền mặt
    bang_ke_phieu_nhap: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>
                </div>
                
                <h2 style="font-size: 16px; font-weight: bold; marginTop: 10px; text-transform: uppercase;">
                    BẢNG KÊ PHIẾU NHẬP
                </h2>
                <div style="font-size: 12px; margin-bottom: 10px;">
                    TỪ NGÀY: ${formatDate(filterInfo?.ngay_ct1)} ĐẾN NGÀY: ${formatDate(filterInfo?.ngay_ct2)}
                </div>
            </div>

            <!-- Main Table -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
                <thead>
                    <tr>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                            CHỨNG TỪ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 380px; background-color: #EBF8EC; text-align: center;">
                            DIỄN GIẢI
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">
                            SỐ LƯỢNG
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">
                            ĐƠN GIÁ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 150px; background-color: #EBF8EC; text-align: center;">
                            THÀNH TIỀN
                        </th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">NGÀY</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">SỐ</th>
                    </tr>
                </thead>
                <tbody>
                ${renderTable(data, totals)}
            </tbody>
            </table>
            
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
    `,
    // Template cho Bảng cân đối kế toán
    bang_ke_hoa_don_mua_hang_va_dich_vu: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>
                </div>
                
                <h2 style="font-size: 16px; font-weight: bold; marginTop: 10px; text-transform: uppercase;">
                    BẢNG KÊ PHIẾU NHẬP CỦA MỘT VẬT TƯ
                </h2>
                <div style="font-size: 12px;">
                    VẬT TƯ: ${filterInfo?.ma_vat_tu.trim()}
                </div>
                <div style="font-size: 12px; margin-bottom: 10px;">
                    TỪ NGÀY: ${formatDate(filterInfo?.ngay_ct1)} ĐẾN NGÀY: ${formatDate(filterInfo?.ngay_ct2)}
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                <thead>
                    <tr>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                            CHỨNG TỪ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 380px; background-color: #EBF8EC; text-align: center;">
                            TÊN KHÁCH HÀNG
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 380px; background-color: #EBF8EC; text-align: center;">
                            MÃ DỰ ÁN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 380px; background-color: #EBF8EC; text-align: center;">
                            MÃ NX
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 380px; background-color: #EBF8EC; text-align: center;">
                            MÃ KHO
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">
                            SỐ LƯỢNG
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">
                            ĐƠN GIÁ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 150px; background-color: #EBF8EC; text-align: center;">
                            THÀNH TIỀN
                        </th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">NGÀY</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">SỐ</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
            .map(
                (record, index) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${formatISODate(record.ngay_ct)}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${record.so_ct}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${record.ten_kh}</td>
                            <td style="border: 1px solid #000; padding: 4px;">${""}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${record.ma_nx}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${record.ma_kho}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${record.so_luong}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${record.gia}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${record.tien || 0}</td>
                        </tr>
                    `
            )
            .join("")}
                </tbody>
                 <tfoot>
                <tr>
                    <td colspan="6" style="border: 1px solid #000; padding: 4px; font-weight: bold; text-align: center;">
                        TỔNG CỘNG
                    </td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                        ${new Intl.NumberFormat("vi-VN").format(
                data.reduce((sum, record) => sum + (record.so_luong || 0), 0)
            )}
                    </td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;"></td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold; color: #cc0000;">
                        ${new Intl.NumberFormat("vi-VN").format(
                data.reduce((sum, record) => sum + (record.tien || 0), 0)
            )}
                    </td>
                </tr>
            </tfoot>

            </table>
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
    `,
    // Template mặc định
    default: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 16px; font-weight: bold;">BẢNG KÊ PHIẾU NHẬP</h2>
                <div style="font-size: 12px;">
                    TỪ NGÀY: ${filterInfo?.ngay_ct1 || ""} ĐẾN NGÀY: ${filterInfo?.ngay_ct2 || ""}
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">STT</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Ngày CT</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Số CT</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Diễn giải</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Phát sinh Nợ</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Phát sinh Có</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
            .map(
                (record, index) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${index + 1}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${formatDate(
                    record.ngay_ct
                )}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${record.so_ct_trim || record.so_ct || "-"
                    }</td>
                            <td style="border: 1px solid #000; padding: 4px;">${record.dien_giai || "-"}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${record.ps_no ? formatCurrency(record.ps_no) : "-"
                    }</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${record.ps_co ? formatCurrency(record.ps_co) : "-"
                    }</td>
                        </tr>
                    `
            )
            .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="border: 1px solid #000; padding: 4px; font-weight: bold; text-align: center;">TỔNG CỘNG</td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold; color: #0066cc;">
                            ${new Intl.NumberFormat("vi-VN").format(totals.tongThu)}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold; color: #cc0000;">
                            ${new Intl.NumberFormat("vi-VN").format(totals.tongChi)}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <!-- Summary Info -->
            <div style="margin-top: 20px; font-size: 11px;">
                <div>Tổng số bản ghi: ${data.length}</div>
                <div>Ngày in: ${new Date().toLocaleDateString("vi-VN")}</div>
            </div>
        </div>
    `,
};
