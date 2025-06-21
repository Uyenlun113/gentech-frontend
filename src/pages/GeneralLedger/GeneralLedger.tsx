import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function GeneralLedgerPage() {
  return (
    <>
      <PageMeta title="Kế toán tổng hợp" description="Kế toán tổng hợp" />
      <PageBreadcrumb pageTitle="Kế toán tổng hợp" />
      <div className="space-y-6">
        <ComponentCard title="Kế toán tổng hợp">Kế toán tổng hợp</ComponentCard>
      </div>
    </>
  );
}
