"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";

export async function markPurchasePaid(formData: FormData): Promise<void> {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.purchase.update({
    where: { id },
    data: { status: "PAID" },
  });
  revalidatePath("/admin/dashboard");
}

export async function markSubscriptionPaid(formData: FormData): Promise<void> {
  await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const sub = await prisma.coachSubscription.update({
    where: { id },
    data: { status: "PAID" },
  });
  await prisma.coachProfile.update({
    where: { id: sub.coachId },
    data: {
      subscriptionStatus: "ACTIVE",
      subscriptionExpiry: sub.periodEnd,
    },
  });
  revalidatePath("/admin/dashboard");
}

export async function toggleUserActive(formData: FormData): Promise<void> {
  const admin = await requireRole("ADMIN");
  const id = String(formData.get("id") ?? "");
  if (!id || id === admin.id) return;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role === "ADMIN") return;
  await prisma.user.update({
    where: { id },
    data: { active: !user.active },
  });
  revalidatePath("/admin/users");
}
