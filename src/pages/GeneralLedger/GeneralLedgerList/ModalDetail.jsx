import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";

export const ModalDetailDepreciationCalculation = ({ isOpenDetail, closeModalDetail }) => {
  return (
    <Modal isOpen={isOpenDetail} onClose={closeModalDetail} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Chi tiết</h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">Thông tin chi tiết của người dùng.</p>
        </div>
        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3 text-sm text-gray-800 dark:text-white/90">
          <div>
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Social Links</h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Facebook</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">https://www.facebook.com/PimjoHQ</p>
              </div>
              <div>
                <Label>X.com</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">https://x.com/PimjoHQ</p>
              </div>
              <div>
                <Label>Linkedin</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">https://www.linkedin.com/company/pimjo</p>
              </div>
              <div>
                <Label>Instagram</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">https://instagram.com/PimjoHQ</p>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">Thông tin cá nhân</h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Họ</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">Musharof</p>
              </div>
              <div>
                <Label>Tên</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">Chowdhury</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">randomuser@pimjo.com</p>
              </div>
              <div>
                <Label>Số điện thoại</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">+09 363 398 46</p>
              </div>
              <div className="col-span-2">
                <Label>Giới thiệu</Label>
                <p className="mt-1 text-gray-600 dark:text-gray-300">Team Manager</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={closeModalDetail}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};
