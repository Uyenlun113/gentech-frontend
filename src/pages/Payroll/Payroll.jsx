import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function PayrollPage() {
  return (
    <>
      <PageMeta title="Tiền lương" description="Tiền lương" />
      <PageBreadcrumb pageTitle="Tiền lương" />
      <div className="space-y-6">
        <ComponentCard title="Tiền lương">Tiền lương</ComponentCard>
      </div>
    </>
  );
}
