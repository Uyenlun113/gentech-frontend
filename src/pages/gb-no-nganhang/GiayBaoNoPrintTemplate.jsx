import React from 'react';
import numToWords from 'vn-num2words';
const GiayBaoNoPrintTemplate = React.forwardRef(({ printData }, ref) => {
    const formatDate = (dateString) => {
        if (!dateString) return "30-07-2025";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const formatCurrency = (amount) => {
        if (!amount) return "0";
        return new Intl.NumberFormat("vi-VN").format(amount);
    };
    // Fallback values nếu printData không có
    const data = printData || {};

    return (
        <div ref={ref} className="bg-white text-black" style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '15mm',
            margin: '0 auto',
            fontSize: '11px',
            lineHeight: '1.4',
            fontFamily: 'Arial, sans-serif',
            position: 'relative'
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
            `}</style>

            {/* Main container with border */}
            <div style={{ border: '1px solid black', minHeight: '250mm' }}>
                {/* Header with BIDV logo and title */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                    {/* BIDV Logo */}
                    <div style={{ width: '120px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                        <img src="/images/logo/logo-bidv1.webp" alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </div>

                    {/* Title */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
                            ỦY NHIỆM CHI
                        </h1>
                        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                            PAYMENT ORDER
                        </h2>
                    </div>

                    {/* Seq No and Date */}
                    <div style={{ textAlign: 'right', fontSize: '11px', width: '120px' }}>
                        <div style={{ marginBottom: '5px' }}>
                            <strong>Số/ Seq No:</strong> {data.seqNo || 'BN00002'}
                        </div>
                        <div>
                            <strong>Ngày/ Date:</strong> {formatDate(data.ngay)}
                        </div>
                    </div>
                </div>

                {/* Main content in 2 columns with border separator */}
                <div style={{ display: 'flex', border: '1px solid black', borderRight: 'none', borderLeft: 'none' }}>
                    {/* Left Column */}
                    <div style={{ flex: 1, padding: '10px', borderRight: '1px solid black', borderLeft: 'none' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Tên TK trích nợ/ Dr A/C Name:</strong><br />
                            <span style={{ fontWeight: 'bold' }}>Công ty cổ phần công nghệ Gentech</span>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Số TK trích nợ/ Dr A/C No:</strong> {data?.taiKhoan}
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Tại NH/ At bank:</strong>{data?.tenNganHang}
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Chi nhánh/ Branch:</strong>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div style={{ flex: 1, padding: '10px', borderRight: 'none', }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Người thụ hưởng/ Beneficiary:</strong> {data.tenDonViNhanTien || 'fdsgsdg'}
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Số CMND/HC/ ID/PP:</strong> ............. <strong>Ngày cấp/ Date:</strong> ...../...../.......
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Nơi cấp/ Place:</strong> .......................
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Số tài khoản/ Acct No:</strong> {data.soTaiKhoan || '124124'}
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <strong>Tại NH/ At bank:</strong> {data.taiNganHang || 'uyenlun'}
                        </div>
                    </div>
                </div>

                {/* Amount in words - full width with border */}
                <div style={{ padding: '10px', display: 'flex', gap: '90px' }}>
                    <div>
                        <strong>Số tiền bằng số/ Amount in figures:</strong> {formatCurrency(data.soTienBangSo) || '10.000'} {data.donVi || 'VND'}
                    </div>
                    <div>  <strong>Số tiền bằng chữ/ Amount in words:</strong> {numToWords(data?.soTienBangSo) || 'Mười nghìn'} {'đồng'}</div>
                </div>

                {/* Second section - 2 columns with border */}
                <div style={{
                    display: 'flex', marginBottom: '20px', borderTop: '1px solid black',
                    borderBottom: '1px solid black',
                }}>
                    <div style={{ width: '70%', padding: '10px', borderRight: '1px solid black' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Đề nghị NH quy đổi ra loại tiền/ Request for changing into:</strong> {data.deNghiNhQuyDoi || '.......'}
                            <strong> Tỷ giá/ Ex rate:</strong> 1.00
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Nội dung/ Remarks:</strong> {data.noiDungThanhToan || data.noiDung || 'Pham Thi Uyển'}
                        </div>
                    </div>

                    <div style={{ width: '30%', padding: '10px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Phí ngân hàng/ Charges:</strong>
                            <div style={{ marginTop: '5px' }}>
                                <label style={{ display: 'block', marginBottom: '3px' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.phiTrong}
                                        readOnly
                                        style={{ marginRight: '5px' }}
                                    />
                                    Phí trong/ Charge included
                                </label>
                                <label style={{ display: 'block' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.phiNgoai}
                                        readOnly
                                        style={{ marginRight: '5px' }}
                                    />
                                    Phí ngoài/ Charge excluded
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    position: 'absolute',
                    left: '30px',
                    top: '40%',
                    transform: 'rotate(-90deg)',
                    transformOrigin: 'center',
                    fontSize: '10px',
                }}>
                    PHẦN DÀNH CHO<br />
                    NGÂN HÀNG
                </div>

                {/* Bottom section with signatures */}
                <div style={{ marginTop: '110px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid black', paddingTop: '10px' }}>
                    <div style={{ textAlign: 'center', width: '55%' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            KHÁCH HÀNG/ CUSTOMER
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '10px', marginBottom: '20px' }}>
                                Kế toán trưởng/ Chief Accountant<br />
                                (Ký và ghi rõ họ tên/Signature & full name)
                            </div>
                            <div style={{ fontSize: '10px', marginBottom: '50px' }}>
                                Chủ tài khoản/ Account Holder<br />
                                (Ký và ghi rõ họ tên/Signature & full name)
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', width: '45%' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                            NGÂN HÀNG/ BANK SENDER (BIDV)
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '50px' }}>
                            <div style={{ textAlign: 'center' }}>
                                Giao dịch viên/ Received by<br />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                Kiểm soát/ Verified by<br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

GiayBaoNoPrintTemplate.displayName = 'GiayBaoNoPrintTemplate';

export default GiayBaoNoPrintTemplate;