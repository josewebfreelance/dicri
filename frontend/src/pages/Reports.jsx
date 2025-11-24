import { useState } from 'react';
import api from '../api/axios';

const Reports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get('/expedientes', {
                params: {
                    estado: status || null,
                    fechaInicio: startDate || null,
                    fechaFin: endDate || null
                }
            });
            setResults(response.data);
            setSearched(true);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Reportes</h2>
            <div className="bg-white p-6 rounded shadow mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-gray-700 mb-2">Fecha Inicio</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Fecha Fin</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Estado</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Creado">Creado</option>
                            <option value="En Revision">En Revision</option>
                            <option value="Aprobado">Aprobado</option>
                            <option value="Rechazado">Rechazado</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800">
                        Generar Reporte
                    </button>
                </form>
            </div>

            {searched && (
                <div className="bg-white rounded shadow overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between">
                        <h3 className="font-bold">Resultados: {results.length}</h3>
                        <button onClick={() => window.print()} className="text-blue-600 hover:underline">Imprimir / PDF</button>
                    </div>
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((exp) => (
                                <tr key={exp.Id}>
                                    <td className="px-6 py-4">{exp.Codigo}</td>
                                    <td className="px-6 py-4">{new Date(exp.FechaRegistro).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{exp.Estado}</td>
                                    <td className="px-6 py-4">{exp.Tecnico}</td>
                                </tr>
                            ))}
                            {results.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No se encontraron resultados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Reports;
