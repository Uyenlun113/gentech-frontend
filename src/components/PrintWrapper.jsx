import { forwardRef } from 'react';
import { printBcDonBanHang } from '../services/printBcDonBanHang';
import { printTemplates } from '../services/printTemplates';


const PrintWrapper = forwardRef(({
    reportType,
    dataTable,
    data1,
    data2,
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
            case 'import-plan':
                return printBcDonBanHang.invoiceSummary;
            default:
                return printTemplates.default;
        }
    };

    const selectedTemplate = getTemplate(reportType);

    let htmlContent;
    if (reportType?.toLowerCase() === 'import-plan') {
        htmlContent = selectedTemplate(data1, data2, filterInfo, totals);
    } else {
        htmlContent = selectedTemplate(dataTable, filterInfo, totals);
    }


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