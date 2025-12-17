
export interface VehicleSpecs {
    year?: string;
    make?: string;
    model?: string;
    trim?: string;
    error?: string;
}

export interface ValuationResult {
    estimatedValue: number;
    currency: string;
    source: string;
    notes?: string;
}

/**
 * Decodes a VIN using the free NHTSA vPIC API.
 */
export async function decodeVin(vin: string): Promise<VehicleSpecs> {
    try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
        const data = await response.json();

        if (!data.Results) {
            return { error: 'Invalid VIN response' };
        }

        const getVal = (id: number) => data.Results.find((r: any) => r.VariableId === id)?.Value;

        // Variable IDs: Year=29, Make=26, Model=28, Trim=38
        const year = getVal(29);
        const make = getVal(26);
        const model = getVal(28);
        const trim = getVal(38);

        if (!year || !make || !model) {
            return { error: 'Could not decode specific vehicle details.' };
        }

        return { year, make, model, trim };
    } catch (error) {
        console.error('NHTSA API Error:', error);
        return { error: 'Failed to connect to VIN service.' };
    }
}

/**
 * Returns a mock valuation.
 * Replace this with a call to KBB/MarketCheck API when you have a key.
 */
export async function getMockValuation(specs: VehicleSpecs): Promise<ValuationResult> {
    // Simple mock logic:
    // Base value $5k + random variance based on "year" if possible, else random.

    let base = 5000;
    if (specs.year) {
        const age = new Date().getFullYear() - parseInt(specs.year);
        // Newer cars worth more
        base = Math.max(2000, 30000 - (age * 2000));
    }

    return {
        estimatedValue: base,
        currency: 'USD',
        source: 'Estimated Market Range (Mock)',
        notes: 'This is a preliminary estimate. Please upload photos for a precise valuation.'
    };
}
