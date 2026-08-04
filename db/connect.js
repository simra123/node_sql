import sql from "mssql";

const requiredDatabaseEnv = ["DB_NAME", "DB_USER", "DB_PASSWORD"];

export function validateDatabaseEnv() {
  const missing = requiredDatabaseEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
}

const databaseConfig = () => ({
  server: process.env.DB_SERVER || "127.0.0.1",
  port: Number(process.env.DB_PORT || 57200),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT !== "false",
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
});

let pool;

export async function connectDb() {
  validateDatabaseEnv();
  pool = await new sql.ConnectionPool(databaseConfig()).connect();
  return pool;
}

export function getPool() {
  if (!pool) {
    throw new Error("The SQL Server connection has not been initialized");
  }

  return pool;
}

export { sql };
