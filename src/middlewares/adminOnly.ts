import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../config/db/mongoClient";

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  const decoded = req.user;
  const db = await connectDB();
  
  const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado. Solo administradores.",
    });
  }

  next();
};