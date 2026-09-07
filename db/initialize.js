import bcrypt from "bcryptjs";

const schemaSql = `
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_admins_email UNIQUE (email),
  CONSTRAINT ck_admins_role CHECK (role = 'admin')
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_students_email UNIQUE (email),
  CONSTRAINT ck_students_role CHECK (role = 'student')
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_categories_name UNIQUE (name)
);
`;

export async function initializeDatabase(pool) {
  await pool.query(schemaSql);
  await seedAdmin(pool);
}

async function seedAdmin(pool) {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  const supplied = [ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD].filter(Boolean).length;

  if (supplied === 0) {
    console.warn(
      "No initial admin configured. Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD to seed one.",
    );
    return;
  }

  if (supplied !== 3) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must all be provided together",
    );
  }

  if (ADMIN_PASSWORD.length < 8) {
    throw new Error("ADMIN_PASSWORD must contain at least 8 characters");
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await pool.query("SELECT id FROM admins WHERE email = $1", [
    email,
  ]);

  if (existing.rows.length > 0) return;

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await pool.query(
    `
      INSERT INTO admins (role, name, email, password_hash)
      VALUES ('admin', $1, $2, $3)
    `,
    [ADMIN_NAME.trim(), email, passwordHash],
  );

  console.log(`Initial admin created: ${email}`);
}
