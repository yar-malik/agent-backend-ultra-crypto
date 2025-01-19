import { Request, Response, NextFunction } from 'express';
import { toolsService } from '../services/toolsService';
import { phoneCallService } from '../services/phoneCallService';
import { AppError } from '../utils/AppError';

export const toolsController = {
    async createTool(req: Request, res: Response, next: NextFunction) {
        try {
            const tool = await toolsService.createTool(req.body);
            res.status(201).json(tool);
        } catch (error) {
            next(error);
        }
    },

    async getAllTools(req: Request, res: Response, next: NextFunction) {
        try {
            const tools = await toolsService.getAllTools();
            res.json(tools);
        } catch (error) {
            next(error);
        }
    },

    async getTool(req: Request, res: Response, next: NextFunction) {
        try {
            const tool = await toolsService.getTool(req.params.toolId);
            res.json(tool);
        } catch (error) {
            next(error);
        }
    },

    async updateTool(req: Request, res: Response, next: NextFunction) {
        try {
            const tool = await toolsService.updateTool(req.params.toolId, req.body);
            res.json(tool);
        } catch (error) {
            next(error);
        }
    },

    async deleteTool(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await toolsService.deleteTool(req.params.toolId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async makePhoneCall(req: Request, res: Response, next: NextFunction) {
        try {
            const { 
                phoneNumber, 
                systemPrompt, 
                voice, 
                temperature, 
                firstSpeaker 
            } = req.body;

            // Validate input
            if (!phoneNumber) {
                throw new AppError('Phone number is required', 400);
            }

            // Initiate the call
            const callResult = await phoneCallService.initiateCall({
                phoneNumber,
                systemPrompt,
                voice,
                temperature,
                firstSpeaker
            });

            res.status(200).json({
                success: true,
                message: 'Call initiated successfully',
                data: callResult
            });
        } catch (error) {
            next(error);
        }
    }
}; 