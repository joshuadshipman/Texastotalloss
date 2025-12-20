export interface CityData {
    slug: string;
    name: string;
    county: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    description: string;
    zipCodes: string[]; // For schema
}

export const cities: CityData[] = [
    {
        slug: 'houston',
        name: 'Houston',
        county: 'Harris',
        coordinates: { latitude: 29.7604, longitude: -95.3698 },
        description: "As the largest city in Texas, Houston's busy highways like I-45 and the 610 Loop see thousands of accidents annually. Harris County courts are notoriously tough on injury claims.",
        zipCodes: ["77002", "77003", "77004", "77005", "77006"]
    },
    {
        slug: 'dallas',
        name: 'Dallas',
        county: 'Dallas',
        coordinates: { latitude: 32.7767, longitude: -96.7970 },
        description: "Navigating total loss claims in DFW requires understanding specific Dallas County valuations. The mix of high-speed tollways and congestion leads to severe multi-vehicle accidents.",
        zipCodes: ["75201", "75202", "75203", "75204", "75205"]
    },
    {
        slug: 'austin',
        name: 'Austin',
        county: 'Travis',
        coordinates: { latitude: 30.2672, longitude: -97.7431 },
        description: "Austin's rapid growth has increased traffic density on I-35 and Mopac. Travis County juries can be unpredictable, making documented evidence for your totaled car essential.",
        zipCodes: ["78701", "78702", "78703", "78704", "78705"]
    },
    {
        slug: 'san-antonio',
        name: 'San Antonio',
        county: 'Bexar',
        coordinates: { latitude: 29.4241, longitude: -98.4936 },
        description: "In San Antonio and Bexar County, insurance adjusters often undervalue trucks and SUVs. We help you fight for the true replacement value of your vehicle.",
        zipCodes: ["78201", "78202", "78203", "78204", "78205"]
    },
    {
        slug: 'fort-worth',
        name: 'Fort Worth',
        county: 'Tarrant',
        coordinates: { latitude: 32.7555, longitude: -97.3308 },
        description: "Tarrant County has its own localized legal landscape. If your car was totaled in Fort Worth, don't rely on generic advice; get help tailored to local carrier tactics.",
        zipCodes: ["76101", "76102", "76103", "76104", "76105"]
    },
    {
        slug: 'el-paso',
        name: 'El Paso',
        county: 'El Paso',
        coordinates: { latitude: 31.7619, longitude: -106.4850 },
        description: "Drivers in El Paso face unique cross-border traffic challenges. Ensuring your total loss valuation accounts for the specific local market value in West Texas is critical.",
        zipCodes: ["79901", "79902", "79903", "79904", "79905"]
    }
];
