import React, { useState } from 'react';
import { SoundPermitApplication, FeeCategory, ApplicantInfo, EquipmentInfo, AdvertisementDetails, OfficerReviewRecord } from '../types';
import { MUNICIPALITY_INFO, PHRASONG_VILLAGES } from '../utils/constants';
import { calculateDaysBetween, calculatePeriods, getFeeRate, thaiBahtText } from '../utils/thaiDate';
import { generateNextPermitNumber } from '../utils/storage';
import { 
  X, 
  Save, 
  Trash2, 
  User, 
  Speaker, 
  FileText, 
  Shield, 
  Award, 
  Receipt, 
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { SignaturePad } from './SignaturePad';

interface EditApplicationModalProps {
  application: SoundPermitApplication;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedApp: SoundPermitApplication) => void;
  onDelete: (id: string) => void;
}

export const EditApplicationModal: React.FC<EditApplicationModalProps> = ({
  application,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'applicant' | 'equipment' | 'ad' | 'review'>('applicant');
  
  // Cloned application state for editing
  const [app, setApp] = useState<SoundPermitApplication>(() => JSON.parse(JSON.stringify(application)));
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  // Handle date & fee updates
  const handleDateOrCategoryChange = (
    newCategory: FeeCategory,
    newStartDate: string,
    newEndDate: string
  ) => {
    const days = Math.max(1, calculateDaysBetween(newStartDate, newEndDate));
    const periods = calculatePeriods(days);
    const rate = getFeeRate(newCategory);
    const total = periods * rate;
    const text = thaiBahtText(total);

    setApp((prev) => ({
      ...prev,
      adDetails: {
        ...prev.adDetails,
        category: newCategory,
        startDate: newStartDate,
        endDate: newEndDate,
        totalDays: days,
        periodsCount: periods,
      },
      fee: {
        ratePerPeriod: rate,
        periods,
        totalAmount: total,
        amountText: text,
      },
    }));
  };

  const handleAutoPermitNumber = () => {
    const nextP = generateNextPermitNumber();
    const today = new Date().toISOString().split('T')[0];
    setApp((prev) => ({
      ...prev,
      status: 'PERMIT_ISSUED',
      officerReview: {
        ...prev.officerReview,
        permitNumber: nextP.permitNumber,
        permitBookNumber: nextP.bookNumber,
        receiptNumber: prev.officerReview?.receiptNumber || `บส-${nextP.permitNumber.replace('ฆ.ษ. ', '')}`,
        paymentDate: prev.officerReview?.paymentDate || today,
        approverName: prev.officerReview?.approverName || MUNICIPALITY_INFO.approverNameDefault,
        approverPosition: prev.officerReview?.approverPosition || MUNICIPALITY_INFO.approverTitleDefault,
        approverDate: prev.officerReview?.approverDate || today,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(app);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-0.5 border border-amber-400">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาล"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-prompt">
                  แก้ไขข้อมูลคำร้องขออนุญาต
                </h2>
                <span className="text-xs font-mono font-bold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">
                  {app.referenceNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                ผู้ยื่น: {app.applicant.prefix}{app.applicant.fullName} | เทศบาลตำบลพระซอง
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('applicant')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'applicant'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>๑. ผู้ยื่นคำร้อง</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('equipment')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'equipment'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Speaker className="w-3.5 h-3.5" />
            <span>๒. เครื่องเสียง & ยานพาหนะ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ad')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'ad'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>๓. การโฆษณา & ค่าธรรมเนียม</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('review')}
            className={`px-3 py-2 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'review'
                ? 'border-blue-600 text-blue-700 font-bold bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>๔. บันทึกเจ้าหน้าที่ & คำสั่งนายก</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-slate-700">
          
          {/* TAB 1: APPLICANT */}
          {activeTab === 'applicant' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">คำนำหน้า</label>
                  <select
                    value={app.applicant.prefix}
                    onChange={(e) => setApp({
                      ...app,
                      applicant: { ...app.applicant, prefix: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="ห้างหุ้นส่วนจำกัด">ห้างหุ้นส่วนจำกัด</option>
                    <option value="บริษัท">บริษัท</option>
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-slate-600 font-medium mb-1">ชื่อ - สกุล / นิติบุคคล</label>
                  <input
                    type="text"
                    value={app.applicant.fullName}
                    onChange={(e) => setApp({
                      ...app,
                      applicant: { ...app.applicant, fullName: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">อายุ (ปี)</label>
                  <input
                    type="number"
                    value={app.applicant.age}
                    onChange={(e) => setApp({
                      ...app,
                      applicant: { ...app.applicant, age: parseInt(e.target.value || '0', 10) }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-slate-600 font-medium mb-1">เลขประจำตัวประชาชน (๑๓ หลัก)</label>
                  <input
                    type="text"
                    maxLength={13}
                    value={app.applicant.idCardNumber}
                    onChange={(e) => setApp({
                      ...app,
                      applicant: { ...app.applicant, idCardNumber: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-slate-600 font-medium mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={app.applicant.phone}
                    onChange={(e) => setApp({
                      ...app,
                      applicant: { ...app.applicant, phone: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">สัญชาติ</label>
                  <input
                    type="text"
                    value={app.applicant.nationality}
                    onChange={(e) => setApp({
                      ...app,
                      applicant: { ...app.applicant, nationality: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-slate-600 font-medium mb-1">เชื้อชาติ</label>
                  <input
                    type="text"
                    value={app.applicant.race}
                    onChange={(e) => setApp({
                      ...app,
                      applicant: { ...app.applicant, race: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="pt-3 border-t border-slate-200">
                <div className="font-bold text-slate-800 mb-2">ที่อยู่ตามทะเบียนบ้าน</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">บ้านเลขที่</label>
                    <input
                      type="text"
                      value={app.applicant.houseNumber}
                      onChange={(e) => setApp({
                        ...app,
                        applicant: { ...app.applicant, houseNumber: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">หมู่ที่ (หมู่ 1 - 16)</label>
                    <select
                      value={app.applicant.villageNo}
                      onChange={(e) => setApp({
                        ...app,
                        applicant: { ...app.applicant, villageNo: e.target.value, villageName: '' }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    >
                      {PHRASONG_VILLAGES.map((v) => (
                        <option key={v.no} value={v.no}>
                          หมู่ {v.no}
                        </option>
                      ))}
                      <option value="ระบุเอง">ระบุหมู่ที่อื่น</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">ถนน / ซอย</label>
                    <input
                      type="text"
                      value={app.applicant.road}
                      onChange={(e) => setApp({
                        ...app,
                        applicant: { ...app.applicant, road: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">ตำบล</label>
                    <input
                      type="text"
                      value={app.applicant.subdistrict}
                      onChange={(e) => setApp({
                        ...app,
                        applicant: { ...app.applicant, subdistrict: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">อำเภอ</label>
                    <input
                      type="text"
                      value={app.applicant.district}
                      onChange={(e) => setApp({
                        ...app,
                        applicant: { ...app.applicant, district: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">จังหวัด</label>
                    <input
                      type="text"
                      value={app.applicant.province}
                      onChange={(e) => setApp({
                        ...app,
                        applicant: { ...app.applicant, province: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">รหัสไปรษณีย์</label>
                    <input
                      type="text"
                      value={app.applicant.postalCode}
                      onChange={(e) => setApp({
                        ...app,
                        applicant: { ...app.applicant, postalCode: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Signature Pad */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="font-semibold text-slate-700">ลายมือชื่อผู้ยื่นคำร้อง (เซ็นต์ลายมือชื่อ)</div>
                  <SignaturePad
                    value={app.applicantSignatureImage}
                    onChange={(dataUrl) => setApp({
                      ...app,
                      applicantSignatureImage: dataUrl,
                      applicantSignature: app.applicantSignature || `${app.applicant.prefix}${app.applicant.fullName}`.trim()
                    })}
                    applicantName={`${app.applicant.prefix}${app.applicant.fullName}`.trim()}
                  />
                  <div>
                    <label className="block text-slate-600 mb-1">ชื่อ-สกุล ตัวบรรจง (กำกับใต้ลายมือชื่อ)</label>
                    <input
                      type="text"
                      value={app.applicantSignature || ''}
                      onChange={(e) => setApp({ ...app, applicantSignature: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-serif"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EQUIPMENT */}
          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    เลขหมายทะเบียนเครื่องขยายเสียง
                  </label>
                  <input
                    type="text"
                    value={app.equipment.amplifierSerial}
                    onChange={(e) => setApp({
                      ...app,
                      equipment: { ...app.equipment, amplifierSerial: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    เลขหมายทะเบียนไมโครโฟน
                  </label>
                  <input
                    type="text"
                    value={app.equipment.microphoneSerial}
                    onChange={(e) => setApp({
                      ...app,
                      equipment: { ...app.equipment, microphoneSerial: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    เลขหมายทะเบียนเครื่องบันทึกเสียง
                  </label>
                  <input
                    type="text"
                    value={app.equipment.soundRecorderSerial}
                    onChange={(e) => setApp({
                      ...app,
                      equipment: { ...app.equipment, soundRecorderSerial: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    ทะเบียนรถ (กรณีรถแห่/เคลื่อนที่)
                  </label>
                  <input
                    type="text"
                    value={app.equipment.vehicleRegistration || ''}
                    onChange={(e) => setApp({
                      ...app,
                      equipment: { ...app.equipment, vehicleRegistration: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    placeholder="เช่น บค-5432 นครพนม"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    ยี่ห้อ / รุ่นเครื่องเสียง
                  </label>
                  <input
                    type="text"
                    value={app.equipment.equipmentBrand || ''}
                    onChange={(e) => setApp({
                      ...app,
                      equipment: { ...app.equipment, equipmentBrand: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    ระดับเสียง (เดซิเบล ไม่เกิน 85)
                  </label>
                  <input
                    type="number"
                    value={app.equipment.decibelRating || 80}
                    onChange={(e) => setApp({
                      ...app,
                      equipment: { ...app.equipment, decibelRating: parseInt(e.target.value || '80', 10) }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADVERTISING & FEE */}
          {activeTab === 'ad' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ประเภทการโฆษณา</label>
                <select
                  value={app.adDetails.category}
                  onChange={(e) => handleDateOrCategoryChange(
                    e.target.value as FeeCategory,
                    app.adDetails.startDate,
                    app.adDetails.endDate
                  )}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="NON_COMMERCIAL">๑) ไม่เป็นไปในทำนองการค้า (10 บาท / คราว)</option>
                  <option value="COMMERCIAL_MOBILE">๒) การค้า - โฆษณาเคลื่อนที่ / รถแห่ (60 บาท / คราว)</option>
                  <option value="COMMERCIAL_STATIONARY">๓) การค้า - โฆษณาประจำที่ (75 บาท / คราว)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">วัตถุประสงค์ / กิจการที่โฆษณา</label>
                <textarea
                  rows={2}
                  value={app.adDetails.purpose}
                  onChange={(e) => setApp({
                    ...app,
                    adDetails: { ...app.adDetails, purpose: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">ข้อความ / สปอตเสียงโฆษณา</label>
                <textarea
                  rows={2}
                  value={app.adDetails.advertisingScript}
                  onChange={(e) => setApp({
                    ...app,
                    adDetails: { ...app.adDetails, advertisingScript: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">สถานที่ / เส้นทาง</label>
                  <input
                    type="text"
                    value={app.adDetails.locationDescription}
                    onChange={(e) => setApp({
                      ...app,
                      adDetails: { ...app.adDetails, locationDescription: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">หมู่ที่ (สถานที่โฆษณา)</label>
                  <input
                    type="text"
                    value={app.adDetails.locationVillageNo}
                    onChange={(e) => setApp({
                      ...app,
                      adDetails: { ...app.adDetails, locationVillageNo: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Dates & Auto Fee Calculation */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800">ระยะเวลาและค่าธรรมเนียม (คำนวณอัตโนมัติ)</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">วันที่เริ่มต้น</label>
                    <input
                      type="date"
                      value={app.adDetails.startDate}
                      onChange={(e) => handleDateOrCategoryChange(
                        app.adDetails.category,
                        e.target.value,
                        app.adDetails.endDate
                      )}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">วันที่สิ้นสุด</label>
                    <input
                      type="date"
                      min={app.adDetails.startDate}
                      value={app.adDetails.endDate}
                      onChange={(e) => handleDateOrCategoryChange(
                        app.adDetails.category,
                        app.adDetails.startDate,
                        e.target.value
                      )}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">เวลาเริ่มใช้เสียง</label>
                    <input
                      type="time"
                      value={app.adDetails.dailyStartTime || '09:00'}
                      onChange={(e) => setApp({
                        ...app,
                        adDetails: { ...app.adDetails, dailyStartTime: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">เวลาสิ้นสุดใช้เสียง</label>
                    <input
                      type="time"
                      value={app.adDetails.dailyEndTime || '17:00'}
                      onChange={(e) => setApp({
                        ...app,
                        adDetails: { ...app.adDetails, dailyEndTime: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-300 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">
                      รวม {app.adDetails.totalDays} วัน = {app.adDetails.periodsCount} คราว (อัตรา {app.fee.ratePerPeriod} บ./คราว)
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      ตัวอักษร: {app.fee.amountText}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-700">{app.fee.totalAmount}</span>
                    <span className="text-xs font-bold text-emerald-800 ml-1">บาท</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEW & MAYOR ORDER */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              
              {/* Status */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">สถานะคำร้อง</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['PENDING', 'UNDER_REVIEW', 'APPROVED', 'PERMIT_ISSUED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setApp({ ...app, status: st })}
                      className={`p-2 rounded-lg font-bold border text-center transition-all ${
                        app.status === st
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'PENDING' && 'รอตรวจสอบ'}
                      {st === 'UNDER_REVIEW' && 'กำลังตรวจ'}
                      {st === 'APPROVED' && 'อนุมัติแล้ว'}
                      {st === 'PERMIT_ISSUED' && 'ออกใบอนุญาตแล้ว'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mayor Approver default info */}
              <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-700" />
                    <span>คำสั่งเจ้าพนักงานผู้ออกใบอนุญาต (นายกเทศมนตรีตำบลพระซอง)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoPermitNumber}
                    className="px-2.5 py-1 bg-indigo-700 text-white rounded text-[11px] font-bold hover:bg-indigo-800"
                  >
                    ออกเลขที่ใบอนุญาตอัตโนมัติ
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">ผู้ออกใบอนุญาต</label>
                    <input
                      type="text"
                      value={app.officerReview?.approverName || MUNICIPALITY_INFO.approverNameDefault}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, approverName: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-indigo-950"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">ตำแหน่ง</label>
                    <input
                      type="text"
                      value={app.officerReview?.approverPosition || MUNICIPALITY_INFO.approverTitleDefault}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, approverPosition: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">วันที่มีคำสั่ง</label>
                    <input
                      type="date"
                      value={app.officerReview?.approverDate || ''}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, approverDate: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">รายละเอียดคำสั่ง / เงื่อนไข</label>
                  <textarea
                    rows={2}
                    value={app.officerReview?.officerOrderDetails || ''}
                    onChange={(e) => setApp({
                      ...app,
                      officerReview: { ...app.officerReview, officerOrderDetails: e.target.value }
                    })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    placeholder="เช่น อนุญาตตามคำขอ โดยให้ควบคุมระดับเสียงไม่เกิน 85 เดซิเบลเอ"
                  />
                </div>
              </div>

              {/* Inspector comment */}
              <div className="border border-slate-200 p-3 rounded-xl space-y-2">
                <div className="font-bold text-slate-800">บันทึกของเจ้าหน้าที่ตรวจสอบ</div>
                <textarea
                  rows={2}
                  value={app.officerReview?.inspectionComment || ''}
                  onChange={(e) => setApp({
                    ...app,
                    officerReview: { ...app.officerReview, inspectionComment: e.target.value }
                  })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  placeholder="ความเห็นการตรวจสภาพเครื่องเสียงและเส้นทาง"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">ชื่อผู้ตรวจ</label>
                    <input
                      type="text"
                      value={app.officerReview?.inspectorName || ''}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, inspectorName: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">ตำแหน่งผู้ตรวจ</label>
                    <input
                      type="text"
                      value={app.officerReview?.inspectorPosition || ''}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, inspectorPosition: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Permit & Receipt Numbers */}
              <div className="border border-emerald-200 bg-emerald-50/50 p-3.5 rounded-xl space-y-2">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-700" />
                  <span>เลขที่ใบอนุญาต & ใบเสร็จรับเงิน</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">เลขที่ใบอนุญาต</label>
                    <input
                      type="text"
                      value={app.officerReview?.permitNumber || ''}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, permitNumber: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-900"
                      placeholder="เช่น ฆ.ษ. ๐๑/๒๕๖๙"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">เล่มที่</label>
                    <input
                      type="text"
                      value={app.officerReview?.permitBookNumber || '๑'}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, permitBookNumber: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">เลขที่ใบเสร็จรับเงิน</label>
                    <input
                      type="text"
                      value={app.officerReview?.receiptNumber || ''}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, receiptNumber: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      placeholder="เช่น บส-๐๑/๒๕๖๙"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">ผู้รับเงิน</label>
                    <input
                      type="text"
                      value={app.officerReview?.cashierName || ''}
                      onChange={(e) => setApp({
                        ...app,
                        officerReview: { ...app.officerReview, cashierName: e.target.value }
                      })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Delete Confirmation Box */}
          {confirmDelete && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center space-x-2 text-rose-800 font-bold">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>ยืนยันการลบคำร้องนี้หรือไม่?</span>
              </div>
              <p className="text-slate-600 text-xs">
                คำร้องเลขที่ {app.referenceNumber} ({app.applicant.fullName}) จะถูกลบออกจากระบบอย่างถาวร
              </p>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(app.id)}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                >
                  ลบคำร้องทันที
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            {!confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>ลบคำร้อง</span>
              </button>
            )}

            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกการแก้ไข</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
