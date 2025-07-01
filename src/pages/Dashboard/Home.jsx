export default function Home() {
  return (
    <div className="w-full">
      {/* Ảnh ở giữa */}
      <img
        src="images/logo/anh_logo.png"
        alt="Diamond Soft"
        className="w-full h-[450px] object-cover"
      />

      {/* Thông tin ở dưới ảnh, căn phải */}
      <div className="flex justify-end mt-4">
        <div className="text-sm text-right leading-relaxed space-y-1 max-w-xl pr-4">
          <p className="italic">Đã đăng ký sử dụng cho</p>
          <p className="font-semibold">Công ty TNHH Vận tải thương mại Việt Trung Phú Thọ</p>
          <p>Địa chỉ: Phòng 305 – D6 – Dịch Vọng – Cầu Giấy – Hà Nội</p>
          <p>Điện thoại: 04 3793 2884</p>
          <p>Fax: 04 3793 2885</p>
          <p>Email: contact@dmsoft.com.vn</p>
        </div>
      </div>
    </div>
  );
}
