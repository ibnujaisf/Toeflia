<div align="center">

<img src="public/Toeflia.png" alt="Toeflia Logo" width="72" height="72" />

# Toeflia

**TOEFL Intelligent Academy** — The AI-powered TOEFL simulator that doesn't just grade your answers. It understands why you got them wrong, then helps you never miss again.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[Live Demo](#) · [Report a Bug](https://github.com/ibnujaisf/Toeflia/issues) · [Request Feature](https://github.com/ibnujaisf/Toeflia/issues)

</div>

---

## 📖 About The Project

Toeflia is a **next-generation, free TOEFL ITP micro-learning simulator** built on the principle that effective test preparation should be intelligent, personalized, and friction-free.

### The Problem

Final-year students and job-seekers facing TOEFL graduation or certification requirements are stuck with the same broken options: expensive prep courses with rigid schedules and generic practice tests that treat every mistake the same. Hours of study pass, yet test-takers still cannot identify *what's actually holding their score back*.

### The Solution

Toeflia replaces the static practice test with a fully AI-driven feedback loop. Every question is **generated fresh by Google Gemini** on demand — no recycled question banks. When you submit a session, the AI evaluates your exact wrong answers, writes a personalized mistake summary, and generates a targeted remedial test against your specific weak points. The loop from practice → insight → improvement is closed in minutes, not days.

### Core Architecture

The application is built with the **Next.js App Router** using a clean Server/Client component boundary:

- **Landing Page** (`/`) — A multi-section marketing SPA with smooth-scroll navigation, animated counters, and a no-registration-required onboarding modal that persists a user profile to `localStorage`.
- **Dashboard** (`/dashboard`) — A protected multi-route interface with a persistent sidebar, displaying a personal activity summary and the latest AI review snippet.
- **Practice Engine** (`/dashboard/practice/[moduleId]`) — A timed, interactive test-taking experience for three TOEFL ITP sections. Upon submission, calls a server-side API route which invokes the Gemini AI evaluator and persists the full session to PostgreSQL via Prisma.
- **Review Center** (`/dashboard/review/[reviewId]`) — A deep-dive session view rendering per-question AI explanations, with an **AI Retake** feature that generates 10 brand-new questions targeting only the user's demonstrated weaknesses.
- **AI Insights Hub** (`/dashboard/insights`) — An aggregated view of all past AI evaluations, surfacing cross-session patterns and actionable improvement tips.

---

## ✨ Key Features

- **🤖 100% AI-Generated Questions** — Google Gemini generates a fresh set of 10 questions per session for each of the 3 TOEFL ITP sections (Listening, Structure & Written Expression, Reading Comprehension), so you never see the same question twice.
- **⏱️ Proportional TOEFL Timer** — Each practice session uses time limits scaled proportionally from the real TOEFL ITP exam. The timer is optional for low-pressure practice.
- **🎯 Personalized AI Mistake Analysis** — After every test, Gemini analyzes your incorrect answers by grammar category or reading skill and generates a natural-language evaluation summary stored to your profile.
- **🔁 AI Remedial Retake** — With a single click on the Review page, the AI reads your mistake summary and generates 10 brand-new questions targeting *only* your identified weak points.
- **💬 AI Tutor Chat** — An interactive chat interface on the Review page allowing users to ask follow-up questions about any specific question or concept from their session.
- **📊 AI Insights & Patterns** — A dedicated insights dashboard aggregating all past AI evaluations, displaying attempt history per module with scores, summaries, and actionable tips.
- **🌙 Dark / Light Mode** — Full dark mode support with a flash-free theme initialization script, persistent via `localStorage`.
- **🚀 Zero-Friction Onboarding** — No email, no password. Users provide only a name and status; the profile is persisted locally for a seamless experience.
- **💀 Glassmorphism Skeleton Loaders** — Every dashboard route has a pixel-perfect `loading.tsx` skeleton component that mirrors the final layout, eliminating content shift on navigation.
- **🐳 Docker Ready** — Includes a production-grade multi-stage `Dockerfile` configured for Next.js `standalone` output.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16 (App Router)** | Full-stack React framework, file-based routing, Server Components |
| **React 19** | UI rendering, hooks, context API |
| **TypeScript 5** | Static typing across the entire codebase |
| **Tailwind CSS 4** | Utility-first styling with dark mode variants |
| **Motion (Framer Motion)** | Page/component animations and transitions |
| **React Markdown** | Rendering AI-generated markdown evaluations and tips |
| **React Bits** | Custom animated components (BlurText, ShinyText, CountUp) |
| **OGL** | WebGL-based background canvas effects on the landing page |

