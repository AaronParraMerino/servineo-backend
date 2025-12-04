import { ObjectId } from 'mongodb';
import { connectDB } from '../../config/db/mongoClient';

export interface Promotion {
  _id?: ObjectId;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  offerId: ObjectId;
  fixerId: ObjectId;
}

export async function getAllPromotions() {
  try {
    const db = await connectDB();
    return db.collection('promotions').find().toArray();
  } catch (error) {
    console.error('Error en getAllPromotions:', error);
    throw error;
  }
}

export async function getPromotionById(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const db = await connectDB();
    return db.collection('promotions').findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error en getPromotionById:', error);
    throw error;
  }
}

export async function createPromotion(jobOffertPromotion: Omit<Promotion, '_id' | 'createdAt'>) {
  try {
    const db = await connectDB();

    const promotionToInsert = {
      ...jobOffertPromotion,
      offerId: new ObjectId(jobOffertPromotion.offerId),
      fixerId: new ObjectId(jobOffertPromotion.fixerId),
      createdAt: new Date(),
    };

    const result = await db.collection('promotions').insertOne(promotionToInsert);
    const insertedPromotion = await db.collection('promotions').findOne({
      _id: result.insertedId,
    });

    return insertedPromotion;
  } catch (error) {
    console.error('Error en createPromotion service:', error);
    throw error;
  }
}

export async function updatePromotion(id: string, updateData: Partial<Promotion>) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const db = await connectDB();
    const result = await db
      .collection('promotions')
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' },
      );

    return result;
  } catch (error) {
    console.error('Error en updatePromotion:', error);
    throw error;
  }
}

export async function deletePromotion(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const db = await connectDB();
    const result = await db.collection('promotions').deleteOne({
      _id: new ObjectId(id),
    });

    return result.deletedCount;
  } catch (error) {
    console.error('Error en deletePromotion:', error);
    throw error;
  }
}

export async function getPromotionsByOfferId(offerId: string) {
  try {
    const db = await connectDB();

    const query = {
      $or: [{ offerId: offerId }, { offerId: new ObjectId(offerId) }],
    };

    const results = await db.collection('promotions').find(query).toArray();

    return results;
  } catch (error) {
    console.error('Error en getPromotionsByOfferId:', error);
    throw error;
  }
}
