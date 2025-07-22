import { json } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const envCheck = {
      mongodb_uri_exists: !!env.MONGODB_URI,
      mongodb_uri_length: env.MONGODB_URI ? env.MONGODB_URI.length : 0,
      s3_region_exists: !!env.S3_REGION,
      s3_access_key_exists: !!env.S3_ACCESS_KEY_ID,
      s3_secret_exists: !!env.S3_SECRET_ACCESS_KEY,
      s3_bucket_exists: !!env.S3_BUCKET_NAME,
      sns_access_key_exists: !!env.SNS_ACCESS_KEY_ID,
      sns_secret_exists: !!env.SNS_SECRET_ACCESS_KEY,
      sns_topic_exists: !!env.SNS_TOPIC_ARN,
    };

    return json({
      status: "ok",
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
