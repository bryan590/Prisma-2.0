
import React, { useState, useRef } from 'react';
import { ContractTemplate } from '../types';
import { PlusIcon, XIcon, FileTextIcon, PenToolIcon, LayoutIcon, CheckIcon, ChevronRightIcon } from '../components/Icons';

interface TemplateManagementProps {
    templates: ContractTemplate[];
    onAddTemplate: (template: ContractTemplate) => void;
}

export const TemplateManagement: React.FC<TemplateManagementProps> = ({ templates: initialTemplates, onAddTemplate }) => {
    const [templates, setTemplates] = useState(initialTemplates);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Editor State
    const [templateForm, setTemplateForm] = useState<Partial<ContractTemplate>>({
        category: 'Comercial',
        color: 'bg-gray-100',
        content: `<h2>CONTRATO DE [TIPO DE CONTRATO]</h2>
<p>Conste por el presente documento, el contrato que celebran de una parte <span class="variable" contenteditable="false">{{PART_A_NAME}}</span>, con RUC N° <span class="variable" contenteditable="false">{{PART_A_ID}}</span>, y de la otra parte <span class="variable" contenteditable="false">{{PART_B_NAME}}</span>, identificado con DNI/RUC <span class="variable" contenteditable="false">{{PART_B_ID}}</span>.</p>
<h3>1. OBJETO</h3>
<p>El presente contrato tiene por objeto la prestación de servicios de <span class="variable" contenteditable="false">{{SERVICE_NAME}}</span>.</p>
<h3>2. VIGENCIA</h3>
<p>El plazo de duración será desde <span class="variable" contenteditable="false">{{START_DATE}}</span> hasta <span class="variable" contenteditable="false">{{END_DATE}}</span>.</p>`
    });

    const editorRef = useRef<HTMLDivElement>(null);

    const availableVariables = [
        { label: 'Nombre Parte A (Nosotros)', value: '{{PART_A_NAME}}' },
        { label: 'ID Parte A (RUC)', value: '{{PART_A_ID}}' },
        { label: 'Nombre Parte B (Cliente)', value: '{{PART_B_NAME}}' },
        { label: 'ID Parte B (DNI/RUC)', value: '{{PART_B_ID}}' },
        { label: 'Nombre del Servicio', value: '{{SERVICE_NAME}}' },
        { label: 'Monto / Precio', value: '{{PRICE}}' },
        { label: 'Moneda', value: '{{CURRENCY}}' },
        { label: 'Fecha Inicio', value: '{{START_DATE}}' },
        { label: 'Fecha Fin', value: '{{END_DATE}}' },
    ];

    const handleOpenCreate = () => {
        setEditingId(null);
        setTemplateForm({ 
            category: 'Comercial', 
            color: 'bg-gray-100',
            name: '',
            description: '',
            content: `<h2>TITULO DEL CONTRATO</h2><p>Escribe aquí el contenido de tu plantilla...</p>`
        });
        setIsEditorOpen(true);
    };

    const handleOpenEdit = (template: ContractTemplate) => {
        setEditingId(template.id);
        setTemplateForm({ ...template });
        setIsEditorOpen(true);
    };

    const insertVariable = (variable: {label: string, value: string}) => {
        const span = `<span class="variable" contenteditable="false" style="background-color: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 0.9em; margin: 0 2px;">${variable.value}</span>&nbsp;`;
        document.execCommand('insertHTML', false, span);
    };

    const handleSave = () => {
        if (templateForm.name && templateForm.description) {
            // Get content from ref
            const currentContent = editorRef.current?.innerHTML || templateForm.content;

            const finalTemplateData = {
                ...templateForm,
                content: currentContent
            };

            if (editingId) {
                // Edit Mode
                const updatedTemplates = templates.map(t => 
                    t.id === editingId ? { ...t, ...finalTemplateData } as ContractTemplate : t
                );
                setTemplates(updatedTemplates);
                // Propagate if needed
            } else {
                // Create Mode
                const newTemplate: ContractTemplate = {
                    id: Date.now().toString(),
                    name: templateForm.name!,
                    description: templateForm.description!,
                    category: templateForm.category || 'Legal',
                    color: templateForm.color || 'bg-gray-100',
                    icon: templateForm.icon || '📄',
                    content: currentContent
                };
                setTemplates([...templates, newTemplate]);
                onAddTemplate(newTemplate);
            }
            setIsEditorOpen(false);
        } else {
            alert("Por favor completa el nombre y descripción de la plantilla.");
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in h-full flex flex-col">
             {!isEditorOpen ? (
                 <>
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Plantillas</h1>
                            <p className="text-gray-500 text-sm mt-1">Crea, edita y publica plantillas para el uso de la organización.</p>
                        </div>
                        <button 
                            onClick={handleOpenCreate}
                            className="bg-[#6366F1] text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#4F46E5] transition-colors shadow-lg shadow-indigo-200">
                            <PlusIcon className="w-4 h-4" />
                            Nueva Plantilla
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-8">
                        {templates.map(t => (
                            <div key={t.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all group flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${t.color}`}>
                                        {t.icon || '📄'}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded-md">
                                        {t.category}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 min-h-[40px] leading-relaxed flex-1 line-clamp-3">{t.description}</p>
                                
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Publicada
                                    </span>
                                    <button 
                                        onClick={() => handleOpenEdit(t)}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </>
             ) : (
                /* --- TEMPLATE EDITOR UI --- */
                <div className="flex flex-col h-[calc(100vh-140px)] animate-scale-in">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 shrink-0 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                             <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                 <XIcon className="w-5 h-5"/>
                             </button>
                             <div>
                                 <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Editar Plantilla' : 'Nueva Plantilla'}</h2>
                                 <p className="text-xs text-gray-500">Define la estructura y las variables dinámicas.</p>
                             </div>
                        </div>
                        <div className="flex gap-3">
                             <button onClick={() => setIsEditorOpen(false)} className="px-6 py-2.5 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-xl transition-colors">Cancelar</button>
                             <button onClick={handleSave} className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 shadow-md flex items-center gap-2">
                                 <CheckIcon className="w-4 h-4"/>
                                 Guardar Plantilla
                             </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex gap-6 flex-1 overflow-hidden">
                        
                        {/* Left Panel: Settings & Variables */}
                        <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-1">
                             {/* Metadata Card */}
                             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                 <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                     <LayoutIcon className="w-4 h-4 text-gray-400"/> Información General
                                 </h3>
                                 <div className="space-y-4">
                                     <div>
                                         <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Nombre</label>
                                         <input 
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all font-bold text-gray-700"
                                            value={templateForm.name || ''}
                                            onChange={e => setTemplateForm({...templateForm, name: e.target.value})}
                                            placeholder="Ej. Contrato de Locación"
                                         />
                                     </div>
                                     <div className="grid grid-cols-2 gap-4">
                                         <div>
                                             <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Categoría</label>
                                             <select 
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all cursor-pointer"
                                                value={templateForm.category}
                                                onChange={e => setTemplateForm({...templateForm, category: e.target.value})}
                                             >
                                                 {['Comercial', 'Legal', 'RRHH', 'Inmobiliario', 'Tecnología'].map(c => <option key={c} value={c}>{c}</option>)}
                                             </select>
                                         </div>
                                         <div>
                                             <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Color</label>
                                             <select 
                                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all cursor-pointer"
                                                value={templateForm.color}
                                                onChange={e => setTemplateForm({...templateForm, color: e.target.value})}
                                             >
                                                 <option value="bg-gray-100">Gris</option>
                                                 <option value="bg-indigo-100">Indigo</option>
                                                 <option value="bg-purple-100">Púrpura</option>
                                                 <option value="bg-emerald-100">Verde</option>
                                             </select>
                                         </div>
                                     </div>
                                     <div>
                                         <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Descripción</label>
                                         <textarea 
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 bg-gray-50 focus:bg-white transition-all resize-none h-20"
                                            value={templateForm.description || ''}
                                            onChange={e => setTemplateForm({...templateForm, description: e.target.value})}
                                            placeholder="Propósito de esta plantilla..."
                                         />
                                     </div>
                                 </div>
                             </div>

                             {/* Variables Toolbox */}
                             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex-1">
                                 <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                     <PenToolIcon className="w-4 h-4 text-gray-400"/> Variables Dinámicas
                                 </h3>
                                 <p className="text-xs text-gray-500 mb-4">Haz clic para insertar un campo variable en el documento.</p>
                                 
                                 <div className="flex flex-col gap-2">
                                     {availableVariables.map((v) => (
                                         <button 
                                            key={v.value}
                                            onClick={() => insertVariable(v)}
                                            className="text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl text-indigo-700 font-bold text-xs transition-colors flex justify-between items-center group"
                                         >
                                             {v.label}
                                             <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-200 px-1.5 rounded text-[10px]">{v.value}</span>
                                         </button>
                                     ))}
                                 </div>
                             </div>
                        </div>

                        {/* Right Panel: Document Editor */}
                        <div className="w-2/3 bg-gray-100 rounded-2xl border border-gray-200 shadow-inner overflow-hidden flex flex-col relative">
                            {/* Toolbar */}
                            <div className="bg-white border-b border-gray-200 p-2 flex gap-2 items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-gray-400 uppercase mr-2">Vista de Diseño</span>
                                <div className="h-4 w-px bg-gray-200"></div>
                                <span className="text-xs text-gray-500">El texto resaltado en azul será reemplazado por los datos del formulario.</span>
                            </div>

                            {/* Paper */}
                            <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                                <div 
                                    ref={editorRef}
                                    className="bg-white shadow-xl w-full max-w-[800px] min-h-[1000px] p-12 outline-none prose prose-sm max-w-none font-serif text-gray-800"
                                    contentEditable
                                    suppressContentEditableWarning
                                    dangerouslySetInnerHTML={{ __html: templateForm.content || '' }}
                                    style={{ whiteSpace: 'pre-wrap' }}
                                >
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
             )}
        </div>
    );
};
