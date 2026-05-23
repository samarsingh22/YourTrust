const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'YourTrust';

export interface UploadResult {
  fileUrl: string;
  fileName: string;
  size: number;
}

export async function uploadToLocal(
  buffer: Buffer,
  fileName: string,
  subfolder?: string
): Promise<UploadResult> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const folder = subfolder
    ? `YourTrust/${subfolder}`
    : 'YourTrust/uploads';

  const formData = new FormData();
  formData.append('file', new Blob([buffer]), fileName);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(url, { method: 'POST', body: formData });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${errText}`);
  }

  const data = await res.json();

  return {
    fileUrl: data.secure_url,
    fileName: data.original_filename || fileName,
    size: data.bytes,
  };
}
