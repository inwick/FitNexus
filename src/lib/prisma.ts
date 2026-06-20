/**
 * In-memory data layer (no MySQL required).
 * Replace with PrismaClient when MySQL is integrated later.
 */
import { getDb, newId } from "@/lib/store";
import type {
  CoachProfile,
  CoachSubscription,
  MealPlan,
  MealPlanItem,
  MemberProfile,
  Package,
  PaymentStatus,
  ProgressEntry,
  Purchase,
  User,
  WorkoutLog,
  WorkoutPlan,
  WorkoutPlanItem,
} from "@/lib/db-types";

type WhereIn<T> = T | { in: T[] };
type OrderDir = "asc" | "desc";

function matchesIn<T>(value: T, filter: WhereIn<T> | undefined): boolean {
  if (filter === undefined) return true;
  if (typeof filter === "object" && filter !== null && "in" in filter) {
    return filter.in.includes(value);
  }
  return value === filter;
}

function sortBy<T>(items: T[], orderBy?: Record<string, OrderDir>): T[] {
  if (!orderBy) return items;
  const [field, dir] = Object.entries(orderBy)[0] ?? [];
  if (!field) return items;
  return [...items].sort((a, b) => {
    const av = (a as Record<string, unknown>)[field];
    const bv = (b as Record<string, unknown>)[field];
    if (av instanceof Date && bv instanceof Date) {
      return dir === "desc" ? bv.getTime() - av.getTime() : av.getTime() - bv.getTime();
    }
    if (typeof av === "number" && typeof bv === "number") {
      return dir === "desc" ? bv - av : av - bv;
    }
    return 0;
  });
}

function take<T>(items: T[], n?: number): T[] {
  return n != null ? items.slice(0, n) : items;
}

function attachUser(coach: CoachProfile) {
  const db = getDb();
  return { ...coach, user: db.users.find((u) => u.id === coach.userId)! };
}

function attachCoachWithUser(coachId: string) {
  const db = getDb();
  const coach = db.coachProfiles.find((c) => c.id === coachId)!;
  return { ...coach, user: db.users.find((u) => u.id === coach.userId)! };
}

function attachMember(memberId: string) {
  const db = getDb();
  const member = db.users.find((u) => u.id === memberId)!;
  const memberProfile = db.memberProfiles.find((p) => p.userId === memberId) ?? null;
  return { ...member, memberProfile };
}

function attachPackage(packageId: string) {
  return getDb().packages.find((p) => p.id === packageId)!;
}

function attachWorkoutItems(plan: WorkoutPlan) {
  const items = getDb().workoutPlanItems.filter((i) => i.planId === plan.id);
  return { ...plan, items };
}

function attachMealItems(plan: MealPlan) {
  const items = getDb().mealPlanItems.filter((i) => i.planId === plan.id);
  return { ...plan, items };
}

async function runTransaction(ops: Promise<unknown>[]) {
  await Promise.all(ops);
}

const userModel = {
  async findUnique({ where }: { where: { email?: string; id?: string } }) {
    const db = getDb();
    if (where.email) return db.users.find((u) => u.email === where.email) ?? null;
    if (where.id) return db.users.find((u) => u.id === where.id) ?? null;
    return null;
  },

  async findMany({
    where,
    orderBy,
  }: {
    where?: { role?: User["role"] };
    orderBy?: { createdAt: OrderDir };
  } = {}) {
    let items = getDb().users;
    if (where?.role) items = items.filter((u) => u.role === where.role);
    return sortBy(items, orderBy);
  },

  async count({ where }: { where?: { role?: User["role"] } } = {}) {
    const items = await userModel.findMany({ where });
    return items.length;
  },

  async create({
    data,
  }: {
    data: {
      name: string;
      email: string;
      mobile: string;
      passwordHash: string;
      role: User["role"];
      memberProfile?: {
        create: Omit<MemberProfile, "id" | "userId" | "createdAt" | "updatedAt">;
      };
      coachProfile?: {
        create: Omit<
          CoachProfile,
          "id" | "userId" | "createdAt" | "updatedAt" | "subscriptionStatus" | "subscriptionExpiry"
        >;
      };
    };
  }) {
    const db = getDb();
    const ts = new Date();
    const user: User = {
      id: newId("user"),
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      passwordHash: data.passwordHash,
      role: data.role,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    };
    db.users.push(user);

    if (data.memberProfile) {
      db.memberProfiles.push({
        id: newId("mp"),
        userId: user.id,
        ...data.memberProfile.create,
        createdAt: ts,
        updatedAt: ts,
      });
    }

    if (data.coachProfile) {
      db.coachProfiles.push({
        id: newId("coach"),
        userId: user.id,
        ...data.coachProfile.create,
        subscriptionStatus: "INACTIVE",
        subscriptionExpiry: null,
        createdAt: ts,
        updatedAt: ts,
      });
    }

    return user;
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: Partial<Pick<User, "active">>;
  }) {
    const db = getDb();
    const user = db.users.find((u) => u.id === where.id);
    if (!user) throw new Error("User not found");
    Object.assign(user, data, { updatedAt: new Date() });
    return user;
  },
};

