import React from 'react';

const DonBanHangPrintTemplate = React.forwardRef(({
    donHangData = {},
    hangHoaData = [],
}, ref) => {
    const formatDate = (dateString) => {
        if (!dateString) return "28 THÁNG 07 NĂM 2025";
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

    // Sample data nếu không có dữ liệu
    const sampleHangHoa = hangHoaData.length > 0 ? hangHoaData : [
        {
            ma_kho: "I2",
            ma_vt: "VT005",
            ten_vt: "vải tu 2",
            dvt: "kg",
            so_luong: 15000,
            gia_nt: "",
            tien_nt: ""
        },
        {
            ma_vt: "Chiết khấu",
            ten_vt: "Chiết khấu",
            dien_giai: "Chiết khấu"
        }
    ];

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
                th, td { 
                    border: 1px solid black; 
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>

            {/* Header */}
            <div className="text-left mb-6">
                <div style={{ fontSize: '10px', lineHeight: '1.2', whiteSpace: 'nowrap' }}>
                    Công ty cổ phần công nghệ Gentech
                </div>
                <div style={{ fontSize: '10px', lineHeight: '1.2', whiteSpace: 'nowrap' }} className="mb-4 mt-1">
                    Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>

                <div className="text-center mb-6">
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0' }}>
                        ĐƠN HÀNG BÁN
                    </h1>
                    <div style={{ fontSize: '12px' }}>
                        <div>SỐ ĐƠN HÀNG: {donHangData.so_ct || "1"}</div>
                        <div>NGÀY {formatDate(donHangData.ngay_lct || donHangData.ngay_ct)}</div>
                    </div>
                </div>
            </div>

            {/* Customer Information */}
            <div className="mb-4" style={{ fontSize: '12px' }}>
                <table style={{ width: '100%', marginBottom: '15px' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 2px', width: '150px', whiteSpace: 'nowrap' }}>Mã khách : </td>
                            <td style={{ border: 'none', padding: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{donHangData.ma_kh || "KH006-fdsgsdg"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 2px', whiteSpace: 'nowrap' }}>Họ tên người mua hàng : </td>
                            <td style={{ border: 'none', padding: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{donHangData.ten_kh || "pham thi uyển"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 0', whiteSpace: 'nowrap' }}>Địa chỉ : </td>
                            <td style={{ border: 'none', padding: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{donHangData.dia_chi || "hanoi"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 0', whiteSpace: 'nowrap' }}>Diễn giải : </td>
                            <td style={{ border: 'none', padding: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{donHangData.dien_giai || "pham thi uyển"}</td>
                        </tr>
                        <tr>
                            <td style={{ border: 'none', padding: '2px 0', whiteSpace: 'nowrap' }}>Bộ phận kinh doanh : </td>
                            <td style={{ border: 'none', padding: '2px 0' }}>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Items Table */}
            <div className="mb-6">
                <table style={{ width: '100%', fontSize: '12px', tableLayout: 'fixed' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '40px' }}>STT</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '60px' }}>MÃ KHO</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '80px' }}>MÃ VẬT TƯ</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center' }}>TÊN VẬT TƯ</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '40px' }}>ĐVT</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '80px' }}>SỐ LƯỢNG</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '80px' }}>ĐƠN GIÁ</th>
                            <th style={{ padding: '6px 4px', textAlign: 'center', width: '90px' }}>THÀNH TIỀN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleHangHoa.map((item, index) => {
                            const isChietKhau = item.ma_vt === "Chiết khấu" || item.ten_vt === "Chiết khấu" || item.dien_giai === "Chiết khấu";

                            return (
                                <tr key={index}>
                                    <td style={{ padding: '4px', textAlign: 'center' }}>
                                        {isChietKhau ? "" : (index + 1)}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'center' }}>
                                        {isChietKhau ? "" : (item.ma_kho || "I2")}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'center' }}>
                                        {isChietKhau ? "" : (item.ma_vt || "VT005")}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'left' }}>
                                        {isChietKhau ? "Chiết khấu" : (item.ten_vt || "vải tu 2")}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'center' }}>
                                        {isChietKhau ? "" : (item.dvt || "kg")}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'right' }}>
                                        {isChietKhau ? "" : (item.so_luong ? formatCurrency(item.so_luong) : "15,000")}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'right' }}>
                                        {formatCurrency(item.gia_nt) || ""}
                                    </td>
                                    <td style={{ padding: '4px', textAlign: 'right' }}>
                                        {formatCurrency(item.tien_nt2 || item.tien_nt) || ""}
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Thêm các dòng trống để đủ chiều cao */}
                        {Array.from({ length: Math.max(0, 2) }).map((_, index) => (
                            <tr key={`empty-${index}`} style={{ height: '25px' }}>
                                <td style={{ padding: '4px' }}></td>
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
                            }} colSpan="7">
                                CHIẾT KHẨU :
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(donHangData.t_ck) || "147"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }} colSpan="7">
                                CỘNG TIỀN HÀNG :
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(donHangData.t_tien_nt2) || "15"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }} colSpan="7">
                                TIỀN THUẾ GTGT:
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(donHangData.t_thue) || "15"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black',
                            }} colSpan="7">
                                TỔNG TIỀN THANH TOÁN :
                            </td>
                            <td style={{
                                padding: '6px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                borderLeft: '1px solid black',
                                borderRight: '1px solid black'
                            }}>
                                {formatCurrency(donHangData.t_tt_nt) || "15"}
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', whiteSpace: 'nowrap' }}>NGƯỜI LẬP PHIẾU</div>
                    <div style={{ fontSize: '10px', marginBottom: '60px' }}>(Ký, họ tên)</div>
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', whiteSpace: 'nowrap' }}>TRƯỞNG PHÒNG KINH DOANH</div>
                    <div style={{ fontSize: '10px', marginBottom: '60px' }}>(Ký, họ tên)</div>
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', whiteSpace: 'nowrap' }}>GIÁM ĐỐC</div>
                    <div style={{ fontSize: '10px', marginBottom: '60px' }}>(Ký, họ tên)</div>
                </div>
            </div>
        </div>
    );
});

DonBanHangPrintTemplate.displayName = 'DonBanHangPrintTemplate';

export default DonBanHangPrintTemplate;