import React from 'react';
import numToWords from 'vn-num2words';

const HoaDonDichVuPrintTemplate = React.forwardRef(({
    hoaDonData = {},
    dichVuData = [],
}, ref) => {
    const formatDate = (dateString) => {
        if (!dateString) return "26 THÁNG 07 NĂM 2025";
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

    const actualDichVu = dichVuData && dichVuData.length > 0 ? dichVuData : [];

    return (
        <div ref={ref} className="bg-white text-black" style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '15mm',
            margin: '0 auto',
            fontSize: '12px',
            lineHeight: '1.3',
            fontFamily: 'Arial, sans-serif'
        }}>
            <style jsx>{`
                @media print {
                    body { margin: 0; }
                    .print-container { 
                        width: 210mm !important;
                        height: 297mm !important;
                        padding: 15mm !important;
                        margin: 0 !important;
                    }
                    .no-print { display: none !important; }
                }
                table { border-collapse: collapse; }
                th, td { border: 1px solid black; }
            `}</style>

            {/* Header */}
            <div className="text-left mb-6">
                <div style={{ fontSize: '10px', lineHeight: '1.2' }} className="mb-4">
                    Công ty cổ phần công nghệ Gentech<br />
                    Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>

                <div className="text-center mb-6">
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>
                        HÓA ĐƠN DỊCH VỤ
                    </h1>
                    <div>NGÀY {formatDate(hoaDonData.ngay_ct)}</div>
                    <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'end', marginTop: '-30px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div>Ký hiệu: {hoaDonData.ma_ct || "KK01-N"}</div>
                            <div>Số: {hoaDonData.so_ct || "1"}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div className="mb-4" style={{ fontSize: '11px' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 0', width: '120px' }}>Họ tên người mua:</td>
                            <td style={{ border: 'none', padding: '2px 0' }}>{hoaDonData.ong_ba}</td>
                        </tr>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 0' }}>Đơn vị:</td>
                            <td style={{ border: 'none', padding: '2px 0' }}>{hoaDonData.ma_kh} - {hoaDonData.ten_kh}</td>
                        </tr>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 0' }}>Địa chỉ:</td>
                            <td style={{ border: 'none', padding: '2px 0' }}>{hoaDonData.dia_chi || "hanoi"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 0' }}>Tk nợ:</td>
                            <td style={{ border: 'none', padding: '2px 0' }}>{hoaDonData.ma_nx}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Items Table */}
            <div className="mb-1">
                <table style={{ width: '100%', fontSize: '11px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F0FFF0' }}>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '30px' }}>STT</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center' }}>NỘI DUNG</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '50px' }}>TK CÓ</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '40px' }}>ĐVT</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '80px' }}>SỐ LƯỢNG</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '60px' }}>ĐƠN GIÁ</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '90px' }}>THÀNH TIỀN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actualDichVu.map((item, index) => {
                            const isChietKhau = item.ten_vt === "Chiết khấu" || item.dien_giai === "Chiết khấu";
                            console.log(item);
                            return (
                                <tr key={index}>
                                    <td style={{ padding: '4px', textAlign: 'center' }}>
                                        {isChietKhau ? "" : (index + 1)}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'left' }}>
                                        {item.dien_giaii}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'center' }}>
                                        {item.tk_dt}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'center' }}>
                                        {item.dvt}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'right' }}>
                                        {item.so_luong}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'right' }}>
                                        {isChietKhau ? "" : (formatCurrency(item.gia_nt2) || "13.00")}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'right' }}>
                                        {formatCurrency(item.tien2)}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Thêm dòng trống */}
                        {Array.from({ length: 3 }).map((_, index) => (
                            <tr key={`empty-${index}`} style={{ height: '25px' }}>
                                <td style={{ padding: '4px' }}></td>
                                <td style={{ padding: '4px' }}></td>
                                <td style={{ padding: '4px' }}></td>
                                <td style={{ padding: '4px' }}></td>
                                <td style={{ padding: '4px' }}></td>
                                <td style={{ padding: '4px' }}></td>
                                <td style={{ padding: '4px' }}></td>
                            </tr>
                        ))}
                        <tr>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }} colSpan="6">
                                CHIẾT KHẨU :
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(hoaDonData.t_ck) || "147"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }} colSpan="6">
                                CỘNG TIỀN HÀNG :
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(hoaDonData.t_tien_nt2) || "15"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }} colSpan="6">
                                TIỀN THUẾ GTGT:
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(hoaDonData.t_thue) || "15"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }} colSpan="6">
                                TỔNG TIỀN THANH TOÁN :
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(hoaDonData.t_tt_nt) || "15"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{
                fontSize: '11px',
                textAlign: 'right',
                margin: '0',
                padding: '2px 0',
                fontStyle: 'italic'
            }}>
                <span style={{ fontWeight: 'bold' }}>Số tiền (viết bằng chữ):</span>&nbsp;
                {convertToWords(hoaDonData.t_tt_nt)} {hoaDonData.ma_nt || "đồng"}
            </div>
            {/* Signatures */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '40px',
                textAlign: 'center',
                marginTop: '40px',
                fontSize: '11px'
            }}>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>NGƯỜI MUA HÀNG</div>
                    <div style={{ fontSize: '10px', marginBottom: '60px' }}>(Ký, họ tên)</div>
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>KẾ TOÁN TRƯỞNG</div>
                    <div style={{ fontSize: '10px', marginBottom: '60px' }}>(Ký, họ tên)</div>
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>GIÁM ĐỐC</div>
                    <div style={{ fontSize: '10px', marginBottom: '60px' }}>(Ký, họ tên)</div>
                </div>
            </div>
        </div>
    );
});

HoaDonDichVuPrintTemplate.displayName = 'HoaDonDichVuPrintTemplate';

export default HoaDonDichVuPrintTemplate;