const memberProfileModel = {
  async findUnique({ where }: { where: { userId: string } }) {
    return getDb().memberProfiles.find((p) => p.userId === where.userId) ?? null;
  },
};

const coachProfileModel = {
  async findUnique({
    where,
    include,
  }: {
    where: { id?: string; userId?: string };
    include?: { user?: boolean; packages?: { where?: { active?: boolean }; orderBy?: { price: OrderDir } } };
  }) {
    const db = getDb();
    let coach: CoachProfile | undefined;
    if (where.id) coach = db.coachProfiles.find((c) => c.id === where.id);
    if (where.userId) coach = db.coachProfiles.find((c) => c.userId === where.userId);
    if (!coach) return null;

    let result: Record<string, unknown> = { ...coach };
    if (include?.user) result.user = db.users.find((u) => u.id === coach!.userId);
    if (include?.packages) {
      let pkgs = db.packages.filter((p) => p.coachId === coach!.id);
      if (include.packages.where?.active != null) {
        pkgs = pkgs.filter((p) => p.active === include.packages!.where!.active);
      }
      result.packages = sortBy(pkgs, include.packages.orderBy);
    }
    return result as CoachProfile & { user?: User; packages?: Package[] };
  },

  async findMany({
    where,
    include,
    orderBy,
  }: {
    where?: {
      packages?: { some: { active: boolean } };
      user?: { active: boolean };
    };
    include?: {
      user?: boolean;
      packages?: { where?: { active?: boolean }; orderBy?: { price: OrderDir } };
    };
    orderBy?: { createdAt: OrderDir };
  } = {}) {
    const db = getDb();
    let coaches = db.coachProfiles;

    if (where?.user?.active != null) {
      const activeIds = new Set(
        db.users.filter((u) => u.active === where.user!.active).map((u) => u.id)
      );
      coaches = coaches.filter((c) => activeIds.has(c.userId));
    }

    if (where?.packages?.some) {
      coaches = coaches.filter((c) =>
        db.packages.some(
          (p) => p.coachId === c.id && p.active === where.packages!.some.active
        )
      );
    }

    coaches = sortBy(coaches, orderBy);

    return coaches.map((coach) => {
      let result: Record<string, unknown> = { ...coach };
      if (include?.user) result.user = db.users.find((u) => u.id === coach.userId);
      if (include?.packages) {
        let pkgs = db.packages.filter((p) => p.coachId === coach.id);
        if (include.packages.where?.active != null) {
          pkgs = pkgs.filter((p) => p.active === include.packages!.where!.active);
        }
        result.packages = sortBy(pkgs, include.packages.orderBy);
      }
      return result as CoachProfile & { user?: User; packages?: Package[] };
    });
  },

  async count({ where }: { where?: { subscriptionStatus?: CoachProfile["subscriptionStatus"] } } = {}) {
    let items = getDb().coachProfiles;
    if (where?.subscriptionStatus) {
      items = items.filter((c) => c.subscriptionStatus === where.subscriptionStatus);
    }
    return items.length;
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: Partial<
      Pick<
        CoachProfile,
        | "bio"
        | "experience"
        | "certifications"
        | "specialties"
        | "subscriptionStatus"
        | "subscriptionExpiry"
      >
    >;
  }) {
    const db = getDb();
    const coach = db.coachProfiles.find((c) => c.id === where.id);
    if (!coach) throw new Error("Coach profile not found");
    Object.assign(coach, data, { updatedAt: new Date() });
    return coach;
  },
};

