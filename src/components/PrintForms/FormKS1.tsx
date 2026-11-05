import React from 'react';
import { SoundPermitApplication } from '../../types';
import { GarudaEmblem } from '../GarudaEmblem';
import { getThaiDateParts, toThaiDigits } from '../../utils/thaiDate';
import { MUNICIPALITY_INFO } from '../../utils/constants';

interface FormKS1Props {
  application: SoundPermitApplication;
  mode?: 'filled' | 'blank'; // filled for current application, blank for printable blank form
}

export const FormKS1: React.FC<FormKS1Props> = ({ application, mode = 'filled' }) => {
  const isFilled = mode === 'filled';
  const subDate = isFilled ? getThaiDateParts(application.submissionDate) : { day: '', month: '', yearBE: '' };
  const startDate = isFilled ? getThaiDateParts(application.adDetails.startDate) : { day: '', month: '', yearBE: '' };
  const endDate = isFilled ? getThaiDateParts(application.adDetails.endDate) : { day: '', month: '', yearBE: '' };
  const inspDate = isFilled && application.officerReview?.inspectionDate 
    ? getThaiDateParts(application.officerReview.inspectionDate) 
    : { day: '', month: '', yearBE: '' };
  const appDate = isFilled && application.officerReview?.approverDate 
    ? getThaiDateParts(application.officerReview.approverDate) 
    : { day: '', month: '', yearBE: '' };
  const payDate = isFilled && application.officerReview?.paymentDate 
    ? getThaiDateParts(application.officerReview.paymentDate) 
    : { day: '', month: '', yearBE: '' };

  const applicant = application.applicant;
  const equip = application.equipment;
  const ad = application.adDetails;
  const review = application.officerReview;

  return (
    <div className="gov-doc bg-white text-black p-8 sm:p-12 max-w-[210mm] mx-auto shadow-md print:shadow-none print:p-0 print:max-w-none text-[15px] leading-[1.8]">
      
      {/* ================= PAGE 1 ================= */}
      <div className="min-h-[280mm] flex flex-col justify-between page-break">
        <div>
          {/* Header with Official Logo & Garuda */}
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
              (แบบ ฆ.ษ. ๑)
            </div>
            {isFilled && application.referenceNumber && (
              <div className="text-right text-[12px] font-sarabun text-gray-600">
                เลขที่คำร้อง: {application.referenceNumber}
              </div>
            )}
            <div className="flex justify-center -mt-1">
              <GarudaEmblem width={68} height={72} color="#000000" />
            </div>
          </div>

          <h1 className="text-center text-[19px] font-bold font-sarabun mt-1 mb-4 tracking-wide">
            คำร้องขออนุญาตทำการโฆษณาโดยใช้เครื่องขยายเสียง
          </h1>

          {/* Place & Date */}
          <div className="text-right space-y-1 mb-4">
            <div>
              เขียนที่{' '}
              <span className="dotted-fill min-w-[220px] text-center">
                {isFilled ? application.writtenAt : ''}
              </span>
            </div>
            <div>
              วันที่{' '}
              <span className="dotted-fill min-w-[40px] text-center">
                {isFilled ? toThaiDigits(subDate.day) : ''}
              </span>{' '}
              เดือน{' '}
              <span className="dotted-fill min-w-[120px] text-center">
                {isFilled ? subDate.month : ''}
              </span>{' '}
              พ.ศ.{' '}
              <span className="dotted-fill min-w-[60px] text-center">
                {isFilled ? toThaiDigits(subDate.yearBE) : ''}
              </span>
            </div>
          </div>

          {/* Applicant Body Paragraph */}
          <div className="space-y-2 text-justify">
            <div className="indent-12 leading-loose">
              ข้าพเจ้า{' '}
              <span className="dotted-fill min-w-[240px] text-center font-bold">
                {isFilled ? `${applicant.prefix}${applicant.fullName}` : ''}
              </span>{' '}
              อายุ{' '}
              <span className="dotted-fill min-w-[45px] text-center">
                {isFilled ? toThaiDigits(applicant.age) : ''}
              </span>{' '}
              ปี เชื้อชาติ{' '}
              <span className="dotted-fill min-w-[70px] text-center">
                {isFilled ? applicant.race : ''}
              </span>{' '}
              สัญชาติ{' '}
              <span className="dotted-fill min-w-[70px] text-center">
                {isFilled ? applicant.nationality : ''}
              </span>{' '}
              อยู่บ้านเลขที่{' '}
              <span className="dotted-fill min-w-[80px] text-center">
                {isFilled ? toThaiDigits(applicant.houseNumber) : ''}
              </span>{' '}
              หมู่ที่{' '}
              <span className="dotted-fill min-w-[45px] text-center">
                {isFilled ? toThaiDigits(applicant.villageNo) : ''}
              </span>{' '}
              ถนน{' '}
              <span className="dotted-fill min-w-[120px] text-center">
                {isFilled ? applicant.road || '-' : ''}
              </span>{' '}
              ตำบล{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? applicant.subdistrict : ''}
              </span>{' '}
              อำเภอ{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? applicant.district : ''}
              </span>{' '}
              จังหวัด{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? applicant.province : ''}
              </span>{' '}
              เป็นผู้ครอบครองเครื่องขยายเสียงเลขหมายทะเบียนที่{' '}
              <span className="dotted-fill min-w-[130px] text-center font-mono">
                {isFilled ? toThaiDigits(equip.amplifierSerial) : ''}
              </span>{' '}
              ไมโครโฟนเลขหมายทะเบียนที่{' '}
              <span className="dotted-fill min-w-[130px] text-center font-mono">
                {isFilled ? toThaiDigits(equip.microphoneSerial) : ''}
              </span>{' '}
              และเครื่องบันทึกเสียงเลขหมายทะเบียนที่{' '}
              <span className="dotted-fill min-w-[130px] text-center font-mono">
                {isFilled ? toThaiDigits(equip.soundRecorderSerial) : ''}
              </span>{' '}
              ขอทำคำร้องยื่นต่อเจ้าพนักงานผู้ออกใบอนุญาตมีข้อความดังต่อไปนี้
            </div>

            {/* Item 1 */}
            <div className="pt-2">
              <div className="font-semibold mb-1">
                ข้อที่ ๑ ข้าพเจ้ามีความประสงค์จะใช้เครื่องดังกล่าวมานั้นเพื่อทำการโฆษณากิจการ
              </div>
              <div className="pl-6 space-y-1">
                <div className="border-b border-dotted border-gray-600 min-h-[26px] px-2 text-justify">
                  {isFilled ? ad.purpose : ''}
                </div>
                <div className="border-b border-dotted border-gray-600 min-h-[26px] px-2 text-justify">
                  {isFilled && ad.advertisingScript ? `(ข้อความ: ${ad.advertisingScript})` : ''}
                </div>
                <div className="border-b border-dotted border-gray-600 min-h-[26px] px-2 text-justify">
                  {isFilled && equip.vehicleRegistration ? `ยานพาหนะ/อุปกรณ์: ${equip.vehicleRegistration}` : ''}
                </div>
              </div>
            </div>

            {/* Location & Dates */}
            <div className="pt-2 pl-4 leading-loose">
              ณ ที่{' '}
              <span className="dotted-fill min-w-[180px] text-center">
                {isFilled ? (ad.locationDescription || ad.purpose) : ''}
              </span>{' '}
              เลขที่{' '}
              <span className="dotted-fill min-w-[70px] text-center">
                {isFilled ? toThaiDigits(ad.locationHouseNo) : ''}
              </span>{' '}
              หมู่ที่{' '}
              <span className="dotted-fill min-w-[50px] text-center">
                {isFilled ? toThaiDigits(ad.locationVillageNo) : ''}
              </span>{' '}
              ถนน{' '}
              <span className="dotted-fill min-w-[130px] text-center">
                {isFilled ? ad.locationRoad || '-' : ''}
              </span>{' '}
              ตำบล{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? ad.locationSubdistrict : ''}
              </span>{' '}
              อำเภอ{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? ad.locationDistrict : ''}
              </span>{' '}
              จังหวัด{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? ad.locationProvince : ''}
              </span>
            </div>

            <div className="pl-4 leading-loose">
              มีกำหนด{' '}
              <span className="dotted-fill min-w-[50px] text-center font-bold">
                {isFilled ? toThaiDigits(ad.totalDays) : ''}
              </span>{' '}
              วัน ตั้งแต่วันที่{' '}
              <span className="dotted-fill min-w-[40px] text-center">
                {isFilled ? toThaiDigits(startDate.day) : ''}
              </span>{' '}
              เดือน{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? startDate.month : ''}
              </span>{' '}
              พ.ศ.{' '}
              <span className="dotted-fill min-w-[50px] text-center">
                {isFilled ? toThaiDigits(startDate.yearBE) : ''}
              </span>{' '}
              ถึงวันที่{' '}
              <span className="dotted-fill min-w-[40px] text-center">
                {isFilled ? toThaiDigits(endDate.day) : ''}
              </span>{' '}
              เดือน{' '}
              <span className="dotted-fill min-w-[110px] text-center">
                {isFilled ? endDate.month : ''}
              </span>{' '}
              พ.ศ.{' '}
              <span className="dotted-fill min-w-[50px] text-center">
                {isFilled ? toThaiDigits(endDate.yearBE) : ''}
              </span>
            </div>

            {/* Item 2 */}
            <div className="pt-2 indent-12 text-justify">
              ข้อที่ ๒ ข้าพเจ้ารับรองว่าจะปฏิบัติให้ถูกต้องตามกฎหมาย กฎข้อบังคับและเงื่อนไขว่าด้วย
              การควบคุมการโฆษณาโดยเครื่องขยายเสียงทุกประการ
            </div>

            {/* Item 3 */}
            <div className="pt-1 indent-12 text-justify">
              ข้อที่ ๓ ข้าพเจ้าได้แนบใบอนุญาตให้มีเพื่อใช้ฯ ซึ่งมีเลขหมายทะเบียนตามที่แจ้งในคำร้องนี้
              รวม{' '}
              <span className="dotted-fill min-w-[50px] text-center font-bold">
                {isFilled ? toThaiDigits(ad.attachedPermitCopiesCount || 1) : ''}
              </span>{' '}
              ฉบับ มาเพื่อประกอบพิจารณาด้วยแล้ว
            </div>
          </div>

          {/* Applicant Signature */}
          <div className="mt-8 mr-6 flex justify-end">
            <div className="text-center w-72 space-y-1">
              <div className="flex items-center justify-center space-x-1 min-h-[44px]">
                <span className="shrink-0">(ลงชื่อ)</span>
                <span className="dotted-fill min-w-[170px] text-center"></span>
                <span className="shrink-0 text-xs text-gray-700">ผู้ยื่นคำร้อง</span>
              </div>
              <div className="text-gray-700">
                ({isFilled ? `${applicant.prefix}${applicant.fullName}` : '...................................................'})
              </div>
            </div>
          </div>

          {/* Officer Preview on Page 1 */}
          <div className="mt-8 border-t border-gray-400 pt-4">
            <div className="font-semibold mb-2">เสนอ เจ้าพนักงานผู้ออกใบอนุญาต</div>
            <div className="indent-12 leading-relaxed">
              ข้าพเจ้าได้พิจารณาแล้วเห็นว่า{' '}
              <span className="dotted-fill min-w-[380px] text-center">
                {isFilled && review?.inspectionComment ? review.inspectionComment : ''}
              </span>
            </div>
            <div className="pl-6 pt-1">
              <div className="border-b border-dotted border-gray-500 min-h-[26px]"></div>
            </div>
            <div className="pl-6 pt-1">
              <div className="border-b border-dotted border-gray-500 min-h-[26px]"></div>
            </div>

            <div className="mt-4 mr-6 flex justify-end">
              <div className="text-center mt-6 space-y-1">
                <div>
                  (ลงชื่อ){' '}
                  <span className="dotted-fill min-w-[160px] text-center"></span>
                </div>
                <div>
                  ({isFilled && review?.inspectorName ? review.inspectorName : '...................................................'})
                </div>
                <div>
                  ตำแหน่ง{' '}
                  <span className="dotted-fill min-w-[160px] text-center">
                    {isFilled && review?.inspectorPosition ? review.inspectorPosition : ''}
                  </span>
                </div>
                <div>
                  วันที่{' '}
                  <span className="dotted-fill min-w-[35px] text-center">
                    {isFilled && inspDate.day ? toThaiDigits(inspDate.day) : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[45px] text-center">
                    {isFilled && inspDate.month ? inspDate.month : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[45px] text-center">
                    {isFilled && inspDate.yearBE ? toThaiDigits(inspDate.yearBE) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="min-h-[280mm] flex flex-col justify-between pt-6 print:pt-4">
        <div>
          {/* Top Page Number */}
          <div className="text-center font-sarabun text-[15px] mb-6">
            -๒-
          </div>

          {/* Two-Column Grid: Inspector Record vs Officer Order */}
          <div className="grid grid-cols-2 gap-8 border-b-2 border-gray-700 pb-8 min-h-[140mm]">
            
            {/* Left Column: บันทึกของเจ้าหน้าที่ตรวจสอบ */}
            <div className="flex flex-col justify-between pr-4 border-r border-gray-300">
              <div>
                <h3 className="text-center font-bold text-[16px] mb-3">
                  บันทึกของเจ้าหน้าที่ตรวจสอบ
                </h3>
                <div className="mb-2 font-medium">เสนอ เจ้าพนักงานผู้ออกใบอนุญาต</div>
                <div className="space-y-2 leading-relaxed text-justify text-[14px]">
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]">
                    {isFilled && review?.inspectionComment ? review.inspectionComment : ''}
                  </div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]">
                    {isFilled ? `ตรวจสอบระดับเสียง: ${review?.isNoiseCompliant ? 'ผ่านเกณฑ์มาตรฐาน' : 'รอการตรวจสอบ'}` : ''}
                  </div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]">
                    {isFilled ? `เส้นทาง/สถานที่: ${review?.isLocationCompliant ? 'เหมาะสม ไม่รบกวนชุมชน' : ''}` : ''}
                  </div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]"></div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]"></div>
                </div>
              </div>

              <div className="text-center mt-6 space-y-1">
                <div>
                  (ลงชื่อ){' '}
                  <span className="dotted-fill min-w-[130px] text-center"></span>
                </div>
                <div>
                  ({isFilled && review?.inspectorName ? review.inspectorName : '...........................................'})
                </div>
                <div>
                  วันที่{' '}
                  <span className="dotted-fill min-w-[30px] text-center">
                    {isFilled && inspDate.day ? toThaiDigits(inspDate.day) : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && inspDate.month ? inspDate.month : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && inspDate.yearBE ? toThaiDigits(inspDate.yearBE) : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: คำสั่งเจ้าพนักงานผู้ออกใบอนุญาต */}
            <div className="flex flex-col justify-between pl-4">
              <div>
                <h3 className="text-center font-bold text-[16px] mb-3">
                  คำสั่งเจ้าพนักงานผู้ออกใบอนุญาต
                </h3>
                <div className="space-y-2 leading-relaxed text-justify text-[14px]">
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]">
                    {isFilled && review?.officerOrderDetails ? review.officerOrderDetails : ''}
                  </div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]">
                    {isFilled && review?.officerOrder === 'APPROVED' ? 'อนุญาตตามคำขอ' : ''}
                  </div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]"></div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]"></div>
                  <div className="border-b border-dotted border-gray-500 min-h-[24px]"></div>
                </div>
              </div>

              <div className="text-center mt-6 space-y-1">
                <div>
                  (ลงชื่อ){' '}
                  <span className="dotted-fill min-w-[130px] text-center"></span>
                </div>
                <div>
                  ({isFilled && review?.approverName ? review.approverName : '...........................................'})
                </div>
                <div className="text-[13px] text-gray-700">
                  {isFilled && review?.approverPosition ? review.approverPosition : 'นายกเทศมนตรีตำบลพระซอง'}
                </div>
                <div>
                  วันที่{' '}
                  <span className="dotted-fill min-w-[30px] text-center">
                    {isFilled && appDate.day ? toThaiDigits(appDate.day) : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && appDate.month ? appDate.month : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && appDate.yearBE ? toThaiDigits(appDate.yearBE) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: สำหรับพนักงานเจ้าหน้าที่ */}
          <div className="pt-6 space-y-5">
            <div className="flex items-center justify-center space-x-2.5">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาลตำบลพระซอง"
                className="w-8 h-8 object-contain rounded-full border border-gray-300 p-0.5"
              />
              <h3 className="text-center font-bold text-[17px] underline decoration-double">
                สำหรับพนักงานเจ้าหน้าที่ {MUNICIPALITY_INFO.name}
              </h3>
            </div>

            <div className="indent-12 leading-loose text-justify text-[15px]">
              ได้ออกใบอนุญาตให้ทำการโฆษณาโดยใช้เครื่องขยายเสียงเลขที่{' '}
              <span className="dotted-fill min-w-[140px] text-center font-bold">
                {isFilled ? review?.permitNumber || '-' : ''}
              </span>{' '}
              และได้ค่าธรรมเนียม{' '}
              <span className="dotted-fill min-w-[80px] text-center font-bold text-blue-950">
                {isFilled ? toThaiDigits(application.fee.totalAmount) : ''}
              </span>{' '}
              บาท (
              <span className="dotted-fill min-w-[180px] text-center font-semibold">
                {isFilled ? application.fee.amountText : ''}
              </span>
              ) ตามใบอนุญาตเลขที่{' '}
              <span className="dotted-fill min-w-[130px] text-center">
                {isFilled ? review?.permitNumber || '-' : ''}
              </span>{' '}
              ไว้ถูกต้องแล้ว
            </div>

            {/* Officer Signatures: ผู้รับเงิน and เจ้าหน้าที่ */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              {/* Cashier */}
              <div className="text-center space-y-1">
                <div>
                  (ลงชื่อ){' '}
                  <span className="dotted-fill min-w-[150px] text-center"></span>
                </div>
                <div className="font-semibold text-gray-800">ผู้รับเงิน</div>
                <div>
                  วันที่{' '}
                  <span className="dotted-fill min-w-[30px] text-center">
                    {isFilled && payDate.day ? toThaiDigits(payDate.day) : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && payDate.month ? payDate.month : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && payDate.yearBE ? toThaiDigits(payDate.yearBE) : ''}
                  </span>
                </div>
              </div>

              {/* Officer */}
              <div className="text-center space-y-1">
                <div>
                  (ลงชื่อ){' '}
                  <span className="dotted-fill min-w-[150px] text-center"></span>
                </div>
                <div className="font-semibold text-gray-800">เจ้าหน้าที่</div>
                <div>
                  วันที่{' '}
                  <span className="dotted-fill min-w-[30px] text-center">
                    {isFilled && payDate.day ? toThaiDigits(payDate.day) : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && payDate.month ? payDate.month : ''}
                  </span>
                  /
                  <span className="dotted-fill min-w-[40px] text-center">
                    {isFilled && payDate.yearBE ? toThaiDigits(payDate.yearBE) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-gray-400 text-[11px] text-right pt-6 print:text-gray-600">
          ระบบบริการคำร้องขออนุญาตโฆษณาโดยใช้เครื่องขยายเสียง เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม
        </div>
      </div>

    </div>
  );
};
