import { NextRequest, NextResponse } from 'next/server';
import { readFile, existsSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const filePath = join(process.cwd(), 'data', 'uploads', filename);

    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const buffer = await readFileAsync(filePath);

    // Infer content type from extension
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      mp4: 'video/mp4',
      avif: 'image/avif',
    };
    const contentType = mimeTypes[ext || ''] || 'application/octet-stream';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('File serve error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
