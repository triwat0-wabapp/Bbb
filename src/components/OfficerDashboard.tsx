import React, { useState } from 'react';
import { SoundPermitApplication, ApplicationStatus, FeeCategory } from '../types';
import { MUNICIPALITY_INFO } from '../utils/constants';
import { formatThaiDate, getCategoryShortLabel, toThaiDigits } from '../utils/thaiDate';
import { generateNextPermitNumber, saveApplication, deleteApplication, resetToDefaults, issueNextReceipt } from '../utils/storage';
import { EditApplicationModal } from './EditApplicationModal';
import { ReceiptControlModal } from './ReceiptControlModal';
import { 
  Shield, 
  Search, 
  Filter, 
  FileCheck, 
  Printer, 
  CheckCircle, 
  Clock, 
  RotateCcw,
  Award,
  Receipt,
  Truck,
  Building,
  HeartHandshake,
  Pencil,
  Trash2,
  PlusCircle,
  UserCheck
} from 'lucide-react';

interface OfficerDashboardProps {
  applications: SoundPermitApplication[];
  onRefresh: () => void;
  onSelectApplication: (app: SoundPermitApplication, viewTab: 'ks1' | 'ks2' | 'receipt' | 'placard') => void;
  onAddNewApplication: () => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  applications,
  onRefresh,
  onSelectApplication,
  onAddNewApplication,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // Application editing modal state
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<SoundPermitApplication | null>(null);
  const [isReceiptControlOpen, setIsReceiptControlOpen] = useState(false);

  // Filtered list
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.adDetails.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.officerReview?.permitNumber || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesCat = categoryFilter === 'ALL' || app.adDetails.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  // Financial Stats
  const totalCollected = applications
    .filter((a) => a.status === 'PERMIT_ISSUED')
    .reduce((sum, a) => sum + (a.fee?.totalAmount || 0), 0);

  const pendingCount = applications.filter((a) => a.status === 'PENDING' || a.status === 'UNDER_REVIEW').length;
  const issuedCount = applications.filter((a) => a.status === 'PERMIT_ISSUED').length;

