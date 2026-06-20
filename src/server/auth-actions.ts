"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  coachRegisterSchema,
  memberRegisterSchema,
} from "@/lib/validations";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerMember(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = memberRegisterSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      name: data.name,
      email,
      mobile: data.mobile,
      passwordHash,
      role: "MEMBER",
      memberProfile: {
        create: {
          height: data.height,
          weight: data.weight,
          age: data.age,
          gender: data.gender,
          goal: data.goal,
        },
      },
    },
  });

  await signInOrThrow(email, data.password, "/member/dashboard");
  return {};
}

export async function registerCoach(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = coachRegisterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  await prisma.user.create({
    data: {
      name: data.name,
      email,
      mobile: data.mobile,
      passwordHash,
      role: "COACH",
      coachProfile: {
        create: {
          bio: "",
          experience: "",
          certifications: "",
          specialties: "",
        },
      },
    },
  });

  await signInOrThrow(email, data.password, "/coach/profile");
  return {};
}

async function signInOrThrow(
  email: string,
  password: string,
  redirectTo: string
) {
  // signIn throws a redirect on success; let it propagate.
  await signIn("credentials", { email, password, redirectTo });
}

export async function authenticate(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
  return {};
}
