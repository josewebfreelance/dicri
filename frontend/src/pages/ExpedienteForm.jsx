import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const ExpedienteForm = () => {
    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expedientes', { codigo, descripcion });
            navigate('/expedientes');
        } catch (error) {
            console.error('Error creating expediente:', error);
            alert('Error creating expediente');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Nuevo Expediente</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Código</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Descripción</label>
                    <textarea
                        className="w-full p-2 border rounded h-32"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/expedientes')}
                        className="mr-4 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-800"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpedienteForm;
