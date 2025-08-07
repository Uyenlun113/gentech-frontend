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
    render: (val) => <div className="max-w-xs truncate text-center" title={val}>{val || "-"}</div>,
  },
  {
    key: "dia_chi",
    title: "Địa chỉ",
    width: 200,
    render: (val) => <div className="max-w-xs truncate text-center" title={val}>{val || "-"}</div>,
  },
  {
    key: "nguoi_quan_ly",
    title: "Người quản lý",
    width: 150,
    render: (val) => <div className="max-w-xs truncate text-center" title={val}>{val || "-"}</div>,
  },
  // Thêm các trường khác nếu cần
];
