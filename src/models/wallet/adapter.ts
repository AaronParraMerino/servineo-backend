import mongoose from "mongoose";

/**
 * Slice de información relevante de la wallet
 * (ajústalo si tu modelo real tiene otros campos)
 */
export interface WalletSlice {
  balance: number;
  lowBalanceThreshold?: number;
  flags?: any;
  lastLowBalanceNotification?: Date | null;
}

/**
 * Adapter de acceso a datos de wallet.
 *
 * Esta interfaz la implementa, por ejemplo, `adapter.real.ts`,
 * que es el que realmente habla con la base de datos.
 */
export interface WalletModelAdapter {
  /**
   * Obtiene la wallet asociada a un fixer por su ID.
   */
  getWalletById(fixerId: string): Promise<WalletSlice | null>;

  /**
   * Actualiza parcialmente la wallet del fixer.
   */
  updateWalletById(
    fixerId: string,
    patch: Partial<WalletSlice>
  ): Promise<void>;
}

// 👇 Este archivo queda SOLO como definición de tipos.
// La implementación concreta vive en `adapter.real.ts` u otros adapters.
