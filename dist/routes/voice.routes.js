"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AssistantControllers_1 = require("../controllers/AssistantControllers");
const validateApiKey_1 = require("../middleware/validateApiKey");
const router = express_1.default.Router();
router.use(validateApiKey_1.validateApiKey);
router.post('/voices', AssistantControllers_1.createVoice);
router.put('/voices/:id', AssistantControllers_1.updateVoice);
router.get('/voices/:id', AssistantControllers_1.getVoiceById);
router.delete('/voices/:id', AssistantControllers_1.deleteVoice);
router.get('/voices', AssistantControllers_1.getAllVoices);
exports.default = router;
