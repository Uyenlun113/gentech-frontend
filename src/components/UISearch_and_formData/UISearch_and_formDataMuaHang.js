export const FILTER_CONFIGS = {
  // Báo cáo hàng nhập mua
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
          key: "mau_bao_cao", label: "Mẫu báo cáo", type: "select",
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
    title: 'Bảng kê hóa đơn mua hàng và dịch vụ',
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
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'ma_ct', name: 'Mã chứng từ', checked: true, operator: 'like' },
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
    title: 'Bảng kê phiếu xuất trả lại nhà cung cấp',
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
    title: 'Bảng kê phiếu nhập của một mặt hàng',
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
    title: 'Bảng kê phiếu nhập của một mặt hàng nhóm theo nhà cung cấp',
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
    title: 'Bảng kê phiếu nhập của một mặt hàng nhóm theo đang nhập mua',
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
          key: "ma_kho", label: "Mã kho", type: "lookup", placeholder: "Nhập mã kho...",
          valueKey: "ma_kho", displayKey: "ten_kho", popupTitle: "Chọn kho", emptyMessage: "Không tìm thấy kho",
          searchConfig: { searchType: "warehouse", fields: ["ma_kho", "ten_kho"] }
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
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VNĐ/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        },
        {
          key: "mau_bao_cao", label: "Mẫu báo cáo", type: "select",
          options: [
            { value: "Mẫu thường", label: "Mẫu thường" }
          ]
        },
      ]
    },
    advancedFields: [
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'ma_khach', name: 'Mã khách', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_dvcs', 'chung_tu_tu_so', 'den_so',
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap',
      'mau_vnd_ngoai_te', 'mau_bao_cao',
      'ma_dang_nx', 'ma_du_an', 'ma_khach'
    ]
  },
  bang_ke_phieu_nhap_cua_mot_nha_cung_cap_nhom_theo_mat_hang: {
    title: 'Bảng kê phiếu nhập của một nhà cung cấp nhóm theo mặt hàng',
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
          key: "ma_kho", label: "Mã kho", type: "lookup", placeholder: "Nhập mã kho...",
          valueKey: "ma_kho", displayKey: "ten_kho", popupTitle: "Chọn kho", emptyMessage: "Không tìm thấy kho",
          searchConfig: { searchType: "warehouse", fields: ["ma_kho", "ten_kho"] }
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
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VNĐ/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        },
        {
          key: "mau_bao_cao", label: "Mẫu báo cáo", type: "select",
          options: [
            { value: "Mẫu thường", label: "Mẫu thường" }
          ]
        },
      ]
    },
    advancedFields: [
      { id: 'tk_vat_tu', name: 'Tk vật tư', checked: true, operator: 'like' },
      { id: 'ma_dang_nx', name: 'Mã dạng nx', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'ma_vat_tu', name: 'Mã vật tư', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_dvcs', 'chung_tu_tu_so', 'den_so',
      'ma_khach', 'ma_kho', 'loai_phieu_nhap',
      'mau_vnd_ngoai_te', 'mau_bao_cao',
      'ma_dang_nx', 'ma_du_an', 'ma_khach'
    ]
  },
  bao_cao_tong_hop_hang_nhap_mua: {
    title: 'Báo cáo tổng hợp hàng nhập mua',
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
        },
        {
          key: "ma_kho", label: "Mã kho", type: "lookup", placeholder: "Nhập mã kho...",
          valueKey: "ma_kho", displayKey: "ten_kho", popupTitle: "Chọn kho", emptyMessage: "Không tìm thấy kho",
          searchConfig: { searchType: "warehouse", fields: ["ma_kho", "ten_kho"] }
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VNĐ/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        },
        {
          key: "mau_bao_cao", label: "Mẫu báo cáo", type: "select",
          options: [
            { value: "Mẫu thường", label: "Mẫu thường" }
          ]
        },
      ]
    },
    advancedFields: [
      { id: 'tk_vat_tu_dmvt', name: 'Tk vật tư (Dmvt)', checked: true, operator: 'like' },
      { id: 'tk_vat_tu_khi_ht', name: 'Tk vật tư (khi ht)', checked: true, operator: 'like' },
      { id: 'ma_dang_nx', name: 'Mã nx', checked: true, operator: 'like' },
      { id: 'ma_du_an', name: 'Mã dự án', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_1', name: 'Nhóm vật tư 1', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_2', name: 'Nhóm vật tư 2', checked: true, operator: 'like' },
      { id: 'nhom_vat_tu_3', name: 'Nhóm vật tư 3', checked: true, operator: 'like' }
    ],
    submitFields: [
      'ngay_ct1', 'ngay_ct2', 'ma_dvcs', 'chung_tu_tu_so', 'den_so',
      'ma_khach', 'ma_kho', 'loai_phieu_nhap',
      'mau_vnd_ngoai_te', 'mau_bao_cao',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },

  //Báo cáo công nợ Nhà cung cấp
  bang_ke_chung_tu: {
    title: 'Bảng kê chứng từ',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: "",
      ghi_no_co: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text", placeholder: "Nhập số chứng từ..." },
        { key: "den_so", label: "Đến số", type: "text", placeholder: "Nhập đến số..." },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        { key: "ghi_no_co", label: "Ghi nợ/có/*", type: "text", placeholder: "1 nợ, 2 có, 3 *" },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
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
    title: 'Bảng kê chứng từ theo nhà cung cấp',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: "",
      ghi_no_co: "",
      loai_bao_cao: "1"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text", placeholder: "Nhập số chứng từ..." },
        { key: "den_so", label: "Đến số", type: "text", placeholder: "Nhập đến số..." },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        { key: "ghi_no_co", label: "Ghi nợ/có/*", type: "text", placeholder: "1 nợ, 2 có, 3 *" },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },

      ],
      rightBox2Keys: [
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VNĐ/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        },
        {
          key: "loai_bao_cao", label: "Loại báo cáo", type: "select",
          options: [
            { value: "1", label: "Theo TK đối ứng" },
            { value: "2", label: "Theo tiểu khoản" }
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
      'mau_vnd_ngoai_te', 'kieu_loc', 'ma_tai_khoan', 'ghi_no_co', 'loai_bao_cao',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  tong_hop_so_phat_sinh_theo_nha_cung_cap: {
    title: 'Tổng hợp số phát sinh theo nhà cung cấp',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: "",
      ghi_no_co: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text", placeholder: "Nhập số chứng từ..." },
        { key: "den_so", label: "Đến số", type: "text", placeholder: "Nhập đến số..." },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        { key: "ghi_no_co", label: "Ghi nợ/có/*", type: "text", placeholder: "1 nợ, 2 có, 3 *" },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
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
      'mau_vnd_ngoai_te', 'kieu_loc', 'ma_tai_khoan', 'ghi_no_co',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  tra_so_du_cong_no_cua_mot_nha_cung_cap: {
    title: 'Tra số dư công nợ của một nhà cung cấp',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: "",
      ngay: ""
    },
    searchFields: {
      mainFieldKeys: [
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },
        { key: "ngay", label: "Ngày", type: "date", required: true },

        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
        {
          key: "mau_vnd_ngoai_te", label: "Mẫu VNĐ/NT", type: "select",
          options: [
            { value: "VND", label: "VND" },
          ]
        }
      ],
      rightBox1Keys: [
      ],
      rightBox2Keys: [
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
      'mau_vnd_ngoai_te', 'kieu_loc', 'ma_tai_khoan', 'ngay',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  so_chi_tiet_cong_no_cua_mot_nha_cung_cap: {
    title: 'Sổ chi tiết công nợ của một nhà cung cấp',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: "",
      chi_tiet_theo_hang_hoa: "co"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },

      ],
      rightBox2Keys: [
        {
          key: "chi_tiet_theo_hang_hoa", label: "C/t theo HH", type: "select",
          options: [
            { value: "co", label: "Có" },
            { value: "khong", label: "Không" }
          ]
        },
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
      'mau_vnd_ngoai_te', 'kieu_loc', 'ma_tai_khoan', 'chi_tiet_theo_hang_hoa',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  so_doi_chieu_cong_no: {
    title: 'Sổ đối chiếu công nợ',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: "",
      phieu_kt: "1"
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },
        { key: "phieu_kt", label: "Phiếu kế toán", type: "text", required: true, placeholder: "1-lấy diễn giải chung, 2-lấy diễn giải chi tiết" },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },

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
      'mau_vnd_ngoai_te', 'kieu_loc', 'ma_tai_khoan', 'phieu_kt',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  so_chi_tiet_cong_no_len_tat_ca_nha_cung_cap: {
    title: 'Sổ chi tiết công nợ lên tất cả nhà cung cấp',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },

      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },

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
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap', 'ma_tai_khoan',
      'mau_vnd_ngoai_te', 'kieu_loc',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },

  //Báo cáo đơn hàng
  bang_ke_don_hang: {
    title: 'Bảng kê đơn hàng',
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
      kieu_loc: "Tất cả các vật tư trọn",
      so_dh: "",
      ma_kho: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true }, {
          key: "loai_phieu_nhap", label: "Loại phiếu nhập", type: "select",
          options: [
            { value: "Tất cả", label: "Tất cả" },
            { value: "Phiếu nhập", label: "Phiếu nhập" },
            { value: "Phiếu xuất", label: "Phiếu xuất" }
          ]
        },
        { key: "so_dh", label: "Số đơn hàng", type: "text", required: true },

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
          key: "ma_kho", label: "Mã kho", type: "lookup", placeholder: "Nhập mã kho...",
          valueKey: "ma_kho", displayKey: "ten_kho", popupTitle: "Chọn kho", emptyMessage: "Không tìm thấy kho",
          searchConfig: { searchType: "warehouse", fields: ["ma_kho", "ten_kho"] }
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
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
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap', 'so_dh', 'ma_kho',
      'mau_vnd_ngoai_te', 'kieu_loc',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  bao_cao_thuc_hien_don_hang: {
    title: 'Báo cáo thực hiện đơn hàng',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ngay_dh1: "01-01-2025",
      ngay_dh2: "31-08-2025",
      so_dh: "",
      ma_kho: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_dh1", label: "Đơn hàng từ ngày", type: "date", required: true },
        { key: "ngay_dh2", label: "Đến ngày", type: "date", required: true },
        { key: "ngay_ct1", label: "Chứng từ từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },
        { key: "so_dh", label: "Số đơn hàng", type: "text", required: true },
        {
          key: "ma_kho", label: "Mã kho", type: "lookup", placeholder: "Nhập mã kho...",
          valueKey: "ma_kho", displayKey: "ten_kho", popupTitle: "Chọn kho", emptyMessage: "Không tìm thấy kho",
          searchConfig: { searchType: "warehouse", fields: ["ma_kho", "ten_kho"] }
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
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
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap', 'ngay_dh1', 'ngay_dh2', 'so_dh', 'ma_kho',
      'mau_vnd_ngoai_te', 'kieu_loc',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  bao_cao_tinh_hinh_thuc_hien_ke_hoach_don_hang: {
    title: 'Báo cáo tình hình thực hiện kế hoạch đơn hàng',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ngay_dh1: "01-01-2025",
      ngay_dh2: "31-08-2025",
      so_dh: "",
      ma_kho: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_dh1", label: "Đơn hàng từ ngày", type: "date", required: true },
        { key: "ngay_dh2", label: "Đến ngày", type: "date", required: true },
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        {
          key: "ma_khach", label: "Mã khách", type: "lookup", placeholder: "Nhập mã kh...",
          valueKey: "ma_khach", displayKey: "ten_khach", popupTitle: "Chọn khách hàng", emptyMessage: "Không tìm thấy khách hàng",
          searchConfig: { searchType: "customer", fields: ["ma_khach", "ten_khach"] }
        },
        { key: "so_dh", label: "Số đơn hàng", type: "text", required: true },
        {
          key: "ma_kho", label: "Mã kho", type: "lookup", placeholder: "Nhập mã kho...",
          valueKey: "ma_kho", displayKey: "ten_kho", popupTitle: "Chọn kho", emptyMessage: "Không tìm thấy kho",
          searchConfig: { searchType: "warehouse", fields: ["ma_kho", "ten_kho"] }
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
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
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap', 'ngay_dh1', 'ngay_dh2', 'so_dh', 'ma_kho',
      'mau_vnd_ngoai_te', 'kieu_loc',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  so_chi_tiet_don_hang: {
    title: 'Sổ chi tiết đơn hàng',
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
      kieu_loc: "Tất cả các vật tư trọn",
      so_dh: "",
      ma_tai_khoan: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "so_dh", label: "Số đơn hàng", type: "text", required: true },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
      ],
      rightBox1Keys: [
        { key: "ma_dvcs", label: "Mã ĐVCS", type: "text_disabled", placeholder: "Nhập mã đơn vị..." },
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
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap', 'so_dh', 'ma_tai_khoan',
      'mau_vnd_ngoai_te', 'kieu_loc',
      'ma_dang_nx', 'tk_vat_tu_dmvt', 'tk_vat_tu_khi_ht',
      'ma_kho', 'ma_phan_xuong', 'ma_du_an',
      'nhom_vat_tu_1', 'nhom_vat_tu_2', 'nhom_vat_tu_3',
    ]
  },
  bang_ke_chung_tu_phat_sinh_theo_don_hang: {
    title: 'Bảng kê chứng từ phát sinh theo đơn hàng',
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
      kieu_loc: "Tất cả các vật tư trọn",
      ma_tai_khoan: "",
      ghi_no_co: "",
      ma_tai_khoan_du: ""
    },
    searchFields: {
      mainFieldKeys: [
        { key: "ngay_ct1", label: "Từ ngày", type: "date", required: true },
        { key: "ngay_ct2", label: "Đến ngày", type: "date", required: true },
        { key: "chung_tu_tu_so", label: "Chứng từ từ số", type: "text", placeholder: "Nhập số chứng từ..." },
        { key: "den_so", label: "Đến số", type: "text", placeholder: "Nhập đến số..." },
        {
          key: "ma_tai_khoan",
          label: "Mã tài khoản",
          type: "lookup",
          placeholder: "Nhập mã tài khoản...",
          valueKey: "ma_tai_khoan",
          displayKey: "ten_tai_khoan",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan", "ten_tai_khoan"]
          }
        },
        
        { key: "ghi_no_co", label: "Ghi nợ/có/*", type: "text", placeholder: "1 nợ, 2 có, 3 *" },
        {
          key: "ma_tai_khoan_du",
          label: "Tài khoản đối ứng",
          type: "lookup",
          placeholder: "Nhập tài khoản đối ứng...",
          valueKey: "ma_tai_khoan_du",
          displayKey: "ten_tai_khoan_du",
          popupTitle: "Chọn tài khoản",
          emptyMessage: "Không tìm thấy tài khoản",
          searchConfig: {
            searchType: "account",
            fields: ["ma_tai_khoan_du", "ten_tai_khoan_du"]
          }
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
      'ma_khach', 'ma_vat_tu', 'loai_phieu_nhap', 'ma_tai_khoan', 'ghi_no_co', 'ma_tai_khoan_du',
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