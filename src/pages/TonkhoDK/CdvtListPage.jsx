// pages/CdvtListPage.jsx
import { FilePlus, Search } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/pagination/Pagination";
import { ShowMoreTables } from "../../components/tables/ShowMoreTables";
import Button from "../../components/ui/button/Button";
import ConfirmModal from "../../components/ui/modal/ConfirmModal";

import CdvtModal from "./CdvtModal";
import { useCdvtListData } from "./useCdvtList";


const CdvtListPage = () => {
    const [searchParams] = useSearchParams();
    const ma_kho = searchParams.get('ma_kho');
    const nam = Number(searchParams.get('nam'));

    const {
        dataTable,
        columnsTable,
        loading,
        currentPage,
        totalItems,
        totalPages,
        recordToDelete,
        isOpenDelete,
        isOpenCreate,
        isOpenEdit,
        editData,
        handleChangePage,
        handleSearch,
        handleRowClick,
        handleConfirmDelete,
        handleCancelDelete,
        handleOpenCreate,
        closeModalCreate,
        closeModalEdit,
        fetchCdvtData,
    } = useCdvtListData(ma_kho.trim(), nam);

    const [localSearchTerm, setLocalSearchTerm] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleSearch(localSearchTerm);
    };

    const handleSearchInputChange = (e) => {
        setLocalSearchTerm(e.target.value);
        if (e.target.value === "") {
            handleSearch("");
        }
    };

    return (
        <>
            <CdvtModal
                isOpen={isOpenCreate}
                onClose={closeModalCreate}
                editData={null}
                ma_kho={ma_kho}
                nam={nam}
            />
            <CdvtModal
                isOpen={isOpenEdit}
                onClose={closeModalEdit}
                editData={editData}
                ma_kho={ma_kho}
                nam={nam}
            />

            <div className="px-4">
                <PageMeta title="Vào số dư vật tư ban đầu" description="Quản lý số dư vật tư ban đầu" />
                <PageBreadcrumb pageTitle="Vào số dư vật tư ban đầu" />

                <div className="space-y-6">
                    <ComponentCard>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleOpenCreate}
                                    size="sm"
                                    variant="primary"
                                    startIcon={<FilePlus className="size-5" />}
                                >
                                    Thêm mới
                                </Button>
                            </div>

                            {/* Search */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <form className="w-full sm:max-w-xs" onSubmit={handleSearchSubmit}>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Search size={18} className="text-gray-500 dark:text-white/50" />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm mã vật tư, tên vật tư..."
                                            value={localSearchTerm}
                                            onChange={handleSearchInputChange}
                                            className="h-9 w-full rounded-lg border border-gray-300 bg-white px-4 pl-11 pr-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>

                        <ShowMoreTables
                            dataTable={dataTable}
                            columnsTable={columnsTable}
                            handleChangePage={handleChangePage}
                            fetchCt85Data={fetchCdvtData}
                            loading={loading}
                            currentPage={currentPage}
                            totalItems={totalItems}
                            handleRowClick={handleRowClick}
                        />
                    </ComponentCard>

                    {/* Pagination nếu cần riêng biệt */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={totalItems}
                                totalPages={totalPages}
                                onPageChange={handleChangePage}
                            />
                        </div>
                    )}

                    {/* Modal xác nhận xóa */}
                    <ConfirmModal
                        isOpen={isOpenDelete}
                        title="Xác nhận xóa"
                        message={`Bạn có chắc chắn muốn xóa vật tư "${recordToDelete?.ma_vt}" không?`}
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        confirmText="Xóa"
                        cancelText="Hủy"
                        variant="danger"
                    />
                </div>
            </div>
        </>
    );
};

export default CdvtListPage;