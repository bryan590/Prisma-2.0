
import React, { useState, useRef } from 'react';
import { ContractTemplate, SavedContract, ViewState, UserRole } from '../types';
import { ChevronRightIcon, ChevronLeftIcon, XIcon, SparklesIcon, CheckIcon, AlertCircleIcon, SearchIcon, ClockIcon, ActivityIcon, FileTextIcon } from '../components/Icons';

interface DashboardProps {
  role: UserRole;
  onUseTemplate: (template: ContractTemplate) => void;
  contracts: SavedContract[];
  templates: ContractTemplate[]; // Lifted state
  onNavigate: (view: ViewState) => void;
  onReviewContract: (contract: SavedContract) => void; // For Lawyers
}

export const Dashboard: React.FC<DashboardProps> = ({ role, onUseTemplate, contracts, templates, onNavigate, onReviewContract }) => {
  
  if (role === 'LAWYER') {
      return <LawyerDashboard contracts={contracts} onNavigate={onNavigate} onReview={onReviewContract} />;
  }

  return <ClientTemplates onUseTemplate={onUseTemplate} onNavigate={onNavigate} templates={templates} />;
};

/* --- LAWYER DASHBOARD (Validación IA) --- */
const LawyerDashboard: React.FC<{ contracts: SavedContract[], onNavigate: any, onReview: any }> = ({ contracts, onNavigate, onReview }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter for Pending AI Validation
    const pendingValidation = contracts.filter(c => 
        c.status === 'PENDING_LEGAL_VALIDATION' && 
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.includes(searchTerm))
    );

    // Stats
    const totalPending = pendingValidation.length;
    const reviewedToday = contracts.filter(c => c.status === 'INTERNAL_REVIEW').length; // Mock stat
    
    const StatCard = ({ title, count, icon: Icon, color, bg }: any) => (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
                <h3 className="text-4xl font-extrabold text-gray-900">{count}</h3>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
                <Icon className="w-7 h-7"/>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
            {/* Header & Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Hola, Juan</h1>
                    <p className="text-gray-500 mt-2 font-medium">Tienes <span className="text-indigo-600 font-bold">{totalPending} solicitudes</span> de IA esperando tu validación.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-500 flex items-center gap-2 shadow-sm">
                        <ClockIcon className="w-4 h-4"/> Última sinc: Hace 5 min
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Pendientes de Revisión" 
                    count={totalPending} 
                    icon={AlertCircleIcon} 
                    color="text-amber-600" 
                    bg="bg-amber-50" 
                />
                <StatCard 
                    title="Procesados Hoy" 
                    count={reviewedToday} 
                    icon={CheckIcon} 
                    color="text-emerald-600" 
                    bg="bg-emerald-50" 
                />
                <StatCard 
                    title="Eficiencia IA" 
                    count="94%" 
                    icon={SparklesIcon} 
                    color="text-purple-600" 
                    bg="bg-purple-50" 
                />
            </div>

            {/* Main Inbox Container */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                             <FileTextIcon className="w-5 h-5"/>
                         </div>
                         <h2 className="text-xl font-bold text-gray-900">Bandeja de Entrada</h2>
                    </div>
                    
                    <div className="w-full md:w-auto bg-gray-50 border border-gray-200 rounded-xl flex items-center px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                         <SearchIcon className="w-4 h-4 text-gray-400 mr-2"/>
                         <input 
                            type="text" 
                            placeholder="Buscar solicitud..." 
                            className="bg-transparent text-sm w-64 outline-none font-medium text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                         />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                    {pendingValidation.length > 0 ? (
                        pendingValidation.map(c => (
                            <div key={c.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                                
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Icon & ID */}
                                    <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-200">
                                            <SparklesIcon className="w-6 h-6"/>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold text-gray-400">{c.id}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{c.name}</h3>
                                                <div className="flex items-center gap-3 text-xs mt-1">
                                                    <span className="text-gray-500 font-medium flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                        Creado por: {c.data?.contractorName}
                                                    </span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-gray-500">{c.date}</span>
                                                </div>
                                            </div>
                                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5 shadow-sm">
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                                Requiere Validación
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                                            <div className="absolute left-0 top-4 bottom-4 w-1 bg-gray-200 rounded-r-full"></div>
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-1 pl-3">Contexto del Prompt</p>
                                            <p className="text-sm text-gray-700 italic pl-3 leading-relaxed line-clamp-2">
                                                "{c.data?.description || 'Sin descripción disponible...'}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="flex flex-col justify-center min-w-[140px] pt-2 md:pt-0">
                                        <button 
                                            onClick={() => onReview(c)}
                                            className="w-full bg-white border border-gray-200 text-gray-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn shadow-sm">
                                            Ver Borrador
                                            <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-indigo-600 group-hover/btn:translate-x-1 transition-all"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-32 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                                <CheckIcon className="w-10 h-10 text-gray-300"/>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">¡Estás al día!</h3>
                            <p className="text-gray-500 mt-2 max-w-xs mx-auto">No hay solicitudes pendientes de validación en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* --- CLIENT DASHBOARD (Templates Catalog) --- */
const ClientTemplates: React.FC<Omit<DashboardProps, 'role' | 'onReviewContract' | 'contracts'> & { templates: ContractTemplate[] }> = ({ onUseTemplate, onNavigate, templates }) => {
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [previewTemplate, setPreviewTemplate] = useState<ContractTemplate | null>(null);

  // Combine default with dynamic templates
  const allTemplates = [
      { id: 'ai-custom', name: 'Contrato con IA', description: 'Generado por asistente', category: 'IA', color: 'bg-purple-100', icon: '✨' },
      ...templates
  ];

  const filteredTemplates = activeFilter === 'Todas' 
    ? allTemplates.filter(t => t.id !== 'ai-custom') 
    : allTemplates.filter(t => t.category === activeFilter);

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* Banner */}
      <div className="relative rounded-3xl p-10 overflow-hidden bg-gradient-to-r from-[#FDFBF9] to-[#F4F1EE] border border-gray-100 shadow-sm">
        <div className="relative z-10 max-w-xl">
             <div className="inline-block bg-[#7DD3FC] text-slate-800 text-xs font-bold px-3 py-1 rounded-full mb-4">Nueva Función</div>
             <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                 Genera contratos con<br/>
                 nuestro agente de IA
             </h2>
             <button 
                onClick={() => onUseTemplate({id: 'ai-custom', name: 'Contrato con IA', description: 'Generado por asistente', category: 'IA', color: 'bg-purple-100'})}
                className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-colors flex items-center gap-2">
                 <SparklesIcon className="w-4 h-4 text-purple-300" />
                 Probar Asistente
             </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Catálogo de Plantillas</h3>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
            {['Todas', 'Mis Plantillas', 'RRHH', 'Comercial', 'Legal', 'Inmobiliario', 'Tecnología'].map((tag) => (
            <button 
                key={tag} 
                onClick={() => setActiveFilter(tag)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === tag 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                {tag}
            </button>
            ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((t) => (
            <div key={t.id} className="bg-white p-2 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
                <div className={`h-40 rounded-t-2xl w-full relative overflow-hidden flex items-center justify-center ${t.color || 'bg-gray-100'}`}>
                    <div className="text-5xl select-none grayscale opacity-50">
                        {t.icon || '📄'}
                    </div>
                </div>
                <div className="p-6 rounded-b-2xl flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 text-lg">{t.name}</h4>
                            {t.isPrivate && <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase border border-indigo-100">Privada</span>}
                        </div>
                        <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">{t.description}</p>
                        <div className="flex gap-3 mt-auto">
                        <button 
                            onClick={() => onUseTemplate(t)}
                            className="flex-1 bg-gray-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                            Crear
                        </button>
                        <button 
                            onClick={() => setPreviewTemplate(t)}
                            className="bg-white text-gray-500 border border-gray-200 text-xs font-bold px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                            Ver
                        </button>
                        </div>
                </div>
            </div>
            ))}
            {filteredTemplates.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-400">
                    <p>No se encontraron plantillas en esta categoría.</p>
                </div>
            )}
        </div>
      </div>
      
      {/* Template Preview Modal */}
      {previewTemplate && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative animate-scale-in overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="p-8 pb-4 flex justify-between items-start">
                      <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-1">{previewTemplate.name}</h2>
                          <div className="h-1 w-20 bg-gray-200 rounded-full mt-4"></div>
                      </div>
                      <button onClick={() => setPreviewTemplate(null)} className="text-gray-400 hover:text-gray-600">
                          <XIcon className="w-6 h-6" />
                      </button>
                  </div>

                  {/* Content */}
                  <div className="px-8 py-4 space-y-6">
                      <p className="text-sm font-medium text-gray-800 italic">
                          Esta plantilla incluye cláusulas estándar para {previewTemplate.category.toLowerCase()}. Podrás personalizarlas en el siguiente paso.
                      </p>

                      <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                              <div key={i}>
                                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Clausula 0{i}:</label>
                                  <div className="relative">
                                      <select className="w-full bg-gray-100 border-none rounded-xl py-3 px-4 text-sm text-gray-500 appearance-none outline-none cursor-not-allowed" disabled>
                                          <option>Contenido predefinido...</option>
                                      </select>
                                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="p-8 pt-4 flex gap-4 justify-end mt-4">
                      <button 
                        onClick={() => setPreviewTemplate(null)}
                        className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                          Cancelar
                      </button>
                      <button 
                        onClick={() => {
                            onUseTemplate(previewTemplate);
                            setPreviewTemplate(null);
                        }}
                        className="bg-[#C084FC] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#A855F7] transition-colors shadow-md">
                          Usar Plantilla
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};