// src/seeds/seedFAQ.ts
import "dotenv/config";
import mongoose from "mongoose";
import { FAQModel } from "../models/faq.model";

const faqs = [
  {
    pregunta: "¿Qué hago si tengo un problema en mi casa?",
    respuesta:
      "Puedes solicitar un servicio a través de nuestra plataforma.\n\n" +
      "Solo tienes que seleccionar la categoría del problema (plomería, electricidad, limpieza, etc.) " +
      "y un profesional calificado te contactará en menos de 2 horas.",
    categoria: "problemas",
    palabrasClave: ["problema", "casa", "servicio", "solicitar", "emergencia"],
    orden: 1,
    activo: true,
  },
  {
    pregunta: "¿Cómo puedo usar el detector de servicio de WhatsApp?",
    respuesta:
      "Envía un mensaje a nuestro WhatsApp Business con una foto o una breve descripción del problema.\n\n" +
      "Nuestro sistema de IA analizará tu mensaje y te recomendará automáticamente el profesional más adecuado.",
    categoria: "servicios",
    palabrasClave: ["whatsapp", "detector", "mensaje", "IA", "automático"],
    orden: 2,
    activo: true,
  },
  {
    pregunta: "¿Qué hago si el servicio sugerido no es el correcto?",
    respuesta:
      "No te preocupes, tienes varias opciones:\n\n" +
      "1) Rechazar la sugerencia y buscar manualmente en nuestro catálogo.\n" +
      "2) Contactar a soporte vía chat.\n" +
      "3) Usar el buscador avanzado con filtros para ajustar mejor tu necesidad.",
    categoria: "servicios",
    palabrasClave: ["servicio", "incorrecto", "sugerencia", "cambiar"],
    orden: 3,
    activo: true,
  },
  {
    pregunta: "¿Cuáles son los métodos de pago disponibles?",
    respuesta:
      "Aceptamos varios métodos de pago para tu comodidad:\n\n" +
      "Tarjetas de crédito y débito (Visa, Mastercard):\n" +
      "Al finalizar tu solicitud, selecciona \"Pago con tarjeta\" e ingresa los datos. " +
      "La transacción es procesada de forma segura mediante conexión SSL.\n\n" +
      "Transferencias bancarias:\n" +
      "Puedes transferir desde tu banca móvil o física a nuestras cuentas habilitadas en Banco Unión y BNB. " +
      "Los datos aparecen al confirmar el servicio.\n\n" +
      "Pago con QR (bancos bolivianos):\n" +
      "Escanea el código QR que se mostrará al finalizar la compra. Es compatible con las apps de los principales bancos del país " +
      "(Banco Unión, BNB, BCP, Mercantil Santa Cruz).\n\n" +
      "Efectivo:\n" +
      "Disponible solo para servicios presenciales. El pago se realiza directamente al profesional una vez completado el trabajo.",
    categoria: "pagos",
    palabrasClave: ["pago", "tarjeta", "transferencia", "efectivo", "qr", "banco"],
    orden: 4,
    activo: true,
  },
  {
    pregunta: "¿Los profesionales están verificados?",
    respuesta:
      "Sí. Todos los profesionales pasan por un proceso de verificación que incluye:\n\n" +
      "- Revisión de antecedentes.\n" +
      "- Validación de certificaciones técnicas cuando aplica.\n" +
      "- Referencias laborales.\n" +
      "- Evaluación práctica y calificación de otros usuarios.",
    categoria: "general",
    palabrasClave: ["profesionales", "verificados", "seguridad"],
    orden: 5,
    activo: true,
  },
  {
    pregunta: "¿Qué hago si no estoy satisfecho con el servicio?",
    respuesta:
      "Tienes 24 horas para reportar cualquier problema desde que se marca el servicio como completado.\n\n" +
      "Dependiendo del caso, podemos ofrecer:\n" +
      "- Reembolso total si el servicio no se realizó.\n" +
      "- Servicio correctivo sin costo extra si hubo errores.\n" +
      "- Mediación con el profesional para llegar a un acuerdo.",
    categoria: "general",
    palabrasClave: ["insatisfecho", "reembolso", "garantía", "queja"],
    orden: 6,
    activo: true,
  },
  {
    pregunta: "¿Puedo cancelar un servicio ya agendado?",
    respuesta:
      "Sí. Puedes cancelar hasta 2 horas antes del inicio del servicio sin ningún cargo.\n\n" +
      "Si cancelas con menos de 2 horas de anticipación, se aplica una penalidad del 20 % del valor del servicio " +
      "para compensar el tiempo del profesional.",
    categoria: "servicios",
    palabrasClave: ["cancelar", "agendar", "modificar"],
    orden: 7,
    activo: true,
  },
  {
    pregunta: "¿Hay servicio de emergencia 24/7?",
    respuesta:
      "Sí. Para plomería y electricidad de emergencia contamos con profesionales disponibles las 24 horas, " +
      "los 7 días de la semana.\n\n" +
      "Los servicios realizados en horario nocturno (entre las 22:00 y las 06:00) tienen un recargo aproximado del 30 %. ",
    categoria: "servicios",
    palabrasClave: ["emergencia", "24/7", "nocturno", "urgente"],
    orden: 8,
    activo: true,
  },
  {
    pregunta: "¿Cómo creo una cuenta en Servineo?",
    respuesta:
      "Para crear tu cuenta:\n\n" +
      "1) Haz clic en \"Registrarme\" en la parte superior de la página.\n" +
      "2) Completa tus datos básicos (nombre, correo, contraseña).\n" +
      "3) Confirma tu correo electrónico mediante el enlace que te enviaremos.\n\n" +
      "Una vez confirmada tu cuenta, podrás solicitar servicios y dejar reseñas.",
    categoria: "general",
    palabrasClave: ["crear cuenta", "registrar", "registro", "nueva cuenta"],
    orden: 9,
    activo: true,
  },
  {
    pregunta: "Olvidé mi contraseña, ¿cómo la recupero?",
    respuesta:
      "Si olvidaste tu contraseña:\n\n" +
      "1) Ve a la pantalla de inicio de sesión.\n" +
      "2) Haz clic en \"¿Olvidaste tu contraseña?\".\n" +
      "3) Ingresa el correo registrado y revisa tu bandeja de entrada.\n\n" +
      "Te enviaremos un enlace para que puedas crear una nueva contraseña de forma segura.",
    categoria: "general",
    palabrasClave: ["contraseña", "recuperar", "olvidé", "reset"],
    orden: 10,
    activo: true,
  },
  {
    pregunta: "¿En qué ciudades está disponible Servineo?",
    respuesta:
      "Actualmente Servineo está disponible en las principales ciudades de Bolivia.\n\n" +
      "En la app o web, al momento de solicitar un servicio, selecciona tu ciudad. " +
      "Solo te mostraremos profesionales que puedan atender en tu zona.",
    categoria: "general",
    palabrasClave: ["ciudad", "disponible", "cobertura", "zona"],
    orden: 11,
    activo: true,
  },
  {
    pregunta: "¿Cómo se calcula el precio del servicio?",
    respuesta:
      "El precio se calcula combinando varios factores:\n\n" +
      "- Tipo de servicio solicitado.\n" +
      "- Complejidad estimada del trabajo.\n" +
      "- Distancia y zona.\n" +
      "- Disponibilidad del profesional.\n\n" +
      "Siempre verás un precio estimado antes de confirmar la solicitud. " +
      "En trabajos muy específicos, el profesional puede ajustar el monto luego de una evaluación previa.",
    categoria: "pagos",
    palabrasClave: ["precio", "costo", "tarifa", "cuánto cuesta"],
    orden: 12,
    activo: true,
  },
  {
    pregunta: "¿Puedo comunicarme directamente con el profesional?",
    respuesta:
      "Sí. Una vez que tu solicitud es aceptada, podrás chatear con el profesional asignado desde la plataforma " +
      "o por teléfono (si así lo autorizas).\n\n" +
      "Te recomendamos mantener la comunicación dentro de Servineo para que podamos ayudarte en caso de cualquier inconveniente.",
    categoria: "servicios",
    palabrasClave: ["contactar", "profesional", "chat", "comunicación"],
    orden: 13,
    activo: true,
  },
  {
    pregunta: "¿Es seguro pagar a través de Servineo?",
    respuesta:
      "Sí. Utilizamos pasarelas de pago certificadas y conexión segura (SSL) para proteger tus datos.\n\n" +
      "- No almacenamos los datos completos de tu tarjeta.\n" +
      "- Monitoreamos operaciones sospechosas.\n" +
      "- Puedes reportar cualquier cargo que no reconozcas para investigar el caso.",
    categoria: "general",
    palabrasClave: ["seguridad", "pago seguro", "tarjeta", "fraude"],
    orden: 14,
    activo: true,
  },
  {
    pregunta: "¿Cómo califico a un profesional después del servicio?",
    respuesta:
      "Al finalizar el servicio recibirás una notificación para dejar tu opinión.\n\n" +
      "Puedes:\n" +
      "- Puntuar al profesional de 1 a 5 estrellas.\n" +
      "- Escribir un comentario sobre la experiencia.\n\n" +
      "Estas reseñas nos ayudan a mejorar la calidad de la comunidad y a otros usuarios a elegir mejor.",
    categoria: "general",
    palabrasClave: ["calificar", "reseña", "opinión", "comentario"],
    orden: 15,
    activo: true,
  },
];

const seedFAQs = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("❌ MONGO_URI no está definida en el archivo .env");
    }

    console.log("📡 Conectando a MongoDB con URI:\n", mongoURI, "\n");

    await mongoose.connect(mongoURI);
    console.log("✅ Conectado a MongoDB\n");

    const deleteResult = await FAQModel.deleteMany({});
    console.log(`🗑️  ${deleteResult.deletedCount} FAQs anteriores eliminados\n`);

    const insertedFAQs = await FAQModel.insertMany(faqs);
    console.log(`✅ ${insertedFAQs.length} FAQs insertados exitosamente:\n`);

    insertedFAQs.forEach((faq, index) => {
      console.log(`   ${index + 1}. [${faq.categoria.toUpperCase()}] ${faq.pregunta}`);
    });

    console.log("\n🎉 Seed completado exitosamente!");
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error en el seed:", error);
    process.exit(1);
  }
};

seedFAQs();
