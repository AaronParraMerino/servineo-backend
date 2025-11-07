// backend/src/index.ts
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import faqRoutes from './features/faq/routes/faq.routes';
import healthRoutes from './modules/health/health.routes';

// Cargar variables de entorno PRIMERO
dotenv.config();

// Crear aplicación Express
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// ============= RUTAS =============
app.use('/api/health', healthRoutes);  // Health check
app.use('/api/faqs', faqRoutes);       // FAQ routes

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Servineo API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      faqs: '/api/faqs',
      faqsSearch: '/api/faqs/search?q=keyword'
    }
  });
});

// Ruta 404 - Debe ir al FINAL
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 ================================');
  console.log(`   Servidor: http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ================================\n');
});

// Manejo de cierre limpio
process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Cerrando servidor...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});