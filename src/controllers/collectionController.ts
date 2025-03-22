import { validationResult } from "express-validator";
import { CollectionDto, CustomRequest } from "../shared";
import { Response } from "express";
import { CollectionService } from "../services/collectionService";

export class CollectionController {
  // create new collection or category
  static async addCollection(req: CustomRequest, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() });
    try {
      const collectionData: CollectionDto = req.body;
      const collection = await CollectionService.addCollection(
        req.user.id,
        collectionData
      );
      res
        .status(200)
        .json({ message: "collection created successfully", collection });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error.message });
    }
  }
  // Fetch all user collections
  static async getCollections(req: CustomRequest, res: Response) {
    try {
      const collections = await CollectionService.getCollections(req.user.id);
      res.status(200).json(collections);
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Delete user collections based on collection id
  static async deleteCollection(req: CustomRequest, res: Response) {
    try {
      const { collectionId }: string | any = req.query;
      if (!collectionId) {
        res.status(400).json({ message: "Collection ID is required!!" });
      }
      await CollectionService.deleteCollection(req.user.id, collectionId);
      res.status(200).json({ message: "collection deleted successfully" });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ error: error.message });
    }
  }
}
