import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (subfolder) {
    await mkdir(path.join(uploadsDir, subfolder), { recursive: true });
  }
  await mkdir(uploadsDir, { recursive: true });

  const uniqueName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const filePath = subfolder
    ? path.join(uploadsDir, subfolder, uniqueName)
    : path.join(uploadsDir, uniqueName);

  await writeFile(filePath, buffer);

  const fileUrl = subfolder
    ? `/uploads/${subfolder}/${uniqueName}`
    : `/uploads/${uniqueName}`;

  return {
    fileUrl,
    fileName: uniqueName,
    size: buffer.length,
  };
}
