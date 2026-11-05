import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  initAuth, 
  saveApplicationToDrive, 
  listDriveFiles, 
  deleteDriveFileWithConfirm,
  DriveFileItem 
} from '../utils/googleDrive';
import { SoundPermitApplication } from '../types';
import { MUNICIPALITY_INFO } from '../utils/constants';
import { 
  X, 
  Cloud, 
  UploadCloud, 
  FolderCheck, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  HardDrive
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: SoundPermitApplication[];
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  applications,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        fetchDriveFiles(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setDriveFiles([]);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  const fetchDriveFiles = async (token: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const files = await listDriveFiles(token);
      setDriveFiles(files);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'ไม่สามารถโหลดรายการไฟล์จาก Google Drive ได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        await fetchDriveFiles(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'การเข้าสู่ระบบ Google ล้มเหลว');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
    setDriveFiles([]);
  };

  const handleBackupAllToDrive = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    setUploadStatus('กำลังสำรองข้อมูลคำร้องทั้งหมดลง Google Drive...');
    setErrorMessage(null);

    try {
      let count = 0;
      for (const app of applications) {
        await saveApplicationToDrive(accessToken, app);
        count++;
      }
      setUploadStatus(`สำรองข้อมูลสำเร็จเรียบร้อยแล้ว (${count} รายการ)`);
      setTimeout(() => setUploadStatus(null), 4000);
      await fetchDriveFiles(accessToken);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการสำรองข้อมูลลง Google Drive');
      setUploadStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFile = async (file: DriveFileItem) => {
    if (!accessToken) return;
    try {
      const success = await deleteDriveFileWithConfirm(accessToken, file.id, file.name);
      if (success) {
        setDriveFiles((prev) => prev.filter((f) => f.id !== file.id));
      }
    } catch (err: any) {
      alert(err.message || 'ไม่สามารถลบไฟล์ได้');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-blue-200">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-prompt flex items-center gap-2">
                <span>เชื่อมต่อ Google Drive (การจัดเก็บและสำรองข้อมูล)</span>
              </h2>
              <p className="text-xs text-blue-200">
                สำรองข้อมูลเอกสารคำร้อง ฆ.ษ. ๑, ใบอนุญาต ฆ.ษ. ๒ และใบเสร็จลงใน Google Drive | {MUNICIPALITY_INFO.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* User auth state check */}
          {!user || !accessToken ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center space-y-5">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Cloud className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  เข้าสู่ระบบด้วยบัญชี Google เพื่อใช้งาน Google Drive
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ระบบจะทำการบันทึกและสำรองข้อมูลเอกสารคำร้องและใบอนุญาตทั้งหมดลงในบัญชี Google Drive ของท่านอย่างปลอดภัย
                </p>
              </div>

              {/* Official Material Design "Sign in with Google" button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="group relative inline-flex items-center justify-center px-6 py-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-sm hover:shadow transition-all disabled:opacity-50"
                >
                  <div className="w-5 h-5 mr-3 shrink-0">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                  <span>{isLoading ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบด้วย Google (Sign in with Google)'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Authenticated User Banner */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Google Account'}
                      className="w-12 h-12 rounded-full border-2 border-blue-400"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-600 text-white font-bold text-lg rounded-full flex items-center justify-center">
                      {(user.displayName || user.email || 'G')[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-blue-700 font-semibold">เข้าสู่ระบบด้วยบัญชี Google</div>
                    <div className="text-sm font-bold text-slate-900">{user.displayName || 'ผู้ใช้งาน Google'}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchDriveFiles(accessToken)}
                    disabled={isLoading}
                    className="p-2 text-blue-700 bg-white hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                    title="รีเฟรชไฟล์"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>

              {/* Status messages */}
              {uploadStatus && (
                <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 text-rose-900 border border-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Backup Trigger Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-prompt">
                    สำรองข้อมูลคำร้องลง Google Drive ({applications.length} รายการ)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    บันทึกข้อมูลแบบ ฆ.ษ. ๑, ใบอนุญาต ฆ.ษ. ๒ และใบเสร็จรับเงินเข้าโฟลเดอร์ใน Google Drive ของคุณ
                  </p>
                </div>

                <button
                  onClick={handleBackupAllToDrive}
                  disabled={isLoading || applications.length === 0}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-all shrink-0"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>สำรองข้อมูลทันที</span>
                </button>
              </div>

              {/* Google Drive Files Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FolderCheck className="w-4 h-4 text-blue-700" />
                    <span>รายการไฟล์สำรองใน Google Drive ({driveFiles.length} ไฟล์)</span>
                  </h3>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  {isLoading && driveFiles.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      กำลังโหลดข้อมูลจาก Google Drive...
                    </div>
                  ) : driveFiles.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs space-y-1">
                      <Cloud className="w-8 h-8 mx-auto text-slate-300" />
                      <p>ยังไม่มีไฟล์สำรองข้อมูลใน Google Drive</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-3 pl-4">ชื่อไฟล์สำรอง</th>
                          <th className="p-3">วันที่สร้าง/แก้ไข</th>
                          <th className="p-3 text-right pr-4">การจัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {driveFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 pl-4 font-semibold text-slate-900 max-w-xs truncate">
                              {file.name}
                            </td>
                            <td className="p-3 text-slate-500 whitespace-nowrap">
                              {file.createdTime ? new Date(file.createdTime).toLocaleDateString('th-TH') : '-'}
                            </td>
                            <td className="p-3 pr-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2">
                                {file.webViewLink && (
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1 transition-colors"
                                    title="เปิดไฟล์ใน Google Drive"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>เปิดไฟล์</span>
                                  </a>
                                )}
                                <button
                                  onClick={() => handleDeleteFile(file)}
                                  className="px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                                  title="ลบไฟล์จาก Google Drive"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            {user ? `บัญชี: ${user.email}` : 'Google Drive Integration'}
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
