"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            code: err.statusCode,
        });
    }
    console.error('Error:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 500,
    });
};
exports.errorHandler = errorHandler;