  const handleFastApproveAndIssue = (app: SoundPermitApplication) => {
    const nextP = generateNextPermitNumber();
    const today = new Date().toISOString().split('T')[0];
    const receiptInfo = issueNextReceipt(app);
    
    const updated: SoundPermitApplication = {
      ...app,
      status: 'PERMIT_ISSUED',
      officerReview: {
        inspectorName: app.officerReview?.inspectorName || MUNICIPALITY_INFO.inspectorNameDefault,
        inspectorPosition: app.officerReview?.inspectorPosition || MUNICIPALITY_INFO.officerTitleDefault,
        inspectionDate: app.officerReview?.inspectionDate || today,
        inspectionComment: app.officerReview?.inspectionComment || 'ตรวจสอบเอกสารถูกต้อง สภาพเครื่องเสียงเป็นไปตามมาตรฐาน 85 dB',
        isNoiseCompliant: true,
        isTimeSlotCompliant: true,
        isLocationCompliant: true,
        officerOrder: 'APPROVED',
        officerOrderDetails: 'อนุญาตตามระเบียบ พ.ร.บ. ควบคุมการโฆษณาโดยใช้เครื่องขยายเสียง พ.ศ. ๒๔๙๓',
        approverName: app.officerReview?.approverName || MUNICIPALITY_INFO.approverNameDefault,
        approverPosition: app.officerReview?.approverPosition || MUNICIPALITY_INFO.approverTitleDefault,
        approverDate: today,
        permitNumber: app.officerReview?.permitNumber || nextP.permitNumber,
        permitBookNumber: app.officerReview?.permitBookNumber || receiptInfo.receiptBookNumber,
        receiptNumber: app.officerReview?.receiptNumber || receiptInfo.receiptNumber,
        cashierName: app.officerReview?.cashierName || MUNICIPALITY_INFO.cashierNameDefault,
        officerIssuerName: app.officerReview?.officerIssuerName || MUNICIPALITY_INFO.inspectorNameDefault,
        paymentDate: today,
      },
    };

    saveApplication(updated);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบคำร้องนี้?')) {
      deleteApplication(id);
      setSelectedAppForEdit(null);
      onRefresh();
    }
  };

  const handleSaveAppEdit = (updatedApp: SoundPermitApplication) => {
    saveApplication(updatedApp);
    setSelectedAppForEdit(null);
    onRefresh();
  };

  const handleResetData = () => {
    if (confirm('ต้องการคืนค่าข้อมูลตัวอย่างตั้งต้นหรือไม่?')) {
      resetToDefaults();
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 to-orange-500 shadow-md shrink-0">
              <img
                src={MUNICIPALITY_INFO.logoUrl}
                alt="ตราเทศบาลตำบลพระซอง"
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                <Shield className="w-3.5 h-3.5" />
                <span>พนักงานเจ้าหน้าที่ & ศูนย์บริหารจัดการคำร้อง</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-prompt">
                ระบบจัดการคำร้อง ขออนุญาตใช้เครื่องขยายเสียง (ฆ.ษ. ๑ & ๒)
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-medium">
                {MUNICIPALITY_INFO.name} {MUNICIPALITY_INFO.district} {MUNICIPALITY_INFO.province} | ผู้ออกใบอนุญาต: <strong className="text-slate-900 font-bold">{MUNICIPALITY_INFO.approverNameDefault} ({MUNICIPALITY_INFO.approverTitleDefault})</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReceiptControlOpen(true)}
              className="px-3.5 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
              title="ตั้งค่าเล่มใบเสร็จและดูสมุดคุมใบเสร็จรับเงิน"
            >
              <Receipt className="w-4 h-4 text-emerald-700" />
              <span>ระบบคุมใบเสร็จ</span>
            </button>

            <button
              onClick={onAddNewApplication}
              className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มคำร้องใหม่</span>
            </button>

            <button
              onClick={handleResetData}
              className="px-3 py-2.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
              title="รีเซ็ตข้อมูลตัวอย่าง"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>คืนค่าตัวอย่าง</span>
            </button>
          </div>
        </div>


        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500">คำร้องทั้งหมดในระบบ</div>
            <div className="text-2xl font-black text-slate-800 font-prompt mt-1">
              {applications.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">แบบ ฆ.ษ. ๑</div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="text-xs font-semibold text-amber-800">รอตรวจสอบ/ดำเนินการ</div>
            <div className="text-2xl font-black text-amber-700 font-prompt mt-1">
              {pendingCount}
            </div>
            <div className="text-[11px] text-amber-600 mt-0.5">คำร้องรอตรวจ</div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div className="text-xs font-semibold text-emerald-800">ออกใบอนุญาตแล้ว (ฆ.ษ. ๒)</div>
            <div className="text-2xl font-black text-emerald-700 font-prompt mt-1">
              {issuedCount}
            </div>
            <div className="text-[11px] text-emerald-600 mt-0.5">พร้อมใบเสร็จรับเงิน</div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <div className="text-xs font-semibold text-indigo-800">ค่าธรรมเนียมจัดเก็บได้</div>
            <div className="text-2xl font-black text-indigo-700 font-prompt mt-1">
              {totalCollected.toLocaleString()} <span className="text-sm font-semibold">บ.</span>
            </div>
            <div className="text-[11px] text-indigo-600 mt-0.5">ยอดเงินรวม</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, เลขที่คำร้อง, เลขใบอนุญาต..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>สถานะ:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
          >
            <option value="ALL">ทุกสถานะ ({applications.length})</option>
            <option value="PENDING">รอยื่น/รอตรวจ</option>
            <option value="UNDER_REVIEW">อยู่ระหว่างตรวจ</option>
            <option value="APPROVED">อนุมัติแล้ว</option>
            <option value="PERMIT_ISSUED">ออกใบอนุญาตแล้ว</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
          >
            <option value="ALL">ทุกประเภทโฆษณา</option>
            <option value="NON_COMMERCIAL">ไม่เป็นการค้า (10 บ.)</option>
            <option value="COMMERCIAL_MOBILE">การค้าเคลื่อนที่/รถแห่ (60 บ.)</option>
            <option value="COMMERCIAL_STATIONARY">การค้าประจำที่ (75 บ.)</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FileCheck className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">ไม่พบคำร้องที่ตรงกับเงื่อนไขการค้นหา</p>
            <button
              onClick={onAddNewApplication}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มคำร้องใหม่ตอนนี้</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3.5 pl-5">เลขที่คำร้อง / วันที่ยื่น</th>
                  <th className="p-3.5">ผู้ยื่นคำร้อง / เบอร์โทร</th>
                  <th className="p-3.5">ประเภทโฆษณา / วัตถุประสงค์</th>
                  <th className="p-3.5">ระยะเวลา / คราว</th>
                  <th className="p-3.5 text-right">ค่าธรรมเนียม</th>
                  <th className="p-3.5 text-center">สถานะ</th>
                  <th className="p-3.5 pr-5 text-center">การจัดการ (แก้ไข/ลบ/พิมพ์)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isPermitIssued = app.status === 'PERMIT_ISSUED';
                  const isApproved = app.status === 'APPROVED';
                  const isPending = app.status === 'PENDING' || app.status === 'UNDER_REVIEW';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Ref & Date */}
                      <td className="p-3.5 pl-5 align-top">
                        <div className="font-bold text-slate-900 text-sm font-mono">{app.referenceNumber}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          ยื่น: {formatThaiDate(app.submissionDate, { shortMonth: true })}
                        </div>
                        {app.officerReview?.permitNumber && (
                          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span>ใบอนุญาต: {app.officerReview.permitNumber}</span>
                          </div>
                        )}
                      </td>

                      {/* Applicant */}
                      <td className="p-3.5 align-top">
                        <div className="font-semibold text-slate-800 text-sm">
                          {app.applicant.prefix}{app.applicant.fullName}
                        </div>
                        <div className="text-slate-500 mt-0.5">โทร: {app.applicant.phone}</div>
                        <div className="text-slate-400 text-[11px]">
                          บ้านเลขที่ {app.applicant.houseNumber} หมู่ {app.applicant.villageNo}
                        </div>
                      </td>

                      {/* Ad Details */}
                      <td className="p-3.5 align-top max-w-xs">
                        <div className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          {app.adDetails.category === 'NON_COMMERCIAL' && <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />}
                          {app.adDetails.category === 'COMMERCIAL_MOBILE' && <Truck className="w-3.5 h-3.5 text-blue-600" />}
                          {app.adDetails.category === 'COMMERCIAL_STATIONARY' && <Building className="w-3.5 h-3.5 text-purple-600" />}
                          <span>{getCategoryShortLabel(app.adDetails.category)}</span>
                        </div>
                        <div className="text-slate-600 font-medium text-[12px] line-clamp-2 mt-1" title={app.adDetails.purpose}>
                          {app.adDetails.purpose}
                        </div>
                        {app.equipment.vehicleRegistration && (
                          <div className="text-[11px] text-indigo-700 font-medium mt-0.5">
                            รถ: {app.equipment.vehicleRegistration}
                          </div>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="p-3.5 align-top whitespace-nowrap">
                        <div className="font-bold text-slate-800">{app.adDetails.totalDays} วัน</div>
                        <div className="text-slate-500 text-[11px]">
                          ({app.adDetails.periodsCount} คราว × {app.fee.ratePerPeriod} บ.)
                        </div>
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          {formatThaiDate(app.adDetails.startDate, { shortMonth: true })} - {formatThaiDate(app.adDetails.endDate, { shortMonth: true })}
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="p-3.5 align-top text-right whitespace-nowrap">
                        <div className="text-base font-black text-slate-900 font-prompt">
                          {app.fee.totalAmount} <span className="text-xs font-semibold text-slate-500">บ.</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{app.fee.amountText}</div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 align-top text-center whitespace-nowrap">
                        {isPermitIssued && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>ออกใบอนุญาตแล้ว</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                            <CheckCircle className="w-3 h-3 text-blue-600" />
                            <span>อนุมัติแล้ว</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>รอตรวจสอบ</span>
                          </span>
                        )}
                      </td>

                      {/* Actions: Edit, Delete, Approve, Print */}
                      <td className="p-3.5 pr-5 align-top text-center whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-end sm:items-center">
                          
                          {/* Row 1: Edit & Delete buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedAppForEdit(app)}
                              className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                              title="แก้ไขข้อมูลคำร้องนี้ (Edit)"
                            >
                              <Pencil className="w-3 h-3 text-blue-600" />
                              <span>แก้ไข</span>
                            </button>

                            <button
                              onClick={() => handleDelete(app.id)}
                              className="px-2 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                              title="ลบคำร้องนี้ (Delete)"
                            >
                              <Trash2 className="w-3 h-3 text-rose-500" />
                            </button>

                            {!isPermitIssued && (
                              <button
                                onClick={() => handleFastApproveAndIssue(app)}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1"
                                title="อนุมัติและออกใบอนุญาตทันที"
                              >
                                <Award className="w-3 h-3" />
                                <span>ออก ฆ.ษ.๒</span>
                              </button>
                            )}
                          </div>

                          {/* Row 2: Print options */}
                          <div className="flex items-center gap-1 text-[11px] pt-0.5">
                            <button
                              onClick={() => onSelectApplication(app, 'ks1')}
                              className="px-2 py-0.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-0.5"
                              title="พิมพ์แบบ ฆ.ษ. ๑ (คำร้อง)"
                            >
                              <Printer className="w-2.5 h-2.5" />
                              <span>ฆ.ษ.๑</span>
                            </button>

                            <button
                              onClick={() => onSelectApplication(app, 'ks2')}
                              className="px-2 py-0.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded flex items-center gap-0.5"
                              title="พิมพ์ใบอนุญาต แบบ ฆ.ษ. ๒"
                            >
                              <Printer className="w-2.5 h-2.5" />
                              <span>ใบอนุญาต</span>
                            </button>

                            <button
                              onClick={() => onSelectApplication(app, 'receipt')}
                              className="px-2 py-0.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded flex items-center gap-0.5"
                              title="พิมพ์ใบเสร็จรับเงิน"
                            >
                              <Receipt className="w-2.5 h-2.5" />
                              <span>ใบเสร็จ</span>
                            </button>

                            <button
                              onClick={() => onSelectApplication(app, 'placard')}
                              className="px-2 py-0.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded flex items-center gap-0.5"
                              title="พิมพ์ป้ายประจำรถแห่/สถานที่"
                            >
                              <Truck className="w-2.5 h-2.5" />
                              <span>ป้ายรถ</span>
                            </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal for Full CRUD */}
      {selectedAppForEdit && (
        <EditApplicationModal
          application={selectedAppForEdit}
          isOpen={true}
          onClose={() => setSelectedAppForEdit(null)}
          onSave={handleSaveAppEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Receipt Control Modal */}
      <ReceiptControlModal
        isOpen={isReceiptControlOpen}
        onClose={() => setIsReceiptControlOpen(false)}
        onRefreshData={onRefresh}
      />

    </div>
  );
};

