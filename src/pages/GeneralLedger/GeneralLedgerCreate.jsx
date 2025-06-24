import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import GeneralForm from "../../components/general/GeneralForm";

export default function GeneralLedgerCreate() {
  return (
    <>
      <PageMeta title="Tạo phiếu kế toán" description="Tạo phiếu kế toán" />
      <PageBreadcrumb pageTitle="Tạo phiếu kế toán" />
      <div className="space-y-6">
        <GeneralForm />
      </div>
    </>
  );
}
