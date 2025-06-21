import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function CashPage() {
  return (
    <>
      <PageMeta title="Vốn bằng tiền" description="Vốn bằng tiền" />
      <PageBreadcrumb pageTitle="Vốn bằng tiền" />
      <div className="space-y-6">
        <ComponentCard title="Vốn bằng tiền">Vốn bằng tiền</ComponentCard>
      </div>
    </>
  );
}
