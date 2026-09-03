import type { CvData } from '../types';

const CV_STORAGE_KEY = 'forgecv_cv_data';

export function loadCv(): CvData | null {
  try {
    const raw = localStorage.getItem(CV_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CvData) : null;
  } catch {
    return null;
  }
}

export function saveCv(cv: CvData) {
  try {
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cv));
  } catch {
    // storage full or unavailable - fail silently, autosave is best-effort
  }
}

export function exportCvAsJson(cv: CvData) {
  const blob = new Blob([JSON.stringify(cv, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const name = cv.personal.fullName ? cv.personal.fullName.replace(/\s+/g, '_') : 'resume';
  a.href = url;
  a.download = `${name}_forgecv.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function importCvFromFile(file: File): Promise<CvData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as CvData;
        resolve(data);
      } catch {
        reject(new Error('Invalid file: could not parse JSON.'));
      }
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}
