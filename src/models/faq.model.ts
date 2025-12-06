import { Schema, model, models, Document } from 'mongoose';

export type FAQCategoria = 'problemas' | 'servicios' | 'pagos' | 'general';

export interface IFAQ extends Document {
  pregunta: string;
  respuesta: string;
  categoria: FAQCategoria;
  palabrasClave: string[];
  orden: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    pregunta: {
      type: String,
      required: true,
      trim: true,
    },
    respuesta: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      enum: ['problemas', 'servicios', 'pagos', 'general'],
      required: true,
      index: true,
    },
    palabrasClave: {
      type: [String],
      default: [],
      index: true,
    },
    orden: {
      type: Number,
      default: 0,
      index: true,
    },
    activo: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    collection: 'faqs',
    timestamps: true, // createdAt, updatedAt
  },
);

export const FAQModel = models.FAQ || model<IFAQ>('FAQ', faqSchema);
