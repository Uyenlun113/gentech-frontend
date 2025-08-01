import "flatpickr/dist/flatpickr.min.css";
import { ArrowLeft, PrinterIcon, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { ShowMoreTables } from "../../components/tables/ShowMoreTables";
import Button from "../../components/ui/button/Button";
import { useBaoCaoVonList } from "./useTableVonBangTien";

export default function TableVonBangTien() {
    const location = useLocation();
    const navigate = useNavigate();
    const { columnsTable } = useBaoCaoVonList();

    // State để lưu dữ liệu từ filter
    const [dataTable, setDataTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterInfo, setFilterInfo] = useState(null);
    const [reportName, setReportName] = useState('Danh sách báo cáo');

    // Nhận dữ liệu từ navigation state
    useEffect(() => {
        if (location.state) {
            const { data, filterData, reportName: name } = location.state;

            if (data && Array.isArray(data)) {
                // Map data từ API về format phù hợp với bảng
                const mappedData = data.map((item, index) => ({
                    ...item,
                    stt: index + 1,
                    // Map theo cấu trúc dữ liệu thực tế
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
                    so_ton: item.so_ton || item.so_tien,
                    ten_tk_du: item.ten_tk_du || item.ten_tai_khoan_doi_ung,
                    ma_ct_goc: item.ma_ct_goc,
                    stt_rec: item.stt_rec,
                }));

                setDataTable(mappedData);
                setFilterInfo(filterData);
                setReportName(name || 'Danh sách báo cáo');
            } else {
                setDataTable([]);
            }
        } else {
            setDataTable([]);
        }
    }, [location.state]);

    // Hàm refresh dữ liệu
    const handleRefresh = () => {
        if (filterInfo) {
            setLoading(true);
            // Simulate loading
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    // Hàm in báo cáo
    const handlePrintReport = () => {
        window.print();
    };

    // Hàm quay lại trang filter
    const handleGoBack = () => {
        navigate(-1);
    };


    // Calculate totals theo logic báo cáo sổ quỹ
    const calculateTotals = () => {
        let tongThu = 0; // Tổng phát sinh thu (ps_no)
        let tongChi = 0; // Tổng phát sinh chi (ps_co)

        // Tính tổng thu và chi từ dữ liệu hiện tại
        dataTable.forEach((item) => {
            const psNo = Array.isArray(item.ps_no) ? item.ps_no[0] : item.ps_no;
            const psCo = Array.isArray(item.ps_co) ? item.ps_co[0] : item.ps_co;

            // Tổng thu (ps_no > 0)
            if (psNo && psNo > 0) {
                tongThu += parseFloat(psNo);
            }

            // Tổng chi (ps_co > 0) 
            if (psCo && psCo > 0) {
                tongChi += parseFloat(psCo);
            }
        });

        // Tồn đầu kỳ: Lấy sum đến ngày lọc chứng từ (có thể từ filterInfo hoặc tính từ dữ liệu)
        // Giả sử tồn đầu = tồn cuối của record cuối - tổng thu + tổng chi
        let tonDauKy = 0;
        if (dataTable.length > 0) {
            // Lấy số tồn từ record đầu tiên (trước khi có các giao dịch)
            const firstRecord = dataTable[0];
            const soTonFirst = Array.isArray(firstRecord.so_ton) ? firstRecord.so_ton[0] : firstRecord.so_ton;

            // Tồn đầu = số tồn hiện tại + tổng chi - tổng thu (ngược lại để tìm số đầu)
            tonDauKy = Math.abs(parseFloat(soTonFirst) || 0) + tongThu - tongChi;
        }

        // Tồn cuối = đầu kỳ + Tổng ps thu - Tổng PS chi
        const tonCuoiKy = tonDauKy + tongThu - tongChi;

        return {
            tongThu,
            tongChi,
            tonDauKy: Math.abs(tonDauKy), // Đảm bảo dương
            tonCuoiKy: Math.abs(tonCuoiKy) // Đảm bảo dương
        };
    };

    const { tongThu, tongChi, tonDauKy, tonCuoiKy } = dataTable.length > 0 ? calculateTotals() : { tongThu: 0, tongChi: 0, tonDauKy: 0, tonCuoiKy: 0 };

    return (
        <>
            <div className="px-4">
                <PageMeta title={reportName} description={reportName} />
                <PageBreadcrumb pageTitle={reportName} />
                <div className="space-y-6">
                    <ComponentCard>
                        {/* Header với các nút điều khiển */}
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
                                    onClick={handlePrintReport}
                                    size="sm"
                                    variant="secondary"
                                    startIcon={<PrinterIcon className="size-4" />}
                                >
                                    In báo cáo
                                </Button>
                            </div>
                        </div>

                        {/* Hiển thị bảng dữ liệu */}
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

                        {/* Footer với thông tin tổng kết */}
                        {dataTable.length > 0 && (
                            <div className="flex justify-center"> <div className="mt-4 w-[500px]">
                                <div>
                                    <div className="grid grid-cols-3 text-sm font-medium">
                                        <div className="px-4 py-2  text-left">
                                            Số tồn đầu:
                                        </div>
                                        <div className="px-4 py-2  text-right">
                                            0
                                        </div>
                                        <div className="px-4 py-2 text-right text-red-600">
                                            {new Intl.NumberFormat('vi-VN').format(tonDauKy)}
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-3 text-sm font-medium">
                                        <div className="px-4 py-2  text-left">
                                            Tổng số thu, chi:
                                        </div>
                                        <div className="px-4 py-2  text-right text-blue-600">
                                            {new Intl.NumberFormat('vi-VN').format(tongThu)}
                                        </div>
                                        <div className="px-4 py-2 text-right text-red-600">
                                            {new Intl.NumberFormat('vi-VN').format(tongChi)}
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="grid grid-cols-3 text-sm font-medium">
                                        <div className="px-4 py-2  text-left">
                                            Số tồn cuối:
                                        </div>
                                        <div className="px-4 py-2  text-right">
                                            0
                                        </div>
                                        <div className="px-4 py-2 text-right text-red-600">
                                            {new Intl.NumberFormat('vi-VN').format(tonCuoiKy)}
                                        </div>
                                    </div>
                                </div>
                            </div></div>
                        )}
                    </ComponentCard >
                </div >
            </div >
        </>
    );
}