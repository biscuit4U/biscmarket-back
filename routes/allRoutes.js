import express from 'express';
import { register } from '../controllers/signup.js';
import { verifyEmail } from '../controllers/verifyEmail.js';
import { resendOTP } from '../controllers/resendOTP.js';
import { login } from '../controllers/login.js';
import { googleAuth } from '../controllers/googleAuth.js';
import { blockIfLogin } from '../middlewares/blockIfLogged.js';
import { loginRateLimit, refreshRateLimit } from '../middlewares/rateLimit.js';
import { verifyToken } from '../middlewares/verifytoken.js';
import { deleteAccount } from '../controllers/deleteaccount.js';
import { loginValidation } from '../middlewares/loginvalidation.js';
import { signupValidation } from '../middlewares/signupValidation.js';
import { requestPasswordChange, verifyPasswordChangeOTP, changePasswordWithToken, changePasswordAuthenticated } from '../controllers/password.js';
import { validateAuthenticatedPassword, validateOTPandEmail, validatePassword, validateRequestPasswordChange } from '../middlewares/passwordvalidation.js';
import { logOut } from '../controllers/logout.js';
import { resultOfValidation } from '../middlewares/validationResult.js';
import { refreshToken } from '../controllers/refresh.js';
import { qoutes } from '../controllers/qoutes.js';
import { index } from '../controllers/index.js';
import { news } from '../controllers/news.js';
import { movers } from '../controllers/movers.js';
import { autocomplete } from '../controllers/autocomplete.js';
import { calenders } from '../controllers/calenders.js';
const router = express.Router();

//auth routes
router.post('/register', loginRateLimit, blockIfLogin, signupValidation, resultOfValidation, register);
router.post('/verify-email', loginRateLimit, blockIfLogin, verifyEmail);
router.post('/resend-otp', loginRateLimit, blockIfLogin, resendOTP);
router.post('/login', loginRateLimit, blockIfLogin, loginValidation, resultOfValidation, login);
router.post('/google', loginRateLimit, blockIfLogin, googleAuth);
router.post('/refresh', refreshRateLimit, refreshToken)
router.post('/logout', verifyToken, logOut)
router.delete("/delete-account", verifyToken, deleteAccount);


router.post('/password/request-change', validateRequestPasswordChange, requestPasswordChange);
router.post('/password/verify-otp', validateOTPandEmail, verifyPasswordChangeOTP);
router.post('/password/change', validatePassword, changePasswordWithToken);
router.post('/password/reset', verifyToken, validateAuthenticatedPassword, changePasswordAuthenticated);

//data routes
router.get('/index', index)
router.get('/news', news)
router.get('/movers', movers)
router.get('/qoutes', qoutes)
router.get('/autocomplete', autocomplete)
router.get('/calenders', calenders)

export default router;