import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';

const Expedientes = () => {
    const [expedientes, setExpedientes] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchExpedientes();
    }, []);

    const fetchExpedientes = async () => {
        try {
            const response = await api.get('/expedientes');
            setExpedientes(response.data);
        } catch (error) {
            console.error('Error fetching expedientes:', error);
        }
    };

    const filteredExpedientes = expedientes.filter(exp =>
        exp.Codigo.toLowerCase().includes(filter.toLowerCase()) ||
        exp.Estado.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Expedientes</h2>
                <Link to="/expedientes/new" className="bg-primary text-white px-4 py-2 rounded flex items-center hover:bg-blue-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Expediente
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar por código o estado..."
                    className="w-full p-2 border rounded"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredExpedientes.map((exp) => (
                            <tr key={exp.Id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{exp.Codigo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 truncate max-w-xs">{exp.Descripcion}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(exp.FechaRegistro).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${exp.Estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                                            exp.Estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {exp.Estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{exp.Tecnico}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to={`/expedientes/${exp.Id}`} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                                        <Eye className="w-4 h-4 mr-1" /> Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expedientes;
