import mongoose from "mongoose";

const WorkerNodeSchema = new mongoose.Schema(
  {
    worker_id: { type: String, required: true, unique: true, index: true },
    node_name: { type: String, required: true },
    host: { type: String, default: "127.0.0.1" },
    port: { type: Number, required: true },
    status: { type: String, enum: ["ACTIVE", "IDLE", "BUSY", "OFFLINE"], default: "ACTIVE" },
    current_task: { type: String, default: "Awaiting Next Chunk Dispatch" },
    assigned_chunks: { type: Number, default: 0 },
    active_jobs: { type: Number, default: 0 },
    cpu_usage: { type: String, default: "25%" },
    cpu_usage_pct: { type: Number, default: 25 },
    memory_usage: { type: String, default: "350 MB" },
    memory_usage_mb: { type: Number, default: 350 },
    weight_capacity: { type: Number, default: 1.0 }, // Dynamic weighting factor
    total_processed_chunks: { type: Number, default: 0 },
    round_robin_slot: { type: Number, default: 0 },
    last_heartbeat: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const WorkerNodeModel = mongoose.models.WorkerNode || mongoose.model("WorkerNode", WorkerNodeSchema, "worker_nodes");
