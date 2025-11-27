// src/services/deviceApi.ts
// In the future Android/Capacitor version, this file will be replaced or extended
// to call native plugins (Camera/Gallery).
// The rest of the app MUST NOT depend directly on browser-specific implementations.

export type PickImageResult = {
  file: File | null;
  error?: string;
};

export async function pickImageFromDevice(): Promise<PickImageResult> {
  // Web implementation for now, using an <input type="file">
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files?.[0] ?? null;
      resolve({ file });
    };

    input.onerror = () => {
      resolve({ file: null, error: 'IMAGE_PICK_ERROR' });
    };

    input.click();
  });
}
