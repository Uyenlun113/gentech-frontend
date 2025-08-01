import { Pencil, Printer, Trash } from "lucide-react";
import { useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";



export const useBaoCaoVonList = () => {
    const [selectedEditId, setSelectedEditId] = useState();
    const printRef = useRef();
    // const [printData, setPrintData] = useState(null);
    // const [selectedPrintId, setSelectedPrintId] = useState(null);

    const { isOpen: isOpenCreate, openModal: openModalCreate, closeModal: closeModalCreate } = useModal();
    const { isOpen: isOpenEdit, openModal: openModalEdit, closeModal: closeModalEdit } = useModal();

    const [rangePickerValue, setRangePickerValue] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);


    // const handlePrint = useReactToPrint({
    //     contentRef: printRef,
    //     documentTitle: `Phiếu Chi - ${printData?.phieuData?.so_ct || 'PC'}`,
    // });

    // const handlePrintClick = async (record, e) => {
    //     e.stopPropagation();

    //     try {
    //         // Set selected print ID để trigger useCt46ById
    //         setSelectedPrintId(record.stt_rec);

    //         // Đợi data load xong
    //         setTimeout(() => {
    //             if (ct46DetailData) {
    //                 const phieuData = ct46DetailData.phieu || record;
    //                 const hachToanData = ct46DetailData.hachToan || [];

    //                 // Tính tổng tiền từ hachToan
    //                 const totalAmount = hachToanData.reduce((sum, item) => {
    //                     return sum + (parseFloat(item.tien) || parseFloat(item.tt) || 0);
    //                 }, 0);

    //                 // Set print data
    //                 setPrintData({
    //                     phieuData: phieuData,
    //                     hachToanData: hachToanData,
    //                     totalAmount: totalAmount || phieuData?.t_tien || 0
    //                 });

    //                 // Trigger print
    //                 setTimeout(() => {
    //                     handlePrint();
    //                 }, 100);
    //             }
    //         }, 500);

    //     } catch (error) {
    //         console.error("Error fetching data for print:", error);
    //         toast.error("Không thể tải dữ liệu để in");
    //     }
    // };

    // // Effect để xử lý khi có ct46DetailData mới
    // useEffect(() => {
    //     if (ct46DetailData && selectedPrintId) {
    //         const phieuData = ct46DetailData.phieu;
    //         const hachToanData = ct46DetailData.hachToan || [];

    //         // Tính tổng tiền từ hachToan
    //         const totalAmount = hachToanData.reduce((sum, item) => {
    //             return sum + (parseFloat(item.tien) || parseFloat(item.tt) || 0);
    //         }, 0);

    //         // Set print data
    //         setPrintData({
    //             phieuData: phieuData,
    //             hachToanData: hachToanData,
    //             totalAmount: totalAmount || phieuData?.t_tien || 0
    //         });

    //         // Trigger print
    //         setTimeout(() => {
    //             handlePrint();
    //             setSelectedPrintId(null); // Reset sau khi in
    //         }, 100);
    //     }
    // }, [ct46DetailData, selectedPrintId]);



    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const formatCurrency = (amount) => {
        if (!amount) return "0";
        return new Intl.NumberFormat("vi-VN").format(amount);
    };

    // useEffect(() => {
    //     if (selectedRecord && fetchCt46Data?.hachToan && Array.isArray(fetchCt46Data.hachToan)) {
    //         const ct46WithSTT = fetchCt46Data.hachToan.map((item, index) => ({
    //             ...item,
    //             stt: index + 1,
    //         }));
    //         selectedRecord.hachToan = ct46WithSTT;
    //         selectedRecord.children = ct46WithSTT;
    //         setSelectedRecord({ ...selectedRecord });
    //     } else if (selectedRecord && fetchCt46Data && (!fetchCt46Data.hachToan || fetchCt46Data.hachToan.length === 0)) {
    //         selectedRecord.hachToan = [];
    //         selectedRecord.children = [];
    //         setSelectedRecord({ ...selectedRecord });
    //     }
    // }, [fetchCt46Data]);


    const columnsTable = [
        {
            key: "stt",
            title: "STT",
            width: 50,
            fixed: "left",
            render: (_, record, index) => {
                return <div className="font-medium text-center">{index + 1}</div>;
            },
        },
        {
            key: "ngay_ct",
            title: "Ngày CtCt",
            fixed: "left",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
        },
        {
            key: "ngay_lap_ct",
            title: "Ngày lập Ct",
            width: 110,
            render: (val) => {
                return <div className="font-medium text-center">{formatDate(val)}</div>;
            },
        },
        {
            key: "ma_ct",
            title: "Mã c.từ",
            width: 80,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "so_ct",
            title: "Số CtCt",
            width: 100,
            render: (val) => <div className="font-medium text-center">{val || "-"}</div>,
        },
        {
            key: "ma_khach",
            title: "Mã khách",
            width: 100,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ten_khach_hang",
            title: "Tên khách hàng",
            width: 150,
            render: (val) => (
                <div className="max-w-xs truncate text-left" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
            width: 120,
            render: (val) => (
                <div className="max-w-xs truncate text-left" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "tk_dung",
            title: "Tk dùng",
            width: 100,
            render: (val) => <div className="text-center">{val || "-"}</div>,
        },
        {
            key: "ps_no",
            title: "Ps nợ",
            width: 100,
            render: (val) => <div className="text-right text-red-600">{formatCurrency(val)}</div>,
        },
        {
            key: "ps_co",
            title: "Ps có",
            width: 100,
            render: (val) => <div className="text-right text-blue-600">{formatCurrency(val)}</div>,
        },
        {
            key: "so_tien",
            title: "Số tiền",
            width: 120,
            render: (val) => <div className="text-right font-semibold text-green-600">{formatCurrency(val)}</div>,
        },
        {
            key: "ma_du_an",
            title: "Mã dự án",
            width: 100,
            render: (val) => (
                <div className="max-w-xs truncate text-center" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ten_tai_khoan_doi_ung",
            title: "Tên tài khoản đối ứng",
            width: 180,
            render: (val) => (
                <div className="max-w-xs truncate text-left" title={val}>
                    {val || "-"}
                </div>
            ),
        },
        {
            key: "ma_ct_goc",
            title: "Mã CtGr",
            width: 100,
            render: (val) => <div className="text-center">{val || "-"}</div>,
        },
        {
            key: "action",
            title: "Thao tác",
            fixed: "right",
            width: 130,
            render: (_, record) => {
                return (
                    <div className="flex items-center gap-2 justify-center">
                        <button
                            className="text-gray-500 hover:text-blue-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="In phiếu chi"
                            onClick={(e) => handlePrintClick(record, e)}
                            disabled={isLoadingCt46Detail}
                        >
                            <Printer size={16} />
                        </button>
                        <button
                            className="text-gray-500 hover:text-amber-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Sửa"
                            onClick={() => handleOpenEdit(record?.stt_rec)}
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={(e) => handleDeleteClick(record, e)}
                            className="text-gray-500 hover:text-red-500 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Xóa"
                            disabled={deleteMutation.isPending}
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                );
            },
        },
    ];


    const handleRangePicker = (date) => {
        setRangePickerValue(date);
    };

    const handleChangePage = (page) => {
        console.log("Page changed to:", page);
    };

    return {

        columnsTable,

    };
};