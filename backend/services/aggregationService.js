import { mockTeamA, mockTeamB, mockTeamC, PREDEFINED_USERS } from "../mocks/teamMocks.js";

/**
 * Aggregation Service Layer for Team D BFF (ApniLeap)
 * Orchestrates Team C (DBMS Metadata), Team A (OS Scheduler), and Team B (Dedup & Storage)
 * Supports 15 Predefined Credentials, Round-Robin Worker Pools, VPN Gateway Security,
 * and Merkle Tree Cryptographic Integrity.
 */

// In-memory active backup, restore, and audit store
const activeBackupsStore = new Map();
const activeRestoresStore = new Map();
const immutableAuditLedger = [
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

export const aggregationService = {

  // ==========================================
  // D1. Authentication & Role Session (15 Users)
  // ==========================================
  authenticateUser(username, password, role) {
    // Check in predefined 15 accounts
    let matchedUser = PREDEFINED_USERS.find(
      u => u.username.toLowerCase() === (username || "").toLowerCase()
    );

    if (!matchedUser) {
      // Fallback for custom demo input
      matchedUser = {
        username: username || "emp_rahul",
        name: (username || "Demo User").replace("_", " ").toUpperCase(),
        role: role || "Employee",
        department: "Operations",
        accessMode: "Standard",
        institution_id: "RIT-CSE-2026"
      };
    }

    const assignedRole = role || matchedUser.role;

    return {
      token: `apnileap-jwt-${matchedUser.username}-${Date.now()}`,
      user: {
        username: matchedUser.username,
        name: matchedUser.name,
        role: assignedRole,
        department: matchedUser.department,
        accessMode: matchedUser.accessMode,
        institution_id: matchedUser.institution_id || "RIT-CSE-2026",
        permissions: this.getRolePermissions(assignedRole)
      }
    };
  },

  getPredefinedUsers() {
    return PREDEFINED_USERS;
  },

  getRolePermissions(role) {
    switch (role) {
      case "IT Admin":
        return ["READ_FILES", "UPLOAD_FILE", "SCHEDULE_BACKUP", "RESTORE_FILES", "EDIT_RETENTION", "EDIT_LOCATION", "VIEW_REPORTS", "VERIFY_INTEGRITY", "MANAGE_NODES", "MANAGE_VPN"];
      case "Auditor":
        return ["READ_FILES", "VIEW_REPORTS", "VIEW_AUDIT_LOGS", "VERIFY_INTEGRITY", "EXPORT_EVIDENCE"];
      case "Employee":
      default:
        return ["READ_FILES", "UPLOAD_FILE", "SCHEDULE_BACKUP", "RESTORE_FILES", "TOGGLE_VPN"];
    }
  },

  // ==========================================
  // D2. Browse, Schedule and Restore Experience
  // ==========================================
  getFiles(searchQuery = "", folderFilter = "", storageClassFilter = "") {
    let list = mockTeamC.files;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.file_id.toLowerCase().includes(q) || (f.owner && f.owner.toLowerCase().includes(q)));
    }
    if (folderFilter && folderFilter !== "ALL") {
      list = list.filter(f => (f.folder || "general").toLowerCase() === folderFilter.toLowerCase());
    }
    if (storageClassFilter && storageClassFilter !== "ALL") {
      list = list.filter(f => f.storage_class === storageClassFilter);
    }
    return list;
  },

  addNewUploadedFile({ fileName, size, folder, owner, storageClass = "HOT_STORAGE", retentionDays = 90 }) {
    const fileId = "f" + (mockTeamC.files.length + 1);
    const newFile = {
      file_id: fileId,
      name: fileName,
      lastVersion: "v1",
      size: size || "3.5 MB",
      folder: folder || "documents",
      retention_days: Number(retentionDays) || 90,
      storage_class: storageClass,
      checksum: "sha256-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      owner: owner || "emp_rahul",
      last_backup_at: new Date().toISOString()
    };
    mockTeamC.addFile(newFile);
    return newFile;
  },

  getFileVersions(fileId) {
    const file = mockTeamC.getFileById(fileId);
    if (!file) {
      const err = new Error(`File '${fileId}' not found.`);
      err.statusCode = 404;
      err.code = "RESOURCE_NOT_FOUND";
      throw err;
    }
    return {
      file_id: file.file_id,
      file_name: file.name,
      currentVersion: file.lastVersion,
      versions: [
        { version_id: file.lastVersion, created_at: file.last_backup_at, size: file.size, checksum: file.checksum, chunks_count: 4, verified: true },
        { version_id: "v1", created_at: "2026-09-01T10:00:00Z", size: file.size, checksum: "checksum-v1-" + file.file_id, chunks_count: 4, verified: true }
      ]
    };
  },

  orchestrateBackup({ fileId, backupPolicy = "ROUND_ROBIN", priority = 3, idempotencyKey = "", vpnTunnelId = null, user = "emp_rahul" }) {
    let file = mockTeamC.getFileById(fileId);
    if (!file) {
      // Fallback: create temporary file entry
      file = mockTeamC.files[0];
    }

    const backupId = "bkp-" + Date.now();
    const jobId = "job-" + Date.now().toString().slice(-4);
    const chunksCount = 4; // Simulated 4-chunk file

    // Call Team A OS Scheduler for Round-Robin allocation across worker nodes
    const allocation = mockTeamA.allocateLease(jobId, priority, chunksCount);
    // Call Team B for SHA-256 Deduplication and Merkle Tree verification
    const dedup = mockTeamB.performDedup(file.file_id, chunksCount);

    const record = {
      backup_id: backupId,
      job_id: jobId,
      file_id: file.file_id,
      file_name: file.name,
      policy: backupPolicy,
      priority,
      idempotency_key: idempotencyKey || "idemp-bkp-" + backupId,
      state: "COMMITTED",
      queue_position: 0,
      estimated_start: new Date().toISOString(),
      allocation,
      dedup,
      vpn_tunnel: vpnTunnelId ? { status: "SECURE_TUNNEL_VERIFIED", tunnel_id: vpnTunnelId } : { status: "DIRECT_CORPORATE_LAN" },
      submitted_at: new Date().toISOString()
    };

    activeBackupsStore.set(backupId, record);

    // Append to Immutable Audit Ledger
    immutableAuditLedger.unshift({
      audit_id: "aud-" + Date.now().toString().slice(-4),
      timestamp: new Date().toISOString(),
      action: "BACKUP_COMMIT",
      correlation_id: "corr-" + backupId,
      user: user,
      role: "Employee",
      file_id: file.file_id,
      file_name: file.name,
      status: "COMMITTED",
      merkle_root: dedup.merkle_root,
      network_origin: vpnTunnelId ? "Remote (VPN Encrypted)" : "Corporate LAN"
    });

    return record;
  },

  getBackupById(backupId) {
    if (activeBackupsStore.has(backupId)) {
      return activeBackupsStore.get(backupId);
    }
    return {
      backup_id: backupId,
      file_id: "f1",
      file_name: "apnileap_financial_ledger_2026.pdf",
      state: "COMMITTED",
      queue_position: 0,
      estimated_start: new Date().toISOString(),
      dedup: { savings_ratio: 0.735, unique_chunks: 1, duplicate_chunks: 3 },
      verification: { status: "VERIFIED", merkle_root: "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a" }
    };
  },

  orchestrateRestore({ fileId, versionId, targetPath, idempotencyKey = "", user = "emp_rahul" }) {
    const file = mockTeamC.getFileById(fileId) || mockTeamC.files[0];
    const restoreId = "rst-" + Date.now();

    const record = {
      restore_id: restoreId,
      file_id: file.file_id,
      file_name: file.name,
      version_id: versionId || file.lastVersion,
      target_path: targetPath || `/restores/apnileap/${file.name}`,
      state: "RESTORED",
      idempotency_key: idempotencyKey || "idemp-rst-" + restoreId,
      estimated_completion: new Date(Date.now() + 2000).toISOString(),
      submitted_at: new Date().toISOString()
    };

    activeRestoresStore.set(restoreId, record);

    // Append to Immutable Audit Ledger
    immutableAuditLedger.unshift({
      audit_id: "aud-" + Date.now().toString().slice(-4),
      timestamp: new Date().toISOString(),
      action: "RESTORE_EXEC",
      correlation_id: "corr-" + restoreId,
      user: user,
      role: "Employee",
      file_id: file.file_id,
      file_name: file.name,
      status: "COMPLETED",
      merkle_root: file.checksum,
      network_origin: "On-Prem / VPN Verified"
    });

    return record;
  },

  // ==========================================
  // D3. Live Operations Dashboard & Telemetry
  // ==========================================
  getDashboardSummary() {
    const files = mockTeamC.files;
    return {
      storageStatus: {
        usedGB: 152.9,
        totalCapacityGB: 500.0,
        usagePercentage: 30.58,
        savedGB: 415.8
      },
      dedupOverlay: {
        savingsRatioPct: 73.5,
        uniqueChunks: 42,
        duplicateChunks: 116,
        merkleVerificationStatus: "100% HEALTHY",
        hashAlgorithm: "SHA-256"
      },
      queueVisualization: {
        schedulingPolicy: mockTeamA.schedulingPolicy,
        queueDepth: mockTeamA.queueDepth,
        workers: mockTeamA.workers
      },
      alerts: [
        { id: "alt-101", severity: "success", title: "Merkle Tree Intact", message: "SHA-256 Cryptographic roots verified across all 5 file packages.", timestamp: "2 mins ago" },
        { id: "alt-102", severity: "info", title: "Round-Robin Dispatch Active", message: "Worker-Alpha & Beta balanced 27 total chunk tasks.", timestamp: "5 mins ago" },
        { id: "alt-103", severity: "info", title: "VPN Gateway Active", message: "3 Remote employees authenticated via WireGuard/IPSec tunnel.", timestamp: "12 mins ago" }
      ],
      totalFilesCount: files.length,
      serverNode: {
        host: "ApniLeap-Central-Node-01 (Local Host)",
        ip: "10.0.4.82",
        status: "ONLINE",
        port: 4000,
        uptime: "99.98%"
      },
      lastUpdated: new Date().toISOString()
    };
  },

  getIntegrityReport(simulatedTampered = false) {
    if (simulatedTampered) {
      return {
        merkleRoot: "0xCORRUPTED_FAIL_8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        treeDepth: 3,
        totalChunks: 4,
        status: "TAMPERING_DETECTED",
        integrityHealth: "DEGRADED (Bit mismatch at Chunk #2)",
        hashAlgorithm: "SHA-256 (FIPS 180-4)",
        chunks: [
          { index: 0, hash: "0xa1b2c3d4e5f6... (Chunk 1)", status: "VALID" },
          { index: 1, hash: "0xBAD_HASH_CORRUPT... (Chunk 2)", status: "CORRUPTED" },
          { index: 2, hash: "0xc3d4e5f6a1b2... (Chunk 3)", status: "VALID" },
          { index: 3, hash: "0xd4e5f6a1b2c3... (Chunk 4)", status: "VALID" }
        ],
        lastAuditTimestamp: new Date().toISOString()
      };
    }

    return {
      merkleRoot: "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
      treeDepth: 3,
      totalChunks: 4,
      status: "VERIFIED_INTACT",
      integrityHealth: "100% HEALTHY",
      hashAlgorithm: "SHA-256 (FIPS 180-4)",
      chunks: [
        { index: 0, hash: "0x3f7a1b8e4c2d90fa812bcde04f1289ab72341904 (Chunk 1)", status: "VALID" },
        { index: 1, hash: "0x7e8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a (Chunk 2)", status: "VALID" },
        { index: 2, hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b (Chunk 3)", status: "VALID" },
        { index: 3, hash: "0x9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a (Chunk 4)", status: "VALID" }
      ],
      lastAuditTimestamp: new Date().toISOString()
    };
  },

  // ==========================================
  // D4. Administration, Reports & Audit Ledger
  // ==========================================
  updateFilePolicy(fileId, retentionDays, storageClass, user = "admin_tejashree") {
    const updated = mockTeamC.updateRetention(fileId, retentionDays, storageClass);
    if (!updated) {
      const err = new Error(`File '${fileId}' not found.`);
      err.statusCode = 404;
      err.code = "RESOURCE_NOT_FOUND";
      throw err;
    }

    immutableAuditLedger.unshift({
      audit_id: "aud-" + Date.now().toString().slice(-4),
      timestamp: new Date().toISOString(),
      action: "RETENTION_POLICY_EDIT",
      correlation_id: "corr-pol-" + Date.now(),
      user: user,
      role: "IT Admin",
      file_id: fileId,
      file_name: updated.name,
      status: "COMMITTED",
      merkle_root: updated.checksum,
      network_origin: "Corporate LAN"
    });

    return updated;
  },

  getStorageReport() {
    return {
      summary: {
        totalCapacityGB: 500,
        usedGB: 152.9,
        savedGB: 415.8,
        dedupRatioPct: 73.5
      },
      breakdownByClass: [
        { class: "HOT_STORAGE", sizeGB: 4.2, filesCount: 1, description: "Active SSD Tier (Sub-10ms Access)" },
        { class: "STANDARD", sizeGB: 104.3, filesCount: 2, description: "NVMe Tier (Standard Backup Store)" },
        { class: "COLD_STORAGE", sizeGB: 168.3, filesCount: 2, description: "Glacier/MinIO Archival Tier" }
      ],
      auditEvents: immutableAuditLedger
    };
  },

  runVerifyPreview() {
    return {
      preview_id: "prev-" + Date.now(),
      verification_passed: true,
      hash_algorithm: "SHA-256",
      checksum_match: true,
      merkle_root: "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
      simulated_duration_ms: 38,
      timestamp: new Date().toISOString()
    };
  }
};
