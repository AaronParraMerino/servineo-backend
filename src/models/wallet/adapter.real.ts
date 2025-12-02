import mongoose from "mongoose";
import { WalletModelAdapter, WalletSlice } from "./adapter";
import { User } from "../userPayment.model";

/**
 * Adapter real que trabaja contra Mongo (colección de usuarios)
 * Asume que en el documento User existe un subdocumento `wallet`.
 *
 * Tipo aproximado de user.wallet:
 * {
 *   balance: number;
 *   lowBalanceThreshold?: number;
 *   flags?: any;
 *   lastLowBalanceNotification?: Date | null;
 * }
 */

export const walletAdapterReal: WalletModelAdapter = {
  /**
   * Obtiene la wallet de un fixer por su userId.
   */
  async getWalletById(fixerId: string): Promise<WalletSlice | null> {
    const userDoc = await User.findById(fixerId).lean();

    // Si no hay usuario o no tiene wallet, devolvemos null
    const wallet: any = (userDoc as any)?.wallet;
    if (!wallet) {
      return null;
    }

    return {
      balance: wallet.balance ?? 0,
      lowBalanceThreshold: wallet.lowBalanceThreshold,
      flags: wallet.flags,
      lastLowBalanceNotification:
        wallet.lastLowBalanceNotification ?? null,
    };
  },

  /**
   * Actualiza parcialmente la wallet de un fixer.
   */
  async updateWalletById(
    fixerId: string,
    patch: Partial<WalletSlice>
  ): Promise<void> {
    const $set: any = {
      "wallet.updatedAt": new Date(),
    };

    if (patch.balance !== undefined) {
      $set["wallet.balance"] = patch.balance;
    }
    if (patch.lowBalanceThreshold !== undefined) {
      $set["wallet.lowBalanceThreshold"] = patch.lowBalanceThreshold;
    }
    if (patch.flags !== undefined) {
      $set["wallet.flags"] = patch.flags;
    }
    if (patch.lastLowBalanceNotification !== undefined) {
      $set["wallet.lastLowBalanceNotification"] =
        patch.lastLowBalanceNotification;
    }

    await User.updateOne({ _id: new mongoose.Types.ObjectId(fixerId) }, { $set });
  },
};
