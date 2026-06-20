"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole, getCoachProfile } from "@/lib/session";
import { coachProfileSchema, packageSchema } from "@/lib/validations";
import { COACH_MONTHLY_PRICE, DAY_MS } from "@/lib/constants";

export type ActionResult = { error?: string; success?: string };

async function coachProfileOrError() {
  const user = await requireRole("COACH");
  const profile = await getCoachProfile(user.id);
  if (!profile) return { user, profile: null as never, error: "Coach profile not found." };
  return { user, profile };
}

export async function updateCoachProfile(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { profile, error } = await coachProfileOrError();
  if (error) return { error };

  const parsed = coachProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.coachProfile.update({
    where: { id: profile.id },
    data: parsed.data,
  });

  revalidatePath("/coach/profile");
  revalidatePath("/coach/dashboard");
  return { success: "Profile updated." };
}

export async function activateSubscription(
  _prev: ActionResult,
  _formData: FormData
): Promise<ActionResult> {
  const { profile, error } = await coachProfileOrError();
  if (error) return { error };

  const now = new Date();
  const periodEnd = new Date(now.getTime() + 30 * DAY_MS);

  await prisma.$transaction([
    prisma.coachSubscription.create({
      data: {
        coachId: profile.id,
        amount: COACH_MONTHLY_PRICE,
        status: "PAID",
        periodStart: now,
        periodEnd,
      },
    }),
    prisma.coachProfile.update({
      where: { id: profile.id },
      data: { subscriptionStatus: "ACTIVE", subscriptionExpiry: periodEnd },
    }),
  ]);

  revalidatePath("/coach/packages");
  revalidatePath("/coach/dashboard");
  return { success: "Subscription activated." };
}

export async function createPackage(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { profile, error } = await coachProfileOrError();
  if (error) return { error };

  if (profile.subscriptionStatus !== "ACTIVE") {
    return { error: "An active subscription is required to create packages." };
  }

  const parsed = packageSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.package.create({
    data: { coachId: profile.id, ...parsed.data },
  });

  revalidatePath("/coach/packages");
  return { success: "Package created." };
}

export async function togglePackage(formData: FormData): Promise<void> {
  const { profile } = await coachProfileOrError();
  const id = String(formData.get("id") ?? "");
  const pkg = await prisma.package.findFirst({
    where: { id, coachId: profile.id },
  });
  if (!pkg) return;
  await prisma.package.update({
    where: { id },
    data: { active: !pkg.active },
  });
  revalidatePath("/coach/packages");
}

const planSchema = z.object({
  memberId: z.string().min(1),
  planId: z.string().optional(),
  title: z.string().min(2, "Add a title"),
  notes: z.string().optional(),
  items: z.string().min(1, "Add at least one item"),
});

const workoutItemSchema = z.array(
  z.object({
    day: z.string().min(1),
    exercise: z.string().min(1),
    sets: z.coerce.number().int().positive(),
    reps: z.coerce.number().int().positive(),
    weight: z.coerce.number().nonnegative().optional().nullable(),
  })
);

const mealItemSchema = z.array(
  z.object({
    time: z.string().min(1),
    meal: z.string().min(1),
    items: z.string().min(1),
    calories: z.coerce.number().int().nonnegative(),
  })
);

async function assertClient(coachId: string, memberId: string) {
  const purchase = await prisma.purchase.findFirst({
    where: { coachId, memberId, status: "PAID" },
  });
  return !!purchase;
}

export async function saveWorkoutPlan(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { profile, error } = await coachProfileOrError();
  if (error) return { error };

  const parsed = planSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { memberId, planId, title, notes } = parsed.data;

  if (!(await assertClient(profile.id, memberId))) {
    return { error: "This member is not your client." };
  }

  let items;
  try {
    items = workoutItemSchema.parse(JSON.parse(parsed.data.items));
  } catch {
    return { error: "Please add valid workout rows." };
  }
  if (items.length === 0) return { error: "Add at least one exercise." };

  const itemData = items.map((it) => ({
    day: it.day,
    exercise: it.exercise,
    sets: it.sets,
    reps: it.reps,
    weight: it.weight ?? null,
  }));

  if (planId) {
    const existing = await prisma.workoutPlan.findFirst({
      where: { id: planId, coachId: profile.id },
    });
    if (!existing) return { error: "Plan not found." };
    await prisma.$transaction([
      prisma.workoutPlanItem.deleteMany({ where: { planId } }),
      prisma.workoutPlan.update({
        where: { id: planId },
        data: {
          title,
          notes: notes ?? "",
          items: { create: itemData },
        },
      }),
    ]);
  } else {
    await prisma.workoutPlan.create({
      data: {
        coachId: profile.id,
        memberId,
        title,
        notes: notes ?? "",
        items: { create: itemData },
      },
    });
  }

  revalidatePath(`/coach/clients/${memberId}`);
  return { success: "Workout plan saved." };
}

export async function saveMealPlan(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { profile, error } = await coachProfileOrError();
  if (error) return { error };

  const parsed = planSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { memberId, planId, title, notes } = parsed.data;

  if (!(await assertClient(profile.id, memberId))) {
    return { error: "This member is not your client." };
  }

  let items;
  try {
    items = mealItemSchema.parse(JSON.parse(parsed.data.items));
  } catch {
    return { error: "Please add valid meal rows." };
  }
  if (items.length === 0) return { error: "Add at least one meal." };

  const itemData = items.map((it) => ({
    time: it.time,
    meal: it.meal,
    items: it.items,
    calories: it.calories,
  }));

  if (planId) {
    const existing = await prisma.mealPlan.findFirst({
      where: { id: planId, coachId: profile.id },
    });
    if (!existing) return { error: "Plan not found." };
    await prisma.$transaction([
      prisma.mealPlanItem.deleteMany({ where: { planId } }),
      prisma.mealPlan.update({
        where: { id: planId },
        data: {
          title,
          notes: notes ?? "",
          items: { create: itemData },
        },
      }),
    ]);
  } else {
    await prisma.mealPlan.create({
      data: {
        coachId: profile.id,
        memberId,
        title,
        notes: notes ?? "",
        items: { create: itemData },
      },
    });
  }

  revalidatePath(`/coach/clients/${memberId}`);
  return { success: "Meal plan saved." };
}
