import { SoundPermitApplication, ReceiptBookSettings, ReceiptControlLog } from '../types';
import { SAMPLE_APPLICATIONS, MUNICIPALITY_INFO } from './constants';
import { toThaiDigits } from './thaiDate';

const STORAGE_KEY = 'phrasong_sound_permit_applications_v1';
const RECEIPT_SETTINGS_KEY = 'phrasong_receipt_book_settings_v1';
const RECEIPT_LOGS_KEY = 'phrasong_receipt_control_logs_v1';

export const DEFAULT_RECEIPT_SETTINGS: ReceiptBookSettings = {
  bookNumber: '๑',
  startReceiptNo: 1,
  currentReceiptNo: 1,
  endReceiptNo: 50,
  prefix: 'บส.',
  yearBE: new Date().getFullYear() + 543,
  cashierName: MUNICIPALITY_INFO.cashierNameDefault,
  isActive: true,
  notes: 'เล่มใบเสร็จรับเงินประจำปี พ.ศ. ๒๕๖๙',
  updatedAt: new Date().toISOString(),
};

export function getReceiptBookSettings(): ReceiptBookSettings {
  try {
    const raw = localStorage.getItem(RECEIPT_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(RECEIPT_SETTINGS_KEY, JSON.stringify(DEFAULT_RECEIPT_SETTINGS));
      return DEFAULT_RECEIPT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading receipt book settings', e);
    return DEFAULT_RECEIPT_SETTINGS;
  }
}

export function saveReceiptBookSettings(settings: ReceiptBookSettings): void {
  try {
    localStorage.setItem(RECEIPT_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving receipt book settings', e);
  }
}

export function getReceiptLogs(): ReceiptControlLog[] {
  try {
    const raw = localStorage.getItem(RECEIPT_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading receipt logs', e);
    return [];
  }
}

export function saveReceiptLogs(logs: ReceiptControlLog[]): void {
  try {
    localStorage.setItem(RECEIPT_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving receipt logs', e);
  }
}

export function getApplications(): SoundPermitApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPLICATIONS));
      return SAMPLE_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Migrate approver name and remove villageName if previously saved
      const migrated = parsed.map((item) => {
        let updated = { ...item };
        if (updated.officerReview?.approverName === 'นายสมบัติ ศรีวรขาน') {
          updated.officerReview = {
            ...updated.officerReview,
            approverName: 'นางมารศรี ไชยต้นเทือก',
          };
        }
        if (updated.applicant?.villageName) {
          updated.applicant = {
            ...updated.applicant,
            villageName: '',
          };
        }
        return updated;
      });
      return migrated;
    }
    return SAMPLE_APPLICATIONS;
  } catch (e) {
    console.error('Error loading applications from localStorage', e);
    return SAMPLE_APPLICATIONS;
  }
}

export function saveApplications(apps: SoundPermitApplication[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  } catch (e) {
    console.error('Error saving applications to localStorage', e);
  }
}

export function saveApplication(app: SoundPermitApplication): SoundPermitApplication {
  const all = getApplications();
  const existingIdx = all.findIndex((item) => item.id === app.id);
  let updatedList: SoundPermitApplication[];
  
  if (existingIdx >= 0) {
    updatedList = [...all];
    updatedList[existingIdx] = { ...app, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [app, ...all];
  }
  
  saveApplications(updatedList);
  return app;
}

export function deleteApplication(id: string): void {
  const all = getApplications();
  const filtered = all.filter((item) => item.id !== id);
  saveApplications(filtered);
}

export function resetToDefaults(): SoundPermitApplication[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_APPLICATIONS));
  localStorage.setItem(RECEIPT_SETTINGS_KEY, JSON.stringify(DEFAULT_RECEIPT_SETTINGS));
  localStorage.removeItem(RECEIPT_LOGS_KEY);
  return SAMPLE_APPLICATIONS;
}

export function generateNextReferenceNumber(): { id: string; refNo: string } {
  const all = getApplications();
  const currentYearBE = new Date().getFullYear() + 543;
  const nextSeq = all.length + 1;
  const seqPadded = String(nextSeq).padStart(2, '0');
  
  return {
    id: `KS1-${currentYearBE}-${String(nextSeq).padStart(3, '0')}`,
    refNo: `ฆ.ษ.๑-${toThaiDigits(seqPadded)}/${toThaiDigits(currentYearBE)}`,
  };
}

export function generateNextPermitNumber(): { permitNumber: string; bookNumber: string } {
  const all = getApplications();
  const issuedCount = all.filter((a) => a.officerReview?.permitNumber).length;
  const nextSeq = issuedCount + 1;
  const currentYearBE = new Date().getFullYear() + 543;
  const seqPadded = String(nextSeq).padStart(2, '0');
  const receiptSettings = getReceiptBookSettings();
  
  return {
    permitNumber: `ฆ.ษ. ${toThaiDigits(seqPadded)}/${toThaiDigits(currentYearBE)}`,
    bookNumber: receiptSettings.bookNumber || '๑',
  };
}

/**
 * Generates and increments the next receipt number based on Receipt Book Settings,
 * and logs it in the receipt registry.
 */
export function issueNextReceipt(app: SoundPermitApplication, cashierName?: string): {
  receiptBookNumber: string;
  receiptNumber: string;
  fullReceiptNo: string;
} {
  const settings = getReceiptBookSettings();
  const nextNum = settings.currentReceiptNo;
  const yearBE = settings.yearBE || new Date().getFullYear() + 543;
  const prefix = settings.prefix ? settings.prefix + '-' : 'บส-';

  const numFormatted = String(nextNum).padStart(2, '0');
  const receiptNumber = `${prefix}${toThaiDigits(numFormatted)}/${toThaiDigits(yearBE)}`;
  const fullReceiptNo = `เล่มที่ ${settings.bookNumber} เลขที่ ${toThaiDigits(numFormatted)}/${toThaiDigits(yearBE)}`;

  // Update receipt settings to increment currentReceiptNo
  let nextCurrentNo = settings.currentReceiptNo + 1;
  let bookNo = settings.bookNumber;

  // Check if book overflow
  if (nextCurrentNo > settings.endReceiptNo) {
    // Increment book number if numeric or keep
    const parsedBook = parseInt(settings.bookNumber, 10);
    if (!isNaN(parsedBook)) {
      bookNo = String(parsedBook + 1);
    }
    nextCurrentNo = 1;
  }

  saveReceiptBookSettings({
    ...settings,
    bookNumber: bookNo,
    currentReceiptNo: nextCurrentNo,
    updatedAt: new Date().toISOString(),
  });

  // Log in receipt registry
  const logs = getReceiptLogs();
  const newLog: ReceiptControlLog = {
    id: `R-LOG-${Date.now()}`,
    receiptBookNumber: settings.bookNumber,
    receiptNumber: receiptNumber,
    fullReceiptNo: fullReceiptNo,
    applicationId: app.id,
    referenceNumber: app.referenceNumber,
    applicantName: `${app.applicant.prefix}${app.applicant.fullName}`,
    category: app.adDetails.category,
    amount: app.fee.totalAmount,
    amountText: app.fee.amountText,
    paymentDate: new Date().toISOString().split('T')[0],
    cashierName: cashierName || settings.cashierName || MUNICIPALITY_INFO.cashierNameDefault,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  saveReceiptLogs([newLog, ...logs]);

  return {
    receiptBookNumber: settings.bookNumber,
    receiptNumber: receiptNumber,
    fullReceiptNo: fullReceiptNo,
  };
}

