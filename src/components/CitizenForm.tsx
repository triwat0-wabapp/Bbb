import React, { useState } from 'react';
import { SoundPermitApplication, FeeCategory, ApplicantInfo, EquipmentInfo, AdvertisementDetails } from '../types';
import { MUNICIPALITY_INFO, PHRASONG_VILLAGES, FEE_RATES } from '../utils/constants';
import { calculateDaysBetween, calculatePeriods, getFeeRate, thaiBahtText } from '../utils/thaiDate';
import { generateNextReferenceNumber, saveApplication } from '../utils/storage';
import { 
  FileText, 
  User, 
  Speaker, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Sparkles, 
  Calculator, 
  HelpCircle,
  Truck,
  Building,
  HeartHandshake,
  Paperclip,
  Printer
} from 'lucide-react';
import { SignaturePad } from './SignaturePad';

interface CitizenFormProps {
  onSuccess: (savedApp: SoundPermitApplication) => void;
  onOpenCalculator: () => void;
  onOpenGuide: () => void;
  initialData?: SoundPermitApplication | null;
}

export const CitizenForm: React.FC<CitizenFormProps> = ({
  onSuccess,
  onOpenCalculator,
  onOpenGuide,
  initialData,
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Applicant Info State
  const [applicant, setApplicant] = useState<ApplicantInfo>(initialData?.applicant || {
    prefix: 'นาย',
    fullName: '',
    age: 35,
    nationality: 'ไทย',
    race: 'ไทย',
    idCardNumber: '',
    phone: '',
    houseNumber: '',
    villageNo: '1',
    road: '',
    subdistrict: 'พระซอง',
    district: 'นาแก',
    province: 'นครพนม',
    postalCode: '48130',
  });

  // Equipment Info State
  const [equipment, setEquipment] = useState<EquipmentInfo>(initialData?.equipment || {
    amplifierSerial: 'AMP-' + Math.floor(1000 + Math.random() * 9000),
    microphoneSerial: 'MIC-' + Math.floor(100 + Math.random() * 900),
    soundRecorderSerial: 'REC-' + Math.floor(100 + Math.random() * 900),
    vehicleRegistration: '',
    equipmentBrand: 'TOA Power Amplifier',
    decibelRating: 80,
  });

  // Advertisement State
  const [category, setCategory] = useState<FeeCategory>(initialData?.adDetails.category || 'COMMERCIAL_MOBILE');
  const [purpose, setPurpose] = useState<string>(initialData?.adDetails.purpose || '');
  const [advertisingScript, setAdvertisingScript] = useState<string>(initialData?.adDetails.advertisingScript || '');
  const [soundType, setSoundType] = useState<'RECORDED' | 'LIVE_VOICE' | 'BOTH'>(initialData?.adDetails.soundType || 'RECORDED');
  
  const [locationDescription, setLocationDescription] = useState<string>(initialData?.adDetails.locationDescription || '');
  const [locationHouseNo, setLocationHouseNo] = useState<string>(initialData?.adDetails.locationHouseNo || '-');
  const [locationVillageNo, setLocationVillageNo] = useState<string>(initialData?.adDetails.locationVillageNo || '1-16');
  const [locationRoad, setLocationRoad] = useState<string>(initialData?.adDetails.locationRoad || 'ถนนสายหลักในตำบลพระซอง');
  
  const [startDate, setStartDate] = useState<string>(initialData?.adDetails.startDate || today);
  const [endDate, setEndDate] = useState<string>(initialData?.adDetails.endDate || today);
  const [dailyStartTime, setDailyStartTime] = useState<string>(initialData?.adDetails.dailyStartTime || '09:00');
  const [dailyEndTime, setDailyEndTime] = useState<string>(initialData?.adDetails.dailyEndTime || '17:00');
  const [attachedCount, setAttachedCount] = useState<number>(initialData?.adDetails.attachedPermitCopiesCount || 1);

  const [signature, setSignature] = useState<string>(initialData?.applicantSignature || '');
  const [signatureImage, setSignatureImage] = useState<string>(initialData?.applicantSignatureImage || '');
  const [agreeRules, setAgreeRules] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  // Fee calculation
  const totalDays = Math.max(1, calculateDaysBetween(startDate, endDate));
  const periods = calculatePeriods(totalDays);
  const ratePerPeriod = getFeeRate(category);
  const totalAmount = periods * ratePerPeriod;
  const amountText = thaiBahtText(totalAmount);

  // Quick Demo Fill handlers
  const handleLoadDemo = (type: 1 | 2 | 3) => {
    if (type === 1) {
      // Non-commercial merit
      setCategory('NON_COMMERCIAL');
      setApplicant({
        prefix: 'นาย',
        fullName: 'วิชัย มงคลธรรม',
        age: 52,
        nationality: 'ไทย',
        race: 'ไทย',
        idCardNumber: '3480500876543',
        phone: '081-999-8877',
        houseNumber: '15/2',
        villageNo: '5',
        road: 'สายวัฒนธรรม',
        subdistrict: 'พระซอง',
        district: 'นาแก',
        province: 'นครพนม',
        postalCode: '48130',
      });
      setEquipment({
        amplifierSerial: 'AMP-COMM-104',
        microphoneSerial: 'MIC-WIRELESS-02',
        soundRecorderSerial: 'REC-FLASH-88',
        vehicleRegistration: '',
        equipmentBrand: 'NPE 300W',
        decibelRating: 75,
      });
      setPurpose('ประชาสัมพันธ์บอกบุญงานทอดผ้าป่าสามัคคีสร้างอุโบสถ วัดดอนหนองโจน');
      setAdvertisingScript('ขอเชิญชวนสาธุชนร่วมทำบุญทอดผ้าป่าสามัคคี สมทบทุนสร้างอุโบสถ ณ วัดดอนหนองโจน ต.พระซอง วันเสาร์นี้');
      setLocationDescription('หอกระจายข่าวประจำหมู่บ้านและบริเวณวัดดอนหนองโจน');
      setLocationHouseNo('วัดดอนหนองโจน');
      setLocationVillageNo('5');
      setLocationRoad('สายวัฒนธรรม');
      setStartDate(today);
      setEndDate(today);
      setDailyStartTime('07:00');
      setDailyEndTime('18:00');
      setSignature('วิชัย มงคลธรรม');
    } else if (type === 2) {
      // Commercial mobile (Sound truck)
      setCategory('COMMERCIAL_MOBILE');
      setApplicant({
        prefix: 'นาย',
        fullName: 'สมพงษ์ แก้วมณี',
        age: 41,
        nationality: 'ไทย',
        race: 'ไทย',
        idCardNumber: '3480500112233',
        phone: '087-654-3210',
        houseNumber: '99',
        villageNo: '2',
        road: 'นาแก-พระซอง',
        subdistrict: 'พระซอง',
        district: 'นาแก',
        province: 'นครพนม',
        postalCode: '48130',
      });
      setEquipment({
        amplifierSerial: 'AMP-TRUCK-559',
        microphoneSerial: 'MIC-DYNAMIC-01',
        soundRecorderSerial: 'REC-BT-90',
        vehicleRegistration: 'บม-2244 นครพนม (รถกระบะแห่)',
        equipmentBrand: 'Bosch Power Amp 600W',
        decibelRating: 82,
      });
      setPurpose('โฆษณาเคลื่อนที่โปรโมชั่นลดราคาปุ๋ยอินทรีย์ เมล็ดพันธุ์ข้าว และอาหารสัตว์');
      setAdvertisingScript('ประกาศพิเศษสำหรับพี่น้องเกษตรกรตำบลพระซอง ปุ๋ยอินทรีย์คุณภาพสูงลดราคาพิเศษต้อนรับฤดูทำนา ส่งฟรีถึงหน้าบ้าน');
      setLocationDescription('ถนนสายหลักและซอยในเขตเทศบาลตำบลพระซอง หมู่ 1 - 16');
      setLocationHouseNo('-');
      setLocationVillageNo('1-16');
      setLocationRoad('ถนนสายหลักเทศบาล');
      // Set for 4 days
      setStartDate(today);
      const endD = new Date();
      endD.setDate(endD.getDate() + 3);
      setEndDate(endD.toISOString().split('T')[0]);
      setDailyStartTime('09:00');
      setDailyEndTime('17:00');
      setSignature('สมพงษ์ แก้วมณี');
    } else {
      // Commercial stationary (Shop promo for 20 days -> 2 periods = 150 THB)
      setCategory('COMMERCIAL_STATIONARY');
      setApplicant({
        prefix: 'นาง',
        fullName: 'พรทิพย์ สุขเกษม',
        age: 39,
        nationality: 'ไทย',
        race: 'ไทย',
        idCardNumber: '3480500334455',
        phone: '086-112-2334',
        houseNumber: '128/4',
        villageNo: '1',
        road: 'เทศบาลพัฒนา',
        subdistrict: 'พระซอง',
        district: 'นาแก',
        province: 'นครพนม',
        postalCode: '48130',
      });
      setEquipment({
        amplifierSerial: 'AMP-SHOP-77',
        microphoneSerial: 'MIC-HEADSET-01',
        soundRecorderSerial: 'REC-PHONE-01',
        vehicleRegistration: '',
        equipmentBrand: 'Yamaha 400W',
        decibelRating: 79,
      });
      setPurpose('โฆษณาประชาสัมพันธ์งานจัดจำหน่ายสินค้าและตลาดนัดชุมชนหน้าร้านพรทิพย์การค้า');
      setAdvertisingScript('ขอเชิญเที่ยวชมและเลือกซื้อสินค้าราคาประหยัด อาหาร เครื่องดื่ม ของใช้ในครัวเรือน ลดกระหน่ำตลอด 20 วัน');
      setLocationDescription('ลานกิจกรรมหน้าร้านพรทิพย์การค้า ตลาดสดตำบลพระซอง');
      setLocationHouseNo('128/4');
      setLocationVillageNo('1');
      setLocationRoad('เทศบาลพัฒนา');
      setStartDate(today);
      const endD = new Date();
      endD.setDate(endD.getDate() + 19); // 20 days
      setEndDate(endD.toISOString().split('T')[0]);
      setDailyStartTime('10:00');
      setDailyEndTime('19:00');
      setSignature('พรทิพย์ สุขเกษม');
    }
    setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!applicant.fullName.trim()) {
      setValidationError('กรุณาระบุชื่อ-นามสกุลของผู้ยื่นคำร้อง');
      return;
    }
    if (!applicant.houseNumber.trim()) {
      setValidationError('กรุณาระบุบ้านเลขที่');
      return;
    }
    if (!purpose.trim()) {
      setValidationError('กรุณาระบุกิจการหรือวัตถุประสงค์ในการใช้เครื่องขยายเสียง');
      return;
    }
    if (!agreeRules) {
      setValidationError('กรุณากดยินยอมและรับรองการปฏิบัติตามกฎหมายและเงื่อนไข');
      return;
    }

    setIsSubmitting(true);

    const { id, refNo } = generateNextReferenceNumber();

    const newApp: SoundPermitApplication = {
      id: initialData?.id || id,
      referenceNumber: initialData?.referenceNumber || refNo,
      submissionDate: initialData?.submissionDate || today,
      writtenAt: MUNICIPALITY_INFO.writtenAtDefault,
      status: initialData?.status || 'PENDING',
      applicant,
      equipment,
      adDetails: {
        category,
        purpose,
        advertisingScript,
        soundType,
        locationDescription: locationDescription || purpose,
        locationHouseNo,
        locationVillageNo,
        locationRoad,
        locationSubdistrict: applicant.subdistrict,
        locationDistrict: applicant.district,
        locationProvince: applicant.province,
        startDate,
        endDate,
        totalDays,
        periodsCount: periods,
        dailyStartTime,
        dailyEndTime,
        attachedPermitCopiesCount: attachedCount,
      },
      fee: {
        ratePerPeriod,
        periods,
        totalAmount,
        amountText,
      },
      officerReview: initialData?.officerReview || {
        inspectorName: '',
        inspectorPosition: '',
        inspectionDate: '',
        inspectionComment: '',
        isNoiseCompliant: true,
        isTimeSlotCompliant: true,
        isLocationCompliant: true,
        officerOrder: 'PENDING',
        officerOrderDetails: '',
        approverName: '',
        approverPosition: '',
        approverDate: '',
        permitNumber: '',
        permitBookNumber: '',
        receiptNumber: '',
        cashierName: '',
        officerIssuerName: '',
        paymentDate: '',
      },
      applicantSignature: signature.trim() || `${applicant.prefix}${applicant.fullName}`.trim(),
      applicantSignatureImage: signatureImage || undefined,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveApplication(newApp);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(newApp);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title & Quick Demo Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start space-x-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md shrink-0">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาลตำบลพระซอง"
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>แบบฟอร์ม ฆ.ษ. ๑ อิเล็กทรอนิกส์</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-prompt">
                ยื่นคำร้องขออนุญาตทำการโฆษณาโดยใช้เครื่องขยายเสียง
              </h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                {MUNICIPALITY_INFO.name} {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenCalculator}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>เครื่องคำนวณค่าธรรมเนียม</span>
            </button>
            <button
              type="button"
              onClick={onOpenGuide}
              className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>คู่มือกฎหมาย</span>
            </button>
          </div>
        </div>

        {/* Demo Fast Fills */}
        <div className="pt-4">
          <div className="text-xs font-semibold text-slate-600 mb-2">
            กดเพื่อทดสอบกรอกข้อมูลตัวอย่างอัตโนมัติ (Demo Presets):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleLoadDemo(1)}
              className="p-2.5 text-left rounded-xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 transition-all text-xs group"
            >
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                <span>๑. งานบุญประเพณี (10 บ.)</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 group-hover:text-slate-700">
                ปลอดการค้า ผ้าป่า/กฐินวัดดอนหนองโจน
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleLoadDemo(2)}
              className="p-2.5 text-left rounded-xl border border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 transition-all text-xs group"
            >
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>๒. รถแห่การค้าเคลื่อนที่ (60 บ.)</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 group-hover:text-slate-700">
                รถกระบะแห่ประชาสัมพันธ์สินค้าเกษตร
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleLoadDemo(3)}
              className="p-2.5 text-left rounded-xl border border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 transition-all text-xs group"
            >
              <div className="font-bold text-purple-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-purple-600" />
                <span>๓. จัดงานหน้าร้านประจำที่ (75 บ.)</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-1 group-hover:text-slate-700">
                งานโปรโมชั่น 20 วัน (2 คราว = 150 บ.)
              </p>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Section 1: Advertising Category & Live Fee Calculation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold border-b border-slate-100 pb-3">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>๑. เลือกประเภทการโฆษณาและอัตราค่าธรรมเนียม (คราวละไม่เกิน ๑๕ วัน)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1) Non commercial 10 THB */}
            <label className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              category === 'NON_COMMERCIAL'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                    ประเภทที่ ๑
                  </span>
                  <div className="font-bold text-slate-900 text-sm">ไม่เป็นไปในทำนองการค้า</div>
                </div>
                <input
                  type="radio"
                  name="category"
                  value="NON_COMMERCIAL"
                  checked={category === 'NON_COMMERCIAL'}
                  onChange={() => setCategory('NON_COMMERCIAL')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-500 my-2">
                งานบุญ, งานกุศล, ประเพณีท้องถิ่น, ประกาศราชการ, กิจกรรมสาธารณประโยชน์
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-xs text-slate-600">อัตราต่อคราว:</span>
                <span className="text-lg font-black text-emerald-700">10 บาท</span>
              </div>
            </label>

            {/* 2) Commercial mobile 60 THB */}
            <label className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              category === 'COMMERCIAL_MOBILE'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 mb-1">
                    ประเภทที่ ๒
                  </span>
                  <div className="font-bold text-slate-900 text-sm">การค้า (โฆษณาเคลื่อนที่)</div>
                </div>
                <input
                  type="radio"
                  name="category"
                  value="COMMERCIAL_MOBILE"
                  checked={category === 'COMMERCIAL_MOBILE'}
                  onChange={() => setCategory('COMMERCIAL_MOBILE')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-500 my-2">
                รถแห่, รถกระบะหรือยานพาหนะติดตั้งลำโพงวิ่งโฆษณาสินค้า บริการ หรืองานบันเทิง
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-xs text-slate-600">อัตราต่อคราว:</span>
                <span className="text-lg font-black text-blue-700">60 บาท</span>
              </div>
            </label>

            {/* 3) Commercial stationary 75 THB */}
            <label className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
              category === 'COMMERCIAL_STATIONARY'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 mb-1">
                    ประเภทที่ ๓
                  </span>
                  <div className="font-bold text-slate-900 text-sm">การค้า (โฆษณาประจำที่)</div>
                </div>
                <input
                  type="radio"
                  name="category"
                  value="COMMERCIAL_STATIONARY"
                  checked={category === 'COMMERCIAL_STATIONARY'}
                  onChange={() => setCategory('COMMERCIAL_STATIONARY')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-500 my-2">
                ตั้งลำโพง ณ บริเวณหน้าร้านค้า, ซุ้มจำหน่ายสินค้า, ลานแสดงสินค้าประจำจุด
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-xs text-slate-600">อัตราต่อคราว:</span>
                <span className="text-lg font-black text-purple-700">75 บาท</span>
              </div>
            </label>
          </div>

          {/* Dates & Period Calculation Banner */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-xl p-4 border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ตั้งแต่วันที่ (เริ่มต้น) *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ถึงวันที่ (สิ้นสุด) *
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ช่วงเวลาที่ใช้เสียง (เริ่มต้น)
                </label>
                <input
                  type="time"
                  value={dailyStartTime}
                  onChange={(e) => setDailyStartTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ช่วงเวลาที่ใช้เสียง (สิ้นสุด)
                </label>
                <input
                  type="time"
                  value={dailyEndTime}
                  onChange={(e) => setDailyEndTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Live Fee Breakdown Bar */}
            <div className="bg-white rounded-lg p-3.5 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">สรุปการคำนวณ:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                    รวม {totalDays} วัน
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    คิดเป็น {periods} คราว (คราวละไม่เกิน ๑๕ วัน)
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  สูตรคำนวณ: {periods} คราว × {ratePerPeriod} บาท = <strong>{totalAmount} บาท</strong> ({amountText})
                </div>
              </div>

              <div className="flex items-baseline justify-end gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <span className="text-xs text-emerald-900 font-semibold">ค่าธรรมเนียมที่ต้องชำระ:</span>
                <span className="text-2xl font-black text-emerald-800 font-prompt">{totalAmount}</span>
                <span className="text-xs font-bold text-emerald-800">บาท</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Applicant Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-blue-600" />
            <span>๒. ข้อมูลผู้ยื่นคำร้อง (ผู้ครอบครองเครื่องขยายเสียง)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">คำนำหน้า *</label>
              <select
                value={applicant.prefix}
                onChange={(e) => setApplicant({ ...applicant, prefix: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white"
              >
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
                <option value="ห้างหุ้นส่วนจำกัด">ห้างหุ้นส่วนจำกัด</option>
                <option value="บริษัท">บริษัท</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ - นามสกุล *</label>
              <input
                type="text"
                placeholder="เช่น สมพร ดีเลิศ"
                value={applicant.fullName}
                onChange={(e) => setApplicant({ ...applicant, fullName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">อายุ (ปี) *</label>
              <input
                type="number"
                min="18"
                max="100"
                value={applicant.age}
                onChange={(e) => setApplicant({ ...applicant, age: parseInt(e.target.value || '0', 10) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">สัญชาติ</label>
              <input
                type="text"
                value={applicant.nationality}
                onChange={(e) => setApplicant({ ...applicant, nationality: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">เลขบัตรประจำตัวประชาชน / ทะเบียนนิติบุคคล *</label>
              <input
                type="text"
                maxLength={13}
                placeholder="เลข 13 หลัก"
                value={applicant.idCardNumber}
                onChange={(e) => setApplicant({ ...applicant, idCardNumber: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white font-mono"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
              <input
                type="tel"
                placeholder="เช่น 081-234-5678"
                value={applicant.phone}
                onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600 block mb-2">ที่อยู่ตามทะเบียนบ้าน:</span>
            <div className="grid grid-cols-2 sm:grid-cols-12 gap-3">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">บ้านเลขที่ *</label>
                <input
                  type="text"
                  placeholder="เช่น 45/1"
                  value={applicant.houseNumber}
                  onChange={(e) => setApplicant({ ...applicant, houseNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
                  required
                />
              </div>

              <div className="col-span-1 sm:col-span-3">
                <label className="block text-xs text-slate-600 mb-1">หมู่ที่ (หมู่ 1 - 16)</label>
                <select
                  value={applicant.villageNo}
                  onChange={(e) => {
                    setApplicant({
                      ...applicant,
                      villageNo: e.target.value,
                      villageName: '',
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
                >
                  {PHRASONG_VILLAGES.map((v) => (
                    <option key={v.no} value={v.no}>
                      หมู่ {v.no}
                    </option>
                  ))}
                  <option value="ระบุเอง">ระบุหมู่ที่อื่น</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-3">
                <label className="block text-xs text-slate-600 mb-1">ถนน / ซอย</label>
                <input
                  type="text"
                  placeholder="เช่น สายหลัก"
                  value={applicant.road}
                  onChange={(e) => setApplicant({ ...applicant, road: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">ตำบล</label>
                <input
                  type="text"
                  value={applicant.subdistrict}
                  onChange={(e) => setApplicant({ ...applicant, subdistrict: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">อำเภอ</label>
                <input
                  type="text"
                  value={applicant.district}
                  onChange={(e) => setApplicant({ ...applicant, district: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Equipment Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold border-b border-slate-100 pb-3">
            <Speaker className="w-5 h-5 text-indigo-600" />
            <span>๓. ข้อมูลเครื่องขยายเสียงและอุปกรณ์ (ตามแบบ ฆ.ษ. ๑)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขหมายทะเบียนเครื่องขยายเสียง *
              </label>
              <input
                type="text"
                placeholder="เช่น AMP-1234"
                value={equipment.amplifierSerial}
                onChange={(e) => setEquipment({ ...equipment, amplifierSerial: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-mono"
                required
              />
              <span className="text-[11px] text-slate-400">ระบุเลขทะเบียนหรือซีเรียลนัมเบอร์</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขหมายทะเบียนไมโครโฟน *
              </label>
              <input
                type="text"
                placeholder="เช่น MIC-001"
                value={equipment.microphoneSerial}
                onChange={(e) => setEquipment({ ...equipment, microphoneSerial: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขหมายทะเบียนเครื่องบันทึกเสียง *
              </label>
              <input
                type="text"
                placeholder="เช่น REC-99"
                value={equipment.soundRecorderSerial}
                onChange={(e) => setEquipment({ ...equipment, soundRecorderSerial: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ทะเบียนรถ (กรณีรถแห่ / โฆษณาเคลื่อนที่)
              </label>
              <input
                type="text"
                placeholder="เช่น บค-5432 นครพนม"
                value={equipment.vehicleRegistration || ''}
                onChange={(e) => setEquipment({ ...equipment, vehicleRegistration: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ยี่ห้อ / รุ่น / กำลังวัตต์
              </label>
              <input
                type="text"
                placeholder="เช่น TOA 500W"
                value={equipment.equipmentBrand || ''}
                onChange={(e) => setEquipment({ ...equipment, equipmentBrand: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประเภทเสียงที่ใช้
              </label>
              <select
                value={soundType}
                onChange={(e) => setSoundType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              >
                <option value="RECORDED">เสียงบันทึก (เทป / สปอตเสียง MP3)</option>
                <option value="LIVE_VOICE">เสียงพูดสดผ่านไมโครโฟน</option>
                <option value="BOTH">ทั้งสองประเภท (บันทึกและสด)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Purpose & Location */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>๔. กิจการและสถานที่ทำการโฆษณา (ข้อที่ ๑ ในแบบ ฆ.ษ. ๑)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ข้าพเจ้ามีความประสงค์จะใช้เครื่องดังกล่าวเพื่อทำการโฆษณากิจการ *
            </label>
            <textarea
              rows={2}
              placeholder="ระบุกิจการ เช่น ประชาสัมพันธ์เชิญชวนเที่ยวงานประเพณีบุญบั้งไฟ หรือ โปรโมตร้านค้าลดราคาสินค้าเกษตร"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              สาระสำคัญของถ้อยคำ / ข้อความโฆษณา (สปอตเสียง)
            </label>
            <textarea
              rows={2}
              placeholder="ระบุข้อความที่จะใช้ประกาศโฆษณา เพื่อให้เจ้าหน้าที่ตรวจสอบความสุภาพและความถูกต้องตามกฎหมาย"
              value={advertisingScript}
              onChange={(e) => setAdvertisingScript(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ณ ที่ (ระบุสถานที่จัดงาน หรือเส้นทางรถแห่) *
              </label>
              <input
                type="text"
                placeholder="เช่น บริเวณลานตลาดสดพระซอง หรือ ถนนสายหลักในตำบลพระซอง"
                value={locationDescription}
                onChange={(e) => setLocationDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมู่ที่ (ในเขตเทศบาลตำบลพระซอง)
              </label>
              <input
                type="text"
                placeholder="เช่น หมู่ 1 ถึง 16 หรือ หมู่ 3"
                value={locationVillageNo}
                onChange={(e) => setLocationVillageNo(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Legal Agreement & Sign */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800 font-bold border-b border-slate-100 pb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>๕. คำรับรองของผู้ยื่นคำร้องและลงนาม (ข้อที่ ๒ และ ๓ ในแบบ ฆ.ษ. ๑)</span>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <div className="font-semibold text-slate-900">
              ข้อที่ ๒ ข้าพเจ้ารับรองว่าจะปฏิบัติให้ถูกต้องตามกฎหมาย กฎข้อบังคับและเงื่อนไขว่าด้วยการควบคุมการโฆษณาโดยเครื่องขยายเสียงทุกประการ
            </div>
            <div className="text-slate-600">
              ข้อที่ ๓ ข้าพเจ้าได้แนบใบอนุญาตให้มีเพื่อใช้ฯ ซึ่งมีเลขหมายทะเบียนตามที่แจ้งในคำร้องนี้ รวม{' '}
              <input
                type="number"
                min="1"
                max="10"
                value={attachedCount}
                onChange={(e) => setAttachedCount(parseInt(e.target.value || '1', 10))}
                className="w-14 p-1 border border-slate-300 rounded text-center font-bold inline-block mx-1 bg-white"
              />{' '}
              ฉบับ มาเพื่อประกอบพิจารณาด้วยแล้ว
            </div>

            <label className="flex items-start gap-2.5 pt-2 cursor-pointer border-t border-slate-200 mt-2">
              <input
                type="checkbox"
                checked={agreeRules}
                onChange={(e) => setAgreeRules(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-900">
                ข้าพเจ้าขอรับรองว่าข้อความทั้งหมดเป็นความจริง และยินยอมปฏิบัติตาม พ.ร.บ. ควบคุมการโฆษณาโดยใช้เครื่องขยายเสียง พ.ศ. ๒๔๙๓ ทุกประการ
              </span>
            </label>
          </div>

          {/* Handwritten Digital Signature Pad */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4">
            <SignaturePad
              value={signatureImage}
              onChange={(dataUrl) => {
                setSignatureImage(dataUrl);
                if (!signature.trim() && applicant.fullName.trim()) {
                  setSignature(`${applicant.prefix}${applicant.fullName}`.trim());
                }
              }}
              applicantName={`${applicant.prefix}${applicant.fullName}`.trim()}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ-สกุล ตัวบรรจง (กำกับใต้ลายมือชื่อ) *
                </label>
                <input
                  type="text"
                  placeholder="เช่น นายประเสริฐ สุวรรณชัย"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 font-serif"
                  required
                />
                <span className="text-[11px] text-slate-400">จะปรากฏในช่อง ({signature || `${applicant.prefix}${applicant.fullName}` || 'ชื่อ-สกุล'}) ผู้ยื่นคำร้อง</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เขียนที่ (สถานที่ยื่นคำร้อง)
                </label>
                <input
                  type="text"
                  readOnly
                  value={MUNICIPALITY_INFO.writtenAtDefault}
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-sm text-slate-600"
                />
                <span className="text-[11px] text-slate-400">{MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Error banner if any */}
        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-sm font-semibold flex items-center space-x-2">
            <span>⚠️ {validationError}</span>
          </div>
        )}

        {/* Submit Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            เมื่อยื่นคำร้องแล้ว ระบบจะบันทึกและสามารถสั่งพิมพ์เอกสารแบบ ฆ.ษ. ๑ หรือติดตามสถานะได้ทันที
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'กำลังบันทึกคำร้อง...' : 'ยื่นคำร้องขออนุญาต (บันทึกแบบ ฆ.ษ. ๑)'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
