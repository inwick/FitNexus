import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { homeForRole } from "@/lib/auth.config";
import { COACH_MONTHLY_PRICE } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Eyebrow,
  FaqItem,
  FeatureCard,
  Marquee,
  PricingCard,
  SectionHeading,
  SiteFooter,
  StepCard,
  Testimonial,
} from "@/components/marketing";

const features = [
  {
    title: "For Members",
    desc: "Find your perfect coach and track every rep.",
    accent: "volt" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
      </svg>
    ),
    points: [
      "Set goals & build your profile",
      "Browse & hire expert coaches",
      "Log workouts & track progress",
    ],
  },
  {
    title: "For Coaches",
    desc: "Grow your business and manage clients effortlessly.",
    accent: "violet" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    points: [
      "Publish packages on the marketplace",
      "Manage clients in one dashboard",
      "Send plan updates via WhatsApp",
    ],
  },
  {
    title: "For Admins",
    desc: "Full visibility into your platform's growth.",
    accent: "flare" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    points: ["Track subscriptions & revenue", "Manage all users", "Confirm payments"],
  },
];

const steps = [
  {
    title: "Create your profile",
    desc: "Set your goals, stats, and preferences in minutes — or set up your coaching business.",
  },
  {
    title: "Match with a coach",
    desc: "Browse expert coaches, compare packages, and hire the one that fits your goals.",
  },
  {
    title: "Train & track progress",
    desc: "Follow custom plans, log every workout, and watch your progress climb week over week.",
  },
];

const testimonials = [
  {
    quote:
      "FitNexus made it effortless to find a coach who actually gets my goals. I've hit personal records I never thought possible.",
    name: "Maya R.",
    role: "Member · Fat loss",
    initials: "MR",
  },
  {
    quote:
      "I run my entire coaching business from one dashboard now. Client plans, payments, and progress — all in one place.",
    name: "Dan K.",
    role: "Strength Coach",
    initials: "DK",
  },
  {
    quote:
      "The progress tracking keeps me accountable. Seeing the trend line climb is ridiculously motivating.",
    name: "Priya S.",
    role: "Member · Muscle gain",
    initials: "PS",
  },
];

