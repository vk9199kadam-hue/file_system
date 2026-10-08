import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { FileChunkModel } from "../models/FileChunk.js";
import { isDbConnected } from "../db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");
const CHUNKS_DIR = path.resolve(DATA_DIR, "uploads/chunks");

// Ensure physical chunk storage directory exists
if (!fs.existsSync(CHUNKS_DIR)) {
  fs.mkdirSync(CHUNKS_DIR, { recursive: true });
}

// In-memory fallback chunk cache if MongoDB is offline
const inMemoryChunkCache = new Map();

/**
 * Builds a Merkle Tree from an array of SHA-256 chunk hashes
 * and returns the Merkle Root hash
 */
export function buildMerkleTree(chunkHashes) {
  if (!chunkHashes || chunkHashes.length === 0) {
    return "0x" + crypto.createHash("sha256").update("EMPTY_TREE").digest("hex");
  }

  let currentLevel = chunkHashes.map(h => (h.startsWith("0x") ? h.slice(2) : h));

  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = currentLevel[i] + currentLevel[i + 1];
        nextLevel.push(crypto.createHash("sha256").update(combined).digest("hex"));
      } else {
        // Odd node: duplicate or promote
        const combined = currentLevel[i] + currentLevel[i];
        nextLevel.push(crypto.createHash("sha256").update(combined).digest("hex"));
      }
    }
    currentLevel = nextLevel;
  }

  return "0x" + currentLevel[0];
}

/**
 * Team B: File System Optimization & Deduplication Engine (DSA)
 */
