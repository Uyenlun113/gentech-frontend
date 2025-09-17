import { forwardRef } from 'react';
import { printTemplatesMuaHang } from '../services/printTemplatesMuaHang';


const PrintWrapperMuaHang = forwardRef(({
    reportType,
    dataTable,
    filterInfo,
    totals
}, ref) => {
    // Chọn template dựa trên reportType
    const getTemplate = (type) => {

        switch (type?.toLowerCase()) {
            case 'bang_ke_phieu_nhap':
                return printTemplatesMuaHang.bang_ke_phieu_nhap;
            case 'bang_ke_hoa_don_mua_hang_va_dich_vu':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_phieu_xuat_tra_lai_nha_cung_cap':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_phieu_nhap_cua_mot_mat_hang':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_nha_cung_cap':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_phieu_nhap_cua_mot_mat_hang_nhom_theo_dang_nhap_mua':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_phieu_nhap_cua_mot_nha_cung_cap_nhom_theo_mat_hang':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bao_cao_tong_hop_hang_nhap_mua':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_chung_tu':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_chung_tu_theo_nha_cung_cap':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'tong_hop_so_phat_sinh_theo_nha_cung_cap':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'tra_so_du_cong_no_cua_mot_nha_cung_cap':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'so_chi_tiet_cong_no_cua_mot_nha_cung_cap':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'so_doi_chieu_cong_no':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'so_chi_tiet_cong_no_len_tat_ca_nha_cung_cap':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_don_hang':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bao_cao_thuc_hien_don_hang':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bao_cao_tinh_hinh_thuc_hien_ke_hoach_don_hang':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'so_chi_tiet_don_hang':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            case 'bang_ke_chung_tu_phat_sinh_theo_don_hang':
                return printTemplatesMuaHang.bang_ke_hoa_don_mua_hang_va_dich_vu;
            default:
                return printTemplatesMuaHang.default;
        }
    };

    const selectedTemplate = getTemplate(reportType);

    const htmlContent = selectedTemplate(dataTable, filterInfo, totals);

    return (
        <div
            ref={ref}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{ display: 'none' }}
            className="print-content"
        />
    );
});

PrintWrapperMuaHang.displayName = 'PrintWrapperMuaHang';

export default PrintWrapperMuaHang;