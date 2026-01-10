'use client';

import { useState } from 'react';
import { XIcon, MessageCircleIcon, Loader2Icon, SendIcon, CheckCircleIcon } from 'lucide-react';

interface WhatsAppCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WhatsAppCaptureModal({ isOpen, onClose }: WhatsAppCaptureModalProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        message: 'Hola, me gustaría recibir ayuda con mi caso de accidente.',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName || !formData.phone) {
            setError('Please include both your name and phone number.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: `whatsapp-${Date.now()}`,
                    full_name: formData.fullName,
                    phone: formData.phone,
                    contact_pref: 'text', // Assume text since they clicked WhatsApp
                    description: formData.message,
                    source: 'whatsapp-button',
                    language: 'es' // Defaulting to Spanish context given the button text, but could be dynamic
                })
            });

            if (!res.ok) throw new Error('Failed to submit');

            setIsSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative p-8 text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <XIcon size={24} />
                    </button>
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                    <p className="text-slate-600 mb-6">
                        An agent has received your details and will contact you via text or WhatsApp shortly.
                    </p>
                    <button onClick={onClose} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl transition-colors">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
                {/* Header */}
                <div className="bg-[#25D366] p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MessageCircleIcon size={28} className="text-white" />
                        <div>
                            <h3 className="font-bold text-lg">Connect with Us</h3>
                            <p className="text-green-100 text-xs">We typically reply in &lt; 5 mins</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <XIcon size={24} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-8 bg-slate-50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-slate-600 mb-4">
                            Enter your details to start a conversation with our team.
                        </p>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Your Name"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(555) 123-4567"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message (Optional)</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] outline-none h-24 resize-none"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-bold flex items-center gap-1">⚠️ {error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2Icon className="animate-spin" size={20} /> Sending...
                                </>
                            ) : (
                                <>
                                    <SendIcon size={20} /> Start Conversation
                                </>
                            )}
                        </button>

                        <p className="text-[10px] text-center text-slate-400 mt-4 leading-tight">
                            By clicking "Start Conversation", you agree to receive text messages from us. Msg & data rates may apply.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
