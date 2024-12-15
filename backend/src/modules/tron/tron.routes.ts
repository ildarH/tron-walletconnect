import { Router } from 'express'
import { tronController } from './tron.controller'

const router = Router()

/**
 * @swagger
 * /api/tron/get-message:
 *   get:
 *     summary: Get message for signing
 *     tags: [TRON]
 *     responses:
 *       200:
 *         description: Message for signing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'This is a message to be signed for Tron'
 */
router.get('/get-message', tronController.getMessage)

/**
 * @swagger
 * /api/tron/verify-signature:
 *   post:
 *     summary: Verify signature
 *     tags: [TRON]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *               - message
 *               - signature
 *             properties:
 *               address:
 *                 type: string
 *                 description: TRON wallet address
 *               message:
 *                 type: string
 *                 description: Message to sign
 *               signature:
 *                 type: string
 *                 description: Message signature
 *     responses:
 *       200:
 *         description: Signature is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Signature is valid. User owns the wallet.'
 *       401:
 *         description: Invalid signature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Invalid signature. Forgery detected!'
 *       400:
 *         description: Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Required parameters (address, message, signature) are missing'
 */
router.post('/verify-signature', tronController.verifySignature)

export default router 