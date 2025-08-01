import "flatpickr/dist/flatpickr.min.css";
import { FilePlus, PrinterIcon } from "lucide-react";
import { Link } from "react-router";


import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { ShowMoreTables } from "../../components/tables/ShowMoreTables";
import Button from "../../components/ui/button/Button";
import { useBaoCaoVonList } from "./useTableVonBangTien";


export default function TableVonBangTien() {
    const {
        dataTable,
        columnsTable,
        loading,
        openModalCreate,
    } = useBaoCaoVonList();

    return (
        <>
            <div className="px-4">
                <PageMeta title="Danh sách phiếu chi" description="Danh sách phiếu chi" />
                <PageBreadcrumb pageTitle="Danh sách phiếu chi" />
                <div className="space-y-6">
                    <ComponentCard>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/cash-receipt"
                                    className="flex items-center border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    Quay lại
                                </Link>
                                <Button
                                    onClick={openModalCreate}
                                    size="sm"
                                    variant="primary"
                                    startIcon={<FilePlus className="size-5" />}
                                >
                                    Thêm mới
                                </Button>
                                <Button
                                    onClick={() => window.print()}
                                    size="sm"
                                    variant="secondary"
                                    startIcon={<PrinterIcon className="size-5" />}
                                >
                                    In danh sách
                                </Button>
                            </div>
                        </div>

                        <ShowMoreTables
                            dataTable={dataTable}
                            columnsTable={columnsTable}
                            loading={loading}
                            pagination={{
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} của ${total} bản ghi`,
                            }}
                        />
                    </ComponentCard>
                </div>
            </div>
        </>
    );
}