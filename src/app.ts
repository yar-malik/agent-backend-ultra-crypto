import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import callsRoutes from './routes/calls';
import { errorHandler } from './middleware/errorHandler';
import voiceRoutes from './routes/voice.routes';
import VoiceList from "./routes/Voices"
import toolsRoutes from './routes/tools.routes';
const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'https://dev.callsupport.ai'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/calls', callsRoutes);
app.use('/api/v1/voices', voiceRoutes);
app.use('/api/v1/voicelist', VoiceList);
app.use('/api/tools', toolsRoutes);
// Error handling
app.use(errorHandler);

export default app;