'use client';

import { useRef, useState } from 'react';

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
};

export default function S3Uploader() {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [publicUrl, setPublicUrl] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentFile = e.target.files?.[0] || null;
		setFile(currentFile);
		setError(null);
		setPublicUrl('');
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!file) {
			setError('Please select a file first.');
			return;
		}

		setUploading(true);
		setError(null);
		setPublicUrl('');

		try {
			// 1. Request a pre-signed URL from our API route
			const response = await fetch('/api/s3-upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ filename: file.name, contentType: file.type }),
			});

			if (!response.ok) throw new Error('Failed to get pre-signed URL.');
			const { url, fields, key } = (await response.json()) as PresignResponse;

			// 2. Create FormData and upload the file to S3
			const formData = new FormData();
			Object.entries(fields).forEach(([k, v]) => {
				formData.append(k, String(v));
			});
			formData.append('file', file); // The file must be the last field

			const uploadResponse = await fetch(url, {
				method: 'POST',
				body: formData,
			});
			if (!uploadResponse.ok) throw new Error('S3 upload failed.');

			// 3. Construct the public URL using the key returned from the API
			const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
			const region = process.env.NEXT_PUBLIC_AWS_REGION;
			if (!bucket || !region) {
				throw new Error('Missing NEXT_PUBLIC_S3_BUCKET_NAME or NEXT_PUBLIC_AWS_REGION');
			}
			const finalUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
			setPublicUrl(finalUrl);
		} catch (err: unknown) {
			console.error(err);
			setError(err instanceof Error ? err.message : 'Upload failed.');
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto my-12 p-6 md:p-8 bg-slate-900 text-gray-200 rounded-2xl shadow-2xl shadow-teal-500/10">
			<h2 className="text-2xl font-bold mb-2 text-teal-400">Secure S3 Uploader</h2>
			<p className="text-slate-400 mb-6">Upload PDF or image files directly to AWS S3.</p>

			<form onSubmit={handleSubmit}>
				<div
					onClick={() => fileInputRef.current?.click()}
					className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-600 rounded-2xl cursor-pointer hover:border-teal-400 hover:bg-slate-800 transition-all"
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
						accept="application/pdf, image/jpeg, image/png"
						onChange={handleFileChange}
						className="hidden"
						disabled={uploading}
					/>

					{file ? (
						<p className="font-medium text-slate-300">{file.name}</p>
					) : (
						<div className="text-center text-slate-500">
							<UploadIcon />
							<p className="mt-2">Click to browse or drag & drop</p>
						</div>
					)}
				</div>

				<button
					type="submit"
					disabled={uploading || !file}
					className="w-full mt-6 px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-teal-500"
					aria-busy={uploading}
				>
					{uploading ? 'Uploading...' : 'Upload to S3'}
				</button>
			</form>

			{error && (
				<p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">Error: {error}</p>
			)}

			{publicUrl && (
				<div className="mt-6">
					<p className="text-green-400 font-semibold">✅ Upload Successful!</p>
					<div className="mt-2 p-3 bg-slate-800 rounded-lg">
						<label className="text-sm text-slate-400">Public URL:</label>
						<a
							href={publicUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="block text-sm text-teal-400 break-all hover:underline mt-1"
						>
							{publicUrl}
						</a>
					</div>
				</div>
			)}
		</div>
	);
}
