import { Router } from 'express';
import { getVoices } from '../controllers/Voices';

const router = Router();

router.get('/voices', getVoices);

export default router;