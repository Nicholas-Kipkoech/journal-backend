import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { CollectionController } from "../controllers/collectionController";

const collectionRouter = Router();

collectionRouter.post(
  "/add",
  authenticateUser,
  CollectionController.addCollection
);

export default collectionRouter;
