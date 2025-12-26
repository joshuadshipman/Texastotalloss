'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import {
    FileTextIcon, EditIcon, CheckCircleIcon,
    XCircleIcon, ExternalLinkIcon, RefreshCwIcon, TrashIcon
} from 'lucide-react';

type Post = {
    id: string;
    title: string;
    slug: string;
    status: 'draft' | 'published';
    created_at: string;
    content: string;
    source_video_id?: string;
};

export default function BlogManagement() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [newVideoId, setNewVideoId] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/blog-posts');
            const data = await res.json();
            if (data.posts) setPosts(data.posts);
        } catch (e) {
            console.error('Fetch post error', e);
        }
        setLoading(false);
    };

    const handleGenerate = async () => {
        if (!newVideoId) return alert('Please enter a Video ID');
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/generate-blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId: newVideoId })
            });
            const data = await res.json();
            if (data.success) {
                alert('Draft Generated Successfully!');
                setNewVideoId('');
                fetchPosts();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (e) {
            alert('Failed to generate');
        } finally {
            setGenerating(false);
        }
    };

    const handleTweet = async (post: Post) => {
        if (!post.content.includes('<!-- SEPARATOR: TWEETS -->')) {
            return alert('No generated tweets found in this post. Re-generate or edit manually.');
        }

        const tweetSection = post.content.split('<!-- SEPARATOR: TWEETS -->')[1];
        const tweets = tweetSection.split('\n')
            .filter(line => line.trim().length > 10)
            .map(line => line.replace(/^[-*]\s/, '').trim());

        if (!confirm(`Ready to post a thread of ${tweets.length} tweets to X / Twitter?`)) return;

        try {
            const res = await fetch('/api/admin/post-twitter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: tweets, postId: post.id })
            });
            const data = await res.json();
            if (data.success) {
                alert('Posted to Twitter successfully!');
            } else if (data.missingKeys) {
                alert(data.error);
            } else {
                alert('Error posting: ' + data.error);
            }
        } catch (e) {
            alert('Failed to connect to Twitter API');
        }
    };

    const handleCopyScript = (post: Post) => {
        if (!post.content.includes('<!-- SEPARATOR: VIDEOS -->')) {
            return alert('No generated video scripts found in this post.');
        }
        const parts = post.content.split('<!-- SEPARATOR: VIDEOS -->');
        if (parts.length < 2) return alert('Script parsing failed');

        let scriptContent = parts[1];
        if (scriptContent.includes('<!-- SEPARATOR: TWEETS -->')) {
            scriptContent = scriptContent.split('<!-- SEPARATOR: TWEETS -->')[0];
        }

        navigator.clipboard.writeText(scriptContent.trim());
        alert('TikTok/Shorts Script copied to clipboard!');
    };

    const toggleStatus = async (post: Post) => {
        const newStatus = post.status === 'published' ? 'draft' : 'published';
        const res = await fetch('/api/admin/blog-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', id: post.id, status: newStatus })
        });
        const data = await res.json();
        if (data.success) fetchPosts();
        else alert('Failed: ' + data.error);
    };

    // ... (Copy/Tweet Handlers remain same as they hit other endpoints) ...

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        const res = await fetch('/api/admin/blog-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id })
        });
        const data = await res.json();
        if (data.success) {
            fetchPosts();
            if (selectedPost?.id === id) setSelectedPost(null);
        } else alert('Failed to delete');
    };

    const handleSaveEdit = async (id: string, newContent: string, newTitle: string) => {
        const res = await fetch('/api/admin/blog-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update', id, content: newContent, title: newTitle })
        });
        const data = await res.json();
        if (data.success) {
            alert('Saved!');
            fetchPosts();
        } else alert('Failed to save');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <FileTextIcon className="text-purple-600" /> Blog Content Manager
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold hover:bg-blue-200 transition"
                    >
                        {showHelp ? 'Hide Guide' : 'How-To Guide'}
                    </button>
                    <button
                        onClick={fetchPosts}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                        title="Refresh Posts"
                    >
                        <RefreshCwIcon size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* SOP / Help Guide */}
            {showHelp && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-sm text-gray-800 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-bold text-lg text-blue-900 border-b border-blue-200 pb-2">Admin SOP: Content Automation</h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <span className="bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Generate Blog
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Find a target video on YouTube.</li>
                                <li>Copy the ID (part after `v=`, e.g. `aTM4qKYEzXI`).</li>
                                <li>Paste it in the box below and click <strong>Generate</strong>.</li>
                                <li>Wait 10-20s. A "Draft" will appear in the list.</li>
                                <li>Review, Edit, and set status to <strong>Published</strong>.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <span className="bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Twitter / X Thread
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Every post has a hidden 5-tweet thread generated.</li>
                                <li>Click the <span className="text-blue-500 font-bold">Blue "X" Button</span> in the table.</li>
                                <li>Confirm the popup to post immediately to the company account.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <span className="bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                TikTok / Reels
                            </h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>AI generates 3 viral scripts per post.</li>
                                <li>Click the <span className="text-pink-500 font-bold">Pink "Copy" Button</span>.</li>
                                <li>Go to <strong>Canva</strong> or <strong>CapCut</strong>.</li>
                                <li>Search "Legal TikTok Template" &rarr; Paste Script &rarr; Export.</li>
                                <li>Upload manually to TikTok/Instagram.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Generator Input */}
            <div className="bg-white p-4 rounded-xl border flex gap-4 items-center">
                <input
                    value={newVideoId}
                    onChange={e => setNewVideoId(e.target.value)}
                    placeholder="Enter YouTube Video ID (e.g., aTM4qKYEzXI)"
                    className="border p-2 rounded flex-1 text-sm"
                />
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-purple-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {generating ? <RefreshCwIcon className="animate-spin" size={16} /> : <CheckCircleIcon size={16} />}
                    {generating ? 'Generating...' : 'Generate Draft'}
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Title / Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Source</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-purple-50/30 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{post.title}</div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        /{post.slug} • {new Date(post.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(post)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition ${post.status === 'published'
                                            ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                                            : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
                                            }`}
                                    >
                                        {post.status.toUpperCase()}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {post.source_video_id ? (
                                        <a
                                            href={`https://youtu.be/${post.source_video_id}`}
                                            target="_blank"
                                            className="flex items-center gap-1 hover:text-red-600"
                                        >
                                            <ExternalLinkIcon size={12} /> YouTube
                                        </a>
                                    ) : 'Manual'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleCopyScript(post)}
                                            className="p-2 text-pink-500 hover:bg-pink-50 rounded border border-pink-200"
                                            title="Copy TikTok Script"
                                        >
                                            {/* TikTok-ish Icon */}
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0 7.75 6.82V9.17a7.18 7.18 0 0 0 2.18-.31c.39-.14.75-.32 1.1-.53v-1.64Z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleTweet(post)}
                                            className="p-2 text-blue-400 hover:bg-blue-50 rounded border border-blue-200"
                                            title="Post to Twitter / X"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedPost(post)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                                            title="Edit Content"
                                        >
                                            <EditIcon size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded border border-red-200"
                                            title="Delete"
                                        >
                                            <TrashIcon size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No blog posts found. Run the automation script to generate drafts!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {selectedPost && (
                <EditPostModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
}

function EditPostModal({ post, onClose, onSave }: { post: Post, onClose: () => void, onSave: (id: string, content: string, title: string) => void }) {
    const [content, setContent] = useState(post.content);
    const [title, setTitle] = useState(post.title);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-lg">Edit Post</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                </div>

                <div className="p-6 flex-1 overflow-hidden flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border p-2 rounded font-bold text-lg"
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Content (Markdown)</label>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full h-full border p-4 rounded font-mono text-sm resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-bold">Cancel</button>
                    <button
                        onClick={() => { onSave(post.id, content, title); onClose(); }}
                        className="px-6 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded font-bold flex items-center gap-2"
                    >
                        <CheckCircleIcon size={18} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
