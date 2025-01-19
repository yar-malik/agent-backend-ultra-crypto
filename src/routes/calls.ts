import { Router } from 'express';
import { validateApiKey } from '../middleware/validateApiKey';
import { validateRequest } from '../middleware/validateRequest';
import { createCallValidator } from '../validators/callsValidator';
import {
    listCalls,
    createCall,
    getCall,
    getCallMessages,
    getCallRecording
} from '../controllers/callsController';

const router = Router();

// Apply validateApiKey middleware to all routes
router.use(validateApiKey);

router.get('/', listCalls);
router.post('/', validateRequest(createCallValidator), createCall);
router.get('/:callId', getCall);
router.get('/:callId/messages', getCallMessages);
router.get('/:callId/recording', getCallRecording);

export default router;