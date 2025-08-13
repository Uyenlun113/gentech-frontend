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

export default function BaoCaoDonBanHang() {
    const location = useLocation();
    const navigate = useNavigate();
    const printRef = useRef();

    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterInfo, setFilterInfo] = useState(null);
    const [reportName, setReportName] = useState('Danh sách báo cáo');
    const [reportType, setReportType] = useState('default');
    const [totals, setTotals] = useState({});
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "0";
        // Handle array values (take first element if array)
        const value = Array.isArray(amount) ? amount[0] : amount;
        return new Intl.NumberFormat("vi-VN").format(value);
    };
    const columnsTable = [
        {
            key: "stt",
            title: "Số TT",
            fixed: "left",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{val}</div>;
            },
        },
        {
            key: "ngay_ct",
            title: "Ngày chứng từ",
            fixed: "left",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
        },
        {
            key: "ma_ct0",
            title: "Mã CT in",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{val}</div>;
            },
        },
        {
            key: "so_ct",
            title: "Số CT",
            width: 80,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "ma_kh",
            title: "Mã Khách",
            width: 100,
            render: (val) => {
                return <div className="font-medium text-center">{val}</div>;
            },
        },
        {
            key: "ten_kh",
            title: "Tên khách hàng",
            width: 150,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "t_tien2",
            title: "Tiền hàng",
            width: 150,
            render: (_, record) => {
                const val = record.t_tien2 ?? record.t_tien_2 ?? record.tien;
                return val ? (
                    <div className="text-center text-red-600">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "t_ck",
            title: "Tiền ck",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "t_thue",
            title: "Tiền thuế",
            width: 150,
            render: (_, record) => {
                const val = record.t_thue ?? record.thue ?? record.tien;
                return val ? (
                    <div className="text-center text-blue-600">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "t_pt",
            title: "Tổng tiền tt",
            width: 150,
            render: (_, record) => {
                const val = record.t_pt ?? record.t_tt ?? record.tien;
                return val ? (
                    <div className="text-center text-green-600">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "t_tien",
            title: "Tiền vốn",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
            width: 120,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ma_ct",
            title: "Mã CT",
            width: 180,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
    ];
    const columnsTable2 = [
        {
            key: "stt",
            title: "Số TT",
            fixed: "left",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{val}</div>;
            },
        },
        {
            key: "ma_vt",
            title: "Mã VT",
            fixed: "left",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{val}</div>;
            },
        },
        {
            key: "ten_vt",
            title: "Tên VT",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{val}</div>;
            },
        },
        {
            key: "dvt",
            title: "ĐVT",
            width: 80,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "so_luong",
            title: "Số lượng",
            width: 100,
            render: (val) => {
                return <div className="font-medium text-center">{val}</div>;
            },
        },
        {
            key: "gia2",
            title: "Giá bán",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "tien2",
            title: "Tiền hàng",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-red-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "ck",
            title: "Tiền ck",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "thue",
            title: "Tiền thuế",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-blue-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "pt",
            title: "Tổng tiền tt",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-green-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "gia",
            title: "Giá vốn",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "tien",
            title: "Tiền vốn",
            width: 150,
            render: (val) => {
                return val ? (
                    <div className="text-center text-black-600 ">{formatCurrency(val)}</div>
                ) : (
                    <div className="text-center">0</div>
                );
            },
        },
        {
            key: "ma_nx",
            title: "Mã NX",
            width: 120,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ma_kho",
            title: "Mã kho",
            width: 180,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
    ];
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
        no_ck = 0,
        co_ck = 0
    } = totals;
    const data = location.state?.data?.data1 || [];
    const allowedIds = ["export-plan", "hehe", "haha", "hoho"];
    const tinhTong = (data) => {
        return data?.reduce(
            (acc, item) => {
                acc.tienHang += item.t_tien2 ?? item.t_tien_2 ?? item.tien ?? 0;
                acc.tienCK += item.t_ck ?? 0;
                acc.tienThue += item.thue ?? item.t_thue ?? 0;
                acc.tongThanhToan += item.t_tt ?? 0;
                return acc;
            },
            { tienHang: 0, tienCK: 0, tienThue: 0, tongThanhToan: 0 }
        );
    };
    const { tienHang, tienCK, tienThue, tongThanhToan } = tinhTong(data);

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

                        {(location.state?.data?.data1?.length > 0 || location.state?.data?.data2?.length > 0) ? (
                            <div className="space-y-9">
                                {/* Table 1 - data1 */}
                                {location.state?.data?.data1?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data1.map((item, index) => ({
                                                ...item,
                                                stt: index + 1,
                                            }))}
                                            columnsTable={columnsTable}
                                            loading={loading}
                                        />
                                    </div>
                                )}

                                {/* Table 2 - data2 */}
                                {location.state?.data?.data2?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data2.map((item, index) => ({
                                                ...item,
                                                stt: index + 1,
                                            }))}
                                            columnsTable={columnsTable2}
                                            loading={loading}
                                        />
                                    </div>
                                )}
                            </div>
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
                        {allowedIds.includes(location.state?.reportType) && (
                            <div className="flex justify-center">
                                <div className="mt-4 w-[500px]">
                                    <div className="p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div>Tổng cộng :</div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền hàng :</div>
                                                <div className="px-4 py-2 text-right">
                                                    {new Intl.NumberFormat('vi-VN').format(tienHang)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền ck :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tienCK)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền thuế :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tienThue)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tổng tiền tt :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tongThanhToan)}
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