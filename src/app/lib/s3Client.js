// server/lib/s3Client.js
import { S3Client } from "@aws-sdk/client-s3";

export function makeS3Client() {
    return new S3Client({
        region: process.env.SUPABASE_S3_REGION,            // ex: 'eu-west-1' (fourni par Supabase)
        endpoint: process.env.SUPABASE_S3_ENDPOINT,        // ex: 'https://<project>.supabase.co/storage/v1/s3'
        credentials: {
            accessKeyId: process.env.SUPABASE_S3_KEY,
            secretAccessKey: process.env.SUPABASE_S3_SECRET,
        },
        forcePathStyle: true, // souvent nécessaire pour compatibilité (path style)
    });
}
