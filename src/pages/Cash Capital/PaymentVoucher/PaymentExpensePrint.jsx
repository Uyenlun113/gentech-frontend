import React from 'react';
import numToWords from 'vn-num2words';

const PaymentExpensePrint = React.forwardRef(({ phieuData, hachToanData, totalAmount }, ref) => {
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

  const dateInfo = formatDateForHeader(phieuData?.ngay_lct || phieuData?.ngay_ct);

  return (
    <div ref={ref} className="bg-white p-4 font-sans text-xs">
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            .print-container { 
              width: 210mm; 
              height: auto; 
              margin: 0; 
              padding: 10mm;
              font-size: 10px;
              line-height: 1.2;
            }
            .compact-row {
              margin-bottom: 4px !important;
            }
            .signature-section {
              margin-top: 15px !important;
            }
          }
        `}
      </style>

      <div className="print-container max-w-4xl mx-auto border border-gray-300">
        {/* Header */}
        <div className="mb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 text-xs">
              <div className="font-medium">CÔNG TY CỔ PHẦN CÔNG NGHỆ GENTECH</div>
              <div className="text-xs">Tầng 02 CT3 Nghĩa Đô , Cổ Nhuế , TP Hà Nội</div>
            </div>
            <div className="text-right text-xs">
              <div className="text-center">Mã số thuế:</div>
              <div className="font-bold text-center">Mẫu số: 02-TT</div>
              <div className="text-xs">(Ban hành theo Thông tư số 133/2016/TT-BTC</div>
              <div className="text-xs">ngày 26/8/2016 của Bộ Tài chính)</div>
            </div>
          </div>

          <div className="flex justify-between items-start mb-3">
            {/* Center title and date */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold mb-1">PHIẾU CHI</h1>
              <div className="text-sm">
                NGÀY {dateInfo.day} THÁNG {dateInfo.month} NĂM {dateInfo.year}
              </div>
            </div>

            {/* Cột phải: liên số, quyển số, số phiếu, nợ, có */}
            <div className="text-xs text-left ml-4 mt-4">
              <div className="mb-1 flex">
                <span className="w-20">Liên số:</span>
                <span>{phieuData?.lien_so || '1'}</span>
              </div>
              <div className="mb-1 flex">
                <span className="w-20">Quyển số:</span>
                <span>{phieuData?.ma_qs || 'PC001'}</span>
              </div>
              <div className="mb-1 flex">
                <span className="w-20">Số phiếu:</span>
                <span>{phieuData?.so_ct || phieuData?.ma_ct || ''}</span>
              </div>
              <div className="mb-1 flex">
                <span className="w-20">Nợ:</span>
                <span className="w-14">{hachToanData?.[0]?.tk_i || '6422'}</span>
                <span>{formatCurrency(hachToanData?.[0]?.tien || phieuData?.t_tien || 0)}</span>
              </div>
              <div className="flex">
                <span className="w-20">Có:</span>
                <span className="w-14">{phieuData?.tk || '1111'}</span>
                <span>{formatCurrency(totalAmount || phieuData?.t_tien || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Info */}
        <div className="mb-4 w-[400px]">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 space-y-1">
              <div className="flex compact-row" style={{ marginTop: '-65px' }}>
                <span className="w-28 text-xs">Họ và tên người nhận tiền:</span>
                <span className="flex-1 px-1 text-xs">
                  {phieuData?.ong_ba || phieuData?.ma_kh || ''}
                </span>
              </div>
              <div className="flex compact-row">
                <span className="w-28 text-xs">Địa chỉ:</span>
                <span className="flex-1 px-1 text-xs">
                  {phieuData?.dia_chi || 'Tầng 2 tòa nhà Cung Trí Thức số 1 Tôn Thất Thuyết'}
                </span>
              </div>
              <div className="flex compact-row">
                <span className="w-28 text-xs">Lý do chi:</span>
                <span className="flex-1 px-1 text-xs">
                  {phieuData?.dien_giai || hachToanData?.[0]?.dien_giai || 'Thanh toán chi phí gửi xe tại Cung trí thức Thánh phố Tháng 08/2025'}
                </span>
              </div>
              <div className="flex compact-row">
                <span className="w-28 text-xs">Số tiền:</span>
                <span className="flex-1 px-1 text-xs font-bold">
                  {formatCurrency(phieuData?.t_tt_nt)} {phieuData?.ma_nt || 'VND'}
                </span>
              </div>
              <div className="flex compact-row">
                <span className="w-28 text-xs">Bằng chữ:</span>
                <span className="flex-1 px-1 text-xs">
                  {numToWords(phieuData?.t_tt_nt || 0) + ' đồng'}
                </span>
              </div>
              <div className="flex compact-row">
                <span className="w-28 text-xs">Kèm theo:</span>
                <span className="flex-1 px-1 text-xs">
                  0 chứng từ gốc
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="signature-section">
          <div className="flex justify-end mb-2">
            <span className="text-xs">Ngày.....tháng.....năm.......</span>
          </div>

          <div className="flex justify-between mt-4">
            {[
              { label: 'CHỦ TÀI KHOẢN' },
              { label: 'PHỤ TRÁCH KẾ TOÁN' },
              { label: 'THỦ QUỸ' },
              { label: 'NGƯỜI LẬP PHIẾU' },
              { label: 'NGƯỜI NHẬN TIỀN' },
            ].map((item, index) => (
              <div key={index} className="text-center flex-1">
                <div className="font-bold mb-1 text-xs">{item.label}</div>
                <div className="text-xs mb-8">(Ký, họ tên{item.label === 'CHỦ TÀI KHOẢN' ? ', đóng dấu' : ''})</div>
                <div className="border-b border-dotted border-gray-400 w-24 mx-auto mb-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-4 pt-2 text-xs">
          <div className="flex items-start gap-1">
            <span className="whitespace-nowrap">Đã nhận đủ số tiền (viết bằng chữ):</span>
            <span className="border-b border-dotted border-gray-400 flex-1 h-[20px]"></span>
          </div>
          <div className="mt-1 border-b border-dotted border-gray-400 h-[20px]"></div>
        </div>
      </div>
    </div>
  );
});

PaymentExpensePrint.displayName = 'PaymentExpensePrint';

export default PaymentExpensePrint;
