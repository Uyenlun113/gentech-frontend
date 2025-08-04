import { forwardRef } from 'react';
import { printTemplates } from '../services/printTemplates';


// Component wrapper để render template HTML
const PrintWrapper = forwardRef(({
    reportType,
    dataTable,
    filterInfo,
    totals
}, ref) => {
    // Chọn template dựa trên reportType
    const getTemplate = (type) => {
        switch (type?.toLowerCase()) {
            case 'cashbook':
            case 'so-quy':
            case 'sổ quỹ tiền mặt':
                return printTemplates.cashBook;
            case 'balancesheet':
            case 'bang_can_doi':
            case 'bảng cân đối kế toán':
                return printTemplates.balanceSheet;
            default:
                return printTemplates.default;
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

PrintWrapper.displayName = 'PrintWrapper';

export default PrintWrapper;