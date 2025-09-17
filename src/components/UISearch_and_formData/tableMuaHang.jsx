
// Cho phép cấu hình hành vi sinh cột tự động khi không có cấu hình cột
export const AUTO_GENERATE_COLUMNS = false;

// Các trường số để canh phải
const numericKeys = new Set([
  'so_luong', 'so_luong_xuat', 'so_luong_nhap', 'so_luong_ton',
  'don_gia', 'gia', 'gia_von', 'tien', 'tien_hang', 'tien_thue', 'thanh_tien',
]);

// Tìm key thực tế trong dữ liệu dựa trên key cấu hình hoặc alias, so khớp không phân biệt hoa thường và bỏ dấu cách/underscore/ký tự đặc biệt
const findPresentKey = (def, availableKeys) => {
  const sanitize = (s) => (s || "")
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, '');

  const candidates = [def.key, ...(def.sourceKeys || [])].filter(Boolean);
  const normalizedCandidates = candidates.map(sanitize);
  const normalizedAvail = new Map(availableKeys.map((k) => [sanitize(k), k]));

  for (const nc of normalizedCandidates) {
    if (normalizedAvail.has(nc)) return normalizedAvail.get(nc);
  }
  return null;
};

// orderedDefs có thể là mảng string (key) hoặc object { key, title, width, align, sourceKeys? }
const buildColumns = (orderedDefs = [], sampleData = []) => {
  const first = Array.isArray(sampleData) && sampleData.length > 0 ? sampleData[0] : null;
  const availableKeys = first ? Object.keys(first) : (Array.isArray(orderedDefs) ? orderedDefs.map((d) => (typeof d === 'string' ? d : d.key)) : []);

  // Chuẩn hóa orderedDefs thành object { key, title? }
  const normalized = (orderedDefs || [])
    .map((def) => (typeof def === 'string' ? { key: def } : def))
    .filter((def) => def && def.key);

  // Nếu có cấu hình, chỉ giữ những key có trong data để tránh cột rỗng
  const pickedDefs = normalized.length > 0
    ? normalized.map((def) => {
      const presentKey = findPresentKey(def, availableKeys);
      // key: dùng để lấy dữ liệu (ưu tiên key thực tế từ DB nếu có)
      // dbKey: lưu lại tên trường thực tế từ DB để hiển thị title khi không có title custom
      return { ...def, key: presentKey || def.key, dbKey: presentKey };
    })
    : (availableKeys
      .filter((k) => k !== 'children')
      .map((k) => ({ key: k }))
    );

  const toTitle = (key) => key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const columns = pickedDefs.map((def) => {
    const key = def.key; // data key để render giá trị
    // Nếu không có title custom, hiển thị đúng tên trường từ DB (dbKey) nếu có; ngược lại mới prettify
    const title = def.title || def.dbKey || key;
    const width = def.width ?? 140;
    const align = def.align || (numericKeys.has(key) ? 'right' : 'center');
    return {
      key,
      title,
      width,
      render: (val) => (
        <div className={`max-w-xs truncate text-${align}`} title={val}>
          {val ?? '-'}
        </div>
      ),
    };
  });

  // Nếu bật auto-gen và không lấy được cột nào từ cấu hình, auto-gen tối đa 12 cột
  if (AUTO_GENERATE_COLUMNS && columns.length === 0 && first && normalized.length === 0) {
    return Object.keys(first)
      .filter((k) => k !== 'children')
      .slice(0, 12)
      .map((key) => ({
        key,
        title: toTitle(key),
        width: 140,
        render: (val) => (
          <div className={`max-w-xs truncate ${numericKeys.has(key) ? 'text-right' : 'text-center'}`} title={val}>
            {val ?? '-'}
          </div>
        ),
      }));
  }

  // Trả đúng theo cấu hình (nếu không có cột phù hợp dữ liệu và AUTO_GENERATE_COLUMNS=false, sẽ trả mảng rỗng)
  return columns;
};

