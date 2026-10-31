export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  requirements: string[];
  responsibilities?: string[];
  skills?: string[];
  offers?: string[];
  deadline: string;
  postedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvUrl: string; // Simulated URL or Base64
  experience: string;
  skills: string;
  linkedIn?: string;
  status: 'Pending' | 'Reviewed' | 'Interviewing' | 'Hired' | 'Rejected';
  submittedAt: string;
}
