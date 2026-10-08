# Smart File Backup System — 4-Team Comprehensive Platform

> **ApniLeap Enterprise Backup Platform (RIT-CSE 2026)**  
> **Integrated Engineering Modules:**  
> - **Team A**: OS Horizontal Server Load Balancer & Scheduler (3 Algorithms: RR, LL, Dynamic Weighted)  
> - **Team B**: File System Optimization & Deduplication Engine (Content-Defined SHA-256 + Merkle Tree)  
> - **Team C**: DBMS Metadata & Storage Pointer Catalog (**MongoDB Compass** `smart_file_backup`)  
> - **Team D**: UI & Backend-For-Frontend (BFF) Orchestration Layer (React 18 SPA + Socket.IO)  
> **Status:** ✅ 100% Operational & Evaluator-Ready

---

## 🌟 Key Highlights & Evaluator Alignment

- **MongoDB Compass Integration (`mongodb://localhost:27017/smart_file_backup`)**:
  - **Zero Raw File Blobs in DB**: MongoDB stores **authoritative file metadata, SHA-256 chunk hashes, and storage pointers only**, adhering to high-performance enterprise Content-Addressed Storage (CAS) design.
  - Collections visible in Compass: `files`, `file_chunks`, `file_versions`, `worker_nodes`, `backup_jobs`, `audit_ledger`.
- **Team A: Horizontal OS Server Scheduling (3 Algorithms)**:
  - Models 3 horizontal server compute nodes: `Worker-Alpha`, `Worker-Beta`, and `Worker-Gamma`.
  - **Algorithm 1 — Round-Robin (RR)**: Sequential cyclic allocation.
  - **Algorithm 2 — Least Loaded (LL)**: Queue depth minimization (`min(active_jobs)`).
  - **Algorithm 3 — Dynamic Weighted Capacity (DWC) [RECOMMENDED / BEST]**: Capacity score = `(100 - CPU%) * Weight / (ActiveTasks + 1)`. Dynamically allocates chunk work to workers with the highest live compute capacity.
  - Live algorithm inspection and switching via `GET /api/v1/ui/backups/algorithms` and `POST /api/v1/ui/backups/algorithm`.
- **Team B: File System Optimization & Deduplication (DSA Engine)**:
  - Cryptographic chunking with SHA-256 (FIPS 180-4) and Merkle Tree root generation.
  - In-place deduplication: duplicate blocks reuse pointers with `reference_count++`, adding **0 physical bytes** to disk.
  - Actionable feedback messages: `[DEDUPLICATION HIT] 100% of chunks already exist. Storage saved: 100%`, `[DELTA DEDUPLICATION]`, etc.
- **Team D: React 18 SPA Frontend (Kept As-Is)**:
  - 15 Predefined Enterprise Accounts across **Employee**, **IT Admin**, and **Auditor** personas.
  - Real-time 3-second Socket.IO operational stream with latency `<200ms`.
  - Merkle Tree tamper simulation and genuine PDF/binary file download support.

---

## 📂 Architecture & Folder Structure

```
smart_file_mp/
├── backend/                      # Express BFF & Aggregation Layer (Port 4000)
│   ├── server.js                 # HTTP, Socket.IO & MongoDB bootstrap
│   ├── db/
│   │   └── connection.js         # MongoDB Compass connection (localhost:27017)
│   ├── models/                   # Mongoose Schemas (Metadata & Pointers ONLY)
│   │   ├── File.js               # 'files' collection
│   │   ├── FileChunk.js          # 'file_chunks' deduplication pointer table
│   │   ├── FileVersion.js        # 'file_versions' snapshot manifests
│   │   ├── WorkerNode.js         # 'worker_nodes' horizontal OS servers
│   │   ├── BackupJob.js          # 'backup_jobs' algorithm telemetry
│   │   └── AuditLedger.js        # 'audit_ledger' compliance log
│   ├── routes/                   # OpenAPI REST Endpoints (D1 - D4)
│   │   ├── session.js            # D1: Authentication & 15-User session
│   │   ├── files.js              # D2: Browse, Upload, Download & D4: Policy edit
│   │   ├── backups.js            # D2: Backup scheduling & OS Algorithm Switcher
│   │   ├── restores.js           # D2: Point-In-Time Version restore
│   │   ├── dashboard.js          # D3: Live Aggregated telemetry
│   │   ├── integrity.js          # D3: Merkle Tree cryptographic verification
│   │   └── reports.js            # D4: Storage tiering & Audit Ledger reports
│   ├── services/
│   │   ├── aggregationService.js # Core orchestration across all teams
│   │   ├── schedulerService.js   # Team A: 3 OS Horizontal Load Balancers
│   │   ├── dedupService.js       # Team B: DSA Chunk Dedup & Merkle Trees
│   │   └── seeder.js             # Initial MongoDB Compass population
│   └── data/
│       └── uploads/              # Local physical chunk repository
├── demo_files/                   # Pre-packaged test files for Evaluator (Sir)
│   ├── demo_file_unique_v1.txt   # TEST 1: Fresh unique upload
│   ├── demo_file_duplicate.txt   # TEST 2: Exact duplicate (100% Dedup Hit)
│   └── demo_file_delta_v2.txt    # TEST 3: Delta revision (75% savings)
├── frontend/                     # React 18 SPA (Vite + Tailwind CSS) (Port 5173)
├── contracts/                    # Shared OpenAPI envelope schemas & types
├── DEMO_EVALUATION_GUIDE.md      # Step-by-step presentation script for the professor
└── README.md
```

---

## 🚀 Quick Start Instructions

### 1. Ensure MongoDB is Running
Make sure MongoDB is running on your machine (e.g., standard MongoDB Compass default port `27017`).
- Connect in Compass at: `mongodb://localhost:27017`
- The database is `smart_file_backup`.

### 2. Start the Backend BFF Server
```bash
cd backend
npm install
npm start
# BFF Server runs on http://localhost:4000
```

### 3. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
# Vite Web App runs on http://localhost:5173
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🧪 Evaluator Testing Instructions

For complete step-by-step instructions to demonstrate to your professor/evaluator, refer to:  
📄 **[DEMO_EVALUATION_GUIDE.md](file:///Users/apple/Desktop/smart_file_mp/DEMO_EVALUATION_GUIDE.md)**