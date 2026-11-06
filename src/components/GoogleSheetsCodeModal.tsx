import React, { useState } from 'react';
import { Copy, Check, FileSpreadsheet, ExternalLink, X, Code2, Sparkles, BookOpen } from 'lucide-react';
import { MUNICIPALITY_INFO } from '../utils/constants';

interface GoogleSheetsCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetsCodeModal: React.FC<GoogleSheetsCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const appScriptCode = `/**
 * =========================================================================
 * ระบบเชื่อมต่อ Google Sheets สำหรับคำร้องขออนุญาตใช้เครื่องขยายเสียง
 * เทศบาลตำบลพระซอง อำเภอนาแก จังหวัดนครพนม (แบบ ฆ.ษ. ๑ & ฆ.ษ. ๒)
 * =========================================================================
 * วิธีใช้งาน:
 * 1. เปิด Google Sheets เปล่าขึ้นมา 1 ไฟล์
 * 2. ไปที่เมนู "ส่วนขยาย" (Extensions) -> "Apps Script"
 * 3. ลบโค้ดเดิมออกทั้งหมด แล้ววางโค้ดชุดนี้ลงไป
 * 4. กดบันทึก (Ctrl + S)
 * 5. รีเฟรชหน้า Google Sheets จะมีเมนู "🔊 ระบบเทศบาลพระซอง" ปรากฏขึ้นมา
 * 6. กด "🔊 ระบบเทศบาลพระซอง" -> "สร้างหัวตารางและจัดรูปแบบอัตโนมัติ"
 * =========================================================================
 */

// สร้างเมนูบน Google Sheets เมื่อเปิดไฟล์
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔊 ระบบเทศบาลพระซอง')
    .addItem('📋 1. สร้างหัวตารางสมุดคุมคำร้อง (ฆ.ษ. ๑)', 'setupSheetHeaders')
    .addItem('🧾 2. สร้างหัวตารางสมุดคุมใบเสร็จรับเงิน', 'setupReceiptHeaders')
    .addSeparator()
    .addItem('🔄 3. ซิงค์ข้อมูลล่าสุดจาก Google Drive', 'syncDataFromDrive')
    .addToUi();
}

/**
 * 1. ฟังก์ชันสร้างหัวตารางสมุดคุมคำร้อง แบบ ฆ.ษ. ๑
 */
function setupSheetHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('ทะเบียนคุมคำร้อง_ฆษ1');
  if (!sheet) {
    sheet = ss.insertSheet('ทะเบียนคุมคำร้อง_ฆษ1');
  }
  sheet.clear();

  // กำหนดชื่อหัวคอลัมน์
  var headers = [
    'ลำดับ',
    'วันที่ยื่นคำร้อง',
    'เลขที่คำร้อง (แบบ ฆ.ษ.๑)',
    'ชื่อ-นามสกุล ผู้ยื่นคำร้อง',
    'เลขบัตรประชาชน',
    'เบอร์โทรศัพท์',
    'ที่อยู่/บ้านเลขที่/หมู่',
    'ประเภทการโฆษณา',
    'วัตถุประสงค์การโฆษณา',
    'สถานที่/เส้นทางโฆษณา',
    'ทะเบียนเครื่องเสียง/รถแห่',
    'วันเริ่มต้น',
    'วันสิ้นสุด',
    'จำนวนวัน',
    'จำนวนคราว (<=15วัน/คราว)',
    'ค่าธรรมเนียม (บาท)',
    'สถานะคำร้อง',
    'เลขที่ใบอนุญาต (ฆ.ษ.๒)',
    'เลขที่ใบเสร็จรับเงิน',
    'ผู้อนุมัติ/ลงนาม'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // จัดรูปแบบหัวตาราง
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#065f46') // เขียวเข้ม เทศบาล
             .setFontColor('#ffffff')
             .setFontWeight('bold')
             .setHorizontalAlignment('center')
             .setFontFamily('Sarabun');

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  
  SpreadsheetApp.getUi().alert('✅ สำเร็จ: สร้างหัวตารางสมุดคุมคำร้อง แบบ ฆ.ษ. ๑ เรียบร้อยแล้ว');
}

/**
 * 2. ฟังก์ชันสร้างหัวตารางสมุดคุมใบเสร็จรับเงิน
 */
function setupReceiptHeaders() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('สมุดคุมใบเสร็จรับเงิน');
  if (!sheet) {
    sheet = ss.insertSheet('สมุดคุมใบเสร็จรับเงิน');
  }
  sheet.clear();

  var headers = [
    'ลำดับ',
    'วันที่รับเงิน',
    'เล่มที่',
    'เลขที่ใบเสร็จ',
    'อ้างอิงเลขที่คำร้อง',
    'ชื่อผู้เสียค่าธรรมเนียม',
    'ประเภทโฆษณา',
    'จำนวนเงิน (บาท)',
    'ตัวอักษร',
    'ผู้รับเงิน',
    'สถานะ'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1e3a8a') // น้ำเงินเข้ม การเงิน
             .setFontColor('#ffffff')
             .setFontWeight('bold')
             .setHorizontalAlignment('center');

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);

  SpreadsheetApp.getUi().alert('✅ สำเร็จ: สร้างหัวตารางสมุดคุมใบเสร็จรับเงินเรียบร้อยแล้ว');
}

/**
 * 3. ฟังก์ชันดึงไฟล์ JSON ที่สำรองไว้ใน Google Drive มาลง Sheets อัตโนมัติ
 */
function syncDataFromDrive() {
  var folderName = 'เอกสารคำร้องขออนุญาตใช้เครื่องขยายเสียง เทศบาลตำบลพระซอง';
  var folders = DriveApp.getFoldersByName(folderName);
  
  if (!folders.hasNext()) {
    SpreadsheetApp.getUi().alert('⚠️ ไม่พบโฟลเดอร์: "' + folderName + '" ใน Google Drive');
    return;
  }
  
  var folder = folders.next();
  var files = folder.getFilesByType('application/json');
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('ทะเบียนคุมคำร้อง_ฆษ1');
  if (!sheet) {
    setupSheetHeaders();
    sheet = ss.getSheetByName('ทะเบียนคุมคำร้อง_ฆษ1');
  }

  // เคลียร์ข้อมูลเดิมเก็บเฉพาะหัวตาราง
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  var row = 2;
  var count = 0;

  while (files.hasNext()) {
    var file = files.next();
    try {
      var content = file.getBlob().getDataAsString();
      var app = JSON.parse(content);

      var categoryName = 'ไม่เป็นการค้า (10 บาท)';
      if (app.adDetails && app.adDetails.category === 'COMMERCIAL_MOBILE') {
        categoryName = 'การค้า เคลื่อนที่/รถแห่ (60 บาท)';
      } else if (app.adDetails && app.adDetails.category === 'COMMERCIAL_STATIONARY') {
        categoryName = 'การค้า ประจำที่ (75 บาท)';
      }

      var rowData = [
        count + 1,
        app.submissionDate || '',
        app.referenceNumber || '',
        (app.applicant ? (app.applicant.prefix + app.applicant.fullName) : ''),
        (app.applicant ? app.applicant.idCardNumber : ''),
        (app.applicant ? app.applicant.phone : ''),
        (app.applicant ? ('บ้านเลขที่ ' + app.applicant.houseNumber + ' หมู่ ' + app.applicant.villageNo) : ''),
        categoryName,
        (app.adDetails ? app.adDetails.purpose : ''),
        (app.adDetails ? (app.adDetails.locationDescription || '') : ''),
        (app.equipment ? (app.equipment.vehicleRegistration || app.equipment.amplifierSerial || '-') : ''),
        (app.adDetails ? app.adDetails.startDate : ''),
        (app.adDetails ? app.adDetails.endDate : ''),
        (app.adDetails ? app.adDetails.totalDays : 0),
        (app.adDetails ? app.adDetails.periodsCount : 1),
        (app.fee ? app.fee.totalAmount : 0),
        (app.status === 'PERMIT_ISSUED' ? 'ออกใบอนุญาตแล้ว' : 'รอตรวจสอบ'),
        (app.officerReview ? (app.officerReview.permitNumber || '-') : '-'),
        (app.officerReview ? (app.officerReview.receiptNumber || '-') : '-'),
        (app.officerReview ? (app.officerReview.approverName || 'นางมารศรี ไชยต้นเทือก') : '')
      ];

      sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);
      row++;
      count++;
    } catch (e) {
      Logger.log('เกิดข้อผิดพลาดในการอ่านไฟล์: ' + e.message);
    }
  }

  SpreadsheetApp.getUi().alert('🎉 นำเข้าข้อมูลสำเร็จเรียบร้อยแล้ว รวมทั้งสิ้น ' + count + ' รายการ');
}

/**
 * 4. Webhook API (doPost) - กรณีต้องการส่งข้อมูลจากเว็บแอพมาบันทึกใน Google Sheets แบบ Real-time
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('ทะเบียนคุมคำร้อง_ฆษ1');
    if (!sheet) {
      setupSheetHeaders();
      sheet = ss.getSheetByName('ทะเบียนคุมคำร้อง_ฆษ1');
    }

    var nextRow = sheet.getLastRow() + 1;
    var rowData = [
      nextRow - 1,
      data.submissionDate || new Date().toISOString().split('T')[0],
      data.referenceNumber || '',
      data.applicant ? (data.applicant.prefix + data.applicant.fullName) : '',
      data.applicant ? data.applicant.idCardNumber : '',
      data.applicant ? data.applicant.phone : '',
      data.applicant ? ('บ้านเลขที่ ' + data.applicant.houseNumber + ' หมู่ ' + data.applicant.villageNo) : '',
      data.adDetails ? data.adDetails.category : '',
      data.adDetails ? data.adDetails.purpose : '',
      data.adDetails ? data.adDetails.locationDescription : '',
      data.equipment ? (data.equipment.vehicleRegistration || '-') : '',
      data.adDetails ? data.adDetails.startDate : '',
      data.adDetails ? data.adDetails.endDate : '',
      data.adDetails ? data.adDetails.totalDays : 0,
      data.adDetails ? data.adDetails.periodsCount : 1,
      data.fee ? data.fee.totalAmount : 0,
      data.status || 'PENDING',
      data.officerReview ? (data.officerReview.permitNumber || '-') : '-',
      data.officerReview ? (data.officerReview.receiptNumber || '-') : '-',
      data.officerReview ? (data.officerReview.approverName || 'นางมารศรี ไชยต้นเทือก') : ''
    ];

    sheet.getRange(nextRow, 1, 1, rowData.length).setValues([rowData]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', row: nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const formulaSnippet = `=IFS(
  H2="ไม่เป็นการค้า", CEILING(N2/15, 1) * 10,
  H2="การค้า เคลื่อนที่/รถแห่", CEILING(N2/15, 1) * 60,
  H2="การค้า ประจำที่", CEILING(N2/15, 1) * 75,
  TRUE, 0
)`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-emerald-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-prompt flex items-center gap-2">
                <span>โค้ดสำหรับเขียนใน Google Sheets (Google Apps Script)</span>
              </h2>
              <p className="text-xs text-emerald-200">
                ระบบจัดการคำร้องขออนุญาตใช้เครื่องขยายเสียง | {MUNICIPALITY_INFO.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Setup Instructions */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>วิธีนำโค้ดไปใส่ใน Google Sheets (ทำตาม ๔ ขั้นตอนง่ายๆ)</span>
            </div>
            <ol className="list-decimal pl-5 text-xs text-emerald-950 space-y-1.5 leading-relaxed">
              <li>เปิด <strong>Google Sheets</strong> เปล่าขึ้นมาในเบราว์เซอร์</li>
              <li>ไปที่เมนูบาร์ด้านบน เลือก <strong>ส่วนขยาย (Extensions)</strong> &rarr; <strong>Apps Script</strong></li>
              <li>ลบโค้ดเริ่มต้นออก แล้วคัดลอกโค้ดด้านล่างนี้ไปวางทั้งหมด</li>
              <li>กดปุ่ม <strong>บันทึก (รูปแผ่นดิสก์ หรือ Ctrl + S)</strong> แล้วกลับไปกดรีเฟรชหน้า Google Sheets จะมีเมนูภาษาไทยชื่อ <strong>"🔊 ระบบเทศบาลพระซอง"</strong> ปรากฏขึ้นมาใช้งานได้ทันที</li>
            </ol>
          </div>

          {/* Code Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Code2 className="w-4 h-4 text-emerald-700" />
                <span>Google Apps Script (.gs) — สร้างเมนู, หัวตาราง และซิงค์ข้อมูลจาก Drive</span>
              </div>
              <button
                onClick={() => copyToClipboard(appScriptCode, 'appscript')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                {copiedType === 'appscript' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>คัดลอกสำเร็จ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกโค้ด Apps Script</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
                <code>{appScriptCode}</code>
              </pre>
            </div>
          </div>

          {/* Formula section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>สูตรคำนวณค่าธรรมเนียมใน Google Sheets อัตโนมัติ (ใส่ในช่องคำนวณเงิน)</span>
              </div>
              <button
                onClick={() => copyToClipboard(formulaSnippet, 'formula')}
                className="px-2.5 py-1 text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedType === 'formula' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">คัดลอกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกสูตร</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-blue-900 font-mono overflow-x-auto">
              <code>{formulaSnippet}</code>
            </pre>
            <p className="text-[11px] text-slate-500">
              * คำนวณตามอัตรา พ.ร.บ. คราวละไม่เกิน ๑๕ วัน (ไม่เป็นการค้า ๑๐ บาท, การค้าเคลื่อนที่ ๖๐ บาท, การค้าประจำที่ ๗๕ บาท)
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-600">
            ใช้งานร่วมกับ Google Drive และ Google Sheets ได้ทันที
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
