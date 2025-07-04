import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function CostingPage() {
  return (
    <>
      <PageMeta title="Chi phí giá thành" description="Chi phí giá thành" />
      <PageBreadcrumb pageTitle="Chi phí giá thành" />
      <div className="space-y-6">
        <ComponentCard title="Chi phí giá thành">Chi phí giá thành</ComponentCard>
      </div>
    </>
  );
}
