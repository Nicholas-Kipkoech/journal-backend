// This is a class dedicated for collection/categories crud operations

import { prisma } from "../../prisma/client";
import { CollectionDto } from "../shared";

export class CollectionService {
  static async addCollection(userId: string, collection: CollectionDto) {
    // check for user
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }
    // create a collection for a logged in user
    const newCollection = await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        userId: user.id,
      },
    });
    return newCollection;
  }
  /**
   *
   * @param userId logged in user id
   * @returns all collections
   */
  static async getCollections(userId: string) {
    const collections = await prisma.collection.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
    return collections;
  }
  /**
   * Delete collection
   */

  static async deleteCollection(userId: string, collectionId: string) {
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId, userId: userId },
    });
    if (!collection) throw new Error("Collection not found");

    // otherwise delete the collection

    await prisma.collection.delete({ where: { id: collectionId } });
  }
}
