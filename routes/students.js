import bcrypt from "bcryptjs";
import { getPool } from "../db/connect.js";
import { requireRole } from "../lib/auth.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const adminOnly = { preHandler: requireRole("admin") };

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

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
  fastify.post("/", adminOnly, async (request, reply) => {
    const validationError = validateStudent(request.body);
    if (validationError) {
      return reply.code(400).send({ message: validationError });
    }

    const { name, email, password, department } = request.body;
    const normalizedEmail = email.trim().toLowerCase();
    const pool = getPool();

    const duplicate = await pool.query(
      "SELECT id FROM students WHERE email = $1",
      [normalizedEmail],
    );

    if (duplicate.rows.length > 0) {
      return reply.code(409).send({ message: "Email is already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `
          INSERT INTO students (role, name, email, password_hash, department)
          VALUES ('student', $1, $2, $3, $4)
          RETURNING id AS "Id", role AS "Role", name AS "Name",
                    email AS "Email", department AS "Department",
                    created_at AS "CreatedAt"
        `,
      [name.trim(), normalizedEmail, passwordHash, department.trim()],
    );

    return reply.code(201).send({ student: result.rows[0] });
  });

  fastify.get("/", adminOnly, async () => {
    const result = await getPool().query(`
      SELECT id AS "Id", role AS "Role", name AS "Name",
             email AS "Email", department AS "Department",
             created_at AS "CreatedAt"
      FROM students
      ORDER BY created_at DESC, id DESC
    `);

    return { students: result.rows };
  });

  fastify.delete("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply.code(400).send({
        message: "Student id must be a positive integer",
      });
    }

    const result = await getPool().query(
      'DELETE FROM students WHERE id = $1 RETURNING id AS "Id"',
      [id],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "Student not found" });
    }

    return { message: "Student deleted" };
  });
}
