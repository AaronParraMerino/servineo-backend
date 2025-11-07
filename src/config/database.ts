// backend/src/config/database.ts
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('❌ MONGODB_URI no está definida en .env');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log('✅ MongoDB conectado:');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Base de datos: ${conn.connection.name}`);
    console.log(`   Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);

    // Eventos de conexión
    mongoose.connection.on('error', (error) => {
      console.error('❌ Error de MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconectado');
    });

  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar conexión:', error);
  }
};