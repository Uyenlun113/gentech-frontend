import "flatpickr/dist/flatpickr.min.css";
import { ArrowLeft, PrinterIcon, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PrintWrapper from "../../components/PrintWrapper";
import { ShowMoreTables } from "../../components/tables/ShowMoreTables";
import Button from "../../components/ui/button/Button";
import { useTablePrintKho } from "./useTablePrintKho";

export default function TablePrintKho() {
    const location = useLocation();
    const navigate = useNavigate();
    const { columnsTable } = useTablePrintKho();
    const printRef = useRef();

    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterInfo, setFilterInfo] = useState(null);
    const [reportName, setReportName] = useState('Danh sách kho');
    const [reportType, setReportType] = useState('kho');
    const [totals, setTotals] = useState({});

    // Hàm in sử dụng react-to-print
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: reportName,
        pageStyle: `
            @page {
                size: A4 landscape;
                margin: 0.5in;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .no-print {
                    display: none !important;
                }
                .print-content {
                    display: block !important;
                }
            }
            @media screen {
                .print-content {
                    display: none !important;
                }
            }
        `,
        onBeforeGetContent: () => {
            return Promise.resolve();
        },
        onAfterPrint: () => {
            console.log('Print completed for report type:', reportType);
        }
    });

    useEffect(() => {
        if (location.state) {
            const {
                data: wrappedData,
                filterData,
                reportName: name,
                reportType: type,
            } = location.state;
            const rawData = wrappedData?.data || [];
            const totalsData = wrappedData?.totals?.[0] || {};

            if (Array.isArray(rawData)) {
                const mappedData = rawData.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                    ma_kho: item.ma_kho,
                    ten_kho: item.ten_kho,
                    dia_chi: item.dia_chi,
                    nguoi_quan_ly: item.nguoi_quan_ly,
                }));

                setDataTable(mappedData);
                setFilterInfo(filterData);
                setReportName(name || "Danh sách kho");
                setReportType(type || "kho");
                setTotals(totalsData);
            } else {
                setDataTable([]);
            }
        } else {
            setDataTable([]);
        }
    }, [location.state]);

    const handleRefresh = () => {
        if (filterInfo) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="px-4">
                <PageMeta title={reportName} description={reportName} />
                <PageBreadcrumb pageTitle={reportName} />
                <div className="space-y-6">
                    <ComponentCard>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleGoBack}
                                    size="sm"
                                    variant="outline"
                                    startIcon={<ArrowLeft className="size-4" />}
                                >
                                    Quay lại
                                </Button>

                                <Button
                                    onClick={handleRefresh}
                                    size="sm"
                                    variant="outline"
                                    startIcon={<RefreshCw className="size-4" />}
                                    disabled={loading}
                                >
                                    Làm mới
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        if (dataTable.length === 0) {
                                            alert('Không có dữ liệu để in!');
                                            return;
                                        }
                                        handlePrint();
                                    }}
                                    size="sm"
                                    variant="secondary"
                                    startIcon={<PrinterIcon className="size-4" />}
                                >
                                    In danh sách kho
                                </Button>
                            </div>
                        </div>

                        {dataTable.length > 0 ? (
                            <ShowMoreTables
                                dataTable={dataTable}
                                columnsTable={columnsTable}
                                loading={loading}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">Không có dữ liệu</div>
                                <div className="text-gray-500 text-sm">
                                    Vui lòng chọn điều kiện lọc và thử lại
                                </div>
                                <Button
                                    onClick={handleGoBack}
                                    size="sm"
                                    variant="primary"
                                    className="mt-4"
                                    startIcon={<ArrowLeft className="size-4" />}
                                >
                                    Quay lại chọn danh sách kho
                                </Button>
                            </div>
                        )}
                    </ComponentCard>
                </div >
            </div >

            <PrintWrapper
                ref={printRef}
                reportType={reportType}
                dataTable={dataTable}
                filterInfo={filterInfo}
                totals={totals}
            />
        </>
    );
}
