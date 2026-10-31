export interface PartnerInquiry {
  id?: string;
  name: string;
  organization: string;
  email: string;
  partnership_type: string;
  message: string;
  status?: 'Pending' | 'Reviewed' | 'Contacted';
  submitted_at?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status?: 'Unread' | 'Read' | 'Responded';
  submitted_at?: string;
}
