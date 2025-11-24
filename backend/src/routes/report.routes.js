const express = require('express');
const router = express.Router();
const controller = require('../controllers/report.controller');
const { verifyToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report generation
 */

/**
 * @swagger
 * /api/reports/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 */
router.get('/stats', verifyToken, controller.getStats);

module.exports = router;
