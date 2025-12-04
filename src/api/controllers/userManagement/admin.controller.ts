import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { connectDB } from "../../../config/db/mongoClient";
import bcrypt from "bcryptjs";
import { generarToken } from "../../../utils/generadorToken";
import { OAuth2Client } from "google-auth-library";


// Configuración Google
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

export const loginAdministrador = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos (email o contraseña)",
    });
  }

  try {
    const db = await connectDB();
    const usersCollection = db.collection("users");

    // Buscar usuario por email dentro de authProviders
    const user = await usersCollection.findOne({
      "authProviders.provider": "email",
      "authProviders.providerId": email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado o sin método de correo vinculado",
      });
    }

    // 🔥 Validar que sea admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos de administrador",
      });
    }

    const emailProvider = user.authProviders.find(
      (p: any) => p.provider === "email" && p.providerId === email
    );

    if (!emailProvider || !emailProvider.password) {
      return res.status(400).json({
        success: false,
        message: "El método de correo no tiene contraseña registrada",
      });
    }

    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, emailProvider.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const userPicture = user.url_photo || null;

    // Generar token con la misma función del proyecto
    const sessionToken = generarToken(
      user._id.toString(),
      user.name || "Administrador",
      email,
      userPicture
    );

    return res.json({
      success: true,
      message: "Inicio de sesión de administrador exitoso",
      token: sessionToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email,
        picture: userPicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión de administrador:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};


// Endpoitn para login de admin con Google


// 2. Login con Google
export const loginAdminWithGoogle = async (req: Request, res: Response) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      success: false,
      message: "No se recibió el token de Google"
    });
  }

  if (!googleClient) {
    return res.status(500).json({
      success: false,
      message: "Google login no configurado"
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: "No se pudo verificar el correo de Google"
      });
    }

    const db = await connectDB();
    

    // Buscar ADMIN por email
    const user = await db.collection("users").findOne({ 
      email: payload.email,
      role: "admin"
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin no encontrado. Solo admins pueden usar Google Login."
      });
    }

    const sessionToken = generarToken(
      user._id.toString(),
      user.name || "Administrador",
      user.email,
      user.url_photo || null
    );

    return res.json({
      success: true,
      message: "Google login exitoso",
      token: sessionToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.url_photo,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error en login con Google"
    });
  }
};

// 3. Verificar Token 
export const verifyAdminToken = async (req: Request, res: Response) => {
  try {
    const decoded = (req as any).user;
    
    const db = await connectDB();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.id),
      role: "admin"
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin no encontrado"
      });
    }

    return res.json({
      success: true,
      valid: true,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      valid: false,
      message: "Token inválido"
    });
  }
};

// 4. Métricas del Dashboard
export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    
    // 1. CONSULTAS PRINCIPALES EN PARALELO
    const [
      totalUsers,
      usersByRole,
      jobsStats,
      totalPayments,
      activePayments,
      searchesStats,
      loginStats,
      popularSearchesData
    ] = await Promise.all([
      // Total usuarios
      db.collection('users').countDocuments(),
      
      // Usuarios por rol
      db.collection('users').aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]).toArray(),
      
      // Estadísticas de trabajos
      db.collection('jobs').aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray(),
      
      // Total pagos
      db.collection('payments').countDocuments(),
      
      // Pagos activos (Pagados)
      db.collection('payments').countDocuments({ status: 'Pagado' }),
      
      // Estadísticas de búsquedas
      db.collection('searches').countDocuments(),
      
      // Logins por rol (Últimos 30 días)
      db.collection('activities').aggregate([
        { 
          $match: { 
            type: 'login',
            timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          } 
        },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]).toArray(),
      
      // Búsquedas populares (Últimos 30 días)
      db.collection('searches').aggregate([
        { 
          $match: { 
            timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          } 
        },
        { $group: { _id: '$search_query', count: { $sum: 1 } } },
        { $match: { _id: { $ne: null, $ne: '' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).toArray()
    ]);

    // 2. CALCULAR MÉTRICAS DERIVADAS
    const activeJobs = jobsStats.find((j: any) => j._id === 'pending' || j._id === 'in_progress')?.count || 0;
    const totalJobs = jobsStats.reduce((sum: number, job: any) => sum + job.count, 0);
    
    const totalLogins = loginStats.reduce((sum: number, login: any) => sum + login.count, 0);
    
    // 3. FORMATEAR DATOS
    const sessionStats = {
      requester: loginStats.find((l: any) => l._id === 'requester')?.count || 0,
      fixer: loginStats.find((l: any) => l._id === 'fixer')?.count || 0,
      visitor: loginStats.find((l: any) => l._id === 'visitor')?.count || 0,
      admin: loginStats.find((l: any) => l._id === 'admin')?.count || 0
    };

    const popularSearches = popularSearchesData
      .map((search: any) => ({
        term: String(search._id || 'N/A'),
        count: search.count
      }))
      .filter(search => search.term !== 'N/A');

    // 4. CALCULAR INGRESOS (de payments)
    const revenueData = await db.collection('payments').aggregate([
      { $match: { status: 'Pagado' } },
      { $group: { _id: null, total: { $sum: '$amount.total' } } }
    ]).toArray();

    const revenue = revenueData[0]?.total || 0;

    // 5. RESPUESTA FINAL
    res.json({
      success: true,
      metrics: {
        // Usuarios
        totalUsers,
        usersByRole: {
          requester: usersByRole.find((u: any) => u._id === 'requester')?.count || 0,
          fixer: usersByRole.find((u: any) => u._id === 'fixer')?.count || 0,
          visitor: usersByRole.find((u: any) => u._id === 'visitor')?.count || 0,
          admin: usersByRole.find((u: any) => u._id === 'admin')?.count || 0
        },
        
        // Trabajos
        totalJobs,
        activeJobs,
        jobsByStatus: jobsStats.reduce((obj: any, item: any) => {
          obj[item._id] = item.count;
          return obj;
        }, {}),
        
        // Pagos
        totalPayments,
        activePayments,
        revenue,
        
        // Actividad
        totalSessions: totalLogins,
        searches: searchesStats,
        
        // Búsquedas
        topSearch: popularSearches[0]?.term || "Ninguna",
        topSearchCount: popularSearches[0]?.count || 0,
        sessionStats,
        popularSearches,
        
        // Metadata
        lastUpdated: new Date(),
        dataRange: 'Últimos 30 días'
      }
    });
  } catch (error) {
    console.error("❌ Error en getDashboardMetrics:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo métricas",
      error: error.message
    });
  }
};

// 5. Gráfico de Logins por Día 
export const getLoginsByDayChart = async (req: Request, res: Response) => {
  try {
    const db = await connectDB();
    const { days = 7 } = req.query;
    
    const startDate = new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000);
    
    const loginsByDay = await db.collection('activities').aggregate([
      {
        $match: {
          type: 'login',
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      { 
        $sort: { 
          '_id.year': 1, 
          '_id.month': 1, 
          '_id.day': 1 
        } 
      }
    ]).toArray();

    res.json({
      success: true,
      data: loginsByDay.map(item => ({
        date: `${item._id.day}/${item._id.month}/${item._id.year}`,
        count: item.count
      }))
    });
  } catch (error) {
    console.error("Error en gráfico logins por día:", error);
    res.status(500).json({ success: false, message: "Error interno" });
  }
};
