'use client';

import { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Upload, Loader2, CheckCircle, Camera, X, FileText } from 'lucide-react';

interface EvidenceUploaderProps {
    leadId: number | string;
    uploaderName?: string;
    uploaderEmail?: string;
    category?: 'vin' | 'front' | 'side' | 'rear' | 'police_report' | 'injury' | 'loss_photos' | 'carrier_report';
    label?: string;
    onUploadSuccess?: (totalCount: number) => void;
}

export default function EvidenceUploader({ leadId, uploaderName, uploaderEmail, category = 'front', label, onUploadSuccess }: EvidenceUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const getCategoryDetails = () => {
        switch (category) {
            case 'vin': return { icon: Camera, text: label || 'VIN Plate', sub: 'Critical for valuation' };
            case 'police_report': return { icon: Upload, text: label || 'Police Report', sub: 'PDF or Image' };
            case 'injury': return { icon: Camera, text: label || 'Injury Photos', sub: 'Confidential' };
            case 'loss_photos': return { icon: Camera, text: label || 'Damage Photos', sub: 'Scene & Impacts' };
            case 'carrier_report': return { icon: FileText, text: label || 'Carrier Report', sub: 'Mitchell / CCC / Audatex' };
            default: return { icon: Camera, text: label || 'Evidence Photo', sub: category.toUpperCase() };
        }
    };

    const details = getCategoryDetails();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        setError(null);

        const files = Array.from(e.target.files);
        let successCount = 0;

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const filePath = `leads/${leadId}/${category}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

            try {
                // Upload to Firebase Storage
                const storagePath = category === 'police_report' ? 'documents' : 'vehicle-photos';
                const storageRef = ref(storage, `${storagePath}/${filePath}`);
                
                await uploadBytes(storageRef, file);

                // Update lead metadata in Firestore to track evidence types
                await updateDoc(doc(db, 'total_loss_leads', String(leadId)), {
                    [`evidence_counts.${category}`]: (uploadedCount || 0) + 1,
                    status: 'evidence_uploaded',
                    updated_at: new Date().toISOString()
                });

                successCount++;
            } catch (err) {
                console.error('Upload error:', err);
                setError('Upload failed. Check connection.');
            }
        }

        setUploadedCount(prev => {
            const newCount = prev + successCount;
            if (onUploadSuccess) onUploadSuccess(newCount);
            return newCount;
        });
        if (successCount > 0) setCompleted(true);
        setUploading(false);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
                completed ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-blue-300'
            }`}>
                <div className="flex flex-col items-center justify-center p-4">
                    {uploading ? (
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    ) : completed ? (
                        <>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <span className="text-xs font-bold text-green-700 mt-1">UPLOADED</span>
                        </>
                    ) : (
                        <>
                            <details.icon className={`w-6 h-6 mb-1 ${category === 'vin' ? 'text-amber-500' : 'text-gray-400'} group-hover:text-blue-500`} />
                            <p className="text-sm font-bold text-gray-800 tracking-tight">{details.text}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{details.sub}</p>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                    accept={category === 'police_report' ? 'image/*,application/pdf' : 'image/*'}
                    capture={category !== 'police_report' ? 'environment' : undefined}
                />
            </label>

            {error && (
                <p className="text-[10px] text-red-500 mt-1 font-bold text-center uppercase tracking-tighter animate-pulse">{error}</p>
            )}
        </div>
    );
}
