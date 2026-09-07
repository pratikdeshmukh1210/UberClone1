// import express from 'express'
// import { authenticate, authorizeRole } from "../../common/middleware/auth.middleware.js";
// import { validate } from "../../common/middleware/auth.validate.js";
// import {
//   acceptJourney,
//   cancelJourney,
//   completeJourney,
//   createJourney,
//   generatePaymentQR,
//   getDriverJourneys,
//   getJourneyById,
//   getRiderJourneys,
//   updateJourneyStatus
// } from "./journey.controller.js";
// import { updateJourneyStatusSchema, completeJourneySchema } from "./journey.validation.js";

// const router = express.Router();

// // CREATE JOURNEY
// router.post("/create", authenticate, createJourney);

// // GET JOURNEY BY ID
// router.get("/:journeyId", authenticate, getJourneyById);

// // RIDER HISTORY
// router.get("/rider/history", authenticate, getRiderJourneys);

// // DRIVER HISTORY
// router.get("/driver/history", authenticate, authorizeRole("DRIVER"), getDriverJourneys);

// // CANCEL JOURNEY
// router.post("/:journeyId/cancel", authenticate, cancelJourney);

// // PAYMENT QR
// router.post("/:journeyId/payment-qr", authenticate, generatePaymentQR);

// // ACCEPT JOURNEY
// router.post("/:journeyId/accept", authenticate, authorizeRole("DRIVER"), acceptJourney);

// // UPDATE STATUS (driver only)
// router.patch("/:journeyId/status",
//     authenticate,
//     authorizeRole("DRIVER"),
//     validate(updateJourneyStatusSchema),
//     updateJourneyStatus 
// );

// // COMPLETE JOURNEY
// router.post("/:journeyId/complete",
//     authenticate,
//     authorizeRole("DRIVER"),
//     validate(completeJourneySchema),
//     completeJourney
// );



import express from 'express';
import {
    createJourney,
    acceptJourney,
    updateJourneyStatus,
    completeJourney,
    cancelJourney,
    getJourneyById,
    getRiderJourneys,
    getDriverJourneys,
    getAvailableJourneys,
    generatePaymentQR,
    confirmPayment
} from './journey.controller.js';
import { authenticate, authorizeRole } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/auth.validate.js';
import {
    createJourneySchema,
    updateJourneyStatusSchema,
    completeJourneySchema,
    cancelJourneySchema
} from './journey.validation.js';

// ============================================
// JOURNEY ROUTES
// ============================================
// All routes require authentication
// Base path: /api/journey (mounted in app.js)
//
// Route Flow:
// 1. Request comes in
// 2. authenticate middleware → Verify JWT token
// 3. authorizeRole middleware → Check user role (if needed)
// 4. validate middleware → Validate request data (if applicable)
// 5. Controller function → Handle request
//
// Middleware Order Matters:
// - authenticate MUST come before authorizeRole (need user data first)
// - validate MUST come before controller (validate data first)

const router = express.Router();

// ============================================
// DRIVER & AVAILABLE JOURNEYS ROUTES (Static GET routes first)
// ============================================

// GET /api/journey/available
// Access: Private (Driver/Rider)
// Purpose: Get all pending journey requests
router.get(
    '/available',
    authenticate,                           // Verify JWT token
    getAvailableJourneys                    // Controller function
);

// GET /api/journey/rider/history
// Access: Private (Any rider)
// Purpose: Get rider's journey history
router.get(
    '/rider/history',
    authenticate,                           // Verify JWT token
    getRiderJourneys                        // Controller function
);

// GET /api/journey/driver/history
// Access: Private (Any driver)
// Purpose: Get driver's journey history
router.get(
    '/driver/history',
    authenticate,                           // Verify JWT token
    authorizeRole('DRIVER'),                // Ensure user is DRIVER
    getDriverJourneys                       // Controller function
);

// ============================================
// RIDER & JOURNEY ACTION ROUTES
// ============================================

// POST /api/journey/create
router.post(
    '/create',
    authenticate,                           // Verify JWT token
    validate(createJourneySchema),          // Validate request body
    createJourney                           // Controller function
);

// GET /api/journey/:journeyId
// Note: Must be placed AFTER static GET routes (/available, /rider/history, /driver/history)
router.get(
    '/:journeyId',
    authenticate,                           // Verify JWT token
    getJourneyById                          // Controller function
);

// POST /api/journey/:journeyId/cancel
router.post(
    '/:journeyId/cancel',
    authenticate,                           // Verify JWT token
    validate(cancelJourneySchema),          // Validate request body
    cancelJourney                           // Controller function
);

// GET /api/journey/:journeyId/payment-qr
router.get(
    '/:journeyId/payment-qr',
    authenticate,                           // Verify JWT token
    generatePaymentQR                       // Controller function
);

// POST /api/journey/:journeyId/confirm-payment
router.post(
    '/:journeyId/confirm-payment',
    authenticate,                           // Verify JWT token
    confirmPayment                          // Controller function
);

// POST /api/journey/:journeyId/accept
router.post(
    '/:journeyId/accept',
    authenticate,                           // Verify JWT token
    authorizeRole('DRIVER'),                // Ensure user is DRIVER
    acceptJourney                           // Controller function
);

// PATCH /api/journey/:journeyId/status
router.patch(
    '/:journeyId/status',
    authenticate,                           // Verify JWT token
    validate(updateJourneyStatusSchema),    // Validate request body
    updateJourneyStatus                     // Controller function
);

// POST /api/journey/:journeyId/complete
router.post(
    '/:journeyId/complete',
    authenticate,                           // Verify JWT token
    validate(completeJourneySchema),        // Validate request body
    completeJourney                         // Controller function
);

// ============================================
// EXPORT ROUTER
// ============================================
export default router;