const { getConnection, sql } = require('../config/db');

const createExpediente = async (req, res) => {
    const { codigo, descripcion } = req.body;
    const userId = req.userId;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Codigo', sql.NVarChar, codigo)
            .input('Descripcion', sql.NVarChar, descripcion)
            .input('UsuarioRegistraId', sql.Int, userId)
            .execute('sp_CreateExpediente');

        res.status(201).send({ message: 'Expediente created successfully', expedienteId: result.recordset[0].ExpedienteId });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const addIndicio = async (req, res) => {
    const { expedienteId, descripcion, color, tamano, peso, ubicacion } = req.body;
    const userId = req.userId;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('ExpedienteId', sql.Int, expedienteId)
            .input('Descripcion', sql.NVarChar, descripcion)
            .input('Color', sql.NVarChar, color)
            .input('Tamano', sql.NVarChar, tamano)
            .input('Peso', sql.NVarChar, peso)
            .input('Ubicacion', sql.NVarChar, ubicacion)
            .input('UsuarioRegistraId', sql.Int, userId)
            .execute('sp_AddIndicio');

        res.status(201).send({ message: 'Indicio added successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getExpedientes = async (req, res) => {
    const { estado, fechaInicio, fechaFin } = req.query;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('Estado', sql.NVarChar, estado || null)
            .input('FechaInicio', sql.DateTime, fechaInicio || null)
            .input('FechaFin', sql.DateTime, fechaFin || null)
            .execute('sp_GetExpedientes');

        res.status(200).send(result.recordset);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getExpedienteDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('ExpedienteId', sql.Int, id)
            .execute('sp_GetExpedienteDetails');

        const expediente = result.recordsets[0][0];
        const indicios = result.recordsets[1];

        if (!expediente) {
            return res.status(404).send({ message: 'Expediente not found' });
        }

        res.status(200).send({ ...expediente, indicios });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { estado, justificacion } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('ExpedienteId', sql.Int, id)
            .input('Estado', sql.NVarChar, estado)
            .input('Justificacion', sql.NVarChar, justificacion || null)
            .execute('sp_UpdateExpedienteStatus');

        res.status(200).send({ message: 'Expediente status updated successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    createExpediente,
    addIndicio,
    getExpedientes,
    getExpedienteDetails,
    updateStatus
};
