# MASTER PROMPT & TECHNICAL REPORT FOR S2 GATE-2 EVALUATION
## Module: Team D — Backup Control & Restore Dashboard Engine
### Project: Smart File Backup System (APNILEAP / RIT-CSE 2026)

---

## 📌 INSTRUCTIONS FOR CLAUDE AI / PRESENTATION EDITOR
> **Role for Claude AI:** You are an expert Enterprise Systems Architect and Presentation Designer. 
> **Task:** Using this report and the provided PowerPoint presentation template (`S2 Evaluation - System Architecture Design`), edit each slide to fill in complete, highly technical, and visually balanced content for **Team D**. 
> **Rubric Target:** 10/10 Marks (Gate-2 External Evaluator Rubric: 5 criteria × 2 marks each).
> **Formatting Rules:**
> 1. Follow the exact 2-column layout defined on each slide (Left: Structured technical bullet points; Right: Diagrams, data flow sequences, or mapping tables).
> 2. Do not use generic placeholders. Use the exact technical terms, API endpoints, schema names, and metrics provided below.
> 3. Ensure clear visual hierarchy (Bold keywords, clear status pills, distinct code symbols).

---

## SLIDE 1: Title Slide (Cover Page)

* **Slide Category:** Title & Identification
* **Slide Header:** STAGE S2 EVALUATION
* **Main Title:** System Architecture Design
* **Subtitle:** Engine-Based Presentation Template • 10 Marks • Gate 2
* **Fields to Fill:**
  * **Engine / Module Name:** Team D — Backup Control & Restore Dashboard Engine (UI & BFF Orchestration)
  * **Team Members & Roll No.:** *[Insert Student Name & Roll Number(s)]*
  * **Batch:** *[Insert Batch, e.g., Batch B1 / CSE]*
  * **Review Date:** *[Insert Review Date, e.g., September 2026]*
  * **System Reference:** Smart File Backup System (Section 4.4 APNILEAP Specification)

---

## SLIDE 2: How to Use This Template (Rubric Mapping)

* **Slide Category:** Evaluator Alignment
* **Slide Header:** S2 External Evaluator Rubric Mapping
* **Content / Marks Breakdown:**
  1. **Criterion 1 (2 Marks) — Common High-Level Architecture (Team-Shared):** 
     Overall multi-tier architecture, system layers (Presentation, BFF, Core Engines, Shared Services), component boundaries, and traceability to S1 requirements.
  2. **Criterion 2 (2 Marks) — Engine Interaction & Interface Contracts (Team-Shared):** 
     Cross-engine communications (Teams A, B, C, D), OpenAPI 3.0 schemas, sync/async protocols (REST, WebSockets), and idempotency.
  3. **Criterion 3 (2 Marks) — Engine-Level Architecture & Data Flow (Team D Individual):** 
     Internal modular breakdown of Team D (React 18 SPA + Express BFF), state machine execution, and internal data structures.
  4. **Criterion 4 (2 Marks) — Requirement & KPI Traceability (Team D Individual):** 
     Direct traceability matrix for D1–D4, `<200ms` aggregation latency, `<1s` real-time sync, and 100% actionable error mapping.
  5. **Criterion 5 (2 Marks) — Decisions, Risks & Gate-2 Readiness (Team D Individual):** 
     4 Architectural Decision Records (ADRs), risk register with mitigations, and Gate-2 proof checklist.

---

## SLIDE 3: 1. Common High-Level Architecture (Team-Shared — 2 Marks)

* **Slide Tag:** `TEAM-SHARED /2`
* **Title:** 1. Common High-Level Architecture
* **Evaluator Expectations:** Overall system layers, component boundaries, shared services, communication paths, S1 traceability.

### Left Column Content (Technical Bullet Points):
* **Multi-Tiered Layered Architecture:**
  * **Presentation Layer (Team D Frontend):** React 18 SPA (Vite + Tailwind CSS), role-tailored workspaces for Employee, IT Admin, and Auditor.
  * **API Gateway & Orchestration Layer (Team D BFF):** Express.js Backend-For-Frontend providing aggregation, rate limiting, request validation, and WebSocket event multiplexing.
  * **Core Engine Microservices:**
    * **Team A (OS Scheduler Engine):** Worker pool leasing, CPU load balancing, and priority job queuing.
    * **Team B (Chunk Dedup & Storage Engine):** Content-Defined Chunking (CDC), SHA-256 Merkle tree verification, and tiered storage routing (Hot/Standard/Cold).
    * **Team C (DBMS Metadata Engine):** Authoritative file catalogue, revision trees, retention rules, and audit logging.
  * **Shared Infrastructure Services:** Centralized JWT Authentication, Distributed Tracing (`X-Correlation-ID`), Redis Cache / Message Broker, and Persistent S3/MinIO Object Storage.
