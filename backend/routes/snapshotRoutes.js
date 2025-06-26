// routes/snapshotRoutes.js
import express from "express";
import { runSnapshotJob } from "../controllers/snapshotController.js";

const router = express.Router();

router.post("/run", (req, res) => {
  const secret = req.headers["x-snapshot-secret"];
  if (secret !== process.env.SNAPSHOT_SECRET) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  runSnapshotJob(req, res);
});

export default router;