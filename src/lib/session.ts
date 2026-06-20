import { redirect } from "next/navigation";
import type { Role } from "@/lib/db-types";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireRole(role: Role) {
  const user = await requireUser();
  if (user.role !== role) redirect("/login");
  return user;
}

export async function getCoachProfile(userId: string) {
  return prisma.coachProfile.findUnique({ where: { userId } });
}

export async function getMemberProfile(userId: string) {
  return prisma.memberProfile.findUnique({ where: { userId } });
}
