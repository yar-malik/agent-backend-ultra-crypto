import axios from 'axios';
import { config } from '../config';
import { AppError } from '../utils/AppError';
import { Call, ICall } from '../models/Call';
import { Types } from 'mongoose';


if (!config.ULTRAVOX_API_KEY) {
    throw new Error('ULTRAVOX_API_KEY must be set in environment variables');
}

const ultravoxApi = axios.create({
    baseURL: config.ULTRAVOX_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.ULTRAVOX_API_KEY
    }
});
export const ultravoxVoice = {
    async getAllVoices() {
        const response = await ultravoxApi.get(`/voices`);
        return response.data;
    }
};