* **Component Boundaries & Isolation:** Strict decoupling through OpenAPI 3.0 REST contracts; frontend never directly accesses storage primitives or worker daemon threads.
* **Traceability to S1:** Fulfills all functional mandates for secure file tracking, storage reduction via deduplication, and zero-stale-data telemetry.

### Right Column Content (System Architecture Diagram):
```text
┌────────────────────────────────────────────────────────────────────────┐
│             PRESENTATION LAYER (Team D - React 18 SPA)                 │
│   [ Employee Portal ]    [ IT Admin Console ]    [ Auditor View ]      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / WSS
┌───────────────────────────────────▼────────────────────────────────────┐
│      ORCHESTRATION & BFF LAYER (Team D - Express.js Node Service)      │
│  - RBAC Middleware      - Aggregation Engine    - Idempotency Guard    │
│  - Response Envelope    - WebSocket Streamer    - Error Translation    │
└────────────┬──────────────────────┬──────────────────────┬─────────────┘
             │ REST                 │ REST                 │ REST
┌────────────▼──────────┐ ┌─────────▼──────────┐ ┌─────────▼───────────┐
│        TEAM A         │ │        TEAM B      │ │       TEAM C        │
│     OS SCHEDULER      │ │  CHUNK DEDUP &     │ │   DBMS METADATA     │
│        ENGINE         │ │  STORAGE ENGINE    │ │       ENGINE        │
│ - Worker Leases       │ │ - Merkle Tree Hash │ │ - File Version Tree │
│ - Priority Job Queue  │ │ - Chunk Deduplicat.│ │ - Retention Policies│
│ - Node Health Monitor │ │ - Storage Classes  │ │ - Audit Trail Logs  │
└───────────────────────┘ └────────────────────┘ └─────────────────────┘
```

---

## SLIDE 4: 2. Engine Interaction & Interface Contracts (Team-Shared — 2 Marks)

* **Slide Tag:** `TEAM-SHARED /2`
* **Title:** 2. Engine Interaction & Interface Contracts
* **Evaluator Expectations:** Inter-engine interaction, API contracts & payloads, sync vs async protocols, dependencies, schema consistency.

### Left Column Content (Technical Bullet Points):
* **Directional Engine Communication:**
  * **Team D → Team C (Sync HTTP):** Metadata retrieval (`GET /ui/files`), version retrieval (`GET /ui/files/:id/versions`), and retention policy updates (`PATCH /ui/files/:id`).
  * **Team D → Team A (Sync/Async REST):** Job submission and worker lease allocation (`POST /jobs/lease`, `GET /ui/dashboard`).
  * **Team D → Team B (Async Trigger):** Deduplication job creation (`POST /chunks/dedup`) and Merkle tree audit retrieval (`GET /ui/integrity`).
  * **Team A ↔ Team B (Internal):** Worker threads stream raw chunks to deduplication pipelines and storage targets.
* **Contract Schema Standardization (OpenAPI 3.0):**
  * **Response Envelope Standard:** Every endpoint returns `SuccessEnvelope` (`{ data, meta: { correlation_id, timestamp, api_version } }`) or `ErrorEnvelope` (`{ error: { code, message, details }, meta }`).
  * **Required Common Headers:** `Authorization: Bearer <jwt>`, `X-Correlation-ID: <uuid>`, `Idempotency-Key: <unique_key>`.
* **Synchronous vs. Asynchronous Strategy:**
  * **Synchronous REST:** Fast read/write queries (< 200 ms) for navigation and configuration.
  * **Asynchronous Execution (202 Accepted):** File backup/restore tasks return `202 Accepted` with a `job_id`; operational progression is streamed duplex over Socket.IO (`/ui/stream`).

### Right Column Content (Sequence Interaction Diagram):
```text
Client (User)        Team D (BFF)           Team A (Scheduler)    Team B (Dedup)     Team C (Metadata)
      │                   │                         │                   │                   │
      │── POST /backups ─>│                         │                   │                   │
      │   (Idempotency)   │─── Validate & Auth ────>│                   │                   │
      │                   │── 1. Allocate Lease ───>│                   │                   │
      │                   │<── Lease Granted (decId)│                   │                   │
      │                   │── 2. Request Dedup ────────────────────────>│                   │
      │                   │<── Dedup Stats & Merkle ────────────────────│                   │
      │                   │── 3. Record Version & State ───────────────────────────────────>│
      │<── 202 Accepted ──│                                                                 │
      │    (backup_id)    │                                                                 │
      │<══ WS Event ══════│ (Pushes QUEUED → CHUNKING → COMMITTED → VERIFIED → COMPLETED)
```

