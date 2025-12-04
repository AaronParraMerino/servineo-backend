import { Request, Response } from 'express';
import * as PromotionService from './promotion.service';
import { ObjectId } from 'mongodb';

export async function getAllPromotions(req: Request, res: Response) {
  try {
    const promotions = await PromotionService.getAllPromotions();
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ message: 'Error fetching promotions' });
  }
}

export async function getPromotionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const promotion = await PromotionService.getPromotionById(id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    res.status(500).json({ message: 'Error fetching promotion' });
  }
}

export async function createPromotion(req: Request, res: Response) {
  try {
    const jobOffertPromotionData = req.body;
    const { offerId, fixerId, title, description, price } = jobOffertPromotionData;

    if (!offerId || !fixerId || !title || price === undefined) {
      return res.status(400).json({
        message: 'offerId, fixerId, title and price are required',
        received: { offerId, fixerId, title, price, description },
      });
    }

    if (!(ObjectId.isValid(offerId) && new ObjectId(offerId).toHexString() === offerId)) {
      return res.status(422).json({ error: 'Invalid offerId format' });
    }
    if (!(ObjectId.isValid(fixerId) && new ObjectId(fixerId).toHexString() === fixerId)) {
      return res.status(422).json({ error: 'Invalid fixerId format' });
    }

    const newPromotion = await PromotionService.createPromotion(jobOffertPromotionData);

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: newPromotion,
    });
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({
      message: 'Error creating promotion',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function updatePromotion(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPromotion = await PromotionService.updatePromotion(id, updateData);

    if (!updatedPromotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ message: 'Error updating promotion' });
  }
}

export async function deletePromotion(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ error: 'Invalid promotion ID format' });
    }

    const deletionResult = await PromotionService.deletePromotion(id);

    if (!deletionResult) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    res.status(200).json({
      message: 'Promotion deleted successfully',
      deletedCount: deletionResult,
    });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ message: 'Error deleting promotion' });
  }
}

export async function getPromotionsByOfferId(req: Request, res: Response) {
  try {
    const { offerId } = req.params;
    if (!ObjectId.isValid(offerId)) {
      return res.status(400).json({ message: 'Invalid Offer ID' });
    }
    const promotions = await PromotionService.getPromotionsByOfferId(offerId);
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions by offer:', error);
    res.status(500).json({ message: 'Error fetching promotions by offer' });
  }
}
