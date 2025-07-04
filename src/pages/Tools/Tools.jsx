import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ToolsPage() {
  return (
    <>
      <PageMeta title="Công cụ dụng cụ" description="Công cụ dụng cụ" />
      <PageBreadcrumb pageTitle="Công cụ dụng cụ" />
      <div className="space-y-6">
        <ComponentCard title="Công cụ dụng cụ">Công cụ dụng cụ</ComponentCard>
      </div>
    </>
  );
}
