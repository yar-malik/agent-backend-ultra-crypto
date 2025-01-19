"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = require("../middleware/validateRequest");
const adminController_1 = require("../controllers/adminController");
const adminValidator_1 = require("../validators/adminValidator");
const router = (0, express_1.Router)();
router.post('/users/:userId/ultravox-key', (0, validateRequest_1.validateRequest)(adminValidator_1.setUltravoxApiKeyValidator), adminController_1.setUltravoxApiKey);
exports.default = router;
