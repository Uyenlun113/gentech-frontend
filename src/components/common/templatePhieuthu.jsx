import React, { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const CashReceiptPrint = ({ isOpen, onClose, data }) => {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Phiếu_thu_${data?.so_ct || 'PT001'}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            📄 In phiếu thu - {data?.so_ct || 'PT001'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              🖨️ In
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              ❌ Đóng
            </button>
          </div>
        </div>

        {/* Print Content Preview */}
        <div className="p-6 bg-gray-100">
          <div className="max-w-[210mm] mx-auto bg-white shadow-lg">
            <PrintContent ref={printRef} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component nội dung in - sử dụng data thật từ phiếu thu
const PrintContent = forwardRef(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[210mm] min-h-[148mm] p-6 text-sm text-black bg-white"
      style={{ fontFamily: 'Times New Roman, serif' }}
    >
      {/* Header với thông tin tổ chức và mã số thuế */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="text-sm">Hội giáo dục chăm sóc sức khỏe cộng đồng Việt Nam (VACHE)</div>
          <div className="text-sm">Tầng 03 Số 1 Tôn Thất Thuyết, P.Dịch Vọng, Q.Cầu Giấy, TP.Hà Nội</div>
        </div>
        <div className="text-right text-xs border border-black p-2">
          <div>Mã số thuế: {data?.MST || ""}</div>
          <div><strong>Mẫu số: 01-TT</strong></div>
          <div>(Ban hành theo Thông tư số 133/2016/TT-BTC<br />ngày 26/8/2016 của Bộ Tài chính)</div>
        </div>
      </div>

      {/* Tiêu đề phiếu thu */}
      <h2 className="text-center font-bold text-xl mt-4 mb-2">PHIẾU THU</h2>
      <div className="text-center text-sm mb-6">
        NGÀY {data?.ngay_ct ? new Date(data.ngay_ct).toLocaleDateString('vi-VN') : data?.ngay_lct ? new Date(data.ngay_lct).toLocaleDateString('vi-VN') : "30 THÁNG 05 NĂM 2025"}
      </div>

      {/* Thông tin chính - layout 2 cột */}
      <div className="grid grid-cols-2 gap-8 mb-4">
        {/* Cột trái - thông tin người nộp */}
        <div className="space-y-2">
          <div className="flex">
            <span className="w-32 font-medium">Họ, tên người nộp tiền:</span>
            <span className="flex-1 border-b border-dotted border-black pb-1">{data?.ong_ba || ""}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Đơn vị:</span>
            <span className="flex-1 border-b border-dotted border-black pb-1">{data?.don_vi || data?.ma_kh || ""}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Địa chỉ:</span>
            <span className="flex-1 border-b border-dotted border-black pb-1">{data?.dia_chi || ""}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Lý do nộp:</span>
            <span className="flex-1 border-b border-dotted border-black pb-1">{data?.dien_giai || ""}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Số tiền:</span>
            <span className="flex-1 border-b border-dotted border-black pb-1 font-bold">
              {data?.so_tien ? data.so_tien.toLocaleString('vi-VN') : "0"} VND
            </span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Bằng chữ:</span>
            <span className="flex-1 border-b border-dotted border-black pb-1">{data?.so_tien_bang_chu || ""}</span>
          </div>
          <div className="flex">
            <span className="w-32 font-medium">Kèm theo:</span>
            <span className="flex-1 border-b border-dotted border-black pb-1">{data?.kem_theo || "0 chứng từ gốc"}</span>
          </div>
        </div>

        {/* Cột phải - thông tin kế toán */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Liên số:</span>
            <span className="border-b border-dotted border-black pb-1 min-w-[60px] text-center">{data?.lien_so || "1"}</span>
          </div>
          <div className="flex justify-between">
            <span>Quyển số:</span>
            <span className="border-b border-dotted border-black pb-1 min-w-[60px] text-center">{data?.ma_qs || "PT001"}</span>
          </div>
          <div className="flex justify-between">
            <span>Số phiếu:</span>
            <span className="border-b border-dotted border-black pb-1 min-w-[60px] text-center">{data?.so_ct || "PT0008"}</span>
          </div>
          
          {/* Hiển thị danh sách tài khoản nếu có */}
          <div className="mt-4">
            {data?.tai_khoan_list && data.tai_khoan_list.length > 0 ? (
              data.tai_khoan_list.map((tk, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-center">
                    <span>{index === 0 ? "Nợ:" : ""}</span>
                    <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-center">
                      {tk.tk_so || data?.tk || "1111"}
                    </span>
                    <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-right">
                      {tk.ps_no ? tk.ps_no.toLocaleString('vi-VN') : (data?.so_tien ? data.so_tien.toLocaleString('vi-VN') : "0")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span>Có:</span>
                    <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-center">
                      {tk.tk_so_co || data?.tk_co || "1121VIETTI"}
                    </span>
                    <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-right">
                      {tk.ps_co ? tk.ps_co.toLocaleString('vi-VN') : (data?.so_tien ? data.so_tien.toLocaleString('vi-VN') : "0")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <span>Nợ:</span>
                  <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-center">
                    {data?.tk || "1111"}
                  </span>
                  <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-right">
                    {data?.so_tien ? data.so_tien.toLocaleString('vi-VN') : "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span>Có:</span>
                  <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-center">
                    {data?.tk_co || "1121VIETTI"}
                  </span>
                  <span className="border-b border-dotted border-black pb-1 min-w-[80px] text-right">
                    {data?.so_tien ? data.so_tien.toLocaleString('vi-VN') : "0"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phần ký tên */}
      <div className="mt-8">
        <div className="text-right mb-4 text-sm">
          Ngày.....tháng.....năm.........
        </div>
        
        <div className="grid grid-cols-5 text-center text-xs gap-x-2">
          <div>
            <div className="font-bold">CHỦ TÀI KHOẢN</div>
            <div>(Ký, họ tên, đóng dấu)</div>
          </div>
          <div>
            <div className="font-bold">PHỤ TRÁCH KẾ TOÁN</div>
            <div>(Ký, họ tên)</div>
          </div>
          <div>
            <div className="font-bold">NGƯỜI NỘP TIỀN</div>
            <div>(Ký, họ tên)</div>
          </div>
          <div>
            <div className="font-bold">NGƯỜI LẬP PHIẾU</div>
            <div>(Ký, họ tên)</div>
          </div>
          <div>
            <div className="font-bold">THỦ QUỸ</div>
            <div>(Ký, họ tên)</div>
          </div>
        </div>

        {/* Chữ ký - Hiển thị tên từ data */}
        <div className="grid grid-cols-5 text-center mt-16 text-sm">
          <div></div>
          <div></div>
          <div className="font-medium">{data?.ong_ba || ""}</div>
          <div className="font-medium">{data?.nguoi_lap || ""}</div>
          <div className="font-medium">{data?.thu_quy || ""}</div>
        </div>
      </div>

      {/* Phần cuối */}
      <div className="mt-8 text-sm">
        <div className="flex items-start">
          <span className="font-bold mr-2">Đã nhận đủ số tiền (viết bằng chữ):</span>
          <div className="flex-1 border-b border-dotted border-black pb-1 min-h-[20px]">
            {data?.so_tien_bang_chu || ""}
          </div>
        </div>
        <div className="border-b border-dotted border-black pb-1 mt-2 min-h-[20px]"></div>
      </div>
    </div>
  );
});

export default CashReceiptPrint;