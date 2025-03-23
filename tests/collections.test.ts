import { prisma } from "../prisma/client"; // Adjust path as needed
import { CollectionService } from "../src/services/collectionService";

jest.mock("../prisma/client", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    collection: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("CollectionService", () => {
  const mockUserId = "user-123";
  const mockCollectionId = "col-1";
  const mockCollections = [
    {
      id: "col-1",
      name: "Collection 1",
      userId: mockUserId,
      description: "Desc 1",
    },
    {
      id: "col-2",
      name: "Collection 2",
      userId: mockUserId,
      description: "Desc 2",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should add a new collection when user exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: mockUserId });
    (prisma.collection.create as jest.Mock).mockResolvedValue(
      mockCollections[0]
    );

    const result = await CollectionService.addCollection(mockUserId, {
      name: "test",
      description: "desc 1",
    });

    expect(result).toEqual(mockCollections[0]);
    expect(prisma.collection.create).toHaveBeenCalled();
  });

  test("should return a list of collections", async () => {
    (prisma.collection.findMany as jest.Mock).mockResolvedValue(
      mockCollections
    );

    const result = await CollectionService.getCollections(mockUserId);

    expect(result).toEqual(mockCollections);
    expect(prisma.collection.findMany).toHaveBeenCalledWith({
      where: { userId: mockUserId },
      orderBy: { createdAt: "desc" },
    });
  });
});
