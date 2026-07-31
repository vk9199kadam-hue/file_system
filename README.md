# Team D — Backup Control & Restore Dashboard

Starter scaffold: React (Vite + Tailwind) frontend + Express BFF backend,
matching the endpoints in Section 4.4 (D1–D4) of the APNILEAP design doc.

Currently the backend returns **mock data** so you can build and demo the
whole UI before Team A/B/C's real APIs are ready. Each mock route has a
`// TODO: replace with real call to Team C...` comment marking where to
swap in the real API call later.

## Folder structure

```
team-d-project/
├── backend/              # Express BFF (Team D's own API layer)
│   ├── server.js
│   └── routes/
│       ├── session.js    # login/logout/me
│       ├── files.js      # browse files, edit retention
│       ├── backups.js    # start backup, check status
│       └── dashboard.js  # storage/queue/alerts summary
└── frontend/             # React app
    └── src/
        ├── App.jsx        # routes + role-based route guards
        ├── AuthContext.jsx
        ├── components/Sidebar.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx   # live updates via Socket.IO + chart
            ├── Files.jsx       # browse + trigger backup
            ├── Reports.jsx     # Auditor/Admin only
            └── Admin.jsx       # IT Admin only
```

## Run it

**Backend** (in one terminal):
```bash
cd backend
npm install
npm run dev
# runs on http://localhost:4000
```

**Frontend** (in another terminal):
```bash
cd frontend
npm install
npm run dev
# runs on http://localhost:5173
```

Open http://localhost:5173 — log in with any username and pick a role
(Employee / IT Admin / Auditor) to see role-based navigation change.

## What's already working
- Login with 3 roles, role-based sidebar + route guards
- File list page with a "Backup" button that calls the mock backup API
- Live dashboard: Socket.IO pushes a fake update every 4s, with a
  connected/disconnected indicator (matches the "never show stale data
  silently" requirement from the doc)
- Admin page to edit file retention (IT Admin only)
- Reports page placeholder (Auditor/Admin only)

## Next steps
1. Swap each `// TODO` in `backend/routes/*.js` for a real `fetch`/`axios`
   call to Team C's actual API once it's ready.
2. Replace the Socket.IO demo interval in `server.js` with real events
   forwarded from Team C's SSE/WebSocket stream.
3. Add loading/error states everywhere (the doc's KPI: "100% backend
   error classes map to a clear message, retry or corrective action").
4. Accessibility pass: keyboard navigation, focus states, ARIA labels.
