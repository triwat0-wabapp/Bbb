import React from 'react';
import { FileText, Search, Shield, Printer, Calculator, BookOpen, Volume2 } from 'lucide-react';
import { MUNICIPALITY_INFO } from '../utils/constants';

export type MainTab = 'form' | 'tracking' | 'officer' | 'print';

interface NavbarProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  onOpenCalculator: () => void;
  onOpenGuide: () => void;
  onOpenDrive?: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  onOpenCalculator,
  onOpenGuide,
  onOpenDrive,
  pendingCount = 0,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top micro-bar with municipality motto / official title */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-blue-900 text-white text-[11px] py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold tracking-wider">{MUNICIPALITY_INFO.name} {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}</span>
            <span className="hidden sm:inline text-emerald-200">|</span>
            <span className="hidden sm:inline text-emerald-100">ศูนย์บริการประชาชนแบบเบ็ดเสร็จ (One Stop Service E-Service)</span>
          </div>
          <div className="flex items-center space-x-3 text-emerald-100">
            <span>พ.ร.บ. ควบคุมการโฆษณาโดยใช้เครื่องขยายเสียง พ.ศ. ๒๔๙๓</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Municipal Emblem */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onChangeTab('form')}>
            <div className="w-13 h-13 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 shadow-md flex items-center justify-center shrink-0">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาลตำบลพระซอง"
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold font-prompt text-slate-900 leading-tight">
                  ระบบขออนุญาตใช้เครื่องขยายเสียง
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  แบบ ฆ.ษ. ๑
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {MUNICIPALITY_INFO.name} อำเภอนาแก จังหวัดนครพนม
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => onChangeTab('form')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'form'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>ยื่นคำร้อง (ฆ.ษ. ๑)</span>
            </button>

            <button
              onClick={() => onChangeTab('tracking')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'tracking'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4 text-blue-600" />
              <span>ติดตามสถานะ</span>
            </button>

            <button
              onClick={() => onChangeTab('print')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'print'
                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Printer className="w-4 h-4 text-purple-600" />
              <span>พิมพ์เอกสารราชการ</span>
            </button>

            <button
              onClick={() => onChangeTab('officer')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 relative transition-colors ${
                activeTab === 'officer'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>พนักงานเจ้าหน้าที่</span>
              {pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center -ml-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right tool buttons */}
          <div className="flex items-center space-x-2">
            {onOpenDrive && (
              <button
                onClick={onOpenDrive}
                className="p-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold border border-indigo-200"
                title="จัดการและสำรองข้อมูลใน Google Drive"
              >
                <span className="w-4 h-4 shrink-0 inline-block">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                </span>
                <span className="hidden sm:inline">Google Drive</span>
              </button>
            )}

            <button
              onClick={onOpenCalculator}
              className="p-2 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
              title="เครื่องคำนวณค่าธรรมเนียม"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">คำนวณค่าธรรมเนียม</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="p-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
              title="ข้อบังคับและกฎหมาย"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">คู่มือกฎหมาย</span>
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 space-x-1.5 border-t border-slate-100 text-xs">
          <button
            onClick={() => onChangeTab('form')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'form' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            ยื่นคำร้อง (ฆ.ษ. ๑)
          </button>
          <button
            onClick={() => onChangeTab('tracking')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'tracking' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            ติดตามสถานะ
          </button>
          <button
            onClick={() => onChangeTab('print')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'print' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            พิมพ์เอกสาร
          </button>
          <button
            onClick={() => onChangeTab('officer')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1 ${
              activeTab === 'officer' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span>เจ้าหน้าที่</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[10px] rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
