/**
 * Team A, Team B, and Team C Mock Handlers for ApniLeap
 * Supports 15 Role-based User Credentials, Round-Robin Worker Pools,
 * SHA-256 Deduplication, and Merkle Tree Cryptographic Verification.
 */

export const PREDEFINED_USERS = [
  // 1. Employee Accounts
  {
    username: "emp_rahul",
    password: "Rahul@2026",
    name: "Rahul Sharma",
    role: "Employee",
    department: "Engineering",
    accessMode: "Remote & On-Prem",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "emp_priya",
    password: "Priya@2026",
    name: "Priya Patel",
    role: "Employee",
    department: "Data Science",
    accessMode: "Remote & On-Prem",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "emp_amit",
    password: "Amit@2026",
    name: "Amit Verma",
    role: "Employee",
    department: "Product Design",
    accessMode: "On-Prem",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "emp_sneha",
    password: "Sneha@2026",
    name: "Sneha Kulkarni",
    role: "Employee",
    department: "Finance",
    accessMode: "Remote & On-Prem",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "emp_rohit",
    password: "Rohit@2026",
    name: "Rohit Deshmukh",
    role: "Employee",
    department: "Operations",
    accessMode: "On-Prem",
    institution_id: "RIT-CSE-2026"
  },

  // 2. IT Admin Accounts
  {
    username: "admin_tejashree",
    password: "Admin@2026",
    name: "Tejashree Patil",
    role: "IT Admin",
    department: "Infrastructure & Arch",
    accessMode: "Full Admin",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "admin_suresh",
    password: "Suresh@2026",
    name: "Suresh Nair",
    role: "IT Admin",
    department: "Cluster Node Mgr",
    accessMode: "Full Admin",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "admin_ananya",
    password: "Ananya@2026",
    name: "Ananya Joshi",
    role: "IT Admin",
    department: "VPN & Network Sec",
    accessMode: "Full Admin",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "admin_vikram",
    password: "Vikram@2026",
    name: "Vikram Malhotra",
    role: "IT Admin",
    department: "Storage Policy & SLA",
    accessMode: "Full Admin",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "admin_kiran",
    password: "Kiran@2026",
    name: "Kiran Rao",
    role: "IT Admin",
    department: "DevOps & Failover",
    accessMode: "Full Admin",
    institution_id: "RIT-CSE-2026"
  },

  // 3. Auditor Accounts
  {
    username: "audit_meera",
    password: "Audit@2026",
    name: "Meera Iyer",
    role: "Auditor",
    department: "Chief Compliance Officer",
    accessMode: "Audit Scope",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "audit_rajesh",
    password: "Rajesh@2026",
    name: "Rajesh Gupta",
    role: "Auditor",
    department: "Crypto & Hash Inspector",
    accessMode: "Audit Scope",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "audit_pooja",
    password: "Pooja@2026",
    name: "Pooja Shinde",
    role: "Auditor",
    department: "ISO 27001 Governance",
    accessMode: "Audit Scope",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "audit_arun",
    password: "Arun@2026",
    name: "Arun Menon",
    role: "Auditor",
    department: "Storage & Dedup SLA",
    accessMode: "Audit Scope",
    institution_id: "RIT-CSE-2026"
  },
  {
    username: "audit_neha",
    password: "Neha@2026",
    name: "Neha Saxena",
    role: "Auditor",
    department: "Security Forensics",
    accessMode: "Audit Scope",
    institution_id: "RIT-CSE-2026"
  }
];

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");
const UPLOADS_DIR = path.resolve(DATA_DIR, "uploads");
const FILES_JSON_PATH = path.resolve(DATA_DIR, "files.json");

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

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
    last_backup_at: "2026-09-22T14:30:00Z"
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
    last_backup_at: "2026-09-22T16:15:00Z"
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
    last_backup_at: "2026-09-22T10:00:00Z"
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
    last_backup_at: "2026-09-22T17:45:00Z"
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
    last_backup_at: "2026-09-22T18:20:00Z"
  }
];

