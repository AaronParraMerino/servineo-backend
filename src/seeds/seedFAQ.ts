// backend/src/seeds/seedFAQ.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { FAQModel } from '../features/faq/models/faq.model';
import { FAQCategoria } from '../features/faq/types/faq.types';

// Cargar variables de entorno
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
  },
  {
    pregunta: "¿Qué hago si no estoy satisfecho con el servicio?",
    respuesta: "Tienes 24 horas para reportar cualquier problema. Ofrecemos: reembolso completo si el servicio no se realizó, servicio correctivo gratuito si hay errores, o mediación con el profesional.",
    categoria: FAQCategoria.GENERAL,
    palabrasClave: ["insatisfecho", "reembolso", "garantía", "queja"],
    orden: 6,
    activo: true
  },
  {
    pregunta: "¿Puedo cancelar un servicio ya agendado?",
    respuesta: "Sí, puedes cancelar hasta 2 horas antes del servicio sin cargo. Cancelaciones con menos tiempo tienen una penalidad del 20%.",
    categoria: FAQCategoria.SERVICIOS,
    palabrasClave: ["cancelar", "agendar", "modificar"],
    orden: 7,
    activo: true
  },
  {
    pregunta: "¿Hay servicio de emergencia 24/7?",
    respuesta: "Sí, para plomería y electricidad de emergencia contamos con profesionales disponibles 24/7. El recargo por servicio nocturno (10pm-6am) es del 30%.",
    categoria: FAQCategoria.SERVICIOS,
    palabrasClave: ["emergencia", "24/7", "nocturno", "urgente"],
    orden: 8,
    activo: true
  }
];

const seedFAQs = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('❌ MONGODB_URI no está definida en el archivo .env');
    }

    console.log('📡 Conectando a MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB\n');

    // Limpiar colección existente
    const deleteResult = await FAQModel.deleteMany({});
    console.log(`🗑️  ${deleteResult.deletedCount} FAQs anteriores eliminados\n`);

    // Insertar nuevos FAQs
    const insertedFAQs = await FAQModel.insertMany(faqs);
    console.log(`✅ ${insertedFAQs.length} FAQs insertados exitosamente:\n`);

    insertedFAQs.forEach((faq, index) => {
      console.log(`   ${index + 1}. [${faq.categoria.toUpperCase()}] ${faq.pregunta}`);
    });

    console.log('\n🎉 Seed completado exitosamente!');

    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error en el seed:', error);
    process.exit(1);
  }
};

// Ejecutar seed
seedFAQs();