# La Prospect — Product & Build Spec for Codex

## Objective
Build a production-ready SaaS web application called **La Prospect** for restaurant/business loyalty programs.

This project must be implemented as a **multitenant platform** with three main roles:
- **Superadmin**
- **Business Admin** (one or more businesses assigned)
- **End User / Customer**

The product must prioritize:
- **responsive design**
- **mobile-first UX for end users**
- **clean, modern, premium UI**
- **good information architecture**
- **fast CRUD workflows**
- **search, filters, sort, pagination in all listings**

Use **Supabase** for authentication, database, storage, and row-level security.

---

# Product name
**La Prospect**

---

# Domains / routes
There are **2 public entry points**:

1. `laprospect.com/login`
   - Access for **Superadmin** and **Business Admin**
   - The first screen must always be **Login**

2. `laprospect.com/[businessSlug]`
   - Access for **End Users / Customers**
   - The first screen must always be **Login/Register**
   - This route is specific to a business tenant

Important:
- Both entry points must show **authentication first**.
- No dashboard content should be visible before authentication.
- Protect all private routes.

---

# Core architecture
Build the app as a **multitenant SaaS**.

Each business has:
- name
- slug
- branding
- logo
- theme colors
- typography settings
- loyalty configuration
- rewards
- admin users
- customer users linked by activity/membership

A user can potentially interact with multiple businesses over time.

Business admins:
- can manage only their assigned business or businesses
- cannot access global/superadmin data

Superadmin:
- has full platform access
- can create, edit, delete businesses
- can create and manage admins
- can inspect users globally
- can manage rewards and loyalty settings per business

---

# Tech stack
Use the following stack unless there is a strong reason to improve it:

- **Next.js** (latest stable, App Router)
- **TypeScript**
- **Supabase**
- **Tailwind CSS**
- **shadcn/ui** for components
- **React Hook Form** + **Zod** for forms and validation
- **TanStack Table** for data tables
- **TanStack Query** for server state
- **Lucide React** for icons
- **Recharts** for KPI charts
- **Framer Motion** for subtle transitions
- **next-themes** if needed for theme system

Optional but recommended:
- a service layer for all Supabase access
- typed repository pattern
- clean folder structure
- seed data
- demo mode fixture data

---

# Design direction
The visual style must feel:
- modern
- minimal
- premium
- clean
- highly usable
- operationally efficient

## Layout rules
### Admin side
- Desktop-first but responsive
- Persistent **top header**
- Persistent **left sidebar**
- Top header must include:
  - product name: **La Prospect**
  - profile / user menu button
- Left sidebar must include main navigation
- Tables must support:
  - search
  - filters
  - sorting
  - pagination
  - empty states
  - loading states

### End user side
- **Mobile-first priority**
- Business-branded experience
- Clean wallet-like loyalty panel feel
- Large tappable controls
- Clear points, progress, rewards, redeem CTA

---

# Authentication
Use **Supabase Auth**.

## Admin login
Route: `laprospect.com/login`

Single login page for:
- superadmin
- business admin

After login:
- detect role(s)
- redirect accordingly
- if superadmin => superadmin dashboard
- if business admin => admin dashboard scoped to assigned business(es)

## User login/register
Route: `laprospect.com/[businessSlug]`

Must display:
- login tab
- register tab

### User registration fields
Required:
- first name
- last name
- email
- password
- confirm password
- accept terms and conditions

Optional:
- phone

Validation:
- proper email
- password confirmation
- terms required

After login/register:
- user lands inside the loyalty panel for that specific business

---

# Role model
Implement role-based access control with clear guards.

## Roles
- `superadmin`
- `business_admin`
- `customer`

A user may have one or more admin assignments.

---

# Admin application modules

## 1. Dashboard / Home
Applicable to:
- superadmin
- business admin

The dashboard must include prominent KPIs.

### Superadmin KPIs
- total businesses
- active businesses
- total users
- active users
- total rewards redeemed
- points issued this month
- points redeemed this month
- growth metrics

### Business admin KPIs
Scoped to current business/businesses:
- total registered users
- active users
- points issued
- rewards redeemed
- most redeemed reward
- users added this month
- visits / scoring actions this week
- streak participation

Add charts where useful:
- user growth
- points issued vs redeemed
- reward redemption trends

All KPI modules must support filters by:
- date range
- business (if role can access several)

---

## 2. Businesses module
### Superadmin only
Views required:
- business list
- create business
- business detail
- edit business
- delete business

### Business list
Must include:
- search
- filters
- sortable columns
- table

Suggested columns:
- logo
- business name
- slug / URL
- status
- active rewards
- total users
- active users
- owner contact
- admins assigned
- created at
- last activity

### Business detail
Must display and allow editing of:
- business name
- slug
- logo
- cover/branding assets
- active rewards
- users summary
- latest active users
- all users
- owner contact info
- assigned admin users
- public URL
- loyalty settings
- extra highlighted business information

Everything should be editable from this detail view or through structured edit flows.

---

