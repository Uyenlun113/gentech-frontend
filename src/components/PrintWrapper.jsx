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
        console.log(type);
        switch (type?.toLowerCase()) {
            case 'so-quy':
                return printTemplates.cashBook;
            case 'inventory':
                return printTemplates.detailedCashLedger;
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