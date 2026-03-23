import {
    BikeIcon, WineIcon, CarFrontIcon, CarIcon,
    UserIcon, ShieldAlertIcon, AlertTriangleIcon
} from 'lucide-react';

export const accidentTypes = [
    {
        id: 'bicycle',
        title: 'Bicycle Accidents',
        icon: BikeIcon,
        color: 'bg-green-600',
        stats: [
            { label: 'Fatalities H1 2025', value: '186', sub: 'Combined Ped/Cyclist' },
            { label: 'Trend 2026', value: 'Upward', sub: 'Rising statewide' },
            { label: 'Infrastructure', value: 'LPI', sub: 'New 2026 safety signals' }
        ],
        description: "Bicyclist fatalities are trending upward in Texas. We leverage 2026 safety data, including Leading Pedestrian Interval (LPI) signal failures, to hold negligent drivers accountable."
    },
    {
        id: 'drunk_driving',
        title: 'Drunk Driving',
        icon: WineIcon,
        color: 'bg-purple-600',
        stats: [
            { label: 'Annual Deaths', value: '1,053', sub: 'Lives lost in 2024' },
            { label: 'Tyler Dist 2025', value: '36', sub: 'Alcohol-related deaths' },
            { label: 'Fatal Factor', value: '25%+', sub: 'Of all traffic deaths' }
        ],
        description: "Alcohol and drug impairment remain a primary cause of Texas fatalities. We pursue maximum compensatory and punitive damages to ensure full justice for victims."
    },
    {
        id: 'head_on',
        title: 'Head-On Collisions',
        icon: CarFrontIcon,
        color: 'bg-red-700',
        stats: [
            { label: 'Tyler Dist 2025', value: '18', sub: 'Wrong-side fatalities' },
            { label: 'Severity', value: 'Extreme', sub: 'Highest fatality rate' },
            { label: 'Vehicle Weight', value: '+400lb', sub: 'Avg increase in 2025' }
        ],
        description: "The 2025 increase in average vehicle weight has made head-on collisions even more catastrophic. We analyze black box data to prove drift or distraction."
    },
    {
        id: 'motorcycle',
        title: 'Motorcycle Crashes',
        icon: BikeIcon,
        color: 'bg-orange-600',
        stats: [
            { label: 'Daily Toll', value: '1', sub: 'Death every day in TX' },
            { label: 'Total Deaths', value: '581', sub: 'In 2024' },
            { label: 'Injury Risk', value: '25x', sub: 'Higher vs auto occupants' }
        ],
        description: "Nearly one motorcyclist dies every day on Texas roads. Insurance companies often rely on 'visibility' excuses; we use traffic reconstruction to prove liability."
    },
    {
        id: 'pedestrian',
        title: 'Pedestrian Accidents',
        icon: UserIcon,
        color: 'bg-yellow-600',
        stats: [
            { label: 'Total Deaths', value: '773', sub: 'Killed in 2024' },
            { label: 'H1 2025 Crashes', value: '1,372', sub: 'Higher in urban zones' },
            { label: 'Austin 2026', value: '-18%', sub: 'Crash drop at LPI turns' }
        ],
        description: "Pedestrian fatalities increased significantly in 2024. Success in 2026 depends on analyzing lighting conditions, crosswalk compliance, and new signal technology."
    },
    {
        id: 'rear_end',
        title: 'Rear-End Collisions',
        icon: CarIcon,
        color: 'bg-blue-600',
        stats: [
            { label: 'Primary Cause', value: 'Tech', sub: 'Infotainment Overload' },
            { label: 'Hot Zones 2025', value: 'I-35/I-10', sub: 'Highest pileup frequency' },
            { label: 'Fault', value: '95%+', sub: 'Trailing driver liable' }
        ],
        description: "A major 2025-2026 trend is 'Infotainment Overload'—drivers distracted by complex touchscreens. We secure phone and vehicle logs to prove distraction."
    },
    {
        id: 'rideshare',
        title: 'Rideshare (Uber/Lyft)',
        icon: CarIcon,
        color: 'bg-pink-600',
        stats: [
            { label: 'Policy Limit', value: '$1M', sub: 'When ride is active' },
            { label: 'Complexity', value: 'High', sub: 'Multiple policy layers' },
            { label: 'Insurance Gap', value: 'Phase 1', sub: 'Waiting for requests' }
        ],
        description: "Rideshare accidents involve complex insurance 'periods.' We ensure you access the maximum $1M coverage when an app is active during the crash."
    },
    {
        id: 'rollover',
        title: 'Rollover Accidents',
        icon: CarIcon,
        color: 'bg-indigo-600',
        stats: [
            { label: 'Fatality Share', value: '29%', sub: 'Of all TX road deaths' },
            { label: 'Common Cause', value: 'Run-Off', sub: 'Single-vehicle crashes' },
            { label: 'Vehicle Type', value: 'Truck', sub: 'Higher rollover risk' }
        ],
        description: "Single-vehicle rollovers accounted for 29% of road deaths in 2025. We investigate road conditions and vehicle stability for potential third-party liability."
    },
    {
        id: 'uninsured',
        title: 'Uninsured Motorist',
        icon: ShieldAlertIcon,
        color: 'bg-gray-700',
        stats: [
            { label: 'TX Rate 2025', value: '14.5%', sub: 'Ranked worst in US' },
            { label: 'Coverage Gap', value: '50%', sub: 'Drivers underinsured' },
            { label: 'Hit & Run', value: 'UM/UIM', sub: 'Crucial for recovery' }
        ],
        description: "Texas ranks as one of the states with the highest share of uninsured drivers. We specialize in navigating UM/UIM claims when the at-fault party has no coverage."
    },
    {
        id: 'wrong_way',
        title: 'Wrong-Way Driving',
        icon: AlertTriangleIcon,
        color: 'bg-red-800',
        stats: [
            { label: 'Fatalities 25', value: '18+', sub: 'Tyler District only' },
            { label: 'Impairment', value: '60%+', sub: 'Involve alcohol/drugs' },
            { label: 'Peak Time', value: '2AM-5AM', sub: 'Highly fatal window' }
        ],
        description: "Wrong-way driving peaks between 2 AM and 5 AM and is almost always linked to intoxication. We aggressively pursue these cases for maximum client recovery."
    }
];
