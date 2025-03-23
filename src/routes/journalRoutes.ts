import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { JournalController } from "../controllers/journalController";
import { journalValidation } from "../validations/journalValidation";

const journalRouter = Router();

/**
 * @openapi
 * '/journals':
 *  post:
 *     tags:
 *     - Journals management
 *     summary: Add a new journal entry
 *     security:
 *       - bearerAuth: []  # Requires Bearer Token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Journal entry created successfully
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Server error
 */

journalRouter.post(
  "/",
  authenticateUser,
  journalValidation,
  JournalController.addJournal
);

/**
 * @openapi
 * '/journals':
 *  get:
 *     tags:
 *     - Journals management
 *     summary: get all journals
 *     security:
 *       - bearerAuth: []  # 👈 This enables Bearer Token authentication in Swagger
 *     responses:
 *       200:
 *         description: Successfully fetched all entries
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, token expired or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */

journalRouter.get(
  "/",
  authenticateUser,
  JournalController.getAllJournalEntries
);
/**
 * @openapi
 * '/collections/{journalId}':
 *  get:
 *     tags:
 *     - Journals management
 *     summary: get a journal by id
 *     security:
 *       - bearerAuth: []  # Enables Bearer Token authentication
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journal fetched successfully
 *       400:
 *         description: Bad request, missing journal ID
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, token expired or invalid
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */

journalRouter.get(
  "/:journalId",
  authenticateUser,
  JournalController.getJournalEntryById
);

/**
 * @openapi
 * '/journals/{journalId}':
 *  delete:
 *     tags:
 *     - Journals management
 *     summary: delete a journal by id
 *     security:
 *       - bearerAuth: []  # Enables Bearer Token authentication
 *     parameters:
 *       - in: path
 *         name: journalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Journal deleted successfully
 *       400:
 *         description: Bad request, missing journal ID
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, token expired or invalid
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */
journalRouter.delete(
  "/:journalId",
  authenticateUser,
  JournalController.deleteJournalEntry
);
/**
 * @openapi
 * '/journals/{journalId}':
 *  patch:
 *     tags:
 *     - Journals management
 *     summary: update journal
 *     security:
 *       - bearerAuth: []  # 👈 This enables Bearer Token authentication in Swagger
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               title:
 *                 type: string
 *
 *               content:
 *                 type: string
 *
 *
 *
 *     responses:
 *       200:
 *         description: updated
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
journalRouter.patch(
  "/:journalId",
  authenticateUser,
  JournalController.updateJournalEntry
);
export default journalRouter;
