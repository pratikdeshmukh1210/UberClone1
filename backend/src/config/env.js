import dotenv from 'dotenv' ;
dotenv.config() ;



const requiredEnvVars = ['PORT', 'AUTHOR_NAME', 'MONGODB_URL', 'JWT_SECRET', 'ENCRYPTION_KEY', 'GOOGLE_CALLBACK_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(`[WARNING] missing required environment variable: ${envVar}`);
  }
});
export const env = {
    PORT: process.env.PORT || 3000,
    AUTHOR_NAME: process.env.AUTHOR_NAME,
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173"
};
