import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { FilePlus, Search } from "lucide-react";
import Flatpickr from "react-flatpickr";

import Button from "../../../../components/ui/button/Button";
import { CalenderIcon } from "../../../../icons";
import { ModalCreateDepreciationCalculation } from "./ModalCreate";
import { ModalDetailDepreciationCalculation } from "./ModalDetail";
import { ModalEditDepreciationCalculation } from "./ModalEdit";
import { useDepreciationCalculation } from "./useDepreciationCalculation";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";

export default function ListCustomerPage() {
    const {
        isOpenCreate,
        isOpenEdit,
        isOpenDetail,
        dataTable,
        columnsTable,
        rangePickerValue,
        openModalCreate,
        closeModalCreate,
        closeModalEdit,
        closeModalDetail,
        handleRangePicker,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,
    } = useDepreciationCalculation();

    return (
        <>
            <PageMeta title="Bảng tính khấu hao tài sản" description="Bảng tính khấu hao tài sản" />
            <PageBreadcrumb pageTitle="Bảng tính khấu hao tài sản" />
            <div className="space-y-6">
                <ComponentCard>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left: Button */}
                        <div>
                            <Button onClick={openModalCreate} size="sm" variant="primary" startIcon={<FilePlus className="size-5" />}>
                                Thêm mới
                            </Button>
                        </div>

                        {/* Right: Search + Date Range */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {/* Search */}
                            <form className="w-full sm:max-w-xs">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <Search size={18} className="text-gray-500 dark:text-white/50" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                    />
                                </div>
                            </form>

                            {/* Date Range Picker */}
                            <div className="relative w-full sm:w-[360px]">
                                <Flatpickr
                                    value={rangePickerValue}
                                    onChange={handleRangePicker}
                                    options={{
                                        mode: "range",
                                        dateFormat: "d/m/Y",
                                        locale: Vietnamese,
                                    }}
                                    placeholder="Chọn khoảng ngày"
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <CalenderIcon className="w-5 h-5" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <TableBasic data={dataTable} columns={columnsTable} />
                    <Pagination currentPage={1} totalItems={80} onPageChange={handleChangePage} />
                </ComponentCard>
                <ModalCreateDepreciationCalculation
                    isOpenCreate={isOpenCreate}
                    closeModalCreate={closeModalCreate}
                    onSaveCreate={handleSaveCreate}
                />
                <ModalEditDepreciationCalculation
                    isOpenEdit={isOpenEdit}
                    closeModalEdit={closeModalEdit}
                    onSaveEdit={handleSaveEdit}
                />
                <ModalDetailDepreciationCalculation isOpenDetail={isOpenDetail} closeModalDetail={closeModalDetail} />
            </div>
        </>
    );
}
