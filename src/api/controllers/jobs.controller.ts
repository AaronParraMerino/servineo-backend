import { Request, Response } from "express"
import { Job } from '../../models/jobs.model';
import { User } from '../../models/user.model';

import { Offer } from '../../models/offer.model';

export async function createJobController(req: Request, res: Response) {
  try {
    const job = await Job.create(req.body);
    res.status(200).json(job);
  } catch (error) {
    console.log('Error to create Job:', error);
    res.status(500).json({ error: 'Error creating Job' });
  }
}

export async function getJobs(req: Request, res: Response) {
  try {
    const jobs = await Job.find({});
    res.status(200).json(jobs);
  } catch (error) {
    console.log('Error to get Jobs:', error);
    res.status(500).json({ error: 'Error getting Jobs' });
  }
}

// Nuevo: obtener lista de trabajos (servicios) con sus fixers asociados
// No devuelve ofertas, sino personas (fixers) agrupadas por servicio
export async function getJobsWithFixers(_req: Request, res: Response) {
  try {
    // 1. Obtener todos los usuarios que son fixers y tienen fixerProfile
    const fixers = await User.find({ role: 'fixer', fixerProfile: { $exists: true } }).lean();

    // 2. Construir conjunto de servicios distintos
    const serviceSet = new Set<string>();
    for (const fixer of fixers) {
      const services = (fixer as any).fixerProfile?.services as string[] | undefined;
      if (Array.isArray(services)) {
        for (const service of services) {
          if (service) {
            serviceSet.add(service);
          }
        }
      }
    }

    // 3. Para cada servicio, obtener los fixers que lo ofrecen
    const jobsWithFixers = Array.from(serviceSet).map((service) => {
      const fixersForService = fixers
        .filter((fixer) => (fixer as any).fixerProfile?.services?.includes(service))
        .map((fixer) => ({
          id: (fixer as any)._id.toString(),
          name: fixer.name,
          city: '', // se puede rellenar más adelante si agregas ciudad al modelo
          rating: 0, // placeholder hasta tener sistema de reseñas
          avatar: (fixer as any).fixerProfile?.photoUrl || undefined,
        }));

      return {
        jobType: service,
        fixers: fixersForService,
      };
    });

    return res.status(200).json({
      success: true,
      data: jobsWithFixers,
    });
  } catch (error: any) {
    console.log('Error to get JobsWithFixers:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error getting Jobs with Fixers',
    });
  }
}

export async function getJob(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.log('Error to get Job:', error);
    res.status(500).json({ error: 'Error getting Job' });
  }
}

export async function updateJob(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const job = await Job.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.log('Error to update Job:', error);
    res.status(500).json({ error: 'Error updating Job' });
  }
}

export async function deleteJob(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ message: 'Job deleted successfully', job });
  } catch (error) {
    console.log('Error to delete Job:', error);
    res.status(500).json({ error: 'Error deleting Job' });
  }
}

export const listJobs = async (req: Request, res: Response) => {
  try {
    const {
      sortBy = "recent",
      page = "1",
      limit = "10",
      search = "",
      category,
    } = req.query as {
      sortBy?: string;
      page?: string;
      limit?: string;
      search?: string;
      category?: string;
    };

    const pageNum = Math.max(parseInt(page || "1", 10), 1);
    const limitNum = Math.max(parseInt(limit || "10", 10), 1);

    const query: any = {};

    // Filtro de búsqueda básico por título/descripcion
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Si tu modelo tiene campo category, filtramos
    if (category && category !== "Todos") {
      query.category = category;
    }

    const sort: any = {};
    if (sortBy === "recent") {
      sort.createdAt = -1;
    } else if (sortBy === "oldest") {
      sort.createdAt = 1;
    }

    // Cambia Offer por Job si corresponde
    const [items, total] = await Promise.all([
      Offer.find(query)
        .sort(sort)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Offer.countDocuments(query),
    ]);

    return res.json({
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err: any) {
    console.error("❌ Error listando jobs:", err);
    return res.status(500).json({
      message: "Error al obtener ofertas de trabajo",
      error: err.message,
    });
  }
};

// Si ya tienes getOfferById en este archivo, déjalo como está.
// Si no, algo así:
export const getOfferById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    return res.json(offer);
  } catch (err: any) {
    console.error("❌ Error obteniendo oferta:", err);
    return res.status(500).json({
      message: "Error al obtener oferta",
      error: err.message,
    });
  }
};
