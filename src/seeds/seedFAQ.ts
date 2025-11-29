// src/seeds/seedFAQ.ts
import 'dotenv/config';
import mongoose from 'mongoose';
import { FAQModel } from '../models/faq.model';

const faqs = [
  {
    pregunta: '¿Qué hago si tengo un problema en mi casa?',
    respuesta:
      'Puedes solicitar un servicio a través de nuestra plataforma. Simplemente selecciona la categoría del problema (plomería, electricidad, limpieza, etc.) y un profesional calificado te contactará en menos de 2 horas.',
    categoria: 'problemas',
    palabrasClave: ['problema', 'casa', 'servicio', 'solicitar', 'emergencia'],
    orden: 1,
    activo: true,
  },
  {
    pregunta: '¿Cómo puedo usar el detector de servicio de WhatsApp?',
    respuesta:
      'Envía un mensaje a nuestro WhatsApp Business con una foto o descripción del problema. Nuestro sistema AI analizará tu mensaje y te recomendará automáticamente el profesional más adecuado.',
    categoria: 'servicios',
    palabrasClave: ['whatsapp', 'detector', 'mensaje', 'AI', 'automático'],
    orden: 2,
    activo: true,
  },
  {
    pregunta: '¿Qué hago si el servicio sugerido no es el correcto?',
    respuesta:
      'No te preocupes. Puedes: 1) Rechazar la sugerencia y buscar manualmente en nuestro catálogo, 2) Contactar a soporte vía chat, o 3) Usar el buscador avanzado con filtros.',
    categoria: 'servicios',
    palabrasClave: ['servicio', 'incorrecto', 'sugerencia', 'cambiar'],
    orden: 3,
    activo: true,
  },
  {
    pregunta: '¿Cuáles son los métodos de pago disponibles?',
    respuesta: `Aceptamos varios métodos de pago para tu comodidad:

**Tarjetas de crédito y débito (Visa, Mastercard):**
Al finalizar tu solicitud, selecciona “Pago con tarjeta” e ingresa los datos. La transacción es procesada de forma segura mediante conexión SSL.

**Transferencias bancarias:**
Puedes transferir desde tu banca móvil o física a nuestras cuentas habilitadas en Banco Unión y BNB. Los datos aparecen al confirmar el servicio.

**Pago con QR (bancos bolivianos):**
Escanea el código QR que se mostrará al finalizar la compra. Es compatible con las apps de los principales bancos del país (Banco Unión, BNB, BCP, Mercantil Santa Cruz).

**Efectivo:**
Disponible solo para servicios presenciales. El pago se realiza directamente al profesional una vez completado el trabajo.
`,
    categoria: 'pagos',
    palabrasClave: ['pago', 'tarjeta', 'transferencia', 'efectivo', 'qr', 'banco'],
    orden: 4,
    activo: true,
  },
  {
    pregunta: '¿Los profesionales están verificados?',
    respuesta:
      'Sí, todos pasan por verificación de: antecedentes penales, certificaciones técnicas, referencias laborales, y evaluación práctica.',
    categoria: 'general',
    palabrasClave: ['profesionales', 'verificados', 'seguridad'],
    orden: 5,
    activo: true,
  },
  {
    pregunta: '¿Qué hago si no estoy satisfecho con el servicio?',
    respuesta:
      'Tienes 24 horas para reportar cualquier problema. Ofrecemos: reembolso completo si el servicio no se realizó, servicio correctivo gratuito si hay errores, o mediación con el profesional.',
    categoria: 'general',
    palabrasClave: ['insatisfecho', 'reembolso', 'garantía', 'queja'],
    orden: 6,
    activo: true,
  },
  {
    pregunta: '¿Puedo cancelar un servicio ya agendado?',
    respuesta:
      'Sí, puedes cancelar hasta 2 horas antes del servicio sin cargo. Cancelaciones con menos tiempo tienen una penalidad del 20%.',
    categoria: 'servicios',
    palabrasClave: ['cancelar', 'agendar', 'modificar'],
    orden: 7,
    activo: true,
  },
  {
    pregunta: '¿Hay servicio de emergencia 24/7?',
    respuesta:
      'Sí, para plomería y electricidad de emergencia contamos con profesionales disponibles 24/7. El recargo por servicio nocturno (10pm-6am) es del 30%.',
    categoria: 'servicios',
    palabrasClave: ['emergencia', '24/7', 'nocturno', 'urgente'],
    orden: 8,
    activo: true,
  },
];

const seedFAQs = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('❌ MONGO_URI no está definida en el archivo .env');
    }

    console.log('📡 Conectando a MongoDB con URI:\n', mongoURI, '\n');

    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB\n');

    const deleteResult = await FAQModel.deleteMany({});
    console.log(`🗑️  ${deleteResult.deletedCount} FAQs anteriores eliminados\n`);

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

seedFAQs();
