import request from "supertest";
import { AuthService } from "../src/services/authService";
import { server, prisma, app } from "../src/app";
// Mock AuthService methods
jest.mock("../src/services/authService");

beforeEach(() => {
  jest.resetModules(); // Clear cached modules
  jest.clearAllMocks(); // Reset mocks before each test
});

afterAll(async () => {
  if (server) {
    server.close();
  }
  await prisma.$disconnect();
});

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  describe("Register User", () => {
    it("should register a new user and return 201", async () => {
      const mockUser = {
        firstName: "Nicholas",
        lastName: "Kipkoech",
        email: "nickey968@gmail.com",
        password: "123456",
      };
      (AuthService.registerUser as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).post("/api/auth/register").send({
        firstName: "Nicholas",
        lastName: "Kipkoech",
        email: "nickey968@gmail.com",
        password: "123456",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "User registered successfully",
        user: mockUser,
      });
      expect(AuthService.registerUser).toHaveBeenCalledWith({
        firstName: "Nicholas",
        lastName: "Kipkoech",
        email: "nickey968@gmail.com",
        password: "123456",
      });
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "" }); // Invalid input

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe("Login User", () => {
    it("should login user and return 200", async () => {
      const mockLoginResponse = { token: "jwt_token" };
      (AuthService.loginUser as jest.Mock).mockResolvedValue(mockLoginResponse);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLoginResponse);
      expect(AuthService.loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
