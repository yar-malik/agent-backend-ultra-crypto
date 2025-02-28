"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = require("../middleware/validateRequest");
const authValidator_1 = require("../validators/authValidator");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/register', (0, validateRequest_1.validateRequest)(authValidator_1.registerValidator), authController_1.register);
router.post('/login', (0, validateRequest_1.validateRequest)(authValidator_1.loginValidator), authController_1.login);
exports.default = router;
