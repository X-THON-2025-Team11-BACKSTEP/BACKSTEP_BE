import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../../common/error/AppError';

export class ImageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || '';
  }

  async getPresignedUrl(folder: 'profiles' | 'projects', filename: string, fileType: string) {
    if (!this.bucketName) {
      throw new Error('AWS S3 Bucket Name is not configured');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(fileType)) {
      throw new BadRequestError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }

    // Generate unique key
    const ext = filename.split('.').pop();
    const uniqueKey = `${folder}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueKey,
      ContentType: fileType,
      // ACL: 'public-read', // If you want the file to be public immediately (optional, depends on bucket settings)
    });

    // Generate presigned URL (valid for 15 minutes)
    const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });

    // Return the URL for upload and the final public URL for access
    const publicUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueKey}`;

    return {
      presignedUrl,
      publicUrl,
      key: uniqueKey
    };
  }
}

