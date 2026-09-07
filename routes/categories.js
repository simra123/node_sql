import { getPool } from "../db/connect.js";
import { requireRole } from "../lib/auth.js";

const adminOnly = { preHandler: requireRole("admin") };

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateCategory(body) {
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return "Name is required";
  }

  if (body.name.trim().length > 100) {
    return "Name cannot exceed 100 characters";
  }

  if (
    body.description !== undefined &&
    body.description !== null &&
    typeof body.description !== "string"
  ) {
    return "Description must be a string or null";
  }

  if (typeof body.description === "string" && body.description.trim().length > 500) {
    return "Description cannot exceed 500 characters";
  }
}

function categoryValues(body) {
  return {
    name: body.name.trim(),
    description:
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null,
  };
}

async function categoryNameExists(pool, name, excludedId) {
  const values = [name];
  let query = "SELECT id FROM categories WHERE name = $1";

  if (excludedId !== undefined) {
    values.push(excludedId);
    query += " AND id <> $2";
  }

  const result = await pool.query(query, values);
  return result.rows.length > 0;
}

export default async function categoryRoutes(fastify) {
  fastify.post("/", adminOnly, async (request, reply) => {
    const validationError = validateCategory(request.body);
    if (validationError) {
      return reply.code(400).send({ message: validationError });
    }

    const { name, description } = categoryValues(request.body);
    const pool = getPool();

    if (await categoryNameExists(pool, name)) {
      return reply.code(409).send({ message: "Category name is already in use" });
    }

    const result = await pool.query(
      `
        INSERT INTO categories (name, description)
        VALUES ($1, $2)
        RETURNING id AS "Id", name AS "Name", description AS "Description",
                  created_at AS "CreatedAt", updated_at AS "UpdatedAt"
      `,
      [name, description],
    );

    return reply.code(201).send({ category: result.rows[0] });
  });

  fastify.get("/", adminOnly, async () => {
    const result = await getPool().query(`
      SELECT id AS "Id", name AS "Name", description AS "Description",
             created_at AS "CreatedAt", updated_at AS "UpdatedAt"
      FROM categories
      ORDER BY name ASC
    `);

    return { categories: result.rows };
  });

  fastify.get("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply.code(400).send({ message: "Category id must be a positive integer" });
    }

    const result = await getPool().query(
      `
        SELECT id AS "Id", name AS "Name", description AS "Description",
               created_at AS "CreatedAt", updated_at AS "UpdatedAt"
        FROM categories
        WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "Category not found" });
    }

    return { category: result.rows[0] };
  });

  fastify.put("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply.code(400).send({ message: "Category id must be a positive integer" });
    }

    const validationError = validateCategory(request.body);
    if (validationError) {
      return reply.code(400).send({ message: validationError });
    }

    const { name, description } = categoryValues(request.body);
    const pool = getPool();

    if (await categoryNameExists(pool, name, id)) {
      return reply.code(409).send({ message: "Category name is already in use" });
    }

    const result = await pool.query(
      `
        UPDATE categories
        SET name = $2,
            description = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id AS "Id", name AS "Name", description AS "Description",
                  created_at AS "CreatedAt", updated_at AS "UpdatedAt"
      `,
      [id, name, description],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "Category not found" });
    }

    return { category: result.rows[0] };
  });

  fastify.delete("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply.code(400).send({ message: "Category id must be a positive integer" });
    }

    const result = await getPool().query(
      "DELETE FROM categories WHERE id = $1 RETURNING id AS \"Id\"",
      [id],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "Category not found" });
    }

    return { message: "Category deleted" };
  });
}
