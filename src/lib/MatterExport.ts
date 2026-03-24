/**
 * Matter Management Export Tool
 * 
 * Generates JSON/CSV payloads formatted for top legal platforms.
 * Targeted: Litify (Salesforce), MyCase, and Clio.
 */

export interface LeadData {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  accidentDate: string;
  vehicle: string;
  liabilityScore: string;
  injurySummary: string;
  attachments: string[];
}

/**
 * Formats a lead for Litify (Salesforce Referral format)
 */
export function formatForLitify(lead: LeadData) {
  return {
    Source: "Texas Total Loss",
    Lead_Name: lead.fullName,
    Mobile_Phone: lead.phone,
    Email: lead.email,
    Accident_Date: lead.accidentDate,
    Vehicle_Description: lead.vehicle,
    Custom_Liability_Score: lead.liabilityScore,
    Medical_Summary: lead.injurySummary,
    External_ID: lead.id,
    Evidence_Links: lead.attachments.join(", ")
  };
}

/**
 * Formats a lead for MyCase (CSV Import Format)
 */
export function formatForMyCase(lead: LeadData) {
  // MyCase usually takes a specific CSV header format
  return [
    lead.fullName,
    lead.email,
    lead.phone,
    `Texas Total Loss - ${lead.id}`,
    lead.accidentDate,
    lead.injurySummary,
    lead.attachments.join(" | ")
  ];
}

/**
 * Triggers a download of the JSON payload
 */
export function downloadMatterExport(lead: LeadData, platform: 'Litify' | 'MyCase' | 'Clio') {
  let data;
  if (platform === 'Litify') data = formatForLitify(lead);
  else data = lead; // Generic for others currently

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TTL_Export_${platform}_${lead.id}.json`;
  a.click();
}
