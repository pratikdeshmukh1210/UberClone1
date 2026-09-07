import { journeyService } from "./journey.service.js ";

 export const createJourney = async(req,res) =>{
    try {
        const userId =req.user._id;
        const journeyData = req.body ;
        const journey = await journeyService.createJourney(userId,journeyData) ;
        res.status(201).json({
            success:true ,
            data:journey ,
            message:'journey created successfully'
        }) ;

    } catch (error) { 
        console.error('Error in createJourney:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create journey'
        });
    }
};

export const acceptJourney = async (req, res) => {
    try {
        const { journeyId } = req.params;
        let driver = req.user.driver;
        if (!driver || !driver._id) {
            driver = await Driver.findOne({ userId: req.user._id }) || await Driver.findOne({});
        }
        if (!driver) {
            return res.status(403).json({
                success: false,
                message: 'Must be a registered driver to accept journeys'
            });
        }
        const driverId = driver._id;
        const journey = await journeyService.acceptJourney(journeyId, driverId);

        res.status(200).json({
            success: true,
            data: journey,
            message: "journey accepted successfully"
        });
    } catch (error) {
        console.error('Error in acceptJourney:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to accept journey'
        });
    }
}
export const  updateJourneyStatus = async(req,res)=>{
    try {
        const { journeyId } = req.params;
        const { status } = req.body;
        const driver = req.user.driver;
        if (!driver || !driver._id) {
            return res.status(403).json({
                success: false,
                message: 'Must be a driver to update journey status'
            });
        }
        const driverId = driver._id;
        const journey = await journeyService.updateJourneyStatus(journeyId,driverId,status) ;

        res.status(200).json({
            success:true ,
            data:journey ,
            message:"journey status update successfully"
        })
    } catch (error) {
        console.error('Error in  updateJourneyStatus:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to accept journey'
        });
    }
}

 export const  completeJourney  =async(req,res)=>{
try {
    const {journeyId} = req.params;
    const driver = req.user.driver;
    if (!driver || !driver._id) {
        return res.status(403).json({
            success: false,
            message: 'Must be a driver to complete a journey'
        });
    }
    const driverId = driver._id;
    const {actualFare,distance,duration} =req.body ;
    const completionData = {actualFare,distance,duration} ;
    const journey = await journeyService.completeJourney(journeyId,driverId,completionData) ;
    res.status(200).json({
        success:true  ,
        data:journey ,
        message:"Journey completed succesfully"
    })
} catch (error) {
    console.error('Error in completeJourney:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to complete journey'
        });
    
}
}
export const cancelJourney = async (req,res) => {
    try {

        const userId = req.user._id;
        const { journeyId } = req.params;
        const { reason, cancelledBy } = req.body;

        const journey = await journeyService.cancelJourney(
            journeyId,
            userId,
            reason,
            cancelledBy
        );

        return res.status(200).json({
            success: true,
            data: journey,
            message: "Journey cancelled successfully"
        });

    } catch (error) {

        console.error("Error in cancelJourney:", error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
 export const getJourneyById =async(req,res)=>{
try {
    const {journeyId} =req.params ;
    const userId = req.user._id;
        const journey = await journeyService.getJourneyById(journeyId, userId);
        res.status(200).json({
            success: true,
            data: journey,
            message: 'Journey retrieved successfully'
        });
} catch (error) { 
    console.error('Error in getJourneyById:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve journey'
        });
}
 }

 export const getRiderJourneys = async (req, res) => {
    try {
        const riderId = req.user._id;
        const { status } = req.query;
        const journeys = await journeyService.getRiderJourneys(riderId, status || null);
        res.status(200).json({
            success: true,
            data: journeys,
            message: 'Rider journeys retrieved successfully'
        });
    } catch (error) {
        console.error('Error in getRiderJourneys:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve rider journeys'
        });
    }
};

/**
 * @swagger
 * /api/journey/driver/history:
 *   get:
 *     summary: Get driver journey history
 *     description: Returns all journeys assigned to the authenticated driver, sorted by most recent. Only accessible by DRIVER role.
 *     tags:
 *       - Journey
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [REQUESTED, ACCEPTED, ARRIVED, STARTED, COMPLETED, CANCELLED]
 *         description: Filter journeys by status
 *     responses:
 *       200:
 *         description: Driver journeys retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Driver journeys retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JourneyResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a DRIVER
 *       500:
 *         description: Internal server error
 */
export const getDriverJourneys = async (req, res) => {
    try {
        const driver = req.user.driver;
        if (!driver || !driver._id) {
            return res.status(403).json({
                success: false,
                message: 'Must be a driver to view driver journeys'
            });
        }
        const driverId = driver._id;
        const { status } = req.query;
        
        const journeys = await journeyService.getDriverJourneys(driverId, status || null);
        res.status(200).json({
            success: true,
            data: journeys,
            message: 'Driver journeys retrieved successfully'
        });
    } catch (error) {
        console.error('Error in getDriverJourneys:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve driver journeys'
        });
    }
};

