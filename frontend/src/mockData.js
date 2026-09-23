/**
 * Frontend Mock Data & Fallback Storage Engine
 * Ensures 100% full-fidelity operation on Vercel deployment,
 * offline demo mode, or when connecting to remote BFF server.
 */

export function createValidPdfBlob(title, lines) {
  const cleanTitle = (title || "ApniLeap Backup Document").replace(/[\(\)\\]/g, "");
  const contentStream =
    "BT\n" +
    "/F1 16 Tf\n" +
    "50 750 Td\n" +
    `(${cleanTitle}) Tj\n` +
    "/F1 10 Tf\n" +
    "0 -22 Td\n" +
    lines.map(line => `(${line.replace(/[\(\)\\]/g, "")}) '`).join("\n") + "\n" +
    "ET";

  const encoder = new TextEncoder();
  const streamBytes = encoder.encode(contentStream);
  const streamLength = streamBytes.length;

  const objects = [
    `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`,
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n`,
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  ];

  let offset = 0;
  const offsets = [];
  let pdf = objects[0];
  offset = encoder.encode(pdf).length;

  for (let i = 1; i < objects.length; i++) {
    offsets.push(offset);
    pdf += objects[i];
    offset += encoder.encode(objects[i]).length;
  }

  const xrefOffset = offset;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (const off of offsets) {
    xref += String(off).padStart(10, "0") + " 00000 n \n";
  }

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return new Blob([encoder.encode(pdf + xref + trailer)], { type: "application/pdf" });
}


export const INITIAL_FILES = [
  {
    file_id: "f1",
    name: "apnileap_financial_ledger_2026.pdf",
    lastVersion: "v4",
    size: "4.2 MB",
    folder: "finance",
    retention_days: 90,
    storage_class: "HOT_STORAGE",
    checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    owner: "emp_sneha",
    last_backup_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    file_id: "f2",
    name: "smart_campus_system_architecture.drawio",
    lastVersion: "v2",
    size: "2.4 MB",
    folder: "engineering",
    retention_days: 60,
    storage_class: "STANDARD",
    checksum: "f7a938c201a3598b9f0d14b10b0e9324d52183e878e1d2b292e49c719842a8b9",
    owner: "emp_rahul",
    last_backup_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    file_id: "f3",
    name: "apnileap_production_db_dump.sql",
    lastVersion: "v12",
    size: "148.5 MB",
    folder: "database",
    retention_days: 365,
    storage_class: "COLD_STORAGE",
    checksum: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    owner: "admin_tejashree",
    last_backup_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    file_id: "f4",
    name: "ai_model_training_dataset.parquet",
    lastVersion: "v3",
    size: "84.1 MB",
    folder: "research",
    retention_days: 180,
    storage_class: "STANDARD",
    checksum: "8a6b2c4d1e3f5a7b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    owner: "emp_priya",
    last_backup_at: new Date(Date.now() - 28800000).toISOString()
  },
  {
    file_id: "f5",
    name: "iso27001_audit_compliance_pack.zip",
    lastVersion: "v1",
    size: "19.8 MB",
    folder: "compliance",
    retention_days: 730,
    storage_class: "COLD_STORAGE",
    checksum: "5c8f2b1a9e3d7c5b1a9e3d7c5b1a9e3d7c5b1a9e3d7c5b1a9e3d7c5b1a9e3d7c",
    owner: "audit_meera",
    last_backup_at: new Date(Date.now() - 43200000).toISOString()
  }
];

export function getLocalFiles() {
  const saved = localStorage.getItem("apnileap_files");
  if (!saved) {
    localStorage.setItem("apnileap_files", JSON.stringify(INITIAL_FILES));
    return INITIAL_FILES;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_FILES;
  }
}

export function saveLocalFiles(files) {
  localStorage.setItem("apnileap_files", JSON.stringify(files));
}

export function addLocalFile(fileData) {
  const files = getLocalFiles();
  const newFile = {
    file_id: "f" + (Date.now() % 10000),
    lastVersion: "v1",
    checksum: "sha256-" + Math.random().toString(36).substring(2, 12) + "9a",
    last_backup_at: new Date().toISOString(),
    ...fileData
  };
  const updated = [newFile, ...files];
  saveLocalFiles(updated);
  return newFile;
}

export function updateLocalFile(fileId, updates) {
  const files = getLocalFiles();
  const updated = files.map(f => (f.file_id === fileId ? { ...f, ...updates } : f));
  saveLocalFiles(updated);
  return updated.find(f => f.file_id === fileId);
}

export function getLocalDashboard() {
  const files = getLocalFiles();
  return {
    kpis: {
      total_files: files.length,
      active_backups: 3,
      failed_last_24h: 0,
      total_storage_bytes: 258900000,
      storage_used_display: "258.9 MB",
      deduplicated_storage_bytes: 68600000,
      dedup_savings_percent: "73.5%",
      merkle_root_health: "VERIFIED_VALID",
      load_balancing_policy: "ROUND_ROBIN (3 Nodes)"
    },
    round_robin_workers: [
      { worker_id: "Worker-Alpha (Node 1)", status: "ACTIVE", assigned_chunks: 14, cpu_usage: "34%", memory_usage: "420 MB", round_robin_slot: 0 },
      { worker_id: "Worker-Beta (Node 2)", status: "ACTIVE", assigned_chunks: 13, cpu_usage: "58%", memory_usage: "610 MB", round_robin_slot: 1 },
      { worker_id: "Worker-Gamma (Node 3)", status: "IDLE", assigned_chunks: 12, cpu_usage: "12%", memory_usage: "280 MB", round_robin_slot: 2 }
    ],
    recent_jobs: [
      { job_id: "job-891", file_id: "f1", name: "apnileap_financial_ledger_2026.pdf", state: "COMMITTED", node: "Worker-Alpha", time: "2 mins ago" },
      { job_id: "job-890", file_id: "f2", name: "smart_campus_system_architecture.drawio", state: "COMMITTED", node: "Worker-Beta", time: "15 mins ago" },
      { job_id: "job-889", file_id: "f4", name: "ai_model_training_dataset.parquet", state: "COMMITTED", node: "Worker-Gamma", time: "1 hour ago" }
    ],
    service_status: {
      team_a_scheduler: "HEALTHY",
      team_b_dedup: "HEALTHY",
      team_c_storage: "HEALTHY",
      merkle_verifier: "OPERATIONAL"
    }
  };
}

export function getLocalIntegrity(isTampered = false) {
  return {
    integrity_status: isTampered ? "CORRUPTED" : "VERIFIED_VALID",
    tampered_simulation: isTampered,
    merkle_tree: {
      root_hash: isTampered
        ? "0xDEAD_CORRUPTED_ROOT_HASH_999999999999999999999999999999999999"
        : "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
      algorithm: "SHA-256 (FIPS 180-4)",
      depth: 3,
      total_chunks: 4,
      verified_at: new Date().toISOString(),
      nodes: [
        { id: "node-root", label: "Root Hash (Level 0)", hash: isTampered ? "0xDEAD_CORRUPTED" : "0x8f9a...8f9a", status: isTampered ? "INVALID" : "VALID" },
        { id: "node-h1", label: "Intermediate Branch H(0,1)", hash: "0x4a1b...2c3d", status: "VALID" },
        { id: "node-h2", label: "Intermediate Branch H(2,3)", hash: isTampered ? "0xCORRUPT_H2" : "0x9e8f...7a6b", status: isTampered ? "INVALID" : "VALID" },
        { id: "chunk-0", label: "Chunk 0 (Worker-Alpha)", hash: "sha256:e3b0c442...991b", worker: "Worker-Alpha", status: "VALID" },
        { id: "chunk-1", label: "Chunk 1 (Worker-Beta)", hash: "sha256:f7a938c2...842a", worker: "Worker-Beta", status: "VALID" },
        { id: "chunk-2", label: "Chunk 2 (Worker-Gamma)", hash: isTampered ? "sha256:TAMPERED_BITS_0000" : "sha256:9f86d081...f00a", worker: "Worker-Gamma", status: isTampered ? "TAMPERED" : "VALID" },
        { id: "chunk-3", label: "Chunk 3 (Worker-Alpha)", hash: "sha256:8a6b2c4d...1a2b", worker: "Worker-Alpha", status: "VALID" }
      ]
    },
    dedup_summary: {
      total_blocks: 4,
      unique_blocks: 2,
      dedup_ratio: "73.5%",
      space_saved: "185.3 MB"
    }
  };
}

export function getLocalReports() {
  const files = getLocalFiles();
  return {
    compliance_standard: "ISO/IEC 27001:2022 & SOC 2 Type II",
    generated_at: new Date().toISOString(),
    summary: {
      total_managed_files: files.length,
      retention_compliance_rate: "100%",
      encryption_at_rest: "AES-256-GCM",
      integrity_protocol: "SHA-256 Merkle Verification",
      scheduling_policy: "Round-Robin Worker Distribution"
    },
    storage_classes: [
      { class: "HOT_STORAGE", count: files.filter(f => f.storage_class === "HOT_STORAGE").length, size: "4.2 MB", policy: "High throughput, immediate access" },
      { class: "STANDARD", count: files.filter(f => f.storage_class === "STANDARD").length, size: "86.5 MB", policy: "General access, balanced SLA" },
      { class: "COLD_STORAGE", count: files.filter(f => f.storage_class === "COLD_STORAGE").length, size: "168.3 MB", policy: "Long-term compliance archive" }
    ],
    audit_logs: [
      { log_id: "AUD-901", timestamp: new Date(Date.now() - 120000).toISOString(), actor: "audit_meera", action: "VERIFY_MERKLE_ROOT", result: "SUCCESS (Hash Valid)" },
      { log_id: "AUD-900", timestamp: new Date(Date.now() - 600000).toISOString(), actor: "admin_tejashree", action: "CLUSTER_REBALANCE", result: "SUCCESS (Round-Robin Node 1-3)" },
      { log_id: "AUD-899", timestamp: new Date(Date.now() - 1800000).toISOString(), actor: "emp_rahul", action: "BACKUP_REQUEST", result: "COMMITTED (3.2 MB)" },
      { log_id: "AUD-898", timestamp: new Date(Date.now() - 3600000).toISOString(), actor: "system_cron", action: "RETENTION_PURGE_SCAN", result: "CLEAN (0 files expired)" }
    ]
  };
}
