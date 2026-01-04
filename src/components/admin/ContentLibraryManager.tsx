'use client';

import { useState, useEffect } from 'react';
import { getContentBySlug, getLibraryContent, upsertContent, deleteContent, ContentItem } from '@/lib/content';
import {
    VideoIcon, EditIcon, CheckCircleIcon,
    TrashIcon, PlusIcon, StarIcon, ExternalLinkIcon
} from 'lucide-react';

export default function ContentLibraryManager() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Partial<ContentItem> | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        const data = await getLibraryContent();
        setItems(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;
        try {
            await deleteContent(id);
            fetchContent();
        } catch (e) {
            alert('Failed to delete content');
        }
    };

    const handleSave = async (item: Partial<ContentItem>) => {
        try {
            await upsertContent(item);
            setSelectedItem(null);
            fetchContent();
        } catch (e) {
            alert('Failed to save content');
        }
    };

    const toggleTrending = async (item: ContentItem) => {
        try {
            await upsertContent({ ...item, is_trending: !item.is_trending });
            fetchContent();
        } catch (e) {
            alert('Failed to update trending status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <VideoIcon className="text-gold-600" /> Video Library Manager
                </h2>
                <button
                    onClick={() => setSelectedItem({})}
                    className="bg-gold-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gold-600 transition"
                >
                    <PlusIcon size={18} /> Add Video
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Title / Category</th>
                            <th className="px-6 py-4">Trending</th>
                            <th className="px-6 py-4">Link</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gold-50/20 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{item.title}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                                        {item.category} • {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Draft'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleTrending(item)}
                                        className={`p-1 rounded-full transition ${item.is_trending ? 'text-gold-500 bg-gold-100' : 'text-gray-300 hover:text-gray-400'}`}
                                    >
                                        <StarIcon size={20} fill={item.is_trending ? "currentColor" : "none"} />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {item.video_url && (
                                        <a href={item.video_url} target="_blank" className="flex items-center gap-1 hover:text-gold-600">
                                            <ExternalLinkIcon size={12} /> Watch
                                        </a>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                                            title="Edit"
                                        >
                                            <EditIcon size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded border border-red-200"
                                            title="Delete"
                                        >
                                            <TrashIcon size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No videos in library. Click "Add Video" to start.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedItem && (
                <EditContentModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function EditContentModal({ item, onClose, onSave }: { item: Partial<ContentItem>, onClose: () => void, onSave: (item: Partial<ContentItem>) => void }) {
    const [formData, setFormData] = useState(item);

    const handleChange = (field: keyof ContentItem, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-lg">{item.id ? 'Edit Video' : 'Add New Video'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
                            <input
                                value={formData.title || ''}
                                onChange={e => handleChange('title', e.target.value)}
                                className="w-full border p-2 rounded"
                                placeholder="e.g. How to handle a Total Loss"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Category</label>
                            <select
                                value={formData.category || 'general'}
                                onChange={e => handleChange('category', e.target.value)}
                                className="w-full border p-2 rounded bg-white"
                            >
                                <option value="general">General</option>
                                <option value="dwi">DWI Accidents</option>
                                <option value="trucking">Truck Accidents</option>
                                <option value="insurance">Insurance Tactics</option>
                                <option value="diminished_value">Diminished Value</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Video URL (YouTube Embed)</label>
                        <input
                            value={formData.video_url || ''}
                            onChange={e => handleChange('video_url', e.target.value)}
                            className="w-full border p-2 rounded"
                            placeholder="https://www.youtube.com/embed/..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Description (SEO Meta)</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                            className="w-full border p-2 rounded h-20"
                            placeholder="Short summary for search engines..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                            Transcript / Full Content
                            <span className="text-gold-600 ml-2 text-[10px]">(Crucial for AI Search)</span>
                        </label>
                        <textarea
                            value={formData.transcript || ''}
                            onChange={e => handleChange('transcript', e.target.value)}
                            className="w-full border p-4 rounded h-64 font-mono text-sm"
                            placeholder="Paste full video transcript or detailed guide here..."
                        />
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-bold">Cancel</button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-6 py-2 bg-gold-500 text-white hover:bg-gold-600 rounded font-bold flex items-center gap-2"
                    >
                        <CheckCircleIcon size={18} /> Save Video
                    </button>
                </div>
            </div>
        </div>
    );
}
