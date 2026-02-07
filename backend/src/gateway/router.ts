import { Router } from 'express';
const authController = require('./controllers/auth.controller');
const billingController = require('./controllers/billing.controller');
const accountController = require('./controllers/account.controller'); 

const router = Router(); 

router.post('/auth/login', authController.login);
router.post('/billing/payment', billingController.payment);
router.post('/account/profile', accountController.profile); 

export default router; 