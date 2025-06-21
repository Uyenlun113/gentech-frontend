import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function SalesPage() {
  return (
    <>
      <PageMeta title="Bán hàng - phải thu" description="Bán hàng - phải thu" />
      <PageBreadcrumb pageTitle="Bán hàng - phải thu" />
      <div className="space-y-6">
        <ComponentCard title="Bán hàng - phải thu">Bán hàng - phải thu</ComponentCard>
      </div>
    </>
  );
}
