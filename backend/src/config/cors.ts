import { config } from "./config.js";

const developmentOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
];

const productionOrigins = [
    'https://tron-walletconnect-1.onrender.com',
    'https://tron-walletconnect.onrender.com'
];

export const corsOptions = {
    origin: config.env === 'production' 
        ? productionOrigins 
        : developmentOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}