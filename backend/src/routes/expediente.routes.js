const express = require('express');
const router = express.Router();
const controller = require('../controllers/expediente.controller');
const { verifyToken, isCoordinador } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Expedientes
 *   description: Expediente management
 */

/**
 * @swagger
 * /api/expedientes:
 *   get:
 *     summary: Get all expedientes
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of expedientes
 */
router.get('/', verifyToken, controller.getExpedientes);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   get:
 *     summary: Get expediente details
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expediente details
 */
router.get('/:id', verifyToken, controller.getExpedienteDetails);

/**
 * @swagger
 * /api/expedientes:
 *   post:
 *     summary: Create a new expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', verifyToken, controller.createExpediente);

/**
 * @swagger
 * /api/expedientes/indicio:
 *   post:
 *     summary: Add indicio to expediente
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expedienteId:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               color:
 *                 type: string
 *               tamano:
 *                 type: string
 *               peso:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added
 */
router.post('/indicio', verifyToken, controller.addIndicio);

/**
 * @swagger
 * /api/expedientes/{id}/status:
 *   put:
 *     summary: Update expediente status (Approve/Reject)
 *     tags: [Expedientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [Aprobado, Rechazado]
 *               justificacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id/status', [verifyToken, isCoordinador], controller.updateStatus);

module.exports = router;
