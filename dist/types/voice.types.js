"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceNotFoundError = void 0;
class VoiceNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'VoiceNotFoundError';
    }
}
exports.VoiceNotFoundError = VoiceNotFoundError;
