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
            case 'customer-summary':
                return printBcDonBanHang.invoiceByCustomerSummary;
            case 'cost-analysis':
                return printBcDonBanHang.costAnalysisReport;
            case 'performance-report':
                return printBcDonBanHang.performanceReport;
            case 'turnover-analysis':
                return printBcDonBanHang.turnoverAnalysisReport;
            case 'abc-analysis':
                return printBcDonBanHang.abcAnalysisReport;

            default:
                return printTemplates.default;
        }
    };

    const selectedTemplate = getTemplate(reportType);

    let htmlContent;
    if (reportType?.toLowerCase() === 'import-plan') {
        htmlContent = selectedTemplate(data1, data2, filterInfo);
    } else if (reportType?.toLowerCase() === 'export-plan') {
        htmlContent = selectedTemplate(data1, filterInfo, totals);
    } else if (reportType?.toLowerCase() === 'inventory2') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    } else if (reportType?.toLowerCase() === 'inventory-detail2') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    } else if (reportType?.toLowerCase() === 'import-export-summary2') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    } else if (reportType?.toLowerCase() === 'import-export-detail') {
        htmlContent = selectedTemplate(data2, filterInfo, totals);
    } else if (reportType?.toLowerCase() === 'customer-summary') {
        htmlContent = selectedTemplate(data1, data2, filterInfo);
    } else if (reportType?.toLowerCase() === 'cost-analysis') {
        htmlContent = selectedTemplate(data1, data2, filterInfo);
    } else if (reportType?.toLowerCase() === 'performance-report') {
        htmlContent = selectedTemplate(data1, data2, filterInfo);
    } else if (reportType?.toLowerCase() === 'turnover-analysis') {
        htmlContent = selectedTemplate(data1, data2, filterInfo);
    } else if (reportType?.toLowerCase() === 'abc-analysis') {
        htmlContent = selectedTemplate(data1, data2, filterInfo);
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