const coachSubscriptionModel = {
  async create({
    data,
  }: {
    data: Omit<CoachSubscription, "id" | "createdAt">;
  }) {
    const db = getDb();
    const sub: CoachSubscription = {
      id: newId("sub"),
      ...data,
      createdAt: new Date(),
    };
    db.coachSubscriptions.push(sub);
    return sub;
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: Partial<Pick<CoachSubscription, "status">>;
  }) {
    const db = getDb();
    const sub = db.coachSubscriptions.find((s) => s.id === where.id);
    if (!sub) throw new Error("Subscription not found");
    Object.assign(sub, data);
    return sub;
  },

  async findMany({
    where,
    include,
    orderBy,
  }: {
    where?: { status?: PaymentStatus };
    include?: { coach?: { include?: { user?: boolean } } };
    orderBy?: { createdAt: OrderDir };
  } = {}): Promise<
    (CoachSubscription & { coach?: ReturnType<typeof attachCoachWithUser> })[]
  > {
    let items = getDb().coachSubscriptions;
    if (where?.status) items = items.filter((s) => s.status === where.status);
    items = sortBy(items, orderBy);

    if (!include) return items;

    return items.map((s) => {
      const row = { ...s } as CoachSubscription & {
        coach?: ReturnType<typeof attachCoachWithUser>;
      };
      if (include.coach) row.coach = attachCoachWithUser(s.coachId);
      return row;
    });
  },
};

const packageModel = {
  async findUnique({
    where,
    include,
  }: {
    where: { id: string };
    include?: { coach?: boolean };
  }) {
    const pkg = getDb().packages.find((p) => p.id === where.id);
    if (!pkg) return null;
    if (include?.coach) {
      return { ...pkg, coach: getDb().coachProfiles.find((c) => c.id === pkg.coachId)! };
    }
    return pkg;
  },

  async findFirst({ where }: { where: { id?: string; coachId?: string } }) {
    const db = getDb();
    return (
      db.packages.find(
        (p) =>
          (where.id == null || p.id === where.id) &&
          (where.coachId == null || p.coachId === where.coachId)
      ) ?? null
    );
  },

  async create({
    data,
  }: {
    data: {
      coachId: string;
      title: string;
      description: string;
      price: number;
      durationDays: number;
    };
  }) {
    const db = getDb();
    const ts = new Date();
    const pkg: Package = {
      id: newId("pkg"),
      ...data,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    };
    db.packages.push(pkg);
    return pkg;
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: Partial<Pick<Package, "active">>;
  }) {
    const db = getDb();
    const pkg = db.packages.find((p) => p.id === where.id);
    if (!pkg) throw new Error("Package not found");
    Object.assign(pkg, data, { updatedAt: new Date() });
    return pkg;
  },

  async findMany({
    where,
    orderBy,
  }: {
    where?: { coachId?: string };
    orderBy?: { createdAt: OrderDir };
  } = {}): Promise<Package[]> {
    let items = getDb().packages;
    if (where?.coachId) items = items.filter((p) => p.coachId === where.coachId);
    return sortBy(items, orderBy);
  },

  async count({ where }: { where?: { coachId?: string } } = {}) {
    let items = getDb().packages;
    if (where?.coachId) items = items.filter((p) => p.coachId === where.coachId);
    return items.length;
  },
};

