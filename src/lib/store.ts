import bcrypt from "bcryptjs";
import type { Database } from "@/lib/db-types";

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const passwordHash = bcrypt.hashSync("password123", 10);

function seedDatabase(): Database {
  const adminUser = {
    id: "user-admin",
    name: "Site Admin",
    email: "admin@fitnexus.com",
    passwordHash,
    mobile: "+15550000000",
    role: "ADMIN" as const,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  const coachUser = {
    id: "user-coach",
    name: "Sarah Strong",
    email: "coach@fitnexus.com",
    passwordHash,
    mobile: "+15551112222",
    role: "COACH" as const,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  const memberUser = {
    id: "user-member",
    name: "Alex Member",
    email: "member@fitnexus.com",
    passwordHash,
    mobile: "+15557778888",
    role: "MEMBER" as const,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  const coachProfile = {
    id: "coach-1",
    userId: coachUser.id,
    bio: "Strength and conditioning coach helping busy professionals get strong and lean.",
    experience: "8 years coaching",
    certifications: "NASM CPT, CSCS",
    specialties: "Strength, Fat loss, Mobility",
    subscriptionStatus: "ACTIVE" as const,
    subscriptionExpiry: new Date(now.getTime() + 30 * DAY_MS),
    createdAt: now,
    updatedAt: now,
  };

  const memberProfile = {
    id: "member-1",
    userId: memberUser.id,
    height: 178,
    weight: 82,
    age: 29,
    gender: "MALE" as const,
    goal: "MUSCLE_GAIN" as const,
    createdAt: now,
    updatedAt: now,
  };

  const pkg = {
    id: "pkg-1",
    coachId: coachProfile.id,
    title: "12-Week Strength Builder",
    description:
      "Progressive strength program with weekly check-ins and form reviews.",
    price: 199,
    durationDays: 84,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  const purchase = {
    id: "purchase-1",
    memberId: memberUser.id,
    packageId: pkg.id,
    coachId: coachProfile.id,
    amount: pkg.price,
    status: "PAID" as const,
    purchasedAt: new Date(now.getTime() - 7 * DAY_MS),
  };

  const workoutPlan = {
    id: "wp-1",
    memberId: memberUser.id,
    coachId: coachProfile.id,
    title: "Push / Pull / Legs",
    notes: "Rest 90s between sets. Progress weight weekly.",
    createdAt: now,
    updatedAt: now,
  };

  const mealPlan = {
    id: "mp-1",
    memberId: memberUser.id,
    coachId: coachProfile.id,
    title: "Lean Bulk Nutrition",
    notes: "Aim for 2800 kcal and 180g protein per day.",
    createdAt: now,
    updatedAt: now,
  };

  return {
    users: [adminUser, coachUser, memberUser],
    memberProfiles: [memberProfile],
    coachProfiles: [coachProfile],
    coachSubscriptions: [
      {
        id: "sub-1",
        coachId: coachProfile.id,
        amount: 49,
        status: "PAID",
        periodStart: now,
        periodEnd: new Date(now.getTime() + 30 * DAY_MS),
        createdAt: now,
      },
    ],
    packages: [pkg],
    purchases: [purchase],
    workoutPlans: [workoutPlan],
    workoutPlanItems: [
      {
        id: "wpi-1",
        planId: workoutPlan.id,
        day: "Mon",
        exercise: "Bench Press",
        sets: 4,
        reps: 8,
        weight: 70,
      },
      {
        id: "wpi-2",
        planId: workoutPlan.id,
        day: "Wed",
        exercise: "Deadlift",
        sets: 4,
        reps: 5,
        weight: 120,
      },
    ],
    mealPlans: [mealPlan],
    mealPlanItems: [
      {
        id: "mpi-1",
        planId: mealPlan.id,
        time: "8:00",
        meal: "Breakfast",
        items: "Oats, eggs, banana",
        calories: 650,
      },
      {
        id: "mpi-2",
        planId: mealPlan.id,
        time: "13:00",
        meal: "Lunch",
        items: "Chicken, rice, veggies",
        calories: 800,
      },
    ],
    workoutLogs: [
      {
        id: "wl-1",
        memberId: memberUser.id,
        exercise: "Bench Press",
        sets: 4,
        reps: 8,
        weight: 70,
        date: new Date(now.getTime() - 2 * DAY_MS),
      },
      {
        id: "wl-2",
        memberId: memberUser.id,
        exercise: "Squat",
        sets: 4,
        reps: 8,
        weight: 100,
        date: new Date(now.getTime() - 1 * DAY_MS),
      },
    ],
    progressEntries: [
      {
        id: "pe-1",
        memberId: memberUser.id,
        weight: 80,
        bodyFat: 18,
        date: new Date(now.getTime() - 14 * DAY_MS),
      },
      {
        id: "pe-2",
        memberId: memberUser.id,
        weight: 82,
        bodyFat: 17,
        date: now,
      },
    ],
  };
}

const globalForDb = globalThis as unknown as { fitnexusDb: Database | undefined };

export function getDb(): Database {
  if (!globalForDb.fitnexusDb) {
    globalForDb.fitnexusDb = seedDatabase();
  }
  return globalForDb.fitnexusDb;
}

export function resetDb() {
  globalForDb.fitnexusDb = seedDatabase();
}

let idCounter = 1000;
export function newId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
