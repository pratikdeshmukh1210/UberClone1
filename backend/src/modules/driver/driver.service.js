import { User } from "../model/user.model.js";
import { Driver } from "../model/driver.model.js";
class DriverService{

    async createProfile(userId,profileData){
    
       const count = await Driver.countDocuments({userId}) ;
    
        if(count>0){
            throw new Error('Driver profile already exists') ;
        }

       const driverData={
        userId ,
       personalInfo: {
          languagePreference:profileData.languagePreference ,
          city:profileData.city ,
        aadharNumber: profileData.aadharNumber ,
        profilePicture:profileData.profilePicture || null,
    } ,
    documents: {
        rcNumber: profileData.rcNumber ,
        licenseNumber: profileData.licenseNumber ,
        licenseExpiry:profileData.licenseExpiry || null ,
        rcExpiry:profileData.rcExpiry  || null,
    } ,
    vehicleInfo: {
                vehicleType: profileData.vehicleType,
                vehicleNumber: profileData.vehicleNumber || null,
                vehicleModel: profileData.vehicleModel || null,
                vehicleColor: profileData.vehicleColor || null
            } 
}
    const driver =   new Driver(driverData) ;
    await driver.save() ;
    
    // Update user role to DRIVER
    await User.findByIdAndUpdate(userId, { role: 'DRIVER' }, { new: true });
    
    await driver.populate('userId' ,'name email phone role');

    return this.formatDriverResponse(driver);

}
async getProfile(userId){
    const driver = await Driver.findOne({userId})
        .populate('userId','name email phone role') ;

    if(!driver){
        throw new Error('Driver profile not found .Please create your profile first .') ;
    }

    return this.formatDriverResponse(driver) ;
    
}

async updateProfile(userId ,updateData){
    
const existingProfile = await Driver.findOne({userId})
.populate('userId','name email phone role') ;

if(!existingProfile){
    throw new Error('Driver Profile not found .please create your Profile First') ;
}
// personal Info updata
const updates ={} ; // kya change ki isme mil jayega
if(updateData.languagePreference){
    updates['personalInfo.languagePreference'] = updateData.languagePreference ;
}
if(updateData.city){
updateData['personalInfo.city'] = updateData.city ;
}
if(updateData.profilePicture){
    updateData['personalInfo.profilePicture'] = updateData.profilePicture ;
}

// document info update 
        if (updateData.licenseExpiry) {
            updates['documents.licenseExpiry'] = updateData.licenseExpiry;
        }
        if (updateData.rcExpiry) {
            updates['documents.rcExpiry'] = updateData.rcExpiry;
        }
// vehical info update 
        if (updateData.vehicleNumber) {
            updates['vehicleInfo.vehicleNumber'] = updateData.vehicleNumber;
        }
        if (updateData.vehicleModel) {
            updates['vehicleInfo.vehicleModel'] = updateData.vehicleModel;
        }
        if (updateData.vehicleColor) {
            updates['vehicleInfo.vehicleColor'] = updateData.vehicleColor;
        }


        const updatedDriver = await Driver.findOneAndUpdate({userId},{$set:updates},{new:true , runValidators:true
        }).populate('userId','name email phone role')  ;

        return this.formatDriverResponse(updatedDriver) ;

}

async updateStatus(userId ,isOnline){
    const driver = await Driver.findOne({ userId })
            .populate('userId', 'name email phone role');

        if (!driver) {
            // Profile not found → cannot update status
            throw new Error('Driver profile not found');
        }

        if(isOnline && !driver.canGoOnline()){
            if(driver.status.profileCompletionPercentage<70){
                throw new Error ('Profile must be at least 70% complete to go online')
            }
     
            if(!driver.status.isVerified){
                throw new Error('Your Profile is Pending verification .Please wait for admin approval.')
            }

        }

         const updatedDriver = await Driver.findOneAndUpdate(
            { userId },                           // Find condition
            { $set: { 'status.isOnline': isOnline } },  // Update isOnline field
            { new: true }                         // Return updated document
        ).populate('userId', 'name email phone role');

           return this.formatDriverResponse(updatedDriver);
    
}

 async getProfileCompletion(userId) {
     const driver = await Driver.findOne({ userId })
            .populate('userId', 'name email phone role');

        if (!driver) {
            // Profile not found
            throw new Error('Driver profile not found');
        }

         return {
            completionPercentage: driver.status.profileCompletionPercentage,  // 0-100
            missingFields: driver.getMissingFields(),  // Array of missing optional fields
            canGoOnline: driver.canGoOnline(),         // Boolean (can driver go online?)
            isVerified: driver.status.isVerified       // Boolean (is admin verified?)
        };
 }

    formatDriverResponse(driver) {
        return {
            // Driver ID
            _id: driver._id,

            // User basic info (from populated userId)
            user: {
                _id: driver.userId._id,
                name: driver.userId.name,
                email: driver.userId.email,
                phone: driver.userId.phone
            },

            // Personal information
            personalInfo: {
                languagePreference: driver.personalInfo.languagePreference,
                city: driver.personalInfo.city,
                profilePicture: driver.personalInfo.profilePicture,
                aadharNumber: driver.getMaskedAadhar()  // MASKED: XXXX XXXX 9012
            },

            // Documents
            documents: {
                licenseNumber: driver.documents.licenseNumber,
                licenseExpiry: driver.documents.licenseExpiry,
                rcNumber: driver.documents.rcNumber,
                rcExpiry: driver.documents.rcExpiry
            },

            // Vehicle information
            vehicleInfo: {
                vehicleType: driver.vehicleInfo.vehicleType,
                vehicleNumber: driver.vehicleInfo.vehicleNumber,
                vehicleModel: driver.vehicleInfo.vehicleModel,
                vehicleColor: driver.vehicleInfo.vehicleColor
            },

            // Status
            status: {
                isOnline: driver.status.isOnline,
                isVerified: driver.status.isVerified,
                profileCompletionPercentage: driver.status.profileCompletionPercentage
            },

            // Statistics
            stats: {
                rating: driver.stats.rating,
                totalRides: driver.stats.totalRides
            },

            // Timestamps
            createdAt: driver.createdAt,
            updatedAt: driver.updatedAt
        };
    }
}
export const driverService = new DriverService() ;
