/**
 * Type definitions for Sound Amplifier Advertising Permission System
 * เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม
 * แบบ ฆ.ษ. ๑ & แบบ ฆ.ษ. ๒
 */

export type FeeCategory = 
  | 'NON_COMMERCIAL'       // 1) ไม่เป็นไปในทำนองการค้า 10 บาท/คราว (<= 15 วัน)
  | 'COMMERCIAL_MOBILE'    // 2) เป็นไปในทำนองการค้า โฆษณาเคลื่อนที่ (รถแห่) 60 บาท/คราว (<= 15 วัน)
  | 'COMMERCIAL_STATIONARY'; // 3) เป็นไปในทำนองการค้า โฆษณาประจำที่ 75 บาท/คราว (<= 15 วัน)

export type ApplicationStatus = 
  | 'PENDING'              // รอยื่น / รอเจ้าหน้าที่ตรวจ
  | 'UNDER_REVIEW'         // อยู่ระหว่างเจ้าหน้าที่ตรวจสอบ
  | 'APPROVED'             // อนุมัติแล้ว (รอดำเนินการชำระเงิน/ออกใบอนุญาต)
  | 'PERMIT_ISSUED'        // ออกใบอนุญาตแล้ว (แบบ ฆ.ษ. ๒)
  | 'REJECTED';            // ไม่อนุมัติ / แจ้งแก้ไข

export interface ApplicantInfo {
  prefix: string;          // นาย / นาง / นางสาว / ห้างหุ้นส่วนจำกัด / บริษัท
  fullName: string;        // ชื่อ-นามสกุล หรือชื่อนิติบุคคล
  age: number;             // อายุ (ปี)
  nationality: string;     // สัญชาติ (ไทย)
  race: string;            // เชื้อชาติ (ไทย)
  idCardNumber: string;    // เลขบัตรประจำตัวประชาชน / เลขนิติบุคคล
  phone: string;           // เบอร์โทรศัพท์
  
  // ที่อยู่ตามทะเบียนบ้าน
  houseNumber: string;     // บ้านเลขที่
  villageNo: string;       // หมู่ที่ (1 - 16 หรือระบุ)
  villageName?: string;    // ชื่อหมู่บ้าน (เช่น บ้านพระซอง, บ้านนาคอย)
  road: string;            // ถนน
  subdistrict: string;     // ตำบล (พระซอง)
  district: string;        // อำเภอ (นาแก)
  province: string;        // จังหวัด (นครพนม)
  postalCode: string;      // 48130
}

export interface EquipmentInfo {
  amplifierSerial: string;    // เลขหมายทะเบียนเครื่องขยายเสียง
  microphoneSerial: string;   // เลขหมายทะเบียนไมโครโฟน
  soundRecorderSerial: string;// เลขหมายทะเบียนเครื่องบันทึกเสียง
  vehicleRegistration?: string; // เลขทะเบียนรถ (กรณีโฆษณาเคลื่อนที่/รถแห่)
  equipmentBrand?: string;    // ยี่ห้อ / รุ่น / กำลังวัตต์
  decibelRating?: number;     // ระดับเดซิเบลสูงสุด (ไม่เกิน 85 dB ตามเกณฑ์)
}

export interface AdvertisementDetails {
  category: FeeCategory;      // หมวดหมู่ค่าธรรมเนียม
  purpose: string;            // วัตถุประสงค์ / กิจการที่โฆษณา
  advertisingScript: string;  // ข้อความ/ถ้อยคำที่จะโฆษณา (สรุปสาระสำคัญ)
  soundType: 'RECORDED' | 'LIVE_VOICE' | 'BOTH'; // ใช้เสียงบันทึก หรือเสียงพูดสด หรือทั้งสอง
  
  // สถานที่ / เส้นทาง
  locationDescription: string; // สถานที่ ณ ที่... หรือเส้นทางรถแห่
  locationHouseNo: string;    // ณ ที่เลขที่
  locationVillageNo: string;  // หมู่ที่
  locationRoad: string;       // ถนน
  locationSubdistrict: string;// ตำบล
  locationDistrict: string;   // อำเภอ
  locationProvince: string;   // จังหวัด

  // ระยะเวลา
  startDate: string;          // YYYY-MM-DD
  endDate: string;            // YYYY-MM-DD
  totalDays: number;          // จำนวนวัน
  periodsCount: number;       // จำนวนคราว (คราวละไม่เกิน 15 วัน)
  dailyStartTime: string;     // เวลาเริ่มใช้เสียง (เช่น 08:30)
  dailyEndTime: string;       // เวลาสิ้นสุดใช้เสียง (เช่น 17:30)
  
  // เอกสารแนบ
  attachedPermitCopiesCount: number; // แนบใบอนุญาตให้มีเพื่อใช้ฯ รวม ... ฉบับ
  attachedFiles?: Array<{
    name: string;
    type: string;
    uploadedAt: string;
  }>;
}

