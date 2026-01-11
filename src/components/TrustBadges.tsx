import { ShieldCheck, Clock, Trophy, MapPin } from 'lucide-react';

export default function TrustBadges() {
    return (
        <div className="bg-slate-900 rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-bold text-lg mb-4 text-center border-b border-white/10 pb-2">
                Verified Legal Partners
            </h3>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="bg-gold-500/10 p-2 rounded-lg text-gold-500">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-200">Top 1% Trial Lawyers</div>
                        <div className="text-xs text-slate-400">Texas Board Certified Partners</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-200">24/7 Rapid Response</div>
                        <div className="text-xs text-slate-400">Immediate Attorney Access</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg text-green-400">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-200">No Win, No Fee</div>
                        <div className="text-xs text-slate-400">Zero Upfront Cost Guarantee</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-slate-200">Local Court Experts</div>
                        <div className="text-xs text-slate-400">County-Specific Experience</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    Trusted by 5,000+ Texans
                </p>
                <div className="flex justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-gold-500 text-sm">★</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
