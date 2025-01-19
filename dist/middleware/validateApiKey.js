"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKey = void 0;
const User_1 = require("../models/User");
const AppError_1 = require("../utils/AppError");
const validateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            return next(new AppError_1.AppError('API key is required', 401));
        }
        // Find user by API key
        const user = await User_1.User.findOne({ apiKey });
        if (!user) {
            return next(new AppError_1.AppError('Invalid API key', 401));
        }
        // Attach user to request object
        req.user = {
            id: user._id,
            email: user.email,
            name: user.name,
            domain: user.domain
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateApiKey = validateApiKey;
