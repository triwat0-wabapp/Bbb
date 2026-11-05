import React from 'react';
import { X, BookOpen, Volume2, Clock, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';
import { MUNICIPALITY_INFO } from '../utils/constants';

interface LawGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LawGuideModal: React.FC<LawGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-white border border-amber-400 shrink-0">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาลตำบลพระซอง"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">คู่มือข้อบังคับและกฎหมายการใช้เครื่องขยายเสียง</h2>
              <p className="text-xs text-blue-200">{MUNICIPALITY_INFO.name} อำเภอนาแก จังหวัดนครพนม</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          
          {/* Rate card summary */}
          <div className="border border-blue-200 bg-blue-50/70 rounded-xl p-4">
            <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              อัตราค่าธรรมเนียมใบอนุญาต (แบบ ฆ.ษ. ๑) {MUNICIPALITY_INFO.name}
            </h3>
            <p className="text-xs text-blue-800 mb-3">
              ตามมาตรา ๔ แห่ง พ.ร.บ.ฯ การอนุญาตให้มีกำหนด<strong>คราวละไม่เกิน ๑๕ วัน</strong> หากเกิน ๑๕ วัน ต้องคิดค่าธรรมเนียมเป็นคราวถัดไป
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-xs">
                <div className="font-bold text-slate-900 mb-1">๑) ไม่เป็นไปในทำนองการค้า</div>
                <div className="text-xl font-black text-emerald-600">๑๐ บาท</div>
                <div className="text-slate-500 mt-1">คราวละไม่เกิน ๑๕ วัน (งานบุญ, กุศล, ประเพณี)</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-xs">
                <div className="font-bold text-slate-900 mb-1">๒) การค้า (เคลื่อนที่)</div>
                <div className="text-xl font-black text-blue-600">๖๐ บาท</div>
                <div className="text-slate-500 mt-1">คราวละไม่เกิน ๑๕ วัน (รถแห่, รถกระบะ)</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-xs">
                <div className="font-bold text-slate-900 mb-1">๓) การค้า (ประจำที่)</div>
                <div className="text-xl font-black text-purple-600">๗๕ บาท</div>
                <div className="text-slate-500 mt-1">คราวละไม่เกิน ๑๕ วัน (หน้าร้าน, ซุ้มสินค้า)</div>
              </div>
            </div>
          </div>

          {/* Standards & Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2 font-bold text-slate-800 mb-2">
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span>ระดับเสียงสูงสุดที่อนุญาต</span>
              </div>
              <p className="text-xs text-slate-600">
                ระดับเสียงต้อง<strong>ไม่เกิน ๘๕ เดซิเบลเอ (dBA)</strong> เมื่อวัด ณ ระยะห่าง ๑๕ เมตรจากแหล่งกำเนิดเสียง และไม่ก่อให้เกิดเสียงรบกวนเกินเกณฑ์มาตรฐานสิ่งแวดล้อม
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2 font-bold text-slate-800 mb-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>ช่วงเวลาที่อนุญาตให้ใช้เสียง</span>
              </div>
              <p className="text-xs text-slate-600">
                อนุญาตให้ทำการโฆษณาได้ตั้งแต่เวลา <strong>๐๖.๐๐ น. ถึง ๒๐.๐๐ น.</strong> เท่านั้น (เว้นแต่งานประเพณีที่ได้รับอนุญาตเป็นกรณีพิเศษจากพนักงานเจ้าหน้าที่)
              </p>
            </div>
          </div>

          {/* Prohibitions */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 font-bold text-rose-900 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>ข้อห้ามตามกฎหมาย (มาตรา ๖, ๗, ๘)</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-xs text-rose-900">
              <li>ห้ามใช้ถ้อยคำหยาบคาย ลามก อนาจาร หรือพาดพิงใส่ร้ายผู้อื่น</li>
              <li>ห้ามโฆษณาเรื่องที่ขัดต่อความสงบเรียบร้อยและศีลธรรมอันดีของประชาชน</li>
              <li>ห้ามใช้เสียงในระยะใกล้โรงพยาบาล สถานีอนามัย โรงเรียน (ระหว่างเวลาเรียน) และวัด/ศาสนสถานขณะมีพิธีกรรมทางศาสนา</li>
              <li>ห้ามดัดแปลงแก้ไขเครื่องขยายเสียงหรือเพิ่มกำลังขับเกินกว่าที่ได้รับอนุญาต</li>
            </ul>
          </div>

          {/* Documents checklist */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 font-bold text-slate-800 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>เอกสารหลักฐานที่ต้องใช้ยื่นคำร้อง</span>
            </div>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
              <li>สำเนาบัตรประจำตัวประชาชนของผู้ขออนุญาต / กรรมการผู้มีอำนาจ (กรณีบริษัท)</li>
              <li>สำเนาทะเบียนบ้านของผู้ขออนุญาต</li>
              <li>สำเนาใบคู่มือจดทะเบียนรถ หรือภาพถ่ายยานพาหนะติดเครื่องเสียง (กรณีโฆษณาเคลื่อนที่)</li>
              <li>สำเนาใบอนุญาตให้มีและใช้เครื่องขยายเสียงฯ (ถ้ามี)</li>
              <li>ข้อความ / สปอตเสียง / ถ้อยคำที่จะใช้โฆษณา</li>
            </ol>
          </div>

          {/* Penalty */}
          <div className="text-xs text-slate-500 border-t border-slate-200 pt-3">
            <strong>บทกำหนดโทษ:</strong> ผู้ใดฝ่าฝืนใช้เครื่องขยายเสียงโดยไม่ได้รับอนุญาต หรือไม่ปฏิบัติตามเงื่อนไขในใบอนุญาต มีความผิดตาม พ.ร.บ. ควบคุมการโฆษณาโดยใช้เครื่องขยายเสียง พ.ศ. ๒๔๙๓ ระวางโทษปรับไม่เกิน ๒๐๐ บาท และพนักงานเจ้าหน้าที่มีอำนาจสั่งให้หยุดใช้หรือยึดเครื่องขยายเสียงได้ทันที
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 flex justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            เข้าใจแล้ว
          </button>
        </div>

      </div>
    </div>
  );
};
