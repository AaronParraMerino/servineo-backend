import { Request, Response } from 'express';
import * as faqService from '../../services/faq.service';

export async function getAllFAQsController(req: Request, res: Response) {
  try {
    const faqs = await faqService.getAllFAQs();
    res.status(200).json({
      success: true,
      data: faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error('Error getting FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las preguntas frecuentes',
      error: String(error),
    });
  }
}

export async function searchFAQsController(req: Request, res: Response) {
  try {
    const q = (req.query.q as string) || '';
    const faqs = await faqService.searchFAQs(q);

    res.status(200).json({
      success: true,
      data: faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error('Error searching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la búsqueda de FAQs',
      error: String(error),
    });
  }
}

export async function getFAQByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const faq = await faqService.getFAQById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ no encontrado',
        data: [],
      });
    }

    // El frontend espera un array y toma [0]
    res.status(200).json({
      success: true,
      data: [faq],
      count: 1,
    });
  } catch (error) {
    console.error('Error getting FAQ by id:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener FAQ por id',
      error: String(error),
    });
  }
}
