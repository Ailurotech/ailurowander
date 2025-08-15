import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

// Initialize S3 client
const s3Client = new S3Client({
  region: env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = env.S3_BUCKET_NAME || '';

// Expose a simple configuration check for consumers
export function isS3Configured(): boolean {
  return Boolean(
    BUCKET_NAME &&
    (env.S3_REGION || 'us-east-1') &&
    env.S3_ACCESS_KEY_ID &&
    env.S3_SECRET_ACCESS_KEY
  );
}

/**
 * Upload a file to S3
 * @param file The file buffer, stream, or ArrayBuffer to upload
 * @param key The S3 object key (path)
 * @param contentType The MIME type of the file
 * @returns The URL of the uploaded file
 */
export async function uploadToS3(
  file: Buffer | ReadableStream | ArrayBuffer,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file instanceof ArrayBuffer ? Buffer.from(file) : file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

/**
 * Get a signed URL for an S3 object
 * @param key The S3 object key (path)
 * @param expiresIn Time in seconds until the URL expires (default: 3600 = 1 hour)
 * @returns A signed URL that can be used to access the object
 */
export async function getSignedS3Url(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a unique key for an S3 object
 * @param filename Original filename
 * @param prefix Optional prefix for the key (e.g., 'tours/', 'users/')
 * @returns A unique key for the S3 object
 */
export function generateS3Key(filename: string, prefix = ''): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  return `${prefix}${timestamp}-${randomString}.${extension}`;
}