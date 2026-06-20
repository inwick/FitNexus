"use client";

import { useActionState, useState } from "react";
import {
  saveMealPlan,
  saveWorkoutPlan,
  type ActionResult,
} from "@/server/coach-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { whatsappLink } from "@/lib/utils";

const initial: ActionResult = {};

type WorkoutRow = {
  day: string;
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
};
type MealRow = {
  time: string;
  meal: string;
  items: string;
  calories: string;
};

export type ExistingPlan = {
  id: string;
  title: string;
  notes: string;
  items: Record<string, unknown>[];
};

const emptyWorkout: WorkoutRow = {
  day: "",
  exercise: "",
  sets: "",
  reps: "",
  weight: "",
};
const emptyMeal: MealRow = { time: "", meal: "", items: "", calories: "" };

export function PlanBuilder({
  kind,
  memberId,
  memberName,
  memberMobile,
  coachName,
  existing,
}: {
  kind: "workout" | "meal";
  memberId: string;
  memberName: string;
  memberMobile: string;
  coachName: string;
  existing?: ExistingPlan;
}) {
  const action = kind === "workout" ? saveWorkoutPlan : saveMealPlan;
  const [state, formAction, pending] = useActionState(action, initial);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");

  const [workoutRows, setWorkoutRows] = useState<WorkoutRow[]>(
    kind === "workout" && existing
      ? (existing.items as unknown as Record<string, unknown>[]).map((it) => ({
          day: String(it.day ?? ""),
          exercise: String(it.exercise ?? ""),
          sets: String(it.sets ?? ""),
          reps: String(it.reps ?? ""),
          weight: it.weight != null ? String(it.weight) : "",
        }))
      : [emptyWorkout]
  );
  const [mealRows, setMealRows] = useState<MealRow[]>(
    kind === "meal" && existing
      ? (existing.items as unknown as Record<string, unknown>[]).map((it) => ({
          time: String(it.time ?? ""),
          meal: String(it.meal ?? ""),
          items: String(it.items ?? ""),
          calories: String(it.calories ?? ""),
        }))
      : [emptyMeal]
  );

  const itemsJson =
    kind === "workout"
      ? JSON.stringify(
          workoutRows
            .filter((r) => r.exercise.trim())
            .map((r) => ({
              day: r.day || "Day 1",
              exercise: r.exercise,
              sets: Number(r.sets || 0),
              reps: Number(r.reps || 0),
              weight: r.weight ? Number(r.weight) : null,
            }))
        )
      : JSON.stringify(
          mealRows
            .filter((r) => r.meal.trim())
            .map((r) => ({
              time: r.time || "Anytime",
              meal: r.meal,
              items: r.items,
              calories: Number(r.calories || 0),
            }))
        );

  const notifyMessage = `Hi ${memberName}, your coach ${coachName} has updated your ${
    kind === "workout" ? "workout" : "meal"
  } plan on FitNexus. Please check the app for details.`;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="memberId" value={memberId} />
      {existing ? <input type="hidden" name="planId" value={existing.id} /> : null}
      <input type="hidden" name="items" value={itemsJson} />

      <Input
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={kind === "workout" ? "Plan title (e.g. Push/Pull/Legs)" : "Plan title (e.g. Cutting Meal Plan)"}
        required
      />
      <Input
        name="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
      />

      {kind === "workout" ? (
        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_1.4fr_0.7fr_0.7fr_0.8fr_auto] gap-2 text-xs font-medium uppercase text-muted sm:grid">
            <span>Day</span>
            <span>Exercise</span>
            <span>Sets</span>
            <span>Reps</span>
            <span>Weight</span>
            <span />
          </div>
          {workoutRows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1.4fr_0.7fr_0.7fr_0.8fr_auto]"
            >
              <Input
                placeholder="Day"
                value={row.day}
                onChange={(e) =>
                  setWorkoutRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, day: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                placeholder="Exercise"
                value={row.exercise}
                onChange={(e) =>
                  setWorkoutRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, exercise: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                type="number"
                placeholder="Sets"
                value={row.sets}
                onChange={(e) =>
                  setWorkoutRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, sets: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                type="number"
                placeholder="Reps"
                value={row.reps}
                onChange={(e) =>
                  setWorkoutRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, reps: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                type="number"
                placeholder="kg"
                value={row.weight}
                onChange={(e) =>
                  setWorkoutRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, weight: e.target.value } : r
                    )
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setWorkoutRows((rows) =>
                    rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows
                  )
                }
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setWorkoutRows((rows) => [...rows, emptyWorkout])}
          >
            + Add exercise
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden grid-cols-[0.8fr_1fr_1.6fr_0.8fr_auto] gap-2 text-xs font-medium uppercase text-muted sm:grid">
            <span>Time</span>
            <span>Meal</span>
            <span>Items</span>
            <span>Calories</span>
            <span />
          </div>
          {mealRows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 gap-2 sm:grid-cols-[0.8fr_1fr_1.6fr_0.8fr_auto]"
            >
              <Input
                placeholder="Time"
                value={row.time}
                onChange={(e) =>
                  setMealRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, time: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                placeholder="Meal"
                value={row.meal}
                onChange={(e) =>
                  setMealRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, meal: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                placeholder="Items"
                value={row.items}
                onChange={(e) =>
                  setMealRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, items: e.target.value } : r
                    )
                  )
                }
              />
              <Input
                type="number"
                placeholder="kcal"
                value={row.calories}
                onChange={(e) =>
                  setMealRows((rows) =>
                    rows.map((r, idx) =>
                      idx === i ? { ...r, calories: e.target.value } : r
                    )
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMealRows((rows) =>
                    rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows
                  )
                }
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMealRows((rows) => [...rows, emptyMeal])}
          >
            + Add meal
          </Button>
        </div>
      )}

      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : existing ? "Update plan" : "Save plan"}
        </Button>
        {state.success ? (
          <>
            <span className="text-sm text-green-700">{state.success}</span>
            <a
              href={whatsappLink(memberMobile, notifyMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700"
            >
              Update customer on WhatsApp
            </a>
          </>
        ) : null}
      </div>
    </form>
  );
}
