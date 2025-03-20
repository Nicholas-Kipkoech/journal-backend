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
journalRouter.get(
  "/",
  authenticateUser,
  JournalController.getAllJournalEntries
);

//journalId
journalRouter.get(
  "/:journalId",
  authenticateUser,
  JournalController.getJournalEntryById
);

journalRouter.delete(
  "/:journalId",
  authenticateUser,
  JournalController.deleteJournalEntry
);
export default journalRouter;
