# S3 Image Upload Setup Guide

This guide will help you set up AWS S3 for image uploads in your Flick dashboard.

## Prerequisites

1. AWS Account with S3 access
2. S3 bucket created
3. IAM user with S3 permissions

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET_NAME=your_bucket_name_here

# Next.js Public Environment Variables (for client-side)
NEXT_PUBLIC_S3_BUCKET_NAME=your_bucket_name_here
NEXT_PUBLIC_AWS_REGION=us-east-1
```

## AWS S3 Bucket Configuration

1. **Create S3 Bucket**: Create a new S3 bucket in your preferred region
2. **Bucket Policy**: Ensure your bucket allows public read access for uploaded images
3. **CORS Configuration**: Add the following CORS policy to your bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "POST", "PUT"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## IAM User Permissions

Create an IAM user with the following policy attached:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::your-bucket-name/*"
        }
    ]
}
```

## Features

- **Profile Pictures**: Upload avatar images for user profiles
- **Project Images**: Upload screenshots and images for project showcases
- **Automatic URL Generation**: S3 URLs are automatically generated and stored
- **Image Preview**: See uploaded images before saving
- **Remove Images**: Easy removal of uploaded images

## File Types Supported

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## Usage

1. Navigate to your dashboard
2. Go to Profile or Projects section
3. Click on the upload area to select an image
4. The image will be uploaded to S3 automatically
5. The S3 URL will be stored in your database

## Troubleshooting

- **Upload Fails**: Check your AWS credentials and bucket permissions
- **Images Not Displaying**: Verify your bucket has public read access
- **CORS Errors**: Ensure your bucket CORS policy is configured correctly
