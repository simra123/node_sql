import jwt from "jsonwebtoken";

export function validateJwtEnv() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
}

export function createToken(user) {
  return jwt.sign(
    {
      sub: String(user.Id),
      role: user.Role,
      name: user.Name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
  );
}

export function requireRole(role) {
  return async function authorize(request, reply) {
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return reply.code(401).send({ message: "Bearer token is required" });
    }

    try {
      const payload = jwt.verify(
        authorization.slice("Bearer ".length),
        process.env.JWT_SECRET,
      );

      if (payload.role !== role) {
        return reply.code(403).send({ message: `${role} access is required` });
      }

      request.user = payload;
    } catch {
      return reply.code(401).send({ message: "Token is invalid or expired" });
    }
  };
}
