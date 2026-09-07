import express from 'express' ;
import authRoutes from './modules/auth/auth.routes.js'
import ProfileRoutes from './modules/profile/profile.routes.js'
import driverRoutes from './modules/driver/driver.routes.js'
import journeyRoutes from './modules/journey/journey.routes.js'
import {swaggerSpec} from './config/swagger.js'
import swaggerUi from 'swagger-ui-express' ;
import cookieParser from 'cookie-parser'
import cors from 'cors' ;
import session from "express-session";
import passport from "./config/passport.js";

const app = express() ;

app.disable('etag');

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.use(express.json()) ;
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()) ;
// app.use(
//   cors({
//     origin:"*" ,
//     credentials:true ,
//   })
// )
const allowedOrigins = [
  "http://localhost:5173",
  "https://uber-clone1-six.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      }
      
      return callback(new Error(`CORS policy violation: Origin ${origin} not allowed`), false);
    },
    credentials: true,
  })
);


// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/api-docs/json'
  }
}));

// Alternative JSON spec endpoint
app.get('/api-docs/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.get('/', (req, res) => {
  res.send('API is running');
});


app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/auth',authRoutes) ;
app.use('/api/profile',ProfileRoutes) ;
app.use('/api/driver',driverRoutes) ;
app.use('/api/journey',journeyRoutes) ;

export default  app ;