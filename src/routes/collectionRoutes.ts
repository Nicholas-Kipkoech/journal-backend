import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { CollectionController } from "../controllers/collectionController";

const collectionRouter = Router();

collectionRouter.post(
  "/",
  authenticateUser,
  CollectionController.addCollection
);

collectionRouter.get(
  "/",
  authenticateUser,
  CollectionController.getCollections
);

export default collectionRouter;
