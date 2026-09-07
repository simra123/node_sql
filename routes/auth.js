import bcrypt from "bcryptjs";
import { getPool } from "../db/connect.js";
import { createToken } from "../lib/auth.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(body) {
  if (!body || typeof body.email !== "string") {
    return "A valid email is required";
  }

  if (typeof body.password !== "string" || body.password.length === 0) {
    return "Password is required";
  }
}

async function login(reply, body, table, expectedRole) {
  const validationError = validateLogin(body);
  if (validationError) {
    return reply.code(400).send({ message: validationError });
  }

  const result = await getPool().query(
    `
      SELECT id AS "Id", role AS "Role", name AS "Name", email AS "Email",
             password_hash AS "PasswordHash"
      FROM ${table}
      WHERE email = $1 AND role = $2
    `,
    [body.email.trim().toLowerCase(), expectedRole],
  );

  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(body.password, user.PasswordHash))) {
    return reply.code(401).send({ message: "Invalid email or password" });
  }

  return reply.send({
    user: {
      id: user.Id,
      role: user.Role,
      name: user.Name,
      email: user.Email,
    },
    token: createToken(user),
  });
}

export default async function authRoutes(fastify) {
  fastify.post("/admin/login", async (request, reply) =>
    login(reply, request.body, "admins", "admin"),
  );

  fastify.post("/student/login", async (request, reply) =>
    login(reply, request.body, "students", "student"),
  );
}
