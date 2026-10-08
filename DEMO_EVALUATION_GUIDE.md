# Smart File Backup System — Evaluator & Demo Guide
**Project:** ApniLeap Enterprise Backup Platform (RIT-CSE 2026)  
**Evaluator Target:** 4-Team Comprehensive Defense & Live Demonstration  
**Local Database:** MongoDB Compass (`mongodb://127.0.0.1:27017` / Database: `smart_file_backup`)  

---

## 🧭 Live System Setup & Quick Start

### 1. Check MongoDB Compass
Open **MongoDB Compass** on your laptop:
- Connection URI: `mongodb://localhost:27017`
- Connect and expand the database **`smart_file_backup`**
- You will see the 6 pristine collections:
  1. `files` (Stores metadata & pointers ONLY — zero raw file blobs!)
  2. `file_chunks` (Content-addressed SHA-256 chunk deduplication table)
  3. `file_versions` (Historical version trees & chunk manifest pointers)
  4. `worker_nodes` (Horizontal OS compute servers: Alpha, Beta, Gamma)
  5. `backup_jobs` (Audit of scheduled backups, algorithm used, execution latency)
  6. `audit_ledger` (Immutable compliance log with Merkle tree roots)

### 2. Start Services
```bash
# Terminal 1: Backend BFF Server (Port 4000)
cd backend
npm start

# Terminal 2: Frontend Web Application (Port 5173)
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 4 Live Test Scenarios for the Evaluator / Professor (Sir)

All test files are stored in the `demo_files/` folder:

### 🌟 TEST 1: Unique File Ingestion & MongoDB Compass Verification
1. Log in as an **Employee** (e.g. `emp_rahul` or `emp_priya`).
2. Go to **Files** $\rightarrow$ Click **"Upload File"**.
3. Choose or paste the content of **`demo_files/demo_file_unique_v1.txt`**.
4. Click **"Submit & Backup"**.
5. **Observed System Result**:
   - The status message confirms: `[NEW DATA COMMITTED] All chunks unique. Pointers registered in MongoDB. Merkle root verified.`
   - Dispatched across horizontal OS servers using **Dynamic Weighted Capacity**.
6. **Live Proof in MongoDB Compass**:
   - Open collection **`files`**: Look at the new document. Notice `storage_pointer` points to disk (`localfs://data/uploads/chunks/...`) — **No physical blobs in DB!**
   - Open collection **`file_chunks`**: See new SHA-256 chunk entries with `reference_count: 1`.

---

### 🌟 TEST 2: Exact Duplicate Upload (Zero Additional Storage & Deduplication Hit)
1. In the **Files** page, click **"Upload File"** again.
2. Select or paste the content of **`demo_files/demo_file_duplicate.txt`** (which has identical text to v1).
3. Click **"Submit & Backup"**.
4. **Observed System Result**:
   - Immediate feedback:  
     `[DEDUPLICATION HIT] Exact file duplicate detected! 100% of chunks already exist in storage. 0 additional bytes written to disk. Pointer references incremented. Storage saved: 100%.`
5. **Live Proof in MongoDB Compass**:
   - Open collection **`file_chunks`**: The chunk's `reference_count` has increased from `1` to `2`!
   - No duplicate chunk created, zero extra bytes written to physical storage.

---

### 🌟 TEST 3: Delta Versioning & Partial Deduplication
1. Click **"Upload File"**.
2. Select or paste **`demo_files/demo_file_delta_v2.txt`** (only 1 section modified).
3. Click **"Submit & Backup"**.
4. **Observed System Result**:
   - `[DELTA DEDUPLICATION] 3 of 4 chunks matched existing storage blocks (75% savings). Only 1 new unique chunk committed to physical disk.`
5. **Live Proof in MongoDB Compass**:
   - Open collection **`file_versions`**: New version snapshot linked to the shared chunk manifest.

---

### 🌟 TEST 4: OS Horizontal Server Scheduling Algorithm Switch
Demonstrate Team A's 3 algorithms:
1. Open terminal or Postman/Curl:
   ```bash
   # Check active algorithm and descriptions:
   curl http://localhost:4000/api/v1/ui/backups/algorithms

   # Switch to Round-Robin:
   curl -X POST http://localhost:4000/api/v1/ui/backups/algorithm \
     -H "Content-Type: application/json" \
     -d '{"algorithm":"ROUND_ROBIN"}'

   # Switch to Least Loaded:
   curl -X POST http://localhost:4000/api/v1/ui/backups/algorithm \
     -H "Content-Type: application/json" \
     -d '{"algorithm":"LEAST_LOADED"}'

   # Switch to Dynamic Weighted Capacity (The Best Algorithm):
   curl -X POST http://localhost:4000/api/v1/ui/backups/algorithm \
     -H "Content-Type: application/json" \
     -d '{"algorithm":"DYNAMIC_WEIGHTED"}'
   ```
2. In the web dashboard (`http://localhost:5173`), observe the real-time Socket.IO stream updating worker node metrics and chunk allocation distribution.
3. Open MongoDB Compass collection **`worker_nodes`** to see live assigned chunks and CPU load for `Worker-Alpha`, `Worker-Beta`, and `Worker-Gamma`.

---

## 📊 Summary of Engineering Defense Points

| Question from Evaluator | Your Defense & Technical Explanation |
| :--- | :--- |
| **"Why is MongoDB Compass not storing physical file blobs?"** | Storing binary blobs inside MongoDB bloats the BSON document limit (16MB), causes lock contention, and degrades query performance. We implement the industry-standard **Content-Addressed Storage (CAS) Pointer pattern**, where MongoDB stores authoritative metadata, SHA-256 chunk hashes, and storage pointers, while raw chunks reside in localized chunk storage. |
| **"Which OS load-balancing algorithm is best and why?"** | **Dynamic Weighted Capacity (DWC)** is the best. Unlike simple Round-Robin (which can route large chunks to CPU-throttled nodes) or Least Connections (which ignores CPU intensity), DWC calculates a real-time capacity score: `(100 - CPU%) * Weight / (ActiveTasks + 1)`, ensuring optimal horizontal server throughput and zero queuing bottlenecks. |
| **"How does the DSA deduplication work?"** | Files are split into blocks, hashed using cryptographic SHA-256 (FIPS 180-4), and checked against a hash map in MongoDB `file_chunks`. Duplicate blocks increment `reference_count`, saving 70–100% disk space. The file's cryptographic tree is then compiled into a Merkle Tree Root for bit-level tamper verification. |
