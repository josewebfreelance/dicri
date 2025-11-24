const { getConnection, sql } = require('../config/db');
const PDFDocument = require('pdfkit');

const getStats = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT Estado, COUNT(*) as Count 
            FROM Expedientes 
            GROUP BY Estado
        `);

        console.log(result.recordset);

        res.status(200).send(result.recordset);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getStatsPdf = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT Estado, COUNT(*) as Count 
            FROM Expedientes 
            GROUP BY Estado
        `);

        const stats = result.recordset;
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte_estadisticas.pdf');

        doc.pipe(res);

        const generatedDate = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

        // Header
        doc.fontSize(20).text('Reporte de Estadísticas DICRI', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha de generación: ${generatedDate}`, { align: 'center' });
        doc.moveDown(2);

        // Table-like content
        doc.fontSize(14).font('Helvetica-Bold').text('Resumen por Estado:', { underline: true });
        doc.moveDown();

        stats.forEach(stat => {
            doc.font('Helvetica').fontSize(12).text(`${stat.Estado}: ${stat.Count} expedientes`, { indent: 20 });
            doc.moveDown(0.5);
        });

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).text('Fin del reporte', { align: 'center' });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error generating PDF' });
    }
};

module.exports = {
    getStats,
    getStatsPdf
};
