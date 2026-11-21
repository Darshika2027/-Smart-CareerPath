# Smart CareerPath — Security & Access UI

Complete responsive React + Vite frontend reproducing the supplied Security & Access dashboard visual style. Includes the user-provided blue-lit student photograph.

## Run on Windows using VS Code + PowerShell

```powershell
# Open PowerShell in this extracted folder
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`).

## Build

```powershell
npm run build
npm run preview
```

## Included files

- `src/App.jsx` — complete dashboard interface, demo cards, interactions, navigation and dialog content
- `src/styles.css` — all styling, responsive layout and animation
- `src/main.jsx` — React entry point
- `src/assets/security-student.jpg` — user-provided original photograph for the profile preview
- `src/assets/security-hero.jpg` — hero-banner crop from the supplied design image
- `index.html` and `package.json` — Vite application setup

## Important security note

**This is a frontend-only visual prototype**, not an implementation of Supabase Auth, RLS, session management, or security verification. All green statuses, user counts, record counts and test metrics are *mock/example data*. They must not be treated as true security claims or be deployed as live security monitoring.

For Jira SCP-25, additionally implement and verify:

1. Supabase Authentication and real login/logout/session handling.
2. Server/database enforced RLS for students' profiles, skills, goals (and progress where applicable).
3. Protected routes, with backend/database access restrictions beyond React UI navigation.
4. Trusted role assignment; public registration must never create Admin users.
5. Secret protection: NEVER place a Supabase service role key or privileged secrets in a Vite `VITE_*` variable.
6. NT-01, NT-02, NT-04 and NT-05 with recorded evidence, including cross-account tests.

The UI screenshot includes management buttons, but those are demonstration-only information dialogs. A normal student must NOT receive direct access to actual security policy management or privileged test logs.

## Suggested Git workflow

Create a dedicated branch (for example `feature/scp-25-security-ui`) and commit only your source files, not `node_modules`, `.env`, or any secrets. Ask teammates to review before merging.
