import React, { useState, useEffect } from 'react';
import { SoundPermitApplication } from './types';
import { getApplications } from './utils/storage';
import { MUNICIPALITY_INFO } from './utils/constants';
import { Navbar, MainTab } from './components/Navbar';
import { CitizenForm } from './components/CitizenForm';
import { OfficerDashboard } from './components/OfficerDashboard';
import { StatusTracker } from './components/StatusTracker';
import { PrintCenter } from './components/PrintCenter';
import { FeeCalculatorModal } from './components/FeeCalculatorModal';
import { LawGuideModal } from './components/LawGuideModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, Phone, MapPin, Clock } from 'lucide-react';

export default function App() {
  const [applications, setApplications] = useState<SoundPermitApplication[]>([]);
  const [activeTab, setActiveTab] = useState<MainTab>('form');
  const [selectedAppForPrint, setSelectedAppForPrint] = useState<SoundPermitApplication | null>(null);
  const [printTab, setPrintTab] = useState<'ks1' | 'ks2' | 'receipt' | 'placard' | 'blank_ks1'>('ks1');
  
  // Modals
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  
  // Success banner after submission
  const [submittedApp, setSubmittedApp] = useState<SoundPermitApplication | null>(null);

  const loadData = () => {
    const list = getApplications();
    setApplications(list);
    if (!selectedAppForPrint && list.length > 0) {
      setSelectedAppForPrint(list[0]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSuccess = (newApp: SoundPermitApplication) => {
    loadData();
    setSubmittedApp(newApp);
    setSelectedAppForPrint(newApp);
  };

  const handleSelectAppForPrint = (app: SoundPermitApplication, viewTab: 'ks1' | 'ks2' | 'receipt' | 'placard') => {
    setSelectedAppForPrint(app);
    setPrintTab(viewTab);
    setActiveTab('print');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = applications.filter(
    (a) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          setSubmittedApp(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDrive={() => setIsDriveOpen(true)}
        pendingCount={pendingCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        
        {/* Success Modal / Banner after citizen submission */}
        {submittedApp && activeTab === 'form' && (
          <div className="mb-6 p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl shadow-lg border border-emerald-700 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 mt-0.5">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-400/20 text-emerald-200 mb-1">
                    ยื่นคำร้องสำเร็จแล้ว
                  </div>
                  <h3 className="text-xl font-bold font-prompt">
                    บันทึกคำร้องแบบ ฆ.ษ. ๑ เลขที่: {submittedApp.referenceNumber}
                  </h3>
                  <p className="text-xs text-emerald-200 mt-1">
                    ผู้ยื่น: {submittedApp.applicant.prefix}{submittedApp.applicant.fullName} | ค่าธรรมเนียม: {submittedApp.fee.totalAmount} บาท ({submittedApp.fee.amountText})
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSelectAppForPrint(submittedApp, 'ks1')}
                  className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-emerald-700" />
                  <span>พิมพ์แบบ ฆ.ษ. ๑ (PDF)</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tracking');
                    setSubmittedApp(null);
                  }}
                  className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold border border-emerald-600 transition-all flex items-center gap-1.5"
                >
                  <span>ติดตามสถานะ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Citizen Application Form */}
        {activeTab === 'form' && (
          <CitizenForm
            onSuccess={handleFormSuccess}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}

        {/* Tab 2: Status Tracker */}
        {activeTab === 'tracking' && (
          <StatusTracker
            applications={applications}
            onSelectApplication={handleSelectAppForPrint}
          />
        )}

        {/* Tab 3: Officer Portal */}
        {activeTab === 'officer' && (
          <OfficerDashboard
            applications={applications}
            onRefresh={loadData}
            onSelectApplication={handleSelectAppForPrint}
            onAddNewApplication={() => {
              setActiveTab('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tab 4: Print Center */}
        {activeTab === 'print' && selectedAppForPrint && (
          <PrintCenter
            applications={applications}
            selectedApp={selectedAppForPrint}
            initialTab={printTab}
            onBack={() => setActiveTab('form')}
            onSelectApp={(app) => setSelectedAppForPrint(app)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <img
                  src={MUNICIPALITY_INFO.logoUrl}
                  alt="ตราเทศบาลตำบลพระซอง"
                  className="w-11 h-11 object-cover rounded-full bg-white p-0.5 border border-amber-500"
                />
                <div>
                  <div className="text-white font-bold text-sm font-prompt">
                    {MUNICIPALITY_INFO.name}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 font-medium pt-1">
                นายกเทศมนตรีตำบลพระซอง: <strong className="text-amber-400">{MUNICIPALITY_INFO.approverNameDefault}</strong> ({MUNICIPALITY_INFO.approverRoleNote})
              </p>
              <p className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>วันจันทร์ - ศุกร์ เวลา ๐๘.๓๐ - ๑๖.๓๐ น.</span>
              </p>
            </div>

            <div>
              <div className="text-white font-bold text-sm mb-2 font-prompt">
                อัตราค่าธรรมเนียมตามกฎหมาย (ไม่เกิน ๑๕ วัน/คราว)
              </div>
              <ul className="space-y-1 text-slate-400">
                <li>๑) โฆษณาที่ไม่เป็นไปในทำนองการค้า: <span className="text-emerald-400 font-bold">๑๐ บาท</span></li>
                <li>๒) โฆษณาที่เป็นไปในทำนองการค้า (เคลื่อนที่/รถแห่): <span className="text-blue-400 font-bold">๖๐ บาท</span></li>
                <li>๓) โฆษณาที่เป็นไปในทำนองการค้า (ประจำที่): <span className="text-purple-400 font-bold">๗๕ บาท</span></li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold text-sm mb-2 font-prompt">
                มาตรฐานและการคุ้มครองประชาชน
              </div>
              <p className="leading-relaxed text-slate-400">
                ตาม พ.ร.บ. ควบคุมการโฆษณาโดยใช้เครื่องขยายเสียง พ.ศ. ๒๔๙๓ ระดับเสียงสูงสุดไม่เกิน ๘๕ เดซิเบลเอ ณ ระยะ ๑๕ เมตร และต้องใช้เสียงเฉพาะช่วงเวลาที่ได้รับอนุญาตเท่านั้น
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              © 2569 {MUNICIPALITY_INFO.name} อำเภอนาแก จังหวัดนครพนม. สงวนลิขสิทธิ์ตามกฎหมาย.
            </div>
            <div className="flex items-center space-x-3">
              <span>แบบฟอร์มราชการ แบบ ฆ.ษ. ๑ & แบบ ฆ.ษ. ๒</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <FeeCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <LawGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <GoogleDriveModal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        applications={applications}
      />

    </div>
  );
}
