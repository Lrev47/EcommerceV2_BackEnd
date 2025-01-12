// src/services/s3UploadService.js

const AWS = require("aws-sdk");

// We'll read from the environment variables (set in .env)
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
} = process.env;

// Configure AWS SDK
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

/**
 * uploadFileToS3
 * Uploads a buffer or stream to your S3 bucket, returns the public URL.
 */
async function uploadFileToS3(fileBuffer, fileName, mimeType) {
  // e.g. fileName = "user_images/johnDoe_168834523.png"
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read", // If you want the file publicly readable
  };

  // Perform the upload
  await s3.putObject(params).promise();

  // Return the public URL
  return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}

module.exports = {
  uploadFileToS3,
};
