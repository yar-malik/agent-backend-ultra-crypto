"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const voice_types_1 = require("../types/voice.types");
const errorHandler = (error, req, res, next) => {
    if (error instanceof voice_types_1.VoiceNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
    }
    if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
        return;
    }
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
};
exports.errorHandler = errorHandler;
