import React, { useState } from 'react';
import { SoundPermitApplication } from '../types';
import { formatThaiDate, getCategoryLabel } from '../utils/thaiDate';
import { MUNICIPALITY_INFO } from '../utils/constants';
import { Search, CheckCircle, Clock, FileText, Printer, Award, AlertCircle, ArrowRight } from 'lucide-react';

interface StatusTrackerProps {
  applications: SoundPermitApplication[];
  onSelectApplication: (app: SoundPermitApplication, viewTab: 'ks1' | 'ks2' | 'receipt' | 'placard') => void;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  applications,
  onSelectApplication,
}) => {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const trimmed = query.trim().toLowerCase();
  const results = applications.filter((app) => {
    if (!trimmed) return false;
    return (
      app.referenceNumber.toLowerCase().includes(trimmed) ||
      app.applicant.fullName.toLowerCase().includes(trimmed) ||
      app.applicant.idCardNumber.includes(trimmed) ||
      app.applicant.phone.includes(trimmed) ||
      (app.officerReview?.permitNumber && app.officerReview.permitNumber.toLowerCase().includes(trimmed))
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Search Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md mx-auto">
          <img
            src={MUNICIPALITY_INFO.logoUrl}
            alt="ตราเทศบาลตำบลพระซอง"
            className="w-full h-full object-cover rounded-full bg-white"
          />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-prompt">
            ตรวจสอบสถานะคำร้องขออนุญาตใช้เครื่องขยายเสียง
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {MUNICIPALITY_INFO.name} {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province}
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            placeholder="เช่น ฆ.ษ.๑-๐๑/๒๕๖๙ หรือ ประเสริฐ"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearched(false);
            }}
            className="flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>ค้นหา</span>
          </button>
        </form>

        {/* Quick Click Hints */}
        <div className="pt-2">
          <span className="text-xs text-slate-400 mr-2">ตัวอย่างคำค้น:</span>
          <div className="inline-flex flex-wrap gap-1.5 justify-center mt-1">
            {applications.slice(0, 3).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setQuery(a.referenceNumber);
                  setSearched(true);
                }}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono transition-colors"
              >
                {a.referenceNumber} ({a.applicant.fullName})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium">ไม่พบข้อมูลคำร้องที่ตรงกับคำค้นหา "{query}"</p>
              <p className="text-xs text-slate-400">กรุณาตรวจสอบเลขที่คำร้อง หรือชื่อ-นามสกุลอีกครั้ง</p>
            </div>
          ) : (
            results.map((app) => {
              const isIssued = app.status === 'PERMIT_ISSUED';
              const isApproved = app.status === 'APPROVED';

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">เลขที่คำร้องแบบ ฆ.ษ. ๑</div>
                      <div className="text-lg font-bold text-slate-900 font-mono">{app.referenceNumber}</div>
                    </div>

                    <div>
                      {isIssued && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>ออกใบอนุญาตแล้ว (แบบ ฆ.ษ. ๒)</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                          <span>อนุมัติแล้ว (รอชำระเงิน/รับใบอนุญาต)</span>
                        </span>
                      )}
                      {!isIssued && !isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>อยู่ระหว่างการตรวจสอบ</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-slate-400">ผู้ยื่นคำร้อง:</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {app.applicant.prefix}{app.applicant.fullName}
                      </div>
                      <div className="text-slate-500">โทร: {app.applicant.phone}</div>
                      <div className="text-slate-500">
                        ที่อยู่: {app.applicant.houseNumber} หมู่ {app.applicant.villageNo} ต.{app.applicant.subdistrict} อ.{app.applicant.district}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400">ประเภทและค่าธรรมเนียม:</div>
                      <div className="font-semibold text-slate-800 mt-0.5">
                        {getCategoryLabel(app.adDetails.category)}
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        ระยะเวลา {app.adDetails.totalDays} วัน ({app.adDetails.periodsCount} คราว)
                      </div>
                      <div className="text-emerald-700 font-bold text-sm mt-1">
                        ค่าธรรมเนียม: {app.fee.totalAmount} บาท ({app.fee.amountText})
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">วัตถุประสงค์ / กิจการ: </span>
                    <span>{app.adDetails.purpose}</span>
                    <div className="text-slate-500 mt-1">
                      <strong>สถานที่ / เส้นทาง:</strong> {app.adDetails.locationDescription}
                    </div>
                  </div>

                  {/* Permit info if issued */}
                  {app.officerReview?.permitNumber && (
                    <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-emerald-950 text-sm">
                          เลขที่ใบอนุญาต: {app.officerReview.permitNumber}
                        </div>
                        <div className="text-emerald-800 mt-0.5">
                          ออกให้เมื่อ: {formatThaiDate(app.officerReview.paymentDate || app.submissionDate)} | ใบเสร็จรับเงินเลขที่: {app.officerReview.receiptNumber || '-'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectApplication(app, 'ks2')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>ดูใบอนุญาต</span>
                        </button>
                        <button
                          onClick={() => onSelectApplication(app, 'placard')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>พิมพ์ป้ายรถ</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick Links */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onSelectApplication(app, 'ks1')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>พิมพ์แบบคำร้อง ฆ.ษ. ๑</span>
                    </button>
                    {isIssued && (
                      <button
                        onClick={() => onSelectApplication(app, 'receipt')}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>ใบเสร็จรับเงิน</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
};
