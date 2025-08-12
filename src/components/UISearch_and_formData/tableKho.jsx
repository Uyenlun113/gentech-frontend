
// Cho phép cấu hình hành vi sinh cột tự động khi không có cấu hình cột
export const AUTO_GENERATE_COLUMNS = false;

// Cột mặc định cho danh sách kho
export const columnsTableKho = [
  {
    key: "ma_kho",
    title: "Mã kho",
    width: 100,
    render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
  },
  {
    key: "ten_kho",
    title: "Tên kho",
    width: 180,
    render: (val) => (
      <div className="max-w-xs truncate text-center" title={val}>
        {val || "-"}
      </div>
    ),
  },
  {
    key: "dia_chi",
    title: "Địa chỉ",
    width: 200,
    render: (val) => (
      <div className="max-w-xs truncate text-center" title={val}>
        {val || "-"}
      </div>
    ),
  },
  {
    key: "nguoi_quan_ly",
    title: "Người quản lý",
    width: 150,
    render: (val) => (
      <div className="max-w-xs truncate text-center" title={val}>
        {val || "-"}
      </div>
    ),
  },
];

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
export const preferredColumnsByReport = {
  // Mặc định danh sách kho
  bang_ke_phieu_nhap: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct', title: 'Mã c.t', width: 80 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_kh', title: 'Mã khách', width: 100 },
    { key: 'ten_kh', title: 'Tên khách hàng', width: 180 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'tong_tien', title: 'Tổng tiền', width: 120, render: (val) => val ? val.toLocaleString('vi-VN') : '-' },
    { key: 'ma_ct', title: 'Mã c.t', width: 80 }, // Cột này bạn ghi 2 lần trong ảnh? Nếu trùng có thể bỏ
  ],
  bang_ke_phieu_nhap_mat_hang: [
    { key: 'ngay_ct', title: 'Ngày c.từ', width: 100 },
    { key: 'ma_ct', title: 'Mã c.t', width: 80 },
    { key: 'so_ct', title: 'Số c.từ', width: 120 },
    { key: 'ma_kh', title: 'Mã khách', width: 100 },
    { key: 'ten_kh', title: 'Tên khách hàng', width: 180 },
    { key: 'dien_giai', title: 'Diễn giải', width: 220 },
    { key: 'so_luong', title: 'Số lượng', width: 100 },
    { key: 'don_gia', title: 'Đơn giá', width: 120 },
    { key: 'thanh_tien', title: 'Thành tiền', width: 120 },
    { key: 'ma_kho', title: 'Mã kho', width: 100 },
    { key: 'ma_du_an', title: 'Mã dự án', width: 100 },
    { key: 'ma_nx', title: 'Mã nx', width: 100 },
    { key: 'ten_nhap_xuat', title: 'Tên nhập xuất', width: 180 },
    { key: 'ma_cti', title: 'Mã c.ti', width: 100 },
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
