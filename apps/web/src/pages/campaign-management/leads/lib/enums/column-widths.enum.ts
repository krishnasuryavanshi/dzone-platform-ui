// Column width configuration
export enum ColumnWidths {
  EXTRA_WIDE = 400,
  WIDE = 350,
  MEDIUM_WIDE = 300,
  STANDARD = 250,
  MEDIUM = 220,
  COMPACT = 200,
  SMALL = 180,
  EXTRA_SMALL = 150,
}

// Map of field patterns to their widths
export const COLUMN_WIDTH_MAP: Record<string, ColumnWidths> = {
  // Extra wide columns
  linkedinlink: ColumnWidths.EXTRA_WIDE,
  streetaddress: ColumnWidths.EXTRA_WIDE,

  // Wide columns
  trackingid: ColumnWidths.WIDE,
  returnreason: ColumnWidths.WIDE,
  email: ColumnWidths.WIDE,
  companyname: ColumnWidths.WIDE,

  // Medium-wide columns
  jobtitle: ColumnWidths.MEDIUM_WIDE,
  jobfunction: ColumnWidths.MEDIUM_WIDE,
  joblevel: ColumnWidths.MEDIUM_WIDE,
  campaignname: ColumnWidths.MEDIUM_WIDE,
  asset1name: ColumnWidths.MEDIUM_WIDE,
  asset2name: ColumnWidths.MEDIUM_WIDE,
  domain: ColumnWidths.MEDIUM_WIDE,
  firstname: ColumnWidths.MEDIUM_WIDE,
  lastname: ColumnWidths.MEDIUM_WIDE,
  supplier: ColumnWidths.MEDIUM_WIDE,

  // Standard columns
  status: ColumnWidths.STANDARD,
  leadstatus: ColumnWidths.STANDARD,
  industry: ColumnWidths.STANDARD,

  // Medium columns
  distinctemployeesize: ColumnWidths.MEDIUM,
  distinctrevenuesize: ColumnWidths.MEDIUM,

  // Compact columns
  createdat: ColumnWidths.COMPACT,
  updatedat: ColumnWidths.COMPACT,
  publishedon: ColumnWidths.COMPACT,
  returnedon: ColumnWidths.COMPACT,
  asset1downloaddate: ColumnWidths.COMPACT,
  asset2downloaddate: ColumnWidths.COMPACT,
  lineitemid: ColumnWidths.COMPACT,
  campaignid: ColumnWidths.COMPACT,

  // Small columns
  city: ColumnWidths.SMALL,
  state: ColumnWidths.SMALL,
  country: ColumnWidths.SMALL,
  postalcode: ColumnWidths.SMALL,
  phone: ColumnWidths.SMALL,
  countrycode: ColumnWidths.SMALL,

  // Extra small columns (for boolean fields)
  optin: ColumnWidths.EXTRA_SMALL,
  doubleoptin: ColumnWidths.EXTRA_SMALL,
};
