import { Router } from 'express';

// always use format 'import { ENDPOINT } from PATH;' rather than 
// 'const endpoint = require(PATH);', both work, but stylistic guidelines 
// dictate that we choose one format and stick with it.  
import { profile } from './controllers/account.controller';
import * as authController from './controllers/auth.controller';
import {
   addPaymentMethod,
   cancelAutoPay,
   enrollAutoPay,
   getCurrentBill,
   getPaymentMethodsController,
   newCustomerSubscription,
   payInvoice,
   removePaymentMethodController,
   setDefaultPaymentMethodController,
   setupAutoPay,
   submitUsage
} from './controllers/billing.controller';
import { get_user_by_email } from './controllers/user.controller';
import { checkJwt, extractUserID } from './middleware/auth';


// Express router object, this object acts as a router for API requests 
// by using router.post and router.get methods. These methods take in a 
// relative file path and the object form of an API endpoint.
// This router file is the starting point for all API calls in the backend, 
// so you can trace the logic of a call and understand what is returned by following
// the relative path to the appropriate file. 
const router = Router(); 

router.post('/auth/login', authController.login); 
router.post('/auth/signup', authController.signup); 
router.post('/auth/resetPassword', authController.resetPassword);
router.post('/auth/verifyKubAccount', authController.verifyKubAccount); 

router.post('/billing/newCustomerSubscription', checkJwt, extractUserID, newCustomerSubscription);
router.post('/billing/autopay/setup', checkJwt, extractUserID, setupAutoPay);
router.post('/billing/autopay/enroll', checkJwt, extractUserID, enrollAutoPay);
router.post('/billing/autopay/cancel', checkJwt, extractUserID, cancelAutoPay);
router.post('/billing/submitUsage', checkJwt, extractUserID, submitUsage);
router.post('/billing/payInvoice', checkJwt, extractUserID, payInvoice);
router.post('/billing/paymentMethods/add', checkJwt, extractUserID, addPaymentMethod);
router.post('/billing/paymentMethods/remove', checkJwt, extractUserID, removePaymentMethodController);
router.post('/billing/paymentMethods/setDefault', checkJwt, extractUserID, setDefaultPaymentMethodController);

router.post('/account/profile', profile); 

router.get('/user/get_user', checkJwt, extractUserID, get_user_by_email);  
router.get('/billing/getCurrentBill', checkJwt, extractUserID, getCurrentBill);
router.get('/billing/paymentMethods', checkJwt, extractUserID, getPaymentMethodsController);

export default router;