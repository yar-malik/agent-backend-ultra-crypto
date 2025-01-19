import express from 'express';
import {
    createVoice,
    updateVoice,
    getVoiceById,
    deleteVoice,
    getAllVoices
} from '../controllers/AssistantControllers';
import { validateApiKey } from '../middleware/validateApiKey';
const router = express.Router();

router.use(validateApiKey);

router.post('/voices', createVoice);
router.put('/voices/:id', updateVoice);
router.get('/voices/:id', getVoiceById);
router.delete('/voices/:id', deleteVoice);
router.get('/voices', getAllVoices);

export default router;