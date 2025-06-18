export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  DZONGKHAG_ADMIN = 'dzongkhag_admin',
  GEWOG_OPERATOR = 'gewog_operator',
  METER_READER = 'meter_reader',
  TECHNICIAN = 'technician',
  QUALITY_INSPECTOR = 'quality_inspector',
  FINANCIAL_OFFICER = 'financial_officer',
  VIEWER = 'viewer',
  CONSUMER = 'consumer',
}

export enum RegionType {
  WESTERN = 'Western',
  CENTRAL = 'Central',
  SOUTHERN = 'Southern',
  EASTERN = 'Eastern',
}

export enum ConnectionType {
  INDIVIDUAL = 'Individual',
  SHARED = 'Shared',
  COMMUNITY_STANDPOST = 'Community_Standpost'
}

export enum ConsumerStatus {
  ACTIVE = 'Active',
  DISCONNECTED = 'Disconnected',
  SUSPENDED = 'Suspended'
}

export enum TariffCategory {
  DOMESTIC = 'Domestic',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial',
  INSTITUTIONAL = 'Institutional'
}
