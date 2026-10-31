export interface AppointmentData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  location: 'onsite' | 'online';
  staffPreference?: string;
}

export interface TranscriptionEntry {
  role: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export interface CallSummary {
  collectedData: Partial<AppointmentData>;
  actionTaken: string;
  escalationStatus: 'none' | 'human_handoff';
}
