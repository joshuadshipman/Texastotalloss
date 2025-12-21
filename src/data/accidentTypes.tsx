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
            { label: 'Fatality Increase', value: '+58%', sub: 'Since 2019 in Texas' },
            { label: 'Annual Deaths', value: '106+', sub: 'Texans killed in 2023' },
            { label: 'Risk Factor', value: 'High', sub: 'Little protection vs autos' }
        ],
        description: "Cyclists face extreme risks. Texas law requires drivers to yield, but negligence is common."
    },
    {
        id: 'drunk_driving',
        title: 'Drunk Driving',
        icon: WineIcon,
        color: 'bg-purple-600',
        stats: [
            { label: 'Annual Deaths', value: '1,053', sub: 'Lives lost in 2024' },
            { label: 'Fatal Factor', value: '25%', sub: 'Of all traffic deaths' },
            { label: 'Daily Toll', value: '3', sub: 'Texans die every day' }
        ],
        description: "DUI crashes are entirely preventable. We pursue maximum damages including punitive."
    },
    {
        id: 'head_on',
        title: 'Head-On Collisions',
        icon: CarFrontIcon,
        color: 'bg-red-700',
        stats: [
            { label: 'Fatalities', value: '~600', sub: 'Deaths per year in TX' },
            { label: 'Severity', value: 'Extreme', sub: 'Highest fatality rate' },
            { label: 'Common Cause', value: 'Drifting', sub: 'Distraction or sleep' }
        ],
        description: "The most deadly type of crash. Often caused by distracted driving or wrong-way errors."
    },
    {
        id: 'motorcycle',
        title: 'Motorcycle Crashes',
        icon: BikeIcon, // Using likely fallback, distinct from bicycle
        color: 'bg-orange-600',
        stats: [
            { label: 'Risk Multiplier', value: '27x', sub: 'More likely to die' },
            { label: 'Helmet Usage', value: '40%', sub: 'Of victims unhelmeted' },
            { label: 'Total Deaths', value: '599', sub: 'In 2023' }
        ],
        description: "Riders are vulnerable. Insurance often tries to blame the rider. We fight back."
    },
    {
        id: 'pedestrian',
        title: 'Pedestrian Accidents',
        icon: UserIcon,
        color: 'bg-yellow-600',
        stats: [
            { label: 'Total Deaths', value: '773', sub: 'Killed in 2024' },
            { label: 'Trend', value: '+22%', sub: 'Increase over 5 yrs' },
            { label: 'Danger Zone', value: 'Night', sub: 'Most frequent time' }
        ],
        description: "Pedestrians have the right of way. We hold negligent drivers accountable."
    },
    {
        id: 'rear_end',
        title: 'Rear-End Collisions',
        icon: CarIcon,
        color: 'bg-blue-600',
        stats: [
            { label: 'Frequency', value: '#1', sub: 'Most common crash' },
            { label: 'Whiplash', value: 'High', sub: 'Common hidden injury' },
            { label: 'Fault', value: 'Presumed', sub: 'Trailing driver usually liable' }
        ],
        description: "Common but dangerous. Whiplash and spinal injuries often appear days later."
    },
    {
        id: 'rideshare',
        title: 'Rideshare (Uber/Lyft)',
        icon: CarIcon,
        color: 'bg-pink-600',
        stats: [
            { label: 'Insurance Gap', value: 'Phase 1', sub: 'Waiting for ride' },
            { label: 'Policy Limit', value: '$1M', sub: 'When passenger on board' },
            { label: 'Complexity', value: 'High', sub: 'Multiple policies involved' }
        ],
        description: "Uber/Lyft cases involve complex insurance tiers. Don't let them deny coverage."
    },
    {
        id: 'rollover',
        title: 'Rollover Accidents',
        icon: CarIcon,
        color: 'bg-indigo-600',
        stats: [
            { label: 'Fatality Rate', value: '30%', sub: 'Of all crash deaths' },
            { label: 'Vehicle Type', value: 'SUV', sub: 'Higher center of gravity' },
            { label: 'Roof Crush', value: 'Risk', sub: 'Structural failure' }
        ],
        description: "SUVs and trucks are prone to rollovers. These accidents often cause catastrophic injuries."
    },
    {
        id: 'uninsured',
        title: 'Uninsured Motorist',
        icon: ShieldAlertIcon,
        color: 'bg-gray-700',
        stats: [
            { label: 'TX Rate', value: '20%', sub: 'Drivers without insurance' },
            { label: 'Your Policy', value: 'UM/UIM', sub: 'Crucial for recovery' },
            { label: 'Hit & Run', value: 'Covered', sub: 'Usually under UM' }
        ],
        description: "1 in 5 Texas drivers have no insurance. We help you access your own UM coverage."
    },
    {
        id: 'wrong_way',
        title: 'Wrong-Way Driving',
        icon: AlertTriangleIcon,
        color: 'bg-red-800',
        stats: [
            { label: 'Fatality', value: 'High', sub: 'Often head-on' },
            { label: 'Impairment', value: '60%+', sub: 'Involve alcohol' },
            { label: 'Time', value: 'Night', sub: '2am - 5am peak' }
        ],
        description: "Extremely dangerous and often linked to intoxication. We aggressive pursue these cases."
    }
];
