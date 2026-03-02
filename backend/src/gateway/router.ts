import { Router } from 'express';

// always use format 'import { ENDPOINT } from PATH;' rather than 
// 'const endpoint = require(PATH);', both work, but stylistic guidelines 
// dictate that we choose one format and stick with it.  
import { profile } from './controllers/account.controller';
//import { login } from './controllers/auth.controller';
//import { signup } from './controllers/auth.controller'; 
import { createBillingCustomer, createBillingCustomerSubscription } from './controllers/billing.controller';
import { get_user_by_email } from './controllers/user.controller';

import * as authController from './controllers/auth.controller';
import { checkJwt, extractUserID } from './middleware/auth';

// Express router object, this object acts as a router for API requests 
// by using router.post and router.get methods. These methods take in a 
// relative file path and the object form of an API endpoint.
// This router file is the starting point for all API calls in the backend, 
// so you can trace the logic of a call and understand what is returned by following
// the relative path to the appropriate file. 
const router = Router(); 

router.post('/auth/login', authController.login); 
router.post('/auth/signup', authController.signup)

router.post('/billing/createBillingCustomer', createBillingCustomer);
router.post('/billing/createBillingCustomerSubscription', createBillingCustomerSubscription);
router.post('/account/profile', profile); 

router.get('/user/get_user', checkJwt, extractUserID, get_user_by_email);  

export default router; 