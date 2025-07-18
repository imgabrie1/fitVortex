import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../errors";

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export const ensureUserIsAuthenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token faltando", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, process.env.SECRET_KEY!) as TokenPayload;

    (req as any).user = { id: decoded.sub };

    return next();
  } catch {
    throw new AppError("Token inválido", 401);
  }
};

export default ensureUserIsAuthenticatedMiddleware