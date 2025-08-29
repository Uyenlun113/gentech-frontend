
export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
};

export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0";
    const value = Array.isArray(amount) ? amount[0] : amount;
    return new Intl.NumberFormat("vi-VN").format(value);
};

export const createColumnsTable1 = () => [
    {
        key: "stt",
        title: "Số TT",
        fixed: "left",
        width: 110,
        render: (val) => {
            return <div className="font-medium text-center">{val}</div>;
        },
    },
    {
        key: "ngay_ct",
        title: "Ngày chứng từ",
        fixed: "left",
        width: 110,
        render: (val) => {
            return <div className="font-medium text-center">{formatDate(val)}</div>;
        },
    },
    {
        key: "ma_ct0",
        title: "Mã CT in",
        width: 110,
        render: (_, record) => {
            const val = record.ma_ct0 ?? record.ma_ct_in;
            return val ? (
                <div className="text-center text-black-600">{val}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "so_ct",
        title: "Số CT",
        width: 80,
        render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
    },
    {
        key: "ma_kh",
        title: "Mã Khách",
        width: 100,
        render: (val) => {
            return <div className="font-medium text-center">{val}</div>;
        },
    },
    {
        key: "ten_kh",
        title: "Tên khách hàng",
        width: 150,
        render: (val) => (
            <div className="max-w-xs truncate text-center" title={val}>
                {val || "-"}
            </div>
        ),
    },
    {
        key: "t_tien2",
        title: "Tiền hàng",
        width: 150,
        render: (_, record) => {
            const val = record.t_tien2 ?? record.t_tien_2 ?? record.tien;
            return val ? (
                <div className="text-center text-red-600">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "t_ck",
        title: "Tiền ck",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "t_thue",
        title: "Tiền thuế",
        width: 150,
        render: (_, record) => {
            const val = record.t_thue ?? record.thue ?? record.tien;
            return val ? (
                <div className="text-center text-blue-600">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "t_pt",
        title: "Tổng tiền tt",
        width: 150,
        render: (_, record) => {
            const val = record.t_pt ?? record.t_tt ?? record.pt;
            return val ? (
                <div className="text-center text-green-600">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "t_tien",
        title: "Tiền vốn",
        width: 150,
        render: (_, record) => {
            const val = record.t_tien ?? record.tien;
            return val ? (
                <div className="text-center text-blue-600">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "dien_giai",
        title: "Diễn giải",
        width: 120,
        render: (val) => (
            <div className="max-w-xs truncate text-center" title={val}>
                {val || "-"}
            </div>
        ),
    },
    {
        key: "ma_ct",
        title: "Mã CT",
        width: 180,
        render: (val) => (
            <div className="max-w-xs truncate text-center" title={val}>
                {val || "-"}
            </div>
        ),
    },
];

export const createColumnsTable2 = (maKey, maTitle, tenKey, tenTitle) => [
    {
        key: "stt",
        title: "Số TT",
        fixed: "left",
        width: 110,
        render: (val) => {
            return <div className="font-medium text-center">{val}</div>;
        },
    },
    {
        key: maKey,
        title: maTitle,
        fixed: "left",
        width: 110,
        dataIndex: maKey,
        render: (val) => <div className="font-medium text-center">{val}</div>,
    },
    {
        key: tenKey,
        title: tenTitle,
        width: 150,
        dataIndex: tenKey,
        render: (val) => <div className="font-medium text-center">{val}</div>,
    },
    {
        key: "dien_giai",
        title: "Diễn giải",
        width: 140,
        render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
    },
    {
        key: "so_luong",
        title: "Số lượng",
        width: 100,
        render: (val) => {
            return <div className="font-medium text-center">{val}</div>;
        },
    },
    {
        key: "gia2",
        title: "Giá bán",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "tien2",
        title: "Tiền hàng",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-red-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "ck",
        title: "Tiền ck",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "thue",
        title: "Tiền thuế",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-blue-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "pt",
        title: "Tổng tiền tt",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-green-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "gia",
        title: "Giá vốn",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "tien",
        title: "Tiền vốn",
        width: 150,
        render: (val) => {
            return val ? (
                <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center">0</div>
            );
        },
    },
    {
        key: "ma_nx",
        title: "Mã NX",
        width: 120,
        render: (val) => (
            <div className="max-w-xs truncate text-center" title={val}>
                {val || "-"}
            </div>
        ),
    },
    {
        key: "ma_kho",
        title: "Mã kho",
        width: 180,
        render: (val) => (
            <div className="max-w-xs truncate text-center" title={val}>
                {val || "-"}
            </div>
        ),
    },
    {
        key: "ma_ct",
        title: "Mã CT",
        width: 180,
        render: (val) => (
            <div className="max-w-xs truncate text-center" title={val}>
                {val || "-"}
            </div>
        ),
    },
];

export const createColumnsTable3 = () => [
    {
        key: "stt",
        title: "STT",
        fixed: "left",
        width: 60,
        render: (val) => {
            return <div className="font-medium text-center">{val}</div>;
        },
    },
    {
        key: "ngay_ct",
        title: "Ngày CT",
        width: 100,
        render: (val) => {
            return <div className="font-medium text-center">{formatDate(val)}</div>;
        },
    },
    {
        key: "ma_ct0",
        title: "Mã CT in",
        width: 80,
        render: (val) => <div className="font-medium text-center">{val || ""}</div>,
    },
    {
        key: "so_ct",
        title: "Số CT",
        width: 80,
        render: (val) => <div className="font-medium text-center">{val || ""}</div>,
    },
    {
        key: "dien_giai",
        title: "Diễn giải",
        width: 200,
        render: (val) => (
            <div className="max-w-xs truncate text-left" title={val}>
                {val || ""}
            </div>
        ),
    },
    {
        key: "tk",
        title: "Tài khoản",
        width: 100,
        render: (val) => <div className="font-medium text-center">{val || ""}</div>,
    },
    {
        key: "tk_du",
        title: "TK đ.ứng",
        width: 100,
        render: (val) => <div className="font-medium text-center">{val || ""}</div>,
    },
    {
        key: "ps_no",
        title: "Phát sinh nợ",
        width: 120,
        render: (val) => {
            return val ? (
                <div className="text-right text-red-600 pr-2">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center"></div>
            );
        },
    },
    {
        key: "ps_co",
        title: "Phát sinh có",
        width: 120,
        render: (val) => {
            return val ? (
                <div className="text-right text-blue-600 pr-2">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center"></div>
            );
        },
    },
    {
        key: "ten_tk",
        title: "Tên tài khoản",
        width: 180,
        render: (val) => (
            <div className="max-w-xs truncate text-center" title={val}>
                {val || ""}
            </div>
        ),
    },
    {
        key: "ten_tk_du",
        title: "Tên tài khoản đối ứng",
        width: 200,
        render: (val) => (
            <div className="max-w-xs truncate text-left" title={val}>
                {val || ""}
            </div>
        ),
    },
    {
        key: "ma_ct",
        title: "Mã CT",
        width: 100,
        render: (val) => <div className="font-medium text-center">{val || ""}</div>,
    },
];

export const createColumnsTable4 = () => [
    {
        key: "stt",
        title: "STT",
        fixed: "left",
        width: 60,
        render: (val) => {
            return <div className="font-medium text-center">{val}</div>;
        },
    },
    {
        key: "ma",
        title: "Mã khách",
        width: 100,
        render: (val) => {
            return <div className="font-medium text-center">{val || ""}</div>;
        },
    },
    {
        key: "ten",
        title: "Tên khách hàng",
        width: 150,
        render: (val) => <div className="font-medium text-center">{val || ""}</div>,
    },
    {
        key: "ps_no",
        title: "Phát sinh nợ",
        width: 120,
        render: (val) => {
            return val ? (
                <div className="text-center text-red-600 pr-2">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center"></div>
            );
        },
    },
    {
        key: "ps_co",
        title: "Phát sinh có",
        width: 120,
        render: (val) => {
            return val ? (
                <div className="text-center text-blue-600 pr-2">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center"></div>
            );
        },
    },
];
export const createColumnsTable5 = () => [
    {
        key: "stt",
        title: "STT",
        fixed: "left",
        width: 60,
        render: (val) => {
            return <div className="font-medium text-center">{val}</div>;
        },
    },
    {
        key: "tk",
        title: "Tài khoản",
        width: 100,
        render: (val) => {
            return <div className="font-medium text-center">{val || ""}</div>;
        },
    },
    {
        key: "ten_tk",
        title: "Tên tài khoản",
        width: 150,
        render: (val) => <div className="font-medium text-center">{val || ""}</div>,
    },
    {
        key: "no_ck",
        title: "Nợ cuối kì",
        width: 120,
        render: (val) => {
            return val ? (
                <div className="text-center text-red-600 pr-2">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center"></div>
            );
        },
    },
    {
        key: "co_ck",
        title: "Có cuối kì",
        width: 120,
        render: (val) => {
            return val ? (
                <div className="text-center text-blue-600 pr-2">{formatCurrency(val)}</div>
            ) : (
                <div className="text-center"></div>
            );
        },
    },
];
