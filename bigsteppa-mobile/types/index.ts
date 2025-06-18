export enum DurationUnit {
  Days = "Days",
  Weeks = "Weeks",
  Months = "Months",
  Years = "Years",
}

export enum ChallengeStatus {
  SetToHappen = "Upcoming",
  Ongoing = "Ongoing",
  Completed = "Completed",
  Stalled = "Stalled",
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  userId: string;
  name: string;
  durationValue: number;
  durationUnit: DurationUnit;
  startDate: string;
  lastUpdatedDate: string;
  status: ChallengeStatus;
  reminderTime: string; // 'HH:mm'
  description?: string;
  isPaused: boolean;
  createdAt: string;
  logs?: ChallengeLog[];
}

export interface ChallengeLog {
  id: string;
  challengeId: string;
  createdAt: string;
  dailyReflection?: string;
  url: string;
}

export interface CreateChallengeData {
  name: string;
  durationValue: number;
  durationUnit: DurationUnit;
  startDate: string;
  reminderTime: string;
  description?: string;
}

export interface UpdateChallengeData {
  name?: string;
  durationValue?: number;
  durationUnit?: DurationUnit;
  startDate?: string;
  reminderTime?: string;
  description?: string;
  isPaused?: boolean;
  status?: ChallengeStatus;
}

export interface AuthData {
  email: string;
  password: string;
}

export interface SignupData extends AuthData {
  username: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
