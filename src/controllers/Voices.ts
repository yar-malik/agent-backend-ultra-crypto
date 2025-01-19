import { Request, Response } from 'express';
import { ultravoxVoice } from '../services/UltravoxVoice';

export const getVoices = async (req: Request, res: Response) => {
    const voices = await ultravoxVoice.getAllVoices();
    res.json(voices);
};