---

## SLIDE 5: 3. Engine-Level Architecture & Data Flow (Team D Individual — 2 Marks)

* **Slide Tag:** `YOUR ENGINE /2`
* **Title:** 3. Engine-Level Architecture & Data Flow
* **Evaluator Expectations:** Internal modules, responsibilities, data structures, step-by-step data flow, links to shared services.

### Left Column Content (Technical Bullet Points):
* **Internal Modular Decomposition:**
  * **`AuthContext & RBAC Guard` (Client):** Manages user session state and restricts routes based on role (`Employee`, `IT Admin`, `Auditor`).
  * **`Socket.IO Telemetry Service` (Client):** Consumes live push events and updates reactive dashboard widgets with zero re-rendering lag.
  * **`BFF Router & Route Handlers` (Server):** Modular Express routes (`session.js`, `files.js`, `backups.js`, `dashboard.js`, `integrity.js`).
  * **`Aggregation Service` (Server):** Orchestrates multi-engine data collation (Teams A, B, C) and shapes unified responses.
  * **`Idempotency Manager` (Server):** Intercepts duplicate operations using UUID caching to prevent double-scheduling.
  * **`Envelope & Error Middleware` (Server):** Normalizes uncaught exceptions into standard RFC-7807 compatible error envelopes.
* **Internal Data Structures & State Machine:**
  * **Lifecycle State Machine:** `REQUESTED` → `QUEUED` → `CHUNKING` → `DEDUPLICATING` → `COMMITTED` → `VERIFIED` → `COMPLETED` (Handles failure states: `REJECTED`, `RETRYING`, `CANCELLED`).
  * **In-Memory Store:** `activeBackupsStore` (Map) and `activeRestoresStore` (Map) maintaining operational tracking and worker lease references.
* **Step-by-Step Data Flow:**
  1. **Input:** User submits backup from UI with `Idempotency-Key` and priority setting.
  2. **Validation & Auth:** BFF validates JWT, verifies role permission `SCHEDULE_BACKUP`.
  3. **Multi-Engine Orchestration:** BFF requests worker lease from Team A, triggers chunk deduplication on Team B, and creates provisional version in Team C.
  4. **Output:** Client receives HTTP `202 Accepted`; WebSocket pushes real-time state changes (`QUEUED` to `VERIFIED`) to the UI.

