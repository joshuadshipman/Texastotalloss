'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Upload, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';

export default function EvidenceUploader({ leadId }: { leadId: number | string }) {
    const [uploading, setUploading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        // Path format: leads/{leadId}/{random}.ext
        const filePath = `leads/${leadId}/${Math.random().toString(36).substring(7)}.${fileExt}`;

        try {
            // Upload to Supabase Storage 'evidence' bucket
            const { error: uploadError } = await supabaseClient.storage
                .from('evidence')
                .upload(filePath, file);

            if (uploadError) {
                // If bucket doesn't exist or permissions fail, fall back to console log for MVP
                console.error('Storage Error (Make sure "evidence" bucket exists):', uploadError);
                throw uploadError;
            }

            // Update lead record to track that evidence was uploaded
            // We just flag it in user_data for now
            const { error: dbError } = await supabaseClient.from('leads').select('user_data').eq('id', leadId).single();

            if (!dbError) {
                await supabaseClient.from('leads').update({
                    status: 'evidence_uploaded' // Update status to trigger attention
                }).eq('id', leadId);
            }

            setCompleted(true);
        } catch (error) {
            alert('Upload failed. Check if "evidence" bucket is public/created in Supabase.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    if (completed) {
        return (
            <div className="w-full py-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center space-x-2 text-green-700 animate-in fade-in">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Photo Uploaded Successfully!</span>
            </div>
        );
    }

    return (
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                            <p className="text-sm text-gray-500">Uploading secure...</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="mb-1 text-sm font-medium text-gray-700">Add Accident Photos</p>
                            <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
                        </>
                    )}
                </div>
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
            </label>
        </div>
    );
}
