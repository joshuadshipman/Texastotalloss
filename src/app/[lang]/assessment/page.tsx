import AccidentCalculator from '@/components/AccidentCalculator';

export default function AssessmentPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                    Texas Accident Assessment
                </h1>
                <p className="mt-4 text-xl text-slate-600">
                    Get a free, instant estimate of your potential claim value in less than 2 minutes.
                </p>
            </div>

            <AccidentCalculator />

            <div className="max-w-2xl mx-auto mt-12 text-center">
                <p className="text-sm text-gray-400">
                    Disclaimer: This calculator provides an estimate based on general Texas liability guidelines.
                    It does not constitute legal advice or guarantee a specific settlement amount.
                </p>
            </div>
        </div>
    );
}
