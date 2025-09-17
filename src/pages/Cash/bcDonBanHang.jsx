import "flatpickr/dist/flatpickr.min.css";
import { ArrowLeft, PrinterIcon, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import PrintWrapper from "../../components/PrintWrapper";
import { ShowMoreTables } from "../../components/tables/ShowMoreTables";
import Button from "../../components/ui/button/Button";
import { createColumnsTable1, createColumnsTable2, createColumnsTable3, createColumnsTable4, createColumnsTable5 } from "./tableColumns";

export default function BaoCaoDonBanHang() {
    const location = useLocation();
    const navigate = useNavigate();
    const printRef = useRef();

    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reportName, setReportName] = useState('Danh sách báo cáo');
    const [reportType, setReportType] = useState('default');
    const [totals, setTotals] = useState({});

    const filterInfo = location.state?.filterData || {};

    const typeConfig = {
        inventory2: { maKey: "ma_kh", maTitle: "Mã KH", tenKey: "ten_kh", tenTitle: "Tên KH" },
        "inventory-detail2": { maKey: "ma_kh", maTitle: "Mã KH", tenKey: "ten_kh", tenTitle: "Tên KH" },
        "import-export-summary2": { maKey: "ma_kh", maTitle: "Mã KH", tenKey: "ten_kh", tenTitle: "Tên KH" },
        supplier: { maKey: "ma_ncc", maTitle: "Mã NCC", tenKey: "ten_ncc", tenTitle: "Tên NCC" },
    };

    const currentType = location.state?.reportType;
    const { maKey, maTitle, tenKey, tenTitle } = typeConfig[currentType] || { maKey: "ma_vt", maTitle: "Mã VT", tenKey: "ten_vt", tenTitle: "Tên VT" };

    const columnsTable = createColumnsTable1();
    const columnsTable2 = createColumnsTable2(maKey, maTitle, tenKey, tenTitle);
    const columnsTable3 = createColumnsTable3();
    const columnsTable4 = createColumnsTable4();
    const columnsTable5 = createColumnsTable5();

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

    const data1 = location.state?.data?.data1 || [];
    const data2 = location.state?.data?.data2 || [];
    const data = data1.length > 0 ? data1 : data2;
    const allowedIds = ["export-plan", "inventory2"];

    const tinhTong = (data) => {
        return data?.reduce(
            (acc, item) => {
                acc.tienHang += item.t_tien2 ?? item.t_tien_2 ?? item.tien ?? 0;
                acc.tienCK += item.t_ck ?? 0;
                acc.tienThue += item.thue ?? item.t_thue ?? 0;
                acc.tongThanhToan += item.t_tt ?? item.tt ?? item.pt ?? 0;
                return acc;
            },
            { tienHang: 0, tienCK: 0, tienThue: 0, tongThanhToan: 0 }
        );
    };
    const { tienHang, tienCK, tienThue, tongThanhToan } = tinhTong(data);

    const allowedIds2 = ["inventory-detail2", "import-export-detail"];
    const tinhTongTruObj1 = (data) => {
        if (!data || data.length < 2) return { tienHang: 0, tienCK: 0, tienThue: 0, tongThanhToan: 0 };

        return data.slice(1).reduce(
            (acc, item) => {
                acc.tienHang += (item.t_tien2 ?? item.t_tien_2 ?? item.tien ?? 0);
                acc.tienCK += (item.t_ck ?? 0);
                acc.tienThue += (item.thue ?? item.t_thue ?? 0);
                acc.tongThanhToan += (item.t_tt ?? item.tt ?? item.pt ?? 0);
                return acc;
            },
            {
                tienHang2: (data[0].t_tien2 ?? data[0].t_tien_2 ?? data[0].tien ?? 0),
                tienCK2: (data[0].t_ck ?? 0),
                tienThue2: (data[0].thue ?? data[0].t_thue ?? 0),
                tongThanhToan2: (data[0].t_tt ?? data[0].tt ?? data[0].pt ?? 0)
            }
        );
    };
    const { tienHang2, tienCK2, tienThue2, tongThanhToan2 } = tinhTongTruObj1(data);

    const allowedIds3 = ["import-export-summary2"];
    const tinhTong3 = (data) => {
        return data?.reduce(
            (acc, item) => {
                if (item.ma_kh) {
                    acc.tienHang3 += item.t_tien2 ?? item.t_tien_2 ?? item.tien ?? 0;
                    acc.tienCK3 += item.t_ck ?? 0;
                    acc.tienThue3 += item.thue ?? item.t_thue ?? 0;
                    acc.tongThanhToan3 += item.t_tt ?? item.tt ?? item.pt ?? 0;
                }
                return acc;
            },
            { tienHang3: 0, tienCK3: 0, tienThue3: 0, tongThanhToan3: 0 }
        );
    };
    const { tienHang3, tienCK3, tienThue3, tongThanhToan3 } = tinhTong3(data);
    const hasData =
        location.state?.data?.data1?.length > 0 ||
        location.state?.data?.data2?.length > 0;

    const specialTypes = ["cost-analysis", "performance-report"];
    const { psNo, psCo } = useMemo(() => {
        let tongNo = 0;
        let tongCo = 0;

        [...data1, ...data2].forEach(item => {
            if (item.stt_rec != null) {
                tongNo += parseFloat(item.ps_no) || 0;
                tongCo += parseFloat(item.ps_co) || 0;
            }
        });

        return { psNo: tongNo, psCo: tongCo };
    }, [data1, data2]);
    const { psNo2, psCo2 } = useMemo(() => {
        let tongNo = 0;
        let tongCo = 0;

        [...data1, ...data2].forEach(item => {

            tongNo += parseFloat(item.ps_no) || 0;
            tongCo += parseFloat(item.ps_co) || 0;

        });

        return { psNo2: tongNo, psCo2: tongCo };
    }, [data1, data2]);
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
                                        let hasData = false;
                                        const typeCheckData12 = ['import-plan', 'export-plan', 'inventory2', 'inventory-detail2', 'import-export-summary2', 'import-export-detail', 'customer-summary', 'cost-analysis', 'performance-report', 'turnover-analysis', 'abc-analysis', 'inventory-valuation'];
                                        if (typeCheckData12.includes(reportType)) {
                                            hasData =
                                                (data1 && data1.length > 0) ||
                                                (data2 && data2.length > 0);
                                        } else {
                                            hasData = dataTable && dataTable.length > 0;
                                        }
                                        if (!hasData) {
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

                        {specialTypes.includes(reportType) && hasData ? (
                            <div className="space-y-9">
                                {location.state?.data?.data2?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data2.map(
                                                (item, index) => ({
                                                    ...item,
                                                    stt: index + 1,
                                                })
                                            )}
                                            columnsTable={columnsTable3}
                                            loading={loading}
                                        />
                                    </div>
                                )}

                                {/* Tổng cộng */}
                                <div className="flex justify-center">
                                    <div className="mt-4 w-[500px]">
                                        <div className="p-4 rounded-lg">
                                            <div className="space-y-2">
                                                <div>Tổng cộng :</div>

                                                <div className="grid grid-cols-3 text-sm">
                                                    <div className="px-4 py-2 text-left">
                                                        Phát sinh nợ
                                                    </div>
                                                    <div className="px-4 py-2 text-right">
                                                        {new Intl.NumberFormat("vi-VN").format(
                                                            psNo
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 text-sm">
                                                    <div className="px-4 py-2 text-left">
                                                        Phát sinh có :
                                                    </div>
                                                    <div className="px-4 py-2 text-right text-blue-600">
                                                        {new Intl.NumberFormat("vi-VN").format(
                                                            psCo
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : reportType === "turnover-analysis" && hasData ? (
                            <div className="space-y-9">
                                {/* Table chỉ hiện data2 */}
                                {location.state?.data?.data2?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data2.map(
                                                (item, index) => ({
                                                    ...item,
                                                    stt: index + 1,
                                                })
                                            )}
                                            columnsTable={columnsTable4}
                                            loading={loading}
                                        />
                                    </div>
                                )}

                                {/* Tổng cộng */}
                                <div className="flex justify-center">
                                    <div className="mt-4 w-[500px]">
                                        <div className="p-4 rounded-lg">
                                            <div className="space-y-2">
                                                <div>Tổng cộng :</div>

                                                <div className="grid grid-cols-3 text-sm">
                                                    <div className="px-4 py-2 text-left">
                                                        Phát sinh nợ
                                                    </div>
                                                    <div className="px-4 py-2 text-right">
                                                        {new Intl.NumberFormat("vi-VN").format(
                                                            psNo2
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 text-sm">
                                                    <div className="px-4 py-2 text-left">
                                                        Phát sinh có :
                                                    </div>
                                                    <div className="px-4 py-2 text-right text-blue-600">
                                                        {new Intl.NumberFormat("vi-VN").format(
                                                            psCo2
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : reportType === "abc-analysis" && hasData ? (
                            <div className="space-y-9">
                                {/* Table 1 - data1 */}
                                {location.state?.data?.data2?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data2.map(
                                                (item, index) => ({
                                                    ...item,
                                                    stt: index + 1,
                                                })
                                            )}
                                            columnsTable={columnsTable5}
                                            loading={loading}
                                        />
                                    </div>
                                )}
                                {location.state?.data?.data1?.length > 0 && (
                                    location.state.data.data1.map((item, index) => (
                                        <div key={index} className="flex justify-center">
                                            <div className="mt-4 w-[500px]">
                                                <div className="p-4 rounded-lg">
                                                    <div className="space-y-2">
                                                        <div>Tổng cộng :</div>

                                                        <div className="grid grid-cols-3 text-sm">
                                                            <div className="px-4 py-2 text-left">Nợ cuối kì</div>
                                                            <div className="px-4 py-2 text-right">
                                                                {new Intl.NumberFormat("vi-VN").format(item.no_ck)}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-3 text-sm">
                                                            <div className="px-4 py-2 text-left">Có cuối kì :</div>
                                                            <div className="px-4 py-2 text-right text-blue-600">
                                                                {new Intl.NumberFormat("vi-VN").format(item.co_ck)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : reportType === "inventory-valuation" && hasData ? (
                            <div className="space-y-9">
                                {/* Table 1 - data1 */}
                                {location.state?.data?.data1?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data1.map(
                                                (item, index) => ({
                                                    ...item,
                                                    stt: index + 1,
                                                })
                                            )}
                                            columnsTable={columnsTable3}
                                            loading={loading}
                                        />
                                    </div>
                                )}
                                {location.state?.data?.data2?.length > 0 && (
                                    <div className="flex flex-col items-center space-y-2">
                                        {location.state?.data?.data2?.map((item, index) => (
                                            <div key={index} className="w-[600px]">
                                                <div className="p-2 rounded-lg">
                                                    <div className="grid grid-cols-[2fr_1fr_1fr] text-sm py-1 gap-x-2">
                                                        <div className="px-4 text-left">{item.dien_giai}</div>
                                                        <div className="px-4 text-right">
                                                            {new Intl.NumberFormat("vi-VN").format(item.ps_no)}
                                                        </div>
                                                        <div className="px-4 text-right">
                                                            {new Intl.NumberFormat("vi-VN").format(item.ps_co)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : hasData ? (
                            <div className="space-y-9">
                                {/* Table 1 - data1 */}
                                {location.state?.data?.data1?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data1.map(
                                                (item, index) => ({
                                                    ...item,
                                                    stt: index + 1,
                                                })
                                            )}
                                            columnsTable={columnsTable}
                                            loading={loading}
                                        />
                                    </div>
                                )}

                                {/* Table 2 - data2 */}
                                {location.state?.data?.data2?.length > 0 && (
                                    <div className="mb-8">
                                        <ShowMoreTables
                                            dataTable={location.state.data.data2.map(
                                                (item, index) => ({
                                                    ...item,
                                                    stt: index + 1,
                                                })
                                            )}
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

                        {allowedIds2.includes(location.state?.reportType) && (
                            <div className="flex justify-center">
                                <div className="mt-4 w-[500px]">
                                    <div className="p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div>Tổng cộng :</div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền hàng :</div>
                                                <div className="px-4 py-2 text-right">
                                                    {new Intl.NumberFormat('vi-VN').format(tienHang2)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền ck :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tienCK2)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền thuế :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tienThue2)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tổng tiền tt :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tongThanhToan2)}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {allowedIds3.includes(location.state?.reportType) && (
                            <div className="flex justify-center">
                                <div className="mt-4 w-[500px]">
                                    <div className="p-4 rounded-lg">
                                        <div className="space-y-2">
                                            <div>Tổng cộng :</div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền hàng :</div>
                                                <div className="px-4 py-2 text-right">
                                                    {new Intl.NumberFormat('vi-VN').format(tienHang3)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền ck :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tienCK3)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tiền thuế :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tienThue3)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 text-sm">
                                                <div className="px-4 py-2 text-left">Tổng tiền tt :</div>
                                                <div className="px-4 py-2 text-right text-blue-600">
                                                    {new Intl.NumberFormat('vi-VN').format(tongThanhToan3)}
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
                data1={data1}
                data2={data2}
                totals={{ tienHang, tienCK, tienThue, tongThanhToan }}
            />
        </>
    );
}