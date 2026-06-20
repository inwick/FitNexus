import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DAY_MS = 24 * 60 * 60 * 1000;
const PASSWORD = "password123";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // Clean slate (order matters for FKs).
  await prisma.workoutPlanItem.deleteMany();
  await prisma.mealPlanItem.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.workoutLog.deleteMany();
  await prisma.progressEntry.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.package.deleteMany();
  await prisma.coachSubscription.deleteMany();
  await prisma.coachProfile.deleteMany();
  await prisma.memberProfile.deleteMany();
  await prisma.user.deleteMany();

  // Admin
  await prisma.user.create({
    data: {
      name: "Site Admin",
      email: "admin@fitnexus.com",
      mobile: "+15550000000",
      passwordHash,
      role: "ADMIN",
    },
  });

  // Coach 1 - active subscription, packages, a client
  const coach1 = await prisma.user.create({
    data: {
      name: "Sarah Strong",
      email: "sarah@fitnexus.com",
      mobile: "+15551112222",
      passwordHash,
      role: "COACH",
      coachProfile: {
        create: {
          bio: "Strength and conditioning coach helping busy professionals get strong and lean.",
          experience: "8 years coaching",
          certifications: "NASM CPT, CSCS",
          specialties: "Strength, Fat loss, Mobility",
          subscriptionStatus: "ACTIVE",
          subscriptionExpiry: new Date(Date.now() + 30 * DAY_MS),
        },
      },
    },
    include: { coachProfile: true },
  });
  const coach1Profile = coach1.coachProfile!;

  await prisma.coachSubscription.create({
    data: {
      coachId: coach1Profile.id,
      amount: 49,
      status: "PAID",
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * DAY_MS),
    },
  });

  const pkg1 = await prisma.package.create({
    data: {
      coachId: coach1Profile.id,
      title: "12-Week Strength Builder",
      description:
        "Progressive strength program with weekly check-ins and form reviews.",
      price: 199,
      durationDays: 84,
    },
  });

  await prisma.package.create({
    data: {
      coachId: coach1Profile.id,
      title: "Fat Loss Kickstart",
      description: "8-week fat loss plan combining training and nutrition.",
      price: 149,
      durationDays: 56,
    },
  });

  // Coach 2 - active subscription, package, no clients yet
  const coach2 = await prisma.user.create({
    data: {
      name: "Mike Fuel",
      email: "mike@fitnexus.com",
      mobile: "+15553334444",
      passwordHash,
      role: "COACH",
      coachProfile: {
        create: {
          bio: "Nutrition-first coach focused on sustainable muscle gain.",
          experience: "5 years coaching",
          certifications: "Precision Nutrition L1",
          specialties: "Muscle gain, Nutrition",
          subscriptionStatus: "ACTIVE",
          subscriptionExpiry: new Date(Date.now() + 30 * DAY_MS),
        },
      },
    },
    include: { coachProfile: true },
  });

  await prisma.coachSubscription.create({
    data: {
      coachId: coach2.coachProfile!.id,
      amount: 49,
      status: "PAID",
      periodStart: new Date(),
      periodEnd: new Date(Date.now() + 30 * DAY_MS),
    },
  });

  await prisma.package.create({
    data: {
      coachId: coach2.coachProfile!.id,
      title: "Lean Bulk Program",
      description: "12-week hypertrophy and nutrition program.",
      price: 179,
      durationDays: 84,
    },
  });

  // Coach 3 - no subscription (cannot publish)
  await prisma.user.create({
    data: {
      name: "Nina New",
      email: "nina@fitnexus.com",
      mobile: "+15555556666",
      passwordHash,
      role: "COACH",
      coachProfile: {
        create: {
          bio: "Just getting started on FitNexus.",
          experience: "2 years coaching",
          certifications: "ACE CPT",
          specialties: "General fitness",
        },
      },
    },
  });

  // Member 1 - existing client of coach1 (paid + plans + logs)
  const member1 = await prisma.user.create({
    data: {
      name: "Alex Member",
      email: "alex@fitnexus.com",
      mobile: "+15557778888",
      passwordHash,
      role: "MEMBER",
      memberProfile: {
        create: {
          height: 178,
          weight: 82,
          age: 29,
          gender: "MALE",
          goal: "MUSCLE_GAIN",
        },
      },
    },
  });

  await prisma.purchase.create({
    data: {
      memberId: member1.id,
      packageId: pkg1.id,
      coachId: coach1Profile.id,
      amount: pkg1.price,
      status: "PAID",
    },
  });

  await prisma.workoutPlan.create({
    data: {
      memberId: member1.id,
      coachId: coach1Profile.id,
      title: "Push / Pull / Legs",
      notes: "Rest 90s between sets. Progress weight weekly.",
      items: {
        create: [
          { day: "Mon", exercise: "Bench Press", sets: 4, reps: 8, weight: 70 },
          { day: "Mon", exercise: "Overhead Press", sets: 3, reps: 10, weight: 40 },
          { day: "Wed", exercise: "Deadlift", sets: 4, reps: 5, weight: 120 },
          { day: "Fri", exercise: "Squat", sets: 4, reps: 8, weight: 100 },
        ],
      },
    },
  });

  await prisma.mealPlan.create({
    data: {
      memberId: member1.id,
      coachId: coach1Profile.id,
      title: "Lean Bulk Nutrition",
      notes: "Aim for 2800 kcal and 180g protein per day.",
      items: {
        create: [
          { time: "8:00", meal: "Breakfast", items: "Oats, eggs, banana", calories: 650 },
          { time: "13:00", meal: "Lunch", items: "Chicken, rice, veggies", calories: 800 },
          { time: "19:00", meal: "Dinner", items: "Salmon, potatoes, salad", calories: 750 },
        ],
      },
    },
  });

  const today = Date.now();
  await prisma.workoutLog.createMany({
    data: [
      { memberId: member1.id, exercise: "Bench Press", sets: 4, reps: 8, weight: 70, date: new Date(today - 6 * DAY_MS) },
      { memberId: member1.id, exercise: "Squat", sets: 4, reps: 8, weight: 100, date: new Date(today - 4 * DAY_MS) },
      { memberId: member1.id, exercise: "Deadlift", sets: 4, reps: 5, weight: 120, date: new Date(today - 2 * DAY_MS) },
    ],
  });

  await prisma.progressEntry.createMany({
    data: [
      { memberId: member1.id, weight: 80, bodyFat: 18, date: new Date(today - 28 * DAY_MS) },
      { memberId: member1.id, weight: 81, bodyFat: 17.5, date: new Date(today - 14 * DAY_MS) },
      { memberId: member1.id, weight: 82, bodyFat: 17, date: new Date(today) },
    ],
  });

  // Member 2 - has a pending purchase (awaiting admin confirmation)
  const member2 = await prisma.user.create({
    data: {
      name: "Jamie Fit",
      email: "jamie@fitnexus.com",
      mobile: "+15559990000",
      passwordHash,
      role: "MEMBER",
      memberProfile: {
        create: {
          height: 165,
          weight: 68,
          age: 34,
          gender: "FEMALE",
          goal: "FAT_LOSS",
        },
      },
    },
  });

  await prisma.purchase.create({
    data: {
      memberId: member2.id,
      packageId: pkg1.id,
      coachId: coach1Profile.id,
      amount: pkg1.price,
      status: "PENDING",
    },
  });

  // Member 3 - no purchases
  await prisma.user.create({
    data: {
      name: "Taylor Newbie",
      email: "taylor@fitnexus.com",
      mobile: "+15552223333",
      passwordHash,
      role: "MEMBER",
      memberProfile: {
        create: {
          height: 172,
          weight: 75,
          age: 26,
          gender: "OTHER",
          goal: "GENERAL_FITNESS",
        },
      },
    },
  });

  console.log("Seed complete. Login with any of these (password: password123):");
  console.log("  admin@fitnexus.com   (Admin)");
  console.log("  sarah@fitnexus.com   (Coach, active, has a client)");
  console.log("  mike@fitnexus.com    (Coach, active, no clients)");
  console.log("  nina@fitnexus.com    (Coach, no subscription)");
  console.log("  alex@fitnexus.com    (Member, existing client)");
  console.log("  jamie@fitnexus.com   (Member, pending purchase)");
  console.log("  taylor@fitnexus.com  (Member, fresh)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
