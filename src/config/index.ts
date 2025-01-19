import dotenv from 'dotenv';

dotenv.config();

if (!process.env.ULTRAVOX_API_KEY) {
    throw new Error('ULTRAVOX_API_KEY must be set in environment variables');
}

export const config = {
    PORT: process.env.PORT || 5500,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-backend',
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    ULTRAVOX_API_KEY: process.env.ULTRAVOX_API_KEY,
    ULTRAVOX_BASE_URL: process.env.ULTRAVOX_BASE_URL || 'https://api.ultravox.ai',
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER
}; 