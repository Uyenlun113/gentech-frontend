// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "0";
  const value = Array.isArray(amount) ? amount[0] : amount;
  return new Intl.NumberFormat("vi-VN").format(value);
};

export const printTemplates = {
  // Template cho Sổ quỹ tiền mặt
  cashBook: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 10px; margin-bottom: 5px;">
                   Công ty cổ phần công nghệ Gentech<br/>
                   Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                </div>
                <div style="text-align: right; font-size: 10px; margin-bottom: 10px;">
                    Mã số Thuế: 0104929879<br/>
                    Mẫu số: S04a - DNN<br/>
                    (Ban hành theo Thông tư số 133/2016/TT-BTC<br/>
                    ngày 26/8/2016 của Bộ Tài chính)
                </div>
                </div>
                
                <h2 style="font-size: 16px; font-weight: bold; marginTop: 10px; text-transform: uppercase;">
                    SỔ QUỸ TIỀN MẶT
                </h2>
                <div style="font-size: 12px; margin-bottom: 10px;">
                    TÀI KHOẢN: ${filterInfo?.tk || "1111"} - TIỀN MẶT VND<br/>
                    TỪ NGÀY: ${
                      formatDate(filterInfo?.ngay_ct1) || ""
                    } ĐẾN NGÀY: ${formatDate(filterInfo?.ngay_ct2) || ""}
                </div>
            </div>
            <div style="text-align: right; font-weight: bold; margin: 4px 0 4px auto; width: 200px; margin-right: 95px;">
                SỐ TỒN ĐẦU: ${new Intl.NumberFormat("vi-VN").format(
                  totals.tonDauKy
                )}
            </div>

            <!-- Main Table -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
                <thead>
                    <tr>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 70px; background-color: #EBF8EC; text-align: center;">
                            NGÀY THÁNG<br/>GHI SỔ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 70px; background-color: #EBF8EC; text-align: center;">
                            NGÀY THÁNG<br/>C.TỪ
                        </th>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                            SỐ HIỆU C.TỪ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 180px; background-color: #EBF8EC; text-align: center;">
                            DIỄN GIẢI
                        </th>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                            SỐ TIỀN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">
                            TỒN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">
                            GHI CHÚ
                        </th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">THU</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">CHI</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">THU</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">CHI</th>
                    </tr>
                    <tr style="text-align: center; font-weight: bold; font-style: italic; font-size: 10px;">
                        <td style="border: 1px solid #000; padding: 4px;">A</td>
                        <td style="border: 1px solid #000; padding: 4px;">B</td>
                        <td style="border: 1px solid #000; padding: 4px;">C</td>
                        <td style="border: 1px solid #000; padding: 4px;">D</td>
                        <td style="border: 1px solid #000; padding: 4px;">E</td>
                        <td style="border: 1px solid #000; padding: 4px;">1</td>
                        <td style="border: 1px solid #000; padding: 4px;">2</td>
                        <td style="border: 1px solid #000; padding: 4px;">3</td>
                        <td style="border: 1px solid #000; padding: 4px;">G</td>
                    </tr>
                </thead>
                <tbody>
                    ${data
                      .map(
                        (record) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${formatDate(record.ngay_ct)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${formatDate(record.ngay_lct)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${
                                  record.ps_no
                                    ? record.so_ct_trim || record.so_ct || ""
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${
                                  record.ps_co
                                    ? record.so_ct_trim || record.so_ct || ""
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                ${record.dien_giai || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_no
                                    ? formatCurrency(record.ps_no)
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_co
                                    ? formatCurrency(record.ps_co)
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${formatCurrency(record.so_ton || record.so_du)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px;"></td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>

            <!-- Summary -->
            <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div style="text-align: left; margin-bottom: 10px; font-size: 11px;">
                    Số dây có: 01 trang, đánh số từ trang 01 đến trang 01<br/>
                    Ngày mở sổ: ${filterInfo?.ngay_ct1 || "01-08-2025"}
                </div>
               <table style="width: 150px; border-collapse: collapse; font-size: 12px; margin-right: 90px;">
                    <tr>
                        <td style="padding: 2px 4px; font-weight: bold;">TỔNG SỐ THU:</td>
                        <td style="padding: 2px 4px; text-align: right; font-weight: bold; color: #0066cc;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tongThu
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px; font-weight: bold;">TỔNG SỐ CHI:</td>
                        <td style="padding: 2px 4px; text-align: right; font-weight: bold; color: #cc0000;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tongChi
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px; font-weight: bold;">SỐ TỒN CUỐI:</td>
                        <td style="padding: 2px 4px; text-align: right; font-weight: bold;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tonCuoiKy
                            )}
                        </td>
                    </tr>
                </table>

            </div>
            <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
                Ngày......tháng.....năm........
            </div>
            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">NGƯỜI LẬP BIỂU</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                    <div style=" width: 150px; margin: 0 auto; font-weight: bold;"> Tên thủ quỹ</div>
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">KẾ TOÁN TRƯỞNG</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                   
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">GIÁM ĐỐC</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên, đóng dấu)</div>
                    
                </div>
            </div>


            <div style="text-align: left; margin-top: 40px; font-size: 10px;">
                Trang: 1, ${new Date().toLocaleDateString("vi-VN")}
            </div>
        </div>
    `,
  // Template cho Bảng cân đối kế toán
  detailedCashLedger: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="font-size: 10px; margin-bottom: 5px;">
                    Công ty cổ phần công nghệ Gentech<br/>
                    Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
                    </div>
                    <div style="text-align: right; font-size: 10px; width: 40%;">
                        Mã số thuế: 0104929879<br/>
                        Mẫu số: S04b - DNN<br/>
                        (Ban hành theo Thông tư số 133/2016/TT-BTC<br/>
                        ngày 26/8/2016 của Bộ Tài chính)
                    </div>
                </div>
                
                <h2 style="font-size: 16px; font-weight: bold; margin: 5px 0; text-transform: uppercase;">
                    SỔ KẾ TOÁN CHI TIẾT QUỸ TIỀN MẶT
                </h2>
                <div style="font-size: 12px; margin-bottom: 10px;">
                    TÀI KHOẢN: ${filterInfo?.tk || "1111"} - TIỀN MẶT VND<br/>
                    TỪ NGÀY: ${filterInfo?.ngay_ct1 || ""} ĐẾN NGÀY: ${
    filterInfo?.ngay_ct2 || ""
  }
                </div>
            </div>
                <div style="font-weight: bold; text-align: right;">
                        ĐƠN VỊ TÍNH: VND
                    </div>
             <div style="font-weight: bold; margin: 5px 0; text-align: right; margin-right: 95px;">
                        SỐ DƯ CÓ ĐẦU KỲ: ${new Intl.NumberFormat(
                          "vi-VN"
                        ).format(totals.tonDauKy || 980098)}
                    </div>
                   

            <!-- Main Table -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
                <thead>
                    <tr>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 70px; background-color: #EBF8EC; text-align: center;">
                            NGÀY<br/>THÁNG<br/>GHI SỔ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 70px; background-color: #EBF8EC; text-align: center;">
                            NGÀY<br/>THÁNG<br/>C.TỪ
                        </th>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                            SỐ HIỆU C.TỪ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 200px; background-color: #EBF8EC; text-align: center;">
                            DIỄN GIẢI
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">
                            TK<br/>Đ.ỨNG
                        </th>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #EBF8EC; text-align: center;">
                            SỐ PHÁT SINH
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">
                            SỐ TỒN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">
                            GHI CHÚ
                        </th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">THU</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #EBF8EC; text-align: center;">CHI</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">NỢ</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #EBF8EC; text-align: center;">CÓ</th>
                    </tr>
                    <tr style="text-align: center; font-weight: bold; font-style: italic; font-size: 10px;">
                        <td style="border: 1px solid #000; padding: 4px;">A</td>
                        <td style="border: 1px solid #000; padding: 4px;">B</td>
                        <td style="border: 1px solid #000; padding: 4px;">C</td>
                        <td style="border: 1px solid #000; padding: 4px;">D</td>
                        <td style="border: 1px solid #000; padding: 4px;">E</td>
                        <td style="border: 1px solid #000; padding: 4px;">F</td>
                        <td style="border: 1px solid #000; padding: 4px;">1</td>
                        <td style="border: 1px solid #000; padding: 4px;">2</td>
                        <td style="border: 1px solid #000; padding: 4px;">3</td>
                        <td style="border: 1px solid #000; padding: 4px;">G</td>
                    </tr>
                </thead>
                <tbody>
                    ${data
                      .map(
                        (record) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${formatDate(record.ngay_ct)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${formatDate(record.ngay_lct)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${
                                  record.ps_no
                                    ? record.so_ct_trim || record.so_ct || ""
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${
                                  record.ps_co
                                    ? record.so_ct_trim || record.so_ct || ""
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                ${record.dien_giai || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${
                                  record.tk_du ||
                                  record.tk_no ||
                                  record.tk_co ||
                                  ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_no
                                    ? formatCurrency(record.ps_no)
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_co
                                    ? formatCurrency(record.ps_co)
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${formatCurrency(record.so_ton || record.so_du)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px;"></td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>

           <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                <div style="text-align: left; margin-bottom: 10px; font-size: 11px;">
                    Số dây có: 01 trang, đánh số từ trang 01 đến trang 01<br/>
                    Ngày mở sổ: ${filterInfo?.ngay_ct1 || "01-08-2025"}
                </div>
               <table style="width: 200px; border-collapse: collapse; font-size: 12px; margin-right: 90px;">
                    <tr>
                        <td style="padding: 2px 4px; font-weight: bold;">TỔNG PHÁT SINH NỢ:</td>
                        <td style="padding: 2px 4px; text-align: right; font-weight: bold; color: #0066cc;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tongThu
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px; font-weight: bold;">TỔNG PHÁT SINH CÓ:</td>
                        <td style="padding: 2px 4px; text-align: right; font-weight: bold; color: #cc0000;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tongChi
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 4px; font-weight: bold;">SỐ DƯ CÓ CUỐI KỲ:</td>
                        <td style="padding: 2px 4px; text-align: right; font-weight: bold;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tonCuoiKy
                            )}
                        </td>
                    </tr>
                </table>

            </div>
            <div style="text-align: right; font-size: 11px; margin-top: 40px; margin-right: 30px;"> 
                Ngày......tháng.....năm........
            </div>
            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <div style="text-align: center; width: 200px;">
                    <div style="">NGƯỜI LẬP BIỂU</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                   
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="">KẾ TOÁN TRƯỞNG</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                   
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="">GIÁM ĐỐC</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên, đóng dấu)</div>
                    
                </div>
            </div>
            <div style="text-align: left; margin-top: 40px; font-size: 10px;">
                Trang: 1, ${new Date().toLocaleDateString("vi-VN")}
            </div>
        </div>
    `,
  // Template cho Sổ chi tiết của một tài khoản
  soChiTiet: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
            <!-- Header -->
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                
                <div style="text-align: right; font-size: 10px; margin-bottom: 10px;">
                    Mã số Thuế: 0104929879<br/>
                    Mẫu số: S05 - DNN<br/>
                    (Ban hành theo Thông tư số 133/2016/TT-BTC<br/>
                    ngày 26/8/2016 của Bộ Tài chính)
                </div>
                
                <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                    SỔ CHI TIẾT CỦA MỘT TÀI KHOẢN
                </h2>
                <div style="font-size: 12px; margin-bottom: 10px;">
                    TÀI KHOẢN: ${filterInfo?.tk || "1111"} - TIỀN MẶT VND<br/>
                    TỪ NGÀY: ${filterInfo?.ngay_ct1 || ""} ĐẾN NGÀY: ${
    filterInfo?.ngay_ct2 || ""
  }
                </div>
                <div style="text-align: right; margin-bottom: 20px; font-weight: bold;">
                    SỐ DƯ ĐẦU KỲ: ${formatCurrency(totals?.soDuDauKy || 0)}
                </div>
            </div>

            <!-- Main Table -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
                <thead>
                    <tr>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #f5f5f5; text-align: center;">
                            CHỨNG TỪ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #f5f5f5; text-align: center;">
                            KHÁCH HÀNG
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #f5f5f5; text-align: center;">
                            DIỄN GIẢI
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">
                            TK Đ.ỨNG
                        </th>
                        <th colspan="2" style="border: 1px solid #000; padding: 6px; background-color: #f5f5f5; text-align: center;">
                            SỐ PHÁT SINH
                        </th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">NGÀY</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">SỐ</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #f5f5f5; text-align: center;">NỢ</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #f5f5f5; text-align: center;">CÓ</th>
                    </tr>
                    <tr style="text-align: center; font-weight: bold; font-style: italic; font-size: 10px;">
                        <td style="border: 1px solid #000; padding: 4px;">A</td>
                        <td style="border: 1px solid #000; padding: 4px;">B</td>
                        <td style="border: 1px solid #000; padding: 4px;">C</td>
                        <td style="border: 1px solid #000; padding: 4px;">D</td>
                        <td style="border: 1px solid #000; padding: 4px;">E</td>
                        <td style="border: 1px solid #000; padding: 4px;">F</td>
                        <td style="border: 1px solid #000; padding: 4px;">G</td>
                    </tr>
                </thead>
                <tbody>
                    ${data
                      .map(
                        (record) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${formatDate(record.ngay_ct)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${record.so_ct_trim || record.so_ct || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                ${record.khach_hang || record.ten_kh || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                ${record.dien_giai || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${record.ten_tk_du || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_no
                                    ? formatCurrency(record.ps_no)
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_co
                                    ? formatCurrency(record.ps_co)
                                    : ""
                                }
                            </td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>

            <!-- Summary -->
            <div style="margin-top: 20px;">
                <div style="text-align: left; margin-bottom: 10px; font-size: 11px;">
                    Số dây có: ${
                      data.length
                    } dòng, đánh số từ trang 01 đến trang 01<br/>
                    Ngày mở sổ: ${filterInfo?.ngay_ct1 || "01-08-2025"}
                </div>

                <div style="text-align: right; margin-bottom: 20px;">
                    <div style="display: inline-block; text-align: left; font-size: 12px;">
                        <div style="margin-bottom: 5px;">
                            <strong>TỔNG PHÁT SINH NỢ:</strong> 
                            <span style="margin-left: 20px; font-weight: bold;">${new Intl.NumberFormat("vi-VN").format(
                              totals.tongThu
                            )}</span>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>TỔNG PHÁT SINH CÓ:</strong> 
                            <span style="margin-left: 20px; font-weight: bold;">${new Intl.NumberFormat("vi-VN").format(
                              totals.tongChi
                            )}</span>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>SỐ DƯ NỢ CUỐI KỲ:</strong> 
                            <span style="margin-left: 20px; font-weight: bold;">${new Intl.NumberFormat("vi-VN").format(
                              totals.tonCuoiKy
                            )}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 11px;">
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">NGƯỜI LẬP BIỂU</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">KẾ TOÁN TRƯỞNG</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">GIÁM ĐỐC</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên, đóng dấu)</div>
                </div>
            </div>

            <!-- <div style="text-align: right; margin-top: 20px; font-size: 10px;">
                Trang: 1, ${new Date().toLocaleDateString("vi-VN")}
            </div> -->
        </div>
    `,

  // Template cho Sổ tiền gửi ngân hàng
  soTienGui: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; line-height: 1.4;">
            <!-- Header -->
            <div style="font-size: 10px; text-align: left;">
                Công ty Cổ phần Công nghệ Gentech<br/>
                Tầng 02 CT3 Nghĩa Đô, Cổ Nhuế, TP Hà Nội
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="text-align: right; font-size: 10px; margin-bottom: 10px;">
                    Mã số Thuế: 0104929879<br/>
                    Mẫu số: S05 - DNN<br/>
                    (Ban hành theo Thông tư số 133/2016/TT-BTC<br/>
                    ngày 26/8/2016 của Bộ Tài chính)
                </div>
                
                <h2 style="font-size: 16px; font-weight: bold; margin: 20px 0; text-transform: uppercase;">
                    SỔ TIỀN GỬI NGÂN HÀNG
                </h2>
                <div style="font-size: 12px; margin-bottom: 10px;">
                    NƠI MỞ TÀI KHOẢN GIAO DỊCH:<br/>
                    SỐ HIỆU TÀI KHOẢN TẠI NƠI GỬI:<br/>
                    TÀI KHOẢN: ${filterInfo?.tk || "1111"} - TIỀN MẶT VND<br/>
                    TỪ NGÀY: ${filterInfo?.ngay_ct1 || ""} ĐẾN NGÀY: ${
    filterInfo?.ngay_ct2 || ""
  }
                </div>
                <div style="text-align: right; margin-bottom: 20px; font-weight: bold;">
                    SỐ DƯ ĐẦU KỲ: ${formatCurrency(totals?.soDuDauKy || 0)}
                </div>
            </div>

            <!-- Main Table -->
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px;">
                <thead>
                    <tr>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">
                            NGÀY, THÁNG GHI SỐ
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">
                            SỐ HIỆU
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">
                            NGÀY, THÁNG
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; background-color: #f5f5f5; text-align: center;">
                            DIỄN GIẢI
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">
                            TK ĐỐI ỨNG
                        </th>
                        <th colspan="3" style="border: 1px solid #000; padding: 6px; background-color: #f5f5f5; text-align: center;">
                            SỐ TIỀN
                        </th>
                        <th rowspan="2" style="border: 1px solid #000; padding: 6px; width: 80px; background-color: #f5f5f5; text-align: center;">
                            GHI CHÚ
                        </th>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #f5f5f5; text-align: center;">THU (GỞI VÀO)</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #f5f5f5; text-align: center;">CHI (RÚT RA)</th>
                        <th style="border: 1px solid #000; padding: 6px; width: 100px; background-color: #f5f5f5; text-align: center;">CÒN LẠI</th>
                    </tr>
                    <tr style="text-align: center; font-weight: bold; font-style: italic; font-size: 10px;">
                        <td style="border: 1px solid #000; padding: 4px;">A</td>
                        <td style="border: 1px solid #000; padding: 4px;">B</td>
                        <td style="border: 1px solid #000; padding: 4px;">C</td>
                        <td style="border: 1px solid #000; padding: 4px;">D</td>
                        <td style="border: 1px solid #000; padding: 4px;">E</td>
                        <td style="border: 1px solid #000; padding: 4px;">1</td>
                        <td style="border: 1px solid #000; padding: 4px;">2</td>
                        <td style="border: 1px solid #000; padding: 4px;">3</td>
                        <td style="border: 1px solid #000; padding: 4px;">F</td>
                    </tr>
                </thead>
                <tbody>
                    ${data
                      .map(
                        (record) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${formatDate(record.ngay_ct)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${record.so_ct_trim || record.so_ct || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${formatDate(record.ngay_ct)}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: left;">
                                ${record.dien_giai || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">
                                ${record.ten_tk || "-"}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_no
                                    ? formatCurrency(record.ps_no)
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                ${
                                  record.ps_co
                                    ? formatCurrency(record.ps_co)
                                    : ""
                                }
                            </td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">
                                 ${formatCurrency(
                                   record.so_ton || record.so_du
                                 )}
                            </td>
                            <td style="border: 1px solid #000; padding: 4px;">${
                              record.ghi_chu || ""
                            }</td>
                        </tr>
                    `
                      )
                      .join("")}
                    
                    <!-- Summary row in table -->
                    <!-- <tr>
                        <td colspan="4" style="border: 1px solid #000; padding: 4px; text-align: center; font-weight: bold;">
                            CỘNG CHUYỂN SANG TRANG SAU:
                        </td>
                        <td style="border: 1px solid #000; padding: 4px;"></td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                            ${formatCurrency(totals?.tongThu || 0)}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold;">
                            ${formatCurrency(totals?.tongChi || 0)}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px;"></td>
                        <td style="border: 1px solid #000; padding: 4px;"></td>
                    </tr> -->
                </tbody>
            </table>

            <!-- Footer with summary information -->
            <div style="margin-top: 20px;">
                <div style="text-align: left; margin-bottom: 10px; font-size: 11px;">
                    Số nay có ${
                      Math.ceil(data.length / 25) || 1
                    } trang, đánh số từ trang 01 đến trang ${
    Math.ceil(data.length / 25) || 1
  }<br/>
                    Ngày mở sổ: ${filterInfo?.ngay_ct1 || "01-07-2025"}
                </div>
                
                <div style="text-align: right; margin-bottom: 20px;">
                    <div style="display: inline-block; text-align: left; font-size: 12px;">
                        <div style="margin-bottom: 5px;">
                            <strong>TỔNG PHÁT SINH NỢ:</strong> 
                            <span style="margin-left: 20px; font-weight: bold;">${new Intl.NumberFormat("vi-VN").format(
                              totals.tongThu
                            )}</span>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>TỔNG PHÁT SINH CÓ:</strong> 
                            <span style="margin-left: 20px; font-weight: bold;">${new Intl.NumberFormat("vi-VN").format(
                              totals.tongChi
                            )}</span>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <strong>SỐ DƯ NỢ CUỐI KỲ:</strong> 
                            <span style="margin-left: 20px; font-weight: bold;">${new Intl.NumberFormat("vi-VN").format(
                              totals.tonCuoiKy
                            )}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Signatures -->
            <div style="display: flex; justify-content: space-between; margin-top: 40px; font-size: 11px;">
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">NGƯỜI LẬP BIỂU</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">KẾ TOÁN TRƯỞNG</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên)</div>
                </div>
                <div style="text-align: center; width: 200px;">
                    <div style="font-weight: bold;">GIÁM ĐỐC</div>
                    <div style="font-style: italic; margin-bottom: 60px;">(Ký, họ tên, đóng dấu)</div>
                </div>
            </div>

            <!-- <div style="text-align: right; margin-top: 20px; font-size: 10px;">
                Trang: 1, ${new Date().toLocaleDateString("vi-VN")}
            </div> -->
        </div>
    `,

  // Template mặc định
  default: (data, filterInfo, totals) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="font-size: 16px; font-weight: bold;">BÁO CÁO CHI TIẾT</h2>
                <div style="font-size: 12px;">
                    Từ ngày: ${filterInfo?.ngay_ct1 || ""} đến ngày: ${
    filterInfo?.ngay_ct2 || ""
  }
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">STT</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Ngày CT</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Số CT</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Diễn giải</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Phát sinh Nợ</th>
                        <th style="border: 1px solid #000; padding: 8px; background-color: #EBF8EC;">Phát sinh Có</th>
                    </tr>
                </thead>
                <tbody>
                    ${data
                      .map(
                        (record, index) => `
                        <tr>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${
                              index + 1
                            }</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${formatDate(
                              record.ngay_ct
                            )}</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: center;">${
                              record.so_ct_trim || record.so_ct || "-"
                            }</td>
                            <td style="border: 1px solid #000; padding: 4px;">${
                              record.dien_giai || "-"
                            }</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${
                              record.ps_no ? formatCurrency(record.ps_no) : "-"
                            }</td>
                            <td style="border: 1px solid #000; padding: 4px; text-align: right;">${
                              record.ps_co ? formatCurrency(record.ps_co) : "-"
                            }</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="border: 1px solid #000; padding: 4px; font-weight: bold; text-align: center;">TỔNG CỘNG</td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold; color: #0066cc;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tongThu
                            )}
                        </td>
                        <td style="border: 1px solid #000; padding: 4px; text-align: right; font-weight: bold; color: #cc0000;">
                            ${new Intl.NumberFormat("vi-VN").format(
                              totals.tongChi
                            )}
                        </td>
                    </tr>
                </tfoot>
            </table>

            <!-- Summary Info -->
            <div style="margin-top: 20px; font-size: 11px;">
                <div>Tổng số bản ghi: ${data.length}</div>
                <div>Ngày in: ${new Date().toLocaleDateString("vi-VN")}</div>
            </div>
        </div>
    `,
};