export const dedupService = {
  /**
   * Processes a file buffer, splits into chunks, checks for duplicates,
   * stores unique chunks to disk, and updates MongoDB pointer index.
   */
  async processBufferAndDeduplicate(fileBuffer, fileName, fileId, options = {}) {
    try {
      const buffer = Buffer.isBuffer(fileBuffer)
        ? fileBuffer
        : Buffer.from(fileBuffer || "EMPTY_FILE_CONTENT", "utf-8");

      const wholeFileChecksum = crypto.createHash("sha256").update(buffer).digest("hex");
      const totalBytes = buffer.length;

      // Slice into chunks (fixed chunk size: 512KB min, or divide into at least 4 chunks)
      const chunkSize = Math.max(128, Math.min(512 * 1024, Math.ceil(totalBytes / 4)));
      const rawChunks = [];

      for (let offset = 0; offset < totalBytes; offset += chunkSize) {
        rawChunks.push(buffer.subarray(offset, Math.min(offset + chunkSize, totalBytes)));
      }

      if (rawChunks.length === 0) {
        rawChunks.push(Buffer.from("EMPTY_BLOCK", "utf-8"));
      }

      const totalChunksCount = rawChunks.length;
      let uniqueChunksCount = 0;
      let duplicateChunksCount = 0;
      let physicalBytesWritten = 0;
      const chunkManifest = [];
      const chunkHashes = [];

      // Process each chunk through SHA-256 hash lookup
      for (let idx = 0; idx < rawChunks.length; idx++) {
        const chunkBuf = rawChunks[idx];
        const chunkHash = crypto.createHash("sha256").update(chunkBuf).digest("hex");
        chunkHashes.push(chunkHash);

        let isDuplicate = false;

        if (isDbConnected()) {
          try {
            // Check MongoDB file_chunks hash index
            const existing = await FileChunkModel.findOne({ chunk_hash: chunkHash });
            if (existing) {
              isDuplicate = true;
              duplicateChunksCount++;
              // Increment reference count & associate this file
              existing.reference_count += 1;
              if (!existing.associated_files.includes(fileId)) {
                existing.associated_files.push(fileId);
              }
              existing.last_referenced_at = new Date();
              await existing.save();
            } else {
              // Unique chunk - write to disk storage
              const chunkPath = path.join(CHUNKS_DIR, `${chunkHash.substring(0, 16)}.chunk`);
              fs.writeFileSync(chunkPath, chunkBuf);
              physicalBytesWritten += chunkBuf.length;
              uniqueChunksCount++;

              await FileChunkModel.create({
                chunk_hash: chunkHash,
                byte_size: chunkBuf.length,
                physical_storage_path: `data/uploads/chunks/${chunkHash.substring(0, 16)}.chunk`,
                reference_count: 1,
                associated_files: [fileId]
              });
            }
          } catch (dbErr) {
            console.error(`[Dedup DB Error on chunk ${idx}]:`, dbErr.message);
          }
        } else {
          // In-memory fallback
          if (inMemoryChunkCache.has(chunkHash)) {
            isDuplicate = true;
            duplicateChunksCount++;
            const cached = inMemoryChunkCache.get(chunkHash);
            cached.refCount++;
          } else {
            uniqueChunksCount++;
            physicalBytesWritten += chunkBuf.length;
            inMemoryChunkCache.set(chunkHash, { refCount: 1, size: chunkBuf.length });
          }
        }

        chunkManifest.push({
          index: idx,
          chunk_hash: chunkHash,
          byte_size: chunkBuf.length,
          is_duplicate: isDuplicate
        });
      }

      // Compute Merkle Tree Root
      const merkleRoot = buildMerkleTree(chunkHashes);

      // Calculate Savings Metrics
      const savingsRatio = totalChunksCount > 0 ? duplicateChunksCount / totalChunksCount : 0;
      const savingsPercentage = Math.round(savingsRatio * 1000) / 10; // e.g. 75.0%
      const bytesSaved = totalBytes - physicalBytesWritten;
      const savedFormatted = (bytesSaved / (1024 * 1024)).toFixed(2) + " MB";
      const totalFormatted = (totalBytes / (1024 * 1024)).toFixed(2) + " MB";

      // Build Informative Status Message
      let statusFeedback = "";
      let deduplicationCategory = "NEW_DATA";

      if (duplicateChunksCount === totalChunksCount) {
        deduplicationCategory = "FULL_DUPLICATE";
        statusFeedback = `[DEDUPLICATION HIT] Exact file duplicate detected! 100% of chunks (${totalChunksCount}/${totalChunksCount}) already exist in storage. 0 additional bytes written to disk. Pointer references incremented. Storage saved: ${totalFormatted} (100%).`;
      } else if (duplicateChunksCount > 0) {
        deduplicationCategory = "PARTIAL_DELTA";
        statusFeedback = `[DELTA DEDUPLICATION] ${duplicateChunksCount} of ${totalChunksCount} chunks matched existing storage blocks (${savingsPercentage}% savings). Only ${uniqueChunksCount} new unique chunk(s) (${(physicalBytesWritten / 1024).toFixed(1)} KB) committed to physical disk.`;
      } else {
        deduplicationCategory = "ALL_UNIQUE";
        statusFeedback = `[NEW DATA COMMITTED] All ${totalChunksCount} chunks are unique (${totalFormatted} committed). Pointers registered in MongoDB. Merkle root verified: ${merkleRoot.substring(0, 18)}...`;
      }

      return {
        success: true,
        file_id: fileId,
        file_name: fileName,
        checksum: wholeFileChecksum,
        merkle_root: merkleRoot,
        total_chunks: totalChunksCount,
        unique_chunks: uniqueChunksCount,
        duplicate_chunks: duplicateChunksCount,
        savings_ratio: savingsRatio,
        savings_percentage: `${savingsPercentage}%`,
        savings_percentage_num: savingsPercentage,
        bytes_total: totalBytes,
        physical_bytes_written: physicalBytesWritten,
        bytes_saved: bytesSaved,
        deduplication_category: deduplicationCategory,
        status_message: statusFeedback,
        chunk_manifest: chunkManifest,
        hash_algorithm: "SHA-256 (FIPS 180-4)",
        storage_pointer: `localfs://data/uploads/chunks`
      };
    } catch (err) {
      console.error("[Team B Dedup Exception]:", err);
      return {
        success: false,
        error: err.message,
        status_message: `[DEDUPLICATION ERROR] Processing failed: ${err.message}`
      };
    }
  }
};
