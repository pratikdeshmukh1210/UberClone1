import 'dotenv/config'
import app from './app.js' 
import {env} from './config/env.js';
import { connectDb } from './config/db.js';
const startServer = async () =>{
try {
    await connectDb() ;
    app.listen(env.PORT,()=>{
    
    console.log(`server running on port ${env.PORT} by ${env.AUTHOR_NAME}`) ;
    

}) ;
    
} catch (error) {
    console.error("failed to start server" ,error.message) ;
    process.exit(1) ;
}

}

startServer() ;



