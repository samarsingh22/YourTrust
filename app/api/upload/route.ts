import { NextRequest, NextResponse } from 'next/server';
import { uploadToLocal } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadToLocal(buffer, file.name);

    return NextResponse.json({
      success: true,
      fileUrl: result.fileUrl,
      fileName: result.fileName,
      size: result.size,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
}