export interface FeeCalculation {
  ratePerPeriod: number;     // 10, 60, or 75 THB
  periods: number;           // Math.ceil(totalDays / 15)
  totalAmount: number;       // ratePerPeriod * periods
  amountText: string;        // ตัวอักษรภาษาไทย เช่น "หกสิบบาทถ้วน"
}

export interface OfficerReviewRecord {
  // บันทึกของเจ้าหน้าที่ตรวจสอบ (หน้า ๒)
  inspectorName: string;      // ชื่อเจ้าหน้าที่ตรวจสอบ
  inspectorPosition: string;  // ตำแหน่ง เช่น เจ้าพนักงานสาธารณสุข / นิติกร / เจ้าพนักงานเทศกิจ
  inspectionDate: string;     // วันที่ตรวจสอบ
  inspectionComment: string;  // บันทึกความเห็น (เช่น ตรวจสอบความถูกต้องของเอกสาร สภาพเครื่องเสียงไม่ก่อความเดือดร้อนรำคาญ)
  isNoiseCompliant: boolean;  // ระดับเสียงไม่เกินเกณฑ์มาตรฐาน
  isTimeSlotCompliant: boolean;// ช่วงเวลาถูกต้อง (ระหว่าง 06.00 - 20.00 น.)
  isLocationCompliant: boolean;// เส้นทาง/สถานที่เหมาะสม
  
  // คำสั่งเจ้าพนักงานผู้ออกใบอนุญาต
  officerOrder: 'APPROVED' | 'CONDITIONAL_APPROVED' | 'REJECTED' | 'PENDING';
  officerOrderDetails: string;// บันทึกคำสั่ง
  approverName: string;       // นายกเทศมนตรีตำบลพระซอง หรือผู้ได้รับมอบอำนาจ
  approverPosition: string;   // นายกเทศมนตรีตำบลพระซอง
  approverDate: string;       // วันที่มีคำสั่ง
  
  // สำหรับพนักงานเจ้าหน้าที่การเงิน
  permitNumber: string;       // เลขที่ใบอนุญาต เช่น ฆ.ษ. ๐๑/๒๕๖๙
  permitBookNumber: string;   // เล่มที่ เช่น ๑
  receiptNumber: string;      // เลขที่ใบเสร็จรับเงิน เช่น บส-๐๒๓/๒๕๖๙
  cashierName: string;        // ผู้รับเงิน
  officerIssuerName: string;  // พนักงานเจ้าหน้าที่
  paymentDate: string;        // วันที่รับเงิน
}

export interface SoundPermitApplication {
  id: string;                 // e.g., KS1-2569-001
  referenceNumber: string;    // เลขที่คำร้อง เช่น ฆ.ษ.๑-๒๕๖๙/๐๑
  submissionDate: string;     // วันที่ยื่นคำร้อง YYYY-MM-DD
  writtenAt: string;          // เขียนที่ เช่น "สำนักงานเทศบาลตำบลพระซอง"
  status: ApplicationStatus;
  
  applicant: ApplicantInfo;
  equipment: EquipmentInfo;
  adDetails: AdvertisementDetails;
  fee: FeeCalculation;
  officerReview: OfficerReviewRecord;
  
  applicantSignature: string; // ข้อความลายมือชื่อ (ชื่อ-สกุล)
  applicantSignatureImage?: string; // ภาพลายมือชื่อที่วาด/เซ็นต์ (data:image/png;base64)
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptBookSettings {
  bookNumber: string;       // เล่มที่ เช่น "01" หรือ "1"
  startReceiptNo: number;   // เลขที่เริ่มต้น เช่น 1
  currentReceiptNo: number; // เลขที่ปัจจุบันที่ออกไปแล้ว เช่น 5
  endReceiptNo: number;     // เลขที่สิ้นสุดในเล่ม เช่น 50
  prefix: string;           // คำนำหน้า เช่น "บส."
  yearBE: number;           // ปี พ.ศ. เช่น 2569
  cashierName: string;      // ผู้รับเงินประจำ
  isActive: boolean;
  notes?: string;
  updatedAt: string;
}

export interface ReceiptControlLog {
  id: string;
  receiptBookNumber: string; // เล่มที่
  receiptNumber: string;     // เลขที่ เช่น "005/2569" หรือ "5"
  fullReceiptNo: string;     // เช่น เล่มที่ ๑ เลขที่ ๕/๒๕๖๙
  applicationId: string;
  referenceNumber: string;   // เลขที่คำร้อง ฆ.ษ.๑
  applicantName: string;
  category: FeeCategory;
  amount: number;
  amountText: string;
  paymentDate: string;       // YYYY-MM-DD
  cashierName: string;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
}

