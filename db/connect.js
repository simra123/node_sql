import pg from "pg";

const { Pool } = pg;
const requiredDatabaseEnv = ["CON_STRING"];

export function validateDatabaseEnv() {
  const missing = requiredDatabaseEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

let pool;

export async function connectDb() {
  validateDatabaseEnv();

  pool = new Pool({
    connectionString: process.env.CON_STRING,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    max: 10,
  });

  try {
    await pool.query("SELECT 1");
  } catch (error) {
    await pool.end().catch(() => {});
    pool = undefined;
    throw error;
  }

  return pool;
}

export function getPool() {
  if (!pool) {
    throw new Error("The Neon database connection has not been initialized");
  }

  return pool;
}
