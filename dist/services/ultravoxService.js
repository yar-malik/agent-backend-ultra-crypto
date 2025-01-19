"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ultravoxService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const AppError_1 = require("../utils/AppError");
const Call_1 = require("../models/Call");
const mongoose_1 = require("mongoose");
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
exports.ultravoxService = {
    async createCall(params, userId) {
        var _a, _b, _c;
        try {
            // Create call in Ultravox
            const response = await ultravoxApi.post('/calls', params);
            const ultravoxCall = response.data;
            // Store call in database
            const call = await Call_1.Call.create({
                callId: ultravoxCall.callId,
                userId: new mongoose_1.Types.ObjectId(userId),
                created: ultravoxCall.created,
                ended: ultravoxCall.ended,
                model: ultravoxCall.model,
                systemPrompt: ultravoxCall.systemPrompt,
                temperature: ultravoxCall.temperature,
                voice: ultravoxCall.voice,
                languageHint: ultravoxCall.languageHint,
                maxDuration: ultravoxCall.maxDuration || '3600s',
                joinUrl: ultravoxCall.joinUrl,
                recordingEnabled: ultravoxCall.recordingEnabled || false,
                status: 'created'
            });
            return call;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new AppError_1.AppError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to create call', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
            }
            throw error;
        }
    },
    async getCall(callId) {
        var _a, _b, _c;
        try {
            // Get call from database
            const call = await Call_1.Call.findOne({ callId });
            if (!call) {
                throw new AppError_1.AppError('Call not found', 404);
            }
            // Get updated status from Ultravox
            const response = await ultravoxApi.get(`/calls/${callId}`);
            const ultravoxCall = response.data;
            // Update call in database if needed
            if (ultravoxCall.ended && !call.ended) {
                call.ended = ultravoxCall.ended;
                call.status = 'ended';
                await call.save();
            }
            return Object.assign({}, call.toObject());
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new AppError_1.AppError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to get call', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
            }
            throw error;
        }
    },
    async listCalls(userId) {
        try {
            // Get calls from database
            const calls = await Call_1.Call.find({ userId }).sort({ createdAt: -1 });
            return calls;
        }
        catch (error) {
            throw new AppError_1.AppError('Failed to list calls', 500);
        }
    },
    async getCallMessages(callId) {
        const response = await ultravoxApi.get(`/calls/${callId}/messages`);
        return response.data;
    },
    async getCallRecording(callId) {
        var _a, _b, _c;
        try {
            const call = await Call_1.Call.findOne({ callId });
            if (!call) {
                throw new AppError_1.AppError('Call not found', 404);
            }
            if (!call.recordingEnabled) {
                throw new AppError_1.AppError('Recording was not enabled for this call', 400);
            }
            const response = await ultravoxApi.get(`/calls/${callId}/recording`);
            // Update recording URL in database if available
            if (response.data.url && !call.recordingUrl) {
                call.recordingUrl = response.data.url;
                await call.save();
            }
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                throw new AppError_1.AppError(((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to get recording', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
            }
            throw error;
        }
    },
    async findOrCreateCall(callData, userId) {
        // First check if a call exists with the same parameters
        const existingCall = await Call_1.Call.findOne({
            userId,
            systemPrompt: callData.systemPrompt,
            // Add other relevant parameters to match
        });
        if (existingCall) {
            return existingCall;
        }
        // If no existing call found, create a new one
        return this.createCall(callData, userId);
    }
};