const purchaseModel = {
  async findFirst({
    where,
    include,
    orderBy,
  }: {
    where: {
      memberId?: string;
      packageId?: string;
      coachId?: string;
      status?: PaymentStatus | { in: PaymentStatus[] };
    };
    include?: {
      package?: boolean;
      member?: { include?: { memberProfile?: boolean } };
    };
    orderBy?: { purchasedAt: OrderDir };
  }): Promise<
    | (Purchase & {
        package?: Package;
        member?: ReturnType<typeof attachMember>;
      })
    | null
  > {
    const results = await purchaseModel.findMany({ where, include, orderBy, take: 1 });
    return results[0] ?? null;
  },

  async findMany({
    where,
    include,
    orderBy,
    take: limit,
    distinct,
  }: {
    where?: {
      memberId?: string;
      coachId?: string;
      packageId?: string;
      status?: PaymentStatus | { in: PaymentStatus[] };
    };
    include?: {
      package?: boolean;
      member?: boolean | { include?: { memberProfile?: boolean } };
      coach?: { include?: { user?: boolean } };
    };
    orderBy?: { purchasedAt: OrderDir };
    take?: number;
    distinct?: ("memberId" | string)[];
  } = {}): Promise<
    (Purchase & {
      package?: Package;
      member?: ReturnType<typeof attachMember>;
      coach?: ReturnType<typeof attachCoachWithUser>;
    })[]
  > {
    const db = getDb();
    let items = db.purchases;

    if (where?.memberId) items = items.filter((p) => p.memberId === where.memberId);
    if (where?.coachId) items = items.filter((p) => p.coachId === where.coachId);
    if (where?.packageId) items = items.filter((p) => p.packageId === where.packageId);
    if (where?.status) {
      const statusFilter = where.status;
      if (typeof statusFilter === "object" && "in" in statusFilter) {
        items = items.filter((p) => statusFilter.in.includes(p.status));
      } else {
        items = items.filter((p) => p.status === statusFilter);
      }
    }

    items = sortBy(items, orderBy);

    if (distinct?.includes("memberId")) {
      const seen = new Set<string>();
      items = items.filter((p) => {
        if (seen.has(p.memberId)) return false;
        seen.add(p.memberId);
        return true;
      });
    }

    items = take(items, limit);

    if (!include) return items;

    return items.map((p) => {
      const row = { ...p } as Purchase & {
        package?: Package;
        member?: ReturnType<typeof attachMember>;
        coach?: ReturnType<typeof attachCoachWithUser>;
      };
      if (include.package) row.package = attachPackage(p.packageId);
      if (include.member) row.member = attachMember(p.memberId);
      if (include.coach) row.coach = attachCoachWithUser(p.coachId);
      return row;
    });
  },

  async create({
    data,
  }: {
    data: Omit<Purchase, "id" | "purchasedAt">;
  }) {
    const db = getDb();
    const purchase: Purchase = {
      id: newId("purchase"),
      ...data,
      purchasedAt: new Date(),
    };
    db.purchases.push(purchase);
    return purchase;
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: Partial<Pick<Purchase, "status">>;
  }) {
    const db = getDb();
    const purchase = db.purchases.find((p) => p.id === where.id);
    if (!purchase) throw new Error("Purchase not found");
    Object.assign(purchase, data);
    return purchase;
  },
};

const workoutLogModel = {
  async create({ data }: { data: Omit<WorkoutLog, "id" | "date"> & { date?: Date } }) {
    const db = getDb();
    const log: WorkoutLog = {
      id: newId("wl"),
      ...data,
      date: data.date ?? new Date(),
    };
    db.workoutLogs.push(log);
    return log;
  },

  async findMany({
    where,
    orderBy,
    take: limit,
  }: {
    where?: { memberId?: string };
    orderBy?: { date: OrderDir };
    take?: number;
  } = {}) {
    let items = getDb().workoutLogs;
    if (where?.memberId) items = items.filter((l) => l.memberId === where.memberId);
    return take(sortBy(items, orderBy), limit);
  },

  async count({ where }: { where?: { memberId?: string } } = {}) {
    let items = getDb().workoutLogs;
    if (where?.memberId) items = items.filter((l) => l.memberId === where.memberId);
    return items.length;
  },
};