function loadPersistedFiles() {
  try {
    if (fs.existsSync(FILES_JSON_PATH)) {
      const data = fs.readFileSync(FILES_JSON_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to read persisted files.json:", err.message);
  }
  savePersistedFiles(INITIAL_FILES);
  return [...INITIAL_FILES];
}

function savePersistedFiles(files) {
  try {
    fs.writeFileSync(FILES_JSON_PATH, JSON.stringify(files, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save files.json:", err.message);
  }
}

export const mockTeamC = {
  files: loadPersistedFiles(),

  getFileById(fileId) {
    return this.files.find(f => f.file_id === fileId);
  },

  addFile(fileData) {
    this.files.unshift(fileData);
    savePersistedFiles(this.files);
    return fileData;
  },

  updateRetention(fileId, retentionDays, storageClass) {
    const file = this.getFileById(fileId);
    if (file) {
      if (retentionDays !== undefined) file.retention_days = Number(retentionDays);
      if (storageClass) file.storage_class = storageClass;
      savePersistedFiles(this.files);
      return file;
    }
    return null;
  }
};


let workerRoundRobinCounter = 0;

export const mockTeamA = {
  schedulingPolicy: "ROUND_ROBIN",
  queueDepth: 2,
  workers: [
    {
      worker_id: "Worker-Alpha (Node 1)",
      status: "ACTIVE",
      current_task: "SHA-256 Hashing Chunk #1",
      assigned_chunks: 14,
      cpu_usage: "34%",
      memory_usage: "420 MB",
      round_robin_slot: 0
    },
    {
      worker_id: "Worker-Beta (Node 2)",
      status: "ACTIVE",
      current_task: "Merkle Tree Construction",
      assigned_chunks: 13,
      cpu_usage: "58%",
      memory_usage: "610 MB",
      round_robin_slot: 1
    },
    {
      worker_id: "Worker-Gamma (Node 3)",
      status: "IDLE",
      current_task: "Awaiting Next Chunk Dispatch",
      assigned_chunks: 12,
      cpu_usage: "12%",
      memory_usage: "280 MB",
      round_robin_slot: 2
    }
  ],

  allocateLease(jobId, priority = 3, chunksCount = 4) {
    // Round-Robin dispatch algorithm
    const assignedWorkerIndices = [];
    for (let i = 0; i < chunksCount; i++) {
      const targetWorkerIdx = (workerRoundRobinCounter + i) % this.workers.length;
      assignedWorkerIndices.push(targetWorkerIdx);
      this.workers[targetWorkerIdx].assigned_chunks += 1;
    }
    workerRoundRobinCounter = (workerRoundRobinCounter + chunksCount) % this.workers.length;

    const selectedWorkerNames = assignedWorkerIndices.map(idx => this.workers[idx].worker_id);

    return {
      decision_id: "dec-rr-" + Date.now(),
      job_id: jobId,
      policy: this.schedulingPolicy,
      worker_ids: selectedWorkerNames,
      lease_id: "lease-x99-" + Math.floor(Math.random() * 10000),
      state: "LEASE_GRANTED",
      scheduled_start: new Date().toISOString(),
      metrics: {
        estimated_duration_sec: Math.max(3, chunksCount * 2),
        round_robin_distribution: assignedWorkerIndices
      }
    };
  }
};

export const mockTeamB = {
  performDedup(fileId, customChunks = 4) {
    const unique = Math.max(1, Math.floor(customChunks * 0.3));
    const duplicate = customChunks - unique;
    const savingsRatio = 0.735; // 73.5%

    return {
      dedup_result_id: "dedup-" + Date.now(),
      total_chunks: customChunks,
      unique_chunks: unique,
      duplicate_chunks: duplicate,
      savings_ratio: savingsRatio,
      savings_percentage: "73.5%",
      hash_algorithm: "SHA-256 (FIPS 180-4)",
      merkle_root: "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
      tree_depth: 3
    };
  }
};
