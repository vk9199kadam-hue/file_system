import mongoose from "mongoose";

const FileChunkSchema = new mongoose.Schema(
  {
    chunk_hash: { type: String, required: true, unique: true, index: true }, // SHA-256
    byte_size: { type: Number, required: true },
    physical_storage_path: { type: String, required: true }, // Pointer to local physical file on disk
    reference_count: { type: Number, default: 1 }, // Deduplication counter
    associated_files: [{ type: String }], // Array of file_ids referencing this chunk
    first_seen_at: { type: Date, default: Date.now },
    last_referenced_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const FileChunkModel = mongoose.models.FileChunk || mongoose.model("FileChunk", FileChunkSchema, "file_chunks");
