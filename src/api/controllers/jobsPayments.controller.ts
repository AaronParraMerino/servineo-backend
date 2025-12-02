import { Request, Response } from "express";
import Job from "../../models/jobPayment.model";
import { User } from "../../models/userPayment.model";

// =========================
// Listar trabajos de usuario (solo requester)
// =========================
export const listJobs = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { userId } = req.query;
    console.log("🟦 [listJobs] Iniciando búsqueda de trabajos...");
    console.log("🔹 Parámetro recibido userId:", userId);

    // 1️⃣ Validar que el userId esté presente
    if (!userId || typeof userId !== "string") {
      console.warn("⚠️ No se envió el parámetro userId");
      return res.status(400).json({ error: "Falta el parámetro userId" });
    }

    // 2️⃣ Verificar que el usuario exista y sea requester
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`⚠️ Usuario con ID ${userId} no encontrado`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (user.role !== "requester") {
      console.warn(`⚠️ Usuario ${userId} no tiene rol 'requester'`);
      return res
        .status(403)
        .json({ error: "Usuario no autorizado para ver trabajos" });
    }

    // 3️⃣ Buscar trabajos del requester
    console.log(`🔍 Buscando trabajos para requesterId: ${userId}`);
    const job = await Job.find({ requesterId: userId });

    // 4️⃣ Si no hay trabajos, devolver mensaje
    if (!job || job.length === 0) {
      console.log("📭 No se encontraron trabajos para este usuario");
      return res
        .status(404)
        .json({ message: "No se encontraron trabajos para este usuario" });
    }

    console.log(
      `📦 ${job.length} trabajo(s) encontrado(s) para el usuario ${user.name}`
    );

    // 5️⃣ Retornar los trabajos encontrados
    return res.json(job);
  } catch (error: any) {
    console.error("🔥 Error listJobs:", error);
    return res.status(500).json({ error: error.message });
  }
};