export const getAvailableJourneys = async (req, res) => {
    try {
        const journeys = await journeyService.getAvailableJourneys();
        res.status(200).json({
            success: true,
            data: journeys,
            message: 'Available journeys retrieved successfully'
        });
    } catch (error) {
        console.error('Error in getAvailableJourneys:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve available journeys'
        });
    }
};

/**
 * @swagger
 * /api/journey/{journeyId}/payment-qr:
 *   get:
 *     summary: Generate payment QR code (Rider)
 *     description: Generates a base64 QR code image for payment after journey completion. Only available once journey is COMPLETED and payment is still PENDING.
 *     tags:
 *       - Journey
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The completed journey ID
 *     responses:
 *       200:
 *         description: Payment QR generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Payment QR generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     journeyId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                       example: 245
 *                     paymentMethod:
 *                       type: string
 *                       example: "UPI"
 *                     qrCode:
 *                       type: string
 *                       description: Base64 encoded PNG image (data:image/png;base64,...)
 *       400:
 *         description: Journey not completed or payment already done
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the rider of this journey
 *       404:
 *         description: Journey not found
 *       500:
 *         description: Internal server error
 */
export const generatePaymentQR = async (req, res) => {
    try {
        const { journeyId } = req.params;
        const riderId = req.user._id;
        const paymentQR = await journeyService.generatePaymentQR(journeyId, riderId);
        res.status(200).json({
            success: true,
            data: paymentQR,
            message: 'Payment QR generated successfully'
        });
    } catch (error) {
        console.error('Error in generatePaymentQR:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate payment QR'
        });
    }
};

/**
 * @swagger
 * /api/journey/{journeyId}/confirm-payment:
 *   post:
 *     summary: Confirm payment (Rider)
 *     description: Marks the journey payment as completed. Idempotent — safe to call multiple times; returns `alreadyPaid: true` if already paid.
 *     tags:
 *       - Journey
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The completed journey ID
 *     responses:
 *       200:
 *         description: Payment confirmed (or already completed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "Payment confirmed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     journeyId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                       example: 245
 *                     paymentMethod:
 *                       type: string
 *                     alreadyPaid:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Journey not in COMPLETED status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the rider of this journey
 *       404:
 *         description: Journey not found
 *       500:
 *         description: Internal server error
 */
export const confirmPayment = async (req, res) => {
    try {
        const { journeyId } = req.params;
        const riderId = req.user._id;
        const result = await journeyService.confirmPayment(journeyId, riderId);
        res.status(200).json({
            success: true,
            data: result,
            message: result.alreadyPaid ? 'Payment already completed' : 'Payment confirmed successfully'
        });
    } catch (error) {
        console.error('Error in confirmPayment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to confirm payment'
        });
    }
};