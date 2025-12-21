'use client';

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { DownloadIcon, FileTextIcon, RefreshCwIcon } from 'lucide-react';

export default function DemandLetterGenerator() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        insuranceCo: '',
        claimNumber: '',
        vehicleYear: '',
        vehicleMake: '',
        vehicleModel: '',
        offerAmount: '',
        acvAmount: '',
        difference: 0
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();
        const diff = parseFloat(formData.acvAmount) - parseFloat(formData.offerAmount);

        // Styling
        doc.setFont('times', 'normal');
        doc.setFontSize(12);

        // Header
        doc.text(formData.name, 20, 20);
        doc.text(formData.address || '[Your Address]', 20, 25);

        doc.text(date, 20, 40);

        doc.text('SENT VIA EMAIL / CERTIFIED MAIL', 20, 50);

        doc.text(`CLAIMS ADJUSTER: ${formData.insuranceCo}`, 20, 60);
        doc.text(`RE: Claim Number: ${formData.claimNumber}`, 20, 65);
        doc.text(`Insured: [At-Fault Driver Name or Your Name]`, 20, 70);
        doc.text(`Vehicle: ${formData.vehicleYear} ${formData.vehicleMake} ${formData.vehicleModel}`, 20, 75);

        doc.setFont('times', 'bold');
        doc.text('SUBJECT: DEMAND FOR FAIR MARKET VALUE (ACTUAL CASH VALUE)', 20, 90);

        doc.setFont('times', 'normal');
        const bodyText1 = `To Whom It May Concern,`;
        doc.text(bodyText1, 20, 100);

        const bodyText2 = `I am writing to formally reject your settlement offer of $${formData.offerAmount} for the total loss of my vehicle. This offer does not reflect the Actual Cash Value (ACV) of my vehicle as required by Texas Insurance Code.`;
        const lines2 = doc.splitTextToSize(bodyText2, 170);
        doc.text(lines2, 20, 110);

        const bodyText3 = `Based on my research of comparable vehicles in the local market (see attached), the fair market value of my vehicle is $${formData.acvAmount}. Your offer is undervalued by approximately $${diff.toFixed(2)}.`;
        const lines3 = doc.splitTextToSize(bodyText3, 170);
        doc.text(lines3, 20, 130);

        const bodyText4 = `I demand that you revise your valuation to reflect the true market conditions. If we cannot reach an agreement, I reserve the right to invoke the Appraisal Clause of my policy or pursue further legal remedies.`;
        const lines4 = doc.splitTextToSize(bodyText4, 170);
        doc.text(lines4, 20, 150);

        doc.text(`Sincerely,`, 20, 170);
        doc.text(formData.name, 20, 180);

        // Footer / Watermark
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Generated via TexasTotalLoss.com - Free Consumer Advocacy Tools', 20, 280);

        doc.save(`Demand_Letter_${formData.claimNumber}.pdf`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 max-w-2xl mx-auto">
            <div className="mb-6 text-center border-b pb-4">
                <h2 className="text-2xl font-black text-blue-900 uppercase flex items-center justify-center gap-2">
                    <FileTextIcon /> Settlement Demand Generator
                </h2>
                <p className="text-gray-600 text-sm mt-1">Don't just argue. Send a formal legal demand in seconds.</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Your Name</label>
                        <input name="name" onChange={handleInput} className="w-full p-2 border rounded bg-gray-50" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Claim #</label>
                        <input name="claimNumber" onChange={handleInput} className="w-full p-2 border rounded bg-gray-50" placeholder="000-123-ABC" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Insurance Co</label>
                        <input name="insuranceCo" onChange={handleInput} className="w-full p-2 border rounded bg-gray-50" placeholder="State Farm / Geico" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase">Your Vehicle</label>
                        <input name="vehicleModel" onChange={handleInput} className="w-full p-2 border rounded bg-gray-50" placeholder="2020 Ford F-150" />
                    </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100 grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-red-800 uppercase">Their Lowball Offer ($)</label>
                        <input name="offerAmount" type="number" onChange={handleInput} className="w-full p-2 border border-red-200 rounded text-red-900 font-bold" placeholder="15000" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-green-800 uppercase">True Value / ACV ($)</label>
                        <input name="acvAmount" type="number" onChange={handleInput} className="w-full p-2 border border-green-200 rounded text-green-900 font-bold" placeholder="22000" />
                    </div>
                </div>

                <button
                    onClick={generatePDF}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-2xl transition transform active:scale-95 flex items-center justify-center gap-2 text-lg"
                >
                    <DownloadIcon /> Generate Official Demand PDF
                </button>
                <p className="text-xs text-center text-gray-400">100% Free • No Lawyer Required • Instant Download</p>
            </div>
        </div>
    );
}
