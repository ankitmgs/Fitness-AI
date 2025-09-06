import { UserProfile, Gender, ActivityLevel, Goal } from './types';

// --- DEVELOPMENT CONFIGURATION ---
// Set to `true` to bypass Firebase authentication and use a mock user.
// Set to `false` for production to enable real user authentication.
export const DEV_MODE = true;

// --- MOCK DATA (Only used when DEV_MODE is true) ---

// A mock Firebase User object to simulate a logged-in user.
export const mockUser = {
  uid: 'dev-user-01',
  email: 'dev@fittrack.ai',
  displayName: 'Dev User',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'mock',
  refreshToken: '',
  tenantId: null,
  delete: () => Promise.resolve(),
  getIdToken: () => Promise.resolve(''),
  getIdTokenResult: () => Promise.resolve({} as any),
  reload: () => Promise.resolve(),
  toJSON: () => ({}),
};


// A mock UserProfile object to pre-populate the app.
// This prevents needing to go through the profile setup screen in dev mode.
export const mockProfile: UserProfile = {
  name: 'Dev User',
  age: 30,
  weight: 75, // kg
  height: 180, // cm
  gender: Gender.MALE,
  activityLevel: ActivityLevel.MODERATE,
  goal: Goal.MAINTAIN,
  dailyGoals: {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fat: 80,
  },
  reminderSettings: {
    water: { enabled: true, frequency: 120 },
    meal: true,
    goalReached: true,
  },
};