import Stripe from "stripe";
import { Request, Response } from "express";
import { Card } from "../../models/card.model";
import { User } from "../../models/userPayment.model";
import "dotenv/config";

// Validar que la clave de Stripe existe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "❌ STRIPE_SECRET_KEY no está definida en las variables de entorno"
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// =========================
// Crear y guardar tarjeta
// =========================
export const createCard = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { userId, paymentMethodId } = req.body;

    if (!userId || !paymentMethodId) {
      return res.status(400).json({
        error: "MISSING_DATA",
        message: "userId y paymentMethodId son requeridos",
      });
    }

    // Verificar que exista el usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
        message: "Usuario no encontrado",
      });
    }

    // Recuperar el PaymentMethod desde Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(
      paymentMethodId
    );

    // 💡 Aquí evitamos el error de que `paymentMethod.card` sea undefined
    if (!("card" in paymentMethod) || !paymentMethod.card) {
      return res.status(400).json({
        error: "INVALID_PAYMENT_METHOD",
        message: "El paymentMethod no contiene datos de tarjeta",
      });
    }

    const newCard = await Card.create({
      userId,
      stripePaymentMethodId: paymentMethod.id,
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
      expMonth: paymentMethod.card.exp_month,
      expYear: paymentMethod.card.exp_year,
    });

    return res.status(201).json(newCard);
  } catch (error: any) {
    console.error("Error createCard:", error);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: error.message,
    });
  }
};

// =========================
// Listar tarjetas de usuario
// =========================
export const listCards = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "MISSING_USER_ID",
        message: "userId es requerido",
      });
    }

    const cards = await Card.find({ userId });
    return res.json(cards);
  } catch (error: any) {
    console.error("Error listCards:", error);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: error.message,
    });
  }
};
