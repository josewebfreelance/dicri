const { getConnection, sql } = require('../config/db');

const getStats = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT Estado, COUNT(*) as Count 
            FROM Expedientes 
            GROUP BY Estado
        `);

        res.status(200).send(result.recordset);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    getStats
};
