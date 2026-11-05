import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { SoundPermitApplication } from '../types';

// Initialize Firebase App if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

/**
 * Listen to auth state changes and manage cached token in memory.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google using popup
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('ไม่สามารถดึง OAuth Access Token จาก Google ได้');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  size?: string;
}

/**
 * List files in Google Drive (specifically looking for backups or permit files)
 */
export const listDriveFiles = async (accessToken: string): Promise<DriveFileItem[]> => {
  const query = encodeURIComponent("trashed = false and name contains 'ฆ.ษ.'");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,createdTime,modifiedTime,webViewLink,iconLink,size)&pageSize=50&orderBy=createdTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'ไม่สามารถดึงข้อมูลจาก Google Drive ได้');
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Create or get dedicated Google Drive folder
 */
export const getOrCreateDriveFolder = async (
  accessToken: string, 
  folderName: string = 'เอกสารคำร้องขออนุญาตใช้เครื่องขยายเสียง เทศบาลตำบลพระซอง'
): Promise<string> => {
  // Check if folder exists
  const query = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`);
  const checkUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;

  const checkRes = await fetch(checkUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (checkRes.ok) {
    const checkData = await checkRes.json();
    if (checkData.files && checkData.files.length > 0) {
      return checkData.files[0].id;
    }
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createRes.ok) {
    throw new Error('ไม่สามารถสร้างโฟลเดอร์ใน Google Drive ได้');
  }

  const folderData = await createRes.json();
  return folderData.id;
};

/**
 * Save Application Data or Permit Record to Google Drive
 */
export const saveApplicationToDrive = async (
  accessToken: string,
  app: SoundPermitApplication
): Promise<DriveFileItem> => {
  const folderId = await getOrCreateDriveFolder(accessToken);
  const fileName = `คำร้องและใบอนุญาต_${app.referenceNumber.replace(/[/]/g, '-')}_${app.applicant.fullName}.json`;

  const fileContent = JSON.stringify(app, null, 2);
  const fileBlob = new Blob([fileContent], { type: 'application/json' });

  const metadata = {
    name: fileName,
    parents: [folderId],
    mimeType: 'application/json',
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', fileBlob);

  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,createdTime,webViewLink';
  
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json();
    throw new Error(err.error?.message || 'ไม่สามารถสำรองข้อมูลลง Google Drive ได้');
  }

  return await uploadRes.json();
};

/**
 * Delete a file from Google Drive with mandatory user confirmation
 */
export const deleteDriveFileWithConfirm = async (
  accessToken: string,
  fileId: string,
  fileName: string
): Promise<boolean> => {
  const confirmed = window.confirm(
    `คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ "${fileName}" ออกจาก Google Drive?\nการกระทำนี้จะไม่สามารถย้อนกลับได้`
  );

  if (!confirmed) return false;

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error('ไม่สามารถลบไฟล์จาก Google Drive ได้');
  }

  return true;
};
