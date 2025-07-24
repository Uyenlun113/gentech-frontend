import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { CalendarIcon, Search, X } from "lucide-react";
import { useCallback, useState } from "react";
import Flatpickr from "react-flatpickr";

import { useListPhieuMua } from "../hooks/usePhieumua";
import TableBasic from "./tables/BasicTables/BasicTableOne";
import { Modal } from "./ui/modal";

const PhieuNhapSelectionPopup = ({ isOpen, onClose, onSelect }) => {
    const [searchParams, setSearchParams] = useState({
        so_ct: "",
        tu_ngay: "",
        den_ngay: "",
    });

    const { data: phieuNhapData = [], isLoading } = useListPhieuMua(searchParams);

    const handleSearchChange = useCallback((field, value) => {
        setSearchParams(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleTuNgayChange = useCallback((date) => {
        const formattedDate = date[0]?.toLocaleDateString("en-CA") || "";
        setSearchParams(prev => ({
            ...prev,
            tu_ngay: formattedDate
        }));
    }, []);

    const handleDenNgayChange = useCallback((date) => {
        const formattedDate = date[0]?.toLocaleDateString("en-CA") || "";
        setSearchParams(prev => ({
            ...prev,
            den_ngay: formattedDate
        }));
    }, []);

    const handleRowClick = useCallback((record) => {
        onSelect(record);
        onClose();
    }, [onSelect, onClose]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const columns = [
        {
            key: "stt",
            title: "STT",
            width: 60,
            fixed: "left",
            render: (_, record, index) => (
                <div className="text-center font-medium text-gray-700">
                    {index + 1}
                </div>
            )
        },
        {
            key: "ngay_ct",
            title: "Ngày c.từ",
            width: 120,
            render: (val) => (
                <div className="text-center font-medium">
                    {formatDate(val)}
                </div>
            )
        },
        {
            key: "so_ct",
            title: "Số c.từ",
            width: 120,
            render: (val) => (
                <div className="text-center font-medium text-blue-600">
                    {val || "-"}
                </div>
            )
        },
        {
            key: "ma_kh",
            title: "Mã khách",
            width: 120,
            render: (val) => (
                <div className="text-center">{val || "-"}</div>
            )
        },
        {
            key: "ong_ba",
            title: "Tên khách",
            width: 200,
            render: (val) => (
                <div className="truncate" title={val}>
                    {val || "-"}
                </div>
            )
        },
        {
            key: "dia_chi",
            title: "Địa chỉ",
            width: 200,
            render: (val) => (
                <div className="truncate" title={val}>
                    {val || "-"}
                </div>
            )
        },
        {
            key: "dien_giai",
            title: "Diễn giải",
            width: 200,
            render: (val) => (
                <div className="truncate" title={val}>
                    {val || "-"}
                </div>
            )
        }
    ];

    const processedData = Array.isArray(phieuNhapData?.data)
        ? phieuNhapData.data
        : Array.isArray(phieuNhapData)
            ? phieuNhapData
            : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-5xl">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Search className="w-5 h-5 text-blue-600" />
                            Lọc chứng từ
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Filter Form */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Số chứng từ */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                                Số c.từ:
                            </label>
                            <input
                                type="text"
                                value={searchParams.so_ct}
                                onChange={(e) => handleSearchChange("so_ct", e.target.value)}
                                placeholder="Nhập số chứng từ..."
                                className="flex-1 h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Từ ngày */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                                Từ ngày:
                            </label>
                            <div className="relative flex-1">
                                <Flatpickr
                                    value={searchParams.tu_ngay}
                                    onChange={handleTuNgayChange}
                                    options={{
                                        dateFormat: "Y-m-d",
                                        locale: Vietnamese,
                                        allowInput: true,
                                    }}
                                    placeholder="Chọn từ ngày..."
                                    className="w-full h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Đến ngày */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 min-w-[80px]">
                                Đến ngày:
                            </label>
                            <div className="relative flex-1">
                                <Flatpickr
                                    value={searchParams.den_ngay}
                                    onChange={handleDenNgayChange}
                                    options={{
                                        dateFormat: "Y-m-d",
                                        locale: Vietnamese,
                                        allowInput: true,
                                    }}
                                    placeholder="Chọn đến ngày..."
                                    className="w-full h-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                                <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="px-6 py-4">
                    <TableBasic
                        data={processedData}
                        columns={columns}
                        loading={isLoading}
                        onRowClick={handleRowClick}
                        maxHeight="max-h-96"
                        className="border border-gray-200 rounded-lg"
                        emptyText="Không có dữ liệu phiếu nhập"
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Tìm thấy {processedData.length} phiếu nhập
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PhieuNhapSelectionPopup;