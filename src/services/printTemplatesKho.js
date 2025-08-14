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



export const printTemplatesKho = {
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
    bang_ke_phieu_nhap_mat_hang: (data, filterInfo, totals) => `
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
    // Template cho Sổ chi tiết của một tài khoản
    bang_ke_phieu_nhap_mat_hang_ncc: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
            <!-- Header -->
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                    BẢNG KÊ PHIẾU NHẬP NHÓM THEO NHÀ CUNG CẤP
                </h2>
                <div style="font-size: 12px;">
                    VẬT TƯ: ${filterInfo?.ma_vat_tu.trim()}
                </div>
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
                    <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                        DIỄN GIẢI
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                        MÃ NX
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                        MÃ KHO
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                        SỐ LƯỢNG
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                        ĐƠN GIÁ
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                        THÀNH TIỀN
                    </th>
                </tr>
                <tr>
                    <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">NGÀY</th>
                    <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">SỐ</th>
                </tr>
            </thead>
            <tbody>
                ${(() => {
            let result = '';
            let currentSupplier = null;
            let supplierData = [];
            let grandTotalSoLuong = 0;
            let grandTotalThanhTien = 0;

            // Nhóm dữ liệu theo nhà cung cấp
            for (let i = 0; i < data.length; i++) {
                const record = data[i];

                // Nếu là header nhà cung cấp (so_ct == null)
                if (record.so_ct == null) {
                    // Nếu có nhà cung cấp trước đó, in tổng của nhà cung cấp đó
                    if (currentSupplier && supplierData.length > 0) {
                        const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                        const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                        grandTotalSoLuong += supplierTotalSoLuong;
                        grandTotalThanhTien += supplierTotalThanhTien;

                        result += `
                                    <tr style="">
                                        <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                            Cộng:
                                        </td>
                                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                            ${supplierTotalSoLuong.toLocaleString()}
                                        </td>
                                        <td style="border: 1px solid #000; padding: 4px;"></td>
                                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                            ${supplierTotalThanhTien.toLocaleString()}
                                        </td>
                                    </tr>
                                `;
                    }

                    // In header nhà cung cấp mới
                    result += `
                                <tr style="font-weight: bold;">
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                        ${record.ten_kh || record.ma_kh || ""}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                </tr>
                            `;

                    currentSupplier = record;
                    supplierData = [];
                } else {
                    // Bản ghi thông thường
                    supplierData.push(record);

                    result += `
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                        ${formatISODate(record.ngay_ct)}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                        ${record.so_ct || ""}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                        ${record.dien_giai || ""}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                        ${record.ma_nx || ""}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                        ${record.ma_kho || ""}
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
                            `;
                }
            }

            // Xử lý nhà cung cấp cuối cùng
            if (currentSupplier && supplierData.length > 0) {
                const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                grandTotalSoLuong += supplierTotalSoLuong;
                grandTotalThanhTien += supplierTotalThanhTien;

                result += `
                            <tr style="">
                                <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                    Cộng:
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                    ${supplierTotalSoLuong.toLocaleString()}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                    ${supplierTotalThanhTien.toLocaleString()}
                                </td>
                            </tr>
                        `;
            }

            // Thêm tổng cộng cuối
            result += `
                        <tr style="font-weight: bold;">
                            <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right;">
                                TỔNG CỘNG:
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${grandTotalSoLuong.toLocaleString()}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px;"></td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${grandTotalThanhTien.toLocaleString()}
                            </td>
                        </tr>
                    `;

            return result;
        })()}
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
    // Template cho Sổ tiền gửi ngân hàng
    bang_ke_phieu_nhap_ncc_mat_hang: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
        <!-- Header -->
        <div style="font-size: 10px; text-align: left;">
            Công ty Cổ phần Công nghệ Gentech<br/>
            Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                BẢNG KÊ PHIẾU NHẬP CỦA KHÁCH HÀNG NHÓM THEO MẶT HÀNG
            </h2>
            <div style="font-size: 12px;">
                KHÁCH HÀNG: ${filterInfo?.ma_khach.trim()}
            </div>
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
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    DIỄN GIẢI
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    MÃ NX
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    MÃ KHO
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    SỐ LƯỢNG
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    ĐƠN GIÁ
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    THÀNH TIỀN
                </th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">NGÀY</th>
                <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">SỐ</th>
            </tr>
        </thead>
        <tbody>
            ${(() => {
            let result = '';
            let currentSupplier = null;
            let supplierData = [];
            let grandTotalSoLuong = 0;
            let grandTotalThanhTien = 0;

            // Nhóm dữ liệu theo nhà cung cấp
            for (let i = 0; i < data.length; i++) {
                const record = data[i];

                // Nếu là header nhà cung cấp (so_ct == null)
                if (record.so_ct == null) {
                    // Nếu có nhà cung cấp trước đó, in tổng của nhà cung cấp đó
                    if (currentSupplier && supplierData.length > 0) {
                        const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                        const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                        grandTotalSoLuong += supplierTotalSoLuong;
                        grandTotalThanhTien += supplierTotalThanhTien;

                        result += `
                                <tr style="">
                                    <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        Cộng:
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        ${supplierTotalSoLuong.toLocaleString()}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        ${supplierTotalThanhTien.toLocaleString()}
                                    </td>
                                </tr>
                            `;
                    }

                    // In header nhà cung cấp mới
                    result += `
                            <tr style="font-weight: bold;">
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                    ${record.dien_giai || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px;">
                                 ${record.dvt || ""}</td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                            </tr>
                        `;

                    currentSupplier = record;
                    supplierData = [];
                } else {
                    // Bản ghi thông thường
                    supplierData.push(record);

                    result += `
                            <tr>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${formatISODate(record.ngay_ct)}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.so_ct || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                    ${record.dien_giai || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.ma_nx || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.ma_kho || ""}
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
                        `;
                }
            }

            // Xử lý nhà cung cấp cuối cùng
            if (currentSupplier && supplierData.length > 0) {
                const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                grandTotalSoLuong += supplierTotalSoLuong;
                grandTotalThanhTien += supplierTotalThanhTien;

                result += `
                        <tr style="">
                            <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                Cộng:
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                ${supplierTotalSoLuong.toLocaleString()}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px;"></td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                ${supplierTotalThanhTien.toLocaleString()}
                            </td>
                        </tr>
                    `;
            }

            // Thêm tổng cộng cuối
            result += `
                    <tr style="font-weight: bold;">
                        <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right;">
                            TỔNG CỘNG:
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${grandTotalSoLuong.toLocaleString()}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px;"></td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${grandTotalThanhTien.toLocaleString()}
                        </td>
                    </tr>
                `;

            return result;
        })()}
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

    tong_hop_hang_nhap_kho: (data, filterInfo, totals) => `
<div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
    <!-- Header -->
   <div style="font-size: 10px; text-align: left;">
            Công ty Cổ phần Công nghệ Gentech<br/>
            Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
        </div>
    
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
            TỔNG HỢP HÀNG NHẬP KHO
        </h2>
        <div style="font-size: 12px; margin-bottom: 10px;">
            TỪ NGÀY: ${formatDate(filterInfo?.ngay_ct1)} ĐẾN NGÀY: ${formatDate(filterInfo?.ngay_ct2)}
        </div>
    </div>
    
    <!-- Main Table -->
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
        <thead>
            <tr>
                <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 50px;">
                    STT
                </th>
                <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 100px;">
                    MÃ VẬT TƯ
                </th>
                <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    TÊN VẬT TƯ
                </th>
                <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 80px;">
                    ĐVT
                </th>
                <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 120px;">
                    SỐ LƯỢNG
                </th>
                <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 150px;">
                    TIỀN
                </th>
            </tr>
        </thead>
        <tbody>
            ${data
            .map((record, index) => `
                    <tr>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                            ${index + 1}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                            ${record.ma_vt || ""}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                            ${record.ten_vt || ""}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                            ${record.dvt || ""}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${record.so_luong ? new Intl.NumberFormat("vi-VN").format(record.so_luong) : ""}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${record.tien ? new Intl.NumberFormat("vi-VN").format(record.tien) : ""}
                        </td>
                    </tr>
                `)
            .join("")}
        </tbody>
        <tfoot>
            <tr style="font-weight: bold;">
                <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right;">
                    TỔNG CỘNG:
                </td>
                <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                    ${totals?.tong_tien ? new Intl.NumberFormat("vi-VN").format(totals.tong_tien) :
            new Intl.NumberFormat("vi-VN").format(data.reduce((sum, record) => sum + (record.tien || 0), 0))}
                </td>
            </tr>
        </tfoot>
    </table>
    
    <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
        Ngày ..... tháng ..... năm ..........
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

    bang_ke_phieu_xuat: (data, filterInfo, totals) => `
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
                BẢNG KÊ PHIẾU XUẤT
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

    bang_ke_phieu_xuat_mat_hang: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 10px; margin-bottom: 5px;">
               Công ty cổ phần công nghệ Gentech<br/>
               Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
            </div>
            
            <h2 style="font-size: 16px; font-weight: bold; marginTop: 10px; text-transform: uppercase;">
                BẢNG KÊ PHIẾU XUẤT CỦA MỘT VẬT TƯ
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

    bang_ke_phieu_xuat_mat_hang_khach_hang: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
        <!-- Header -->
        <div style="font-size: 10px; text-align: left;">
            Công ty Cổ phần Công nghệ Gentech<br/>
            Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                BẢNG KÊ PHIẾU NHẬP NHÓM THEO KHÁCH HÀNG
            </h2>
            <div style="font-size: 12px;">
                VẬT TƯ: ${filterInfo?.ma_vat_tu.trim()}
            </div>
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
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    DIỄN GIẢI
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    MÃ NX
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    MÃ KHO
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    SỐ LƯỢNG
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    ĐƠN GIÁ
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    THÀNH TIỀN
                </th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">NGÀY</th>
                <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">SỐ</th>
            </tr>
        </thead>
        <tbody>
            ${(() => {
            let result = '';
            let currentSupplier = null;
            let supplierData = [];
            let grandTotalSoLuong = 0;
            let grandTotalThanhTien = 0;

            // Nhóm dữ liệu theo nhà cung cấp
            for (let i = 0; i < data.length; i++) {
                const record = data[i];

                // Nếu là header nhà cung cấp (so_ct == null)
                if (record.so_ct == null) {
                    // Nếu có nhà cung cấp trước đó, in tổng của nhà cung cấp đó
                    if (currentSupplier && supplierData.length > 0) {
                        const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                        const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                        grandTotalSoLuong += supplierTotalSoLuong;
                        grandTotalThanhTien += supplierTotalThanhTien;

                        result += `
                                <tr style="">
                                    <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        Cộng:
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        ${supplierTotalSoLuong.toLocaleString()}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        ${supplierTotalThanhTien.toLocaleString()}
                                    </td>
                                </tr>
                            `;
                    }

                    // In header nhà cung cấp mới
                    result += `
                            <tr style="font-weight: bold;">
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                    ${record.ten_kh || record.ma_kh || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                            </tr>
                        `;

                    currentSupplier = record;
                    supplierData = [];
                } else {
                    // Bản ghi thông thường
                    supplierData.push(record);

                    result += `
                            <tr>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${formatISODate(record.ngay_ct)}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.so_ct || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                    ${record.dien_giai || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.ma_nx || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.ma_kho || ""}
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
                        `;
                }
            }

            // Xử lý nhà cung cấp cuối cùng
            if (currentSupplier && supplierData.length > 0) {
                const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                grandTotalSoLuong += supplierTotalSoLuong;
                grandTotalThanhTien += supplierTotalThanhTien;

                result += `
                        <tr style="">
                            <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                Cộng:
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                ${supplierTotalSoLuong.toLocaleString()}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px;"></td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                ${supplierTotalThanhTien.toLocaleString()}
                            </td>
                        </tr>
                    `;
            }

            // Thêm tổng cộng cuối
            result += `
                    <tr style="font-weight: bold;">
                        <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right;">
                            TỔNG CỘNG:
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${grandTotalSoLuong.toLocaleString()}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px;"></td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${grandTotalThanhTien.toLocaleString()}
                        </td>
                    </tr>
                `;

            return result;
        })()}
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

    bang_ke_phieu_xuat_khach_hang_mat_hang: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
        <!-- Header -->
        <div style="font-size: 10px; text-align: left;">
            Công ty Cổ phần Công nghệ Gentech<br/>
            Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
        </div>
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                BẢNG KÊ PHIẾU XUẤT CỦA KHÁCH HÀNG NHÓM THEO MẶT HÀNG
            </h2>
            <div style="font-size: 12px;">
                KHÁCH HÀNG: ${filterInfo?.ma_khach.trim()}
            </div>
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
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    DIỄN GIẢI
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    MÃ NX
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    MÃ KHO
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    SỐ LƯỢNG
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    ĐƠN GIÁ
                </th>
                <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                    THÀNH TIỀN
                </th>
            </tr>
            <tr>
                <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">NGÀY</th>
                <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">SỐ</th>
            </tr>
        </thead>
        <tbody>
            ${(() => {
            let result = '';
            let currentSupplier = null;
            let supplierData = [];
            let grandTotalSoLuong = 0;
            let grandTotalThanhTien = 0;

            // Nhóm dữ liệu theo nhà cung cấp
            for (let i = 0; i < data.length; i++) {
                const record = data[i];

                // Nếu là header nhà cung cấp (so_ct == null)
                if (record.so_ct == null) {
                    // Nếu có nhà cung cấp trước đó, in tổng của nhà cung cấp đó
                    if (currentSupplier && supplierData.length > 0) {
                        const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                        const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                            sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                        grandTotalSoLuong += supplierTotalSoLuong;
                        grandTotalThanhTien += supplierTotalThanhTien;

                        result += `
                                <tr style="">
                                    <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        Cộng:
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        ${supplierTotalSoLuong.toLocaleString()}
                                    </td>
                                    <td style="border: 1px solid #000; padding: 4px;"></td>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                        ${supplierTotalThanhTien.toLocaleString()}
                                    </td>
                                </tr>
                            `;
                    }

                    // In header nhà cung cấp mới
                    result += `
                            <tr style="font-weight: bold;">
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                    ${record.dien_giai || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px;">
                                 ${record.dvt || ""}</td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                                <td style="border: 1px solid #000; padding: 4px;"></td>
                            </tr>
                        `;

                    currentSupplier = record;
                    supplierData = [];
                } else {
                    // Bản ghi thông thường
                    supplierData.push(record);

                    result += `
                            <tr>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${formatISODate(record.ngay_ct)}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.so_ct || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                    ${record.dien_giai || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.ma_nx || ""}
                                </td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                    ${record.ma_kho || ""}
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
                        `;
                }
            }

            // Xử lý nhà cung cấp cuối cùng
            if (currentSupplier && supplierData.length > 0) {
                const supplierTotalSoLuong = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.so_luong?.toString().replace(/,/g, "")) || 0), 0);
                const supplierTotalThanhTien = supplierData.reduce((sum, item) =>
                    sum + (parseFloat(item.tien?.toString().replace(/,/g, "")) || 0), 0);

                grandTotalSoLuong += supplierTotalSoLuong;
                grandTotalThanhTien += supplierTotalThanhTien;

                result += `
                        <tr style="">
                            <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                Cộng:
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                ${supplierTotalSoLuong.toLocaleString()}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px;"></td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                                ${supplierTotalThanhTien.toLocaleString()}
                            </td>
                        </tr>
                    `;
            }

            // Thêm tổng cộng cuối
            result += `
                    <tr style="font-weight: bold;">
                        <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right;">
                            TỔNG CỘNG:
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${grandTotalSoLuong.toLocaleString()}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px;"></td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                            ${grandTotalThanhTien.toLocaleString()}
                        </td>
                    </tr>
                `;

            return result;
        })()}
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

    tong_hop_hang_xuat_kho: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
        <!-- Header -->
       <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                TỔNG HỢP HÀNG XUẤT KHO
            </h2>
            <div style="font-size: 12px; margin-bottom: 10px;">
                TỪ NGÀY: ${formatDate(filterInfo?.ngay_ct1)} ĐẾN NGÀY: ${formatDate(filterInfo?.ngay_ct2)}
            </div>
        </div>
        
        <!-- Main Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
            <thead>
                <tr>
                    <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 50px;">
                        STT
                    </th>
                    <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 100px;">
                        MÃ VẬT TƯ
                    </th>
                    <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                        TÊN VẬT TƯ
                    </th>
                    <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 80px;">
                        ĐVT
                    </th>
                    <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 120px;">
                        SỐ LƯỢNG
                    </th>
                    <th style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center; width: 150px;">
                        TIỀN
                    </th>
                </tr>
            </thead>
            <tbody>
                ${data
            .map((record, index) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${index + 1}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                ${record.ma_vt || ""}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                ${record.ten_vt || ""}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${record.dvt || ""}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${record.so_luong ? new Intl.NumberFormat("vi-VN").format(record.so_luong) : ""}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${record.tien ? new Intl.NumberFormat("vi-VN").format(record.tien) : ""}
                            </td>
                        </tr>
                    `)
            .join("")}
            </tbody>
            <tfoot>
                <tr style="font-weight: bold;">
                    <td colspan="5" style="border: 1px solid #000; padding: 4px; text-align: right;">
                        TỔNG CỘNG:
                    </td>
                    <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                        ${totals?.tong_tien ? new Intl.NumberFormat("vi-VN").format(totals.tong_tien) :
            new Intl.NumberFormat("vi-VN").format(data.reduce((sum, record) => sum + (record.tien || 0), 0))}
                    </td>
                </tr>
            </tfoot>
        </table>
        
        <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
            Ngày ..... tháng ..... năm ..........
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

    the_kho_chi_tiet_vat_tu: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
            <div style="font-size: 10px; text-align: center;">
                Mã số thuế: 0104929879<br/>
                Mẫu số: S06 - DNN<br/>
                (Ban hành theo Thông tư số 133/2016/TT-BTC<br/>
                ngày 26/8/2016 của Bộ Tài chính)
            </div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 10px 0; text-transform: uppercase;">
                SỔ CHI TIẾT VẬT LIỆU, DỤNG CỤ, SẢN PHẨM, HÀNG HÓA
            </h2>
            <div style="font-size: 12px; margin: 5px 0;">
                TÀI KHOẢN: 6278 - KHO: TẤT CẢ CÁC KHO
            </div>
            <div style="font-size: 12px; margin: 5px 0;">
                TÊN, QUI CÁCH NGUYÊN LIỆU, VẬT LIỆU, CÔNG CỤ, DỤNG CỤ (SẢN PHẨM, HÀNG HÓA): ${filterInfo?.ma_vat_tu || 'VT003 - NHẬP TÊN VẬT TƯ'}
            </div>
            <div style="font-size: 12px; margin-bottom: 15px;">
                TỪ NGÀY: ${filterInfo?.ngay_ct1 ? formatDate(filterInfo.ngay_ct1) : '..../..../.....'} ĐẾN NGÀY: ${filterInfo?.ngay_ct2 ? formatDate(filterInfo.ngay_ct2) : '..../..../....'}
            </div>
            <div style="text-align: right; font-size: 12px; font-weight: bold;">
                TỒN ĐẦU:
            </div>
        </div>

        <!-- Main Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
            <thead>
                <tr>
                    <th colspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                        CHỨNG TỪ
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        DIỄN GIẢI
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 60px;">
                        TK ĐỐI ỨNG
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 80px;">
                        ĐƠN GIÁ
                    </th>
                    <th colspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                        NHẬP
                    </th>
                    <th colspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                        XUẤT
                    </th>
                    <th colspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold;">
                        TỒN
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 60px;">
                        GHI CHÚ
                    </th>
                </tr>
                <tr>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 80px;">
                        SỐ HIỆU
                    </th>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 80px;">
                        NGÀY
                    </th>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 80px;">
                        SỐ LƯỢNG
                    </th>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 100px;">
                        THÀNH TIỀN
                    </th>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 80px;">
                        SỐ LƯỢNG
                    </th>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 100px;">
                        THÀNH TIỀN
                    </th>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 80px;">
                        SỐ LƯỢNG
                    </th>
                    <th style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 100px;">
                        THÀNH TIỀN
                    </th>
                </tr>
                <tr>
                <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        A
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        B
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        C
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        D
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        1
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        2
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        3=(1x2)
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        4
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        5=(1x4)
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        6
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        7=(1x6)
                    </th>
                    <th rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #E8F5E8; text-align: center; font-weight: bold; width: 150px;">
                        8
                    </th>
                </tr>
            </thead>
            <tbody>
                
                <!-- Data Rows -->
                ${data.map((record, index) => {
        // Calculate running balance (simplified - in real scenario you'd need proper inventory tracking)
        const isInbound = record.loai_phieu === 'nhap'; // Assuming you have this field
        return `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${record.so_ct}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${record.ngay_ct ? formatISODate(record.ngay_ct) : ''}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">${record.ten_kh || record.dien_giai || ''}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${record.tk_doi_ung || ''}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${new Intl.NumberFormat("vi-VN").format(record.gia || 0)}</td>
                            
                            ${isInbound ? `
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;">${new Intl.NumberFormat("vi-VN").format(record.so_luong || 0)}</td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;">${new Intl.NumberFormat("vi-VN").format(record.tien || 0)}</td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;"></td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;"></td>
                            ` : `
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;"></td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;"></td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;">${new Intl.NumberFormat("vi-VN").format(record.so_luong || 0)}</td>
                                <td style="border: 1px solid #000; padding: 4px; text-align: right;">${new Intl.NumberFormat("vi-VN").format(record.tien || 0)}</td>
                            `}
                            
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;"></td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;"></td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${record.ghi_chu || ''}</td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <!-- Hàng 1 - Cột 1 -->
                <td style="padding: 4px; text-align: left;">
                    Số dư có 01 trang, đánh số từ trang 01 đến trang 01
                </td>
                <!-- Hàng 1 - Cột 2 -->
                <td style="padding: 4px; text-align: center; font-weight: bold;">
                    TỔNG CỘNG:
                </td>
                <!-- Hàng 1 - Cột 3 -->
                <td style="padding: 4px; text-align: right;">
                    <!-- trống -->
                </td>
            </tr>
            <tr>
                <!-- Hàng 2 - Cột 1 -->
                <td style="padding: 4px; text-align: left;">
                    Ngày mở sổ: ${filterInfo?.ngay_mo_so ? formatDate(filterInfo.ngay_mo_so) : '..../..../....'}
                </td>
                <!-- Hàng 2 - Cột 2 -->
                <td style="padding: 4px; text-align: right;">
                    <!-- trống -->
                </td>
                <!-- Hàng 2 - Cột 3 -->
                <td style="padding: 4px; text-align: center; font-weight: bold;">
                    TỒN CUỐI:
                </td>
            </tr>
        </table>

        <!-- Footer -->
        <div style="margin-top: 40px;">
            <div style="text-align: right; font-size: 11px; margin-bottom: 20px;">
                Ngày ..... tháng ..... năm ..........
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
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">GIÁM ĐỐC</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên, đóng dấu)</div>
                </div>
            </div>
        </div>
        
        <!-- Page Footer -->
        <div style="margin-top: 20px; font-size: 10px;">
            Trang: 1, ${new Date().toLocaleDateString('vi-VN')}
        </div>
    </div>
    `,
    tong_hop_nhap_xuat_ton: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 10px 0; text-transform: uppercase;">
                TỔNG HỢP NHẬP XUẤT TỒN
            </h2>
            <div style="font-size: 12px; margin: 5px 0;">
                KHO: TẤT CẢ CÁC KHO
            </div>
            <div style="font-size: 12px; margin-bottom: 15px;">
                TỪ NGÀY: ${filterInfo?.ngay_ct1 ? formatDate(filterInfo.ngay_ct1) : '..../..../.....'} ĐẾN NGÀY: ${filterInfo?.ngay_ct2 ? formatDate(filterInfo.ngay_ct2) : '..../..../....'}
            </div>
        </div>

        <!-- Main Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
           <thead>
        <tr>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">STT</th>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">MÃ VẬT TƯ</th>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">TÊN VẬT TƯ</th>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">ĐVT</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">TỒN ĐẦU KỲ</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">NHẬP TRONG KỲ</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">XUẤT TRONG KỲ</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">TỒN CUỐI KỲ</th>
        </tr>
        <tr>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
                </tr>
            </thead>
                    <tbody>
        ${data.map((item, idx) => `
            <tr>
            <td style="border:1px solid #000; text-align:center;">${idx + 1}</td>
            <td style="border:1px solid #000; text-align:center;">${item.ma_vt}</td>
            <td style="border:1px solid #000;">${item.ten_vt}</td>
            <td style="border:1px solid #000; text-align:center;">${item.dvt}</td>
            <td style="border:1px solid #000; text-align:right;">${item.ton_dau || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.du_dau || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.sl_nhap || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.tien_nhap || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.sl_xuat || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.tien_xuat || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.ton_cuoi || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.du_cuoi || ''}</td>
            </tr>
        `).join('')}
        </tbody>
        </table>

        <!-- Footer -->
        <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
            Ngày ..... tháng ..... năm ..........
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
    tong_hop_nhap_xuat_ton_quy_doi: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
        </div>

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 10px 0; text-transform: uppercase;">
                TỔNG HỢP NHẬP XUẤT TỒN
            </h2>
            <div style="font-size: 12px; margin: 5px 0;">
                KHO: TẤT CẢ CÁC KHO
            </div>
            <div style="font-size: 12px; margin-bottom: 15px;">
                TỪ NGÀY: ${filterInfo?.ngay_ct1 ? formatDate(filterInfo.ngay_ct1) : '..../..../.....'} ĐẾN NGÀY: ${filterInfo?.ngay_ct2 ? formatDate(filterInfo.ngay_ct2) : '..../..../....'}
            </div>
        </div>

        <!-- Main Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
           <thead>
        <tr>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">STT</th>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">MÃ VẬT TƯ</th>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">TÊN VẬT TƯ</th>
            <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">ĐVT</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">TỒN ĐẦU KỲ</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">NHẬP TRONG KỲ</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">XUẤT TRONG KỲ</th>
            <th colspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">TỒN CUỐI KỲ</th>
        </tr>
        <tr>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
            <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TIỀN</th>
                </tr>
            </thead>
                    <tbody>
        ${data.map((item, idx) => `
            <tr>
            <td style="border:1px solid #000; text-align:center;">${idx + 1}</td>
            <td style="border:1px solid #000; text-align:center;">${item.ma_vt}</td>
            <td style="border:1px solid #000;">${item.ten_vt}</td>
            <td style="border:1px solid #000; text-align:center;">${item.dvt}</td>
            <td style="border:1px solid #000; text-align:right;">${item.ton_dau || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.du_dau || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.sl_nhap || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.tien_nhap || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.sl_xuat || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.tien_xuat || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.ton_cuoi || ''}</td>
            <td style="border:1px solid #000; text-align:right;">${item.du_cuoi || ''}</td>
            </tr>
        `).join('')}
        </tbody>
        </table>

        <!-- Footer -->
        <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
            Ngày ..... tháng ..... năm ..........
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
    tong_hop_chi_tiet_vat_tu: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
        <!-- Header -->
       <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
            <div style="font-size: 10px; text-align: center;">
                Mã số thuế: 0104929879<br/>
                Mẫu số: S06 - DNN<br/>
                (Ban hành theo Thông tư số 133/2016/TT-BTC<br/>
                ngày 26/8/2016 của Bộ Tài chính)
            </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                BẢNG TỔNG HỢP CHI TIẾT VẬT TƯ, VẬT LIỆU,<br/>
                DỤNG CỤ, SẢN PHẨM, HÀNG HÓA
            </h2>
            <div style="font-size: 12px; margin-bottom: 10px;">
                TỪ NGÀY: ${formatDate(filterInfo?.ngay_ct1)} ĐẾN NGÀY: ${formatDate(filterInfo?.ngay_ct2)}
            </div>
        </div>
        
        <!-- Main Table -->
        <!-- Main Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 12px;">
            <thead>
                <tr>
                    <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">STT</th>
                    <th rowspan="2" style="border:1px solid #000; background:#E8F5E8; text-align:center;">
                        TÊN, QUI CÁCH VẬT LIỆU, DỤNG CỤ, SẢN PHẨM, HÀNG HÓA
                    </th>
                    <th colspan="4" style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ TIỀN</th>
                </tr>
                <tr>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TỒN ĐẦU KỲ</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">NHẬP TRONG KỲ</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">XUẤT TRONG KỲ</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TỒN CUỐI KỲ</th>
                </tr>
                <tr>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">A</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">B</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">1</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">2</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">3</th>
                    <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">4</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((record, index) => `
                <tr>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">${index + 1}</td>
                    <td style="border:1px solid #000; padding:4px;">${record.ten_vt || ''}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:right;">
                        ${record.du_dau ? new Intl.NumberFormat("vi-VN").format(record.du_dau) : ''}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:right;">
                        ${record.tien_nhap ? new Intl.NumberFormat("vi-VN").format(record.tien_nhap) : ''}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:right;">
                        ${record.tien_xuat ? new Intl.NumberFormat("vi-VN").format(record.tien_xuat) : ''}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:right;">
                        ${record.du_cuoi ? new Intl.NumberFormat("vi-VN").format(record.du_cuoi) : ''}
                    </td>
                </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="border:1px solid #000; padding:4px; text-align:center; font-weight:bold;">Cộng:</td>
                    <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">
                        ${new Intl.NumberFormat("vi-VN").format(data.reduce((sum, r) => sum + (Number(r.du_dau) || 0), 0))}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">
                        ${new Intl.NumberFormat("vi-VN").format(data.reduce((sum, r) => sum + (Number(r.tien_nhap) || 0), 0))}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">
                        ${new Intl.NumberFormat("vi-VN").format(data.reduce((sum, r) => sum + (Number(r.tien_xuat) || 0), 0))}
                    </td>
                    <td style="border:1px solid #000; padding:4px; text-align:right; font-weight:bold;">
                        ${new Intl.NumberFormat("vi-VN").format(data.reduce((sum, r) => sum + (Number(r.du_cuoi) || 0), 0))}
                    </td>
                </tr>
            </tfoot>
        </table>

        <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
            Ngày ..... tháng ..... năm ..........
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
            <div style="text-align: center; width: 200px;">
                <div style="font-weight: bold;">GIÁM ĐỐC</div>
                <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
            </div>
        </div>
    </div>
    `,
    bao_cao_ton_kho: (data, filterInfo, totals) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
        <!-- Header -->
       <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                BÁO CÁO TỒN KHO
            </h2>
            <div style="font-size: 12px; margin-bottom: 10px;">
                NGÀY: ${formatDate(filterInfo?.ngay_ct2)}
            </div>
            
            <div style="font-size: 12px; margin: 5px 0;">
                KHO: TẤT CẢ CÁC KHO
            </div>
        </div>
        
        <!-- Main Table -->
       <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 12px;">
            <thead>
                <tr>
                <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">STT</th>
                <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">MÃ VẬT TƯ</th>
                <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">TÊN VẬT TƯ</th>
                <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">ĐVT</th>
                <th style="border:1px solid #000; background:#E8F5E8; text-align:center;">SỐ LƯỢNG</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((record, index) => `
                <tr>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">${index + 1}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:left;">${record.ma_vt || ''}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:left;">${record.ten_vt || ''}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:center;">${record.dvt || ''}</td>
                    <td style="border:1px solid #000; padding:4px; text-align:right;">
                    ${record.ton00   ? new Intl.NumberFormat("vi-VN").format(record.ton00) : ''}
                    </td>
                </tr>
                `).join('')}
            </tbody>
            </table>

        <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
            Ngày ..... tháng ..... năm ..........
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
