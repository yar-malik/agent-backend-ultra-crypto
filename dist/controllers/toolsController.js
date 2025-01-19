"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsController = void 0;
const toolsService_1 = require("../services/toolsService");
exports.toolsController = {
    async createTool(req, res, next) {
        try {
            const tool = await toolsService_1.toolsService.createTool(req.body);
            res.status(201).json(tool);
        }
        catch (error) {
            next(error);
        }
    },
    async getAllTools(req, res, next) {
        try {
            const tools = await toolsService_1.toolsService.getAllTools();
            res.json(tools);
        }
        catch (error) {
            next(error);
        }
    },
    async getTool(req, res, next) {
        try {
            const tool = await toolsService_1.toolsService.getTool(req.params.toolId);
            res.json(tool);
        }
        catch (error) {
            next(error);
        }
    },
    async updateTool(req, res, next) {
        try {
            const tool = await toolsService_1.toolsService.updateTool(req.params.toolId, req.body);
            res.json(tool);
        }
        catch (error) {
            next(error);
        }
    },
    async deleteTool(req, res, next) {
        try {
            const result = await toolsService_1.toolsService.deleteTool(req.params.toolId);
            res.json(result);
        }
        catch (error) {
            next(error);
        }
    }
};
