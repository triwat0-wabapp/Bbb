import React, { useState } from 'react';
import { FeeCategory } from '../types';
import { calculateDaysBetween, calculatePeriods, getFeeRate, thaiBahtText } from '../utils/thaiDate';
import { MUNICIPALITY_INFO } from '../utils/constants';
import { Calculator, X, Calendar, CheckCircle2 } from 'lucide-react';

interface FeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (category: FeeCategory, days: number, startDate?: string, endDate?: string) => void;
}

export const FeeCalculatorModal: React.FC<FeeCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [category, setCategory] = useState<FeeCategory>('COMMERCIAL_MOBILE');
  const [calcMode, setCalcMode] = useState<'days' | 'dates'>('days');
  const [daysCount, setDaysCount] = useState<number>(5);
  
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);

  if (!isOpen) return null;

  const totalDays = calcMode === 'days' 
    ? Math.max(1, daysCount)
    : Math.max(1, calculateDaysBetween(startDate, endDate));

  const periods = calculatePeriods(totalDays);
  const ratePerPeriod = getFeeRate(category);
  const totalAmount = periods * ratePerPeriod;
  const amountText = thaiBahtText(totalAmount);

  const handleApply = () => {
    if (onApply) {
      if (calcMode === 'dates') {
        onApply(category, totalDays, startDate, endDate);
      } else {
        onApply(category, totalDays);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full overflow-hidden p-0.5 bg-white border border-amber-400 shrink-0">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาล"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">เครื่องคำนวณค่าธรรมเนียมใบอนุญาต</h2>
              <p className="text-xs text-emerald-200">{MUNICIPALITY_INFO.name} อำเภอนาแก (คราวละไม่เกิน ๑๕ วัน)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              เลือกประเภทการโฆษณา
            </label>
            <div className="space-y-2">
              <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                category === 'NON_COMMERCIAL' ? 'border-emerald-600 bg-emerald-50/70' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="calc_cat"
                  value="NON_COMMERCIAL"
                  checked={category === 'NON_COMMERCIAL'}
                  onChange={() => setCategory('NON_COMMERCIAL')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">๑) โฆษณาที่ไม่เป็นไปในทำนองการค้า</span>
                    <span className="font-extrabold text-emerald-700 text-sm">๑๐ บ. / คราว</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">งานบุญ, ประเพณี, งานวัด, กิจกรรมสาธารณประโยชน์, ราชการ</p>
                </div>
              </label>

              <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                category === 'COMMERCIAL_MOBILE' ? 'border-emerald-600 bg-emerald-50/70' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="calc_cat"
                  value="COMMERCIAL_MOBILE"
                  checked={category === 'COMMERCIAL_MOBILE'}
                  onChange={() => setCategory('COMMERCIAL_MOBILE')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">๒) โฆษณาที่เป็นไปในทำนองการค้า (เคลื่อนที่)</span>
                    <span className="font-extrabold text-emerald-700 text-sm">๖๐ บ. / คราว</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">รถแห่, รถกระบะติดเครื่องเสียงวิ่งประชาสัมพันธ์สินค้า/บริการ</p>
                </div>
              </label>

              <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${
                category === 'COMMERCIAL_STATIONARY' ? 'border-emerald-600 bg-emerald-50/70' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <input
                  type="radio"
                  name="calc_cat"
                  value="COMMERCIAL_STATIONARY"
                  checked={category === 'COMMERCIAL_STATIONARY'}
                  onChange={() => setCategory('COMMERCIAL_STATIONARY')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">๓) โฆษณาที่เป็นไปในทำนองการค้า (ประจำที่)</span>
                    <span className="font-extrabold text-emerald-700 text-sm">๗๕ บ. / คราว</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">หน้าร้านค้า, ซุ้มสินค้า, เวทีจัดงานแสดงสินค้าประจำจุด</p>
                </div>
              </label>
            </div>
          </div>

          {/* Days / Dates Mode */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600">วิธีกำหนดระยะเวลา:</span>
              <div className="flex space-x-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCalcMode('days')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    calcMode === 'days' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  ระบุจำนวนวัน
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('dates')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    calcMode === 'dates' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  ระบุวันที่เริ่มต้น-สิ้นสุด
                </button>
              </div>
            </div>

            {calcMode === 'days' ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={daysCount}
                    onChange={(e) => setDaysCount(parseInt(e.target.value, 10))}
                    className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={daysCount}
                    onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value || '1', 10)))}
                    className="w-20 p-2 border border-slate-300 rounded-lg text-center font-bold text-slate-800"
                  />
                  <span className="text-sm font-medium text-slate-700">วัน</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 px-1">
                  <span>1 วัน (1 คราว)</span>
                  <span>15 วัน (1 คราว)</span>
                  <span>30 วัน (2 คราว)</span>
                  <span>45 วัน (3 คราว)</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">วันที่เริ่ม</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Box */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-4">
            <div className="text-xs text-emerald-800 font-semibold mb-2">สรุปการคำนวณตาม พ.ร.บ.ฯ:</div>
            <div className="grid grid-cols-3 gap-2 text-center border-b border-emerald-200 pb-3 mb-3">
              <div>
                <div className="text-xs text-slate-500">จำนวนวันทั้งหมด</div>
                <div className="text-lg font-bold text-slate-800">{totalDays} วัน</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">จำนวนคราว (ไม่เกิน 15 วัน/คราว)</div>
                <div className="text-lg font-bold text-emerald-700">{periods} คราว</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">อัตราต่อคราว</div>
                <div className="text-lg font-bold text-slate-800">{ratePerPeriod} บ.</div>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-semibold text-slate-700">ค่าธรรมเนียมรวมทั้งสิ้น:</span>
              <div className="text-right">
                <span className="text-3xl font-black text-emerald-800">{totalAmount}</span>
                <span className="text-sm font-bold text-emerald-800 ml-1.5">บาท</span>
              </div>
            </div>
            <div className="text-right text-xs font-semibold text-emerald-700 mt-1">
              ({amountText})
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-100 p-4 px-6 flex justify-end space-x-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-200 text-sm font-medium transition-colors"
          >
            ปิด
          </button>
          {onApply && (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>นำไปใช้ในฟอร์ม</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
