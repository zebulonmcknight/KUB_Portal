import { Router } from 'express';
const loginController = require('./controllers/auth.controller');

const router = Router(); 

router.post('/auth/login', loginController.login); 

export default router; 