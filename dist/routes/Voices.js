"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Voices_1 = require("../controllers/Voices");
const router = (0, express_1.Router)();
router.get('/voices', Voices_1.getVoices);
exports.default = router;
