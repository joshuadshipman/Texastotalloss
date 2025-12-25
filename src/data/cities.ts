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
    },
    // --- DFW EXPANSION ---
    {
        slug: 'plano',
        translations: {
            en: { name: 'Plano', county: 'Collin', description: "Plano's corporate headquarters and busy tollways like DNT and 121 create high-risk accident zones." },
            es: { name: 'Plano', county: 'Collin', description: "Las sedes corporativas de Plano y las autopistas concurridas crean zonas de alto riesgo de accidentes." }
        },
        coordinates: { latitude: 33.0198, longitude: -96.6989 },
        zipCodes: ["75023", "75024", "75025", "75074", "75075", "75093"],
        medicalResources: [{ name: "Texas Health Presbyterian Plano", link: "https://www.texashealth.org", note: "Trauma Care" }]
    },
    {
        slug: 'murphy',
        translations: {
            en: { name: 'Murphy', county: 'Collin', description: "Murphy's rapid residential growth means more traffic on FM 544 and increased neighborhood collisions." },
            es: { name: 'Murphy', county: 'Collin', description: "El rápido crecimiento residencial de Murphy significa más tráfico en FM 544 y más choques." }
        },
        coordinates: { latitude: 33.0151, longitude: -96.6131 },
        zipCodes: ["75094"],
        medicalResources: [{ name: "Methodist Richardson (Nearby)", link: "https://methodisthealth.org", note: "Emergency Services" }]
    },
    {
        slug: 'venus',
        translations: {
            en: { name: 'Venus', county: 'Johnson/Ellis', description: "Venus connects major rural routes where high-speed highway accidents are common and dangerous." },
            es: { name: 'Venus', county: 'Johnson/Ellis', description: "Venus conecta rutas rurales importantes donde los accidentes de alta velocidad son comunes." }
        },
        coordinates: { latitude: 32.48, longitude: -97.18 },
        zipCodes: ["76084"],
        medicalResources: [{ name: "Texas Health Huguley", link: "https://www.texashealth.org", note: "Nearest Major Hospital" }]
    },
    {
        slug: 'mansfield',
        translations: {
            en: { name: 'Mansfield', county: 'Tarrant', description: "Mansfield's boom has led to congestion on US 287. We face aggressive adjusters here daily." },
            es: { name: 'Mansfield', county: 'Tarrant', description: "El auge de Mansfield ha provocado congestión en la US 287. Enfrentamos ajustadores agresivos aquí a diario." }
        },
        coordinates: { latitude: 32.5635, longitude: -97.1420 },
        zipCodes: ["76063"],
        medicalResources: [{ name: "Methodist Mansfield Medical Center", link: "https://methodisthealth.org", note: "Full Service Hospital" }]
    },
    {
        slug: 'fort-worth',
        translations: {
            en: { name: 'Fort Worth', county: 'Tarrant', description: "Fort Worth's mix of I-35W trucking traffic and city commuters creates complex liability accidents." },
            es: { name: 'Fort Worth', county: 'Tarrant', description: "La mezcla de tráfico de camiones I-35W y viajeros en Fort Worth crea accidentes de responsabilidad compleja." }
        },
        coordinates: { latitude: 32.7555, longitude: -97.3308 },
        zipCodes: ["76102", "76104", "76107"],
        medicalResources: [{ name: "JPS Health Network", link: "https://www.jpshealthnet.org", note: "Level 1 Trauma Center" }]
    },
    {
        slug: 'arlington',
        translations: {
            en: { name: 'Arlington', county: 'Tarrant', description: "Home to the stadiums and I-30, Arlington sees massive event traffic and severe rear-end collisions." },
            es: { name: 'Arlington', county: 'Tarrant', description: "Hogar de los estadios y la I-30, Arlington ve tráfico masivo de eventos y colisiones graves." }
        },
        coordinates: { latitude: 32.7357, longitude: -97.1081 },
        zipCodes: ["76010", "76011"],
        medicalResources: [{ name: "Texas Health Arlington Memorial", link: "https://www.texashealth.org", note: "Emergency Care" }]
    },
    {
        slug: 'garland',
        translations: {
            en: { name: 'Garland', county: 'Dallas', description: "Garland's industrial corridors and I-635 proximity lead to frequent commercial vehicle accidents." },
            es: { name: 'Garland', county: 'Dallas', description: "Los corredores industriales de Garland y la proximidad a la I-635 provocan accidentes frecuentes." }
        },
        coordinates: { latitude: 32.9072, longitude: -96.6353 },
        zipCodes: ["75040", "75041"],
        medicalResources: [{ name: "Baylor Scott & White Garland", link: "https://www.bswhealth.com", note: "Full Service" }]
    },
    {
        slug: 'irving',
        translations: {
            en: { name: 'Irving', county: 'Dallas', description: "With DFW Airport nearby, Irving roads like 114 and 183 are hotspots for high-speed crashes." },
            es: { name: 'Irving', county: 'Dallas', description: "Con el aeropuerto DFW cerca, las carreteras de Irving como 114 y 183 son puntos críticos de choques." }
        },
        coordinates: { latitude: 32.8196, longitude: -96.9454 },
        zipCodes: ["75038", "75039"],
        medicalResources: [{ name: "Baylor Scott & White Irving", link: "https://www.bswhealth.com", note: "Emergency Room" }]
    },
    {
        slug: 'mckinney',
        translations: {
            en: { name: 'McKinney', county: 'Collin', description: "McKinney's rapid growth on US 75 has outpaced infrastructure, leading to frequent dangerous intersections." },
            es: { name: 'McKinney', county: 'Collin', description: "El rápido crecimiento de McKinney en la US 75 ha superado la infraestructura, creando cruces peligrosos." }
        },
        coordinates: { latitude: 33.2146, longitude: -96.6145 },
        zipCodes: ["75069", "75070"],
        medicalResources: [{ name: "Medical City McKinney", link: "https://medicalcityhealthcare.com", note: "Trauma & Emergency" }]
    },
    {
        slug: 'denton',
        translations: {
            en: { name: 'Denton', county: 'Denton', description: "University traffic and I-35 splits make Denton a unique area for student and commuter accidents." },
            es: { name: 'Denton', county: 'Denton', description: "El tráfico universitario y la división de la I-35 hacen de Denton un área única para accidentes." }
        },
        coordinates: { latitude: 33.2148, longitude: -97.1331 },
        zipCodes: ["76201", "76205"],
        medicalResources: [{ name: "Texas Health Presbyterian Denton", link: "https://www.texashealth.org", note: "Full Hospital Services" }]
    },
    {
        slug: 'richardson',
        translations: {
            en: { name: 'Richardson', county: 'Dallas', description: "The Telecom Corridor brings heavy commuter traffic to Richardson, increasing rush-hour collision risks." },
            es: { name: 'Richardson', county: 'Dallas', description: "El Corredor de Telecomunicaciones trae tráfico pesado a Richardson, aumentando el riesgo de choques." }
        },
        coordinates: { latitude: 32.9656, longitude: -96.7158 },
        zipCodes: ["75080", "75081"],
        medicalResources: [{ name: "Methodist Richardson", link: "https://methodisthealth.org", note: "ER & Trauma" }]
    },
    {
        slug: 'lewisville',
        translations: {
            en: { name: 'Lewisville', county: 'Denton', description: "Traffic bottlenecks on I-35E in Lewisville are notorious for producing multi-car pile-ups." },
            es: { name: 'Lewisville', county: 'Denton', description: "Los embotellamientos en la I-35E en Lewisville son notorios por producir choques múltiples." }
        },
        coordinates: { latitude: 33.0383, longitude: -97.0061 },
        zipCodes: ["75057", "75067"],
        medicalResources: [{ name: "Medical City Lewisville", link: "https://medicalcityhealthcare.com", note: "Emergency Services" }]
    },
    {
        slug: 'mesquite',
        translations: {
            en: { name: 'Mesquite', county: 'Dallas', description: "The Rodeo Capital's proximity to 635 and I-30/I-20 creates a dangerous mix of local and interstate traffic." },
            es: { name: 'Mesquite', county: 'Dallas', description: "La proximidad de Mesquite a 635 y I-30/I-20 crea una mezcla peligrosa de tráfico." }
        },
        coordinates: { latitude: 32.7828, longitude: -96.6100 },
        zipCodes: ["75149", "75150"],
        medicalResources: [{ name: "Dallas Regional Medical Center", link: "https://www.dallasregionalmedicalcenter.com", note: "Emergency Room" }]
    },
    {
        slug: 'grand-prairie',
        translations: {
            en: { name: 'Grand Prairie', county: 'Dallas/Tarrant', description: "Stretching between Dallas and Ft. Worth, Grand Prairie sees diverse accident types on I-30 and I-20." },
            es: { name: 'Grand Prairie', county: 'Dallas/Tarrant', description: "Extendiéndose entre Dallas y Ft. Worth, Grand Prairie ve diversos tipos de accidentes." }
        },
        coordinates: { latitude: 32.7460, longitude: -96.9978 },
        zipCodes: ["75050", "75051", "75052"],
        medicalResources: [{ name: "Medical City ER Grand Prairie", link: "https://medicalcityhealthcare.com", note: "Emergency Care" }]
    },

    // --- HOUSTON METRO EXPANSION ---
    {
        slug: 'pasadena',
        translations: {
            en: { name: 'Pasadena', county: 'Harris', description: "Refinery traffic and HWY 225 make Pasadena roads hazardous for passenger vehicles." },
            es: { name: 'Pasadena', county: 'Harris', description: "El tráfico de refinerías y la HWY 225 hacen que las carreteras de Pasadena sean peligrosas." }
        },
        coordinates: { latitude: 29.6911, longitude: -95.2091 },
        zipCodes: ["77502", "77506"],
        medicalResources: [{ name: "HCA Houston Healthcare Southeast", link: "https://hcahoustonhealthcare.com", note: "Trauma & ER" }]
    },
    {
        slug: 'pearland',
        translations: {
            en: { name: 'Pearland', county: 'Brazoria', description: "Fast-growing Pearland faces increasing traffic on 288, leading to high-impact commuter accidents." },
            es: { name: 'Pearland', county: 'Brazoria', description: "Pearland enfrenta un tráfico creciente en la 288, lo que lleva a accidentes de alto impacto." }
        },
        coordinates: { latitude: 29.5636, longitude: -95.2861 },
        zipCodes: ["77581", "77584"],
        medicalResources: [{ name: "Memorial Hermann Pearland", link: "https://memorialhermann.org", note: "Hospital" }]
    },
    {
        slug: 'sugar-land',
        translations: {
            en: { name: 'Sugar Land', county: 'Fort Bend', description: "Sugar Land's Hwy 59 corridor is a frequent site of high-speed collisions and commercial truck accidents." },
            es: { name: 'Sugar Land', county: 'Fort Bend', description: "El corredor de la Hwy 59 de Sugar Land es un sitio frecuente de colisiones de alta velocidad." }
        },
        coordinates: { latitude: 29.6197, longitude: -95.6349 },
        zipCodes: ["77478", "77479"],
        medicalResources: [{ name: "Houston Methodist Sugar Land", link: "https://houstonmethodist.org", note: "Comprehensive Care" }]
    },
    {
        slug: 'cypress',
        translations: {
            en: { name: 'Cypress', county: 'Harris', description: "Cypress's expansion along 290 has created construction zone hazards and increased daily accidents." },
            es: { name: 'Cypress', county: 'Harris', description: "La expansión de Cypress a lo largo de la 290 ha creado peligros en zonas de construcción." }
        },
        coordinates: { latitude: 29.9691, longitude: -95.6972 },
        zipCodes: ["77429", "77433"],
        medicalResources: [{ name: "HCA Houston Healthcare North Cypress", link: "https://hcahoustonhealthcare.com", note: "ER & Medical" }]
    },
    {
        slug: 'katy',
        translations: {
            en: { name: 'Katy', county: 'Harris', description: "Katy's I-10 Energy Corridor is one of the busiest in the world, with frequent 18-wheeler involvements." },
            es: { name: 'Katy', county: 'Harris', description: "El Corredor de Energía I-10 de Katy es uno de los más concurridos del mundo." }
        },
        coordinates: { latitude: 29.7858, longitude: -95.8244 },
        zipCodes: ["77449", "77494"],
        medicalResources: [{ name: "Memorial Hermann Katy", link: "https://memorialhermann.org", note: "Trauma Center" }]
    },

    // --- AUSTIN & SAN ANTONIO METRO ---
    {
        slug: 'round-rock',
        translations: {
            en: { name: 'Round Rock', county: 'Williamson', description: "I-35 through Round Rock is notoriously congested, leading to daily fender benders and severe crashes." },
            es: { name: 'Round Rock', county: 'Williamson', description: "La I-35 a través de Round Rock está notoriamente congestionada, lo que lleva a choques diarios." }
        },
        coordinates: { latitude: 30.5083, longitude: -97.6789 },
        zipCodes: ["78664", "78665"],
        medicalResources: [{ name: "Baylor Scott & White Round Rock", link: "https://www.bswhealth.com", note: "Medical Center" }]
    },
    {
        slug: 'cedar-park',
        translations: {
            en: { name: 'Cedar Park', county: 'Williamson', description: "Cedar Park's 183A Toll road invites high speeds, while local arterials see frequent intersection crashes." },
            es: { name: 'Cedar Park', county: 'Williamson', description: "La carretera de peaje 183A de Cedar Park invita a altas velocidades y choques frecuentes." }
        },
        coordinates: { latitude: 30.5052, longitude: -97.8203 },
        zipCodes: ["78613"],
        medicalResources: [{ name: "Cedar Park Regional Medical Center", link: "https://www.cedarparkregional.com", note: "Emergency Sevices" }]
    },
    {
        slug: 'new-braunfels',
        translations: {
            en: { name: 'New Braunfels', county: 'Comal', description: "Situated between Austin and San Antonio on I-35, New Braunfels sees massive tourist and truck traffic." },
            es: { name: 'New Braunfels', county: 'Comal', description: "Situado entre Austin y San Antonio en la I-35, New Braunfels ve tráfico masivo." }
        },
        coordinates: { latitude: 29.7000, longitude: -98.1167 },
        zipCodes: ["78130", "78132"],
        medicalResources: [{ name: "Christus Santa Rosa New Braunfels", link: "https://www.christushealth.org", note: "Full Service" }]
    },
    {
        slug: 'desoto',
        translations: {
            en: { name: 'DeSoto', county: 'Dallas', description: "DeSoto's location on I-35E South makes it a high-traffic corridor for heavy truck and commuter accidents." },
            es: { name: 'DeSoto', county: 'Dallas', description: "La ubicación de DeSoto en la I-35E Sur lo convierte en un corredor de alto tráfico para accidentes." }
        },
        coordinates: { latitude: 32.5899, longitude: -96.8570 },
        zipCodes: ["75115", "75123"],
        medicalResources: [{ name: "Methodist Charlton Medical Center", link: "https://methodisthealth.org", note: "Emergency Care" }]
    },
    {
        slug: 'the-woodlands',
        translations: {
            en: { name: 'The Woodlands', county: 'Montgomery', description: "The Woodlands sees heavy congestion on I-45. High-speed collisions are common in this growing metro area." },
            es: { name: 'The Woodlands', county: 'Montgomery', description: "The Woodlands ve una gran congestión en la I-45. Las colisiones de alta velocidad son comunes." }
        },
        coordinates: { latitude: 30.1658, longitude: -95.4613 },
        zipCodes: ["77380", "77381", "77382"],
        medicalResources: [{ name: "Memorial Hermann The Woodlands", link: "https://memorialhermann.org", note: "Level II Trauma" }]
    }
];
