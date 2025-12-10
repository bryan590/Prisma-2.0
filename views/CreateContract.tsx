
import React, { useState, useEffect, useRef } from 'react';
import { ContractData, SavedContract, Signer, UserRole, Approval, ContractState, ContractTemplate } from '../types';
import { 
    ArrowLeftIcon, CheckIcon, ChevronRightIcon, 
    XIcon, SparklesIcon, PenToolIcon, FileTextIcon,
    LockIcon, UsersIcon, MessageCircleIcon, ClockIcon, SearchIcon, LayoutIcon, PlusIcon, AlertCircleIcon
} from '../components/Icons';
import { generateFullContractBody, chatContractAssistant } from '../services/geminiService';

interface CreateContractProps {
  role: UserRole;
  onBack: () => void;
  onFinish: (contract: SavedContract) => void;
  onSaveTemplate?: (contract: SavedContract) => void;
  existingContract?: SavedContract;
  initialTemplate?: ContractTemplate | null;
  templates?: ContractTemplate[];
  // Lifting state up for header rendering
  setStepInfo: (info: { step: number, total: number, labels: string[], title: string, subtitle: string }) => void;
}

const INITIAL_DATA: ContractData = {
  useAI: false,
  creationMethod: 'STANDARD',
  contractorType: 'company',
  contractorName: 'Mi Empresa S.A.C.',
  contractorId: '20123456789',
  contractorAddress: 'Av. Larco 123',
  contractorCity: 'Lima',
  contractorZip: '15074',
  contractorEmail: 'admin@miempresa.com',
  clientName: '',
  clientRep: false,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  serviceName: '',
  price: '',
  currency: 'USD',
  quantity: '1',
  description: '',
  paymentType: 'single',
  totalAmount: '',
  hasPenalty: true,
  contentBody: '',
  customFields: {}
};

// --- HELPER COMPONENTS ---

const InputField = ({ label, placeholder, value, onChange, type = "text", required = false, tooltip }: any) => (
    <div className="w-full">
        {label && (
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                {label} {required && <span className="text-red-500">*</span>}
                {tooltip && (
                    <div className="group relative">
                        <div className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] cursor-help">?</div>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-800 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-normal normal-case tracking-normal">
                            {tooltip}
                        </div>
                    </div>
                )}
            </label>
        )}
        <input 
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full border border-gray-200 bg-white rounded-xl px-4 py-3.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:text-gray-400 font-medium text-gray-700 hover:border-gray-300"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

// --- MODALS ---

