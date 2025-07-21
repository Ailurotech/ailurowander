import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "$env/dynamic/private";

// Get env values
const REGION = env.AWS_REGION || "ap-southeast-2";
const BUCKET_NAME = env.AWS_S3_BUCKET_NAME || "";

// ✅ Initialize S3 client with endpoint fix
const s3Client = new S3Client({
  region: REGION,
  endpoint: `https://s3.${REGION}.amazonaws.com`,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Upload a file to S3
 */
export async function uploadToS3(
  file: Buffer | ReadableStream | ArrayBuffer,
  key: string,
  contentType: string,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file instanceof ArrayBuffer ? Buffer.from(file) : file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
}

/**
 * Get a signed URL for an S3 object
 */
export async function getSignedS3Url(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a unique key for an S3 object
 */
export function generateS3Key(filename: string, prefix = ""): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.split(".").pop();
  return `${prefix}${timestamp}-${randomString}.${extension}`;
}
