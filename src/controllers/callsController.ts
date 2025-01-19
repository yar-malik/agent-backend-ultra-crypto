import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ultravoxService } from '../services/ultravoxService';

export const createCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            systemPrompt,
            temperature = 0.8,
            voice = null,
            languageHint = null,
            maxDuration,
            recordingEnabled = false,
            
        } = req.body;

        if (!systemPrompt) {
            return next(new AppError('System prompt is required', 400));
        }

        if (!req.user?.id) {
            return next(new AppError('User not authenticated', 401));
        }

        const call = await ultravoxService.createCall({
            systemPrompt,
            temperature,
            voice,
            languageHint,
            maxDuration,
            recordingEnabled
        }, req.user.id);

        res.status(201).json(call);
    } catch (error: any) {
        if (error.response) {
            return next(new AppError(error.response.data.message || 'Ultravox API error', error.response.status));
        }
        next(error);
    }
};

export const getCall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return next(new AppError('User not authenticated', 401));
        }

        const { callId } = req.params;
        const call = await ultravoxService.getCall(callId);
        
        if (call.userId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to access this call', 403));
        }

        res.status(200).json(call);
    } catch (error: any) {
        if (error.response?.status === 404) {
            return next(new AppError('Call not found', 404));
        }
        next(error);
    }
};

export const listCalls = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
            return next(new AppError('User not authenticated', 401));
        }

        const calls = await ultravoxService.listCalls(req.user.id);
        res.status(200).json(calls);
    } catch (error) {
        next(error);
    }
};

export const getCallMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { callId } = req.params;
        const messages = await ultravoxService.getCallMessages(callId);
        res.status(200).json(messages);
    } catch (error: any) {
        if (error.response?.status === 404) {
            return next(new AppError('Call not found', 404));
        }
        next(error);
    }
};

export const getCallRecording = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { callId } = req.params;
        const recording = await ultravoxService.getCallRecording(callId);
        res.status(200).json(recording);
    } catch (error: any) {
        if (error.response?.status === 404) {
            return next(new AppError('Call not found', 404));
        }
        next(error);
    }
};