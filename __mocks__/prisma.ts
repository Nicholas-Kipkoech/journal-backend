export const prisma = {
  user: {
    findUnique: jest.fn(),
  },
  collection: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};
