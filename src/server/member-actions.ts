"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { progressSchema, workoutLogSchema } from "@/lib/validations";

export type ActionResult = { error?: string; success?: string };

export async function purchasePackage(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireRole("MEMBER");
  const packageId = String(formData.get("packageId") ?? "");
  if (!packageId) return { error: "Missing package." };

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: { coach: true },
  });
  if (!pkg || !pkg.active) return { error: "Package is not available." };

  const existing = await prisma.purchase.findFirst({
    where: { memberId: user.id, packageId, status: { in: ["PENDING", "PAID"] } },
  });
  if (existing) {
    return { error: "You already purchased this package." };
  }

  await prisma.purchase.create({
    data: {
      memberId: user.id,
      packageId: pkg.id,
      coachId: pkg.coachId,
      amount: pkg.price,
      status: "PENDING",
    },
  });

  revalidatePath("/member/coaches");
  revalidatePath("/member/dashboard");
  return { success: "Package purchased. Payment is pending confirmation." };
}

export async function logWorkout(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireRole("MEMBER");
  const parsed = workoutLogSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { exercise, sets, reps, weight } = parsed.data;

  await prisma.workoutLog.create({
    data: { memberId: user.id, exercise, sets, reps, weight: weight ?? null },
  });

  revalidatePath("/member/workouts");
  revalidatePath("/member/dashboard");
  return { success: "Workout logged." };
}

export async function logProgress(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireRole("MEMBER");
  const parsed = progressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { weight, bodyFat } = parsed.data;

  await prisma.progressEntry.create({
    data: { memberId: user.id, weight, bodyFat: bodyFat ?? null },
  });

  revalidatePath("/member/progress");
  revalidatePath("/member/dashboard");
  return { success: "Progress saved." };
}
