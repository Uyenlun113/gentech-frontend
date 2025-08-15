import { forwardRef } from 'react';
import { printBcDonBanHang } from '../services/printBcDonBanHang';
import { printTemplates } from '../services/printTemplates';


const PrintWrapper = forwardRef(({
    reportType,
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
            case 'export-plan':
                return printBcDonBanHang.salesAndServiceInvoice;
            case 'inventory2':
                return printBcDonBanHang.invoiceOfAnItem;
            case 'inventory-detail2':
                return printBcDonBanHang.invoiceByCustomerGroup;
            case 'import-export-summary2':
                return printBcDonBanHang.invoiceBySales;
            case 'import-export-detail':
                return printBcDonBanHang.invoiceByCustomerProductGroup;

            default:
                return printTemplates.default;
        }
    };

    const selectedTemplate = getTemplate(reportType);

    let htmlContent;
    if (reportType?.toLowerCase() === 'import-plan') {
        htmlContent = selectedTemplate(data1, data2, filterInfo, totals);
    } if (reportType?.toLowerCase() === 'export-plan') {
        htmlContent = selectedTemplate(data1, filterInfo, totals);
    }
    if (reportType?.toLowerCase() === 'inventory2') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    }
    if (reportType?.toLowerCase() === 'inventory-detail2') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    }
    if (reportType?.toLowerCase() === 'import-export-summary2') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    }
    if (reportType?.toLowerCase() === 'import-export-detail') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    }
    else {
        htmlContent = selectedTemplate(data1, filterInfo, totals);
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