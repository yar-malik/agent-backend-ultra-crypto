"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const AppError_1 = require("../utils/AppError");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return next(new AppError_1.AppError(errorMessage, 400));
        }
        next();
    };
};
exports.validateRequest = validateRequest;
