'use client';

import { useRef, useState, useEffect } from 'react';

// Simple SVG icon for visual feedback
const UploadIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
		<polyline points="17 8 12 3 7 8" />
		<line x1="12" x2="12" y1="3" y2="15" />
	</svg>
);

type PresignResponse = {
	url: string;
	fields: Record<string, string>;
	key: string;
	publicUrl: string;
};

interface S3UploaderProps {
	onUploadComplete?: (imageUrl: string) => void;
	label?: string;
	description?: string;
	className?: string;
	prefix?: string;
	accept?: string;
	showPreview?: boolean;
	initialValue?: string;
}

export default function S3Uploader({ 
	onUploadComplete, 
	label = "Upload Image", 
	description = "Upload an image to S3",
	className = "",
	prefix = "images",
	accept = "image/jpeg, image/png, image/webp",
	showPreview = true,
	initialValue = ""
}: S3UploaderProps) {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [publicUrl, setPublicUrl] = useState<string>(initialValue);
	const [previewUrl, setPreviewUrl] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// Sync initialValue with component state
	useEffect(() => {
		setPublicUrl(initialValue);
	}, [initialValue]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentFile = e.target.files?.[0] || null;
		setFile(currentFile);
		setError(null);
		
		// Validate file size (4MB = 4 * 1024 * 1024 bytes)
		if (currentFile && currentFile.size > 4 * 1024 * 1024) {
			setError('File size must be less than 4MB. Please choose a smaller image.');
			setFile(null);
			setPreviewUrl('');
			return;
		}
		
		// Create preview URL
		if (currentFile) {
			const url = URL.createObjectURL(currentFile);
			setPreviewUrl(url);
		} else {
			setPreviewUrl('');
		}
	};

	const handleUpload = async () => {
		if (!file) {
			setError('Please select a file first.');
			return;
		}

		setUploading(true);
		setError(null);

		try {
			console.log('Starting S3 upload for file:', file.name, 'type:', file.type);
			
			// 1. Request a pre-signed URL from our API route
			const response = await fetch('/api/s3-upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					filename: file.name, 
					contentType: file.type,
					prefix: prefix
				}),
			});

			if (!response.ok) throw new Error('Failed to get pre-signed URL.');
			const { url, fields, key, publicUrl: s3PublicUrl } = (await response.json()) as PresignResponse;
			
			console.log('Received pre-signed URL response:', { url, key, publicUrl: s3PublicUrl });

			// 2. Create FormData and upload the file to S3
			const formData = new FormData();
			Object.entries(fields).forEach(([k, v]) => {
				formData.append(k, String(v));
			});
			formData.append('file', file); // The file must be the last field

			console.log('Uploading file to S3...');
			const uploadResponse = await fetch(url, {
				method: 'POST',
				body: formData,
			});
			if (!uploadResponse.ok) throw new Error('S3 upload failed.');

			console.log('S3 upload successful, setting public URL:', s3PublicUrl);

			// 3. Set the public URL and notify parent component
			setPublicUrl(s3PublicUrl);
			if (onUploadComplete) {
				console.log('Calling onUploadComplete callback with:', s3PublicUrl);
				onUploadComplete(s3PublicUrl);
			}
		} catch (err: unknown) {
			console.error('S3 upload error:', err);
			setError(err instanceof Error ? err.message : 'Upload failed.');
		} finally {
			setUploading(false);
		}
	};

	const removeImage = () => {
		setFile(null);
		setPublicUrl('');
		setPreviewUrl('');
		setError(null);
		if (onUploadComplete) {
			onUploadComplete('');
		}
	};

	return (
		<div className={`space-y-4 ${className}`}>
			{/* <div className="space-y-2">
				<label className="text-sm font-medium text-gray-200">{label}</label>
				<p className="text-xs text-gray-400">{description}</p>
				<p className="text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded border border-yellow-700/30">
					⚠️ Maximum file size: 4MB
				</p>
			</div> */}

			{/* Show current image if exists */}
			{publicUrl && showPreview && (
				<div className="relative">
					<img 
						src={publicUrl} 
						alt="Uploaded image" 
						className="w-full h-32 object-cover rounded-lg border border-gray-700"
					/>
					<button
						type="button"
						onClick={removeImage}
						className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
						title="Remove image"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>
			)}

			{/* Upload interface - no form element */}
			{!publicUrl && (
				<div className="space-y-4">
					<div
						onClick={() => fileInputRef.current?.click()}
						className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-gray-800 transition-all"
						role="button"
						aria-label="Choose a file to upload"
						tabIndex={0}
						onKeyDown={(ev) => {
							if (ev.key === 'Enter' || ev.key === ' ') {
								ev.preventDefault();
								fileInputRef.current?.click();
							}
						}}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept={accept}
							onChange={handleFileChange}
							className="hidden"
							disabled={uploading}
						/>

						{file ? (
							<div className="text-center">
								{previewUrl && (
									<img 
										src={previewUrl} 
										alt="Preview" 
										className="w-16 h-16 object-cover rounded mx-auto mb-2"
									/>
								)}
								<p className="font-medium text-gray-300 text-sm">{file.name}</p>
								<p className="text-xs text-gray-400 mt-1">
									Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
								</p>
							</div>
						) : (
							<div className="text-center text-gray-500">
								<UploadIcon />
								<p className="mt-2 text-sm">Click to browse or drag & drop</p>
							</div>
						)}
					</div>

					{file && (
						<button
							type="button"
							onClick={handleUpload}
							disabled={uploading}
							className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							aria-busy={uploading}
						>
							{uploading ? 'Uploading...' : 'Upload Image'}
						</button>
					)}
				</div>
			)}

			{error && (
				<p className="text-sm text-center text-red-400 bg-red-900/50 p-3 rounded-lg">Error: {error}</p>
			)}

			{/* Hidden input for form integration */}
			<input type="hidden" value={publicUrl} />
		</div>
	);
}
