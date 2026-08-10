import bcrypt from "bcryptjs";
import { getPool, sql } from "../db/connect.js";
import { createToken } from "../lib/auth.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(body) {
  console.log(body.email, typeof body.email);
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

  const result = await getPool()
    .request()
    .input("email", sql.NVarChar(255), body.email.trim().toLowerCase()).query(`
      SELECT Id, [Role], Name, Email, PasswordHash
      FROM dbo.${table}
      WHERE Email = @email AND [Role] = N'${expectedRole}'
    `);

  const user = result.recordset[0];
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
    login(reply, request.body, "Admins", "admin"),
  );

  fastify.post("/student/login", async (request, reply) =>
    login(reply, request.body, "Students", "student"),
  );
}
