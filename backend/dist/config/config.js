import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');
dotenv.config({ path: envPath });
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const baseUrl = process.env.BASE_URL ?
    `${process.env.BASE_URL}:${port}` :
    `http://${host}:${port}`;
export const config = {
    port,
    host,
    baseUrl,
    env: process.env.NODE_ENV || 'development'
};
