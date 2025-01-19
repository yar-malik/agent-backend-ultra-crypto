"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateApiKey_1 = require("../middleware/validateApiKey");
const validateRequest_1 = require("../middleware/validateRequest");
const callsValidator_1 = require("../validators/callsValidator");
const callsController_1 = require("../controllers/callsController");
const router = (0, express_1.Router)();
// Apply validateApiKey middleware to all routes
router.use(validateApiKey_1.validateApiKey);
router.get('/', callsController_1.listCalls);
router.post('/', (0, validateRequest_1.validateRequest)(callsValidator_1.createCallValidator), callsController_1.createCall);
router.get('/:callId', callsController_1.getCall);
router.get('/:callId/messages', callsController_1.getCallMessages);
router.get('/:callId/recording', callsController_1.getCallRecording);
exports.default = router;