## 3. Users module
Applicable to:
- superadmin: global view
- business admin: scoped view

Views required:
- users list
- create user
- user detail
- edit user
- delete user

### Users list
Include:
- search
- filters
- sortable columns
- pagination

Suggested columns:
- name
- surname
- email
- phone
- role type
- businesses visited
- total points
- current tier
- last activity
- total rewards redeemed
- created at

### User detail
Must include a complete profile:
- first name
- last name
- email
- phone
- last activity
- businesses visited
- points per business
- total points history
- rewards redeemed
- missions completed
- achievements unlocked
- streaks
- notes/internal admin info

Allow edit and delete actions.

---

## 4. Business branding / user page customization
Applicable to:
- superadmin
- business admin (only assigned businesses)

Provide a customization area for the end-user page (`/[businessSlug]`).

Editable parameters:
- primary color
- secondary color
- accent color
- background style
- logo
- brand image/banner
- typography
- border radius feel (subtle, medium, rounded)
- optional welcome text
- reward card appearance

Need:
- live preview
- save/publish flow
- reset to defaults

---

## 5. Scoring module (`Puntuador`)
Applicable to:
- business admin
- superadmin if acting inside a business

This module is operational and should be very fast to use.

### Goal
A waiter/staff member can:
- search a user by email or phone
- add points manually
- redeem rewards manually
- remove/consume points when reward is claimed

### Required functions
- input search by email or phone
- quick search results
- user summary card
- current balance
- current tier
- closest reward progress
- action buttons:
  - `+1 point`
  - custom point add
  - redeem reward
  - mark reward as delivered

### Redemption flow
When a user redeems a reward:
- the staff member selects the reward
- confirms delivery
- the system deducts points
- creates a redemption record
- updates the progress UI

### Audit
All scoring actions must create an audit log with:
- who performed the action
- business
- user affected
- action type
- points delta
- timestamp
- note/reason if applicable

---

## 6. Rewards module
Applicable to:
- superadmin
- business admin (scoped)

Views required:
- rewards list
- create reward
- reward detail
- edit reward
- delete reward

### Base reward structure
Every reward must include at minimum:
- reward title / what the reward is
- points required
- duration / validity window

Additional recommended fields:
- description
- type
- status
- image
- start date
- end date
- business
- stock/availability optional
- active/inactive
- stackable yes/no

### Reward types
Implement support for:
- standard reward
- special reward
- bonus reward

### Loyalty and gamification actions to support
The system must support creating and managing the following mechanics:

#### Tiers
- Bronze
- Silver
- Gold

Benefits can include:
- discounts
- priority
- perks

#### Missions
Examples:
- “Come 2 times this week”
- “Try 3 different dishes”

#### Unlockable achievements
Examples:
- “Loyal customer” after 10 visits
- “Explorer” after 5 different dishes

#### Visual progress
- progress bar like “2 points left until your next reward”

#### Time-slot multipliers
Example:
- x2 points from Monday to Thursday, 16:00–19:00

#### Strategic product boosts
Examples:
- +1 extra point if customer buys dessert
- +1 extra point if customer buys premium drink

#### Streaks
Example:
- 3 visits in 7 days => bonus

#### First order of the month bonus
- incentivize monthly recurrence

#### Incremental points by spend
Not only fixed logic.
Must support rules like:
- €10 => 1 point
- €20 => 3 points

Need an extensible rules engine/data model for this.

---

# End-user experience (`laprospect.com/[businessSlug]`)
After login/register, the user sees the panel for the concrete business they entered.

## Main content
- My points
- Progress bar to nearest reward
- Rewards available in this business
- Button to redeem reward

Also recommended:
- current tier
- recent activity
- redeemed rewards history
- missions / achievements
- next milestone

## UX priorities
- mobile-first
- very clear hierarchy
- quick loading
- business-branded appearance
- simple, low-friction interactions

## Redemption flow
The app can either:
- generate a redeem request to be validated in-store
- or simply let the staff validate from the scoring module

Implement the architecture so both options are possible.

---

# Search, filters, sorting
All list views in the admin app must support:
- text search
- filter panels
- column sorting
- pagination
- empty states
- saved filters optional if easy to implement

This applies to:
- businesses
- users
- rewards
- admins
- activity logs if implemented

---

# Recommended database model
Design and implement a robust Supabase schema.

Suggested tables:

## Auth/profile
- `profiles`
  - id
  - first_name
  - last_name
  - email
  - phone
  - avatar_url
  - created_at
  - updated_at

## Roles
- `user_roles`
  - id
  - user_id
  - role (`superadmin`, `business_admin`, `customer`)

## Businesses
- `businesses`
  - id
  - name
  - slug
  - logo_url
  - owner_name
  - owner_email
  - owner_phone
  - primary_color
  - secondary_color
  - accent_color
  - font_family
  - welcome_text
  - is_active
  - created_at
  - updated_at

## Business admin assignments
- `business_admin_assignments`
  - id
  - business_id
  - user_id

