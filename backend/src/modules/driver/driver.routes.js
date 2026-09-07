import express from 'express' ;
import { authenticate ,authorizeRole } from '../../common/middleware/auth.middleware.js';
import { createDriverProfileSchema, updateDriverProfileSchema } from './driver.validation.js';
import { createProfile, getProfile, getProfileCompletion, updateProfile, updateStatus } from './driver.controller.js';
import {validate} from '../../common/middleware/auth.validate.js' ;
const router = express.Router() ;



router.post
("/register"
     ,authenticate
      ,validate(createDriverProfileSchema)
      ,createProfile ,
)

router.get("/me/completion" ,authenticate ,
    authorizeRole('DRIVER') ,
    getProfileCompletion,
)

router.patch('/me/status',
    authenticate,
    authorizeRole("DRIVER"),
    validate(updateDriverProfileSchema) ,
    updateStatus ,

)

router.get('/me',authenticate,
    // authorizeRole("DRIVER"),
getProfile) ;

router.patch('/me',authenticate,  
    // update only subpart {
//   "vehicleColor": "Red"
// }
    authorizeRole('DRIVER'),
    validate(updateDriverProfileSchema),
    updateProfile) ;

export default router ;