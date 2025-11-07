// backend/src/config/database.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI no está definida en las variables de entorno');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🌍 Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);

    // Manejar errores de conexión
    mongoose.connection.on('error', (error) => {
      console.error('❌ Error de MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB:`, error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
  }
};