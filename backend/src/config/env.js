import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    INGEST_SIGNING_KEY: process.env.INGEST_SIGNING_KEY,
    CLAUDINARY_API_KEY: process.env.CLAUDINARY_API_KEY,
    CLAUDINARY_API_SECRET: process.env.CLAUDINARY_API_SECRET,
    CLAUDINARY_CLOUD_NAME: process.env.CLAUDINARY_CLOUD_NAME,
};