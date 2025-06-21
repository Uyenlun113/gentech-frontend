import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ImportExcelPage() {
  return (
    <>
      <PageMeta title="Chuyển dữ liệu từ Excel" description="Chuyển dữ liệu từ Excel" />
      <PageBreadcrumb pageTitle="Chuyển dữ liệu từ Excel" />
      <div className="space-y-6">
        <ComponentCard title="Chuyển dữ liệu từ Excel">Chuyển dữ liệu từ Excel</ComponentCard>
      </div>
    </>
  );
}
