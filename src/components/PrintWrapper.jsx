import { forwardRef } from 'react';
import { printTemplates } from '../services/printTemplates';


const PrintWrapper = forwardRef(({
    reportType,
    dataTable,
    filterInfo,
    totals
}, ref) => {
    const getTemplate = (type) => {
        switch (type?.toLowerCase()) {
            case 'so-quy':
                return printTemplates.cashBook;
            case 'inventory':
                return printTemplates.detailedCashLedger;
            case 'inventory-detail':
                return printTemplates.soTienGui;
            case 'import-export-summary':
                return printTemplates.soChiTiet;
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