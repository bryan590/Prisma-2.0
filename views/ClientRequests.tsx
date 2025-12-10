
import React, { useState } from 'react';
import { SavedContract } from '../types';
import { SearchIcon, SparklesIcon, FileTextIcon, MoreVerticalIcon, PlusIcon, PenToolIcon, LayoutIcon } from '../components/Icons';

interface ClientRequestsProps {
    contracts: SavedContract[];
    onViewContract: (contract: SavedContract) => void;
    onCreateNew: () => void; // New prop to trigger creation
    onSaveAsTemplate?: (contract: SavedContract) => void; // Prop for saving as template
}

export const ClientRequests: React.FC<ClientRequestsProps> = ({ contracts, onViewContract, onCreateNew, onSaveAsTemplate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter contracts that are in progress (not signed/completed/rejected)
    // Client wants to track: Drafts, Pending Validation, Pending Signature
    const activeRequests = contracts.filter(c => 
        ['DRAFT', 'PENDING_LEGAL_VALIDATION', 'INTERNAL_REVIEW', 'EXTERNAL_VALIDATION', 'SIGNATURE_PENDING'].includes(c.status)
    );

    const filtered = activeRequests.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.id.includes(searchTerm)
    );

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'PENDING_LEGAL_VALIDATION':
                return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200 flex items-center gap-1 w-fit"><SparklesIcon className="w-3 h-3"/> Validación Legal</span>;
            case 'DRAFT':
                return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200 w-fit">Borrador</span>;
            case 'SIGNATURE_PENDING':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200 w-fit">Firma Pendiente</span>;
            case 'INTERNAL_REVIEW':
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 w-fit">Revisión Interna</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold w-fit">{status}</span>;
        }
    };

    const getProgress = (status: string) => {
        switch(status) {
            case 'DRAFT': return 25;
            case 'PENDING_LEGAL_VALIDATION': return 40;
            case 'INTERNAL_REVIEW': return 60;
            case 'EXTERNAL_VALIDATION': return 70;
            case 'SIGNATURE_PENDING': return 85;
            case 'SIGNED': case 'COMPLETED': return 100;
            default: return 10;
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Solicitudes</h1>
                    <p className="text-gray-500 text-sm mt-1">Seguimiento de contratos en proceso de creación o aprobación.</p>
                </div>
                <button 
                    onClick={onCreateNew}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-colors flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Nueva Solicitud
                </button>
             </div>

             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                     <div className="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-2 max-w-md">
                         <SearchIcon className="w-4 h-4 text-gray-400 mr-2"/>
                         <input 
                            type="text" 
                            placeholder="Buscar solicitud..." 
                            className="bg-transparent text-sm w-full outline-none" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                </div>

                {filtered.length > 0 ? (
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-white text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Nombre / Descripción</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Fecha Creación</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 w-48">Progreso</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(c => {
                                const progress = getProgress(c.status);
                                // Logic: Can be saved as template if it was created by AI and has been validated (is in INTERNAL_REVIEW or further)
                                const canConvert = c.type === 'IA' && (c.status === 'INTERNAL_REVIEW' || c.status === 'EXTERNAL_VALIDATION' || c.status === 'SIGNATURE_PENDING');

                                return (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => onViewContract(c)}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{c.name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">ID: {c.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{c.type}</td>
                                    <td className="px-6 py-4">{c.date}</td>
                                    <td className="px-6 py-4">{getStatusBadge(c.status)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-center text-xs font-bold">
                                                <span className="text-gray-400 uppercase">Progreso</span>
                                                <span className="text-indigo-600">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div 
                                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {canConvert && onSaveAsTemplate && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onSaveAsTemplate(c); }}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Guardar como Plantilla Privada"
                                                >
                                                    <LayoutIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onViewContract(c); }}
                                                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm flex items-center gap-1">
                                                <PenToolIcon className="w-3 h-3"/> {c.status === 'DRAFT' ? 'Editar' : 'Ver'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                        <FileTextIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-medium">No hay solicitudes activas.</p>
                        <p className="text-xs mb-4">Crea una nueva solicitud para empezar.</p>
                        <button 
                            onClick={onCreateNew}
                            className="text-indigo-600 font-bold hover:underline">
                            Crear Solicitud
                        </button>
                    </div>
                )}
             </div>
        </div>
    );
};