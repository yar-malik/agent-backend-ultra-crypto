"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ultravoxVoice = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
if (!config_1.config.ULTRAVOX_API_KEY) {
    throw new Error('ULTRAVOX_API_KEY must be set in environment variables');
}
const ultravoxApi = axios_1.default.create({
    baseURL: config_1.config.ULTRAVOX_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config_1.config.ULTRAVOX_API_KEY
    }
});
exports.ultravoxVoice = {
    async getAllVoices() {
        const response = await ultravoxApi.get(`/voices`);
        return response.data;
    }
};
