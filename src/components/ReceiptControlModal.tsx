import React, { useState, useEffect } from 'react';
import { ReceiptBookSettings, ReceiptControlLog } from '../types';
import { 
  getReceiptBookSettings, 
  saveReceiptBookSettings, 
  getReceiptLogs,
  saveReceiptLogs 
} from '../utils/storage';
import { MUNICIPALITY_INFO } from '../utils/constants';
import { formatThaiDate, toThaiDigits, getCategoryShortLabel } from '../utils/thaiDate';
import { 
  X, 
  BookOpen, 
  Receipt, 
  Save, 
  Printer, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Coins
} from 'lucide-react';

interface ReceiptControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const ReceiptControlModal: React.FC<ReceiptControlModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'logs' | 'print_ledger'>('logs');
  const [settings, setSettings] = useState<ReceiptBookSettings>(getReceiptBookSettings());
  const [logs, setLogs] = useState<ReceiptControlLog[]>(getReceiptLogs());
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(getReceiptBookSettings());
      setLogs(getReceiptLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveReceiptBookSettings({
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
    if (onRefreshData) onRefreshData();
  };

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.fullReceiptNo.toLowerCase().includes(term) ||
      log.receiptNumber.toLowerCase().includes(term) ||
      log.applicantName.toLowerCase().includes(term) ||
      log.referenceNumber.toLowerCase().includes(term)
    );
  });

  const totalRevenue = logs
    .filter((l) => l.status === 'ACTIVE')
    .reduce((sum, l) => sum + l.amount, 0);

  const handlePrintLedger = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="no-print bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-emerald-300">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-prompt flex items-center gap-2">
                <span>ระบบคุมใบเสร็จรับเงิน (Receipt Control System)</span>
              </h2>
              <p className="text-xs text-emerald-200">
                ตั้งค่าเล่มใบเสร็จรับเงิน และตรวจสอบสมุดคุมใบเสร็จค่าธรรมเนียม | {MUNICIPALITY_INFO.name}
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

        {/* Navigation Tabs */}
        <div className="no-print bg-slate-100 border-b border-slate-200 p-2 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'logs'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>สมุดคุมใบเสร็จรับเงิน ({logs.length} รายการ)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>ตั้งค่าเล่มใบเสร็จรับเงิน</span>
          </button>

          <button
            onClick={() => setActiveTab('print_ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'print_ledger'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>พิมพ์รายงานทะเบียนคุมใบเสร็จ</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* TAB 1: LOGS / REGISTER */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <div className="text-xs font-semibold text-emerald-800">เล่มใบเสร็จปัจจุบันที่ใช้</div>
                  <div className="text-2xl font-black text-emerald-900 font-prompt mt-1">
                    เล่มที่ {settings.bookNumber}
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    เลขที่ต่อไป: {settings.prefix ? settings.prefix + '-' : ''}{String(settings.currentReceiptNo).padStart(2, '0')}/{settings.yearBE}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                  <div className="text-xs font-semibold text-blue-800">จำนวนใบเสร็จที่ออกแล้ว</div>
                  <div className="text-2xl font-black text-blue-900 font-prompt mt-1">
                    {logs.length} <span className="text-sm font-semibold">ฉบับ</span>
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5">
                    คงเหลือในเล่มนี้: {Math.max(0, settings.endReceiptNo - settings.currentReceiptNo + 1)} ฉบับ
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
                  <div className="text-xs font-semibold text-indigo-800">รวมเงินค่าธรรมเนียมที่จัดเก็บได้</div>
                  <div className="text-2xl font-black text-indigo-900 font-prompt mt-1 flex items-center gap-1">
                    <Coins className="w-5 h-5 text-indigo-600" />
                    <span>{totalRevenue.toLocaleString()}</span>
                    <span className="text-sm font-semibold">บาท</span>
                  </div>
                  <div className="text-[11px] text-indigo-700 mt-0.5">จากระบบออกใบเสร็จรับเงิน</div>
                </div>
              </div>

              {/* Search input */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาตามเลขที่ใบเสร็จ, ชื่อผู้ชำระเงิน, เลขคำร้อง..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="text-xs text-slate-500">
                  แสดง {filteredLogs.length} จาก {logs.length} รายการ
                </div>
              </div>

              {/* Logs Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                {filteredLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Receipt className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-medium">ยังไม่มีข้อมูลการออกใบเสร็จรับเงินในระบบ</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-3 pl-4">วันที่รับเงิน</th>
                        <th className="p-3">เล่มที่ / เลขที่ใบเสร็จ</th>
                        <th className="p-3">อ้างอิงเลขที่คำร้อง</th>
                        <th className="p-3">ชื่อผู้เสียค่าธรรมเนียม</th>
                        <th className="p-3">ประเภทโฆษณา</th>
                        <th className="p-3 text-right">จำนวนเงิน (บาท)</th>
                        <th className="p-3 text-center">ผู้รับเงิน</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="p-3 pl-4 text-slate-600 font-medium whitespace-nowrap">
                            {formatThaiDate(log.paymentDate, { shortMonth: true })}
                          </td>
                          <td className="p-3 font-bold text-slate-900 font-mono whitespace-nowrap">
                            {log.fullReceiptNo}
                          </td>
                          <td className="p-3 text-slate-700 font-mono whitespace-nowrap">
                            {log.referenceNumber}
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {log.applicantName}
                          </td>
                          <td className="p-3 text-slate-600">
                            {getCategoryShortLabel(log.category)}
                          </td>
                          <td className="p-3 text-right font-black text-emerald-800 font-prompt whitespace-nowrap">
                            {log.amount.toLocaleString()} บ.
                          </td>
                          <td className="p-3 text-center text-slate-500 text-[11px] whitespace-nowrap">
                            {log.cashierName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SETTINGS FORM */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-6">
              
              {isSavedSuccess && (
                <div className="p-4 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-300 flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>บันทึกการตั้งค่าเล่มใบเสร็จรับเงินเรียบร้อยแล้ว</span>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>รายละเอียดเล่มใบเสร็จรับเงินที่เปิดใช้งาน</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      เล่มที่ (Book Number) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.bookNumber}
                      onChange={(e) => setSettings({ ...settings, bookNumber: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                      placeholder="เช่น 1 หรือ 01"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">ระบุเลขเล่มใบเสร็จรับเงิน</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ปี พ.ศ. *
                    </label>
                    <input
                      type="number"
                      required
                      value={settings.yearBE}
                      onChange={(e) => setSettings({ ...settings, yearBE: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      คำนำหน้าเลขที่ (Prefix)
                    </label>
                    <input
                      type="text"
                      value={settings.prefix}
                      onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                      placeholder="เช่น บส."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ผู้รับเงินประจำ (Default Cashier)
                    </label>
                    <input
                      type="text"
                      value={settings.cashierName}
                      onChange={(e) => setSettings({ ...settings, cashierName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      เลขที่เริ่มต้น (Start Receipt No.)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={settings.startReceiptNo}
                      onChange={(e) => setSettings({ ...settings, startReceiptNo: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      เลขที่ปัจจุบัน (Current Active No.) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={settings.currentReceiptNo}
                      onChange={(e) => setSettings({ ...settings, currentReceiptNo: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-emerald-500 ring-2 ring-emerald-200 rounded-xl text-sm font-bold text-emerald-900"
                    />
                    <p className="text-[11px] text-emerald-700 mt-1">ใบเสร็จถัดไปที่จะถูกออกในระบบ</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      เลขที่สิ้นสุดเล่ม (End Receipt No.)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={settings.endReceiptNo}
                      onChange={(e) => setSettings({ ...settings, endReceiptNo: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">ปกติ 50 ใบต่อเล่ม</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      หมายเหตุการตั้งค่า
                    </label>
                    <input
                      type="text"
                      value={settings.notes || ''}
                      onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                      placeholder="เช่น เล่มใบเสร็จรับเงินประจำปีงบประมาณ 2569"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกการตั้งค่าเล่มใบเสร็จ</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: PRINTABLE LEDGER REPORT */}
          {activeTab === 'print_ledger' && (
            <div className="space-y-4">
              <div className="no-print flex justify-end mb-4">
                <button
                  onClick={handlePrintLedger}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์ทะเบียนคุมใบเสร็จรับเงิน (Print / PDF)</span>
                </button>
              </div>

              {/* Formal Ledger Document View */}
              <div className="gov-doc bg-white text-black p-8 max-w-[210mm] mx-auto border border-gray-300 font-sarabun print:border-none print:p-0">
                
                <div className="text-center space-y-1 mb-6">
                  <h2 className="text-xl font-bold font-sarabun">
                    สมุดทะเบียนคุมใบเสร็จรับเงินค่าธรรมเนียมการใช้เครื่องขยายเสียง
                  </h2>
                  <div className="text-sm font-semibold text-gray-700">
                    {MUNICIPALITY_INFO.name} {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}
                  </div>
                  <div className="text-xs text-gray-500">
                    ประจำปี พ.ศ. {settings.yearBE} | เล่มที่ {settings.bookNumber}
                  </div>
                </div>

                <table className="w-full border-collapse border border-black text-xs text-center">
                  <thead>
                    <tr className="bg-gray-100 font-bold border-b border-black">
                      <th className="border border-black p-2 w-12">ลำดับ</th>
                      <th className="border border-black p-2 w-24">วันที่</th>
                      <th className="border border-black p-2 w-32">เล่มที่/เลขที่</th>
                      <th className="border border-black p-2 w-28">เลขที่คำร้อง</th>
                      <th className="border border-black p-2 text-left">ชื่อผู้ชำระเงิน</th>
                      <th className="border border-black p-2 text-right w-24">จำนวนเงิน (บาท)</th>
                      <th className="border border-black p-2 w-24">ผู้รับเงิน</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="border border-black p-6 text-gray-400 text-center">
                          ยังไม่มีรายการออกใบเสร็จ
                        </td>
                      </tr>
                    ) : (
                      logs.map((item, idx) => (
                        <tr key={item.id} className="border-b border-black">
                          <td className="border border-black p-1.5">{toThaiDigits(idx + 1)}</td>
                          <td className="border border-black p-1.5">{formatThaiDate(item.paymentDate, { shortMonth: true })}</td>
                          <td className="border border-black p-1.5 font-bold">{item.fullReceiptNo}</td>
                          <td className="border border-black p-1.5">{item.referenceNumber}</td>
                          <td className="border border-black p-1.5 text-left font-medium">{item.applicantName}</td>
                          <td className="border border-black p-1.5 text-right font-bold">{item.amount.toLocaleString()}</td>
                          <td className="border border-black p-1.5 text-xs">{item.cashierName}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {logs.length > 0 && (
                    <tfoot>
                      <tr className="font-bold bg-gray-50 border-t-2 border-black">
                        <td colSpan={5} className="border border-black p-2 text-right">
                          รวมเงินค่าธรรมเนียมจัดเก็บได้ทั้งสิ้น:
                        </td>
                        <td className="border border-black p-2 text-right font-black text-sm">
                          {totalRevenue.toLocaleString()}
                        </td>
                        <td className="border border-black p-2">บาท</td>
                      </tr>
                    </tfoot>
                  )}
                </table>

                {/* Ledger Signatures */}
                <div className="mt-12 flex justify-between items-center text-xs text-center pt-6">
                  <div>
                    <div>(ลงชื่อ)......................................................ผู้คุมทะเบียน</div>
                    <div className="mt-1">( {settings.cashierName} )</div>
                    <div className="text-gray-500 mt-0.5">พนักงานเจ้าหน้าที่การเงิน</div>
                  </div>

                  <div>
                    <div>(ลงชื่อ)......................................................ผู้ตรวจสอบ</div>
                    <div className="mt-1">( {MUNICIPALITY_INFO.approverNameDefault} )</div>
                    <div className="text-gray-500 mt-0.5">{MUNICIPALITY_INFO.approverTitleDefault}</div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="no-print bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            เล่มที่กำลังใช้งาน: <strong className="text-slate-800">เล่มที่ {settings.bookNumber}</strong> | เลขที่ถัดไป: <strong className="text-emerald-700 font-mono">{settings.currentReceiptNo}</strong>
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