const TemplateSelector = ({ templates, onClose, onSelect }: { templates: ContractTemplate[], onClose: () => void, onSelect: (template: ContractTemplate) => void }) => {
    const [search, setSearch] = useState('');
    const filtered = templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Seleccionar Plantilla</h2>
                        <p className="text-sm text-gray-500 mt-1">Selecciona una plantilla base para continuar</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                {/* Search */}
                <div className="px-8 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="bg-white border border-gray-200 rounded-xl flex items-center px-4 py-3 shadow-sm">
                        <SearchIcon className="w-5 h-5 text-gray-400 mr-3"/>
                        <input 
                           type="text" 
                           placeholder="Buscar plantilla..." 
                           className="bg-transparent text-sm w-full outline-none font-medium"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           autoFocus
                        />
                    </div>
                </div>
                {/* Grid */}
                <div className="p-8 overflow-y-auto bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(t => (
                            <button 
                                key={t.id}
                                onClick={() => onSelect(t)}
                                className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all text-left group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <FileTextIcon className="w-6 h-6 text-gray-400 group-hover:text-indigo-600"/>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">
                                        {t.category}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">{t.name}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-4">{t.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-start">
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 text-gray-500 font-bold text-sm hover:text-gray-800 transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg">
                        <ArrowLeftIcon className="w-4 h-4"/> Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

const TemplateConversionModal = ({ isOpen, onClose, contractData, originalContent, onConfirm }: { isOpen: boolean, onClose: () => void, contractData: ContractData, originalContent: string, onConfirm: (templateData: Partial<ContractTemplate>) => void }) => {
    const [templateName, setTemplateName] = useState(contractData.serviceName ? `Plantilla: ${contractData.serviceName}` : 'Nueva Plantilla Inteligente');
    const [selectedVars, setSelectedVars] = useState<Record<string, boolean>>({
        'contractorName': true,
        'clientName': true,
        'price': true,
        'startDate': true,
        'endDate': true,
        'serviceName': true
    });

    if (!isOpen) return null;

    // Helper to escape regex
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Mappings
    const variableMap: Record<string, string> = {
        'contractorName': '{{PROVEEDOR}}',
        'clientName': '{{CLIENTE}}',
        'price': '{{MONTO}}',
        'startDate': '{{FECHA_INICIO}}',
        'endDate': '{{FECHA_FIN}}',
        'serviceName': '{{SERVICIO}}'
    };

    const labelMap: Record<string, string> = {
        'contractorName': 'Nombre Proveedor',
        'clientName': 'Nombre Cliente',
        'price': 'Monto/Precio',
        'startDate': 'Fecha Inicio',
        'endDate': 'Fecha Fin',
        'serviceName': 'Descripción Servicio'
    };

    // Generate preview content based on selection
    let previewHtml = originalContent;
    Object.keys(selectedVars).forEach(key => {
        if (selectedVars[key] && (contractData as any)[key]) {
            const val = (contractData as any)[key];
            const variable = variableMap[key];
            if (val) {
                // Global replace of value with highlighted variable
                previewHtml = previewHtml.replace(
                    new RegExp(escapeRegExp(val), 'g'), 
                    `<span class="bg-indigo-100 text-indigo-700 px-1 rounded font-bold border border-indigo-200 text-xs">${variable}</span>`
                );
            }
        }
    });

    const handleConfirm = () => {
        // Create final content string
        let finalContent = originalContent;
        Object.keys(selectedVars).forEach(key => {
            if (selectedVars[key] && (contractData as any)[key]) {
                const val = (contractData as any)[key];
                const variable = variableMap[key];
                if (val) {
                    finalContent = finalContent.replace(new RegExp(escapeRegExp(val), 'g'), `<span class="variable" contenteditable="false">${variable}</span>`);
                }
            }
        });

        onConfirm({
            name: templateName,
            description: `Plantilla generada automáticamente desde solicitud IA.`,
            category: 'IA Templates',
            content: finalContent,
            icon: '🧠',
            color: 'bg-purple-50'
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                            <SparklesIcon className="w-6 h-6"/>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Conversión a Plantilla Inteligente</h2>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Motor de IA: Patrones detectados
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Settings Sidebar */}
                    <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre de la Plantilla</label>
                            <input 
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                            />
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <PenToolIcon className="w-4 h-4 text-indigo-500"/>
                            Variables Detectadas
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            La IA ha identificado los siguientes datos variables en el contrato. Selecciona cuáles deseas convertir en campos dinámicos.
                        </p>

                        <div className="space-y-3">
                            {Object.keys(variableMap).map(key => {
                                const val = (contractData as any)[key];
                                if (!val) return null;
                                return (
                                    <div key={key} className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedVars[key] ? 'bg-white border-indigo-200 shadow-sm' : 'bg-gray-100 border-transparent opacity-60'}`}
                                         onClick={() => setSelectedVars({...selectedVars, [key]: !selectedVars[key]})}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-gray-700">{labelMap[key]}</span>
                                            {selectedVars[key] && <CheckIcon className="w-4 h-4 text-indigo-600"/>}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]" title={val}>{val}</span>
                                            <ArrowLeftIcon className="w-3 h-3 text-gray-300"/>
                                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">{variableMap[key]}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 bg-gray-200 p-8 overflow-y-auto flex justify-center">
                        <div className="bg-white shadow-xl w-full max-w-2xl min-h-full p-12 border border-gray-200">
                             <div className="mb-4 text-xs font-bold text-gray-300 uppercase tracking-widest text-center border-b border-gray-100 pb-2">Vista Previa de la Plantilla</div>
                             <div 
                                className="prose prose-sm max-w-none font-serif text-gray-800 text-justify"
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                             />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3 z-10">
                    <button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-xl transition-colors">Cancelar</button>
                    <button onClick={handleConfirm} className="px-8 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-lg flex items-center gap-2">
                        <LayoutIcon className="w-4 h-4"/>
                        Guardar Plantilla
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- STEP COMPONENTS ---

const Step1Selection = ({ onSelect }: { onSelect: (method: 'STANDARD' | 'AI') => void }) => (
    <div className="animate-fade-in space-y-8 max-w-4xl mx-auto py-10">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Nueva Solicitud de Contrato</h2>
            <p className="text-gray-500 mt-2">Elige cómo deseas comenzar el proceso de creación.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => onSelect('STANDARD')}
              className="p-8 rounded-3xl border-2 border-gray-100 bg-white hover:border-indigo-600 hover:bg-indigo-50/30 transition-all text-left group shadow-sm hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FileTextIcon className="w-32 h-32 text-indigo-600" />
                </div>
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                    <FileTextIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Usar Plantilla Estándar</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Selecciona una plantilla pre-aprobada (Servicios, NDA, Arrendamiento) y completa el formulario manualmente.
                </p>
                <span className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                    Continuar <ChevronRightIcon className="w-4 h-4"/>
                </span>
            </button>

            <button 
              onClick={() => onSelect('AI')}
              className="p-8 rounded-3xl border-2 border-gray-100 bg-white hover:border-purple-600 hover:bg-purple-50/30 transition-all text-left group shadow-sm hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <SparklesIcon className="w-32 h-32 text-purple-600" />
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                    <SparklesIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Crear con Asistente IA</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Describe lo que necesitas en lenguaje natural y deja que nuestro agente legal redacte el borrador por ti.
                </p>
                <span className="text-purple-600 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                    Iniciar Chat <ChevronRightIcon className="w-4 h-4"/>
                </span>
            </button>
        </div>
    </div>
);

const Step1AIChat = ({ 
    data, 
    updateData, 
    onNext 
}: { 
    data: ContractData, 
    updateData: (f: keyof ContractData, v: any) => void, 
    onNext: () => void 
}) => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        {role: 'model', text: 'Hola, soy tu asistente de creación. Cuéntame qué contrato necesitas y te ayudaré a redactarlo.'}
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newUserMsg = { role: 'user' as const, text: inputValue };
        const newHistory = [...messages, newUserMsg];
        setMessages(newHistory);
        setInputValue('');
        setIsTyping(true);

        // Update description with full context
        const fullContext = newHistory.map(m => `${m.role === 'user' ? 'Usuario' : 'IA'}: ${m.text}`).join('\n');
        updateData('description', fullContext);

        try {
            const aiResponseText = await chatContractAssistant(newHistory, newUserMsg.text);
            setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, hubo un error. Intenta de nuevo.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleGeneratePreview = async () => {
        setIsGeneratingPreview(true);
        const fullContext = messages.map(m => `${m.role === 'user' ? 'Usuario' : 'IA'}: ${m.text}`).join('\n');
        const contractDataToGen = {
            ...data,
            description: fullContext
        };

        const generatedHtml = await generateFullContractBody(contractDataToGen);
        setPreviewContent(generatedHtml);
        updateData('contentBody', generatedHtml);
        setIsGeneratingPreview(false);
    };

    const handleConfirm = () => {
        if (editorRef.current) {
            updateData('contentBody', editorRef.current.innerHTML);
        }
        onNext();
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-fade-in">
            {/* Chat Column */}
            <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden flex flex-col h-full">
                 {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] rounded-full flex items-center justify-center text-white shadow-md">
                        <SparklesIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">Asistente de Creación</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> En línea
                        </p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                                    <SparklesIcon className="w-3 h-3"/>
                                </div>
                            )}
                            
                            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm text-xs leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user' 
                                ? 'bg-[#1E293B] text-white rounded-br-none' 
                                : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-sm">
                                <SparklesIcon className="w-3 h-3"/>
                            </div>
                            <div className="bg-white border border-gray-100 px-3 py-2 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe aquí..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-purple-500 outline-none transition-all"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                            className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3"/> Est: 2 min
                        </span>
                        <button 
                            onClick={handleGeneratePreview}
                            disabled={messages.length < 2 || isGeneratingPreview}
                            className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#7C3AED] transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:grayscale">
                            <SparklesIcon className="w-3 h-3"/>
                            {isGeneratingPreview ? 'Generando...' : 'Generar Borrador'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Column - Updated to PAPER STYLE */}
            <div className="flex-1 bg-gray-100 rounded-3xl border border-gray-200 shadow-inner flex flex-col overflow-hidden relative">
                {previewContent ? (
                    <>
                         {/* Toolbar */}
                        <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                    <FileTextIcon className="w-4 h-4"/> Vista Previa
                                </span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200 flex items-center gap-1">
                                    <PenToolIcon className="w-3 h-3"/> Editable
                                </span>
                            </div>
                            <button 
                                onClick={handleConfirm}
                                className="bg-gray-900 text-white px-5 py-2 rounded-lg font-bold text-xs shadow-md hover:bg-black transition-colors flex items-center gap-2">
                                Continuar con este Borrador <ChevronRightIcon className="w-3 h-3"/>
                            </button>
                        </div>
                        
                        {/* Editor - Paper Style */}
                        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                            <div 
                                ref={editorRef}
                                className="bg-white shadow-xl min-h-[1000px] w-full max-w-[800px] p-12 outline-none prose prose-sm max-w-none font-serif text-gray-800 text-justify border border-gray-200"
                                contentEditable
                                suppressContentEditableWarning
                                dangerouslySetInnerHTML={{ __html: previewContent }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <LayoutIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-500">Vista Previa del Documento</h3>
                        <p className="text-sm max-w-xs mt-2">
                            Conversa con el asistente para definir los detalles. Cuando estés listo, presiona <span className="font-bold text-purple-600">Generar Borrador</span> para ver el resultado aquí.
                        </p>
                    </div>
                )}
                
                {isGeneratingPreview && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-purple-600 font-bold animate-pulse">Redactando documento...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Step2 = ({ 
    role, 
    data, 
    updateData, 
    showAIWait, 
    handleSaveDraft, 
    handleNext,
    onPreview,
    isLawyerValidation,
    step
}: any) => {
    // Determine Template Type for Dynamic Fields
    const templateName = (data.templateName || '').toLowerCase();
    
    // Type Detectors
    const isRealEstate = templateName.includes('arrendamiento') || templateName.includes('alquiler') || templateName.includes('inmobiliario');
    const isHR = templateName.includes('laboral') || templateName.includes('empleo') || templateName.includes('trabajo');
    const isNDA = templateName.includes('confidencialidad') || templateName.includes('nda') || templateName.includes('secreto');
    const isService = !isRealEstate && !isHR && !isNDA; // Default

    // Field Label Mapping
    const getLabels = () => {
        if (isRealEstate) return {
            serviceName: 'Dirección del Inmueble',
            price: 'Renta Mensual',
            contractor: 'Arrendador (Propietario)',
            client: 'Arrendatario (Inquilino)',
            serviceTooltip: 'Ubicación exacta del inmueble a alquilar.'
        };
        if (isHR) return {
            serviceName: 'Puesto / Cargo',
            price: 'Salario Mensual',
            contractor: 'Empleador',
            client: 'Trabajador / Empleado',
            serviceTooltip: 'Cargo que desempeñará el trabajador.'
        };
        if (isNDA) return {
            serviceName: 'Información Confidencial',
            price: 'Cláusula Penal (Opcional)',
            contractor: 'Parte Reveladora',
            client: 'Parte Receptora',
            serviceTooltip: 'Describe brevemente qué tipo de información se protege.'
        };
        return {
            serviceName: 'Nombre del Servicio',
            price: 'Monto Total / Honorarios',
            contractor: 'Contratante (Cliente)',
            client: 'Proveedor (Contraparte)',
            serviceTooltip: 'Describe brevemente el objeto del contrato.'
        };
    };

    const labels = getLabels();

    // Helper for custom fields
    const updateCustomField = (key: string, value: string) => {
        const currentCustom = data.customFields || {};
        updateData('customFields', { ...currentCustom, [key]: value });
    };

    const getCustomValue = (key: string) => {
        return data.customFields ? data.customFields[key] || '' : '';
    };

    // AI WAIT VIEW (Flow B) for CLIENT
    if (data.creationMethod === 'AI' && showAIWait && role === 'CLIENT') {
        return (
            <div className="max-w-xl mx-auto text-center py-20 animate-fade-in">
                <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <div className="absolute inset-0 border-4 border-purple-100 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-pulse"></div>
                    <SparklesIcon className="w-12 h-12 text-purple-600 relative z-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Solicitud en Revisión Legal</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
                    Tu borrador ha sido generado por la IA y enviado al equipo legal para su validación obligatoria. Recibirás una notificación cuando esté listo.
                </p>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left max-w-md mx-auto space-y-4">
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-500">Ticket de Solicitud</span>
                        <span className="font-mono font-bold text-gray-900">REQ-{Math.floor(Math.random()*10000)}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-gray-500">Tiempo de Respuesta</span>
                        <span className="font-bold text-gray-900">~ 24 horas</span>
                    </div>
                    <div className="flex justify-between text-sm py-2">
                        <span className="text-gray-500">Estado Actual</span>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Pendiente Validación</span>
                    </div>
                </div>

                <button 
                  onClick={() => handleSaveDraft('PENDING_LEGAL_VALIDATION')}
                  className="mt-10 text-indigo-600 font-bold hover:text-indigo-800 transition-colors text-sm">
                    Volver a Mis Solicitudes
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in h-full">
            {/* Form Column */}
            <div className="lg:col-span-1 space-y-6 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
                <div className={`bg-white p-6 rounded-2xl border shadow-sm ${isLawyerValidation ? 'border-purple-200' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            {isLawyerValidation ? <SparklesIcon className="w-5 h-5 text-purple-600"/> : <FileTextIcon className="w-5 h-5 text-gray-400"/>}
                            {isLawyerValidation ? 'Validación de IA' : 'Datos del Contrato'}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${isLawyerValidation ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            {isLawyerValidation ? 'Revisión' : 'Borrador'}
                        </span>
                    </div>
                    
                    <div className="space-y-5">
                        <InputField 
                            label={labels.serviceName} 
                            value={data.serviceName} 
                            onChange={(v: string) => updateData('serviceName', v)} 
                            required 
                            tooltip={labels.serviceTooltip} 
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <InputField type="date" label="Fecha Inicio" value={data.startDate} onChange={(v: string) => updateData('startDate', v)} required />
                            <InputField type="date" label="Fecha Fin" value={data.endDate} onChange={(v: string) => updateData('endDate', v)} />
                        </div>
                        
                        {!isNDA && (
                            <div className="grid grid-cols-2 gap-4">
                                <InputField 
                                    label={labels.price} 
                                    type="number" 
                                    value={data.price} 
                                    onChange={(v: string) => updateData('price', v)} 
                                    required 
                                />
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Moneda</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-100" value={data.currency} onChange={(e) => updateData('currency', e.target.value)}>
                                        <option value="USD">USD ($)</option>
                                        <option value="PEN">PEN (S/)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Custom Fields per Template Type */}
                        {isRealEstate && (
                             <div className="grid grid-cols-2 gap-4">
                                <InputField 
                                    label="Garantía" 
                                    type="number" 
                                    value={getCustomValue('warranty')} 
                                    onChange={(v: string) => updateCustomField('warranty', v)} 
                                />
                                <InputField 
                                    label="Uso del Inmueble" 
                                    placeholder="Ej. Vivienda, Oficina"
                                    value={getCustomValue('use')} 
                                    onChange={(v: string) => updateCustomField('use', v)} 
                                />
                             </div>
                        )}

                        {isHR && (
                             <div className="grid grid-cols-2 gap-4">
                                <InputField 
                                    label="Horario de Trabajo" 
                                    placeholder="Ej. 9am - 6pm"
                                    value={getCustomValue('schedule')} 
                                    onChange={(v: string) => updateCustomField('schedule', v)} 
                                />
                                <InputField 
                                    label="Periodo de Prueba" 
                                    placeholder="Ej. 3 meses"
                                    value={getCustomValue('probation')} 
                                    onChange={(v: string) => updateCustomField('probation', v)} 
                                />
                             </div>
                        )}

                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Partes Involucradas</label>
                            <div className="space-y-3">
                                <input 
                                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" 
                                  placeholder={labels.contractor}
                                  value={data.contractorName} onChange={(e) => updateData('contractorName', e.target.value)}
                                />
                                <input 
                                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 outline-none" 
                                  placeholder={labels.client}
                                  value={data.clientName} onChange={(e) => updateData('clientName', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    {!isLawyerValidation && (
                      <button 
                          onClick={() => handleSaveDraft()}
                          className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">
                          Guardar Borrador
                      </button>
                    )}
                    <button 
                      onClick={onPreview}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md text-sm flex items-center justify-center gap-2">
                        <FileTextIcon className="w-4 h-4"/> Previsualizar
                    </button>
                </div>
            </div>

            {/* Helper Column or Preview */}
            <div className="lg:col-span-2 bg-gray-50 rounded-3xl border border-gray-200/50 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                     <FileTextIcon className="w-full h-full text-gray-900" />
                </div>
                <div className="max-w-md relative z-10">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                        <PenToolIcon className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-xl mb-3">
                        {isLawyerValidation ? 'Revisión de Contenido IA' : 'Completa los Datos'}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        {isLawyerValidation 
                          ? 'Revisa el contenido generado por la IA. Puedes editar los campos o el cuerpo del documento en la previsualización antes de aprobar.' 
                          : 'Ingresa la información clave del contrato. Puedes usar el botón "Previsualizar" en cualquier momento para ver cómo se renderiza el documento final.'}
                    </p>
                    
                    {isLawyerValidation ? (
                        <button 
                          onClick={handleNext}
                          className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-purple-700 transition-all flex items-center gap-2 mx-auto">
                            <CheckIcon className="w-5 h-5"/>
                            Validar y Enviar a Cliente
                        </button>
                    ) : (
                         <button 
                          onClick={() => handleNext()}
                          className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto">
                            Confirmar y Continuar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Step3 = ({ approvals, setApprovals, role, onNext, step, creationMethod }: any) => {
    const [newApproverName, setNewApproverName] = useState('');
    const [newApproverEmail, setNewApproverEmail] = useState('');

    const removeApprover = (index: number) => {
        const newApprovals = [...approvals];
        newApprovals.splice(index, 1);
        setApprovals(newApprovals);
    };

    const addApprover = () => {
        if (!newApproverName.trim()) return;
        setApprovals([...approvals, { 
            area: newApproverName, 
            email: newApproverEmail, 
            status: 'PENDING' 
        }]);
        setNewApproverName('');
        setNewApproverEmail('');
    };

    const handleSkip = () => {
        if (confirm("¿Deseas omitir las aprobaciones?")) {
            setApprovals([]);
            onNext();
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in py-8">
            <div className="text-center mb-10">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">PROCESO ESTÁNDAR</div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Gestión de Aprobaciones</h2>
                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                    Indica qué áreas o personas deben validar este documento. Si no se requiere ninguna validación, puedes omitir este paso.
                </p>
            </div>

            <div className="bg-gray-50 rounded-[32px] p-8 md:p-12 border border-gray-200/60 shadow-sm relative">
                {/* Dashed Border Container */}
                <div className="border-2 border-dashed border-indigo-200/60 rounded-3xl p-6 relative bg-white/40 min-h-[300px] flex flex-col">
                    {/* List */}
                    <div className="space-y-4 mb-8 flex-1">
                         {approvals.length === 0 ? (
                             <div className="text-center py-12 text-gray-400 flex flex-col items-center justify-center h-full">
                                 <UsersIcon className="w-12 h-12 mb-3 opacity-20"/>
                                 <p className="text-sm font-medium">No hay aprobadores asignados</p>
                                 <p className="text-xs">Agrega personas o áreas usando el formulario inferior</p>
                             </div>
                         ) : (
                             approvals.map((approval: any, index: number) => (
                                 <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                                     <div className="flex items-center gap-5">
                                         <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-400 text-lg">
                                             {index + 1}
                                         </div>
                                         <div>
                                             <h4 className="font-bold text-gray-900 text-lg">{approval.area}</h4>
                                             {approval.email && (
                                                 <p className="text-xs text-gray-500">{approval.email}</p>
                                             )}
                                             <div className="flex items-center gap-2 mt-1">
                                                 <span className={`w-2 h-2 rounded-full ${approval.status === 'APPROVED' ? 'bg-green-500' : (approval.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-400')}`}></span>
                                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                     {approval.status === 'PENDING' ? 'PENDIENTE' : approval.status}
                                                 </span>
                                             </div>
                                         </div>
                                     </div>

                                     <div className="flex items-center gap-4">
                                         <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200">
                                             EN REVISIÓN
                                         </span>
                                         {role === 'CLIENT' && (
                                             <button 
                                                onClick={() => removeApprover(index)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                             >
                                                 <XIcon className="w-5 h-5"/>
                                             </button>
                                         )}
                                     </div>
                                 </div>
                             ))
                         )}
                    </div>

                    {/* Input */}
                    {role === 'CLIENT' && (
                        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex-1 flex flex-col md:flex-row gap-2">
                                <input 
                                    className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400 border-b md:border-b-0 md:border-r border-gray-100"
                                    placeholder="Nombre o Área (Ej. Marketing)"
                                    value={newApproverName}
                                    onChange={(e) => setNewApproverName(e.target.value)}
                                />
                                <input 
                                    className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
                                    placeholder="Correo electrónico (Opcional)"
                                    value={newApproverEmail}
                                    onChange={(e) => setNewApproverEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addApprover()}
                                />
                            </div>
                            <button 
                                onClick={addApprover}
                                className="bg-gray-900 hover:bg-black text-white w-14 rounded-xl flex items-center justify-center shadow-md transition-colors"
                            >
                                <PlusIcon className="w-6 h-6"/>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Demo Link */}
             <div className="text-center mt-6 mb-12">
                 <button 
                    onClick={() => {
                        const newApprovals = approvals.map((a: any) => ({ ...a, status: 'APPROVED', date: new Date().toLocaleDateString(), approverName: 'Sistema' }));
                        setApprovals(newApprovals);
                    }}
                    className="text-sm text-indigo-500 hover:text-indigo-700 underline font-medium"
                 >
                     (Demo: Simular Aprobación de Áreas)
                 </button>
             </div>

            {/* Footer */}
            <div className="flex justify-between items-center border-t border-gray-100 pt-8">
                 <button 
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors"
                 >
                    Omitir este paso
                 </button>

                 <div className="flex items-center gap-6">
                     <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4"/>
                        Las notificaciones se envían automáticamente.
                     </div>
                     <button 
                        onClick={onNext}
                        className="bg-[#4F46E5] text-white px-10 py-4 rounded-xl font-bold text-base shadow-xl hover:bg-[#4338CA] transition-all hover:-translate-y-1"
                     >
                        Siguiente
                     </button>
                 </div>
            </div>
        </div>
    );
};

const Step4 = ({ signers, setSigners, onNext, step, creationMethod }: { signers: Signer[], setSigners: (s: Signer[]) => void, onNext: () => void, step: number, creationMethod: 'STANDARD'|'AI' }) => {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in space-y-8">
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Proceso Estándar</div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Firmantes</h2>
                    <p className="text-gray-500 mt-2">Gestión de Firmantes<br/>Configura quiénes deben firmar y en qué orden.</p>
                </div>
                <button 
                    onClick={() => setSigners([...signers, { id: Date.now().toString(), name: '', email: '', role: 'Parte B', order: signers.length + 1, status: 'PENDING', type: 'EXTERNAL' }])}
                    className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 shadow-lg transition-colors">
                    <UsersIcon className="w-4 h-4"/> Agregar Firmante
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 p-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-4">DATOS DEL FIRMANTE</div>
                    <div className="col-span-2">ROL</div>
                    <div className="col-span-3 text-center">TIPO DE USUARIO</div>
                    <div className="col-span-1 text-center">ORDEN</div>
                    <div className="col-span-1"></div>
                </div>
                <div className="divide-y divide-gray-100">
                    {signers.map((signer, index) => (
                        <div key={signer.id} className="grid grid-cols-12 p-5 items-start gap-4 hover:bg-gray-50 transition-colors">
                            <div className="col-span-1 flex justify-center pt-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="col-span-4 space-y-3">
                                {/* Stacked Inputs for Name and Email */}
                                <div className="p-3 border border-dashed border-blue-200 rounded-xl bg-blue-50/30">
                                    <input 
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-bold text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:font-normal mb-2"
                                        placeholder="Nombre Completo"
                                        value={signer.name}
                                        onChange={(e) => {
                                            const newSigners = [...signers];
                                            newSigners[index].name = e.target.value;
                                            setSigners(newSigners);
                                        }}
                                    />
                                    <input 
                                        className="w-full bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none text-xs text-gray-600 py-1"
                                        placeholder="Correo electrónico"
                                        value={signer.email}
                                        onChange={(e) => {
                                            const newSigners = [...signers];
                                            newSigners[index].email = e.target.value;
                                            setSigners(newSigners);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-2 pt-2">
                                <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                    <select 
                                        className="w-full bg-white text-sm px-3 py-2 outline-none cursor-pointer"
                                        value={signer.role}
                                        onChange={(e) => {
                                            const newSigners = [...signers];
                                            newSigners[index].role = e.target.value as any;
                                            setSigners(newSigners);
                                        }}
                                    >
                                        <option value="Parte A">Parte A</option>
                                        <option value="Parte B">Parte B</option>
                                        <option value="Testigo">Testigo</option>
                                        <option value="Revisor">Revisor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-3 pt-2 px-4">
                                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                                    <button 
                                        onClick={() => {
                                            const newSigners = [...signers];
                                            newSigners[index].type = 'REGISTERED';
                                            setSigners(newSigners);
                                        }}
                                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${signer.type === 'REGISTERED' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                        Registrado
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const newSigners = [...signers];
                                            newSigners[index].type = 'EXTERNAL';
                                            setSigners(newSigners);
                                        }}
                                        className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${signer.type === 'EXTERNAL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                        Externo
                                    </button>
                                </div>
                            </div>
                            <div className="col-span-1 pt-2">
                                <div className="w-full border border-gray-200 rounded-lg bg-white">
                                    <input 
                                        type="number"
                                        className="w-full text-center text-sm font-bold py-2 outline-none rounded-lg"
                                        value={signer.order}
                                        onChange={(e) => {
                                            const newSigners = [...signers];
                                            newSigners[index].order = parseInt(e.target.value);
                                            setSigners(newSigners);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex justify-center pt-2">
                                <button 
                                    onClick={() => setSigners(signers.filter(s => s.id !== signer.id))}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                    <XIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    ))}
                    {signers.length === 0 && (
                        <div className="p-10 text-center text-gray-400">
                            <UsersIcon className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                            <p>No hay firmantes asignados</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <LockIcon className="w-4 h-4"/>
                    <span>Seguridad: Firma digital con sellado de tiempo (TSA).</span>
                </div>
                <button onClick={onNext} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                    Finalizar y Enviar a Firma
                </button>
            </div>
          </div>
      </div>
    );
};

const Step5 = ({ onFinish, code, onReset, data, onConvert }: any) => (
    <div className="max-w-xl mx-auto text-center py-20 animate-scale-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckIcon className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">¡Contrato Generado!</h2>
        <p className="text-gray-500 mb-8">
            El proceso de firma ha iniciado. Se han enviado las notificaciones correspondientes a los firmantes.
        </p>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-500 uppercase">Código de Contrato</span>
                <span className="font-mono text-lg font-bold text-indigo-600">{code}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase">Estado Actual</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">En Proceso de Firma</span>
            </div>
        </div>

        {/* AI Template Suggestion */}
        {data?.creationMethod === 'AI' && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-indigo-100 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer" onClick={onConvert}>
                <div className="absolute top-0 right-0 p-2">
                    <SparklesIcon className="w-12 h-12 text-indigo-200 opacity-50 rotate-12" />
                </div>
                <div className="flex items-start gap-4 relative z-10 text-left">
                     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-100 shrink-0">
                         <LayoutIcon className="w-5 h-5" />
                     </div>
                     <div>
                         <h4 className="font-bold text-gray-900 text-sm mb-1">Convertir a Plantilla Inteligente</h4>
                         <p className="text-xs text-gray-600 leading-relaxed mb-3">
                             Hemos detectado patrones en este contrato. Guárdalo como plantilla para reutilizarlo en el futuro.
                         </p>
                         <button className="text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm hover:bg-indigo-50 transition-colors">
                             ✨ Revisar y Guardar
                         </button>
                     </div>
                </div>
            </div>
        )}

        <div className="flex justify-center gap-4">
             <button 
               onClick={() => onFinish({} as any)} 
               className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                 Ir a Mis Contratos
             </button>
             <button 
               onClick={onReset}
               className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
                 Crear Nueva Solicitud
             </button>
        </div>
    </div>
);

const PreviewModal = ({ isOpen, onClose, contentBody, isLoading, onEdit, onNext, role, isAI }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-5xl h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                            <FileTextIcon className="w-5 h-5"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">Vista Previa del Contrato</h3>
                            <p className="text-xs text-gray-500">Borrador Preliminar</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>
                
                {/* Document Body - PAPER STYLE */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100 flex justify-center">
                    <div className="bg-white shadow-xl min-h-[1000px] w-full max-w-[800px] p-12 md:p-16 border border-gray-200 print:shadow-none">
                         {isLoading ? (
                             <div className="flex flex-col items-center justify-center py-32">
                                 <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                 <p className="text-indigo-600 font-bold">Generando documento...</p>
                                 <p className="text-xs text-gray-400 mt-2">Esto puede tomar unos segundos</p>
                             </div>
                         ) : (
                             <div className="prose prose-sm max-w-none text-gray-800 font-serif leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: contentBody || '' }} />
                         )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-4 bg-white z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onClick={onEdit} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                        Editar Datos
                    </button>
                    <button 
                      onClick={onNext}
                      className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all flex items-center gap-2">
                        <CheckIcon className="w-5 h-5"/>
                        {role === 'LAWYER' && isAI ? 'Validar Contrato' : 'Guardar y Continuar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const CreateContract: React.FC<CreateContractProps> = ({ role, onBack, onFinish, onSaveTemplate, existingContract, initialTemplate, templates, setStepInfo }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ContractData>(existingContract?.data || INITIAL_DATA);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // State for Signers
  const [signers, setSigners] = useState<Signer[]>(existingContract?.signers || []);
  
  // State for Approvals
  const [approvals, setApprovals] = useState<Approval[]>(existingContract?.approvals || []); // Initialized empty for standard process

  // UI States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showAIWait, setShowAIWait] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Template Selector state (if starting from scratch)
  const [showTemplateSelector, setShowTemplateSelector] = useState(!existingContract && !initialTemplate);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

  // Define steps
  const steps = data.creationMethod === 'AI' 
      ? ['Asistente IA', 'Revisión', 'Aprobaciones', 'Firma', 'Fin']
      : ['Selección', 'Datos', 'Aprobaciones', 'Firma', 'Fin'];

  // Update header info when step or data changes
  useEffect(() => {
      let title = "Nueva Solicitud";
      let subtitle = "Selección de Método";

      if (step === 2) {
          if (data.creationMethod === 'AI') {
              title = "Asistente de Creación";
              subtitle = showAIWait ? "Solicitud en Proceso" : "Creación Asistida";
          } else {
              title = "Detalles del Contrato";
              subtitle = "Información del Documento";
          }
      } else if (step === 3) {
          title = "Gestión de Aprobaciones";
          subtitle = "Validación Interna";
      } else if (step === 4) {
          title = "Gestión de Firmantes";
          subtitle = "Configuración de Firmas";
      } else if (step === 5) {
          title = "Proceso Finalizado";
          subtitle = "Contrato Generado";
      }

      setStepInfo({
          step,
          total: steps.length,
          labels: steps,
          title,
          subtitle
      });
  }, [step, data.creationMethod, showAIWait, setStepInfo]);

  // Initialize
  useEffect(() => {
      if (initialTemplate) {
          setData(prev => ({ ...prev, creationMethod: 'STANDARD', templateId: initialTemplate.id, templateName: initialTemplate.name }));
          setShowTemplateSelector(false);
          setStep(2); // Jump to data entry
      }

      if (existingContract) {
          setShowTemplateSelector(false);
          // Restore state based on status
          if (existingContract.status === 'PENDING_LEGAL_VALIDATION') {
             if (role === 'CLIENT') {
                 setShowAIWait(true);
                 setStep(2); // Wait view
             } else {
                 setStep(2); // Lawyer review view
                 if (!data.contentBody) generateDocument();
             }
          } else if (existingContract.status === 'INTERNAL_REVIEW') {
              setStep(3);
          } else if (existingContract.status === 'SIGNATURE_PENDING' || existingContract.status === 'SIGNED') {
              setStep(4);
          } else {
              setStep(2); // Draft
          }
      }
  }, [existingContract, initialTemplate, role]);

  const updateData = (field: keyof ContractData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const generateDocument = async () => {
      if (data.contentBody && !isLoadingAI) return; // Prevent re-generation if exists
      setIsLoadingAI(true);
      const htmlContent = await generateFullContractBody(data);
      setData(prev => ({ ...prev, contentBody: htmlContent }));
      setIsLoadingAI(false);
  };

  const handleNext = async () => {
    // Step 2: Data Entry (Standard) or AI Wait (Flow B)
    if (step === 2) {
        if (data.creationMethod === 'AI') {
            if (role === 'CLIENT' && showAIWait) {
                // Client is waiting, cannot proceed manually unless "Finish"
                handleSaveDraft('PENDING_LEGAL_VALIDATION');
                return;
            }
            // If Lawyer is reviewing AI draft
            if (role === 'LAWYER' && existingContract?.status === 'PENDING_LEGAL_VALIDATION') {
                // Update status to INTERNAL_REVIEW (Approved by Lawyer)
                handleSaveDraft('INTERNAL_REVIEW');
                alert("Solicitud validada. Iniciando fase de aprobaciones.");
                setStep(3);
                return;
            }
             setStep(3);
        } else {
            // Standard Flow: Data Entry -> Approval
            setStep(3);
        }
    } 
    // Step 3: Approvals
    else if (step === 3) {
        const allApproved = approvals.every(a => a.status === 'APPROVED');
        if (approvals.length > 0 && !allApproved && role === 'CLIENT') {
            alert("Aún hay aprobaciones pendientes. La solicitud avanzará automáticamente cuando se completen. (Para esta demo, puedes simular la aprobación con el enlace inferior)");
            return; 
        }
        setStep(4);
    } 
    // Step 4: Signers
    else if (step === 4) {
        if (signers.length === 0) {
            alert("Debe agregar al menos un firmante.");
            return;
        }
        handleFinishContract();
    }
  };

  const handleSaveDraft = (status: ContractState = 'DRAFT') => {
      const draft: SavedContract = {
          id: existingContract?.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: data.serviceName || (data.creationMethod === 'AI' ? 'Solicitud IA' : `Contrato ${data.templateName || 'Borrador'}`),
          type: data.creationMethod === 'AI' ? 'IA' : (data.templateName || 'Servicios'),
          date: new Date().toLocaleDateString(),
          endDate: data.endDate,
          status: status,
          signers: signers,
          approvals: approvals,
          previewContent: data.contentBody,
          data: data
      };
      onFinish(draft);
  };

  const handleFinishContract = () => {
      const finalCode = 'CTR-' + Math.floor(Math.random() * 10000);
      setGeneratedCode(finalCode);
      const finalContract: SavedContract = {
          id: existingContract?.id || Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: data.serviceName || 'Contrato Final',
          type: data.creationMethod === 'AI' ? 'IA' : 'Estándar',
          date: new Date().toLocaleDateString(),
          endDate: data.endDate,
          status: 'SIGNATURE_PENDING',
          signers: signers,
          approvals: approvals,
          previewContent: data.contentBody,
          data: data
      };
      onFinish(finalContract);
      setStep(5);
  };

  const handleReset = () => {
    setStep(1); 
    setData(INITIAL_DATA); 
    setSigners([]); 
    setShowTemplateSelector(true);
  };

  const handleTemplateSelection = (template: ContractTemplate) => {
      updateData('templateName', template.name);
      updateData('templateId', template.id);
      setIsTemplateModalOpen(false);
      setShowTemplateSelector(false);
      setStep(2);
  };

  const handleConvertTemplate = (templateData: Partial<ContractTemplate>) => {
      // Mock converting contract to template
      const newTemplate: ContractTemplate = {
          id: `TPL-AI-${Date.now()}`,
          name: templateData.name || 'Nueva Plantilla',
          description: templateData.description || 'Generada por IA',
          category: templateData.category || 'IA',
          color: templateData.color || 'bg-purple-50',
          icon: templateData.icon || '🧠',
          content: templateData.content || data.contentBody,
          isPrivate: true
      };
      
      if (onSaveTemplate) {
          const contractWrapper: SavedContract = {
              ...existingContract!, // or current state
              id: 'TEMP-CONVERSION',
              name: newTemplate.name,
              status: 'COMPLETED',
              type: 'TEMPLATE',
              date: new Date().toLocaleDateString(),
              signers: [],
              data: { ...data, contentBody: newTemplate.content }
          };
          onSaveTemplate(contractWrapper);
      }
      setIsConversionModalOpen(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-full flex flex-col">
      {/* Step Indicator and Header Logic Moved to App.tsx via setStepInfo */}
      {/* Content */}
      <div className="flex-1 relative">
         {step === 1 && (showTemplateSelector ? (
             <Step1Selection onSelect={(method) => { 
                updateData('creationMethod', method); 
                if(method === 'STANDARD') {
                    setIsTemplateModalOpen(true);
                } else {
                    setShowTemplateSelector(false); // Show Chat
                }
             }} />
         ) : (
             <Step1AIChat 
                data={data}
                updateData={updateData}
                onNext={() => {
                    setShowAIWait(true);
                    setStep(2);
                }}
             />
         ))}

         {step === 2 && (
             <Step2 
                role={role}
                data={data}
                updateData={updateData}
                showAIWait={showAIWait}
                handleSaveDraft={handleSaveDraft}
                handleNext={handleNext}
                onPreview={() => { if(!data.contentBody) generateDocument(); setIsPreviewOpen(true); }}
                isLawyerValidation={role === 'LAWYER' && data.creationMethod === 'AI'}
                step={step}
             />
         )}

         {step === 3 && (
             <Step3 
                approvals={approvals}
                setApprovals={setApprovals}
                role={role}
                onNext={handleNext}
                step={step}
                creationMethod={data.creationMethod}
             />
         )}

         {step === 4 && (
             <Step4 
                signers={signers} 
                setSigners={setSigners} 
                onNext={handleNext}
                step={step}
                creationMethod={data.creationMethod}
             />
         )}

         {step === 5 && (
             <Step5 
                onFinish={onFinish} 
                code={generatedCode} 
                onReset={handleReset}
                data={data}
                onConvert={() => setIsConversionModalOpen(true)}
             />
         )}
      </div>
      
      {/* Modal Overlay */}
      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        contentBody={data.contentBody}
        isLoading={isLoadingAI}
        onEdit={() => setIsPreviewOpen(false)}
        onNext={() => { setIsPreviewOpen(false); handleNext(); }}
        role={role}
        isAI={data.creationMethod === 'AI'}
      />

      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
          <TemplateSelector 
            templates={templates || []} 
            onClose={() => setIsTemplateModalOpen(false)} 
            onSelect={handleTemplateSelection} 
          />
      )}

      {/* Template Conversion Modal */}
      {isConversionModalOpen && (
          <TemplateConversionModal 
            isOpen={isConversionModalOpen}
            onClose={() => setIsConversionModalOpen(false)}
            contractData={data}
            originalContent={data.contentBody || ''}
            onConfirm={handleConvertTemplate}
          />
      )}
    </div>
  );
};
