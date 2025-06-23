import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function GeneralForm() {
    return (
        <>
            <div className="space-y-6  max-w-7xl ">
                <form className="flex flex-col" >
                    <div className=" overflow-y-auto px-2 pb-3">

                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                            <div className="col-span-2">
                                <Label>Ngày hạch toán </Label>
                                <Input
                                    type="date"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Ngày lập chứng từ </Label>
                                <Input
                                    type="date"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Quyển sổ </Label>
                                <Input
                                    type="date"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Số chứng từ</Label>
                                <Input
                                    type="date"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Tỷ giá</Label>
                                <Input
                                    type="date"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Trạng thái</Label>
                                <Input
                                    type="date"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Diễn giải chung</Label>
                                <Input
                                    type="date"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}