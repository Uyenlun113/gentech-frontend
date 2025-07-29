// File: PaymentVoucherChiPrint.jsx
import React from "react";

const PaymentVoucherChiPrint = React.forwardRef(({ phieuData, hachToanData }, ref) => {
  const formatCurrency = (amount) => {
    if (!amount) return "0";
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatDateForHeader = (dateString) => {
    if (!dateString) return { day: "", month: "", year: "" };
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: (date.getMonth() + 1).toString().padStart(2, "0"),
      year: date.getFullYear().toString(),
    };
  };

  const dateInfo = formatDateForHeader(phieuData?.ngay_lct || phieuData?.ngay_ct);

  // Tính tổng tiền từ hachToanData
  const totalAmount =
    hachToanData?.reduce((sum, item) => {
      return sum + (parseFloat(item.tien) || 0);
    }, 0) || 0;

  return (
    <div ref={ref} className="bg-white p-8 font-sans text-sm">
      <style>
        {`
          @media print {
            body { margin: 0; padding: 0; }
            .print-container { 
              width: 210mm; 
              height: 297mm; 
              margin: 0; 
              padding: 20mm;
              font-size: 12px;
            }
          }
        `}
      </style>

      <div className="print-container max-w-4xl mx-auto border border-gray-300 min-h-[297mm]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="text-sm">
                <div>Hội giáo dục chăm sóc sức khỏe cộng đồng Việt Nam (VACHE)</div>
                <div>Tầng 03 Số 1 Tôn Thất Thuyết, P Dịch Vọng, Q.Cầu Giấy, TP Hà Nội</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div>Mã số thuế:</div>
              <div className="font-bold">Mẫu số: 02-TT</div>
              <div className="text-xs">(Ban hành theo Thông tư số 133/2016/TT-BTC</div>
              <div className="text-xs">ngày 26/8/2016 của Bộ Tài chính)</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">PHIẾU CHI</h1>
            <div className="text-lg">
              NGÀY {dateInfo.day} THÁNG {dateInfo.month} NĂM {dateInfo.year}
            </div>
          </div>
        </div>

        {/* Voucher Info */}
        <div className="mb-6">
          <div className="flex justify-between mb-8">
            <div className="flex-1 space-y-2">
              <div className="flex">
                <span className="w-32">Họ và tên người nhận tiền:</span>
                <span className="flex-1 border-b border-dotted border-gray-400 px-2">
                  {phieuData?.ten_kh || phieuData?.ma_kh || ""}
                </span>
              </div>
              <div className="flex">
                <span className="w-32">Địa chỉ:</span>
                <span className="flex-1 border-b border-dotted border-gray-400 px-2">
                  {phieuData?.dia_chi || "Tầng 2 tòa nhà Cung Trí Thức số 1 Tôn Thất Thuyết"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32">Lý do chi:</span>
                <span className="flex-1 border-b border-dotted border-gray-400 px-2">
                  {phieuData?.dien_giai ||
                    hachToanData?.[0]?.dien_giai ||
                    "Thanh toán chi phí gửi xe tại Cung trí thức Thánh phố Tháng 08/2025"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32">Số tiền:</span>
                <span className="flex-1 border-b border-dotted border-gray-400 px-2 font-bold">
                  {formatCurrency(totalAmount)} {phieuData?.ma_nt || "VND"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32">Bằng chữ:</span>
                <span className="flex-1 border-b border-dotted border-gray-400 px-2">
                  {phieuData?.bang_chu || "Hai triệu, bốn trăm bốn mười nghìn đồng chẵn"}
                </span>
              </div>
              <div className="flex">
                <span className="w-32">Kèm theo:</span>
                <span className="flex-1 border-b border-dotted border-gray-400 px-2">
                  {phieuData?.kem_theo || "0 chứng từ gốc"}
                </span>
              </div>
            </div>

            <div className="ml-8 text-sm">
              <div className="mb-2">
                Liên số: <span className="ml-8">1</span>
              </div>
              <div className="mb-2">
                Quyển số: <span className="ml-4">{phieuData?.quyen_so || "PC001"}</span>
              </div>
              <div className="mb-2">
                Số phiếu: <span className="ml-4">{phieuData?.so_ct || phieuData?.ma_ct || ""}</span>
              </div>
              <div className="mb-2">
                Nợ: <span className="ml-8">{hachToanData?.[0]?.tk_i || "6422"}</span>
                <span className="ml-8">{formatCurrency(totalAmount)}</span>
              </div>
              <div>
                Có: <span className="ml-8">{phieuData?.tk_co || "1111"}</span>
                <span className="ml-8">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-16">
          <div className="flex justify-end mb-4">
            <span>Ngày.....tháng.....năm.......</span>
          </div>

          <div className="flex justify-between mt-8">
            <div className="text-center flex-1">
              <div className="font-bold mb-2">CHỦ TÀI KHOẢN</div>
              <div className="text-xs mb-16">(Ký, họ tên, đóng dấu)</div>
              <div className="border-b border-dotted border-gray-400 w-32 mx-auto mb-2"></div>
              <div className="text-sm">{phieuData?.chu_tk || ""}</div>
            </div>

            <div className="text-center flex-1">
              <div className="font-bold mb-2">PHỤ TRÁCH KẾ TOÁN</div>
              <div className="text-xs mb-16">(Ký, họ tên)</div>
              <div className="border-b border-dotted border-gray-400 w-32 mx-auto mb-2"></div>
              <div className="text-sm">{phieuData?.ke_toan || ""}</div>
            </div>

            <div className="text-center flex-1">
              <div className="font-bold mb-2">THỦ QUỸ</div>
              <div className="text-xs mb-16">(Ký, họ tên)</div>
              <div className="border-b border-dotted border-gray-400 w-32 mx-auto mb-2"></div>
              <div className="text-sm">{phieuData?.thu_quy || "Nguyễn Thị Phương"}</div>
            </div>

            <div className="text-center flex-1">
              <div className="font-bold mb-2">NGƯỜI LẬP PHIẾU</div>
              <div className="text-xs mb-16">(Ký, họ tên)</div>
              <div className="border-b border-dotted border-gray-400 w-32 mx-auto mb-2"></div>
              <div className="text-sm">{phieuData?.nguoi_lap || "Ngô Thị Nhung"}</div>
            </div>

            <div className="text-center flex-1">
              <div className="font-bold mb-2">NGƯỜI NHẬN TIỀN</div>
              <div className="text-xs mb-16">(Ký, họ tên)</div>
              <div className="border-b border-dotted border-gray-400 w-32 mx-auto mb-2"></div>
              <div className="text-sm">{phieuData?.ten_kh || phieuData?.ma_kh || ""}</div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 border-t border-gray-300 pt-4">
          <div className="text-xs">
            Đã nhận đủ số tiền (viết bằng chữ):
            <span className="border-b border-dotted border-gray-400 ml-2 pb-1 inline-block w-full">
              ................................................................................................................................
            </span>
          </div>
          <div className="mt-2 text-xs border-b border-dotted border-gray-400 pb-1">
            ....................................................................................................................................................................................
          </div>
        </div>
      </div>
    </div>
  );
});

PaymentVoucherChiPrint.displayName = "PaymentVoucherChiPrint";

export default PaymentVoucherChiPrint;
