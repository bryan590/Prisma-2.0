
import React, { useState } from 'react';
import { LegalProcess } from '../types';
import { SearchIcon, PlusIcon, FileTextIcon, MoreVerticalIcon, AlertCircleIcon, XIcon } from '../components/Icons';

interface LegalProcessesProps {
    processes: LegalProcess[];
}

export const LegalProcesses: React.FC<LegalProcessesProps> = ({ processes: initialProcesses }) => {
    const [processes, setProcesses] = useState<LegalProcess[]>(initialProcesses);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // New Process Form State
    const [newProcess, setNewProcess] = useState<Partial<LegalProcess>>({
        status: 'Activo',
        risk: 'Medio'
    });

    const filtered = processes.filter(p => 
        p.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.court.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.relatedContractName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProcess = () => {
        if (newProcess.caseNumber && newProcess.court) {
            const processToAdd: LegalProcess = {
                id: `EXP-${Math.floor(Math.random() * 10000)}`,
                caseNumber: newProcess.caseNumber,
                court: newProcess.court,
                status: newProcess.status as any || 'Admisorio',
                risk: newProcess.risk as any || 'Medio',
                relatedContractName: newProcess.relatedContractName || 'Sin asignar',
                description: newProcess.description || '',
                lastUpdate: new Date().toLocaleDateString()
            };
            setProcesses([processToAdd, ...processes]);
            setIsModalOpen(false);
            setNewProcess({ status: 'Activo', risk: 'Medio' });
        }
    };

    const getRiskBadge = (risk: string) => {
        switch(risk) {
            case 'Alto': return <span className="flex items-center gap-1 text-red-600 font-bold text-xs"><AlertCircleIcon className="w-3 h-3"/> Alto</span>;
            case 'Medio': return <span className="flex items-center gap-1 text-amber-600 font-bold text-xs"><AlertCircleIcon className="w-3 h-3"/> Medio</span>;
            case 'Bajo': return <span className="flex items-center gap-1 text-green-600 font-bold text-xs"><AlertCircleIcon className="w-3 h-3"/> Bajo</span>;
            default: return risk;
        }
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Admisorio': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Laudo Final': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'Activo': return 'bg-green-50 text-green-700 border-green-100';
            case 'Suspendido': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Procesos Legales</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestión de litigios y expedientes vinculados a contratos.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
                    <PlusIcon className="w-4 h-4" />
                    Nuevo Expediente
                </button>
             </div>

             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex gap-4 bg-white">
                     <div className="w-full bg-white border border-gray-200 rounded-xl flex items-center px-4 py-3 hover:border-gray-300 transition-colors">
                         <SearchIcon className="w-4 h-4 text-gray-400 mr-2"/>
                         <input 
                            type="text" 
                            placeholder="Buscar expediente o contrato..." 
                            className="bg-transparent text-sm w-full outline-none" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                </div>

                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-white text-xs uppercase font-bold text-gray-400 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-bold">Expediente / Juzgado</th>
                            <th className="px-6 py-4 font-bold">Contrato Vinculado</th>
                            <th className="px-6 py-4 font-bold">Estado</th>
                            <th className="px-6 py-4 font-bold">Riesgo</th>
                            <th className="px-6 py-4 font-bold">Actualización</th>
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                                            <FileTextIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{p.caseNumber}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{p.court}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-900 font-medium border-b border-dashed border-gray-300 hover:border-indigo-500 hover:text-indigo-600 cursor-pointer transition-colors">
                                        {p.relatedContractName || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(p.status)}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {getRiskBadge(p.risk)}
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.lastUpdate}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600">
                                        <MoreVerticalIcon className="w-4 h-4"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>

             {/* Modal Nuevo Expediente */}
             {isModalOpen && (
                 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-scale-in relative">
                         <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                             <XIcon className="w-6 h-6"/>
                         </button>
                         
                         <h2 className="text-xl font-bold text-gray-900 mb-6">Nuevo Expediente Legal</h2>
                         
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">N° Expediente</label>
                                 <input 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all"
                                    value={newProcess.caseNumber || ''}
                                    onChange={e => setNewProcess({...newProcess, caseNumber: e.target.value})}
                                    placeholder="Ej. EXP-2024-001"
                                 />
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Juzgado / Instancia</label>
                                 <input 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all"
                                    value={newProcess.court || ''}
                                    onChange={e => setNewProcess({...newProcess, court: e.target.value})}
                                    placeholder="Ej. 5to Juzgado Civil"
                                 />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Contrato Vinculado</label>
                                    <input 
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all"
                                        value={newProcess.relatedContractName || ''}
                                        onChange={e => setNewProcess({...newProcess, relatedContractName: e.target.value})}
                                        placeholder="ID Contrato"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Nivel de Riesgo</label>
                                    <select 
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all"
                                        value={newProcess.risk}
                                        onChange={e => setNewProcess({...newProcess, risk: e.target.value as any})}
                                    >
                                        <option value="Bajo">Bajo</option>
                                        <option value="Medio">Medio</option>
                                        <option value="Alto">Alto</option>
                                    </select>
                                </div>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Descripción</label>
                                 <textarea 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all h-24 resize-none"
                                    value={newProcess.description || ''}
                                    onChange={e => setNewProcess({...newProcess, description: e.target.value})}
                                    placeholder="Breve descripción del caso..."
                                 />
                             </div>
                         </div>

                         <div className="flex gap-3 mt-8">
                             <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancelar</button>
                             <button onClick={handleAddProcess} className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black shadow-lg transition-colors">Registrar Expediente</button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};
