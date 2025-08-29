import "flatpickr/dist/flatpickr.min.css";
import { ArrowLeft, PrinterIcon, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PrintWrapperKho from "../../components/PrintWrapperKho.jsx";
import { ShowMoreTables } from "../../components/tables/ShowMoreTables";
import Button from "../../components/ui/button/Button";
import { useTablePrintKho } from "./useTablePrintKho";
import { getColumnsForReport } from "../../components/UISearch_and_formData/tableKho.jsx";

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
    const [totals, setTotals] = useState([]);
    const [columns, setColumns] = useState(columnsTable);

    // Hàm in sử dụng react-to-print


    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: reportName,
        pageStyle: `
            @page {
                size: A4 portrait;
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
        }
    });

    const handlePrint2 = useReactToPrint({
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
            // Linh hoạt nhận nhiều dạng response
            const rawData = Array.isArray(wrappedData)
                ? wrappedData
                : (wrappedData?.data || wrappedData?.rows || []);
            const totalsData = Array.isArray(wrappedData?.totals)
                ? (wrappedData.totals || [])
                : [];

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
                const nextReportType = type || "kho";
                setReportName(name || "Danh sách kho");
                setReportType(nextReportType);
                setTotals(totalsData);
                const nextColumns = getColumnsForReport(nextReportType, mappedData);
                setColumns(nextColumns && nextColumns.length > 0 ? nextColumns : columnsTable);
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

    const reportOrientation = [
        'bang_ke_phieu_nhap_mat_hang', 
        'bang_ke_phieu_xuat_mat_hang',
        'the_kho_chi_tiet_vat_tu',
        'tong_hop_nhap_xuat_ton',
    ];
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
                                        // const reportOrientation = ['bang_ke_phieu_nhap_mat_hang'];
                                        if (reportOrientation.includes(reportType)) {
                                            handlePrint2();
                                        } else {
                                            handlePrint();
                                        }
                                    }}
                                    size="sm"
                                    variant="secondary"
                                    startIcon={<PrinterIcon className="size-4" />}
                                >
                                    In danh sách {reportName}
                                </Button>
                            </div>
                        </div>

                        {dataTable.length > 0 ? (
                            <ShowMoreTables
                                dataTable={dataTable}
                                columnsTable={columns}
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

            <PrintWrapperKho
                ref={printRef}
                reportType={reportType}
                dataTable={dataTable}
                filterInfo={filterInfo}
                totals={totals}
            />
        </>
    );
}
