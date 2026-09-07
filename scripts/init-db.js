import "dotenv/config";
import { connectDb } from "../db/connect.js";
import { initializeDatabase } from "../db/initialize.js";

let pool;

try {
  pool = await connectDb();
  await initializeDatabase(pool);
  console.log("Admins and Students tables are ready.");
} catch (error) {
  console.error(`Database initialization failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool?.end();
}
