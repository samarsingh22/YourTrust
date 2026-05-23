import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  fileName?: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `yourtrust/${folder}`,
        public_id: fileName
          ? `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '')}`
          : undefined,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(new Error(error.message));
        } else if (result) {
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        } else {
          reject(new Error('Upload returned no result'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
