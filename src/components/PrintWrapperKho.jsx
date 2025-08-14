import { forwardRef } from 'react';
import { printTemplatesKho } from '../services/printTemplatesKho';


const PrintWrapperKho = forwardRef(({
    reportType,
    dataTable,
    filterInfo,
    totals
}, ref) => {
    // Chọn template dựa trên reportType
    const getTemplate = (type) => {

        switch (type?.toLowerCase()) {
            case 'bang_ke_phieu_nhap':
                return printTemplatesKho.bang_ke_phieu_nhap;
            case 'bang_ke_phieu_nhap_mat_hang':
                return printTemplatesKho.bang_ke_phieu_nhap_mat_hang;
            case 'bang_ke_phieu_nhap_mat_hang_ncc':
                return printTemplatesKho.bang_ke_phieu_nhap_mat_hang_ncc;
            case 'bang_ke_phieu_nhap_ncc_mat_hang':
                return printTemplatesKho.bang_ke_phieu_nhap_ncc_mat_hang;
            case 'tong_hop_hang_nhap_kho':
                return printTemplatesKho.tong_hop_hang_nhap_kho;
            case 'bang_ke_phieu_xuat':
                return printTemplatesKho.bang_ke_phieu_xuat;
            case 'bang_ke_phieu_xuat_mat_hang':
                return printTemplatesKho.bang_ke_phieu_xuat_mat_hang;
            case 'bang_ke_phieu_xuat_mat_hang_khach_hang':
                return printTemplatesKho.bang_ke_phieu_xuat_mat_hang_khach_hang;
            case 'bang_ke_phieu_xuat_khach_hang_mat_hang':
                return printTemplatesKho.bang_ke_phieu_xuat_khach_hang_mat_hang;
            case 'tong_hop_hang_xuat_kho':
                return printTemplatesKho.tong_hop_hang_xuat_kho;
            case 'the_kho_chi_tiet_vat_tu':
                return printTemplatesKho.the_kho_chi_tiet_vat_tu;
            case 'tong_hop_nhap_xuat_ton':
                return printTemplatesKho.tong_hop_nhap_xuat_ton;
            case 'tong_hop_nhap_xuat_ton_quy_doi':
                return printTemplatesKho.tong_hop_nhap_xuat_ton_quy_doi;
            case 'tong_hop_chi_tiet_vat_tu':
                return printTemplatesKho.tong_hop_chi_tiet_vat_tu;
            case 'bao_cao_ton_kho':
                return printTemplatesKho.bao_cao_ton_kho;
            default:
                return printTemplatesKho.default;
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

PrintWrapperKho.displayName = 'PrintWrapperKho';

export default PrintWrapperKho;