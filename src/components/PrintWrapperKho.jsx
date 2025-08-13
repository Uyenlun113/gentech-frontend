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
            case 'inventory-detail':
                return printTemplatesKho.soTienGui;
            case 'import-export-summary':
                return printTemplatesKho.soChiTiet;
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