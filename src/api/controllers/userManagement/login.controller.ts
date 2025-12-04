import { Request, Response } from 'express';
import { connectDB } from '../../../config/db/mongoClient';
import bcrypt from 'bcryptjs';
import { generarToken } from '../../../utils/generadorToken';
import * as activityService from '../../../services/activities.service';


// GOOGLE
import {
  verifyGoogleToken,
  findUserByEmail as findGoogleUserByEmail,
} from "../../../services/userManagement/google.service";

// GITHUB
import {
  verifyGithubToken,
  findUserByEmail as findGithubUserByEmail,
} from "../../../services/userManagement/github.service";

// DISCORD
import {
  verifyDiscordToken,
  findUserByDiscordId,
} from "../../../services/userManagement/discord.service";

import fetch from "node-fetch";

/* ----------------------------- Login por correo ----------------------------- */

export const loginUsuario = async (req: Request, res: Response) => {
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

    const emailProvider = user.authProviders.find(
      (p: any) => p.provider === "email" && p.providerId === email
    );

    if (!emailProvider || !emailProvider.password) {
      return res.status(400).json({
        success: false,
        message: "El método de correo no tiene contraseña registrada",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      emailProvider.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const userPicture = user.url_photo || null;

    const sessionToken = generarToken(
      user._id.toString(),
      user.name || "Usuario",
      email,
      user.role,       // ✔ AHORA SÍ ENVÍAS EL ROLE REAL
      userPicture
    );

    await activityService.createSimpleActivity({
      userId: user._id,
      date: new Date(),
      role: user.role,
      type: "session_start",
      metadata: { resumed: true },
    });

    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token: sessionToken,
      user: {
        _id: user._id.toString(),
        name: user.name || "Usuario",
        email,
        role: user.role,           // ✔ DEVUELVES EL ROLE CORRECTO
        picture: userPicture,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión con correo:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/* ----------------------------- Login con Google ----------------------------- */

export const loginGoogle = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token no recibido",
    });
  }

  try {
    const googleUser = await verifyGoogleToken(token);

    if (!googleUser || !googleUser.email) {
      return res.status(400).json({
        success: false,
        message: "Token inválido",
      });
    }

    const dbUser = await findGoogleUserByEmail(googleUser.email);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no registrado. Por favor regístrate.",
      });
    }

    const sessionToken = generarToken(
      dbUser._id.toString(),
      dbUser.name,
      dbUser.email,
      dbUser.role,           // ✔ AHORA SÍ ENVÍAS EL ROLE REAL
      dbUser.url_photo
    );

    await activityService.createSimpleActivity({
      userId: dbUser._id,
      date: new Date(),
      role: dbUser.role,
      type: "session_start",
      metadata: { resumed: true },
    });
    
    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token: sessionToken,
      user: {
        _id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,          // ✔ ROLE CORRECTO
        picture: dbUser.url_photo,
      },
    });
  } catch (error) {
    console.error("Error en loginGoogle:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/* ----------------------------- Login con GitHub ----------------------------- */

export const loginGithub = async (req: Request, res: Response) => {
  const { code } = req.body as { code?: string };

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Código de GitHub no recibido",
    });
  }

  try {
    const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
    const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: `${FRONTEND_URL}/login?provider=github`,
    });

    const tokenResp = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: { Accept: "application/json" },
        body: params,
      }
    );

    const tokenData = (await tokenResp.json()) as any;

    if (!tokenResp.ok || !tokenData.access_token) {
      console.error("Error al obtener token de GitHub:", tokenData);
      return res.status(400).json({
        success: false,
        message: "No se pudo obtener el token de GitHub.",
      });
    }

    const accessToken = tokenData.access_token as string;

    const githubUser = await verifyGithubToken(accessToken);

    if (!githubUser || !githubUser.email) {
      return res.status(400).json({
        success: false,
        message: "Token inválido o usuario sin email en GitHub.",
      });
    }

    const dbUser = await findGithubUserByEmail(githubUser.email);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no registrado. Por favor regístrate.",
      });
    }

    const sessionToken = generarToken(
      dbUser._id.toString(),
      dbUser.name,
      dbUser.email,
      dbUser.role,        // ✔ CORREGIDO
      dbUser.url_photo
    );

    await activityService.createSimpleActivity({
      userId: dbUser._id,
      date: new Date(),
      role: dbUser.role,
      type: "session_start",
      metadata: { resumed: true },
    });

    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token: sessionToken,
      user: {
        _id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        picture: dbUser.url_photo,
      },
    });
  } catch (error) {
    console.error("Error en loginGithub:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/* ----------------------------- Login con Discord ----------------------------- */

export const loginDiscord = async (req: Request, res: Response) => {
  const { token, code } = req.body as { token?: string; code?: string };

  if (!token && !code) {
    return res.status(400).json({
      success: false,
      message: "Token o código no recibido",
    });
  }

  try {
    let accessToken = token;

    if (!accessToken && code) {
      const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
      const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
      const FRONTEND_URL = process.env.FRONTEND_URL!;

      const redirectUri = `${FRONTEND_URL}/login?provider=discord`;

      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      });

      const tokenResp = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      const tokenData = (await tokenResp.json()) as any;

      if (!tokenResp.ok || !tokenData.access_token) {
        console.error("Error al intercambiar code por token en Discord:", tokenData);
        return res.status(400).json({
          success: false,
          message: "No se pudo obtener el token de Discord.",
        });
      }

      accessToken = tokenData.access_token;
    }

    const discordUser = await verifyDiscordToken(accessToken!);

    if (!discordUser || !discordUser.discordId) {
      return res.status(400).json({
        success: false,
        message: "Token inválido",
      });
    }

    const dbUser = await findUserByDiscordId(discordUser.discordId);

    if (!dbUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no registrado. Por favor regístrate.",
      });
    }

    const sessionToken = generarToken(
      dbUser._id.toString(),
      dbUser.name,
      dbUser.email,
      dbUser.role,       // ✔ CORREGIDO
      dbUser.url_photo
    );

    await activityService.createSimpleActivity({
      userId: dbUser._id,
      date: new Date(),
      role: dbUser.role,
      type: "session_start",
      metadata: { resumed: true },
    });

    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token: sessionToken,
      user: {
        _id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        picture: dbUser.url_photo,
      },
    });
  } catch (error) {
    console.error("Error en loginDiscord:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
