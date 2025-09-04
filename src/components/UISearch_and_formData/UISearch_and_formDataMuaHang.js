export const FILTER_CONFIGS = {
  // Báo cáo hàng nhập mua
  bang_ke_phieu_nhap: {
    title: 'Bảng kê phiếu nhập',
    defaultFormData: {
      ngay_ct1: "",
      ngay_ct2: "31-08-2025",
      ma_dvcs: "CTY",
      chung_tu_tu_so: "",
      den_so: "",
      ma_khach: "",
      ma_vat_tu: "",
      loai_phieu_nhap: "",
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
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "text", placeholder: "1: Nhập mua, 2: Nhập khẩu, 3: Nhập chi phí"
        },
        {
          key: "ma_kho", label: "Mã kho", type: "lookup", placeholder: "Nhập mã kho...",
          valueKey: "ma_kho", displayKey: "ten_kho", popupTitle: "Chọn kho", emptyMessage: "Không tìm thấy kho",
          searchConfig: { searchType: "warehouse", fields: ["ma_kho", "ten_kho"] }
        },
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
        },
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu báo cáo", type: "select",
          options: [
            { value: "mauthuong", label: "Mẫu thường" },
            { value: "maunhapmua", label: "Mẫu nhập mua" },
            { value: "maunhapkhau", label: "Mẫu nhập khẩu" },
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
  bang_ke_hoa_don_mua_hang_va_dich_vu: {
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
  bang_ke_phieu_xuat_tra_lai_nha_cung_cap: {
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
  bang_ke_phieu_nhap_cua_mot_mat_hang: {
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
  bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_nha_cung_cap: {
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
  bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_dang_nhap_mua: {
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
  bang_ke_phieu_nhap_cua_mot_nha_cung_cap_nhom_theo_mat_hang: {
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
  bao_cao_tong_hop_hang_nhap_mua: {
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

  //Báo cáo công nợ Nhà cung cấp
  bang_ke_chung_tu: {
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
  bang_ke_chung_tu_theo_nha_cung_cap: {
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
  tong_hop_so_phat_sinh_theo_nha_cung_cap: {
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
  tra_so_du_cong_no_cua_mot_nha_cung_cap: {
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
  so_chi_tiet_cong_no_cua_mot_nha_cung_cap: {
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
  so_doi_chieu_cong_no: {
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
  so_chi_tiet_cong_no_len_tat_ca_nha_cung_cap: {
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

  //Báo cáo đơn hàng
  bang_ke_don_hang: {
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
  bao_cao_thuc_hien_don_hang: {
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
  bao_cao_tinh_hinh_thuc_hien_ke_hoach_don_hang: {
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
  so_chi_tiet_don_hang: {
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
  bang_ke_chung_tu_phat_sinh_theo_don_hang: {
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