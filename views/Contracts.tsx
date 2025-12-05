
import React, { useState } from 'react';
import { SearchIcon, MoreVerticalIcon, FileTextIcon, AlertCircleIcon, ClockIcon } from '../components/Icons';
import { SavedContract } from '../types';

interface ContractsProps {
    contracts: SavedContract[];
    onDelete: (id: string) => void;
}

export const Contracts: React.FC<ContractsProps> = ({ contracts, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Calculate expiration status for a contract
    const getExpirationAlert = (endDate?: string) => {
        if (!endDate) return null;
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { type: 'RED', label: 'Vencido', color: 'bg-red-100 text-red-700 border-red-200' };
        if (diffDays <= 15) return { type: 'ORANGE', label: `Vence en ${diffDays} días`, color: 'bg-orange-100 text-orange-800 border-orange-200' };
        if (diffDays <= 30) return { type: 'YELLOW', label: `Vence en ${diffDays} días`, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        return null; // Green or no alert
    };

    const filteredContracts = contracts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              c.signers.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

        return matchesSearch && matchesStatus;
    });
    
    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'SIGNED':
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'SIGNATURE_PENDING': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'INTERNAL_REVIEW': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'PENDING_LEGAL_VALIDATION': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
            case 'DRAFT': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    }

    const getStatusLabel = (status: string) => {
        switch(status) {
            case 'SIGNED':
            case 'COMPLETED': return 'Vigente';
            case 'SIGNATURE_PENDING': return 'Firma Pendiente';
            case 'INTERNAL_REVIEW': return 'Aprobación Área';
            case 'PENDING_LEGAL_VALIDATION': return 'Revisión Legal';
            case 'REJECTED': return 'Rechazado';
            case 'DRAFT': return 'Borrador';
            default: return status;
        }
    }

    const handleAction = (action: string, id: string) => {
        if (action === 'delete') {
            onDelete(id);
        }
        setOpenMenuId(null);
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in min-h-screen" onClick={() => setOpenMenuId(null)}>
             <div className="flex justify-between items-center mb-8">
                 <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Contratos</h1>
                    <p className="text-gray-500 text-sm mt-1">Repositorio centralizado con monitoreo de vencimientos.</p>
                 </div>
             </div>

             {/* Filters Bar */}
             <div className="flex flex-col md:flex-row gap-4 mb-8">
                 <div className="flex gap-4">
                    <button 
                        onClick={() => setStatusFilter('ALL')}
                        className={`border px-6 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm ${statusFilter === 'ALL' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                        Todos
                    </button>
                    <div className="relative">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-white border border-gray-200 px-6 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer pr-10"
                        >
                            <option value="ALL">Filtrar por Estado</option>
                            <option value="SIGNED">Vigentes / Firmados</option>
                            <option value="SIGNATURE_PENDING">En Firma</option>
                            <option value="PENDING_LEGAL_VALIDATION">En Revisión</option>
                            <option value="DRAFT">Borradores</option>
                        </select>
                    </div>
                 </div>
                 
                 <div className="flex-1 bg-white border border-gray-200 rounded-xl flex items-center px-4 hover:border-indigo-300 transition-colors group shadow-sm focus-within:ring-2 focus-within:ring-indigo-100">
                     <SearchIcon className="w-5 h-5 text-gray-400 mr-3 group-focus-within:text-indigo-500"/>
                     <input 
                        type="text" 
                        placeholder="Buscar por nombre, ID o firmante..." 
                        className="bg-transparent text-sm w-full outline-none font-medium text-gray-700 placeholder:text-gray-400 py-3" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                 </div>
             </div>

             {/* Table Header */}
             <div className="hidden md:flex text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200 pb-4 mb-4 px-6">
                 <div className="w-4/12">Documento</div>
                 <div className="w-2/12">Estado</div>
                 <div className="w-2/12">Vencimiento</div>
                 <div className="w-2/12">Firmantes</div>
                 <div className="w-2/12 text-right">Acciones</div>
             </div>

             {/* Contracts List */}
             <div className="space-y-3">
                 {filteredContracts.map(contract => {
                     const alert = getExpirationAlert(contract.endDate);
                     return (
                     <div key={contract.id} className="bg-white rounded-xl p-5 flex flex-col md:flex-row md:items-center shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-indigo-100 group gap-4 md:gap-0">
                         {/* Name & Date */}
                         <div className="w-full md:w-4/12 flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${contract.type === 'IA' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                 {contract.type === 'IA' ? <FileTextIcon className="w-6 h-6"/> : <FileTextIcon className="w-6 h-6"/>}
                             </div>
                             <div>
                                 <h4 className="font-bold text-base text-gray-900 mb-0.5">{contract.name}</h4>
                                 <p className="text-xs text-gray-500">ID: {contract.id} • Creado: {contract.date}</p>
                             </div>
                         </div>
                         
                         {/* Status */}
                         <div className="w-full md:w-2/12">
                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(contract.status)}`}>
                                 {getStatusLabel(contract.status)}
                             </span>
                         </div>

                         {/* Expiration Alert */}
                         <div className="w-full md:w-2/12">
                             {contract.status === 'SIGNED' || contract.status === 'COMPLETED' ? (
                                 alert ? (
                                     <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${alert.color}`}>
                                         <AlertCircleIcon className="w-3 h-3"/> {alert.label}
                                     </div>
                                 ) : (
                                     <div className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                         <span className="text-gray-700 font-medium">Vigente</span>
                                     </div>
                                 )
                             ) : (
                                 <span className="text-xs text-gray-400">-</span>
                             )}
                         </div>
                         
                         {/* Signers Avatars */}
                         <div className="w-full md:w-2/12 flex -space-x-2">
                             {contract.signers?.length > 0 ? contract.signers.map((s, i) => (
                                 <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 relative group/avatar" title={s.email}>
                                     {s.name.charAt(0)}
                                 </div>
                             )) : <span className="text-xs text-gray-400 italic">Sin firmantes</span>}
                         </div>
                         
                         {/* Actions */}
                         <div className="w-full md:w-2/12 flex justify-end relative">
                             <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === contract.id ? null : contract.id);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                 <MoreVerticalIcon className="w-5 h-5 text-gray-400" />
                             </button>
                             
                             {openMenuId === contract.id && (
                                 <div className="absolute top-8 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-20 w-40 py-1 overflow-hidden animate-fade-in">
                                     <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-50">Ver Detalle</button>
                                     <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-50">Descargar PDF</button>
                                     <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-medium border-b border-gray-50">Historial</button>
                                     <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction('delete', contract.id);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium">
                                        Eliminar
                                     </button>
                                 </div>
                             )}
                         </div>
                     </div>
                 )})}

                 {filteredContracts.length === 0 && (
                     <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                         <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                         <p className="text-gray-400 font-medium">No se encontraron contratos con los filtros actuales.</p>
                     </div>
                 )}
             </div>
        </div>
    )
}
