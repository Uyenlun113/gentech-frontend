export default function Home() {
  return (
    <div className="w-full h-full relative">
      {/* Ảnh nền full screen */}
      <img
        src="images/logo/nen.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay mờ để text dễ đọc hơn */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Ảnh logo ở giữa */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="images/logo/gioi-thieu-logo-ok1.gif"
            alt="Diamond Soft"
            className="w-[400px] object-cover"
          />
        </div>

        {/* Thông tin ở dưới, căn phải với background mờ */}
        <div className="flex justify-end px-4">
          <div className="relative">
            {/* Background mờ */}
            <div className="absolute inset-0 "></div>

            {/* Nội dung chữ */}
            <div className="relative text-sm text-right leading-relaxed space-y-1 max-w-xl p-6">
              <p className="italic ">Đã đăng ký sử dụng cho</p>
              <p className="font-semibold">Công ty TNHH Vận tải thương mại Việt Trung Phú Thọ</p>
              <p className="">Địa chỉ: Phòng 305 – D6 – Dịch Vọng – Cầu Giấy – Hà Nội</p>
              <p>Điện thoại: 04 3793 2884</p>
              <p >Fax: 04 3793 2885</p>
              <p>Email: contact@dmsoft.com.vn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}