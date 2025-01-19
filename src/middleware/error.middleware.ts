import { Request, Response, NextFunction } from 'express';
import { VoiceNotFoundError } from '../types/voice.types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof VoiceNotFoundError) {
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