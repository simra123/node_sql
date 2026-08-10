import { getPool, sql } from "../db/connect.js";
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
  const request = pool.request().input("name", sql.NVarChar(100), name);
  let query = "SELECT Id FROM dbo.Categories WHERE Name = @name";

  if (excludedId !== undefined) {
    request.input("excludedId", sql.Int, excludedId);
    query += " AND Id <> @excludedId";
  }

  const result = await request.query(query);
  return result.recordset.length > 0;
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

    const result = await pool
      .request()
      .input("name", sql.NVarChar(100), name)
      .input("description", sql.NVarChar(500), description).query(`
        INSERT INTO dbo.Categories (Name, Description)
        OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Description,
               INSERTED.CreatedAt, INSERTED.UpdatedAt
        VALUES (@name, @description)
      `);

    return reply.code(201).send({ category: result.recordset[0] });
  });

  fastify.get("/", adminOnly, async () => {
    const result = await getPool().request().query(`
      SELECT Id, Name, Description, CreatedAt, UpdatedAt
      FROM dbo.Categories
      ORDER BY Name ASC
    `);

    return { categories: result.recordset };
  });

  fastify.get("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply.code(400).send({ message: "Category id must be a positive integer" });
    }

    const result = await getPool()
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT Id, Name, Description, CreatedAt, UpdatedAt
        FROM dbo.Categories
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return reply.code(404).send({ message: "Category not found" });
    }

    return { category: result.recordset[0] };
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

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar(100), name)
      .input("description", sql.NVarChar(500), description).query(`
        UPDATE dbo.Categories
        SET Name = @name,
            Description = @description,
            UpdatedAt = SYSUTCDATETIME()
        OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Description,
               INSERTED.CreatedAt, INSERTED.UpdatedAt
        WHERE Id = @id
      `);

    if (result.recordset.length === 0) {
      return reply.code(404).send({ message: "Category not found" });
    }

    return { category: result.recordset[0] };
  });

  fastify.delete("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply.code(400).send({ message: "Category id must be a positive integer" });
    }

    const result = await getPool()
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM dbo.Categories OUTPUT DELETED.Id WHERE Id = @id");

    if (result.recordset.length === 0) {
      return reply.code(404).send({ message: "Category not found" });
    }

    return { message: "Category deleted" };
  });
}
