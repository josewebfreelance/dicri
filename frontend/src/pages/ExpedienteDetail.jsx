import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, X } from 'lucide-react';

const ExpedienteDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [expediente, setExpediente] = useState(null);
    const [indicios, setIndicios] = useState([]);
    const [showIndicioModal, setShowIndicioModal] = useState(false);
    const [newIndicio, setNewIndicio] = useState({ descripcion: '', color: '', tamano: '', peso: '', ubicacion: '' });
    const [reviewJustification, setReviewJustification] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const response = await api.get(`/expedientes/${id}`);
            setExpediente(response.data);
            setIndicios(response.data.indicios);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const handleAddIndicio = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expedientes/indicio', { ...newIndicio, expedienteId: id });
            setShowIndicioModal(false);
            setNewIndicio({ descripcion: '', color: '', tamano: '', peso: '', ubicacion: '' });
            fetchDetails();
        } catch (error) {
            console.error('Error adding indicio:', error);
        }
    };

    const handleStatusChange = async (status) => {
        try {
            await api.put(`/expedientes/${id}/status`, {
                estado: status,
                justificacion: status === 'Rechazado' ? reviewJustification : null
            });
            setShowRejectModal(false);
            fetchDetails();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (!expediente) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold mb-2">Expediente: {expediente.Codigo}</h2>
                    <p className="text-gray-600">{expediente.Descripcion}</p>
                    <div className="mt-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${expediente.Estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                                expediente.Estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'}`}>
                            {expediente.Estado}
                        </span>
                    </div>
                    {expediente.JustificacionRechazo && (
                        <div className="mt-2 p-2 bg-red-50 text-red-700 rounded border border-red-200">
                            <strong>Motivo de rechazo:</strong> {expediente.JustificacionRechazo}
                        </div>
                    )}
                </div>

                {user.role === 'Coordinador' && expediente.Estado === 'Creado' && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleStatusChange('Aprobado')}
                            className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700"
                        >
                            <Check className="w-4 h-4 mr-2" /> Aprobar
                        </button>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded flex items-center hover:bg-red-700"
                        >
                            <X className="w-4 h-4 mr-2" /> Rechazar
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded shadow overflow-hidden mb-6">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Indicios</h3>
                    {expediente.Estado !== 'Aprobado' && (
                        <button
                            onClick={() => setShowIndicioModal(true)}
                            className="bg-primary text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Agregar Indicio
                        </button>
                    )}
                </div>
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peso</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {indicios.map((ind) => (
                            <tr key={ind.Id}>
                                <td className="px-6 py-4">{ind.Descripcion}</td>
                                <td className="px-6 py-4">{ind.Color}</td>
                                <td className="px-6 py-4">{ind.Tamano}</td>
                                <td className="px-6 py-4">{ind.Peso}</td>
                                <td className="px-6 py-4">{ind.Ubicacion}</td>
                            </tr>
                        ))}
                        {indicios.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay indicios registrados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Indicio Modal */}
            {showIndicioModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Agregar Indicio</h3>
                        <form onSubmit={handleAddIndicio}>
                            <input type="text" placeholder="Descripción" className="w-full mb-2 p-2 border rounded" required
                                value={newIndicio.descripcion} onChange={e => setNewIndicio({ ...newIndicio, descripcion: e.target.value })} />
                            <input type="text" placeholder="Color" className="w-full mb-2 p-2 border rounded"
                                value={newIndicio.color} onChange={e => setNewIndicio({ ...newIndicio, color: e.target.value })} />
                            <input type="text" placeholder="Tamaño" className="w-full mb-2 p-2 border rounded"
                                value={newIndicio.tamano} onChange={e => setNewIndicio({ ...newIndicio, tamano: e.target.value })} />
                            <input type="text" placeholder="Peso" className="w-full mb-2 p-2 border rounded"
                                value={newIndicio.peso} onChange={e => setNewIndicio({ ...newIndicio, peso: e.target.value })} />
                            <input type="text" placeholder="Ubicación" className="w-full mb-4 p-2 border rounded"
                                value={newIndicio.ubicacion} onChange={e => setNewIndicio({ ...newIndicio, ubicacion: e.target.value })} />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowIndicioModal(false)} className="px-4 py-2 text-gray-600">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-4">Rechazar Expediente</h3>
                        <textarea
                            className="w-full p-2 border rounded mb-4 h-32"
                            placeholder="Justificación del rechazo..."
                            value={reviewJustification}
                            onChange={e => setReviewJustification(e.target.value)}
                            required
                        ></textarea>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-gray-600">Cancelar</button>
                            <button onClick={() => handleStatusChange('Rechazado')} className="px-4 py-2 bg-red-600 text-white rounded">Confirmar Rechazo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpedienteDetail;
