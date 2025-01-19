"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const calls_1 = __importDefault(require("./routes/calls"));
const errorHandler_1 = require("./middleware/errorHandler");
const voice_routes_1 = __importDefault(require("./routes/voice.routes"));
const Voices_1 = __importDefault(require("./routes/Voices"));
const tools_routes_1 = __importDefault(require("./routes/tools.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://dev.callsupport.ai'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/calls', calls_1.default);
app.use('/api/v1/voices', voice_routes_1.default);
app.use('/api/v1/voicelist', Voices_1.default);
app.use('/api/tools', tools_routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
exports.default = app;