const progressEntryModel = {
  async create({ data }: { data: Omit<ProgressEntry, "id" | "date"> & { date?: Date } }) {
    const db = getDb();
    const entry: ProgressEntry = {
      id: newId("pe"),
      ...data,
      date: data.date ?? new Date(),
    };
    db.progressEntries.push(entry);
    return entry;
  },

  async findMany({
    where,
    orderBy,
    take: limit,
  }: {
    where?: { memberId?: string };
    orderBy?: { date: OrderDir };
    take?: number;
  } = {}) {
    let items = getDb().progressEntries;
    if (where?.memberId) items = items.filter((e) => e.memberId === where.memberId);
    return take(sortBy(items, orderBy), limit);
  },
};

type WorkoutPlanWithRelations = WorkoutPlan & {
  items?: WorkoutPlanItem[];
  coach?: ReturnType<typeof attachCoachWithUser>;
};

const workoutPlanModel = {
  async findFirst({
    where,
    include,
    orderBy,
  }: {
    where: { coachId?: string; memberId?: string; id?: string };
    include?: { items?: boolean };
    orderBy?: { updatedAt: OrderDir };
  }): Promise<WorkoutPlanWithRelations | null> {
    const db = getDb();
    let items = db.workoutPlans;
    if (where.id) items = items.filter((p) => p.id === where.id);
    if (where.coachId) items = items.filter((p) => p.coachId === where.coachId);
    if (where.memberId) {
      if (typeof where.memberId === "string") {
        items = items.filter((p) => p.memberId === where.memberId);
      }
    }
    items = sortBy(items, orderBy);
    const plan = items[0];
    if (!plan) return null;
    let row: WorkoutPlanWithRelations = { ...plan };
    if (include?.items) row = attachWorkoutItems(plan);
    return row;
  },

  async findMany({
    where,
    include,
    orderBy,
    take: limit,
  }: {
    where?: {
      memberId?: string | { in: string[] };
      coachId?: string;
    };
    include?: { items?: boolean; coach?: { include?: { user?: boolean } } };
    orderBy?: { updatedAt: OrderDir };
    take?: number;
  } = {}): Promise<WorkoutPlanWithRelations[]> {
    const db = getDb();
    let items = db.workoutPlans;

    if (where?.coachId) items = items.filter((p) => p.coachId === where.coachId);

    if (where?.memberId) {
      const memberFilter = where.memberId;
      if (typeof memberFilter === "object" && "in" in memberFilter) {
        items = items.filter((p) => memberFilter.in.includes(p.memberId));
      } else if (typeof memberFilter === "string") {
        items = items.filter((p) => p.memberId === memberFilter);
      }
    }

    items = take(sortBy(items, orderBy), limit);

    return items.map((p) => {
      let row: WorkoutPlanWithRelations = { ...p };
      if (include?.items) row = attachWorkoutItems(p);
      if (include?.coach) row.coach = attachCoachWithUser(p.coachId);
      return row;
    });
  },

  async create({
    data,
  }: {
    data: {
      coachId: string;
      memberId: string;
      title: string;
      notes: string;
      items: { create: Omit<WorkoutPlanItem, "id" | "planId">[] };
    };
  }) {
    const db = getDb();
    const ts = new Date();
    const plan: WorkoutPlan = {
      id: newId("wp"),
      coachId: data.coachId,
      memberId: data.memberId,
      title: data.title,
      notes: data.notes,
      createdAt: ts,
      updatedAt: ts,
    };
    db.workoutPlans.push(plan);
    for (const item of data.items.create) {
      db.workoutPlanItems.push({ id: newId("wpi"), planId: plan.id, ...item });
    }
    return plan;
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: {
      title?: string;
      notes?: string;
      items?: { create: Omit<WorkoutPlanItem, "id" | "planId">[] };
    };
  }) {
    const db = getDb();
    const plan = db.workoutPlans.find((p) => p.id === where.id);
    if (!plan) throw new Error("Workout plan not found");
    if (data.title != null) plan.title = data.title;
    if (data.notes != null) plan.notes = data.notes;
    plan.updatedAt = new Date();
    if (data.items?.create) {
      for (const item of data.items.create) {
        db.workoutPlanItems.push({ id: newId("wpi"), planId: plan.id, ...item });
      }
    }
    return plan;
  },
};

