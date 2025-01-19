"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVoices = void 0;
const UltravoxVoice_1 = require("../services/UltravoxVoice");
const getVoices = async (req, res) => {
    const voices = await UltravoxVoice_1.ultravoxVoice.getAllVoices();
    res.json(voices);
};
exports.getVoices = getVoices;
