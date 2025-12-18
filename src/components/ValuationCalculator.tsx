'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';

export default function ValuationCalculator() {
    const { openChat } = useChat();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        vin: '',
        year: '',
        make: '',
        model: '',
        mileage: '',
        condition: 'good'
    });
    const [valuation, setValuation] = useState<{ min: number, max: number } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateValuation = () => {
        // Mock HIGH retail valuation logic
        // In a real app, this would call an API. 
        // Here we just generate a "generous" number to validate the user.
        const baseValue = 24000;
        // Randomize slightly for "realism" effect in demo
        const randomFactor = Math.floor(Math.random() * 2000);
        const minVal = baseValue + randomFactor;
        const maxVal = minVal + 3500;

        setValuation({ min: minVal, max: maxVal });
        setStep(2);
    };

    return (
        <section className="py-16 px-4 bg-blue-900 text-white">
            <div className="max-w-4xl mx-auto">

                {step === 1 && (
                    <div className="bg-white text-gray-900 rounded-xl shadow-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-center mb-2 text-blue-900">Check Your Total Loss Value</h2>
                        <p className="text-center text-gray-600 mb-8">See what your car is actually worth vs. what they offered.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">VIN (Optional)</label>
                                <input
                                    type="text"
                                    name="vin"
                                    value={formData.vin}
                                    onChange={handleInputChange}
                                    placeholder="17-Digit VIN"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Year</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select Year</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="older">Older</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Make</label>
                                <input
                                    type="text"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Ford, Toyota"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    placeholder="e.g. F-150, Camry"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Mileage</label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.mileage}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 45000"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Condition</label>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="excellent">Excellent (Dealer Retail)</option>
                                    <option value="good">Good (Clean Retail)</option>
                                    <option value="fair">Fair (Average)</option>
                                    <option value="poor">Poor (Rough)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={calculateValuation}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg text-xl transition transform hover:scale-[1.02]"
                        >
                            Get ACV Estimate
                        </button>
                    </div>
                )}

                {step === 2 && valuation && (
                    <div className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="bg-green-600 p-6 text-center">
                            <h3 className="text-white text-lg font-semibold opacity-90 mb-1">Estimated Retail Value Range</h3>
                            <div className="text-white text-5xl font-black tracking-tight">
                                ${valuation.min.toLocaleString()} - ${valuation.max.toLocaleString()}*
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
                                <p className="text-sm text-yellow-800">
                                    <strong>*Disclaimer:</strong> This is a generic retail estimation based on market averages for vehicles in this class.
                                    It is not a formal appraisal. Your specific options, trim, and local market can affect value significantly.
                                </p>
                            </div>

                            <div className="text-center max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">But here is the truth...</h3>
                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    Fighting over a few thousand dollars on the car value is important, but often the <strong>bigger financial risk</strong> is ignoring your medical needs.
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    Focus less on fighting the adjuster over the total‑loss number and more on getting the medical care you need.
                                    If you were hurt, even slightly, you need to protect your rights immediately.
                                </p>

                                <button
                                    onClick={openChat}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg text-xl transition animate-pulse"
                                >
                                    Discuss My Options & Injuries
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
