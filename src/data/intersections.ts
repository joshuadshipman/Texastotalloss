export interface Intersection {
    slug: string;
    title: string;
    city: string;
    region: string;
    description?: string;
}

export const intersections: Intersection[] = [
    // --- Statewide Standouts (NEW) ---
    {
        slug: 'us-90-fm-1413-liberty-county',
        title: 'US-90 & FM 1413',
        city: 'Dayton (Liberty County)',
        region: 'Texas Statewide',
        description: 'Identified in national studies as one of the deadliest intersections in the U.S. due to high-speed collisions.'
    },
    {
        slug: 'fm-866-sh-302-ector-county',
        title: 'FM 866 & SH-302',
        city: 'Odessa (Ector County)',
        region: 'Texas Statewide',
        description: 'A notorious oilfield corridor with multiple fatal 18-wheeler crashes and heavy industrial traffic.'
    },
    {
        slug: 'fm-1960-sh-249-houston',
        title: 'FM 1960 & SH-249',
        city: 'Houston',
        region: 'Houston Area',
        description: 'Very high crash counts at this busy suburban commercial node in Harris County.'
    },
    {
        slug: 'i-35-ben-white-austin',
        title: 'I-35 & Ben White Blvd (US-290)',
        city: 'Austin',
        region: 'Austin Area',
        description: 'One of Austin’s highest-crash freeway interchanges, frequented by heavy commuter and traveler traffic.'
    },
    {
        slug: 'buckner-elam-dallas',
        title: 'Buckner Blvd & Elam Rd',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'A specific high-crash intersection along the dangerous Buckner loop, known for pedestrian incidents.'
    },

    // --- Dallas & Suburbs ---
    {
        slug: 'i-635-skillman-dallas',
        title: 'I-635 (LBJ Fwy) & Skillman St',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'A critical interchange on the LBJ Freeway known for high-speed merges and congestion-related rear-end collisions.'
    },
    {
        slug: 'i-635-midway-dallas',
        title: 'I-635 & Midway Rd',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'Frequent accidents occur here due to construction zones and confusing lane shifts on the LBJ corridor.'
    },
    {
        slug: 'i-30-loop-12-dallas',
        title: 'I-30 & Loop 12 (TX-12)',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'A major bottleneck where commuter traffic meets interstate speeds, leading to severe multi-vehicle pileups.'
    },
    {
        slug: 'loop-12-tx-348-dallas',
        title: 'Loop 12 (TX-12) & TX-348 Spur',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'Complex intersections and signal timing often contribute to side-impact collisions at this location.'
    },
    {
        slug: 'buckner-blvd-corridor',
        title: 'Buckner Blvd Corridor',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'From Lake June Rd to Great Trinity Forest Way, this stretch is notoriously dangerous for pedestrians and cross-traffic.'
    },
    {
        slug: 'northwest-hwy-walton-walker-hines',
        title: 'Northwest Hwy (SH 12)',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'From N Walton Walker Blvd to Harry Hines Blvd, this busy commercial corridor sees frequent accidents involving distracted drivers.'
    },
    {
        slug: 'i-20-wheatland-dallas',
        title: 'I-20 & Wheatland Rd',
        city: 'Dallas',
        region: 'Dallas Area',
        description: 'High-speed trucking traffic mixes with local commuters, creating a hotspot for severe 18-wheeler accidents.'
    },
    {
        slug: 'us-75-lovers-ln-university-park',
        title: 'US-75 & Lovers Ln',
        city: 'University Park',
        region: 'Dallas Area',
        description: 'Congestion from NorthPark Center and commuters often leads to rear-end collisions on the main highway.'
    },
    {
        slug: 'belt-line-dallas-pkwy-addison',
        title: 'Belt Line Rd & Dallas Pkwy',
        city: 'Addison',
        region: 'Dallas Area',
        description: 'A high-volume intersection involving tollway exits where speed and red-light running are common issues.'
    },
    {
        slug: 'belt-line-preston-north-dallas',
        title: 'Belt Line Rd & Preston Rd',
        city: 'North Dallas/Addison',
        region: 'Dallas Area',
        description: 'One of the busiest intersections in North Dallas, frequent fender benders and intersection blockage occur here.'
    },
    {
        slug: 'belt-line-midway-addison',
        title: 'Belt Line Rd & Midway Rd',
        city: 'Addison',
        region: 'Dallas Area',
        description: 'Heavy dining and nightlife traffic contributes to late-night accidents and distracted driving incidents.'
    },
    {
        slug: 'park-blvd-preston-plano',
        title: 'Park Blvd & Preston Rd',
        city: 'Plano',
        region: 'Dallas Area',
        description: 'Wide lanes and high speeds in Plano often result in significant T-bone collisions at this major crossing.'
    },
    {
        slug: 'sh-121-preston-frisco',
        title: 'SH-121 & Preston Rd',
        city: 'Frisco/Plano',
        region: 'Dallas Area',
        description: 'Explosive growth in Frisco has made this intersection a hotspot for significant crashes due to heavy congestion.'
    },

    // --- Fort Worth Area ---
    {
        slug: 'i-35w-sh-183-fort-worth',
        title: 'I-35W & SH-183',
        city: 'Fort Worth',
        region: 'Tarrant County',
        description: 'A major convergence of highways in Haltom City, known for confusing lane changes and high-speed wrecks.'
    },
    {
        slug: 'i-30-i-35w-central-fort-worth',
        title: 'I-30 & I-35W (The Mixmaster)',
        city: 'Fort Worth',
        region: 'Tarrant County',
        description: 'Central Fort Worth’s main interchange, where confusing exits and heavy volume lead to frequent sideswipes.'
    },
    {
        slug: 'i-30-eastchase-fort-worth',
        title: 'I-30 & Eastchase Pkwy',
        city: 'Fort Worth',
        region: 'Tarrant County',
        description: 'A key exit for East Fort Worth, often seeing accidents due to speed differentials between exiting and highway traffic.'
    },
    {
        slug: 'east-lancaster-riverside-fort-worth',
        title: 'East Lancaster Ave & Riverside Dr',
        city: 'Fort Worth',
        region: 'Tarrant County',
        description: 'An urban intersection with high pedestrian activity and frequent vehicle collisions.'
    },
    {
        slug: 'hulen-st-i-20-fort-worth',
        title: 'Hulen St & I-20',
        city: 'Fort Worth',
        region: 'Tarrant County',
        description: 'Shopping center traffic meets interstate travelers, creating a high-risk zone for rear-end and turning accidents.'
    },

    // --- Arlington Hotspots ---
    {
        slug: 'i-20-south-cooper-arlington',
        title: 'I-20 & South Cooper St',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'Heavy mix of freeway exits and retail traffic; recurring on "most dangerous" lists.'
    },
    {
        slug: 'i-30-collins-arlington',
        title: 'I-30 & Collins St',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'Near AT&T Stadium and entertainment district; congestion and complex merging lead to frequent crashes.'
    },
    {
        slug: 'matlock-i-20-arlington',
        title: 'Matlock Rd & I-20',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'Major logistics/warehouse corridor with heavy truck movements and interstate crossover traffic.'
    },
    {
        slug: 'matlock-pioneer-pkwy-arlington',
        title: 'Matlock Rd & Pioneer Pkwy',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'Frequent starting/stopping and tight sightlines contribute to accidents at this busy junction.'
    },
    {
        slug: 'sh-360-division-arlington',
        title: 'SH-360 & E Division St',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'High speeds, heavy traffic, and poor signage are cited as major risk factors here.'
    },
    {
        slug: 'i-30-sh-360-arlington',
        title: 'I-30 & SH-360 Interchange',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'High-volume freeway interchange near stadiums and Six Flags, notorious for confusion and speed-related crashes.'
    },
    {
        slug: 'watson-six-flags-arlington',
        title: 'Watson Rd & Six Flags Dr',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'Historically one of the highest crash count intersections in Tarrant County (127 crashes in one study).'
    },
    {
        slug: 'watson-abram-arlington',
        title: 'Watson Rd & Abram St',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'A major crash hotspot, ranking second-highest in previous county safety studies.'
    },
    {
        slug: 'park-springs-sublett-arlington',
        title: 'Park Springs Blvd & Sublett Rd',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'Recently noted in coverage of serious pedestrian and fatal crashes.'
    },
    {
        slug: 'pleasant-ridge-cooper-arlington',
        title: 'Pleasant Ridge Rd & S Cooper St',
        city: 'Arlington',
        region: 'Tarrant County',
        description: 'By The Parks Mall, frequently cited locally as problematic for congestion and crashes.'
    },

    // --- Irving Hotspots ---
    {
        slug: 'sh-183-sh-114-irving',
        title: 'SH-183 & SH-114 Interchange',
        city: 'Irving',
        region: 'Dallas/Irving',
        description: 'Complex, high-speed traffic with frequent weaving makes this airport interchange extremely hazardous.'
    },
    {
        slug: 'sh-183-sh-161-irving',
        title: 'SH-183 & SH-161 (PGBT)',
        city: 'Irving',
        region: 'Dallas/Irving',
        description: 'Heavy regional traffic and lane changes between freeways lead to high-impact collisions.'
    },
    {
        slug: 'sh-183-oconnor-irving',
        title: 'SH-183 & O’Connor Rd',
        city: 'Irving',
        region: 'Dallas/Irving',
        description: 'Older design, high traffic volumes, and short merges create a consistent crash corridor.'
    },
    {
        slug: 'sh-183-macarthur-irving',
        title: 'SH-183 & MacArthur Blvd',
        city: 'Irving',
        region: 'Dallas/Irving',
        description: 'Major commercial corridor with high turning volumes and close-spaced ramps/frontage roads.'
    },
    {
        slug: 'sh-114-loop-12-irving',
        title: 'SH-114 & Loop 12/TX-183',
        city: 'Irving',
        region: 'Dallas/Irving',
        description: 'Near the old Texas Stadium area, overlapping ramps cause high crash rates for both cars and trucks.'
    },
    {
        slug: 'loop-12-shady-grove-irving',
        title: 'Loop 12 & Shady Grove Rd',
        city: 'Irving',
        region: 'Dallas/Irving',
        description: 'Busy arterial intersection with a history of serious collisions.'
    },

    // --- Austin Hotspots ---
    {
        slug: 'i-35-east-riverside-austin',
        title: 'I-35 & East Riverside Dr',
        city: 'Austin',
        region: 'Austin Area',
        description: 'Often listed as Austin’s single most crash-heavy intersection, with several hundred crashes over recent years.'
    },
    {
        slug: 'slaughter-manchaca-austin',
        title: 'West Slaughter Ln & Manchaca Rd',
        city: 'Austin',
        region: 'Austin Area',
        description: 'Flagged by city and legal analyses as one of Austin’s most dangerous intersections.'
    },
    {
        slug: 'parmer-lamar-austin',
        title: 'Parmer Ln & N Lamar Blvd',
        city: 'Austin',
        region: 'Austin Area',
        description: 'Multiple lanes, high speeds, and frequent rear-end collisions occur here.'
    },
    {
        slug: 'cesar-chavez-pleasant-valley-austin',
        title: 'E Cesar Chavez St & Pleasant Valley Rd',
        city: 'Austin',
        region: 'Austin Area',
        description: 'Known for repeated pedestrian and bike injury crashes.'
    },
    {
        slug: 'us-183-cameron-austin',
        title: 'US-183 & Cameron Rd',
        city: 'Austin',
        region: 'Austin Area',
        description: 'Sees ~20+ crashes per year, including serious-injury cases along the service road.'
    },
    {
        slug: 'riverside-pleasant-valley-austin',
        title: 'Riverside Dr & S Pleasant Valley Rd',
        city: 'Austin',
        region: 'Austin Area',
        description: 'Around a dozen-plus crashes per year, including serious bike and motorcycle injuries.'
    },
    {
        slug: 'trinity-7th-austin',
        title: 'Trinity St & E 7th St',
        city: 'Austin',
        region: 'Austin Area',
        description: 'Repeatedly described as one of the worst pedestrian-crash intersections in Texas.'
    },

    // --- Houston Hotspots ---
    {
        slug: 'bissonnet-beltway-8-houston',
        title: 'Bissonnet St & Beltway 8',
        city: 'Houston',
        region: 'Houston Area',
        description: 'Often ranked as Houston’s single most dangerous intersection by crash volume and severity.'
    },
    {
        slug: 'bissonnet-westchester-houston',
        title: 'Bissonnet St & Westchester Ave',
        city: 'Houston',
        region: 'Houston Area',
        description: 'Over 100 crashes in recent years; top-ranked in several risk analyses.'
    },
    {
        slug: 'westheimer-beltway-8-houston',
        title: 'Westheimer Rd & Beltway 8',
        city: 'Houston',
        region: 'Houston Area',
        description: 'Heavy commercial traffic and complex intersections lead to multiple serious crashes.'
    },
    {
        slug: 'main-south-loop-houston',
        title: 'Main St & South Loop (I-610)',
        city: 'Houston',
        region: 'Houston Area',
        description: 'Consistently identified in top 10 most dangerous local media lists.'
    },
    {
        slug: 'pease-fannin-houston',
        title: 'Pease St & Fannin St',
        city: 'Houston',
        region: 'Houston Area',
        description: 'A downtown high-crash intersection with dozens of collisions annually.'
    },
    {
        slug: 'tidwell-airline-houston',
        title: 'Tidwell Rd & Airline Dr',
        city: 'Houston',
        region: 'Houston Area',
        description: 'High crash frequency tied to speeding and complex signal timing issues.'
    },
    {
        slug: 'westheimer-dairy-ashford-houston',
        title: 'Westheimer Rd & Dairy Ashford Rd',
        city: 'Houston',
        region: 'Houston Area',
        description: 'Major west-side commercial corridor intersection with significant crash counts.'
    },
    {
        slug: 'gessner-westview-houston',
        title: 'Gessner Rd & Westview Dr',
        city: 'Houston',
        region: 'Houston Area',
        description: 'Memorial area intersection seeing dozens of crashes per year.'
    },

    // --- San Antonio Hotspots ---
    {
        slug: 'loop-1604-us-281-san-antonio',
        title: 'Loop 1604 & US-281',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'Widely cited as one of the most dangerous interchanges due to volume, speed, and merging complexity.'
    },
    {
        slug: 'bandera-loop-410-san-antonio',
        title: 'Bandera Rd (SH-16) & Loop 410',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'High congestion from retail/residential traffic leads to frequent collisions.'
    },
    {
        slug: 'culebra-loop-1604-san-antonio',
        title: 'Culebra Rd & Loop 1604',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'Dozens of crashes annually; repeatedly labeled among the "deadliest" intersections.'
    },
    {
        slug: 'i-10-loop-1604-san-antonio',
        title: 'I-10 & Loop 1604',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'Major freeway interchange seeing around 90 crashes per year.'
    },
    {
        slug: 'us-90-loop-1604-san-antonio',
        title: 'US-90 & Loop 1604',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'Mix of high-speed highway traffic and local access results in 60-70 crashes annually.'
    },
    {
        slug: 'i-10-wurzbach-san-antonio',
        title: 'I-10 & Wurzbach Rd',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'Heavy residential/commercial mix and turning-movement issues.'
    },
    {
        slug: 'zarzamora-culebra-san-antonio',
        title: 'Zarzamora St & Culebra Rd',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'Repeatedly flagged for frequent collisions and signal/signage issues.'
    },
    {
        slug: 'nogalitos-sw-military-san-antonio',
        title: 'Nogalitos St & SW Military Dr',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'South-side node on a high-injury segment.'
    },
    {
        slug: 'southcross-new-braunfels-san-antonio',
        title: 'E Southcross Blvd & S New Braunfels Ave',
        city: 'San Antonio',
        region: 'San Antonio Area',
        description: 'Another high-risk south-side intersection.'
    }
];
