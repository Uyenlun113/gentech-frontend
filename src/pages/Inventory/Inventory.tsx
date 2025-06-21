import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function InventoryPage() {
  return (
    <>
      <PageMeta title="Hàng tồn kho" description="Hàng tồn kho" />
      <PageBreadcrumb pageTitle="Hàng tồn kho" />
      <div className="space-y-6">
        <ComponentCard title="Hàng tồn kho">Hàng tồn kho</ComponentCard>
      </div>
    </>
  );
}