### Right Column Content (Internal Engine Architecture Diagram):
```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TEAM D FRONTEND (React 18)                      │
│   ┌─────────────────────┐  ┌───────────────────┐  ┌────────────────┐   │
│   │ AuthContext (RBAC)  │  │ Dashboard Store   │  │ Socket Listener│   │
│   └──────────┬──────────┘  └─────────┬─────────┘  └────────▲───────┘   │
└──────────────┼───────────────────────┼─────────────────────┼───────────┘
               │ HTTP REST             │ HTTP REST           │ WebSocket
┌──────────────▼───────────────────────▼─────────────────────┴───────────┐
│                    TEAM D BACKEND-FOR-FRONTEND (BFF)                   │
│   ┌─────────────────────────┐     ┌────────────────────────────────┐   │
│   │  Express Route Router   │────>│   Aggregation Service Layer    │   │
│   └──────────┬──────────────┘     └────────────────┬───────────────┘   │
│              │                                     │                   │
│   ┌──────────▼──────────────┐     ┌────────────────▼───────────────┐   │
│   │ Idempotency & RBAC Gate │     │ Active Store (Map<id, Backup>) │   │
│   └─────────────────────────┘     └────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## SLIDE 6: 4. Requirement & KPI Traceability (Team D Individual — 2 Marks)

* **Slide Tag:** `YOUR ENGINE /2`
* **Title:** 4. Requirement & KPI Traceability
* **Evaluator Expectations:** S1 requirements assigned to engine, component mapping, KPI targets, architectural choices, gaps.

### Left Column Content (Technical Bullet Points):
* **Architectural Strategy for Hitting KPIs:**
  * **KPI: Dashboard Aggregation Latency < 200 ms:** BFF leverages asynchronous non-blocking I/O (`Promise.all`) to query Teams A, B, and C concurrently rather than in series.
  * **KPI: Real-Time Stream Latency < 1 sec:** Full-duplex WebSocket push eliminates HTTP polling overhead, streaming immediate worker status transitions.
  * **KPI: Zero Silent Stale Data ("Never show stale data silently"):** UI features an ambient connectivity badge (`CONNECTED` vs. `DISCONNECTED`); automatically pauses live charts and displays reconnect banners when disconnected.
  * **KPI: 100% Error Traceability:** Every error maps to a standard `code`, user-friendly corrective action, and persistent `correlation_id` logged across all microservices.
* **Gaps / S2 to S3 Transition:** Mock engine adapters in `teamMocks.js` currently simulate Teams A, B, and C; ready for drop-in replacement with real gRPC/REST clients in Gate 3.

### Right Column Content (Traceability Matrix Table):

| Req ID | S1 Requirement Name | Implementing Component | KPI Target | Architectural Verification |
| :--- | :--- | :--- | :--- | :--- |
| **D1** | Role-Based Access Control & Session Lifecycle | `session.js`, `AuthContext.jsx`, Route Guards | 100% route isolation | JWT validation, 3 distinct roles (Employee, IT Admin, Auditor) |
| **D2** | Browse, Filter, Schedule Backup & Version Restore | `files.js`, `backups.js`, `restores.js`, `Files.jsx` | Sub-second action response | Header idempotency keys, 202 async response format |
| **D3** | Live Operations & Storage Telemetry Dashboard | `dashboard.js`, `server.js` (Socket.IO), `Dashboard.jsx` | **< 200 ms latency**, 4s live sync | Parallel aggregation, WebSocket push, live connection status pill |
| **D4** | Storage Reporting, Retention Admin & Integrity | `reports.js`, `integrity.js`, `Admin.jsx`, `Reports.jsx` | 100% actionable error codes | SHA-256 Merkle root verification view, cold storage policy patches |

---

## SLIDE 7: 5. Decisions, Risks & Gate-2 Readiness (Team D Individual — 2 Marks)

* **Slide Tag:** `YOUR ENGINE /2`
* **Title:** 5. Decisions, Risks & Gate-2 Readiness
* **Evaluator Expectations:** Key ADRs (choice, reason, alternatives), risks & mitigations, review evidence, Gate-2 checklist.

### Left Column Content (Architecture Decision Records — ADRs):
* **ADR 1: Backend-for-Frontend (BFF) Pattern**
  * *Choice:* Node.js Express BFF mediating between frontend and backend services.
  * *Reason:* Shields client from microservice changes, aggregates multi-engine payloads, eliminates CORS issues, and hides internal auth tokens.
  * *Alternatives Considered:* Direct client-to-microservice calls (rejected: exposes internal topology, high client bandwidth).
* **ADR 2: WebSocket Streaming for Operational Telemetry**
  * *Choice:* Socket.IO bidirectional event channel for dashboard telemetry.
  * *Reason:* Minimizes network traffic and server CPU usage compared to high-frequency polling.
  * *Alternatives Considered:* Short polling every 2 seconds (rejected: high connection overhead and latency).
* **ADR 3: Mandatory Idempotency-Key Header on Mutations**
  * *Choice:* Enforce client-generated UUID on all `POST /backups` and `POST /restores`.
  * *Reason:* Guarantees that duplicate requests resulting from user double-clicks or network retries do not trigger duplicate backup jobs.

### Right Column Content (Risks & Gate-2 Readiness Checklist):
* **Risk Register & Mitigation:**
  * **Risk 1: Downstream Engine Unavailability (Teams A/B/C failure during dashboard load):**
    * *Mitigation:* BFF implements timeout boundaries and in-memory fallback caches; UI renders modular error states rather than crashing the page.
  * **Risk 2: WebSocket Disconnection on Unstable Networks:**
    * *Mitigation:* Automatic client-side exponential backoff reconnection with fallback to manual refresh.
* **Gate-2 Deliverables Checklist:**
  * [x] **OpenAPI 3.0 Contract Complete:** Published in `/contracts/openapi.yaml` with schema definitions.
  * [x] **Standalone BFF & Mock Layer:** Fully executable mock adapters (`teamMocks.js`) allowing independent UI/BFF testing.
  * [x] **Interactive Frontend Implementation:** React 18 application with live telemetry widgets and role-based guards.
  * [x] **Unified Error & Envelope Standard:** Enforced across all routes using `createSuccessEnvelope` and `createErrorEnvelope`.
  * [x] **S1 Requirements Verified:** 100% traceability to Section 4.4 specifications.

---

## SLIDE 8: Thank You & Technical Q&A
* **Main Title:** Thank You
* **Subtitle:** Questions & Technical Discussion
* **Presented By:** Team D — Backup Control & Restore Dashboard Engine
* **Project Repository:** Smart File Backup System (Team D)
* **Demo Ready:**
  * Backend Service: `http://localhost:4000/api/v1`
  * Frontend Application: `http://localhost:5173`
  * Role Showcase: Employee (Backup/Restore) vs. IT Admin (Retention & Queues) vs. Auditor (Integrity & Reports)
