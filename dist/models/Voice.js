"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const voiceSchema = new mongoose_1.Schema({
    assistantId: { type: String },
    content: { type: String },
    firstMessage: { type: String },
    backchannelingEnabled: { type: Boolean, default: false },
    backgroundDenoisingEnabled: { type: Boolean, default: false },
    fillerInjectionEnabled: { type: Boolean, default: false },
    optimizeStreamingLatency: { type: String },
    style: { type: String },
    name: { type: String },
    userId: { type: String, },
    voicemailMessage: { type: String },
    endCallMessage: { type: String },
    useSpeakerBoost: { type: Boolean, default: false },
    forwardingPhoneNumber: { type: String },
    similarityBoost: { type: Number },
    Stability: { type: Number },
    backgroundSound: { type: String },
    providerId: { type: String },
    provider: { type: String },
    language: { type: String },
    selectedCategory: { type: String },
    selectedVoice: { type: mongoose_1.Schema.Types.Mixed },
    calendarAvailability: {
        name: { type: String },
        time: { type: String },
        description: { type: String },
        apiKey: { type: String },
        eventTypeId: { type: String },
        timezone: { type: String },
        assistantId: { type: String }
    },
    selectedModel: { type: String },
    fileIds: [{ type: mongoose_1.Schema.Types.Mixed }],
    toolIds: [{ type: mongoose_1.Schema.Types.Mixed }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('Voice', voiceSchema);
