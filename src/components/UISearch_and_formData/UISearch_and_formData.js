// filterConfigs.js - File cấu hình các form filter

export const FILTER_CONFIGS = {

  // Cấu hình Nhập kho
  bang_ke_phieu_nhap: {
    title: 'Bảng kê phiếu nhập',
    defaultFormData: {
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      ma_dvcs: "CTY",
      chung_tu_tu_so: "",
      den_so: "",
      ma_khach: "",
      ma_vat_tu: "",
      loai_phieu_nhap: "Tất cả",
      mau_vnd_ngoai_te: "VND",
      kieu_loc: "Tất cả các vật tư trọn"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text", placeholder: "Nhập số chứng từ..." },
        { key: "den_so", label: "Đến số", type: "text", placeholder: "Nhập đến số..." },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },
        {
          key: "ma_vat_tu", label: "Mã vật tư", type: "lookup", placeholder: "Nhập mã vật tư...",
          valueKey: "ma_vat_tu", displayKey: "ten_vat_tu", popupTitle: "Chọn vật tư", emptyMessage: "Không tìm thấy vật tư",
          searchConfig: { searchType: "material", fields: ["ma_vat_tu", "ten_vat_tu"] }
        },
        {
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Phiếu nhập", label: "Phiếu nhập" },
            { value: "Phiếu xuất", label: "Phiếu xuất" }
          ]
        }
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
        {
          key: "kieu_loc", label: "Kiểu lọc", type: "select",
          options: [
            { value: "Tất cả các vật tư trọn", label: "Tất cả các vật tư trọn" },
            { value: "Vật tư có phát sinh", label: "Vật tư có phát sinh" }
          ]
        }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VNĐ/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khi_ht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'ma_kho', name: 'Mã kho', checked: true, operator: 'like' },
      { id: 'ma_phan_xuong', name: 'Mã phân xưởng', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_dvcs', 'chung_tu_tu_so', 'den_so',
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap',
      'mau_vnd_ngoai_te', 'kieu_loc',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },

  bang_ke_phieu_nhap_mat_hang: {
    title: 'Bảng kê phiếu nhập mặt hàng',
    defaultFormData: {
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      loai_phieu_nhap: "Tất cả",
      chung_tu_tu_so: "",
      den_so: "",
      ma_kho: "",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "ma_vat_tu", label: "Mã vật tư", type: "lookup", placeholder: "Nhập mã vật tư..." },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text" },
        { key: "den_so", label: "Đến số", type: "text" }, {
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Nhập kho", label: "Nhập kho" },
            { value: "Khác", label: "Khác" }
          ]
        },

      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" },],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VND/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'ma_khach', name: 'Mã khách', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'loai_phieu_nhap', 'chung_tu_tu_so', 'den_so', 'ma_kho',
      'ma_dvcs', 'mau_vnd_ngoai_te',
      'ma_dang_nx', 'ma_khach', 'ma_du_an'
    ]
  },

  bang_ke_phieu_nhap_mat_hang_ncc: {
    title: 'Bảng kê phiếu nhập mặt hàng theo nhà cung cấp',
    defaultFormData: {
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      loai_phieu_nhap: "Tất cả",
      chung_tu_tu_so: "",
      den_so: "",
      ma_kho: "",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_vat_tu", label: "Mã vật tư", type: "lookup",
          placeholder: "Mã vật tư; Tên vật tư; TK"
        },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text" },
        { key: "den_so", label: "Đến số", type: "text" },
        {
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Nhập kho", label: "Nhập kho" },
            { value: "Khác", label: "Khác" }
          ]
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VND/NT", type: "select",
          options: [
            { value: "VND", label: "VND" }
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nhập xuất', checked: true, operator: 'like' },
      { id: 'ma_khach', name: 'Mã khách', checked: true, operator: 'like' },
      { id: 'ma_kho_nhap', name: 'Mã kho nhập', checked: true, operator: 'like' },
      { id: 'ma_kho_xuat', name: 'Mã kho xuất', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'loai_phieu_nhap', 'chung_tu_tu_so', 'den_so', 'ma_kho',
      'ma_dvcs', 'mau_vnd_ngoai_te',
      'ma_dang_nx', 'ma_khach', 'ma_kho_nhap', 'ma_kho_xuat', 'ma_du_an'
    ]
  },

  bang_ke_phieu_nhap_ncc_mat_hang: {
    title: 'Bảng kê phiếu nhập của một mặt hàng theo nhà cung cấp',
    defaultFormData: {
      ma_khach: "",
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      chung_tu_tu_so: "",
      den_so: "",
      ma_kho: "",
      loai_phieu_nhap: "Tất cả",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text" },
        { key: "den_so", label: "Đến số", type: "text" },
        {
          key: "ma_khach",
          label: "Mã khách",
          type: "lookup",
          placeholder: "Mã khách, Tên khách hàng"
        },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        {
          key: "loai_phieu_nhap",
          label: "Loại phiếu nhập",
          type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Nhập kho", label: "Nhập kho" },
            { value: "Khác", label: "Khác" }
          ]
        }
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [
            { value: "VND", label: "VND" }
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'tk_vat_tu', name: 'Tài khoản vật tư', checked: true, operator: 'like' },
      { id: 'ma_vat_tu', name: 'Mã vật tư', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_khach', 'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'chung_tu_tu_so', 'den_so', 'ma_kho', 'loai_phieu_nhap',
      'ma_dvcs', 'mau_vnd_ngoai_te',
      'ma_dang_nx', 'tk_vat_tu', 'ma_du_an',
      'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },

  tong_hop_hang_nhap_kho: {
    title: 'Tổng hợp hàng nhập kho',
    defaultFormData: {
      ma_khach: "",
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      loai_phieu_nhap: "",
      ma_kho: "",
      ps_dieu_chuyen: "Tính các ps điều chuyển",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_khach",
          label: "Mã khách hàng",
          type: "lookup",
          placeholder: "Mã khách, Tên khách hàng"
        },
        {
          key: "ma_vat_tu",
          label: "Mã vật tư",
          type: "lookup",
          placeholder: "Mã vật tư, Tên vật tư"
        },
        {
          key: "ma_kho",
          label: "Mã kho",
          type: "lookup"
        },
        {
          key: "loai_phieu_nhap",
          label: "Loại phiếu nhập",
          type: "text", // hoặc 'select' nếu cần gợi ý
          placeholder: ""
        }
      ],
      rightBox1Keys: [
        {
          key: "ps_dieu_chuyen",
          label: "Ps điều chuyển",
          type: "select",
          options: [
            { value: "Tính các ps điều chuyển", label: "Tính các ps điều chuyển" },
            { value: "Bỏ qua ps điều chuyển", label: "Bỏ qua ps điều chuyển" }
          ]
        },
        {
          key: "ma_dvcs",
          label: "Mã ĐVCS",
          type: "text_disabled"
        }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [
            { value: "VND", label: "VND" }
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_khach', 'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'loai_phieu_nhap', 'ma_kho', 'ps_dieu_chuyen', 'ma_dvcs',
      'mau_vnd_ngoai_te',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khht',
      'ma_du_an', 'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },

  //cấu hình Xuất kho
  bang_ke_phieu_xuat: {
    title: 'Bảng kê phiếu nhập',
    defaultFormData: {
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      ma_dvcs: "CTY",
      chung_tu_tu_so: "",
      den_so: "",
      ma_khach: "",
      ma_vat_tu: "",
      loai_phieu_nhap: "Tất cả",
      mau_vnd_ngoai_te: "VND",
      kieu_loc: "Tất cả các vật tư trọn"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text", placeholder: "Nhập số chứng từ..." },
        { key: "den_so", label: "Đến số", type: "text", placeholder: "Nhập đến số..." },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },
        {
          key: "ma_vat_tu", label: "Mã vật tư", type: "lookup", placeholder: "Nhập mã vật tư...",
          valueKey: "ma_vat_tu", displayKey: "ten_vat_tu", popupTitle: "Chọn vật tư", emptyMessage: "Không tìm thấy vật tư",
          searchConfig: { searchType: "material", fields: ["ma_vat_tu", "ten_vat_tu"] }
        },
        {
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Phiếu nhập", label: "Phiếu nhập" },
            { value: "Phiếu xuất", label: "Phiếu xuất" }
          ]
        }
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
        {
          key: "kieu_loc", label: "Kiểu lọc", type: "select",
          options: [
            { value: "Tất cả các vật tư trọn", label: "Tất cả các vật tư trọn" },
            { value: "Vật tư có phát sinh", label: "Vật tư có phát sinh" }
          ]
        }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VNĐ/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khi_ht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'ma_kho', name: 'Mã kho', checked: true, operator: 'like' },
      { id: 'ma_phan_xuong', name: 'Mã phân xưởng', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_dvcs', 'chung_tu_tu_so', 'den_so',
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap',
      'mau_vnd_ngoai_te', 'kieu_loc',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },

  bang_ke_phieu_xuat_mat_hang: {
    title: 'Bảng kê phiếu xuất mặt hàng',
    defaultFormData: {
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      loai_phieu_nhap: "Tất cả",
      chung_tu_tu_so: "",
      den_so: "",
      ma_kho: "",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "ma_vat_tu", label: "Mã vật tư", type: "lookup", placeholder: "Nhập mã vật tư..." },
        {
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Nhập kho", label: "Nhập kho" },
            { value: "Khác", label: "Khác" }
          ]
        },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text" },
        { key: "den_so", label: "Đến số", type: "text" },
        { key: "ma_kho_xuat", label: "Mã kho xuất", type: "lookup" },
        { key: "ma_kho_nhap", label: "Mã kho nhập", type: "lookup" },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" },],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VND/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'ma_khach', name: 'Mã khách', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'loai_phieu_nhap', 'chung_tu_tu_so', 'den_so', 'ma_kho_nhap', 'ma_kho_xuat',
      'ma_dvcs', 'mau_vnd_ngoai_te',
      'ma_dang_nx', 'ma_khach', 'ma_du_an'
    ]
  },

  bang_ke_phieu_xuat_mat_hang_khach_hang: {
    title: 'Bảng kê phiếu xuất của một mặt hàng theo khách hàng',
    defaultFormData: {
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      loai_phieu_nhap: "Tất cả",
      chung_tu_tu_so: "",
      den_so: "",
      ma_kho: "",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_vat_tu", label: "Mã vật tư", type: "lookup",
          placeholder: "Mã vật tư"
        },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text" },
        { key: "den_so", label: "Đến số", type: "text" },
        {
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Nhập kho", label: "Nhập kho" },
            { value: "Khác", label: "Khác" }
          ]
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VND/NT", type: "select",
          options: [
            { value: "VND", label: "VND" }
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'ma_kho_nhap', name: 'Mã kho nhập', checked: true, operator: 'like' },
      { id: 'ma_kho_xuat', name: 'Mã kho xuất', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'loai_phieu_nhap', 'chung_tu_tu_so', 'den_so', 'ma_kho',
      'ma_dvcs', 'mau_vnd_ngoai_te',
      'ma_dang_nx', 'ma_kho_nhap', 'ma_kho_xuat', 'ma_du_an'
    ]
  },

  bang_ke_phieu_xuat_khach_hang_mat_hang: {
    title: 'Bảng kê phiếu xuất của một khách hàng nhóm theo mặt hàng',
    defaultFormData: {
      ma_khach: "",
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      chung_tu_tu_so: "",
      den_so: "",
      ma_kho: "",
      loai_phieu_nhap: "Tất cả",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_khach",
          label: "Mã khách",
          type: "lookup",
          placeholder: "Mã khách, Tên khách hàng"
        },
        {
          key: "loai_phieu_nhap",
          label: "Loại phiếu nhập",
          type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Nhập kho", label: "Nhập kho" },
            { value: "Khác", label: "Khác" }
          ]
        },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text" },
        { key: "den_so", label: "Đến số", type: "text" },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [
            { value: "VND", label: "VND" }
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_khach', 'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'chung_tu_tu_so', 'den_so', 'ma_kho', 'loai_phieu_nhap',
      'ma_dvcs', 'mau_vnd_ngoai_te',
      'ma_dang_nx', 'ma_du_an',
      'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },

  tong_hop_hang_xuat_kho: {
    title: 'Tổng hợp hàng xuất kho',
    defaultFormData: {
      ma_khach: "",
      ma_vat_tu: "",
      ngay_ct1: "01-01-2025",
      ngay_ct2: "31-08-2025",
      loai_phieu_nhap: "",
      ma_kho: "",
      ps_dieu_chuyen: "Tính các ps điều chuyển",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_khach",
          label: "Mã khách hàng",
          type: "lookup",
          placeholder: "Mã khách, Tên khách hàng"
        },
        {
          key: "ma_vat_tu",
          label: "Mã vật tư",
          type: "lookup",
          placeholder: "Mã vật tư, Tên vật tư"
        },
        {
          key: "ma_kho",
          label: "Mã kho",
          type: "lookup"
        },
        {
          key: "loai_phieu_nhap",
          label: "Loại phiếu nhập",
          type: "text", // hoặc 'select' nếu cần gợi ý
          placeholder: "  "
        }
      ],
      rightBox1Keys: [
        {
          key: "ps_dieu_chuyen",
          label: "Ps Đ/Chuyển",
          type: "select",
          options: [
            { value: "Tính các ps điều chuyển", label: "Tính các ps điều chuyển" },
            { value: "Bỏ qua ps điều chuyển", label: "Bỏ qua ps điều chuyển" }
          ]
        },
        {
          key: "ma_dvcs",
          label: "Mã ĐVCS",
          type: "text_disabled"
        }
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [
            { value: "VND", label: "VND" }
          ]
        }
      ]
    },
    advancedFields: [
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ma_khach', 'ma_vat_tu', 'ngay_ct1', 'ngay_ct2',
      'loai_phieu_nhap', 'ma_kho', 'ps_dieu_chuyen', 'ma_dvcs',
      'mau_vnd_ngoai_te',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khht',
      'ma_du_an', 'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },

  //cấu hình tồn kho
  the_kho_chi_tiet_vat_tu: {
    title: 'Thẻ kho chi tiết vật tư',
    defaultFormData: {
      ma_vat_tu: "",
      ma_kho: "",
      ngay_ct1: "01-01-2025", // Converted to YYYY-MM-DD for date input compatibility
      ngay_ct2: "31-08-2025", // Converted to YYYY-MM-DD for date input compatibility
      ngay_lap_the: "28-08-2025",
      to_so: "",
      ngay_mo_so: "28-08-2025", // Converted to YYYY-MM-DD for date input compatibility
      ma_dvcs: "CTY", // Added based on image
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ma_vat_tu", label: "Mã vật tư", type: "lookup", placeholder: "(Mã vật tư, Tên vật tư, TK)" },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "ngay_lap_the", label: "Ngày lập thẻ", type: "date" },
        { key: "to_so", label: "Tờ số", type: "text" },
        { key: "ngay_mo_so", label: "Ngày mở sổ", type: "date" }
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" },
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [{ value: "VND", label: "VND" }]
        }
      ]
    },
    advancedFields: [
    ],
    submitFields: [
      'ma_vat_tu', 'ma_kho', 'ngay_ct1', 'ngay_ct2', 'ngay_lap_the', 'to_so',
      'ngay_mo_so', 'ma_dvcs', 'mau_vnd_ngoai_te',
    ]
  },

  tong_hop_nhap_xuat_ton: {
    title: 'Tổng hợp nhập xuất tồn',
    defaultFormData: {
      ngay_ct1: "01-01-2025", // Converted to YYYY-MM-DD for date input compatibility
      ngay_ct2: "31-08-2025", // Converted to YYYY-MM-DD for date input compatibility
      ma_kho: "",
      ma_vat_tu: "",
      v_tu_theo_doi_ton_kho: "*", // Default based on image
      ps_dieu_chuyen_kho: "Tính các ps điều chuyển",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "ma_vat_tu", label: "Mã vật tư", type: "lookup" },
        {
          key: "v_tu_theo_doi_ton_kho",
          label: "V.tư t.dõi tồn kho",
          type: "select",
          options: [
            { value: "0", label: "0 - Không" },
            { value: "1", label: "1 - Có" },
            { value: "*", label: "* - Cả hai" }
          ]
        }
      ],
      rightBox1Keys: [
        {
          key: "ps_dieu_chuyen_kho",
          label: "Ps đ/c kho",
          type: "select",
          options: [
            { value: "Tính các ps điều chuyển", label: "Tính các ps điều chuyển" },
            { value: "Bỏ qua ps điều chuyển", label: "Bỏ qua ps điều chuyển" }
          ]
        },
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" },
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [{ value: "VND", label: "VND" }]
        }
      ]
    },
    advancedFields: [
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'tk_gia_von', name: 'Tk giá vốn', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_kho', 'ma_vat_tu', 'v_tu_theo_doi_ton_kho',
      'ps_dieu_chuyen_kho', 'ma_dvcs', 'mau_vnd_ngoai_te',
      'tk_vat_tu_dmvt', 'tk_vat_tu_khht', 'tk_gia_von',
      'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },

  tong_hop_nhap_xuat_ton_quy_doi: {
    title: 'Tổng hợp nhập xuất tồn quy đổi',
    defaultFormData: {
      ngay_ct1: "01-01-2025", // Converted to YYYY-MM-DD for date input compatibility
      ngay_ct2: "31-08-2025", // Converted to YYYY-MM-DD for date input compatibility
      ma_kho: "",
      ma_vat_tu: "",
      v_tu_theo_doi_ton_kho: "*", // Default based on image
      ps_dieu_chuyen_kho: "Tính các ps điều chuyển",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "ma_vat_tu", label: "Mã vật tư", type: "lookup" },
        {
          key: "v_tu_theo_doi_ton_kho",
          label: "V.tư t.dõi tồn kho",
          type: "select",
          options: [
            { value: "0", label: "0 - Không" },
            { value: "1", label: "1 - Có" },
            { value: "*", label: "* - Cả hai" }
          ]
        }
      ],
      rightBox1Keys: [
        {
          key: "ps_dieu_chuyen_kho",
          label: "Ps đ/c kho",
          type: "select",
          options: [
            { value: "Tính các ps điều chuyển", label: "Tính các ps điều chuyển" },
            { value: "Bỏ qua ps điều chuyển", label: "Bỏ qua ps điều chuyển" }
          ]
        },
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" },
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [{ value: "VND", label: "VND" }]
        }
      ]
    },
    advancedFields: [
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'tk_gia_von', name: 'Tk giá vốn', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_kho', 'ma_vat_tu', 'v_tu_theo_doi_ton_kho',
      'ps_dieu_chuyen_kho', 'ma_dvcs', 'mau_vnd_ngoai_te',
      'tk_vat_tu_dmvt', 'tk_vat_tu_khht', 'tk_gia_von',
      'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },

  tong_hop_chi_tiet_vat_tu: {
    title: 'Tổng hợp chi tiết vật tư',
    defaultFormData: {
      ngay_ct1: "01-01-2025", // Converted to YYYY-MM-DD for date input compatibility
      ngay_ct2: "31-08-2025", // Converted to YYYY-MM-DD for date input compatibility
      ma_kho: "",
      ma_vat_tu: "",
      ps_dieu_chuyen_kho: "Tính các ps điều chuyển",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "ma_vat_tu", label: "Mã vật tư", type: "lookup" }
      ],
      rightBox1Keys: [
        {
          key: "ps_dieu_chuyen_kho",
          label: "Ps đ/c kho",
          type: "select",
          options: [
            { value: "Tính các ps điều chuyển", label: "Tính các ps điều chuyển" },
            { value: "Bỏ qua ps điều chuyển", label: "Bỏ qua ps điều chuyển" }
          ]
        },
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" },
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [{ value: "VND", label: "VND" }]
        }
      ]
    },
    advancedFields: [
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'tk_gia_von', name: 'Tk giá vốn', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_kho', 'ma_vat_tu',
      'ps_dieu_chuyen_kho', 'ma_dvcs', 'mau_vnd_ngoai_te',
      'tk_vat_tu_dmvt', 'tk_vat_tu_khht', 'tk_gia_von',
      'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },

  bao_cao_ton_kho: {
    title: 'Báo cáo tồn kho',
    defaultFormData: {
      ngay_ct2: "31-08-2025", // Converted to YYYY-MM-DD for date input compatibility
      ma_kho: "",
      ma_vat_tu: "",
      ma_dvcs: "CTY",
      mau_vnd_ngoai_te: "VND"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "ma_kho", label: "Mã kho", type: "lookup" },
        { key: "ma_vat_tu", label: "Mã vật tư", type: "lookup" }
      ],
      rightBox1Keys: [
        // "Ps điều chuyển kho" is missing from this form
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled" },
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te",
          label: "Mẫu VND/NT",
          type: "select",
          options: [{ value: "VND", label: "VND" }]
        }
      ]
    },
    advancedFields: [
      { id: 'tai_khoan_vat_tu', name: 'Tài khoản vật tư', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct2', 'ma_kho', 'ma_vat_tu',
      'ma_dvcs', 'mau_vnd_ngoai_te',
      'tai_khoan_vat_tu',
      'nhom_vat_tu1', 'nhom_vat_tu2', 'nhom_vat_tu3'
    ]
  },
};


// Helper function để lấy config theo key
export const getFilterConfig = (configKey) => {
  return FILTER_CONFIGS[configKey] || null;
};


// Helper function để validate submit data theo config
export const validateSubmitData = (configKey, data) => {
  const config = getFilterConfig(configKey);
  if (!config) return { isValid: false, errors: ['Config không tồn tại'] };

  const errors = [];
  const submitData = {};

  // Chỉ lấy các field được định nghĩa trong submitFields
  config.submitFields.forEach(fieldKey => {
    if (data.hasOwnProperty(fieldKey)) {
      submitData[fieldKey] = data[fieldKey];
    }
  });

  // Validate required fields
  const allFields = [
    ...(config.searchFields.mainFieldKeys || []),
    ...(config.searchFields.rightBox1Keys || []),
    ...(config.searchFields.rightBox2Keys || [])
  ];

  allFields.forEach(field => {
    if (
      field.required &&
      (!submitData[field.key] || submitData[field.key].toString().trim() === "")
    ) {
      errors.push(`${field.label} là bắt buộc`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    submitData
  };
};