import { driverService } from "./driver.service.js";
// create driver Profile
export const createProfile = async(req,res)=>{
    try {
        const userId = req.user._id ; 
        const profileData = req.body ;

        const driver =await driverService.createProfile(userId,profileData) ;
        if(!driver){
            throw new Error(' driver create profile is not found')
        }
        res.status(201).json({
            success:true ,
            data:driver ,
            message:"Driver Profile created SuccessFully"
        })
        console.log("successfull createProfile", driver) ;
        
    } catch (error) {
         console.error('Error in createProfile:', error);
         res.status(500).json({
            success: false,
            message: error.message || 'Failed to create driver profile'
        });
    }
}
// GetProfile Driver 
export  const getProfile = async(req,res)=>{
    try {
        const userId = req.user._id ;
        const driver = await driverService.getProfile(userId) ;
        
          res.status(200).json({
            success: true,
            data: driver,
            message: 'Driver profile retrieved successfully'
        });
        
    } catch (error) {

        console.log("Error in getProfile")
                res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve driver profile'
        });

    }
}
// Update Driver Profile
export const updateProfile = async(req,res)=>{
    try {
        const userId = req.user._id ;
        const updateData = req.body ;
const driver = await driverService.updateProfile(userId,updateData) ;
          res.status(200).json({
            success:true ,
            data:true ,
            message:'Profile updata successFully '
          }) ;

    } catch (error) {
           console.log("Error in UpdateProfile:",error)

          res.status(500).json({
            success: false,
            message: error.message || 'Failed to update driver profile'
        });
    }
}

export  const updateStatus = async(req,res)=>{
    try {
        const userId = req.user._id ;
        const {isOnline} = req.body ;
        const driver = await driverService.updateStatus(userId,isOnline) ;

        res.status(200).json({
            success:true ,
            data:driver ,
            message:`Status Update to ${isOnline ? 'ONLINE' :'OFFLINE'}`
        })
    } catch (error) {
          res.status(500).json({
            success: false,
            message: error.message || 'Failed to update driver status'
        });
    }
}

export const getProfileCompletion =async(req,res)=>{
try {
    const userId = req.user._id ;
const completion = await driverService.getProfileCompletion(userId) ;
res.status(200).json({
    success:true ,
    data:completion ,
    message:" profile completion details"
})
    
} catch (error) {
    console.log('Error in getProfileCompletion') ;
    res.status(500).json({
        success:false ,
        message:"failed to get profile completion details"|| error.message 
    })
}
}