// Khai báo cột theo từng báo cáo: quy định rõ key và title hiển thị
// Sử dụng tên báo cáo từ FILTER_CONFIGS trong UISearch_and_formDataMuaHang.js
export const preferredColumnsByReport = {
  // Báo cáo hàng nhập mua
  bang_ke_phieu_nhap: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_kh', title: 'Mã khách', width: 100 },
    { key: 'ten_kh', title: 'Tên khách hàng', width: 200 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 't_tien', title: 'Tổng tiền', width: 120, render: (val) => val ? val.toLocaleString('vi-VN') : '-' },
    { key: 'ma_ct', title: 'Mã c.t', width: 100 }
  ],

  bang_ke_hoa_don_mua_hang_va_dich_vu: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct0', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_kh', title: 'Mã khách', width: 100 },
    { key: 'ten_kh', title: 'Tên khách hàng', width: 180 },
    { key: 'tien0', title: 'Tiền hàng', width: 120 },
    { key: 'thue', title: 'Tiền thuế', width: 120 },
    { key: 'ttt', title: 'Tổng tiền', width: 120 },
    { key: 'ma_nx', title: 'Mã nx', width: 100 },
    { key: 'stt_rec_pn', title: 'Mã dự án', width: 120 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'ma_dvcs', title: 'Mã ĐVCS', width: 100 },
    { key: 'ma_ct', title: 'Mã c.t', width: 100 }
  ],

  bang_ke_phieu_xuat_tra_lai_nha_cung_cap: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 200 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'tong_tien_hang', title: 'Tổng tiền hàng', width: 140 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  bang_ke_phieu_nhap_cua_mot_mat_hang: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 180 },
    { key: 'so_luong', title: 'Số lượng', width: 100 },
    { key: 'gia', title: 'Giá', width: 120 },
    { key: 'tong_tien', title: 'Tổng tiền', width: 120 },
    { key: 'ma_nx', title: 'Mã nx', width: 100 },
    { key: 'ma_kho', title: 'Mã kho', width: 100 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_nha_cung_cap: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'so_luong', title: 'Số lượng', width: 100 },
    { key: 'gia', title: 'Giá', width: 120 },
    { key: 'tong_tien', title: 'Tổng tiền', width: 120 },
    { key: 'ma_nx', title: 'Mã nx', width: 100 },
    { key: 'ma_kho', title: 'Mã kho', width: 100 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_dang_nhap_mua: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 180 },
    { key: 'so_luong', title: 'Số lượng', width: 100 },
    { key: 'gia', title: 'Giá', width: 120 },
    { key: 'tong_tien', title: 'Tổng tiền', width: 120 },
    { key: 'ma_nx', title: 'Mã nx', width: 100 },
    { key: 'ma_kho', title: 'Mã kho', width: 100 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  bang_ke_phieu_nhap_cua_mot_nha_cung_cap_nhom_theo_mat_hang: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'so_luong', title: 'Số lượng', width: 100 },
    { key: 'gia', title: 'Giá', width: 120 },
    { key: 'tong_tien', title: 'Tổng tiền', width: 120 },
    { key: 'ma_nx', title: 'Mã nx', width: 100 },
    { key: 'ma_kho', title: 'Mã kho', width: 100 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  bao_cao_tong_hop_hang_nhap_mua: [
    { key: 'stt', title: 'Stt', width: 60 },
    { key: 'ma_vat_tu', title: 'Mã vật tư', width: 100 },
    { key: 'ten_vat_tu', title: 'Tên vật tư', width: 200 },
    { key: 'dvt', title: 'Đvt', width: 80 },
    { key: 'so_luong', title: 'Số lượng', width: 100 },
    { key: 'gia', title: 'Giá', width: 120 },
    { key: 'tong_tien', title: 'Tổng tiền', width: 120 },
    { key: 'nhom_vat_tu_1', title: 'Nhóm vật tư 1', width: 120 },
    { key: 'nhom_vat_tu_2', title: 'Nhóm vật tư 2', width: 120 },
    { key: 'nhom_vat_tu_3', title: 'Nhóm vật tư 3', width: 120 }
  ],

  // Báo cáo công nợ Nhà cung cấp
  bang_ke_chung_tu: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct', title: 'Mã c.t', width: 80 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 180 },
    { key: 'dien_giai', title: 'Diễn giải', width: 200 },
    { key: 'tk', title: 'TK', width: 80 },
    { key: 'tk_doi_ung', title: 'TK đ.ứng', width: 100 },
    { key: 'ps_no', title: 'Ps nợ', width: 120 },
    { key: 'ps_co', title: 'Ps có', width: 120 },
    { key: 'ma_sp', title: 'Mã SP', width: 100 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'ma_bpht', title: 'Mã BPHT', width: 100 },
    { key: 'so_lsx', title: 'Số LSX', width: 100 },
    { key: 'ma_px', title: 'Mã PX', width: 100 },
    { key: 'ma_phi', title: 'Mã phí', width: 100 },
    { key: 'ten_tai_khoan', title: 'Tên tài khoản', width: 150 },
    { key: 'ten_tai_khoan_doi_ung', title: 'Tên tài khoản đối ứng', width: 180 },
    { key: 'ma_ct_2', title: 'Mã c.từ', width: 100 },
    { key: 'ma_dvcs', title: 'Mã ĐVCS', width: 100 },
    { key: 'ma_khe_uoc', title: 'Mã khế ước', width: 120 },
    { key: 'ma_tu_do_1', title: 'Mã tự do 1', width: 120 },
    { key: 'ma_tu_do_2', title: 'Mã tự do 2', width: 120 },
    { key: 'ma_tu_do_3', title: 'Mã tự do 3', width: 120 },
    { key: 'ma_hoat_dong_ban', title: 'Mã h.động bán', width: 130 },
    { key: 'ma_hoat_dong_mua', title: 'Mã h.động mua', width: 130 }
  ],

  bang_ke_chung_tu_theo_nha_cung_cap: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 180 },
    { key: 'dien_giai', title: 'Diễn giải', width: 200 },
    { key: 'tai_khoan', title: 'Tài khoản', width: 100 },
    { key: 'tk_doi_ung', title: 'TK đ.ứng', width: 100 },
    { key: 'ps_no', title: 'Ps nợ', width: 120 },
    { key: 'ps_co', title: 'Ps có', width: 120 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'ten_tai_khoan', title: 'Tên tài khoản', width: 180 },
    { key: 'ten_tai_khoan_doi_ung', title: 'Tên tài khoản đối ứng', width: 200 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  tong_hop_so_phat_sinh_theo_nha_cung_cap: [
    { key: 'stt', title: 'Stt', width: 60 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 200 },
    { key: 'phat_sinh_no', title: 'Phát sinh nợ', width: 150 },
    { key: 'phat_sinh_co', title: 'Phát sinh có', width: 150 }
  ],

  tra_so_du_cong_no_cua_mot_nha_cung_cap: [
    { key: 'tai_khoan', title: 'Tài khoản', width: 120 },
    { key: 'ten_tai_khoan', title: 'Tên tài khoản', width: 250 },
    { key: 'no_cuoi_ky', title: 'Nợ cuối kỳ', width: 150 },
    { key: 'co_cuoi_ky', title: 'Có cuối kỳ', width: 150 }
  ],

  so_chi_tiet_cong_no_cua_mot_nha_cung_cap: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'ngay_lap_ct', title: 'Ngày lập c.từ', width: 120 },
    { key: 'ngay_ct_0', title: 'Ngày c.từ 0', width: 120 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'so_ct_0', title: 'Số c.từ 0', width: 120 },
    { key: 'dien_giai', title: 'Diễn giải', width: 200 },
    { key: 'tk_doi_ung', title: 'TK đ.ứng', width: 100 },
    { key: 'ps_no', title: 'Ps nợ', width: 120 },
    { key: 'ps_co', title: 'Ps có', width: 120 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  so_doi_chieu_cong_no: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'ngay_lap_ct', title: 'Ngày lập c.từ', width: 120 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'dien_giai', title: 'Diễn giải', width: 200 },
    { key: 'phat_sinh_no', title: 'Phát sinh nợ', width: 120 },
    { key: 'phat_sinh_co', title: 'Phát sinh có', width: 120 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 120 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  so_chi_tiet_cong_no_len_tat_ca_nha_cung_cap: [
    { key: 'stt', title: 'Stt', width: 60 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 200 },
    { key: 'du_dau', title: 'Dư đầu', width: 120 },
    { key: 'du', title: 'Dư', width: 80 },
    { key: 'phat_sinh_no', title: 'Phát sinh nợ', width: 120 },
    { key: 'phat_sinh_co', title: 'Phát sinh có', width: 120 },
    { key: 'du_cuoi', title: 'Dư cuối', width: 120 },
    { key: 'du_2', title: 'Dư', width: 80 }
  ],

  // Báo cáo đơn hàng
  bang_ke_don_hang: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_don_hang_mua', title: 'Số đ.hàng mua', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 180 },
    { key: 'dien_giai', title: 'Diễn giải', width: 200 },
    { key: 'tong_tien_hang', title: 'Tổng tiền hàng', width: 140 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],

  bao_cao_thuc_hien_don_hang: [
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_vat_tu', title: 'Mã vật tư', width: 100 },
    { key: 'dien_giai', title: 'Diễn giải', width: 200 },
    { key: 'dvt', title: 'Đvt', width: 80 },
    { key: 'so_luong', title: 'Số lượng', width: 100 },
    { key: 'don_gia', title: 'Đơn giá', width: 120 },
    { key: 'tien_hang', title: 'Tiền hàng', width: 120 }
  ],

  bao_cao_tinh_hinh_thuc_hien_ke_hoach_don_hang: [
    { key: 'so_don_hang', title: 'Số đơn hàng', width: 120 },
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_vat_tu', title: 'Mã vật tư', width: 100 },
    { key: 'dien_giai', title: 'Diễn giải', width: 180 },
    { key: 'dvt', title: 'Đvt', width: 80 },
    { key: 'sl_ke_hoach', title: 'SL kế hoạch', width: 100 },
    { key: 'gia_ke_hoach', title: 'Giá kế hoạch', width: 110 },
    { key: 'tien_ke_hoach', title: 'Tiền kế hoạch', width: 120 },
    { key: 'sl_nhap', title: 'SL nhập', width: 100 },
    { key: 'gia_nhap', title: 'Giá nhập', width: 100 },
    { key: 'tien_nhap', title: 'Tiền nhập', width: 120 },
    { key: 'sl_con_lai', title: 'SL còn lại', width: 100 },
    { key: 'gia_con_lai', title: 'Giá còn lại', width: 110 },
    { key: 'tien_con_lai', title: 'Tiền còn lại', width: 120 }
  ],

  so_chi_tiet_don_hang: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 180 },
    { key: 'dien_giai', title: 'Diễn giải', width: 180 },
    { key: 'tk_doi_ung', title: 'TK đ.ứng', width: 100 },
    { key: 'ps_no', title: 'Ps nợ', width: 120 },
    { key: 'ps_co', title: 'Ps có', width: 120 },
    { key: 'so_don_hang_mua', title: 'Số đơn hàng mua', width: 140 },
    { key: 'ten_tai_khoan', title: 'Tên tài khoản', width: 180 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],
  bang_ke_chung_tu_phat_sinh_theo_don_hang: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct_in', title: 'Mã c.từ in', width: 100 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_khach', title: 'Mã khách', width: 100 },
    { key: 'ten_khach_hang', title: 'Tên khách hàng', width: 180 },
    { key: 'dien_giai', title: 'Diễn giải', width: 180 },
    { key: 'tai_khoan', title: 'Tài khoản', width: 100 },
    { key: 'tk_doi_ung', title: 'TK đ.ứng', width: 100 },
    { key: 'ps_no', title: 'Ps nợ', width: 120 },
    { key: 'ps_co', title: 'Ps có', width: 120 },
    { key: 'so_don_hang_mua', title: 'Số đ.hàng mua', width: 140 },
    { key: 'ma_ct', title: 'Mã c.từ', width: 100 }
  ],
  // Các báo cáo khác có thể thêm sau
  bao_cao_ton_kho_placeholder: [
    { key: 'stt', title: 'Stt', width: 60 },
    { key: 'ma_vt', title: 'Mã vật tư', width: 120 },
    { key: 'ten_vt', title: 'Tên vật tư', width: 220 },
    { key: 'dvt', title: 'Đvt', width: 80 },
    { key: 'ton00', title: 'SL tồn cuối', width: 120 },
    { key: 'du00', title: 'Tiền', width: 120 },
    { key: 'nh_vt1', title: 'Nhóm vật tư 1', width: 150 },
    { key: 'nh_vt2', title: 'Nhóm vật tư 2', width: 150 },
    { key: 'nh_vt3', title: 'Nhóm vật tư 3', width: 150 }
  ]
};

export const getColumnsForReport = (reportType, sampleData = []) => {
  const defs = preferredColumnsByReport[reportType];
  if (!defs) {
    // Không có cấu hình, thử auto-gen từ data hoặc dùng mặc định kho
    return buildColumns([], sampleData);
  }
  // Nếu có cấu hình, build theo thứ tự, chỉ giữ keys có trong data
  return buildColumns(defs, sampleData);
};
