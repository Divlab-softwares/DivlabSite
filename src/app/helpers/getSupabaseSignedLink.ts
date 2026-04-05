// lib/getSignedSupabaseUrl.ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getSupabaseSignedLink(
    bucketName: string,
    objectKey: string,
    expiresInSeconds: number = 600
): Promise<string> {

    const SUPABASE_S3_ENDPOINT = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;
    const SUPABASE_S3_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const SUPABASE_S3_SECRET = process.env.NEXT_PUBLIC_SUPABASE_ACCESS_KEY;

    if (!SUPABASE_S3_ENDPOINT || !SUPABASE_S3_KEY || !SUPABASE_S3_SECRET) {
        console.error("Missing Supabase S3 environment variables", {SUPABASE_S3_ENDPOINT, SUPABASE_S3_KEY, SUPABASE_S3_SECRET  } );
    }

    const client = new S3Client({
        region: process.env.SUPABASE_S3_REGION || "eu-north-1",
        endpoint: SUPABASE_S3_ENDPOINT,
        credentials: {
            accessKeyId: SUPABASE_S3_KEY!,
            secretAccessKey: SUPABASE_S3_SECRET!,
        },
        forcePathStyle: true,
    });

    const cmd = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
    });

    const signedUrl = await getSignedUrl(client, cmd, { expiresIn: expiresInSeconds });
    console.log("Generated signed URL:", signedUrl);
    return signedUrl;
}