### Backend & AI
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | Server-side REST endpoints for question generation, test submission, insights |
| **Google Gemini AI** (`gemini-flash-latest`) | Dynamic question generation, test evaluation, remedial targeting, AI chat |
| **Prisma ORM 6** | Type-safe database access layer with auto-migrations |

### Database
| Technology | Purpose |
|---|---|
| **PostgreSQL** (via Supabase) | Primary persistence for users, test sessions, and question results |

### Tooling & Infrastructure
| Technology | Purpose |
|---|---|
| **Docker** | Multi-stage containerized production build |
| **ESLint** | Code linting |
| **Google Fonts** | Urbanist (display) + Inter (body) typography |
| **next-themes** | SSR-safe theme provider foundation |

---

## 📁 Project Structure

```
d:\Toeflia\
│
├── prisma/
│   └── schema.prisma           # Database schema: User, TestSession, QuestionResult
│
├── public/
│   └── Toeflia.png             # App icon / favicon
│
├── src/
│   ├── app/                    # Next.js App Router root
│   │   ├── layout.tsx          # Root layout: fonts, theme anti-flash script, metadata
│   │   ├── globals.css         # Global styles, CSS variables, custom animations
│   │   ├── page.tsx            # Landing page (Hero, About, Features, How It Works)
│   │   │
│   │   ├── api/                # Server-side API route handlers
│   │   │   ├── dashboard/      # GET: fetches recent activity for the dashboard
│   │   │   ├── generate-questions/ # POST: calls Gemini to generate a new question set
│   │   │   ├── insights/       # GET: fetches all sessions with AI summaries for insights page
│   │   │   ├── review/         # GET: fetches a single session with all QuestionResults
│   │   │   └── submit-test/    # POST: scores test, calls Gemini evaluator, saves session to DB
│   │   │
│   │   └── dashboard/          # Protected dashboard routes
│   │       ├── layout.tsx      # Dashboard shell layout with Sidebar
│   │       ├── loading.tsx     # Route-level skeleton for the main dashboard
│   │       ├── page.tsx        # Dashboard home: activity summary + AI review teaser
│   │       │
│   │       ├── practice/
│   │       │   ├── page.tsx            # Module selection grid (Listening, Structure, Reading)
│   │       │   ├── loading.tsx         # Practice route skeleton
│   │       │   └── [moduleId]/
│   │       │       └── page.tsx        # Active test engine: question rendering, timer, submission
│   │       │
│   │       ├── review/
│   │       │   ├── page.tsx            # Review list: all past sessions, grouped by module
│   │       │   ├── loading.tsx         # Review route skeleton
│   │       │   └── [reviewId]/
│   │       │       └── page.tsx        # Session detail: per-question AI explanations + AI chat
│   │       │
│   │       └── insights/
│   │           ├── page.tsx            # AI insights aggregator across all sessions
│   │           └── loading.tsx         # Insights route skeleton
│   │
│   ├── components/
│   │   ├── features/           # Domain-specific feature components
│   │   │   ├── Navbar.tsx          # Landing page navigation bar
│   │   │   ├── Sidebar.tsx         # Dashboard persistent sidebar with navigation
│   │   │   ├── OnboardingModal.tsx # Zero-friction user onboarding flow
│   │   │   ├── PreTestModal.tsx    # Pre-flight confirmation modal before a test
│   │   │   └── ReviewList.tsx      # Session card list with delete functionality
│   │   │
│   │   ├── skeletons/          # Glassmorphism skeleton loader components
│   │   │   ├── DashboardSkeleton.tsx
│   │   │   ├── InsightsSkeleton.tsx
│   │   │   ├── PracticeSkeleton.tsx
│   │   │   └── ReviewSkeleton.tsx
│   │   │
│   │   ├── ui/                 # Reusable generic UI primitives
│   │   │   ├── Logo.tsx            # SVG logo component
│   │   │   ├── ThemeToggle.tsx     # Dark/light mode toggle button
│   │   │   └── LogoutModal.tsx     # Logout confirmation modal
│   │   │
│   │   └── reactbits/          # Animated micro-interaction components
│   │       ├── BlurText.tsx        # Letter-by-letter blur reveal animation
│   │       ├── ShinyText.tsx       # Animated shine effect on text
│   │       ├── CountUp.tsx         # Animated number counter
│   │       ├── SpotlightCard.tsx   # Mouse-tracking spotlight card effect
│   │       └── StarBorder.tsx      # Animated star border effect
│   │
│   ├── context/
│   │   ├── UserContext.tsx     # Global user profile state (localStorage-backed)
│   │   └── ThemeContext.tsx    # Global theme state (dark/light/system)
│   │
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton for DB access
│   │   └── prompts.ts          # All Gemini system prompts (generators + evaluators + chat)
│   │
│   └── services/
│       └── ai.service.ts       # Gemini AI service: evaluateTest, generateQuestions, chatWithTutor
│
├── Dockerfile                  # Multi-stage production Docker image
├── .dockerignore               # Files excluded from Docker build context
├── next.config.ts              # Next.js configuration (standalone output, build flags)
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 20.x`
- [npm](https://www.npmjs.com/) `>= 10.x`
- A [Supabase](https://supabase.com/) project (or any PostgreSQL instance)
- A [Google Gemini API Key](https://ai.google.dev/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/ibnujaisf/Toeflia.git
cd Toeflia
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root. The following variables are required based on the Prisma schema and AI service:

```env
# ──────────────────────────────────────────
# DATABASE (PostgreSQL via Supabase)
# ──────────────────────────────────────────

# Connection pooling URL (used by Prisma Client at runtime)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection URL (used by Prisma Migrate)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# ──────────────────────────────────────────
# AI (Google Gemini)
# ──────────────────────────────────────────

GEMINI_API_KEY="your_google_gemini_api_key_here"
```

> **Note:** If you're not using Supabase, replace the `DATABASE_URL` and `DIRECT_URL` values with your own PostgreSQL connection strings. You can use the same URL for both if you're not using a connection pooler.

**4. Run database migrations**

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

**5. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

To build and run the production Docker image:

```bash
# Build the image
docker build -t toeflia .

# Run the container (pass your env vars)
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e DIRECT_URL="your_direct_url" \
  -e GEMINI_API_KEY="your_gemini_api_key" \
  toeflia
```

---

## 📸 Screenshots

| Landing Page (Hero) | Practice Module Selection |
|---|---|
| ![Landing Page Hero](screenshots/landing-hero.png) | ![Practice Module](screenshots/practice-module.png) |

| Active Test Engine | AI Review & Insights |
|---|---|
| ![Active Test](screenshots/active-test.png) | ![AI Insights](screenshots/ai-insights.png) |

| Session Detail with AI Chat | Dashboard Overview |
|---|---|
| ![Session Review](screenshots/session-review.png) | ![Dashboard](screenshots/dashboard.png) |

> Screenshots coming soon. Run the project locally to explore the full UI.

---

## 🏆 \#JuaraVibeCoding & AI-Assisted Development

This project was developed as part of the **"#JuaraVibeCoding — Vibe Coding Study Jam"** program, hosted by **Google Developer Groups (GDG)** in **May 2026**.

The program's motto, **"Code Less, Build More"**, perfectly captures the development philosophy behind Toeflia. Rather than writing every line of boilerplate by hand, AI-assisted development tools were used extensively throughout the project lifecycle to:

- **Accelerate component scaffolding** — UI components, skeleton loaders, and page layouts were rapidly prototyped with AI assistance, freeing up engineering focus for product logic.
- **Implement complex SPA architecture** — The stage-based dashboard flow, React Context providers, and Next.js App Router patterns were structured with AI pair-programming guidance.
- **Refine AI prompt engineering** — The system prompts for Gemini (in `src/lib/prompts.ts`) were iteratively co-authored with AI tooling to achieve accurate, structured JSON evaluation outputs.
- **Accelerate animation implementation** — Framer Motion (Motion v12) animation sequences and micro-interactions were implemented faster through AI-assisted code generation.

### Certification

- 🔗 **Verification Link:** [https://goo.gle/jvc-cert-veritier](https://goo.gle/jvc-cert-veritier)
- 🔑 **Verification Code:** `JVC2605-W7M2-HZ4S`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ☕ and AI by <strong>Ibnu Faiz</strong></p>
  <p>
    <a href="https://github.com/ibnujaisf">GitHub</a>
  </p>
</div>
