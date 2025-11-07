// backend/src/features/faq/models/faq.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IFAQ, FAQCategoria } from '../types/faq.types';

// Interfaz que extiende Document de Mongoose
export interface IFAQDocument extends IFAQ, Document {}

const faqSchema = new Schema<IFAQDocument>(
  {
    pregunta: {
      type: String,
      required: [true, 'La pregunta es obligatoria'],
      trim: true,
      minlength: [10, 'La pregunta debe tener al menos 10 caracteres'],
      maxlength: [500, 'La pregunta no puede exceder 500 caracteres']
    },
    respuesta: {
      type: String,
      required: [true, 'La respuesta es obligatoria'],
      minlength: [20, 'La respuesta debe tener al menos 20 caracteres']
    },
    categoria: {
      type: String,
      enum: Object.values(FAQCategoria),
      default: FAQCategoria.GENERAL,
      required: true
    },
    palabrasClave: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr: string[]) {
          return arr.length <= 20;
        },
        message: 'No puedes tener más de 20 palabras clave'
      }
    },
    orden: {
      type: Number,
      default: 0,
      min: [0, 'El orden no puede ser negativo']
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices para búsqueda eficiente
faqSchema.index({ pregunta: 'text', respuesta: 'text', palabrasClave: 'text' });
faqSchema.index({ categoria: 1, orden: 1 });
faqSchema.index({ activo: 1 });

// Método para búsqueda
faqSchema.statics.searchByKeyword = function(keyword: string) {
  return this.find({
    $and: [
      { activo: true },
      {
        $or: [
          { pregunta: { $regex: keyword, $options: 'i' } },
          { respuesta: { $regex: keyword, $options: 'i' } },
          { palabrasClave: { $in: [new RegExp(keyword, 'i')] } }
        ]
      }
    ]
  }).sort({ orden: 1 });
};

export const FAQModel = mongoose.model<IFAQDocument>('FAQ', faqSchema);