export interface CityData {
    slug: string;
    translations: {
        [key: string]: {
            name: string;
            description: string;
            county: string;
        }
    };
    coordinates: {
        latitude: number;
        longitude: number;
    };
    zipCodes: string[];
    subCities?: string[]; // Slugs of child cities
    parentCity?: string; // Slug of parent city
    resources?: {
        towing: LocalBusiness[];
        repair: LocalBusiness[];
        rental: LocalBusiness[];
    };
    medicalResources: LocalBusiness[];
    hotspots?: {
        name: string;
        slug: string;
    }[];
}

export interface LocalBusiness {
    name: string;
    link: string;
    note: string;
    rating?: number; // 4.5 etc
    phone?: string;
}

export const cities: CityData[] = [
    // --- DALLAS METRO ---
    {
        slug: 'dallas',
        translations: {
            en: {
                name: 'Dallas',
                county: 'Dallas',
                description: "Navigating total loss claims in DFW requires understanding specific Dallas County valuations. The mix of high-speed tollways and congestion leads to severe multi-vehicle accidents."
            },
            es: {
                name: 'Dallas',
                county: 'Dallas',
                description: "Navegar reclamos de pérdida total en DFW requiere entender las valoraciones del condado de Dallas. La mezcla de autopistas y congestión lleva a accidentes graves."
            }
        },
        coordinates: { latitude: 32.7767, longitude: -96.7970 },
        zipCodes: ["75201", "75202", "75203", "75204", "75205"],
        subCities: ['plano', 'mesquite', 'desoto', 'irving', 'garland'],
        medicalResources: [
            { name: "Accident & Injury Chiropractic", link: "https://accidentandinjury.com/", note: "19 Locations in DFW focusing purely on auto accident recovery." },
            { name: "The Joint Chiropractic - Dallas", link: "https://www.thejoint.com/texas/dallas/", note: "Convenient locations in Uptown, Preston Hollow, and White Rock." }
        ],
        resources: {
            towing: [
                { name: "Walnut Hill Wrecker", link: "https://walnuthillwrecker.com", note: "24/7 Service", rating: 4.8 },
                { name: "Dallas Tow Boys", link: "#", note: "Fast response in downtown", rating: 4.7 }
            ],
            repair: [
                { name: "Service King Collision", link: "https://www.serviceking.com", note: "National warranty", rating: 4.5 }
            ],
            rental: [
                { name: "Enterprise Rent-A-Car", link: "https://www.enterprise.com", note: "Multiple DFW locations", rating: 4.6 }
            ]
        }
    },
    // --- FRISCO (Primary) ---
    {
        slug: 'frisco',
        translations: {
            en: {
                name: 'Frisco', county: 'Collin',
                description: "Frisco's rapid expansion along the Dallas North Tollway has led to increased high-speed accidents. We help Frisco residents get fair value for their luxury and family vehicles."
            },
            es: {
                name: 'Frisco', county: 'Collin',
                description: "La rápida expansión de Frisco a lo largo de Dallas North Tollway ha llevado a más accidentes de alta velocidad. Ayudamos a los residentes de Frisco a obtener un valor justo."
            }
        },
        coordinates: { latitude: 33.1507, longitude: -96.8236 },
        zipCodes: ["75033", "75034", "75035"],
        subCities: ['little-elm', 'prosper', 'celina', 'the-colony'],
        medicalResources: [
            { name: "Airrosti Frisco", link: "https://www.airrosti.com", note: "Soft tissue therapy" }
        ],
        resources: {
            towing: [{ name: "Frisco Towing Service", link: "#", note: "Local expert", rating: 4.9 }],
            repair: [{ name: "Frisco Paint & Body", link: "#", note: "High-end repairs", rating: 4.8 }],
            rental: [{ name: "Hertz Frisco", link: "#", note: "Near Stonebriar", rating: 4.5 }]
        }
    },
    // --- HOUSTON METRO ---
    {
        slug: 'houston',
        translations: {
            en: {
                name: 'Houston',
                county: 'Harris',
                description: "As the largest city in Texas, Houston's busy highways like I-45 and the 610 Loop see thousands of accidents annually. Harris County courts are notoriously tough on injury claims."
            },
            es: {
                name: 'Houston',
                county: 'Harris',
                description: "Como la ciudad más grande de Texas, las autopistas de Houston como la I-45 ven miles de accidentes anualmente."
            }
        },
        coordinates: { latitude: 29.7604, longitude: -95.3698 },
        zipCodes: ["77002", "77003"],
        subCities: ['the-woodlands', 'katy', 'sugar-land', 'pearland', 'pasadena'],
        medicalResources: [
            { name: "The Joint Chiropractic", link: "https://www.thejoint.com", note: "Houston wide" }
        ],
        resources: {
            towing: [{ name: "Milam's Towing", link: "#", note: "Heavy duty specialists", rating: 4.7 }],
            repair: [{ name: "Caliber Collision", link: "#", note: "Lifetime warranty", rating: 4.6 }],
            rental: [{ name: "Enterprise", link: "#", note: "Downtown & Airports", rating: 4.5 }]
        }
    },
    // --- AUSTIN METRO ---
    {
        slug: 'austin',
        translations: {
            en: {
                name: 'Austin',
                county: 'Travis',
                description: "Austin's rapid growth has increased traffic density on I-35. Travis County juries can be unpredictable, making documented evidence for your totaled car essential."
            },
            es: {
                name: 'Austin',
                county: 'Travis',
                description: "El rápido crecimiento de Austin ha aumentado el tráfico en la I-35."
            }
        },
        coordinates: { latitude: 30.2672, longitude: -97.7431 },
        zipCodes: ["78701", "78704"],
        subCities: ['bastrop', 'round-rock', 'pflugerville', 'cedar-park'],
        medicalResources: [
            { name: "Airrosti Austin", link: "https://www.airrosti.com", note: "Austin wide" }
        ],
        resources: {
            towing: [{ name: "Bulldog Towing", link: "#", note: "Quick response", rating: 4.8 }],
            repair: [{ name: "Austin Body Works", link: "#", note: "Local favorite", rating: 4.9 }],
            rental: [{ name: "Enterprise", link: "#", note: "South Congress", rating: 4.6 }]
        }
    },
    // --- SAN ANTONIO METRO ---
    {
        slug: 'san-antonio',
        translations: {
            en: {
                name: 'San Antonio',
                county: 'Bexar',
                description: "In San Antonio and Bexar County, insurance adjusters often undervalue trucks and SUVs. We help you fight for the true replacement value of your vehicle."
            },
            es: {
                name: 'San Antonio',
                county: 'Bexar',
                description: "En San Antonio y el condado de Bexar, los ajustadores a menudo subestiman camionetas y SUVs. Ayudamos a luchar por el valor real de reemplazo."
            }
        },
        coordinates: { latitude: 29.4241, longitude: -98.4936 },
        zipCodes: ["78201", "78202", "78203", "78204", "78205"],
        medicalResources: [
            { name: "Texas Pain & Injury", link: "https://texaspainandinjury.com/locations/san-antonio/", note: "Dedicated centers for accident injury across San Antonio." },
            { name: "The Joint Chiropractic - San Antonio", link: "https://www.thejoint.com/texas/san-antonio/", note: "Multiple clinics including Alamo Heights and Stone Oak." },
            { name: "Airrosti San Antonio", link: "https://www.airrosti.com/locations/san-antonio/", note: "Headquartered in SA with broad city-wide coverage." }
        ]
    },
    // --- FORT WORTH METRO ---
    {
        slug: 'fort-worth',
        translations: {
            en: {
                name: 'Fort Worth',
                county: 'Tarrant',
                description: "Tarrant County has its own localized legal landscape. If your car was totaled in Fort Worth, don't rely on generic advice; get help tailored to local carrier tactics."
            },
            es: {
                name: 'Fort Worth',
                county: 'Tarrant',
                description: "El condado de Tarrant tiene su propio panorama legal. Si su auto fue pérdida total en Fort Worth, obtenga ayuda adaptada a las tácticas locales."
            }
        },
        coordinates: { latitude: 32.7555, longitude: -97.3308 },
        zipCodes: ["76101", "76102", "76103", "76104", "76105"],
        medicalResources: [
            { name: "Accident Centers of Texas", link: "https://accidentcentersoftexas.com/", note: "12 Locations including South Fort Worth." },
            { name: "Premier Injury Clinics", link: "https://premierinjuryclinicsofdfw.com/", note: "Specializing in Fort Worth auto accident rehabilitation." },
            { name: "The Joint Chiropractic - Fort Worth", link: "https://www.thejoint.com/texas/fort-worth/", note: "Serving Cultural District and Hulen areas." }
        ]
    },
    {
        slug: 'el-paso',
        translations: {
            en: {
                name: 'El Paso',
                county: 'El Paso',
                description: "Drivers in El Paso face unique cross-border traffic challenges. Ensuring your total loss valuation accounts for the specific local market value in West Texas is critical."
            },
            es: {
                name: 'El Paso',
                county: 'El Paso',
                description: "Los conductores en El Paso enfrentan desafíos únicos. Asegurar que su valoración de pérdida total cuente con el valor de mercado local es crítico."
            }
        },
        coordinates: { latitude: 31.7619, longitude: -106.4850 },
        zipCodes: ["79901", "79902", "79903", "79904", "79905"],
        medicalResources: [
            { name: "The Joint Chiropractic - El Paso", link: "https://www.thejoint.com/texas/el-paso/", note: "West and East side locations available." },
            { name: "Texas Pain & Injury - El Paso", link: "https://texaspainandinjury.com/locations/el-paso/", note: "Focused pain relief for El Paso accident victims." }
        ]
    }
];
