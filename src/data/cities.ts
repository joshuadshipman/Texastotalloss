export interface CityData {
    slug: string;
    name: string;
    county: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    description: string;
    zipCodes: string[];
    medicalResources: {
        name: string;
        link: string;
        note: string;
    }[];
}

export const cities: CityData[] = [
    {
        slug: 'houston',
        name: 'Houston',
        county: 'Harris',
        coordinates: { latitude: 29.7604, longitude: -95.3698 },
        description: "As the largest city in Texas, Houston's busy highways like I-45 and the 610 Loop see thousands of accidents annually. Harris County courts are notoriously tough on injury claims.",
        zipCodes: ["77002", "77003", "77004", "77005", "77006"],
        medicalResources: [
            { name: "The Joint Chiropractic - Houston", link: "https://www.thejoint.com/texas/houston/", note: "Multiple locations including Midtown, Heights, and Montrose." },
            { name: "Airrosti Houston", link: "https://www.airrosti.com/locations/houston/", note: "Specialists in soft tissue injury and rapid recovery." },
            { name: "Citywide Injury & Accident", link: "https://www.citywideinjury.com/", note: "Specialized auto injury chiropractors with 8+ Houston locations." }
        ]
    },
    {
        slug: 'dallas',
        name: 'Dallas',
        county: 'Dallas',
        coordinates: { latitude: 32.7767, longitude: -96.7970 },
        description: "Navigating total loss claims in DFW requires understanding specific Dallas County valuations. The mix of high-speed tollways and congestion leads to severe multi-vehicle accidents.",
        zipCodes: ["75201", "75202", "75203", "75204", "75205"],
        medicalResources: [
            { name: "Accident & Injury Chiropractic", link: "https://accidentandinjury.com/", note: "19 Locations in DFW focusing purely on auto accident recovery." },
            { name: "The Joint Chiropractic - Dallas", link: "https://www.thejoint.com/texas/dallas/", note: "Convenient locations in Uptown, Preston Hollow, and White Rock." },
            { name: "Airrosti Dallas", link: "https://www.airrosti.com/locations/dallas/", note: "Trusted providers for back and neck pain relief." }
        ]
    },
    {
        slug: 'austin',
        name: 'Austin',
        county: 'Travis',
        coordinates: { latitude: 30.2672, longitude: -97.7431 },
        description: "Austin's rapid growth has increased traffic density on I-35 and Mopac. Travis County juries can be unpredictable, making documented evidence for your totaled car essential.",
        zipCodes: ["78701", "78702", "78703", "78704", "78705"],
        medicalResources: [
            { name: "Airrosti Austin", link: "https://www.airrosti.com/locations/austin/", note: "Extensive network in Austin including South Congress and Domain." },
            { name: "The Joint Chiropractic - Austin", link: "https://www.thejoint.com/texas/austin/", note: "Walk-in adjustments available at Arboretum and Muller." },
            { name: "Kapsner Chiropractic Centers", link: "https://kapsner.com/", note: "5 Locations serving North and South Austin area." }
        ]
    },
    {
        slug: 'san-antonio',
        name: 'San Antonio',
        county: 'Bexar',
        coordinates: { latitude: 29.4241, longitude: -98.4936 },
        description: "In San Antonio and Bexar County, insurance adjusters often undervalue trucks and SUVs. We help you fight for the true replacement value of your vehicle.",
        zipCodes: ["78201", "78202", "78203", "78204", "78205"],
        medicalResources: [
            { name: "Texas Pain & Injury", link: "https://texaspainandinjury.com/locations/san-antonio/", note: "Dedicated centers for accident injury across San Antonio." },
            { name: "The Joint Chiropractic - San Antonio", link: "https://www.thejoint.com/texas/san-antonio/", note: "Multiple clinics including Alamo Heights and Stone Oak." },
            { name: "Airrosti San Antonio", link: "https://www.airrosti.com/locations/san-antonio/", note: "Headquartered in SA with broad city-wide coverage." }
        ]
    },
    {
        slug: 'fort-worth',
        name: 'Fort Worth',
        county: 'Tarrant',
        coordinates: { latitude: 32.7555, longitude: -97.3308 },
        description: "Tarrant County has its own localized legal landscape. If your car was totaled in Fort Worth, don't rely on generic advice; get help tailored to local carrier tactics.",
        zipCodes: ["76101", "76102", "76103", "76104", "76105"],
        medicalResources: [
            { name: "Accident Centers of Texas", link: "https://accidentcentersoftexas.com/", note: "12 Locations including South Fort Worth." },
            { name: "Premier Injury Clinics", link: "https://premierinjuryclinicsofdfw.com/", note: "Specializing in Fort Worth auto accident rehabilitation." },
            { name: "The Joint Chiropractic - Fort Worth", link: "https://www.thejoint.com/texas/fort-worth/", note: "Serving Cultural District and Hulen areas." }
        ]
    },
    {
        slug: 'el-paso',
        name: 'El Paso',
        county: 'El Paso',
        coordinates: { latitude: 31.7619, longitude: -106.4850 },
        description: "Drivers in El Paso face unique cross-border traffic challenges. Ensuring your total loss valuation accounts for the specific local market value in West Texas is critical.",
        zipCodes: ["79901", "79902", "79903", "79904", "79905"],
        medicalResources: [
            { name: "The Joint Chiropractic - El Paso", link: "https://www.thejoint.com/texas/el-paso/", note: "West and East side locations available." },
            { name: "Texas Pain & Injury - El Paso", link: "https://texaspainandinjury.com/locations/el-paso/", note: "Focused pain relief for El Paso accident victims." }
        ]
    }
];
