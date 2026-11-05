/**
 * Thai Date & Currency Utility Functions
 * Conversion to Buddhist Era (พ.ศ.), Thai numerals, and Baht Text
 */

export const THAI_MONTHS_FULL = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

export function toThaiDigits(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => THAI_DIGITS[parseInt(digit, 10)]);
}

/**
 * Format date string (YYYY-MM-DD) into Thai formal date
 * e.g., "1 พฤศจิกายน พ.ศ. 2569" or "๑ พฤศจิกายน ๒๕๖๙"
 */
export function formatThaiDate(
  dateStr: string,
  options?: { useThaiDigits?: boolean; includeBEPrefix?: boolean; shortMonth?: boolean }
): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const year = parseInt(parts[0], 10) + 543;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  const monthName = options?.shortMonth 
    ? THAI_MONTHS_SHORT[monthIdx] || '' 
    : THAI_MONTHS_FULL[monthIdx] || '';
  
  const prefix = options?.includeBEPrefix ? 'พ.ศ. ' : '';
  const formatted = `${day} ${monthName} ${prefix}${year}`;
  
  return options?.useThaiDigits ? toThaiDigits(formatted) : formatted;
}

export function getThaiDateParts(dateStr: string): { day: string; month: string; yearBE: string } {
  if (!dateStr) return { day: '', month: '', yearBE: '' };
  const parts = dateStr.split('-');
  if (parts.length !== 3) return { day: '', month: '', yearBE: '' };
  const day = String(parseInt(parts[2], 10));
  const monthIdx = parseInt(parts[1], 10) - 1;
  const month = THAI_MONTHS_FULL[monthIdx] || '';
  const yearBE = String(parseInt(parts[0], 10) + 543);
  return { day, month, yearBE };
}

/**
 * Calculate difference in days (inclusive)
 * e.g., 2026-11-01 to 2026-11-01 = 1 day
 */
export function calculateDaysBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Calculate fee periods (คราวละไม่เกิน 15 วัน)
 */
export function calculatePeriods(totalDays: number): number {
  if (totalDays <= 0) return 0;
  return Math.ceil(totalDays / 15);
}

/**
 * Get fee rate per 15-day period based on category
 * 1) โฆษณาที่ไม่เป็นไปในทํานองการค้า 10 บาท
 * 2) โฆษณาที่เป็นไปในทํานองการค้า (โฆษณาเคลื่อนที่) 60 บาท
 * 3) โฆษณาที่เป็นไปในทํานองการค้า (โฆษณาประจําที่) 75 บาท
 */
export function getFeeRate(category: string): number {
  switch (category) {
    case 'NON_COMMERCIAL':
      return 10;
    case 'COMMERCIAL_MOBILE':
      return 60;
    case 'COMMERCIAL_STATIONARY':
      return 75;
    default:
      return 10;
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'NON_COMMERCIAL':
      return 'โฆษณาที่ไม่เป็นไปในทำนองการค้า (10 บาท / คราวไม่เกิน 15 วัน)';
    case 'COMMERCIAL_MOBILE':
      return 'โฆษณาที่เป็นไปในทำนองการค้า - โฆษณาเคลื่อนที่ / รถแห่ (60 บาท / คราวไม่เกิน 15 วัน)';
    case 'COMMERCIAL_STATIONARY':
      return 'โฆษณาที่เป็นไปในทำนองการค้า - โฆษณาประจำที่ (75 บาท / คราวไม่เกิน 15 วัน)';
    default:
      return category;
  }
}

export function getCategoryShortLabel(category: string): string {
  switch (category) {
    case 'NON_COMMERCIAL':
      return 'ไม่เป็นการค้า (10 บ.)';
    case 'COMMERCIAL_MOBILE':
      return 'การค้าเคลื่อนที่/รถแห่ (60 บ.)';
    case 'COMMERCIAL_STATIONARY':
      return 'การค้าประจำที่ (75 บ.)';
    default:
      return category;
  }
}

/**
 * Convert Thai Baht number to words
 * e.g., 60 -> "หกสิบบาทถ้วน", 75 -> "เจ็ดสิบห้าบาทถ้วน", 120 -> "หนึ่งร้อยยี่สิบบาทถ้วน"
 */
export function thaiBahtText(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'ศูนย์บาทถ้วน';
  if (amount === 0) return 'ศูนย์บาทถ้วน';

  const numbers = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const units = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  const [integerPart, decimalPart] = amount.toFixed(2).split('.');
  let result = '';

  const parseGroup = (numStr: string): string => {
    let groupRes = '';
    const len = numStr.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(numStr.charAt(i), 10);
      const pos = len - i - 1;
      if (digit !== 0) {
        if (pos === 0 && digit === 1 && len > 1 && numStr.charAt(len - 2) !== '0') {
          groupRes += 'เอ็ด';
        } else if (pos === 1 && digit === 1) {
          groupRes += '';
        } else if (pos === 1 && digit === 2) {
          groupRes += 'ยี่';
        } else {
          groupRes += numbers[digit];
        }
        groupRes += units[pos];
      }
    }
    return groupRes;
  };

  const intNum = parseInt(integerPart, 10);
  if (intNum === 0) {
    result = 'ศูนย์';
  } else {
    // Handling up to millions
    if (integerPart.length > 6) {
      const millionPart = integerPart.slice(0, integerPart.length - 6);
      const remainPart = integerPart.slice(integerPart.length - 6);
      result += parseGroup(millionPart) + 'ล้าน' + parseGroup(remainPart);
    } else {
      result += parseGroup(integerPart);
    }
  }

  result += 'บาท';

  const decNum = parseInt(decimalPart, 10);
  if (decNum === 0) {
    result += 'ถ้วน';
  } else {
    result += parseGroup(decimalPart) + 'สตางค์';
  }

  return result;
}
