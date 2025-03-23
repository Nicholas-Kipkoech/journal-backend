import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { CollectionController } from "../controllers/collectionController";

const collectionRouter = Router();

/**
 * @openapi
 * '/collections':
 *  post:
 *     tags:
 *     - Collections Management
 *     summary: add new collection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fetched
 *       409:
 *         description: Conflict
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

collectionRouter.post(
  "/",
  authenticateUser,
  CollectionController.addCollection
);

/**
 * @openapi
 * '/collections':
 *  get:
 *     tags:
 *     - Collections Management
 *     summary: get all collections
 *     security:
 *       - bearerAuth: []  # 👈 This enables Bearer Token authentication in Swagger
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, token expired or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */

collectionRouter.get(
  "/",
  authenticateUser,
  CollectionController.getCollections
);

/**
 * @openapi
 * '/collections/{collectionId}':
 *  delete:
 *     tags:
 *     - Collections Management
 *     summary: Delete a collection
 *     security:
 *       - bearerAuth: []  # Enables Bearer Token authentication
 *     parameters:
 *       - in: path
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the collection to be deleted
 *     responses:
 *       200:
 *         description: Collection deleted successfully
 *       400:
 *         description: Bad request, missing collection ID
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, token expired or invalid
 *       404:
 *         description: Collection not found
 *       500:
 *         description: Server error
 */

collectionRouter.delete(
  "/:collectionId",
  authenticateUser,
  CollectionController.deleteCollection
);

export default collectionRouter;
