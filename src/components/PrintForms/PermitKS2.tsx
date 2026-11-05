import React from 'react';
import { SoundPermitApplication } from '../../types';
import { GarudaEmblem } from '../GarudaEmblem';
import { getThaiDateParts, toThaiDigits, getCategoryLabel } from '../../utils/thaiDate';
import { MUNICIPALITY_INFO } from '../../utils/constants';
import { PermitBacksidePrint } from './PermitBacksidePrint';

interface PermitKS2Props {
  application: SoundPermitApplication;
  mode?: 'full_certificate' | 'vehicle_placard';
  subMode?: 'front' | 'back' | 'both';
}


export const PermitKS2: React.FC<PermitKS2Props> = ({ 
  application, 
  mode = 'full_certificate',
  subMode = 'front'
}) => {
  const permitDate = application.officerReview?.paymentDate 
    ? getThaiDateParts(application.officerReview.paymentDate)
    : getThaiDateParts(application.submissionDate);

  const startDate = getThaiDateParts(application.adDetails.startDate);
  const endDate = getThaiDateParts(application.adDetails.endDate);
  const applicant = application.applicant;
  const review = application.officerReview;
  const equip = application.equipment;
  const ad = application.adDetails;

  if (mode === 'vehicle_placard') {
    return (
      <div className="gov-doc bg-white border-4 border-amber-600 rounded-xl p-8 max-w-[210mm] mx-auto text-black shadow-lg print:shadow-none print:border-4 print:border-black">
        {/* Header with Garuda and Municipality Emblem */}
        <div className="flex items-center justify-between border-b-2 border-amber-700 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <GarudaEmblem width={65} height={70} color="#000000" />
            <img
              src={MUNICIPALITY_INFO.logoUrl}
              alt="ตราเทศบาลตำบลพระซอง"
              className="w-16 h-16 object-contain rounded-full border border-amber-400 p-0.5 bg-white"
            />
          </div>
          <div className="text-center flex-1 px-4">
            <div className="text-xl font-bold font-sarabun text-amber-950">
              {MUNICIPALITY_INFO.name} {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}
            </div>
            <div className="text-2xl font-black font-sarabun tracking-wide text-red-700 uppercase mt-0.5">
              บัตรอนุญาตโฆษณาโดยใช้เครื่องขยายเสียง (ประจำรถแห่/สถานที่)
            </div>
            <div className="text-sm font-semibold text-gray-700">
              ออกตามความในพระราชบัญญัติควบคุมการโฆษณาโดยใช้เครื่องขยายเสียง พ.ศ. ๒๔๙๓
            </div>
          </div>
          <div className="text-right border border-gray-400 p-2 rounded bg-amber-50">
            <div className="text-xs text-gray-500">เลขที่ใบอนุญาต</div>
            <div className="text-lg font-bold font-mono text-blue-900">
              {review?.permitNumber || 'ฆ.ษ. -/๒๕๖๙'}
            </div>
          </div>
        </div>

        {/* Big Info Grid for easy police/traffic inspection */}
        <div className="grid grid-cols-2 gap-4 text-[16px] leading-relaxed mb-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-500 mb-1">ผู้ได้รับอนุญาต</div>
            <div className="text-xl font-bold text-slate-900">
              {applicant.prefix}{applicant.fullName}
            </div>
            <div className="text-sm text-slate-600 mt-1">โทรศัพท์: {applicant.phone}</div>
            <div className="text-sm text-slate-600">
              ที่อยู่: บ้านเลขที่ {applicant.houseNumber} หมู่ {applicant.villageNo} ต.{applicant.subdistrict} อ.{applicant.district}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-xs font-bold text-slate-500 mb-1">ยานพาหนะ / อุปกรณ์</div>
            <div className="text-lg font-bold text-indigo-900">
              {equip.vehicleRegistration || 'โฆษณาประจำที่'}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              เลขทะเบียนเครื่องขยายเสียง: {toThaiDigits(equip.amplifierSerial)}
            </div>
            <div className="text-sm text-slate-600">
              อุปกรณ์: {equip.equipmentBrand || 'TOA / NPE'} (ระดับเสียงไม่เกิน ๘๕ เดซิเบล)
            </div>
          </div>
        </div>

        {/* Validity Period - Highly Visible */}
        <div className="bg-amber-100/70 border-2 border-amber-500 rounded-lg p-4 text-center mb-4">
          <div className="text-sm font-bold text-amber-900">ระยะเวลาที่ได้รับอนุญาต</div>
          <div className="text-2xl font-black text-amber-950 my-1">
            ตั้งแต่วันที่ {toThaiDigits(startDate.day)} {startDate.month} พ.ศ. {toThaiDigits(startDate.yearBE)} ถึงวันที่ {toThaiDigits(endDate.day)} {endDate.month} พ.ศ. {toThaiDigits(endDate.yearBE)}
          </div>
          <div className="text-sm font-semibold text-amber-800">
            รวม {toThaiDigits(ad.totalDays)} วัน | ช่วงเวลาที่อนุญาต: {ad.dailyStartTime || '08:30'} - {ad.dailyEndTime || '17:30'} น. เท่านั้น
          </div>
        </div>

        {/* Details & Conditions */}
        <div className="text-sm space-y-1 mb-4 text-gray-800">
          <div><span className="font-bold">วัตถุประสงค์:</span> {ad.purpose}</div>
          <div><span className="font-bold">สถานที่ / เส้นทาง:</span> {ad.locationDescription} (ต.พระซอง อ.นาแก)</div>
          <div className="text-xs text-red-600 font-semibold pt-1">
            * เงื่อนไข: ต้องพกบัตรนี้ไว้ประจำรถหรือจุดโฆษณา, ห้ามใช้เสียงใกล้โรงพยาบาล/วัดขณะทำพิธี, ระดับเสียงต้องไม่เกิน 85 เดซิเบล
          </div>
        </div>

        {/* Footer with Signatures and QR Code representation */}
        <div className="flex items-center justify-between border-t border-gray-300 pt-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-900 text-white flex flex-col items-center justify-center rounded p-1 text-[9px] text-center">
              <span className="font-bold">QR CODE</span>
              <span>ตรวจสอบ</span>
              <span>ความถูกต้อง</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>เลขที่คำร้อง: {application.referenceNumber}</div>
              <div>ใบเสร็จรับเงินเลขที่: {review?.receiptNumber || '-'}</div>
              <div>ชำระค่าธรรมเนียม: {application.fee.totalAmount} บาท ({application.fee.amountText})</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">(ลงชื่อ)......................................................</div>
            <div className="text-sm font-bold">({review?.approverName || MUNICIPALITY_INFO.approverNameDefault})</div>
            <div className="text-xs text-gray-600">{review?.approverPosition || MUNICIPALITY_INFO.approverTitleDefault}</div>
            <div className="text-xs text-gray-500 mt-1">ผู้ออกใบอนุญาต</div>
          </div>
        </div>
      </div>
    );
  }

  if (subMode === 'back') {
    return <PermitBacksidePrint />;
  }

  const renderFrontPage = () => (
    <div className="gov-doc bg-white text-black p-8 sm:p-12 max-w-[210mm] mx-auto shadow-md print:shadow-none print:p-0 print:max-w-none text-[15px] leading-[1.8] min-h-[280mm] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="relative mb-3">
          <div className="absolute left-0 top-0 flex items-center space-x-2.5">
            <img
              src={MUNICIPALITY_INFO.logoUrl}
              alt="ตราเทศบาลตำบลพระซอง"
              className="w-16 h-16 object-contain rounded-full border border-gray-300 p-0.5 bg-white"
            />
            <div className="text-left text-xs leading-tight font-sarabun text-gray-700 hidden sm:block">
              <div className="font-bold text-[13px] text-black">{MUNICIPALITY_INFO.name}</div>
              <div>{MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}</div>
            </div>
          </div>

          <div className="text-right text-[14px] font-sarabun font-bold">
            (แบบ ฆ.ษ. ๒)
          </div>
          <div className="flex justify-center -mt-1">
            <GarudaEmblem width={70} height={75} color="#000000" />
          </div>
        </div>

        <h1 className="text-center text-[20px] font-bold font-sarabun mt-1 mb-2 tracking-wide">
          ใบอนุญาตให้ทำการโฆษณาโดยใช้เครื่องขยายเสียง
        </h1>
        <div className="text-center text-sm font-medium text-gray-700 mb-4">
          ตามพระราชบัญญัติควบคุมการโฆษณาโดยใช้เครื่องขยายเสียง พ.ศ. ๒๔๙๓
        </div>

        {/* Permit No & Book No */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
          <div>
            เล่มที่{' '}
            <span className="dotted-fill min-w-[50px] text-center font-bold">
              {review?.permitBookNumber ? toThaiDigits(review.permitBookNumber) : '๑'}
            </span>
          </div>
          <div>
            เลขที่{' '}
            <span className="dotted-fill min-w-[120px] text-center font-bold text-[16px]">
              {review?.permitNumber || 'ฆ.ษ. -/๒๕๖๙'}
            </span>
          </div>
        </div>

        {/* Written At and Date */}
        <div className="text-right space-y-1 mb-6">
          <div>
            สำนักงาน{' '}
            <span className="dotted-fill min-w-[220px] text-center font-semibold">
              {MUNICIPALITY_INFO.name}
            </span>
          </div>
          <div>
            {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}
          </div>
          <div>
            วันที่{' '}
            <span className="dotted-fill min-w-[35px] text-center">
              {toThaiDigits(permitDate.day)}
            </span>{' '}
            เดือน{' '}
            <span className="dotted-fill min-w-[100px] text-center">
              {permitDate.month}
            </span>{' '}
            พ.ศ.{' '}
            <span className="dotted-fill min-w-[50px] text-center">
              {toThaiDigits(permitDate.yearBE)}
            </span>
          </div>
        </div>

        {/* Permit Body */}
        <div className="space-y-3 text-justify leading-loose">
          <div className="indent-12">
            ใบอนุญาตฉบับนี้ออกให้แก่{' '}
            <span className="dotted-fill min-w-[240px] text-center font-bold text-[16px]">
              {applicant.prefix}{applicant.fullName}
            </span>{' '}
            อายุ{' '}
            <span className="dotted-fill min-w-[40px] text-center">
              {toThaiDigits(applicant.age)}
            </span>{' '}
            ปี สัญชาติ{' '}
            <span className="dotted-fill min-w-[70px] text-center">
              {applicant.nationality}
            </span>{' '}
            อยู่บ้านเลขที่{' '}
            <span className="dotted-fill min-w-[70px] text-center">
              {toThaiDigits(applicant.houseNumber)}
            </span>{' '}
            หมู่ที่{' '}
            <span className="dotted-fill min-w-[40px] text-center">
              {toThaiDigits(applicant.villageNo)}
            </span>{' '}
            ถนน{' '}
            <span className="dotted-fill min-w-[120px] text-center">
              {applicant.road || '-'}
            </span>{' '}
            ตำบล{' '}
            <span className="dotted-fill min-w-[100px] text-center">
              {applicant.subdistrict}
            </span>{' '}
            อำเภอ{' '}
            <span className="dotted-fill min-w-[100px] text-center">
              {applicant.district}
            </span>{' '}
            จังหวัด{' '}
            <span className="dotted-fill min-w-[100px] text-center">
              {applicant.province}
            </span>
          </div>

          <div className="indent-12">
            เพื่อทำการโฆษณาประเภท{' '}
            <span className="dotted-fill min-w-[300px] text-center font-semibold">
              {getCategoryLabel(ad.category)}
            </span>
          </div>

          <div className="indent-12">
            เรื่อง / วัตถุประสงค์{' '}
            <span className="dotted-fill min-w-[420px] text-center">
              {ad.purpose}
            </span>
          </div>

          <div className="indent-12">
            โดยใช้เครื่องขยายเสียงเลขทะเบียน{' '}
            <span className="dotted-fill min-w-[130px] text-center font-mono">
              {toThaiDigits(equip.amplifierSerial)}
            </span>{' '}
            ไมโครโฟนเลขทะเบียน{' '}
            <span className="dotted-fill min-w-[120px] text-center font-mono">
              {toThaiDigits(equip.microphoneSerial)}
            </span>{' '}
            {equip.vehicleRegistration && (
              <>
                ติดตั้งบนยานพาหนะ{' '}
                <span className="dotted-fill min-w-[140px] text-center font-bold">
                  {equip.vehicleRegistration}
                </span>
              </>
            )}
          </div>

          <div className="indent-12">
            ณ บริเวณ / เส้นทาง{' '}
            <span className="dotted-fill min-w-[360px] text-center">
              {ad.locationDescription} ตำบลพระซอง อำเภอนาแก จังหวัดนครพนม
            </span>
          </div>

          <div className="indent-12">
            มีกำหนด{' '}
            <span className="dotted-fill min-w-[45px] text-center font-bold">
              {toThaiDigits(ad.totalDays)}
            </span>{' '}
            วัน (คิดเป็น{' '}
            <span className="dotted-fill min-w-[40px] text-center font-bold">
              {toThaiDigits(ad.periodsCount)}
            </span>{' '}
            คราว) ตั้งแต่วันที่{' '}
            <span className="dotted-fill min-w-[35px] text-center">
              {toThaiDigits(startDate.day)}
            </span>{' '}
            เดือน{' '}
            <span className="dotted-fill min-w-[100px] text-center">
              {startDate.month}
            </span>{' '}
            พ.ศ.{' '}
            <span className="dotted-fill min-w-[50px] text-center">
              {toThaiDigits(startDate.yearBE)}
            </span>{' '}
            ถึงวันที่{' '}
            <span className="dotted-fill min-w-[35px] text-center">
              {toThaiDigits(endDate.day)}
            </span>{' '}
            เดือน{' '}
            <span className="dotted-fill min-w-[100px] text-center">
              {endDate.month}
            </span>{' '}
            พ.ศ.{' '}
            <span className="dotted-fill min-w-[50px] text-center">
              {toThaiDigits(endDate.yearBE)}
            </span>
          </div>

          <div className="indent-12">
            เวลาที่อนุญาตให้ใช้เสียงระหว่างเวลา{' '}
            <span className="dotted-fill min-w-[70px] text-center font-bold">
              {ad.dailyStartTime || '08:30'}
            </span>{' '}
            น. ถึงเวลา{' '}
            <span className="dotted-fill min-w-[70px] text-center font-bold">
              {ad.dailyEndTime || '17:30'}
            </span>{' '}
            น. ของแต่ละวัน
          </div>

          {/* Conditions */}
          <div className="bg-slate-50 border border-slate-300 rounded p-4 text-[13.5px] leading-relaxed mt-4">
            <div className="font-bold underline mb-1">เงื่อนไขการใช้เครื่องขยายเสียง:</div>
            <ol className="list-decimal pl-6 space-y-0.5">
              <li>ต้องไม่ส่งเสียงดังก่อความเดือดร้อนรำคาญแก่ประชาชน ระดับเสียงต้องไม่เกิน ๘๕ เดซิเบลเอ ณ ระยะ ๑๕ เมตร</li>
              <li>ห้ามใช้ถ้อยคำหยาบคาย ลามก อนาจาร หรือพาดพิงก่อให้เกิดความเสียหาย หรือขัดต่อความสงบเรียบร้อยและศีลธรรมอันดี</li>
              <li>ห้ามใช้เสียงใกล้บริเวณโรงพยาบาล สถานีอนามัย โรงเรียน (ขณะเวลาเรียน) หรือวัด/ศาสนสถานขณะประกอบพิธีกรรม</li>
              <li>ผู้ได้รับอนุญาตต้องพกใบอนุญาตนี้ไว้พร้อมแสดงต่อพนักงานเจ้าหน้าที่หรือตำรวจเมื่อถูกเรียกตรวจ</li>
            </ol>
          </div>

          {/* Fee Reference */}
          <div className="text-[14px] text-gray-700 pt-2">
            ได้รับค่าธรรมเนียมเป็นเงินจำนวน{' '}
            <span className="font-bold text-black">{toThaiDigits(application.fee.totalAmount)}</span> บาท ({application.fee.amountText}) ตามใบเสร็จรับเงินเลขที่{' '}
            <span className="font-bold text-black">{review?.receiptNumber || '-'}</span> เรียบร้อยแล้ว
          </div>
        </div>

        {/* Signature Box */}
        <div className="mt-8 flex justify-end">
          <div className="text-center w-80 space-y-1">
            <div className="h-6"></div>
            <div>
              (ลงชื่อ){' '}
              <span className="dotted-fill min-w-[180px] text-center"></span>
            </div>
            <div>
              ({review?.approverName || MUNICIPALITY_INFO.approverNameDefault})
            </div>
            <div className="font-semibold">
              ตำแหน่ง {review?.approverPosition || MUNICIPALITY_INFO.approverTitleDefault}
            </div>
            <div>
              เจ้าพนักงานผู้ออกใบอนุญาต
            </div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-gray-400 text-center border-t border-gray-200 pt-2">
        สำนักงานเทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม ๔๘๑๓๐ โทรศัพท์ ๐-๔๒๕๙-๙xxx
      </div>
    </div>
  );

  if (subMode === 'both') {
    return (
      <div className="space-y-8">
        {renderFrontPage()}
        <div className="page-break no-print text-center py-4 text-xs font-bold text-slate-400">
          --- ด้านหลังใบอนุญาต (Page 2) ---
        </div>
        <PermitBacksidePrint />
      </div>
    );
  }

  return renderFrontPage();
};

