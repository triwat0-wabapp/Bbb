import React from 'react';
import { SoundPermitApplication } from '../../types';
import { GarudaEmblem } from '../GarudaEmblem';
import { getThaiDateParts, toThaiDigits, getCategoryLabel } from '../../utils/thaiDate';
import { MUNICIPALITY_INFO } from '../../utils/constants';

interface ReceiptPrintProps {
  application: SoundPermitApplication;
}

export const ReceiptPrint: React.FC<ReceiptPrintProps> = ({ application }) => {
  const payDate = application.officerReview?.paymentDate 
    ? getThaiDateParts(application.officerReview.paymentDate)
    : getThaiDateParts(application.submissionDate);

  const applicant = application.applicant;
  const review = application.officerReview;

  return (
    <div className="gov-doc bg-white text-black p-8 sm:p-12 max-w-[210mm] mx-auto shadow-md print:shadow-none print:p-0 print:max-w-none text-[15px] leading-[1.8] min-h-[220mm] flex flex-col justify-between border-2 border-dashed border-gray-400 print:border-none">
      <div>
        {/* Official Thai Municipal Receipt Header with Attached Garuda */}
        <div className="mb-4 pb-4 border-b-2 border-black">
          {/* Top row: Left Municipality Seal, Center Royal Garuda & Title, Right Book/No. box */}
          <div className="grid grid-cols-3 items-center">
            {/* Left: Municipality Seal */}
            <div className="flex items-center space-x-3 justify-start">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาลตำบลพระซอง"
                className="w-18 h-18 object-contain rounded-full border-2 border-amber-600 p-0.5 bg-white shadow-xs"
              />
              <div className="text-left font-sarabun hidden sm:block">
                <div className="text-sm font-bold text-black">{MUNICIPALITY_INFO.name}</div>
                <div className="text-xs text-gray-700">{MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}</div>
                <div className="text-[11px] text-gray-500">โทร. ๐-๔๒๕๙-๙xxx</div>
              </div>
            </div>

            {/* Center: Attached Royal Garuda & Receipt Title */}
            <div className="text-center flex flex-col items-center justify-center">
              <img
                src="/assets/aistudio/images__1__cd25ae2e.jfif"
                alt="ตราครุฑหัวใบเสร็จ"
                className="w-20 h-22 object-contain mix-blend-multiply select-none"
              />
              <h1 className="text-2xl font-bold font-sarabun text-black tracking-wide mt-1">
                ใบเสร็จรับเงิน
              </h1>
              <div className="text-sm font-bold font-sarabun text-slate-800">
                {MUNICIPALITY_INFO.name}
              </div>
              <div className="text-xs text-gray-600 font-sarabun">
                {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}
              </div>
            </div>

            {/* Right: Official Book No. and Receipt No. Box */}
            <div className="flex justify-end">
              <div className="border-2 border-black p-2.5 rounded-sm bg-white min-w-[150px] font-sarabun shadow-2xs">
                <div className="flex justify-between items-center border-b border-gray-300 pb-1 mb-1 text-xs">
                  <span className="text-gray-700 font-medium">เล่มที่:</span>
                  <span className="font-bold text-sm text-black">
                    {review?.permitBookNumber ? toThaiDigits(review.permitBookNumber) : '๑'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-700 font-medium">เลขที่:</span>
                  <span className="font-bold text-base text-blue-900">
                    {review?.receiptNumber || 'บส-๐๑/๒๕๖๙'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date and Address Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 text-sm font-sarabun border-b border-gray-200 pb-2">
          <div className="text-xs text-gray-600">
            สำนักงาน{MUNICIPALITY_INFO.name} {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province} {toThaiDigits(MUNICIPALITY_INFO.postalCode)}
          </div>
          <div className="text-right font-medium">
            วันที่ <span className="font-bold underline decoration-dotted decoration-gray-400 px-1">{toThaiDigits(payDate.day)}</span> เดือน <span className="font-bold underline decoration-dotted decoration-gray-400 px-1">{payDate.month}</span> พ.ศ. <span className="font-bold underline decoration-dotted decoration-gray-400 px-1">{toThaiDigits(payDate.yearBE)}</span>
          </div>
        </div>

        {/* Payer Details & References */}
        <div className="bg-slate-50/70 p-3.5 rounded border border-gray-200 mb-5 space-y-1.5 text-[14.5px]">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              ได้รับเงินจาก:{' '}
              <span className="font-bold text-[16px] text-black underline decoration-dotted px-1">
                {applicant.prefix}{applicant.fullName}
              </span>
            </div>
            {applicant.idCardNumber && (
              <div className="text-xs text-gray-700">
                เลขประจำตัวประชาชน:{' '}
                <span className="font-mono font-semibold">{toThaiDigits(applicant.idCardNumber)}</span>
              </div>
            )}
          </div>
          <div>
            ที่อยู่:{' '}
            <span className="text-gray-900">
              บ้านเลขที่ {toThaiDigits(applicant.houseNumber)} หมู่ {toThaiDigits(applicant.villageNo)} {applicant.road ? `ถนน ${applicant.road}` : ''} ตำบล{applicant.subdistrict} อำเภอ{applicant.district} จังหวัด{applicant.province} {toThaiDigits(applicant.postalCode)}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600 pt-1 border-t border-gray-200">
            <div>
              อ้างอิงคำร้อง (แบบ ฆ.ษ. ๑) เลขที่:{' '}
              <span className="font-bold text-black">{application.referenceNumber}</span>
            </div>
            <div>
              ใบอนุญาต (แบบ ฆ.ษ. ๒) เลขที่:{' '}
              <span className="font-bold text-black">{review?.permitNumber || '-'}</span>
            </div>
          </div>
        </div>

        {/* Table of items */}
        <table className="w-full border-collapse border border-gray-400 my-6 text-[14px]">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-gray-400 p-2 text-center w-12">ลำดับ</th>
              <th className="border border-gray-400 p-2 text-left">รายการ</th>
              <th className="border border-gray-400 p-2 text-center w-24">จำนวนคราว</th>
              <th className="border border-gray-400 p-2 text-right w-28">อัตราต่อคราว (บาท)</th>
              <th className="border border-gray-400 p-2 text-right w-28">จำนวนเงิน (บาท)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-3 text-center align-top">๑</td>
              <td className="border border-gray-400 p-3 align-top">
                <div className="font-bold">ค่าธรรมเนียมใบอนุญาตทำการโฆษณาโดยใช้เครื่องขยายเสียง</div>
                <div className="text-xs text-gray-600 mt-1">
                  ประเภท: {getCategoryLabel(application.adDetails.category)}
                </div>
                <div className="text-xs text-gray-500">
                  (ระยะเวลา {toThaiDigits(application.adDetails.totalDays)} วัน คราวละไม่เกิน ๑๕ วัน รวม {toThaiDigits(application.adDetails.periodsCount)} คราว)
                </div>
                <div className="text-xs text-gray-500">
                  ตามใบอนุญาตเลขที่: {review?.permitNumber || '-'}
                </div>
              </td>
              <td className="border border-gray-400 p-3 text-center align-top font-bold">
                {toThaiDigits(application.fee.periods)}
              </td>
              <td className="border border-gray-400 p-3 text-right align-top">
                {toThaiDigits(application.fee.ratePerPeriod.toFixed(2))}
              </td>
              <td className="border border-gray-400 p-3 text-right align-top font-bold">
                {toThaiDigits(application.fee.totalAmount.toFixed(2))}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold">
              <td colSpan={3} className="border border-gray-400 p-3 text-left">
                (ตัวอักษร) : <span className="text-blue-900">{application.fee.amountText}</span>
              </td>
              <td className="border border-gray-400 p-3 text-right">รวมเงินสุทธิ</td>
              <td className="border border-gray-400 p-3 text-right text-[16px] text-blue-950">
                {toThaiDigits(application.fee.totalAmount.toFixed(2))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signature Section */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center space-y-1">
            <div className="text-xs text-gray-500 mb-1">ลงชื่อผู้ชำระเงิน</div>
            <div className="min-h-[40px] flex items-center justify-center space-x-1">
              <span>(ลงชื่อ)</span>
              <span className="dotted-fill min-w-[160px] text-center"></span>
            </div>
            <div>({applicant.prefix}{applicant.fullName})</div>
            <div className="text-xs text-gray-600">ผู้ขออนุญาต / ผู้ชำระเงิน</div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xs text-gray-500 mb-1">ลงชื่อผู้รับเงิน</div>
            <div className="min-h-[40px] flex items-center justify-center space-x-1">
              <span>(ลงชื่อ)</span>
              <span className="dotted-fill min-w-[160px] text-center"></span>
            </div>
            <div>({review?.cashierName || MUNICIPALITY_INFO.cashierNameDefault})</div>
            <div className="text-xs text-gray-600">เจ้าหน้าที่การเงิน / ผู้รับเงิน</div>
          </div>
        </div>

        <div className="text-[11px] text-gray-400 text-center mt-6">
          ใบเสร็จรับเงินนี้จะสมบูรณ์เมื่อมีลายมือชื่อผู้รับเงินครบถ้วน
        </div>
      </div>
    </div>
  );
};
