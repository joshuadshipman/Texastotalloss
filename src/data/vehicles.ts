export interface VehicleHierarchy {
    [year: string]: {
        [make: string]: {
            [model: string]: string[]; // Array of Trims
        };
    };
}

export const VEHICLE_DATA: VehicleHierarchy = {
    "2025": {
        "Toyota": {
            "Camry": ["LE", "SE", "XLE", "XSE", "TRD"],
            "RAV4": ["LE", "XLE", "Adventure", "TRD Off-Road", "Limited"],
            "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "Pro"],
            "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794", "TRD Pro", "Capstone"]
        },
        "Honda": {
            "Civic": ["LX", "Sport", "EX", "Touring", "Si", "Type R"],
            "Accord": ["LX", "Sport", "EX-L", "Touring"],
            "CR-V": ["LX", "Special Edition", "EX", "EX-L", "Touring"],
            "Pilot": ["Sport", "EX-L", "Special Edition", "Touring", "Elite", "Black Edition"]
        },
        "Ford": {
            "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor"],
            "Explorer": ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "King Ranch", "Platinum"],
            "Mustang": ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Mach 1", "Shelby GT500"],
            "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor"]
        },
        "Chevrolet": {
            "Silverado 1500": ["WT", "Custom", "LT", "RST", "LTZ", "High Country", "ZR2"],
            "Tahoe": ["LS", "LT", "RST", "Z71", "Premier", "High Country"],
            "Malibu": ["LS", "RS", "LT", "Premier"],
            "Equinox": ["LS", "LT", "RS", "Premier"]
        },
        "Nissan": {
            "Altima": ["S", "SV", "SR", "SL", "Platinum"],
            "Rogue": ["S", "SV", "SL", "Platinum"],
            "Sentra": ["S", "SV", "SR"],
            "Frontier": ["S", "SV", "Long Bed SV", "PRO-X", "PRO-4X"]
        }
    },
    "2024": {
        "Toyota": {
            "Camry": ["LE", "SE", "XLE", "XSE", "TRD"],
            "RAV4": ["LE", "XLE", "Adventure", "TRD Off-Road", "Limited"],
            "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "Pro"],
            "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794", "TRD Pro", "Capstone"]
        },
        "Honda": {
            "Civic": ["LX", "Sport", "EX", "Touring", "Si", "Type R"],
            "Accord": ["LX", "Sport", "EX-L", "Touring"],
            "CR-V": ["LX", "Special Edition", "EX", "EX-L", "Touring"],
            "Pilot": ["Sport", "EX-L", "Special Edition", "Touring", "Elite", "Black Edition"]
        },
        "Ford": {
            "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor"],
            "Explorer": ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "King Ranch", "Platinum"],
            "Mustang": ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Mach 1", "Shelby GT500"],
            "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor"]
        },
        "Chevrolet": {
            "Silverado 1500": ["WT", "Custom", "LT", "RST", "LTZ", "High Country", "ZR2"],
            "Tahoe": ["LS", "LT", "RST", "Z71", "Premier", "High Country"],
            "Malibu": ["LS", "RS", "LT", "Premier"],
            "Equinox": ["LS", "LT", "RS", "Premier"]
        },
        "Nissan": {
            "Altima": ["S", "SV", "SR", "SL", "Platinum"],
            "Rogue": ["S", "SV", "SL", "Platinum"],
            "Sentra": ["S", "SV", "SR"],
            "Frontier": ["S", "SV", "Long Bed SV", "PRO-X", "PRO-4X"]
        }
    },
    "2023": {
        "Toyota": {
            "Camry": ["LE", "SE", "XLE", "XSE", "TRD"],
            "RAV4": ["LE", "XLE", "Adventure", "TRD Off-Road", "Limited"],
            "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "Pro"],
            "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794", "TRD Pro", "Capstone"]
        },
        "Honda": {
            "Civic": ["LX", "Sport", "EX", "Touring", "Si", "Type R"],
            "Accord": ["LX", "Sport", "EX-L", "Touring"],
            "CR-V": ["LX", "Special Edition", "EX", "EX-L", "Touring"],
            "Pilot": ["Sport", "EX-L", "Special Edition", "Touring", "Elite", "Black Edition"]
        },
        "Ford": {
            "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor"],
            "Explorer": ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "King Ranch", "Platinum"],
            "Mustang": ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Mach 1", "Shelby GT500"],
            "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor"]
        },
        "Chevrolet": {
            "Silverado 1500": ["WT", "Custom", "LT", "RST", "LTZ", "High Country", "ZR2"],
            "Tahoe": ["LS", "LT", "RST", "Z71", "Premier", "High Country"],
            "Malibu": ["LS", "RS", "LT", "Premier"],
            "Equinox": ["LS", "LT", "RS", "Premier"]
        },
        "Nissan": {
            "Altima": ["S", "SV", "SR", "SL", "Platinum"],
            "Rogue": ["S", "SV", "SL", "Platinum"],
            "Sentra": ["S", "SV", "SR"],
            "Frontier": ["S", "SV", "Long Bed SV", "PRO-X", "PRO-4X"]
        }
    },
    "2022": {
        "Toyota": {
            "Camry": ["LE", "SE", "XLE", "XSE", "TRD"],
            "RAV4": ["LE", "XLE", "Adventure", "TRD Off-Road", "Limited"],
            "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "Pro"],
            "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794", "TRD Pro", "Capstone"]
        },
        "Honda": {
            "Civic": ["LX", "Sport", "EX", "Touring", "Si", "Type R"],
            "Accord": ["LX", "Sport", "EX-L", "Touring"],
            "CR-V": ["LX", "Special Edition", "EX", "EX-L", "Touring"],
            "Pilot": ["Sport", "EX-L", "Special Edition", "Touring", "Elite", "Black Edition"]
        },
        "Ford": {
            "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor"],
            "Explorer": ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "King Ranch", "Platinum"],
            "Mustang": ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Mach 1", "Shelby GT500"],
            "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor"]
        },
        "Chevrolet": {
            "Silverado 1500": ["WT", "Custom", "LT", "RST", "LTZ", "High Country", "ZR2"],
            "Tahoe": ["LS", "LT", "RST", "Z71", "Premier", "High Country"],
            "Malibu": ["LS", "RS", "LT", "Premier"],
            "Equinox": ["LS", "LT", "RS", "Premier"]
        },
        "Nissan": {
            "Altima": ["S", "SV", "SR", "SL", "Platinum"],
            "Rogue": ["S", "SV", "SL", "Platinum"],
            "Sentra": ["S", "SV", "SR"],
            "Frontier": ["S", "SV", "Long Bed SV", "PRO-X", "PRO-4X"]
        }
    },
    "2021": {
        "Toyota": {
            "Camry": ["LE", "SE", "XLE", "XSE", "TRD"],
            "RAV4": ["LE", "XLE", "Adventure", "TRD Off-Road", "Limited"],
            "Tacoma": ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "Pro"],
            "Tundra": ["SR", "SR5", "Limited", "Platinum", "1794", "TRD Pro", "Capstone"]
        },
        "Honda": {
            "Civic": ["LX", "Sport", "EX", "Touring", "Si", "Type R"],
            "Accord": ["LX", "Sport", "EX-L", "Touring"],
            "CR-V": ["LX", "Special Edition", "EX", "EX-L", "Touring"],
            "Pilot": ["Sport", "EX-L", "Special Edition", "Touring", "Elite", "Black Edition"]
        },
        "Ford": {
            "F-150": ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited", "Tremor", "Raptor"],
            "Explorer": ["Base", "XLT", "ST-Line", "Limited", "Timberline", "ST", "King Ranch", "Platinum"],
            "Mustang": ["EcoBoost", "EcoBoost Premium", "GT", "GT Premium", "Mach 1", "Shelby GT500"],
            "Bronco": ["Base", "Big Bend", "Black Diamond", "Outer Banks", "Badlands", "Wildtrak", "Everglades", "Raptor"]
        },
        "Chevrolet": {
            "Silverado 1500": ["WT", "Custom", "LT", "RST", "LTZ", "High Country", "ZR2"],
            "Tahoe": ["LS", "LT", "RST", "Z71", "Premier", "High Country"],
            "Malibu": ["LS", "RS", "LT", "Premier"],
            "Equinox": ["LS", "LT", "RS", "Premier"]
        },
        "Nissan": {
            "Altima": ["S", "SV", "SR", "SL", "Platinum"],
            "Rogue": ["S", "SV", "SL", "Platinum"],
            "Sentra": ["S", "SV", "SR"],
            "Frontier": ["S", "SV", "Long Bed SV", "PRO-X", "PRO-4X"]
        }
    }
};
