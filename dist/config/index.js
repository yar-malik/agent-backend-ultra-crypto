"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.ULTRAVOX_API_KEY) {
    throw new Error('ULTRAVOX_API_KEY must be set in environment variables');
}
exports.config = {
    PORT: process.env.PORT || 5500,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/voice-backend',
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    ULTRAVOX_API_KEY: process.env.ULTRAVOX_API_KEY,
    ULTRAVOX_BASE_URL: process.env.ULTRAVOX_BASE_URL || 'https://api.ultravox.ai'
};
