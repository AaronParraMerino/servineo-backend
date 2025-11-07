// backend/src/features/faq/services/faq.service.ts
import { FAQModel, IFAQDocument } from '../models/faq.model';
import { FAQQueryParams, FAQCategoria } from '../types/faq.types';

export class FAQService {
  // Obtener todos los FAQs activos
  async getAllFAQs(): Promise<IFAQDocument[]> {
    try {
      const faqs = await FAQModel.find({ activo: true }).sort({ orden: 1 });
      return faqs;
    } catch (error) {
      throw new Error(`Error al obtener FAQs: ${error}`);
    }
  }

  // Buscar FAQs por palabra clave
  async searchFAQs(query: string): Promise<IFAQDocument[]> {
    try {
      if (!query || query.trim().length === 0) {
        return this.getAllFAQs();
      }

      const faqs = await FAQModel.find({
        $and: [
          { activo: true },
          {
            $or: [
              { pregunta: { $regex: query, $options: 'i' } },
              { respuesta: { $regex: query, $options: 'i' } },
              { palabrasClave: { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      }).sort({ orden: 1 });

      return faqs;
    } catch (error) {
      throw new Error(`Error en la búsqueda: ${error}`);
    }
  }

  // Obtener FAQs por categoría
  async getFAQsByCategory(categoria: FAQCategoria): Promise<IFAQDocument[]> {
    try {
      const faqs = await FAQModel.find({ 
        categoria, 
        activo: true 
      }).sort({ orden: 1 });
      return faqs;
    } catch (error) {
      throw new Error(`Error al obtener FAQs por categoría: ${error}`);
    }
  }

  // Obtener un FAQ por ID
  async getFAQById(id: string): Promise<IFAQDocument | null> {
    try {
      const faq = await FAQModel.findById(id);
      return faq;
    } catch (error) {
      throw new Error(`Error al obtener FAQ: ${error}`);
    }
  }

  // Crear nuevo FAQ (para administrador)
  async createFAQ(faqData: Partial<IFAQDocument>): Promise<IFAQDocument> {
    try {
      const newFAQ = new FAQModel(faqData);
      await newFAQ.save();
      return newFAQ;
    } catch (error) {
      throw new Error(`Error al crear FAQ: ${error}`);
    }
  }
}