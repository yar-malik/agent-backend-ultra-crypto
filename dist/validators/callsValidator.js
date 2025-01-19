"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCallValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const call_1 = require("../types/call");
exports.createCallValidator = joi_1.default.object({
    systemPrompt: joi_1.default.string().required(),
    temperature: joi_1.default.number().min(0).max(1).default(0.0),
    callId: joi_1.default.string().allow(null),
    voice: joi_1.default.string().allow(null),
    languageHint: joi_1.default.string().allow(null),
    maxDuration: joi_1.default.string().pattern(/^\d+(\.\d+)?s$/),
    timeExceededMessage: joi_1.default.string(),
    recordingEnabled: joi_1.default.boolean().default(false),
    firstSpeaker: joi_1.default.string().valid(...Object.values(call_1.FirstSpeaker)),
    initialOutputMedium: joi_1.default.string().valid(...Object.values(call_1.MessageMedium)),
    joinTimeout: joi_1.default.string().pattern(/^\d+s$/),
    transcriptOptional: joi_1.default.boolean().default(true),
    model: joi_1.default.string(),
    priorCallId: joi_1.default.string(),
    assistantId: joi_1.default.object(),
    initialMessages: joi_1.default.array().items(joi_1.default.object({
        role: joi_1.default.string().valid(...Object.values(call_1.MessageRole)).required(),
        text: joi_1.default.string().required()
    })),
    inactivityMessages: joi_1.default.array().items(joi_1.default.object({
        duration: joi_1.default.string().pattern(/^\d+(\.\d+)?s$/).required(),
        message: joi_1.default.string().required(),
        endBehavior: joi_1.default.string().valid(...Object.values(call_1.EndBehavior))
            .default(call_1.EndBehavior.END_BEHAVIOR_UNSPECIFIED)
    }))
});
