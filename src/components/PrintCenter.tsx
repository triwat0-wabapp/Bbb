import React, { useState } from 'react';
import { SoundPermitApplication } from '../types';
import { FormKS1 } from './PrintForms/FormKS1';
import { PermitKS2 } from './PrintForms/PermitKS2';
import { ReceiptPrint } from './PrintForms/ReceiptPrint';
import { MUNICIPALITY_INFO } from '../utils/constants';
import { Printer, ArrowLeft, FileText, Award, Receipt, Truck, Download, Check } from 'lucide-react';

export type PrintTabType = 'ks1' | 'ks2' | 'ks2_back' | 'ks2_both' | 'receipt' | 'placard' | 'blank_ks1';

interface PrintCenterProps {
  applications: SoundPermitApplication[];
  selectedApp: SoundPermitApplication;
  initialTab?: PrintTabType;
  onBack: () => void;
  onSelectApp: (app: SoundPermitApplication) => void;
}

export const PrintCenter: React.FC<PrintCenterProps> = ({
  applications,
  selectedApp,
  initialTab = 'ks1',
  onBack,
  onSelectApp,
}) => {
  const [activeTab, setActiveTab] = useState<PrintTabType>(initialTab);
  const [currentApp, setCurrentApp] = useState<SoundPermitApplication>(selectedApp);

  const handlePrint = () => {
    window.print();
  };

  const handleAppChange = (id: string) => {
    const found = applications.find((a) => a.id === id);
    if (found) {
      setCurrentApp(found);
      onSelectApp(found);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar - Hidden during printing */}
      <div className="no-print bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-11 h-11 rounded-full overflow-hidden p-0.5 bg-white border border-amber-400 shrink-0 shadow-2xs">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาล"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 font-prompt">
                ศูนย์พิมพ์เอกสารราชการ ({MUNICIPALITY_INFO.name})
              </h1>
              <p className="text-xs text-slate-500">
                เอกสารคำร้องแบบ ฆ.ษ. ๑, ใบอนุญาต ฆ.ษ. ๒ (หน้า-หลัง), ใบเสร็จรับเงิน, และป้ายประจำรถแห่
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Choose application dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">เลือกคำร้อง:</span>
              <select
                value={currentApp.id}
                onChange={(e) => handleAppChange(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.referenceNumber} - {app.applicant.fullName} ({app.fee.totalAmount} บ.)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white rounded-xl text-xs md:text-sm font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสารนี้ (Print / PDF)</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setActiveTab('ks1')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'ks1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>แบบ ฆ.ษ. ๑ (คำร้อง ๒ หน้า)</span>
          </button>

          <button
            onClick={() => setActiveTab('ks2')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'ks2'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>ใบอนุญาต ฆ.ษ. ๒ (หน้า ๑)</span>
          </button>

          <button
            onClick={() => setActiveTab('ks2_back')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'ks2_back'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>ด้านหลังใบอนุญาต (ฆ.ษ. ๒ หลัง)</span>
          </button>

          <button
            onClick={() => setActiveTab('ks2_both')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'ks2_both'
                ? 'bg-violet-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>ใบอนุญาต (พิมพ์ ๒ หน้า หน้า-หลัง)</span>
          </button>

          <button
            onClick={() => setActiveTab('receipt')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'receipt'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>ใบเสร็จรับเงินค่าธรรมเนียม</span>
          </button>

          <button
            onClick={() => setActiveTab('placard')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'placard'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>ป้ายอนุญาตติดหน้ารถแห่/สถานที่</span>
          </button>

          <button
            onClick={() => setActiveTab('blank_ks1')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'blank_ks1'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>พิมพ์แบบฟอร์ม ฆ.ษ. ๑ เปล่า</span>
          </button>

          <a
            href="/assets/aistudio/VGMzBGiMon23253_4ffa9cfd.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all ml-auto"
            title="เปิดไฟล์ PDF ต้นฉบับที่แนบมา"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ไฟล์ PDF ต้นฉบับ (๒ หน้า)</span>
          </a>
        </div>

        {/* Print Help Tip */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
          <span>💡 <strong>คำแนะนำในการพิมพ์:</strong> ในหน้าต่างสั่งพิมพ์ (Print Dialog) เลือกขนาดกระดาษ <strong>A4</strong> และตั้งค่าระยะขอบ (Margins) เป็น "Default" หรือ "Minimum" เพื่อความพอดีหน้า</span>
        </div>
      </div>

      {/* Printable Sheet Viewport */}
      <div className="print-container overflow-x-auto pb-12">
        {activeTab === 'ks1' && <FormKS1 application={currentApp} mode="filled" />}
        {activeTab === 'blank_ks1' && <FormKS1 application={currentApp} mode="blank" />}
        {activeTab === 'ks2' && <PermitKS2 application={currentApp} mode="full_certificate" subMode="front" />}
        {activeTab === 'ks2_back' && <PermitKS2 application={currentApp} mode="full_certificate" subMode="back" />}
        {activeTab === 'ks2_both' && <PermitKS2 application={currentApp} mode="full_certificate" subMode="both" />}
        {activeTab === 'receipt' && <ReceiptPrint application={currentApp} />}
        {activeTab === 'placard' && <PermitKS2 application={currentApp} mode="vehicle_placard" />}
      </div>

    </div>
  );
};

