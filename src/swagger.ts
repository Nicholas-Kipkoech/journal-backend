import { config } from "dotenv";
import { Application } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

config();

// Utility function to build the server URL dynamically
const getServerUrl = (): string => {
  const baseUrl = `http://localhost:${process.env.PORT || 8080}`;
  return `${baseUrl}`;
};

// Swagger configuration
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "JOURNAL APP",
      version: "1.0.0",
      description: "Rest API documentation for journal app",
    },
    servers: [
      {
        url: getServerUrl(),
      },
    ],
  },
  apis: ["**/*.ts"],
};

const specs = swaggerJSDoc(options);

// Function to set up Swagger
export function setupSwagger(app: Application): void {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}
