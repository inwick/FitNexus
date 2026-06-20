// Shared types (mirrors prisma/schema.prisma — swap to MySQL/Prisma later).

export type Role = "MEMBER" | "COACH" | "ADMIN";
export type Goal =
  | "FAT_LOSS"
  | "MUSCLE_GAIN"
  | "STRENGTH_GAIN"
  | "GENERAL_FITNESS";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type SubscriptionStatus = "INACTIVE" | "ACTIVE";
export type PaymentStatus = "PENDING" | "PAID";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  mobile: string;
  role: Role;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MemberProfile = {
  id: string;
  userId: string;
  height: number;
  weight: number;
  age: number;
  gender: Gender;
  goal: Goal;
  createdAt: Date;
  updatedAt: Date;
};

export type CoachProfile = {
  id: string;
  userId: string;
  bio: string;
  experience: string;
  certifications: string;
  specialties: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CoachSubscription = {
  id: string;
  coachId: string;
  amount: number;
  status: PaymentStatus;
  periodStart: Date;
  periodEnd: Date;
  createdAt: Date;
};

export type Package = {
  id: string;
  coachId: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Purchase = {
  id: string;
  memberId: string;
  packageId: string;
  coachId: string;
  amount: number;
  status: PaymentStatus;
  purchasedAt: Date;
};

export type WorkoutPlan = {
  id: string;
  memberId: string;
  coachId: string;
  title: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type WorkoutPlanItem = {
  id: string;
  planId: string;
  day: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number | null;
};

export type MealPlan = {
  id: string;
  memberId: string;
  coachId: string;
  title: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MealPlanItem = {
  id: string;
  planId: string;
  meal: string;
  items: string;
  calories: number;
  time: string;
};

export type WorkoutLog = {
  id: string;
  memberId: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number | null;
  date: Date;
};

export type ProgressEntry = {
  id: string;
  memberId: string;
  weight: number;
  bodyFat: number | null;
  date: Date;
};

export type Database = {
  users: User[];
  memberProfiles: MemberProfile[];
  coachProfiles: CoachProfile[];
  coachSubscriptions: CoachSubscription[];
  packages: Package[];
  purchases: Purchase[];
  workoutPlans: WorkoutPlan[];
  workoutPlanItems: WorkoutPlanItem[];
  mealPlans: MealPlan[];
  mealPlanItems: MealPlanItem[];
  workoutLogs: WorkoutLog[];
  progressEntries: ProgressEntry[];
};
