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
import { useBaoCaoVonList } from "./useTableVonBangTien";

export default function TableVonBangTien() {
    const location = useLocation();
    const navigate = useNavigate();
    const { columnsTable } = useBaoCaoVonList();
    const printRef = useRef();

    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterInfo, setFilterInfo] = useState(null);
    const [reportName, setReportName] = useState('Danh sách báo cáo');
    const [reportType, setReportType] = useState('default');
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
                    ngay_ct: item.ngay_ct,
                    ngay_lct: item.ngay_lct || item.ngay_lap_ct,
                    ma_ct: item.ma_ct,
                    so_ct: item.so_ct,
                    so_ct_trim: item.so_ct_trim,
                    ma_kh: item.ma_kh || item.ma_khach,
                    ten_kh: item.ten_kh || item.ten_khach_hang,
                    dien_giai: item.dien_giai,
                    tk: item.tk || item.tk_dung,
                    tk_du: item.tk_du,
                    ps_no: item.ps_no,
                    ps_co: item.ps_co,
                    so_ton: item.so_ton || item.so_du,
                    ten_tk_du: item.ten_tk_du || item.ten_tai_khoan_doi_ung,
                    ma_ct_goc: item.ma_ct_goc,
                    stt_rec: item.stt_rec,
                }));

                setDataTable(mappedData);
                setFilterInfo(filterData);
                setReportName(name || "Danh sách báo cáo");
                setReportType(type || "default");
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

    const {
        no_dk = 0,
        co_dk = 0,
        ps_no = 0,
        ps_co = 0,
        no_ck = 0,      // Số dư cuối kỳ bên Nợ
        co_ck = 0       // Số dư cuối kỳ bên Có
    } = totals;

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
                                    In báo cáo
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
                                    Quay lại chọn báo cáo
                                </Button>
                            </div>
                        )}

                        {dataTable.length > 0 && (
                            <div className="flex justify-center">
                                <div className="mt-4 w-[500px]">
                                    <div className=" p-4 rounded-lg">
                                        <div className="space-y-2">

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Số tồn đầu kỳ:</div>
                                                <div className="px-4 py-2 text-right">
                                                    {new Intl.NumberFormat('vi-VN').format(no_dk)}
                                                </div>
                                                <div className="px-4 py-2 text-right text-red-600">
                                                    {new Intl.NumberFormat('vi-VN').format(co_dk)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tổng phát sinh:</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(ps_no)}
                                                </div>
                                                <div className="px-4 py-2 text-right text-red-600">
                                                    {new Intl.NumberFormat('vi-VN').format(ps_co)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm border-t pt-2">
                                                <div className="px-4 py-2 text-left font-medium">Số tồn cuối kỳ:</div>
                                                <div className="px-4 py-2 text-right font-medium">
                                                    {new Intl.NumberFormat('vi-VN').format(no_ck)}
                                                </div>
                                                <div className="px-4 py-2 text-right text-red-600 font-medium">
                                                    {new Intl.NumberFormat('vi-VN').format(co_ck)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                totals={{ ps_no, ps_co, no_dk, co_dk, no_ck, co_ck }}
            />
        </>
    );
}