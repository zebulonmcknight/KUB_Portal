import { Router } from 'express';
import { profile } from './controllers/account.controller';
import { login } from './controllers/auth.controller';
import { payment } from './controllers/billing.controller';

import { get_user_by_email } from './controllers/user.controller';

const router = Router(); 

router.post('/auth/login', login);
router.post('/billing/payment', payment);
router.post('/account/profile', profile); 
router.get('/user/get_user', get_user_by_email)

export default router; 