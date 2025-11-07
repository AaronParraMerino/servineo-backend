// backend/src/features/faq/controllers/faq.controller.ts
import { Request, Response } from 'express';
import { FAQService } from '../services/faq.service';
import { APIResponse } from '../types/faq.types';
import { IFAQDocument } from '../models/faq.model';

export class FAQController {
  private faqService: FAQService;

  constructor() {
    this.faqService = new FAQService();
  }

  // GET /api/faqs
  getAllFAQs = async (req: Request, res: Response): Promise<void> => {
    try {
      const faqs = await this.faqService.getAllFAQs();
      
      const response: APIResponse<IFAQDocument[]> = {
        success: true,
        data: faqs,
        count: faqs.length
      };

      res.status(200).json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      res.status(500).json(response);
    }
  };

  // GET /api/faqs/search?q=keyword
  searchFAQs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        const response: APIResponse<null> = {
          success: false,
          message: 'El parámetro "q" es requerido'
        };
        res.status(400).json(response);
        return;
      }

      const faqs = await this.faqService.searchFAQs(q);

      const response: APIResponse<IFAQDocument[]> = {
        success: true,
        data: faqs,
        count: faqs.length,
        message: faqs.length === 0 
          ? 'No se encontraron resultados' 
          : `Se encontraron ${faqs.length} resultado(s)`
      };

      res.status(200).json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Error en la búsqueda'
      };
      res.status(500).json(response);
    }
  };

  // GET /api/faqs/:id
  getFAQById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const faq = await this.faqService.getFAQById(id);

      if (!faq) {
        const response: APIResponse<null> = {
          success: false,
          message: 'FAQ no encontrado'
        };
        res.status(404).json(response);
        return;
      }

      const response: APIResponse<IFAQDocument> = {
        success: true,
        data: faq
      };

      res.status(200).json(response);
    } catch (error) {
      const response: APIResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener FAQ'
      };
      res.status(500).json(response);
    }
  };
}