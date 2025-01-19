"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallRecording = exports.getCallMessages = exports.listCalls = exports.getCall = exports.createCall = void 0;
const AppError_1 = require("../utils/AppError");
const ultravoxService_1 = require("../services/ultravoxService");
const createCall = async (req, res, next) => {
    var _a;
    try {
        const { systemPrompt, temperature = 0.8, voice = null, languageHint = null, maxDuration, recordingEnabled = false, } = req.body;
        if (!systemPrompt) {
            return next(new AppError_1.AppError('System prompt is required', 400));
        }
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new AppError_1.AppError('User not authenticated', 401));
        }
        const call = await ultravoxService_1.ultravoxService.createCall({
            systemPrompt,
            temperature,
            voice,
            languageHint,
            maxDuration,
            recordingEnabled
        }, req.user.id);
        res.status(201).json(call);
    }
    catch (error) {
        if (error.response) {
            return next(new AppError_1.AppError(error.response.data.message || 'Ultravox API error', error.response.status));
        }
        next(error);
    }
};
exports.createCall = createCall;
const getCall = async (req, res, next) => {
    var _a, _b;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new AppError_1.AppError('User not authenticated', 401));
        }
        const { callId } = req.params;
        const call = await ultravoxService_1.ultravoxService.getCall(callId);
        if (call.userId.toString() !== req.user.id) {
            return next(new AppError_1.AppError('Not authorized to access this call', 403));
        }
        res.status(200).json(call);
    }
    catch (error) {
        if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
            return next(new AppError_1.AppError('Call not found', 404));
        }
        next(error);
    }
};
exports.getCall = getCall;
const listCalls = async (req, res, next) => {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return next(new AppError_1.AppError('User not authenticated', 401));
        }
        const calls = await ultravoxService_1.ultravoxService.listCalls(req.user.id);
        res.status(200).json(calls);
    }
    catch (error) {
        next(error);
    }
};
exports.listCalls = listCalls;
const getCallMessages = async (req, res, next) => {
    var _a;
    try {
        const { callId } = req.params;
        const messages = await ultravoxService_1.ultravoxService.getCallMessages(callId);
        res.status(200).json(messages);
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            return next(new AppError_1.AppError('Call not found', 404));
        }
        next(error);
    }
};
exports.getCallMessages = getCallMessages;
const getCallRecording = async (req, res, next) => {
    var _a;
    try {
        const { callId } = req.params;
        const recording = await ultravoxService_1.ultravoxService.getCallRecording(callId);
        res.status(200).json(recording);
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            return next(new AppError_1.AppError('Call not found', 404));
        }
        next(error);
    }
};
exports.getCallRecording = getCallRecording;
