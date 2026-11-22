# 🚀 ApniLeap Smart File Backup Platform
### Enterprise Distributed Storage, Real-Time OS Scheduling, Cryptographic Deduplication & Integrity Verification

[![Docker Image](https://img.shields.io/badge/Docker_Hub-viraj9199m%2Fapnileap__platform-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/viraj9199m/apnileap_platform)
[![Docker Image Size](https://img.shields.io/badge/Image_Size-71.7_MB-success?style=for-the-badge&logo=docker)](https://hub.docker.com/r/viraj9199m/apnileap_platform)
[![React 18](https://img.shields.io/badge/Frontend-React_18_SPA-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_20_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Compass-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/products/compass)
[![Institution](https://img.shields.io/badge/RIT--CSE-Academic_Year_2026--27-blue?style=for-the-badge)](https://www.ritindia.edu/)

> **Academic Project:** MiniLeap Final Year Engineering Project (RIT-CSE 2026–2027)  
> **Affiliation:** Department of Computer Science and Engineering, Rajarambapu Institute of Technology, Rajaramnagar (Shivaji University)  
> **Live Docker Image:** [hub.docker.com/r/viraj9199m/apnileap_platform](https://hub.docker.com/r/viraj9199m/apnileap_platform)  
> **Status:** ✅ 100% Operational, Evaluator-Ready & Multi-Stage Docker Containerized  

---

## 🐳 Instant Docker Quickstart (Run in 10 Seconds!)

The entire 4-team enterprise platform is pre-built, optimized, and published to Docker Hub as a lightweight **71.7 MB** multi-stage image. You can pull and run it anywhere in the world with a single command!

### Option 1: Run Pre-Built Image from Docker Hub (Recommended)
```bash
docker run -d \
  --name apnileap_app \
  -p 5173:5173 \
  -p 4000:4000 \
  -v apnileap_storage:/app/backend/data/uploads \
  viraj9199m/apnileap_platform:latest
```

### Option 2: Full-Stack with Dedicated MongoDB via Docker Compose
```bash
git clone https://github.com/vk9199kadam-hue/file_system.git
cd file_system
docker compose up -d --build
```

### 🌐 Access Points:
| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web Application** | [http://localhost:5173](http://localhost:5173) | React 18 SPA (Employee, IT Admin & Auditor Portals) |
| **Backend API & WebSockets** | [http://localhost:4000](http://localhost:4000) | Express BFF & Real-Time Socket.IO Telemetry Stream |
| **Health Check Endpoint** | [http://localhost:4000/api/v1/ui/me](http://localhost:4000/api/v1/ui/me) | Distributed Tracing & Session Check |
| **MongoDB Compass** | `mongodb://localhost:27017` | Authoritative CAS Metadata Catalog (`smart_file_backup`) |

---

## 🧭 Multi-Team System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   TEAM D: PRESENTATION & BFF ORCHESTRATION LAYER                       │
│  • React 18 SPA (Port 5173 / Vite + Tailwind CSS)                                      │
│  • Express.js BFF (Port 4000) with X-Correlation-ID Distributed Tracing                │
│  • 15 Role-Based Enterprise User Profiles (Employee, IT Admin, Auditor)                │
│  • Socket.IO Live Telemetry Stream (3-second interval, <200ms latency)                 │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                      ┌─────────────────────┴─────────────────────┐
                      ▼                                           ▼
┌─────────────────────────────────────────────┐ ┌────────────────────────────────────────┐
│     TEAM B: FILE SYSTEM DEDUP & DSA         │ │   TEAM A: OS HORIZONTAL SERVER FLEET   │
│ • Content Slicing & Chunk Partitioning      │ │ • 3 Compute Nodes: Alpha, Beta, Gamma  │
│ • SHA-256 (FIPS 180-4) Fingerprinting       │ │ • 3 Scheduling Algorithms:             │
│ • Binary Merkle Tree Root Generation        │ │   1. Round-Robin (RR)                  │
│ • Hash Map Pointer In-Place Deduplication   │ │   2. Least Loaded / Queue Depth (LL)   │
│ • 70% to 100% Storage Space Reduction       │ │   3. Dynamic Weighted Capacity (DWC)   │
└─────────────────────┬───────────────────────┘ └───────────────────┬────────────────────┘
                      │                                             │
                      └─────────────────────┬───────────────────────┘
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   TEAM C: DATABASE SYSTEMS (MONGODB COMPASS)                           │
│ • Database: 'smart_file_backup' on mongodb://127.0.0.1:27017                           │
│ • Content-Addressed Storage (CAS) Pointer Pattern: ZERO raw binary file blobs in DB    │
│ • 6 Collections: files, file_chunks, file_versions, worker_nodes, backup_jobs, audit   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 The 4 Core Engineering Engines

| Team / Engine | Discipline Track | Key Responsibility | Core Algorithms & Technologies |
| :--- | :--- | :--- | :--- |
| **Team A** | **Operating Systems (OS)** | Horizontal Worker Load Balancer & CPU Scheduler | **3 Algorithms:** Round-Robin (RR), Least Loaded (LL), and Dynamic Weighted Capacity (DWC) with real-time scoring: $\frac{(100 - \text{CPU}\%) \times \text{Weight}}{\text{ActiveTasks} + 1}$. |
| **Team B** | **Data Structures & Algorithms (DSA)** | Content-Defined Chunking & Deduplication | **SHA-256 (FIPS 180-4)** cryptographic hashing, $O(1)$ Hash Table lookups, duplicate reference counting (`reference_count++`), and **Binary Merkle Tree Root** tamper detection. |
| **Team C** | **Database Systems (DBMS)** | CAS Metadata Catalog & Pointer Indexing | **MongoDB Compass (`smart_file_backup`)**. Strict Content-Addressed Storage design: zero file blobs in database. 6 collections with indexed pointer relations. |
| **Team D** | **Web Technologies & BFF** | Master Orchestration & Real-Time Control UI | **React 18 SPA + Express.js BFF**. 15 predefined enterprise user roles, live Socket.IO push streaming every 3s, unified response envelopes, and point-in-time version restores. |

---

## 🧪 Live Demonstration & Evaluation Test Scenarios

The platform includes pre-packaged test files in [`demo_files/`](./demo_files/) specifically prepared for academic evaluation:

### 🌟 Test 1: Fresh Unique Ingestion
1. Log in as an **Employee** (`emp_rahul`).
2. Upload [`demo_files/demo_file_unique_v1.txt`](./demo_files/demo_file_unique_v1.txt).
3. **Result:** `[NEW DATA COMMITTED] All chunks unique. Pointers registered in MongoDB. Merkle root verified.`
4. **MongoDB Verification:** Open collection `files` and `file_chunks`. Notice storage pointers point to localized chunks with `reference_count: 1`.

### 🌟 Test 2: Exact Duplicate Ingestion (100% Storage Savings)
1. In the file manager, upload [`demo_files/demo_file_duplicate.txt`](./demo_files/demo_file_duplicate.txt) (identical text to v1).
2. **Result:** `[DEDUPLICATION HIT] 100% of chunks already exist in storage. 0 additional bytes written to disk. Pointer references incremented. Storage saved: 100%.`
3. **MongoDB Verification:** In collection `file_chunks`, chunk `reference_count` increments from `1` to `2`. **Zero physical bytes** added to disk!

### 🌟 Test 3: Delta Versioning & Partial Deduplication
1. Upload [`demo_files/demo_file_delta_v2.txt`](./demo_files/demo_file_delta_v2.txt) (only 1 section changed).
2. **Result:** `[DELTA DEDUPLICATION] 3 of 4 chunks matched existing storage blocks (75% savings). Only 1 new unique chunk committed to physical disk.`
3. **MongoDB Verification:** Collection `file_versions` creates snapshot `v2` referencing 3 shared chunk hashes and 1 new chunk hash.

### 🌟 Test 4: Live OS Scheduling Algorithm Switch
Switch Team A's scheduling algorithm on the fly via cURL or the UI:
```bash
# Check active algorithm:
curl http://localhost:4000/api/v1/ui/backups/algorithms

# Switch to Dynamic Weighted Capacity (Recommended / Best):
curl -X POST http://localhost:4000/api/v1/ui/backups/algorithm \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"DYNAMIC_WEIGHTED"}'
```

---

## 📂 Project Repository Structure

```text
smart_file_mp/
├── dockerfile                     # Multi-stage production Docker build (Node 20 Alpine)
├── docker-compose.yml             # Orchestration for MongoDB 7.0 + ApniLeap App
├── entrypoint.sh                  # In-container process supervisor & graceful signal trap
├── .dockerignore                  # Docker build context filter
├── backend/                       # Express BFF & Aggregation Layer (Port 4000)
│   ├── server.js                  # HTTP, Socket.IO & MongoDB bootstrap
│   ├── db/connection.js           # MongoDB connection (mongodb://localhost:27017)
│   ├── models/                    # Mongoose CAS Metadata Schemas (File, Chunk, Version, Worker, Job, Audit)
│   ├── routes/                    # REST Endpoints (session, files, backups, restores, dashboard, reports, integrity)
│   ├── services/
│   │   ├── schedulerService.js    # Team A: 3 OS Horizontal Load Balancers (RR, LL, DWC)
│   │   ├── dedupService.js        # Team B: SHA-256 Deduplication & Merkle Tree
│   │   ├── aggregationService.js  # Team D: Master Orchestration Layer
│   │   └── seeder.js              # Initial MongoDB Compass population
│   └── data/uploads/chunks/       # Physical Content-Addressed Chunk Repository
├── frontend/                      # React 18 SPA (Vite + Tailwind CSS on Port 5173)
│   └── src/
│       ├── App.jsx                # Protected routes & role-based navigation
│       ├── AuthContext.jsx        # 15 enterprise accounts state provider
│       ├── pages/                 # Dashboard, Files, Integrity, Reports, Admin, Login
│       └── components/            # StateMachineStepper, FileUploadModal, FreshnessBanner, etc.
├── contracts/                     # Shared OpenAPI 3.0 envelopes & state machine specifications
├── demo_files/                    # Pre-packaged evaluation test files
├── DEMO_EVALUATION_GUIDE.md       # Step-by-step evaluator presentation script
├── TEAM_BY_TEAM_DEFENSE_REPORT.md # Viva defense Q&A and rubric mapping
├── REPORT_VOL_1_ENGINE_DEVELOPMENT_CH5.md # Volume 1: Chapter 5 Engine Dossier (S2–S7)
├── REPORT_VOL_2_SYSTEM_PROJECT_REPORT.md  # Volume 2: Master System Project Report (Chapters 1–10)
└── README.md
```

---

## 💻 Manual Local Development (Without Docker)

### 1. Ensure MongoDB is Running
Start MongoDB locally on default port `27017`:
* Connection URI: `mongodb://localhost:27017`
* Database: `smart_file_backup`

### 2. Start the Backend Server (Terminal 1)
```bash
cd backend
npm install
npm start
# Server listens on http://localhost:4000
```

### 3. Start the Frontend Application (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# Vite runs on http://localhost:5173
```

---

## 📚 Academic Documentation & Reports (RIT CSE / MiniLeap)

* 📄 **[Live Demonstration & Presentation Script](./DEMO_EVALUATION_GUIDE.md)**: Walkthrough steps for external evaluators and professors.
* 📋 **[Team-by-Team Viva Defense Guide](./TEAM_BY_TEAM_DEFENSE_REPORT.md)**: Comprehensive oral examination questions, technical defenses, and code mapping.
* 📘 **[Volume 1: Engine Development Dossier (Chapter 5)](./REPORT_VOL_1_ENGINE_DEVELOPMENT_CH5.md)**: Detailed S2–S7 stage-gate specifications for Teams A, B, C, and D.
* 📕 **[Volume 2: Master Project Engineering Report](./REPORT_VOL_2_SYSTEM_PROJECT_REPORT.md)**: Complete academic report formatted to RIT Autonomous standards.

---

## 👥 Project Team & Contributors

* **Department:** Computer Science and Engineering, Rajarambapu Institute of Technology (RIT), Rajaramnagar
* **Project Guide:** Prof. G. S. Wedpathak (MiniLeap Project Coordinator)
* **Head of Department:** Dr. S. S. Patil
* **GitHub Repository:** [vk9199kadam-hue/file_system](https://github.com/vk9199kadam-hue/file_system)
* **Official Docker Hub Image:** [viraj9199m/apnileap_platform](https://hub.docker.com/r/viraj9199m/apnileap_platform)
