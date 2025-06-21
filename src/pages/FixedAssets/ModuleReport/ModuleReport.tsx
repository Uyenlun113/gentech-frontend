import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";

export default function ModuleReportPage() {
  return (
    <>
      <PageMeta title="Báo cáo phân hệ" description="Báo cáo phân hệ" />
      <PageBreadcrumb pageTitle="Báo cáo phân hệ" />
      <div className="space-y-6">
        <ComponentCard title="Báo cáo phân hệ">123</ComponentCard>
      </div>
    </>
  );
}
