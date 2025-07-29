import React from 'react';
import numToWords from 'vn-num2words';

const PrintableGeneralLedger = React.forwardRef(({ data, subData }, ref) => {
    const formatCurrency = (amount) => {
        if (!amount) return "0";
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    const formatDateForHeader = (dateString) => {
        if (!dateString) return { day: "", month: "", year: "" };
        const date = new Date(dateString);
        return {
            day: date.getDate().toString().padStart(2, '0'),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            year: date.getFullYear().toString()
        };
    };

    // Tính tổng PS Nợ và PS Có từ hachToan data
    const totalPsNo = subData?.reduce((sum, item) => sum + (parseFloat(item.ps_no) || 0), 0) || 0;
    const totalPsCo = subData?.reduce((sum, item) => sum + (parseFloat(item.ps_co) || 0), 0) || 0;

    // Dữ liệu phiếu từ API response
    const phieuData = data || {};
    const hachToanData = subData || [];
    const dateInfo = formatDateForHeader(phieuData?.ngay_lct);

    return (
        <div ref={ref} className="print-container" style={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            lineHeight: '1.2',
            color: '#000',
            backgroundColor: '#fff',
            padding: '20px',
            width: '210mm',
            minHeight: '297mm'
        }}>
            <style>
                {`
          @media print {
            .print-container {
              padding: 10mm;
              margin: 0;
              width: 100%;
              min-height: 100vh;
              font-size: 11px;
            }
            
            table {
              border-collapse: collapse !important;
              width: 100% !important;
            }
            
            th, td {
              border: 1px solid #000 !important;
              padding: 4px !important;
              font-size: 10px !important;
            }
            
            .no-print {
              display: none !important;
            }
          }
        `}
            </style>

            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <div style={{ textAlign: 'left', fontSize: '11px', marginBottom: '5px' }}>
                    Công ty cổ phần công nghệ Gentech
                </div>
                <div style={{ textAlign: 'left', fontSize: '11px', marginBottom: '20px' }}>
                    Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP.Hà Nội
                </div>

                <h2 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: '20px 0 10px 0',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                }}>
                    PHIẾU KẾ TOÁN TỔNG HỢP
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    fontSize: '11px'
                }}>
                    <div style={{ textAlign: 'center', flex: 1, paddingLeft: '40px' }}>
                        NGÀY {dateInfo.day} THÁNG {dateInfo.month} NĂM {dateInfo.year}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div>Số phiếu: {phieuData.so_ct?.trim() || 'PK00003'}</div>
                        <div>Liên số: 1</div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #000',
                marginBottom: '20px'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            width: '25%'
                        }}>
                            NỘI DUNG
                        </th>
                        <th style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            width: '15%'
                        }}>
                            MÃ DỰ ÁN
                        </th>
                        <th style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            width: '15%'
                        }}>
                            TÀI KHOẢN
                        </th>
                        <th style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            width: '22.5%'
                        }}>
                            PS NỢ
                        </th>
                        <th style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            width: '22.5%'
                        }}>
                            PS CÓ
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {hachToanData && hachToanData.length > 0 ? (
                        hachToanData.map((item, index) => {
                            console.log(`Row ${index}:`, item); // Debug log
                            return (
                                <tr key={index}>
                                    <td style={{
                                        border: '1px solid #000',
                                        padding: '6px',
                                        textAlign: 'left'
                                    }}>
                                        {item.dien_giaii?.trim() || phieuData.dien_giai?.trim() || 'Nhập khác'}
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        padding: '6px',
                                        textAlign: 'center'
                                    }}>
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        padding: '6px',
                                        textAlign: 'center'
                                    }}>
                                        {item.tk_i?.trim() || ''}
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        padding: '6px',
                                        textAlign: 'right'
                                    }}>
                                        {item.ps_no ? formatCurrency(item.ps_no) : ''}
                                    </td>
                                    <td style={{
                                        border: '1px solid #000',
                                        padding: '6px',
                                        textAlign: 'right'
                                    }}>
                                        {item.ps_co ? formatCurrency(item.ps_co) : ''}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        // Hiển thị dữ liệu mẫu như trong hình
                        <>
                            <tr>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'left'
                                }}>
                                    {phieuData.dien_giai?.trim() || 'Nhập khác'}
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'center'
                                }}>
                                    {/* Để trống như trong hình */}
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'center'
                                }}>
                                    1111
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'right'
                                }}>
                                    1.000.000
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'right'
                                }}>
                                    {/* Để trống */}
                                </td>
                            </tr>
                            <tr>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'left'
                                }}>
                                    {phieuData.dien_giai?.trim() || 'Nhập khác'}
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'center'
                                }}>
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'center'
                                }}>
                                    6422
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'right'
                                }}>
                                </td>
                                <td style={{
                                    border: '1px solid #000',
                                    padding: '6px',
                                    textAlign: 'right'
                                }}>
                                    1.000.000
                                </td>
                            </tr>
                        </>
                    )}

                    {/* Thêm các dòng trống để đủ 10 dòng như trong form */}
                    {Array.from({ length: Math.max(0, 10 - (hachToanData?.length || 2)) }).map((_, index) => (
                        <tr key={`empty-${index}`}>
                            <td style={{
                                border: '1px solid #000',
                                padding: '6px',
                                height: '25px'
                            }}>&nbsp;</td>
                            <td style={{
                                border: '1px solid #000',
                                padding: '6px'
                            }}>&nbsp;</td>
                            <td style={{
                                border: '1px solid #000',
                                padding: '6px'
                            }}>&nbsp;</td>
                            <td style={{
                                border: '1px solid #000',
                                padding: '6px'
                            }}>&nbsp;</td>
                            <td style={{
                                border: '1px solid #000',
                                padding: '6px'
                            }}>&nbsp;</td>
                        </tr>
                    ))}

                    {/* Dòng tổng cộng */}
                    <tr style={{ fontWeight: 'bold' }}>
                        <td colSpan="3" style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                            TỔNG CỘNG:
                        </td>
                        <td style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'right',
                            fontWeight: 'bold'
                        }}>
                            {formatCurrency(totalPsNo || 1000000)}
                        </td>
                        <td style={{
                            border: '1px solid #000',
                            padding: '8px',
                            textAlign: 'right',
                            fontWeight: 'bold'
                        }}>
                            {formatCurrency(totalPsCo || 1000000)}
                        </td>
                    </tr>
                </tbody>
            </table>


            <div style={{
                fontSize: '11px',
                fontStyle: 'italic',
                textAlign: 'right',
                marginBottom: '40px'
            }}>
                <em>Số tiền (viết bằng chữ): {numToWords(Math.max(totalPsNo, totalPsCo) || 1000000) + ' đồng chẵn'}</em>
            </div>

            {/* Signature Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '40px',
                fontSize: '11px'
            }}>
                <div style={{ textAlign: 'center', width: '45%' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '40px' }}>NGƯỜI LẬP PHIẾU</div>
                    <div>(Ký, họ tên)</div>
                </div>

                <div style={{ textAlign: 'center', width: '45%' }}>
                    <div style={{ marginBottom: '10px' }}>
                        Ngày ..... tháng ..... năm .........
                    </div>
                    <div style={{ fontWeight: 'bold', marginBottom: '50px' }}>
                        PHỤ TRÁCH KẾ TOÁN
                    </div>
                    <div>(Ký, họ tên)</div>
                </div>
            </div>
        </div>
    );
});

PrintableGeneralLedger.displayName = 'PrintableGeneralLedger';

export default PrintableGeneralLedger;