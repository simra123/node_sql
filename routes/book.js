import { getPool } from "../db/connect.js";
import { requireRole } from "../lib/auth.js";

const adminOnly = { preHandler: requireRole("admin") };

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateBook(body) {
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return "title is required";
  }

  if (body.title.trim().length > 100) {
    return "Title cannot exceed 100 characters";
  }

  if (
    body.author !== undefined &&
    body.author !== null &&
    typeof body.author !== "string"
  ) {
    return "author must be a string or null";
  }

  if (typeof body.author === "string" && body.author.trim().length > 500) {
    return "author cannot exceed 500 characters";
  }
}

function bookValues(body) {
  return {
    title: body.title.trim(),
    author:
      typeof body.author === "string" && body.author.trim()
        ? body.author.trim()
        : null,
    category_id: body.category_id,
    quantity: body.quantity,
    available: body.available,
  };
}

async function bookTitleExists(pool, title, excludedId) {
  const values = [title];
  let query = "SELECT id FROM books WHERE title = $1";

  if (excludedId !== undefined) {
    values.push(excludedId);
    query += " AND id <> $2";
  }

  const result = await pool.query(query, values);
  return result.rows.length > 0;
}

export default async function bookRoutes(fastify) {
  fastify.post("/", adminOnly, async (request, reply) => {
    const validationError = validateBook(request.body);
    if (validationError) {
      return reply.code(400).send({ message: validationError });
    }

    const { title, author, category_id, quantity, available } = bookValues(
      request.body,
    );
    const pool = getPool();

    if (await bookTitleExists(pool, title)) {
      return reply.code(409).send({ message: "Book title is already in use" });
    }

    const result = await pool.query(
      `
        INSERT INTO books (title, author, category_id, quantity, available)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id AS "Id", title AS "Title", author AS "Author", category_id AS "CategoryId", quantity AS "Quantity", available AS "Available",
                  created_at AS "CreatedAt", updated_at AS "UpdatedAt"
      `,
      [title, author, category_id, quantity, available],
    );

    return reply.code(201).send({ book: result.rows[0] });
  });

  fastify.get("/", adminOnly, async () => {
    const result = await getPool().query(`
      SELECT id AS "Id", title AS "Title", author AS "Author", category_id AS "CategoryId", quantity AS "Quantity", available AS "Available",
             created_at AS "CreatedAt", updated_at AS "UpdatedAt"
      FROM books
      ORDER BY title ASC
    `);

    return { books: result.rows };
  });

  fastify.get("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply
        .code(400)
        .send({ message: "Book id must be a positive integer" });
    }

    const result = await getPool().query(
      `
        SELECT id AS "Id", title AS "Title", description AS "Description",
               created_at AS "CreatedAt", updated_at AS "UpdatedAt"
        FROM books
        WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "Books not found" });
    }

    return { book: result.rows[0] };
  });

  fastify.put("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply
        .code(400)
        .send({ message: "Book id must be a positive integer" });
    }

    const validationError = validateBook(request.body);
    if (validationError) {
      return reply.code(400).send({ message: validationError });
    }

    const { title, author, category_id, quantity, available } = bookValues(
      request.body,
    );
    const pool = getPool();

    if (await bookTitleExists(pool, title, id)) {
      return reply.code(409).send({ message: "Book title is already in use" });
    }

    const result = await pool.query(
      `
        UPDATE books
        SET title = $2,
            author = $3,
            category_id = $4,
            quantity = $5,
            available = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id AS "Id", title AS "Title", author AS "Author", category_id AS "CategoryId", quantity AS "Quantity", available AS "Available",
                  created_at AS "CreatedAt", updated_at AS "UpdatedAt"
      `,
      [id, title, author, category_id, quantity, available],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "Book not found" });
    }

    return { book: result.rows[0] };
  });

  fastify.delete("/:id", adminOnly, async (request, reply) => {
    const id = parseId(request.params.id);
    if (!id) {
      return reply
        .code(400)
        .send({ message: "Book id must be a positive integer" });
    }

    const result = await getPool().query(
      'DELETE FROM books WHERE id = $1 RETURNING id AS "Id"',
      [id],
    );

    if (result.rows.length === 0) {
      return reply.code(404).send({ message: "Book not found" });
    }

    return { message: "Book deleted" };
  });
}
