import { config } from "./config.js";

const developmentOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'  // Vite default port
];

const productionOrigins = [
    config.baseUrl
];

export const corsOptions = {
    origin: config.env === 'development' 
        ? developmentOrigins 
        : productionOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}