const workoutPlanItemModel = {
  async deleteMany({ where }: { where: { planId: string } }) {
    const db = getDb();
    db.workoutPlanItems = db.workoutPlanItems.filter((i) => i.planId !== where.planId);
    return { count: 0 };
  },
};

type MealPlanWithRelations = MealPlan & {
  items?: MealPlanItem[];
  coach?: ReturnType<typeof attachCoachWithUser>;
};

const mealPlanModel = {
  async findFirst({
    where,
    include,
    orderBy,
  }: {
    where: { coachId?: string; memberId?: string; id?: string };
    include?: { items?: boolean };
    orderBy?: { updatedAt: OrderDir };
  }): Promise<MealPlanWithRelations | null> {
    const db = getDb();
    let items = db.mealPlans;
    if (where.id) items = items.filter((p) => p.id === where.id);
    if (where.coachId) items = items.filter((p) => p.coachId === where.coachId);
    if (where.memberId) items = items.filter((p) => p.memberId === where.memberId);
    items = sortBy(items, orderBy);
    const plan = items[0];
    if (!plan) return null;
    let row: MealPlanWithRelations = { ...plan };
    if (include?.items) row = attachMealItems(plan);
    return row;
  },

  async findMany({
    where,
    include,
    orderBy,
    take: limit,
  }: {
    where?: { memberId?: string };
    include?: { items?: boolean; coach?: { include?: { user?: boolean } } };
    orderBy?: { updatedAt: OrderDir };
    take?: number;
  } = {}): Promise<MealPlanWithRelations[]> {
    const db = getDb();
    let items = db.mealPlans;
    if (where?.memberId) items = items.filter((p) => p.memberId === where.memberId);
    items = take(sortBy(items, orderBy), limit);
    return items.map((p) => {
      let row: MealPlanWithRelations = { ...p };
      if (include?.items) row = attachMealItems(p);
      if (include?.coach) row.coach = attachCoachWithUser(p.coachId);
      return row;
    });
  },

  async create({
    data,
  }: {
    data: {
      coachId: string;
      memberId: string;
      title: string;
      notes: string;
      items: { create: Omit<MealPlanItem, "id" | "planId">[] };
    };
  }) {
    const db = getDb();
    const ts = new Date();
    const plan: MealPlan = {
      id: newId("mp"),
      coachId: data.coachId,
      memberId: data.memberId,
      title: data.title,
      notes: data.notes,
      createdAt: ts,
      updatedAt: ts,
    };
    db.mealPlans.push(plan);
    for (const item of data.items.create) {
      db.mealPlanItems.push({ id: newId("mpi"), planId: plan.id, ...item });
    }
    return plan;
  },

  async update({
    where,
    data,
  }: {
    where: { id: string };
    data: {
      title?: string;
      notes?: string;
      items?: { create: Omit<MealPlanItem, "id" | "planId">[] };
    };
  }) {
    const db = getDb();
    const plan = db.mealPlans.find((p) => p.id === where.id);
    if (!plan) throw new Error("Meal plan not found");
    if (data.title != null) plan.title = data.title;
    if (data.notes != null) plan.notes = data.notes;
    plan.updatedAt = new Date();
    if (data.items?.create) {
      for (const item of data.items.create) {
        db.mealPlanItems.push({ id: newId("mpi"), planId: plan.id, ...item });
      }
    }
    return plan;
  },
};

const mealPlanItemModel = {
  async deleteMany({ where }: { where: { planId: string } }) {
    const db = getDb();
    db.mealPlanItems = db.mealPlanItems.filter((i) => i.planId !== where.planId);
    return { count: 0 };
  },
};

export const prisma = {
  user: userModel,
  memberProfile: memberProfileModel,
  coachProfile: coachProfileModel,
  coachSubscription: coachSubscriptionModel,
  package: packageModel,
  purchase: purchaseModel,
  workoutLog: workoutLogModel,
  progressEntry: progressEntryModel,
  workoutPlan: workoutPlanModel,
  workoutPlanItem: workoutPlanItemModel,
  mealPlan: mealPlanModel,
  mealPlanItem: mealPlanItemModel,
  $transaction: runTransaction,
};

// re-export for typing convenience
export type { Database, Role } from "@/lib/db-types";
