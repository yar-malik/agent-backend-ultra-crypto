import { Router } from 'express';
import { toolsController } from '../controllers/toolsController';
import { validateApiKey } from '../middleware/validateApiKey';
const router = Router();

router.use(validateApiKey);

router.post('/', toolsController.createTool);
router.get('/', toolsController.getAllTools);
router.get('/:toolId', toolsController.getTool);
router.put('/:toolId', toolsController.updateTool);
router.delete('/:toolId', toolsController.deleteTool);
router.post('/make-call', toolsController.makePhoneCall);

export default router; 