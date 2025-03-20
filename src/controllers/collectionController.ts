import { validationResult } from "express-validator";
import { CollectionDto, CustomRequest } from "../shared";
import { Response } from "express";
import { CollectionService } from "../services/collectionService";

export class CollectionController {
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
}
