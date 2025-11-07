// backend/src/seeds/seedFAQ.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { FAQModel } from '../features/faq/models/faq.model';
import { FAQCategoria } from '../features/faq/types/faq.types';

dotenv.config();

const faqs = [
  {
    pregunta: "¿Qué hago si tengo un problema en mi casa?",
    respuesta: "Puedes solicitar un servicio a través de nuestra plataforma. Simplemente selecciona la categoría del problema (plomería, electricidad, limpieza, etc.) y un profesional calificado te contactará en menos de 2 horas.",
    categoria: FAQCategoria.PROBLEMAS,
    palabrasClave: ["problema", "casa", "servicio", "solicitar", "emergencia"],
    orden: 1,
    activo: true
  },
  {
    pregunta: "¿Cómo puedo usar el detector de servicio de WhatsApp?",
    respuesta: "Envía un mensaje a nuestro WhatsApp Business con una foto o descripción del problema. Nuestro sistema AI analizará tu mensaje y te recomendará automáticamente el profesional más adecuado.",
    categoria: FAQCategoria.SERVICIOS,
    palabrasClave: ["whatsapp", "detector", "mensaje", "AI", "automático"],
    orden: 2,
    activo: true
  },
  {
    pregunta: "¿Qué hago si el servicio sugerido no es el correcto?",
    respuesta: "No te preocupes. Puedes: 1) Rechazar la sugerencia y buscar manualmente en nuestro catálogo, 2) Contactar a soporte vía chat, o 3) Usar el buscador avanzado con filtros.",
    categoria: FAQCategoria.SERVICIOS,
    palabrasClave: ["servicio", "incorrecto", "sugerencia", "cambiar"],
    orden: 3,
    activo: true
  },
  {
    pregunta: "¿Cuáles son los métodos de pago disponibles?",
    respuesta: "Aceptamos: tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias, QR de bancos bolivianos, y efectivo. Todos los pagos están protegidos con SSL.",
    categoria: FAQCategoria.PAGOS,
    palabrasClave: ["pago", "tarjeta", "transferencia", "efectivo"],
    orden: 4,
    activo: true
  },
  {
    pregunta: "¿Los profesionales están verificados?",
    respuesta: "Sí, todos pasan por verificación de: antecedentes penales, certificaciones técnicas, referencias laborales, y evaluación práctica.",
    categoria: FAQCategoria.GENERAL,
    palabrasClave: ["profesionales", "verificados", "seguridad"],
    orden: 5,
    activo: true
  }
];

const seedFAQs = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI no está definida');
    }

    await mongoose.connect(mongoURI);
    console.log('📡 Conectado a MongoDB');

    // Limpiar colección
    await FAQModel.deleteMany({});
    console.log('🗑️  FAQs anteriores eliminados');

    // Insertar nuevos FAQs
    const insertedFAQs = await FAQModel.insertMany(faqs);
    console.log(`✅ ${insertedFAQs.length} FAQs insertados exitosamente\n`);

    insertedFAQs.forEach((faq, index) => {
      console.log(`${index + 1}. [${faq.categoria}] ${faq.pregunta}`);
    });

    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedFAQs();