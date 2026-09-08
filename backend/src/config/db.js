import {env} from './env.js'
import mongoose from 'mongoose'
import { User } from '../modules/model/user.model.js';

export const connectDb = async () => {
    try { 
        await mongoose.connect(env.MONGODB_URL);
        console.log("MongoDB is connected successfully ", mongoose.connection.host);
        User.syncIndexes().catch(err => console.error("Index sync background warning:", err.message));
    } catch (error) {
        console.error("MongoDB connection Failed", error.message);
        console.error("stack trace:", error.stack);
        process.exit(1); 
    }
};
