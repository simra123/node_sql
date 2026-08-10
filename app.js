import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { fileURLToPath } from "node:url";
import { connectDb } from "./db/connect.js";
import { initializeDatabase } from "./db/initialize.js";
import { validateJwtEnv } from "./lib/auth.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/students.js";

export function buildApp() {
  const app = Fastify({ logger: true });

  const configuredOrigins = process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.register(cors, {
    origin: configuredOrigins?.length ? configuredOrigins : "*",
  });

  app.get("/", async () => ({ message: "Student API is running" }));
  app.register(authRoutes, { prefix: "/api/auth" });
  app.register(studentRoutes, { prefix: "/api/students" });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error.number === 2601 || error.number === 2627) {
      return reply.code(409).send({ message: "Email is already in use" });
    }

    return reply.code(500).send({ message: "Internal server error" });
  });

  return app;
}

async function start() {
  try {
    validateJwtEnv();
    const pool = await connectDb();
    await initializeDatabase(pool);

    const app = buildApp();
    const port = Number(process.env.PORT || 4000);
    const host = process.env.HOST || "127.0.0.1";
    await app.listen({ port, host });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  start();
}
