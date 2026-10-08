import { FileModel } from "../models/File.js";
import { FileChunkModel } from "../models/FileChunk.js";
import { FileVersionModel } from "../models/FileVersion.js";
import { WorkerNodeModel } from "../models/WorkerNode.js";
import { AuditLedgerModel } from "../models/AuditLedger.js";
import { isDbConnected } from "../db/connection.js";
import { INITIAL_FILES } from "../mocks/teamMocks.js";

const INITIAL_WORKERS = [
  {
    worker_id: "Worker-Alpha (Node 1)",
    node_name: "Horizontal Compute Node 1",
    host: "127.0.0.1",
    port: 5001,
    status: "ACTIVE",
    current_task: "SHA-256 Hashing Chunk #1",
    assigned_chunks: 14,
    active_jobs: 1,
    cpu_usage: "34%",
    cpu_usage_pct: 34,
    memory_usage: "420 MB",
    memory_usage_mb: 420,
    weight_capacity: 1.5,
    total_processed_chunks: 42,
    round_robin_slot: 0
  },
  {
    worker_id: "Worker-Beta (Node 2)",
    node_name: "Horizontal Compute Node 2",
    host: "127.0.0.1",
    port: 5002,
    status: "ACTIVE",
    current_task: "Merkle Tree Construction",
    assigned_chunks: 13,
    active_jobs: 1,
    cpu_usage: "58%",
    cpu_usage_pct: 58,
    memory_usage: "610 MB",
    memory_usage_mb: 610,
    weight_capacity: 1.2,
    total_processed_chunks: 39,
    round_robin_slot: 1
  },
  {
    worker_id: "Worker-Gamma (Node 3)",
    node_name: "Horizontal Compute Node 3",
    host: "127.0.0.1",
    port: 5003,
    status: "IDLE",
    current_task: "Awaiting Next Chunk Dispatch",
    assigned_chunks: 12,
    active_jobs: 0,
    cpu_usage: "12%",
    cpu_usage_pct: 12,
    memory_usage: "280 MB",
    memory_usage_mb: 280,
    weight_capacity: 1.0,
    total_processed_chunks: 36,
    round_robin_slot: 2
  }
];

const INITIAL_AUDITS = [
  {
    audit_id: "aud-001",
    timestamp: "2026-09-22T14:30:00Z",
    action: "BACKUP_COMMIT",
    correlation_id: "corr-9812a-fin",
    user: "emp_sneha",
    role: "Employee",
    file_id: "f1",
    file_name: "apnileap_financial_ledger_2026.pdf",
    status: "COMMITTED",
    merkle_root: "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    network_origin: "Remote (VPN Encrypted)"
  },
  {
    audit_id: "aud-002",
    timestamp: "2026-09-22T16:15:00Z",
    action: "BACKUP_COMMIT",
    correlation_id: "corr-1102b-eng",
    user: "emp_rahul",
    role: "Employee",
    file_id: "f2",
    file_name: "smart_campus_system_architecture.drawio",
    status: "COMMITTED",
    merkle_root: "0xf7a938c201a3598b9f0d14b10b0e9324d52183e878e1d2b292e49c719842a8b9",
    network_origin: "Corporate LAN"
  },
  {
    audit_id: "aud-003",
    timestamp: "2026-09-22T17:45:00Z",
    action: "RETENTION_POLICY_EDIT",
    correlation_id: "corr-4410b-adm",
    user: "admin_tejashree",
    role: "IT Admin",
    file_id: "f3",
    file_name: "apnileap_production_db_dump.sql",
    status: "COMMITTED",
    merkle_root: "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    network_origin: "Corporate LAN"
  }
];

export async function seedInitialDatabase() {
  if (!isDbConnected()) {
    console.warn("[Database Seeder] Skipped seeding: MongoDB is not connected.");
    return;
  }

  try {
    // 1. Seed Files
    const fileCount = await FileModel.countDocuments();
    if (fileCount === 0) {
      console.log("[Database Seeder] Seeding initial files into MongoDB Compass...");
      for (const f of INITIAL_FILES) {
        await FileModel.create({
          file_id: f.file_id,
          name: f.name,
          folder: f.folder || "general",
          extension: f.name.split(".").pop() || "dat",
          mime_type: f.name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream",
          size_bytes: Math.round(parseFloat(f.size || "1") * 1024 * 1024),
          size: f.size,
          storage_class: f.storage_class,
          retention_days: f.retention_days,
          owner: f.owner,
          lastVersion: f.lastVersion,
          merkle_root: f.checksum,
          checksum: f.checksum,
          total_chunks: 4,
          unique_chunks: 3,
          storage_pointer: `localfs://data/uploads/${f.file_id}`,
          status: "COMMITTED",
          last_backup_at: f.last_backup_at
        });

        // Seed file version
        await FileVersionModel.create({
          file_id: f.file_id,
          version_tag: f.lastVersion || "v1",
          author: f.owner,
          merkle_root: f.checksum,
          chunk_manifest: [
            { index: 0, chunk_hash: f.checksum.substring(0, 16) + "01", is_duplicate: false },
            { index: 1, chunk_hash: f.checksum.substring(0, 16) + "02", is_duplicate: true },
            { index: 2, chunk_hash: f.checksum.substring(0, 16) + "03", is_duplicate: false },
            { index: 3, chunk_hash: f.checksum.substring(0, 16) + "04", is_duplicate: true }
          ],
          change_summary: "Initial baseline backup snapshot",
          timestamp: f.last_backup_at
        });

        // Seed initial chunks
        await FileChunkModel.updateOne(
          { chunk_hash: f.checksum.substring(0, 16) + "01" },
          {
            $setOnInsert: {
              chunk_hash: f.checksum.substring(0, 16) + "01",
              byte_size: 1048576,
              physical_storage_path: `data/uploads/chunks/${f.checksum.substring(0, 16)}01.chunk`,
              reference_count: 2,
              associated_files: [f.file_id]
            }
          },
          { upsert: true }
        );
      }
      console.log(`[Database Seeder] Successfully seeded ${INITIAL_FILES.length} files into MongoDB.`);
    }

    // 2. Seed Horizontal Worker Nodes
    const workerCount = await WorkerNodeModel.countDocuments();
    if (workerCount === 0) {
      console.log("[Database Seeder] Seeding 3 Horizontal OS Worker Nodes into MongoDB Compass...");
      await WorkerNodeModel.insertMany(INITIAL_WORKERS);
      console.log("[Database Seeder] Seeded 3 Horizontal Worker Nodes.");
    }

    // 3. Seed Audit Ledger
    const auditCount = await AuditLedgerModel.countDocuments();
    if (auditCount === 0) {
      console.log("[Database Seeder] Seeding initial audit ledger into MongoDB Compass...");
      await AuditLedgerModel.insertMany(INITIAL_AUDITS);
      console.log("[Database Seeder] Seeded initial audit trail.");
    }

    console.log("[Database Seeder] MongoDB Compass 'smart_file_backup' collections verified and ready for evaluation.");
  } catch (err) {
    console.error("[Database Seeder Error] Failed to seed initial data:", err.message);
  }
}