## Business memberships / customer-business relation
- `business_memberships`
  - id
  - business_id
  - user_id
  - joined_at
  - last_activity_at
  - current_points
  - current_tier
  - total_points_earned
  - total_points_redeemed

## Rewards
- `rewards`
  - id
  - business_id
  - title
  - description
  - reward_type
  - points_required
  - duration_type
  - starts_at
  - ends_at
  - is_active
  - image_url
  - created_at
  - updated_at

## Reward redemptions
- `reward_redemptions`
  - id
  - reward_id
  - business_id
  - user_id
  - redeemed_at
  - delivered_by_user_id
  - points_spent
  - status

## Point transactions
- `point_transactions`
  - id
  - business_id
  - user_id
  - performed_by_user_id
  - type (`earn`, `redeem`, `adjustment`, `bonus`)
  - points_delta
  - source
  - note
  - created_at

## Loyalty rules
- `loyalty_rules`
  - id
  - business_id
  - rule_type
  - config_json
  - is_active
  - starts_at
  - ends_at

## Missions
- `missions`
  - id
  - business_id
  - title
  - description
  - mission_type
  - config_json
  - reward_points
  - is_active

## User mission progress
- `user_mission_progress`
  - id
  - mission_id
  - business_id
  - user_id
  - progress_value
  - completed_at
  - status

## Achievements
- `achievements`
  - id
  - business_id
  - title
  - description
  - achievement_type
  - config_json
  - icon
  - is_active

## User achievements
- `user_achievements`
  - id
  - achievement_id
  - business_id
  - user_id
  - unlocked_at

## Activity log / audit trail
- `audit_logs`
  - id
  - actor_user_id
  - business_id
  - target_user_id
  - entity_type
  - entity_id
  - action_type
  - metadata_json
  - created_at

---

# Multi-tenant security
Implement proper tenant isolation.

## Requirements
- Business admins can only access data from assigned businesses
- Customers can only access their own data and only within the current business context
- Superadmin can access everything
- Use **Supabase RLS policies** carefully
- Include policy definitions or migration comments

This part is critical.

---

# UX flows to implement

## Admin flows
1. Login
2. View dashboard
3. Manage businesses
4. Manage users
5. Manage rewards
6. Customize business branding
7. Use scoring module
8. Redeem reward for user
9. Review user detail and history

## Customer flows
1. Access business URL
2. Login or register
3. View points
4. View next reward progress
5. Browse rewards
6. Redeem reward
7. View loyalty history

---

# Components to build
Create reusable components for:
- app shell
- sidebar
- top header
- user menu
- stat cards / KPI cards
- data tables
- search bar
- filters drawer
- sort controls
- empty states
- loading skeletons
- business branding preview
- reward cards
- progress bar
- user summary card
- scoring action panel
- confirmation dialogs
- forms

---

# Pages to build

## Admin app
- `/login`
- `/admin`
- `/admin/businesses`
- `/admin/businesses/new`
- `/admin/businesses/[id]`
- `/admin/businesses/[id]/edit`
- `/admin/users`
- `/admin/users/new`
- `/admin/users/[id]`
- `/admin/users/[id]/edit`
- `/admin/rewards`
- `/admin/rewards/new`
- `/admin/rewards/[id]`
- `/admin/rewards/[id]/edit`
- `/admin/branding`
- `/admin/scoring`
- `/admin/profile`

## User app
- `/[businessSlug]`
- `/[businessSlug]/login` optional alias if useful
- `/[businessSlug]/register` optional alias if useful
- `/[businessSlug]/rewards`
- `/[businessSlug]/history`
- `/[businessSlug]/profile`

Use a route strategy that keeps business context clean.

---

# Seed / demo data
Create realistic seed data for:
- 1 superadmin
- 2 businesses
- 2 business admins
- 20 users
- multiple rewards
- multiple point transactions
- missions
- achievements
- tiers

This is important so the UI looks finished immediately.

---

# Implementation quality bar
Codex must generate a project that is:
- modular
- typed
- maintainable
- production-oriented
- visually polished
- not a rough prototype

Avoid:
- placeholder-only UIs
- broken navigation
- incomplete CRUD
- unscoped tenant logic
- fake forms with no persistence unless clearly marked

---

# Deliverables
Generate the full project including:
- app structure
- components
- pages
- Supabase schema/migrations
- RLS policies
- seed script
- auth flows
- responsive UI
- demo content
- README with setup instructions
- environment variable template

Also generate:
- a clear folder structure
- comments only where useful
- a concise README with local setup

---

# Nice-to-have extras
If possible, include:
- command palette
- dark mode for admin
- toast notifications
- CSV export in tables
- activity timeline in user detail
- image upload for business logos
- optimistic UI for fast scoring actions

---

# Final instruction to Codex
Do not create a toy mockup.
Build a coherent, elegant, working SaaS foundation for **La Prospect** with strong multi-tenant structure, clean UX, responsive admin views, and a mobile-first customer experience.

Start by scaffolding the project, defining the schema, implementing auth and role guards, then build the admin shell, then the business/customer flows, then the scoring and rewards engine foundations.

