import { Router } from 'express';
import { validateRequest } from '../middleware/validateRequest';
import { registerValidator, loginValidator } from '../validators/authValidator';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', validateRequest(registerValidator), register);
router.post('/login', validateRequest(loginValidator), login);

export default router;