import React from 'react';

const HoaDonXuatKhoPrintTemplate = React.forwardRef(({
    selectedHoaDonXuatKho = {},
}, ref) => {
    const formatDate = (dateString) => {
        if (!dateString) return "30 THÁNG 07 NĂM 2025";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day} THÁNG ${month} NĂM ${year}`;
    };

    const formatCurrency = (amount) => {
        if (!amount) return "";
        return new Intl.NumberFormat("vi-VN").format(amount);
    };
    const convertToWords = (amount) => {
        try {
            if (!amount) return "";
            // Chuyển số thành integer bằng cách làm tròn
            const intAmount = Math.round(Number(amount));
            return numToWords(intAmount);
        } catch (error) {
            console.error("Error converting to words:", error);
            return "";
        }
    };
    // Lấy data từ selectedHoaDonXuatKho
    const hangHoaData = selectedHoaDonXuatKho?.hachToanList || [];

    return (
        <div ref={ref} className="bg-white text-black" style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '20mm',
            margin: '0 auto',
            fontSize: '12px',
            lineHeight: '1.3',
            fontFamily: 'Arial, sans-serif',
            position: 'relative'
        }}>
            <style jsx>{`
                @media print {
                    body { margin: 0; }
                    .print-container { 
                        width: 210mm !important;
                        height: 297mm !important;
                        padding: 20mm !important;
                        margin: 0 !important;
                    }
                    .no-print { display: none !important; }
                }
                table { border-collapse: collapse; width: 100%; }
                .border-table th, .border-table td { border: 1px solid black; }
                .no-border { border: none !important; }
            `}</style>

            {/* Header section */}
            <div style={{
                borderBottom: '1px solid black',
                padding: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                fontSize: '11px'
            }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '2px' }}>HÓA ĐƠN</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>GIÁ TRỊ GIA TĂNG</div>
                    <div style={{ fontSize: '11px', marginBottom: '2px' }}>LIÊN 1 : LƯU</div>
                    <div style={{ fontSize: '11px' }}>NGÀY {formatDate(selectedHoaDonXuatKho.ngay_ct)}</div>
                </div>
                <div style={{ textAlign: 'left', fontSize: '11px', paddingLeft: '20px' }}>
                    <div>Mẫu số:</div>
                    <div>Ký hiệu: {selectedHoaDonXuatKho.ky_hieu || "123"}</div>
                    <div>Số: {selectedHoaDonXuatKho.so_ct || "1"}</div>
                </div>
            </div>

            {/* Company info section */}
            <div style={{ borderBottom: '1px solid black', padding: '8px', fontSize: '11px' }}>
                <div style={{ marginBottom: '2px' }}>
                    <span style={{ display: 'inline-block', width: '100px' }}>Đơn vị bán hàng:</span>
                    <span>Công ty cổ phần công nghệ Gentech</span>
                </div>
                <div style={{ marginBottom: '2px' }}>
                    <span style={{ display: 'inline-block', width: '100px' }}>Địa chỉ:</span>
                    <span>Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, Hà Nội</span>
                </div>
                <div style={{ marginBottom: '2px' }}>
                    <span style={{ display: 'inline-block', width: '100px' }}>Số tài khoản:</span>
                    <span>[Số tài khoản - Tên tài khoản]</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', width: '100px' }}>Điện thoại:</span>
                    <span style={{ marginRight: '50px' }}>MS:</span>
                    <div style={{ display: 'flex', gap: '1px' }}>
                        {[0, 1, 0, 4, 9, 2, 9, 8, 7, 9].map((digit, i) => (
                            <div key={i} style={{
                                width: '14px',
                                height: '14px',
                                border: '1px solid black',
                                textAlign: 'center',
                                fontSize: '9px',
                                lineHeight: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {digit}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1px', marginLeft: '10px' }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{
                                width: '14px',
                                height: '14px',
                                border: '1px solid black',
                                textAlign: 'center',
                                fontSize: '9px'
                            }}>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Customer info section */}
            <div style={{ padding: '8px', fontSize: '11px' }}>
                <div style={{ marginBottom: '2px' }}>
                    <span style={{ display: 'inline-block', width: '130px' }}>Họ tên người mua hàng:</span>
                    <span>{selectedHoaDonXuatKho.ten_kh || "fdsgsdg"}</span>
                </div>
                <div style={{ marginBottom: '2px' }}>
                    <span style={{ display: 'inline-block', width: '130px' }}>Tên đơn vị:</span>
                    <span>{selectedHoaDonXuatKho.ma_kh || "KH006"}</span>
                </div>
                <div style={{ marginBottom: '2px' }}>
                    <span style={{ display: 'inline-block', width: '130px' }}>Địa chỉ:</span>
                    <span>{selectedHoaDonXuatKho.dia_chi || "hanoi"}</span>
                </div>
                <div style={{ marginBottom: '2px' }}>
                    <span style={{ display: 'inline-block', width: '130px' }}>Số tài khoản:</span>
                    <span>124124</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', width: '130px' }}>Hình thức thanh toán:</span>
                    <span style={{ marginRight: '50px' }}>MS:</span>
                    <div style={{ display: 'flex', gap: '1px' }}>
                        {[1, 2, 3, 4, 4].map((digit, i) => (
                            <div key={i} style={{
                                width: '14px',
                                height: '14px',
                                border: '1px solid black',
                                textAlign: 'center',
                                fontSize: '9px',
                                lineHeight: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {digit}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '1px', marginLeft: '10px' }}>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} style={{
                                width: '14px',
                                height: '14px',
                                border: '1px solid black',
                                textAlign: 'center',
                                fontSize: '9px'
                            }}>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Items table */}
            <table className="border-table" style={{ marginTop: '5px', fontSize: '11px' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '4px', textAlign: 'center', width: '30px' }}>STT</th>
                        <th style={{ padding: '4px', textAlign: 'center', width: '70px' }}>MÃ KHO</th>
                        <th style={{ padding: '4px', textAlign: 'center', width: '50px' }}>MÃ VT</th>
                        <th style={{ padding: '4px', textAlign: 'center' }}>TÊN VT</th>
                        <th style={{ padding: '4px', textAlign: 'center', width: '40px' }}>ĐVT</th>
                        <th style={{ padding: '4px', textAlign: 'center', width: '80px' }}>SỐ LƯỢNG</th>
                        <th style={{ padding: '4px', textAlign: 'center', width: '60px' }}>ĐƠN GIÁ</th>
                        <th style={{ padding: '4px', textAlign: 'center', width: '80px' }}>THÀNH TIỀN</th>
                    </tr>
                </thead>
                <tbody>
                    {hangHoaData.map((item, index) => (
                        <tr key={index}>
                            <td style={{ padding: '4px', textAlign: 'center' }}>{index + 1}</td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>{item.ma_kho_i || ''}</td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>{item.tk_vt || ''}</td>
                            <td style={{ padding: '4px', textAlign: 'left' }}>{item.ten_vt || ''}</td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>{item.dvt || ''}</td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>{formatCurrency(item.so_luong) || ''}</td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>{formatCurrency(item.gia) || ''}</td>
                            <td style={{ padding: '4px', textAlign: 'right' }}>{formatCurrency(item.tien) || ''}</td>
                        </tr>
                    ))}

                    {/* Empty rows */}
                    {Array.from({ length: 4 }).map((_, index) => (
                        <tr key={`empty-${index}`}>
                            <td style={{ padding: '8px', textAlign: 'center' }}></td>
                            <td style={{ padding: '8px', textAlign: 'center' }}></td>
                            <td style={{ padding: '8px', textAlign: 'center' }}></td>
                            <td style={{ padding: '8px', textAlign: 'left' }}></td>
                            <td style={{ padding: '8px', textAlign: 'center' }}></td>
                            <td style={{ padding: '8px', textAlign: 'right' }}></td>
                            <td style={{ padding: '8px', textAlign: 'right' }}></td>
                            <td style={{ padding: '8px', textAlign: 'right' }}></td>
                        </tr>
                    ))}

                    {/* Summary section như cách tham khảo */}
                    <tr>
                        <td colSpan="7" style={{ border: '1px solid black', fontWeight: 'bold', fontSize: '11px', textAlign: 'right' }}>
                            CỘNG TIỀN HÀNG:
                        </td>
                        <td style={{ border: '1px solid black', fontWeight: 'bold', fontSize: '11px', textAlign: 'right' }}>
                            {formatCurrency(selectedHoaDonXuatKho.t_tien) || '172'}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="5" style={{ border: '1px solid black', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', borderRight: 'none' }}>
                            THUẾ SUẤT GTGT: {(selectedHoaDonXuatKho.thue_suat || 10).toFixed(2)}%
                        </td>
                        <td colSpan="2" style={{ border: '1px solid black', fontSize: '11px', fontWeight: 'bold', borderLeft: 'none' }}>
                            TIỀN THUẾ GTGT:
                        </td>
                        <td style={{ border: '1px solid black', fontSize: '11px', textAlign: 'right' }}>
                            {formatCurrency(selectedHoaDonXuatKho.t_thue) || '16'}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="7" style={{ border: '1px solid black', fontWeight: 'bold', fontSize: '11px', textAlign: 'right' }}>
                            TỔNG CỘNG TIỀN THANH TOÁN:
                        </td>
                        <td style={{ border: '1px solid black', fontWeight: 'bold', fontSize: '11px', textAlign: 'right' }}>
                            {formatCurrency(selectedHoaDonXuatKho.t_tt) || '172'}
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Số tiền bằng chữ */}
            <div style={{ textAlign: 'right', fontSize: '11px', fontStyle: 'italic', marginTop: '5px' }}>
                Số tiền (viết bằng chữ): {convertToWords(selectedHoaDonXuatKho.t_tt_nt)} {selectedHoaDonXuatKho.ma_nt || "đồng"}
            </div>

            {/* Signatures */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '40px',
                fontSize: '11px',
                textAlign: 'center'
            }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>NGƯỜI MUA HÀNG</div>
                    <div style={{ fontSize: '10px' }}>(Ký, họ tên)</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>NGƯỜI BÁN HÀNG</div>
                    <div style={{ fontSize: '10px' }}>(Ký, họ tên)</div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>GIÁM ĐỐC</div>
                    <div style={{ fontSize: '10px' }}>(Ký, họ tên)</div>
                </div>
            </div>
        </div>
    );
});

HoaDonXuatKhoPrintTemplate.displayName = 'HoaDonXuatKhoPrintTemplate';

export default HoaDonXuatKhoPrintTemplate;