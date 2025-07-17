import "flatpickr/dist/flatpickr.min.css";
import { FilePlus, Search } from "lucide-react";

import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import Pagination from "../../../components/pagination/Pagination";
import TableBasic from "../../../components/tables/BasicTables/BasicTableOne";
import Button from "../../../components/ui/button/Button";

import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ui/modal/ConfirmModal";
import { ModalCreateMaterial } from "./ModalCreate";

import { ModalEditMaterial } from "./ModalEdit";
import { useListMaterial } from "./useListMaterial";

export default function ListMaterialPage() {
    const {
        isOpenCreate,
        isOpenEdit,
        selectedMaterial,
        dataTable,
        columnsTable,
        pagination,
        searchValue,
        isLoading,
        error,
        openModalCreate,
        closeModalCreate,
        closeModalEdit,
        handleSearch,
        handleChangePage,
        handleSaveCreate,
        handleSaveEdit,
        status,
        setStatus,
        confirmDelete,
        confirmDeleteMaterial,
        cancelDeleteMaterial,
    } = useListMaterial();

    const [searchInput, setSearchInput] = useState(searchValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Có lỗi xảy ra khi tải dữ liệu</p>
                    <p className="text-gray-500 text-sm">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4">
            <PageMeta title="Danh mục vật tư" description="Danh mục vật tư" />
            <PageBreadcrumb pageTitle="Danh mục vật tư" />
            <div className="space-y-6">
                <ComponentCard>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Left: Button */}
                        <div>
                            <Button onClick={openModalCreate} size="sm" variant="primary" startIcon={<FilePlus className="size-5" />}>
                                Thêm mới
                            </Button>
                        </div>

                        {/* Right: Search + Status Filter */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            {/* Search */}
                            <div className="relative w-full sm:max-w-xs">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Search size={18} className="text-gray-500 dark:text-white/50" />
                                </span>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Tìm kiếm theo mã, tên vật tư..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative w-full sm:w-[250px]">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                                >
                                    <option value="">-- Trạng thái --</option>
                                    <option value="1">Đang sử dụng</option>
                                    <option value="0">Ngừng sử dụng</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center h-32">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-2"></div>
                                <p className="text-gray-500">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    )}

                    {/* Table */}
                    {!isLoading && (
                        <>
                            <TableBasic data={dataTable} columns={columnsTable} />
                            <Pagination
                                currentPage={pagination.page}
                                totalItems={pagination.total}
                                totalPages={pagination.totalPages}
                                onPageChange={handleChangePage}
                            />
                        </>
                    )}
                </ComponentCard>

                {/* Modals */}
                <ModalCreateMaterial
                    isOpenCreate={isOpenCreate}
                    closeModalCreate={closeModalCreate}
                    onSaveCreate={handleSaveCreate}
                />
                <ModalEditMaterial
                    isOpenEdit={isOpenEdit}
                    closeModalEdit={closeModalEdit}
                    onSaveEdit={handleSaveEdit}
                    selectedMaterial={selectedMaterial}
                />

                <ConfirmModal
                    isOpen={confirmDelete.open}
                    title="Xác nhận xoá"
                    message={`Bạn có chắc chắn muốn xoá vật tư "${confirmDelete.material?.ten_vt}" không?`}
                    onConfirm={confirmDeleteMaterial}
                    onCancel={cancelDeleteMaterial}
                />
            </div>
        </div>
    );
}