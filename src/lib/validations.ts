import { z } from "zod";

export const goals = [
  "FAT_LOSS",
  "MUSCLE_GAIN",
  "STRENGTH_GAIN",
  "GENERAL_FITNESS",
] as const;

export const genders = ["MALE", "FEMALE", "OTHER"] as const;

export const memberRegisterSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  mobile: z
    .string()
    .min(6, "Enter a valid mobile number")
    .regex(/^[+\d][\d\s-]{5,}$/, "Enter a valid mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  height: z.coerce.number().positive("Height must be positive"),
  weight: z.coerce.number().positive("Weight must be positive"),
  age: z.coerce.number().int().min(10, "Age looks too low").max(100),
  gender: z.enum(genders),
  goal: z.enum(goals),
});

export const coachRegisterSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  mobile: z
    .string()
    .min(6, "Enter a valid mobile number")
    .regex(/^[+\d][\d\s-]{5,}$/, "Enter a valid mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const coachProfileSchema = z.object({
  bio: z.string().min(10, "Tell members a bit more about yourself"),
  experience: z.string().min(2, "Add your experience"),
  certifications: z.string().min(2, "Add at least one certification"),
  specialties: z.string().min(2, "Add at least one specialty"),
});

export const packageSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().min(5, "Add a short description"),
  price: z.coerce.number().positive("Price must be positive"),
  durationDays: z.coerce.number().int().positive("Duration must be positive"),
});

export const workoutLogSchema = z.object({
  exercise: z.string().min(1, "Exercise is required"),
  sets: z.coerce.number().int().positive(),
  reps: z.coerce.number().int().positive(),
  weight: z.coerce.number().nonnegative().optional(),
});

export const progressSchema = z.object({
  weight: z.coerce.number().positive("Weight must be positive"),
  bodyFat: z.coerce.number().min(0).max(70).optional(),
});

export const planItemSchema = z.object({
  day: z.string().min(1),
  exercise: z.string().min(1),
  sets: z.coerce.number().int().positive(),
  reps: z.coerce.number().int().positive(),
  weight: z.coerce.number().nonnegative().optional(),
});

export const mealItemSchema = z.object({
  meal: z.string().min(1),
  items: z.string().min(1),
  calories: z.coerce.number().int().nonnegative(),
  time: z.string().min(1),
});

export const goalLabels: Record<(typeof goals)[number], string> = {
  FAT_LOSS: "Fat Loss",
  MUSCLE_GAIN: "Muscle Gain",
  STRENGTH_GAIN: "Strength Gain",
  GENERAL_FITNESS: "General Fitness",
};

export const genderLabels: Record<(typeof genders)[number], string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};
