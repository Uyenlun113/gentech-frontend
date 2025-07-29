import "flatpickr/dist/flatpickr.min.css";
import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import { FilePlus, Search } from "lucide-react";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { Link } from "react-router";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import { ShowMoreTables } from "../../../components/tables/ShowMoreTables";
import Button from "../../../components/ui/button/Button";
import ConfirmModal from "../../../components/ui/modal/ConfirmModal";
import { CalenderIcon } from "../../../icons";
import { ModalCreateGeneralLedger } from "./ModalCreateGeneralLedger";
import { ModalEditGeneralLedger } from "./ModalEditGeneralLedger";
import PrintableGeneralLedger from "./PrintableGeneralLedger";
import { useGeneralLedgerList } from "./useGeneralLedgerList";

export default function GeneralLedgerListPage() {
  const {
    dataTable,
    columnsTable,
    columnsSubTable,
    rangePickerValue,
    loading,
    currentPage,
    totalItems,
    recordToDelete,
    isOpenDelete,
    handleRangePicker,
    handleChangePage,
    handleSearch,
    handleRowClick,
    handleConfirmDelete,
    handleCancelDelete,
    fetchCt11Data,
    isOpenCreate,
    openModalCreate,
    closeModalCreate,
    isOpenEdit,
    closeModalEdit,
    selectedEditId,
    printRef,
    printData,
  } = useGeneralLedgerList();

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
      {printData && (
        <div style={{ display: 'none' }}>
          <PrintableGeneralLedger
            ref={printRef}
            data={printData.phieu}
            subData={printData.hachToan}
          />
        </div>
      )}

      <ModalCreateGeneralLedger isOpenCreate={isOpenCreate} closeModalCreate={closeModalCreate} />
      <ModalEditGeneralLedger
        isOpenEdit={isOpenEdit}
        closeModalEdit={closeModalEdit}
        editingId={selectedEditId}
      />

      <div className="px-4">
        <PageMeta title="Danh sách phiếu kế toán tổng hợp" description="Danh sách phiếu kế toán tổng hợp" />
        <PageBreadcrumb pageTitle="Danh sách phiếu kế toán tổng hợp" />
        <div className="space-y-6 ">
          <ComponentCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Link
                  to="/general-ledger"
                  className="flex items-center border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Quay lại
                </Link>
                <Button onClick={openModalCreate} size="sm" variant="primary" startIcon={<FilePlus className="size-5" />}>
                  Thêm mới
                </Button>
              </div>

              {/* Right: Search + Date Range */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search */}
                <form className="w-full sm:max-w-xs" onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Search size={18} className="text-gray-500 dark:text-white/50" />
                    </span>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã CT, diễn giải..."
                      value={localSearchTerm}
                      onChange={handleSearchInputChange}
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

            <ShowMoreTables
              dataTable={dataTable}
              columnsTable={columnsTable}
              columnsSubTable={columnsSubTable}
              handleChangePage={handleChangePage}
              fetchCt11Data={fetchCt11Data}
              loading={loading}
              currentPage={currentPage}
              totalItems={totalItems}
              handleRowClick={handleRowClick}
            />
          </ComponentCard>

          {/* Modal xác nhận xóa */}
          <ConfirmModal
            isOpen={isOpenDelete}
            title="Xác nhận xóa"
            message={`Bạn có chắc chắn muốn xóa phiếu kế toán "${recordToDelete?.ma_ct || recordToDelete?.stt_rec
              }" không?`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            confirmText="Xóa"
            cancelText="Hủy"
            variant="danger"
          />
        </div>
      </div >
    </>
  );
}