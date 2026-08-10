import bcrypt from "bcryptjs";
import { sql } from "./connect.js";

const schemaSql = `
IF OBJECT_ID(N'dbo.Admins', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Admins (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Role] NVARCHAR(20) NOT NULL CONSTRAINT DF_Admins_Role DEFAULT N'admin',
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Admins_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Admins_Email UNIQUE (Email),
    CONSTRAINT CK_Admins_Role CHECK ([Role] = N'admin')
  );
END;

IF OBJECT_ID(N'dbo.Students', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Students (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [Role] NVARCHAR(20) NOT NULL CONSTRAINT DF_Students_Role DEFAULT N'student',
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Department NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Students_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Students_Email UNIQUE (Email),
    CONSTRAINT CK_Students_Role CHECK ([Role] = N'student')
  );
END;

IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Categories (
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_Categories_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Categories_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Categories_Name UNIQUE (Name)
  );
END;
`;

export async function initializeDatabase(pool) {
  await pool.request().batch(schemaSql);
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
  const existing = await pool
    .request()
    .input("email", sql.NVarChar(255), email)
    .query("SELECT Id FROM dbo.Admins WHERE Email = @email");

  if (existing.recordset.length > 0) return;

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await pool
    .request()
    .input("name", sql.NVarChar(100), ADMIN_NAME.trim())
    .input("email", sql.NVarChar(255), email)
    .input("passwordHash", sql.NVarChar(255), passwordHash)
    .query(`
      INSERT INTO dbo.Admins ([Role], Name, Email, PasswordHash)
      VALUES (N'admin', @name, @email, @passwordHash)
    `);

  console.log(`Initial admin created: ${email}`);
}
