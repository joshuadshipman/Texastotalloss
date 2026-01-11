'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Upload, Loader2, CheckCircle, Camera, X } from 'lucide-react';

interface EvidenceUploaderProps {
    leadId: number | string;
    uploaderName?: string;
    uploaderEmail?: string;
}

export default function EvidenceUploader({ leadId, uploaderName, uploaderEmail }: EvidenceUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        setError(null);

        const files = Array.from(e.target.files);
        let successCount = 0;

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const filePath = `leads/${leadId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            try {
                // Upload to Supabase Storage
                const { error: uploadError } = await supabaseClient.storage
                    .from('evidence')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Storage Error:', uploadError);
                    setError('Upload failed. Please ensure the "evidence" bucket exists.');
                    continue;
                }

                // Send Email Notification
                await fetch('/api/notify/evidence-upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        leadId,
                        filePath,
                        uploaderName,
                        uploaderEmail
                    })
                });

                // Update lead status
                await supabaseClient.from('leads').update({
                    status: 'evidence_uploaded'
                }).eq('id', leadId);

                successCount++;
            } catch (err) {
                console.error('Upload error:', err);
            }
        }

        setUploadedCount(successCount);
        if (successCount > 0) {
            setCompleted(true);
        }
        setUploading(false);
    };

    if (completed) {
        return (
            <div className="w-full py-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl flex flex-col items-center justify-center space-y-2 text-green-700 animate-in fade-in zoom-in duration-500">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-bold text-lg">{uploadedCount} Photo{uploadedCount > 1 ? 's' : ''} Uploaded!</span>
                <span className="text-sm text-green-600">Our team has been notified.</span>
            </div>
        );
    }

    return (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Camera className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                            <p className="mt-3 text-sm font-medium text-blue-600">Uploading securely...</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 bg-white rounded-full shadow-md mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                                <Camera className="w-7 h-7 text-blue-600" />
                            </div>
                            <p className="mb-1 text-base font-semibold text-gray-700">Upload Accident Photos</p>
                            <p className="text-xs text-gray-500">Tap to take a photo or select from gallery</p>
                            <p className="text-xs text-blue-500 mt-1 font-medium">Supports multiple files</p>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                    accept="image/*"
                    multiple
                    capture="environment"
                />
            </label>

            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700 text-sm animate-in fade-in">
                    <X className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
