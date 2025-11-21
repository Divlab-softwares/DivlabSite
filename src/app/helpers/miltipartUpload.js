import { Upload } from "@aws-sdk/lib-storage";
import { makeS3Client } from "./s3Client";
import fs from "fs";

async function multipartUpload(localPath, bucket, key) {
    const client = makeS3Client();
    const fileStream = fs.createReadStream(localPath);

    const parallelUpload = new Upload({
        client,
        params: { Bucket: bucket, Key: key, Body: fileStream },
        queueSize: 4,       // nombre de parties en parallèle
        partSize: 5 * 1024 * 1024, // 5 MB
    });

    await parallelUpload.done();
}