const faqs = [
  {
    question: "Is FitNexus free for members?",
    answer:
      "Yes. Creating an account, building your profile, browsing coaches, and tracking your workouts is completely free. You only pay for the coaching packages you choose to buy.",
  },
  {
    question: "How much does it cost to coach on FitNexus?",
    answer: `Coaches pay a flat $${COACH_MONTHLY_PRICE}/month to publish packages on the marketplace and manage unlimited clients from a single dashboard.`,
  },
  {
    question: "Can I track my own workouts without a coach?",
    answer:
      "Absolutely. Members can log workouts, record body metrics, and view progress trends on their own — hiring a coach is optional.",
  },
  {
    question: "How do payments work?",
    answer:
      "Members purchase coach packages directly on the platform, and coaches get notified when a purchase is confirmed. Admins keep full visibility into revenue and subscriptions.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect(homeForRole(session.user.role));

  return (
    <div className="flex min-h-full flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo href="/" />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#how" className="transition-colors hover:text-foreground">
              How it works
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ButtonLink href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Log in
            </ButtonLink>
            <ButtonLink href="/register" size="sm">
              Get started
            </ButtonLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-mesh relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:items-center lg:gap-8 lg:pt-24">
          <div className="flex flex-col items-start">
            <div className="animate-fade-up">
              <Eyebrow>The fitness coaching marketplace</Eyebrow>
            </div>
            <h1 className="font-display animate-fade-up-delay-1 mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              Train harder.
              <br />
              <span className="text-brand-dark text-glow dark:text-brand">
                Coach smarter.
              </span>
            </h1>
            <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted">
              FitNexus connects members with expert coaches and gives coaches the
              tools to manage clients, build plans, and grow their business — all
              in one energizing platform.
            </p>
            <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" size="lg">
                Join as a member
              </ButtonLink>
              <ButtonLink href="/register?role=coach" variant="outline" size="lg">
                Become a coach
              </ButtonLink>
            </div>
            <div className="animate-fade-up-delay-4 mt-12 flex flex-wrap items-center gap-8">
              {[
                { n: "500+", l: "Expert coaches" },
                { n: "10,000+", l: "Active members" },
                { n: "4.9★", l: "Average rating" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-2xl font-bold tracking-tight text-foreground">
                    {s.n}
                  </p>
                  <p className="text-sm text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product preview */}
          <div className="animate-fade-up-delay-2 relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-brand/10 blur-3xl" />
            <HeroPreview />
          </div>
        </div>

        {/* Trust marquee */}
        <div className="relative border-y border-border/60 bg-card/40 py-5">
          <Marquee
            items={[
              "Goal-based matching",
              "Custom workout plans",
              "Progress analytics",
              "Client management",
              "Meal planning",
              "Secure payments",
            ]}
          />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From first rep to personal best"
          description="Get up and running in three simple steps — whether you're chasing a goal or building a coaching business."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <StepCard key={s.title} step={i + 1} title={s.title} desc={s.desc} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-border bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <SectionHeading
            eyebrow="Built for everyone"
            title="One platform, three superpowers"
            description="Members, coaches, and admins each get a purpose-built experience designed around what they need most."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                points={f.points}
                accent={f.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Loved by the community"
          title="Results that speak for themselves"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Testimonial key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y border-border bg-card/40">
        <div className="mx-auto w-full max-w-4xl px-6 py-24">
          <SectionHeading
            eyebrow="Simple pricing"
            title="Start free. Scale when you're ready."
            description="No hidden fees. Members train for free, coaches pay one flat monthly rate."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <PricingCard
              name="Member"
              price="Free"
              description="For everyone chasing a fitness goal."
              features={[
                "Build your fitness profile",
                "Browse & hire expert coaches",
                "Log unlimited workouts",
                "Progress analytics & trends",
              ]}
              cta="Join as a member"
              href="/register"
            />
            <PricingCard
              name="Coach"
              price={`$${COACH_MONTHLY_PRICE}`}
              cadence="/ month"
              description="For coaches growing their business."
              features={[
                "Everything in Member",
                "Publish unlimited packages",
                "Full client management dashboard",
                "Plan builder + WhatsApp updates",
              ]}
              cta="Become a coach"
              href="/register?role=coach"
              featured
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-6 py-24">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="mt-12 space-y-4">
          {faqs.map((f) => (
            <FaqItem key={f.question} question={f.question} answer={f.answer} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mb-24 w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-brand/20 bg-foreground px-8 py-16 text-center md:px-16 md:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 animate-glow-pulse rounded-full bg-brand/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight text-background md:text-5xl">
              Ready to transform your fitness journey?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-background/70">
              Join thousands of members and coaches already training on FitNexus.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/register" size="lg">
                Get started free
              </ButtonLink>
              <Link
                href="/login"
                className="inline-flex h-12 items-center rounded-xl px-7 text-base font-semibold text-background/80 transition-colors hover:text-background"
              >
                I have an account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-black/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-strong to-brand-dark text-brand-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 9v6m10.5-6v6M4.5 9.75h3m9 0h3M4.5 14.25h3m9 0h3M9 6.75v10.5m6-10.5v10.5" />
            </svg>
          </span>
          <span className="font-display text-sm font-bold tracking-tight">
            Your progress
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand-dark dark:text-brand">
          ▲ On track
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { l: "Workouts", v: "128", t: "volt" },
          { l: "Streak", v: "24d", t: "flare" },
          { l: "Weight", v: "-6kg", t: "cyan" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-xl border border-border bg-background-elevated p-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
              {s.l}
            </p>
            <p className="font-display mt-1 text-xl font-bold tracking-tight text-foreground">
              {s.v}
            </p>
          </div>
        ))}
      </div>

      {/* Mini chart */}
      <div className="mt-3 rounded-xl border border-border bg-background-elevated p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">Weight trend</p>
          <p className="text-[10px] text-muted">12 weeks</p>
        </div>
        <svg viewBox="0 0 300 90" className="mt-2 w-full" aria-hidden>
          <defs>
            <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,80 L0,55 C40,52 60,40 90,42 C130,45 150,28 190,25 C230,22 260,14 300,10 L300,80 Z"
            fill="url(#heroArea)"
          />
          <path
            d="M0,55 C40,52 60,40 90,42 C130,45 150,28 190,25 C230,22 260,14 300,10"
            fill="none"
            stroke="var(--brand)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Coach row */}
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background-elevated p-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-brand-dark text-xs font-bold text-white">
          DK
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            Coach Dan · Strength
          </p>
          <p className="truncate text-xs text-muted">Next session · Tomorrow 7am</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-[10px] font-bold text-brand-dark dark:text-brand">
          Active
        </span>
      </div>
    </div>
  );
}
