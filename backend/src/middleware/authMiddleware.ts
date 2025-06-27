import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Access token is required",
      });
      return;
    }

    const decoded = verifyToken(token) as any;
    (req as any).user = decoded.data;

    next();
  } catch (error: any) {
    res.status(403).json({
      success: false,
      error: 'Invalid token'
    });
    return;
  }
};