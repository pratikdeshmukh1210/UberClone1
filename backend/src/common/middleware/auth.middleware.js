import jwt from "jsonwebtoken";
import { env } from '../../config/env.js';
import { User } from "../../modules/model/user.model.js";
import { Driver } from "../../modules/model/driver.model.js";   // already hai

export const authenticate = async (req, res, next) => {

const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith('Bearer ')) {  
    return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
    });
}

const token = authHeader.split(' ')[1];

try {   
    const decoded = jwt.verify(token, env.JWT_SECRET); 
        
    const user = await User.findById(decoded._id);
        
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token. User not found.'
        });
    }
        
    if (!user.isActive) {
        return res.status(403).json({
            success: false,
            message: 'Account is deactivated.'
        });
    }
        
    req.user = user;

    const driver = await Driver.findOne({ userId: user._id });
    req.user.driver = driver || null;
    if (driver && req.user.role !== 'DRIVER') {
        req.user.role = 'DRIVER';
    }

    next();
        
} catch (error) {
    return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
    });
}
};


export const authorizeRole = (...allRequiredRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const isDriver = req.user.role === 'DRIVER' || !!req.user.driver;
        if (allRequiredRoles.includes('DRIVER') && isDriver) {
            return next();
        }

        if (!allRequiredRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${allRequiredRoles.join(', ')} can access this resource`
            });
        }

        next();
    };
}