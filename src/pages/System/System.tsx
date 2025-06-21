import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function SystemPage() {
  return (
    <>
      <PageMeta title="Hệ thống" description="Hệ thống" />
      <PageBreadcrumb pageTitle="Hệ thống" />
      <div className="space-y-6">
        <ComponentCard title="Hệ thống">Hệ thống</ComponentCard>
      </div>
    </>
  );
}
