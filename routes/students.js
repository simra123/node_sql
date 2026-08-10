import bcrypt from "bcryptjs";
import { getPool, sql } from "../db/connect.js";
import { requireRole } from "../lib/auth.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStudent(body) {
  if (!body || body.role !== "student") return "Role must be student";
  if (typeof body.name !== "string" || !body.name.trim())
    return "Name is required";
  if (body.name.trim().length > 100) return "Name cannot exceed 100 characters";
  if (typeof body.email !== "string" || !emailPattern.test(body.email)) {
    return "A valid email is required";
  }
  if (typeof body.password !== "string" || body.password.length < 8) {
    return "Password must contain at least 8 characters";
  }
  if (typeof body.department !== "string" || !body.department.trim()) {
    return "Department is required";
  }
  if (body.department.trim().length > 100) {
    return "Department cannot exceed 100 characters";
  }
}

export default async function studentRoutes(fastify) {
  fastify.post(
    "/",
    { preHandler: requireRole("admin") },
    async (request, reply) => {
      const validationError = validateStudent(request.body);
      if (validationError) {
        return reply.code(400).send({ message: validationError });
      }

      const { name, email, password, department } = request.body;
      const normalizedEmail = email.trim().toLowerCase();
      const pool = getPool();

      const duplicate = await pool
        .request()
        .input("email", sql.NVarChar(255), normalizedEmail)
        .query("SELECT Id FROM dbo.Students WHERE Email = @email");

      if (duplicate.recordset.length > 0) {
        return reply.code(409).send({ message: "Email is already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const result = await pool
        .request()
        .input("name", sql.NVarChar(100), name.trim())
        .input("email", sql.NVarChar(255), normalizedEmail)
        .input("passwordHash", sql.NVarChar(255), passwordHash)
        .input("department", sql.NVarChar(100), department.trim()).query(`
          INSERT INTO dbo.Students ([Role], Name, Email, PasswordHash, Department)
          OUTPUT INSERTED.Id, INSERTED.[Role], INSERTED.Name,
                 INSERTED.Email, INSERTED.Department, INSERTED.CreatedAt
          VALUES (N'student', @name, @email, @passwordHash, @department)
        `);

      return reply.code(201).send({ student: result.recordset[0] });
    },
  );
}
