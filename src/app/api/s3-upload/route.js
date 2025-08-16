import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { filename, contentType, prefix } = await request.json();
    
    try {
        // Initialize the S3 client with your credentials
        const client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });

        // Generate a unique key for the file to prevent overwrites
        const baseKey = `${uuidv4()}-${filename}`;
        const uniqueKey = prefix ? `${prefix.replace(/\/$/, '')}/${baseKey}` : baseKey;

        // Create the pre-signed POST URL
        const { url, fields } = await createPresignedPost(client, {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: uniqueKey,
            Conditions: [
                // Set a max file size (e.g., 10MB)
                ['content-length-range', 0, 10485760],
                // Ensure the file type is what the client claims it is
                ['starts-with', '$Content-Type', contentType],
            ],
            Fields: {
                'Content-Type': contentType,
            },
            // The URL will be valid for 10 minutes (600 seconds)
            Expires: 600,
        });

        // Construct the correct public URL for the uploaded object
        const region = process.env.AWS_REGION;
        const bucket = process.env.S3_BUCKET_NAME;
        
        // Use the standard S3 public URL format
        const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${uniqueKey}`;

        console.log('S3 upload URL generated:', { 
            bucket, 
            region, 
            key: uniqueKey, 
            publicUrl 
        });

        // Return the URL, fields, and the generated key to the client
        return NextResponse.json({ 
            url, 
            fields, 
            key: uniqueKey, 
            publicUrl, 
            bucket, 
            region 
        });
    } catch (error) {
        console.error("Error creating pre-signed post:", error);
        return NextResponse.json(
            { error: "Server error: Failed to generate upload URL." },
            { status: 500 }
        );
    }
}