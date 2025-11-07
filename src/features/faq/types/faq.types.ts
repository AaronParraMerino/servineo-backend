// backend/src/features/faq/types/faq.types.ts

export enum FAQCategoria {
  PROBLEMAS = 'problemas',
  SERVICIOS = 'servicios',
  PAGOS = 'pagos',
  GENERAL = 'general'
}

export interface IFAQ {
  pregunta: string;
  respuesta: string;
  categoria: FAQCategoria;
  palabrasClave: string[];
  orden: number;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FAQQueryParams {
  q?: string;
  categoria?: FAQCategoria;
  activo?: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}