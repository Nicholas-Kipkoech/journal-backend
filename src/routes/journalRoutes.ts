import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { JournalController } from "../controllers/journalController";
import { journalValidation } from "../validations/journalValidation";

const journalRouter = Router();

journalRouter.post(
  "/",
  authenticateUser,
  journalValidation,
  JournalController.addJournal
);

export default journalRouter;
