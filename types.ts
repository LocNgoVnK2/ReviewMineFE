
export enum FeedbackTag {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  CONSTRUCTIVE = 'CONSTRUCTIVE'
}

export enum DomainType {
  PROFESSIONAL = 'Professional',
  COMMUNICATION = 'Communication',
  RELIABILITY = 'Reliability',
  LEADERSHIP = 'Leadership',
  SOCIAL = 'Social',
  DATING = 'Dating'
}

export interface Review {
  id: string;
  domain: DomainType;
  rating: number;
  comment: string;
  tag: FeedbackTag;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  trustScore: number;
  activeDomains: DomainType[];
  reviews: Review[];
  badges?: string[];
  topSkills?: string[];
  weeklyReviews?: number;
}

export interface MicroPost {
  id: string;
  content: string;
  timestamp: string;
  reactions: { type: string; count: number }[];
}
