import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";

export default function DepreciationReportPage() {
  return (
    <>
      <PageMeta title="Báo cáo quản trị" description="Báo cáo quản trị" />
      <PageBreadcrumb pageTitle="Báo cáo quản trị" />
      <div className="space-y-6">
        <ComponentCard title="Báo cáo quản trị">Báo cáo quản trị</ComponentCard>
      </div>
    </>
  );
}
