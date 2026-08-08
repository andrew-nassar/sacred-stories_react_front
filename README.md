# Sacred Story 🧭

Sacred Story is a highly immersive, multi-layered hagiographical exploration platform designed for uncovering the lives, timelines, relics, and historic narratives of saints, popes, apostles, martyrs, and holy witnesses of the Church. Combining classic ecclesiastical typography with a responsive, modern glassmorphic dashboard, the application offers structured historical exploration alongside a state-of-the-art server-side conversational AI archivist.

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Architecture](#project-architecture)
5. [Folder Structure](#folder-structure)
6. [Authentication & Session Management](#authentication--session-management)
7. [Authorization & Role Protection](#authorization--role-protection)
8. [Routing System](#routing-system)
9. [API Integration & Services](#api-integration--services)
10. [Dual State Management](#dual-state-management)
11. [Admin Dashboard](#admin-dashboard)
12. [Hybrid Fallback & Local Storage Layer](#hybrid-fallback--local-storage-layer)
13. [Environment Configuration](#environment-configuration)
14. [Local Setup & Installation](#local-setup--installation)
15. [Production Compilation](#production-compilation)
16. [Technical Debt & Architectural Insights](#technical-debt--architectural-insights)

---

## 🏛️ Project Overview

Sacred Story was engineered to serve both academic hagiographical research and personal devotional study. It features two primary environments:
- **Sanctuary Web App (Client/Pilgrim Facing)**: A client-side Single Page Application (SPA) driven by local state, rich layout transitions, multi-language localization, and an audio player for sacred liturgies.
- **Ecclesiastical Portal (Admin/Curator Facing)**: A secure workspace for reviewing pending story contributions, auditing site metrics, editing content metadata, managing user rosters, and reviewing editorial standards.

---

## ✨ Key Features

### 1. Hagiography Explorer & Filter System
- Deep index of holy witnesses divided into clear canonical categories: *Saints, Popes, Apostles, Martyrs, Monks, and Biblical Characters*.
- Responsive search bar with instant client-side keyword matching.
- Specialized visual design cards mapping distinct color themes to specific classifications (e.g., *burgundy* accent borders for Martyrs, *navy* for Popes & Monks, and *gold* for Saints).

### 2. Multi-Dimensional Saint Profile Details
- **Biography**: Detailed narratives of holy lives.
- **Interactive Timeline**: An organized chronography sorting historical events from oldest to newest with support for both Gregorian (AD) and Arabic numeral formatting.
- **Location Showcase**: Maps burial places, gravesites, and sanctuaries with exact physical addresses and coordinate structures.
- **Sacred Gallery**: Elegant image masonry capturing relics, manuscript artifacts, and historical iconography.

### 3. The Sacred Archivist (Gemini AI Chatbot)
- A floating chat helper that serves as a theological scholar and historical archivist.
- Powered server-side by the `GoogleGenAI` model SDK using dynamic context guidelines.
- Retains context through structured session message logs.

### 4. Interactive Liturgical Reflection Generator
- Accepts user-submitted situational contexts and returns tailored hagiographical reflections.
- Dynamically pairs modern personal experiences with historical struggles faced by specific holy witnesses.

### 5. Ambient Devotional Audio Player
- Integrated media console playing Gregorian chants and historic liturgical compositions.
- Global playing state preserved smoothly across views and sidebar tabs.

### 6. Fully Autonomous Admin Panel
- Subdivided into dynamic, self-contained sub-modules: *Executive Dashboard, Pending Reviews, Roster Directories, Stories Database, and Portal Settings*.

---

## 🛠️ Technology Stack

### Frontend Core
- **Framework**: React 18 with Fast Refresh (via Vite)
- **Programming Language**: TypeScript (Strict Typings)
- **Animations**: Framer Motion (imported as `motion` from `motion/react`)
- **Styling**: Tailwind CSS (fully customized glassmorphism and gold-accented palette)
- **Charts & Visualizations**: Recharts
- **Icon Library**: Lucide React
- **HTTP Client**: Axios (configured with intercepts)

### Backend Service
- **Framework**: Express (Node.js) with tsx launcher
- **AI Core**: `@google/genai` TypeScript SDK
- **Environment Integration**: Dotenv

---

## 📐 Project Architecture

Sacred Story follows a **Modular Feature-Based Layered Architecture**, dividing distinct user paths into highly isolated capsules inside `features/`.

```
                    ┌─────────────────────────┐
                    │       Entry App         │
                    │   (App.tsx / main.tsx)  │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Routing & Guards     │
                    │   (react-router-dom)    │
                    └────────────┬────────────┘
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       ▼                         ▼                         ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  Auth Pages  │          │ Main Content │          │  Admin Portal│
│ (features/)  │          │ (features/)  │          │ (features/)  │
└──────┬───────┘          └──────┬───────┘          └──────┬───────┘
       │                         │                         │
       └─────────────────────────┼─────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Central State Store   │
                    │   (sacredStore.tsx)     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Axios API Client     │
                    │   (apiClient.ts)        │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Express Backend     │
                    │      (server.ts)        │
                    └─────────────────────────┘
```

---

## 📂 Folder Structure

```text
src/
├── app/
│   ├── providers/
│   │   └── AppProviders.tsx       # Standardizes global context & themes
│   └── store/
│       └── sacredStore.tsx        # Base Context state engine
├── assets/
│   └── images/                    # Local optimized portrait JPGs
├── features/
│   ├── about/                     # About & Ecclesiastical editorial standards
│   ├── admin/                     # Administrative Control Center
│   │   ├── dashboard/             # Platform stats, review trackers
│   │   ├── pending-reviews/       # Editorial audit controls
│   │   ├── sacred-stories/        # Story editor & REST adapters
│   │   ├── services/              # Portal auth forwarding
│   │   ├── settings/              # API and standards administration
│   │   ├── shared/                # Layout, sidebars, helper types
│   │   └── users/                 # User directory and activation tables
│   ├── auth/                      # Login, Register, Resend Verification features
│   ├── chat/                      # Interactive Floating AI Chatbot
│   ├── churches/                  # Religious locations and landmarks
│   ├── create-story/              # Public-facing user contribution page
│   ├── home/                      # Landing hero & featured highlights
│   ├── navigation/                # Multi-tab view director
│   ├── sacred_stories/            # Devotional widgets
│   ├── saint-details/             # Biographical components, galleries, timelines
│   ├── saints/                    # Grid browsers and search controls
│   └── timeline/                  # Church chronicle visualizations
├── shared/
│   ├── api/
│   │   ├── apiClient.ts           # Intercepted Axios client (auto-refreshing token)
│   │   ├── config.ts              # API root resolution
│   │   └── endpoints.ts           # Unified API endpoint registry
│   ├── auth/
│   │   ├── adminGuard.tsx         # Admin role validation route wrapper
│   │   ├── authGuard.tsx          # Public vs Authenticated route constraints
│   │   └── authStorage.ts         # LocalStorage read/write controller
│   ├── components/                # Global Navbars, footers, players, modal panels
│   ├── constants/                 # Mock catalogs, audio lists, translation maps
│   ├── services/                  # Archives client adapters, responsive window hooks
│   ├── store/
│   │   └── sacredStore.tsx        # Proxy exporting app context
│   └── types/                     # Shared entity data shapes
├── App.tsx                        # Main application layout & Routing config
├── index.css                      # Global Tailwind directives
└── main.tsx                       # Entry React mounting node
```

---

## 🔐 Authentication & Session Management

Authentication uses **Bearer Token Validation** backed by LocalStorage persistence:

1. **Session Lifecycle**: Handled completely in `src/shared/auth/authStorage.ts`.
2. **Persistence Keys**:
   - `sacred_stories_access_token`
   - `sacred_stories_refresh_token`
   - `sacred_stories_user` (JSON serialization containing user metadata and assigned roles).
3. **Interceptor Pattern**: 
   - Requests via `apiClient.ts` dynamically attach `Authorization: Bearer <token>` to outbound headers.
   - On `401 Unauthorized` response, the interceptor pauses execution queue, initiates a background post to `/api/Auth/refresh-token`, saves the new access token, and securely replays the original requests.
   - If no valid refresh token remains, it clears the local session, dispatches a logout event, and redirects to `/login`.

---

## 🛡️ Authorization & Role Protection

Users are mapped into specialized roles: `Admin`, `Archivist`, `Chief Editor`, `Theologian`, or `Contributor`. Route access is tightly validated:

- **PublicRoute**: Accessible strictly to unauthenticated users. Redirects active sessions away from `/login` and `/register`.
- **AuthenticatedRoute**: Restricts pages (like `/create-story`) to active authorized users.
- **AdminRoute**: Accessible only to users holding roles belonging to: `['Admin', 'Archivist', 'Chief Editor']`. All other attempts are redirected.

---

## 🚦 Routing System

The routing landscape is integrated into `src/App.tsx`:

| Endpoint | Route Guard | Page / View Target | Purpose |
| :--- | :--- | :--- | :--- |
| `/*` | *Unrestricted* | `SanctuaryApp` | General hagiographical tab system |
| `/login` | `PublicRoute` | `LoginPage` | User session initialization |
| `/register` | `PublicRoute` | `RegisterPage` | Guest account creation |
| `/resend-verification` | *Unrestricted* | `ResendVerificationPage` | Activations mail trigger |
| `/create-story` | `AuthenticatedRoute`| `CreateStoryPage` | Public-facing creation panel |
| `/admin/*` | `AdminRoute` | `AdminIndexPage` | Ecclesiastical control center |

---

## 🔌 API Integration & Services

All endpoints are mapped directly inside `src/shared/api/endpoints.ts`. Below are the documented API calls:

### 🎫 Authentication Enclave (`/api/Auth/*`)
- **POST `/api/Auth/login`**
  - **Body**: `{ email, password }`
  - **Returns**: Access tokens, refresh tokens, and user role configuration.
- **POST `/api/Auth/register`**
  - **Body**: `{ name, email, password }`
  - **Returns**: Pending review record.
- **POST `/api/Auth/refresh-token`**
  - **Body**: `{ expiredAccessToken, refreshToken }`
- **GET `/api/Auth/users`** (Authorized Admin)
  - **Params**: `searchTerm`, `pageNumber`, `pageSize`

### 📜 Sacred Chronicles Enclave (`/api/SacredStories/*`)
- **GET `/api/SacredStories`**
  - **Params**: `SearchTerm`, `Type`, `Status`, `PageNumber`, `PageSize`
- **GET `/api/SacredStories/:id`**
  - **Returns**: Full biographical timelines, galleries, and burial structures.
- **POST `/api/SacredStories`**
  - **Body**: Custom saint, locations, and chronological events.
- **DELETE `/api/SacredStories/:id`**

### 🧠 Archival AI Enclave (`/api/*`)
- **POST `/api/search-archives`**: Smart semantic query matching.
- **POST `/api/archivist-chat`**: Conversational context mapping with prompt records.
- **POST `/api/generate-reflection`**: Returns contextual hagiographical counseling reflections.

---

## 🔄 Dual State Management

The frontend utilizes standard React Context wrapped into `SacredStoreProvider`:
- State holds tab routing selections, selected detail IDs, layout theme (`light` vs `dark`), localized language toggles (`en` vs `ar`), and active audio tracks.
- Synchronization is automatically maintained via global event listeners (`storage`, `admin-login`, `admin-logout`). This keeps state instantly updated across active browser tabs if the user authenticates, expires, or changes localized settings.

---

## 📊 Admin Dashboard

The curator's cockpit contains multiple operational workspaces:
1. **Analytics Dashboard**: Reviews general system status, total submission counts, pending story cues, and metrics charts.
2. **Chronicle Archives**: Database overview offering content modification, status toggling, and complete record deletion.
3. **Pending Review Board**: Enables administrators to review user-contributed records, verify authenticity, and approve/reject with feedback notes.
4. **User Roster Directory**: Complete search, filter, and page-by-page table of users.
5. **Portal Settings**: Portal configuration settings, localization options, and standards review sheets.

---

## 🔀 Hybrid Fallback & Local Storage Layer

The admin backend APIs utilize a sophisticated resilience pattern defined in `src/features/admin/shared/api/base.ts`.

- **`executeApiCall` Wrapper**:
  - Automatically queries the real REST endpoints.
  - If a network error, 500 server error, or connection issue occurs, and `autoFallbackToMock` is enabled, the client falls back to **LocalStorage database state** (`sacred_stories_data`) with simulated latency.
  - This ensures developers can fully interact with the admin suite, creating, editing, and deleting records, even if a live backend is offline.

---

## ⚙️ Environment Configuration

Environment files use `.env.example` as a template structure:

```env
# Server Ingress Port (Default: 3000)
PORT=3000

# Base URL override for client-side API routing
VITE_API_BASE_URL=

# Server-Side Google Gemini Integration Secrets (Never exposed to the client)
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

---

## 🚀 Local Setup & Installation

### 1. Provisioning Node Modules
Installs all client and server dependencies:
```bash
npm install
```

### 2. Launching in Development
Bootstraps the Express Node server and compiles Vite assets simultaneously on **Port 3000**:
```bash
npm run dev
```

---

## 🏗️ Production Compilation

Building for production runs a multi-layered compilation:
```bash
npm run build
```

This executes two build phases:
1. **Frontend Asset Bundle**: Vite packs all React assets, TypeScript layers, and Tailwind stylesheets into optimized, static files in `/dist`.
2. **Backend Server Compiling**: Uses `esbuild` to bundle `server.ts` into a self-contained CommonJS target file (`dist/server.cjs`), keeping the server lightweight, fast-loading, and decoupled from Node ES Module resolution constraints.

To execute the compiled production deployment:
```bash
npm start
```

---

## 🔍 Technical Debt & Architectural Insights

### Dual Store Re-export Proxy
- **Situation**: Both `/src/shared/store/sacredStore.tsx` and `/src/app/store/sacredStore.tsx` exist.
- **Resolution**: This is resolved via an intentional re-export where the shared folder store proxies the core app store: `export * from "../../app/store/sacredStore"`. This maintains clean path resolution while eliminating duplication.

### Lowercase Endpoint Normalization
- **Situation**: Backend routers accept both camelCase and kebab-case endpoints to prevent structural mismatch issues in case of divergent feature branches.
- **Example**: Both `/api/SacredStories` and `/api/sacredstories` are registered in the routing table.

### Lazy Server-Side AI Core
- **Situation**: To prevent application crashes on startup if a `GEMINI_API_KEY` is missing from the environment, the Express server uses lazy-initialization (`getGeminiClient`).
- **Behavior**: If the key is absent, the chatbot and reflection endpoints automatically respond with polite informational fallbacks, rather than raising uncaught module exceptions.
