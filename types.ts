
export enum Phase {
  WELCOME = 'WELCOME',
  ENGAGEMENT = 'ENGAGEMENT',
  BEHAVIORAL = 'BEHAVIORAL',
  SITUATIONAL = 'SITUATIONAL',
  RESULTS = 'RESULTS',
  DASHBOARD = 'DASHBOARD'
}

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface EngagementQuestion {
  id: string;
  hindi: string;
  english: string;
  dimension: string;
}

export interface BehavioralQuestion {
  id: string;
  question: string;
  optionA: { text: string; trait: string };
  optionB: { text: string; trait: string };
}

export interface SJTQuestion {
  id: string;
  scenario: string;
  options: {
    key: string;
    text: string;
    alignment: string;
  }[];
}

export interface SurveyState {
  engagementResponses: Record<string, LikertValue>;
  behavioralResponses: Record<string, string>;
  sjtResponses: Record<string, string>;
}

export interface UserProfile {
  name: string;
  employeeId: string;
  department: string;
}
