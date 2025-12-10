
import React, { useState, useRef } from 'react';
import { SavedContract } from '../types';
import { ArrowLeftIcon, CheckIcon, XIcon, MessageCircleIcon, PenToolIcon, SparklesIcon } from '../components/Icons';

interface AIValidationDetailProps {
    contract: SavedContract;
    onBack: () => void;
    onApprove: (contract: SavedContract) => void;
    onReject: (id: string) => void;
}

export const AIValidationDetail: React.FC<AIValidationDetailProps> = ({ contract, onBack, onApprove, onReject }) => {
    const [editableContent, setEditableContent] = useState(contract.data?.contentBody || '');
    const [isEditing, setIsEditing] = useState(false);
    const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
    const [changeComments, setChangeComments] = useState('');
    
    const editorRef = useRef<HTMLDivElement>(null);

    const handleApprove = () => {
        const updatedContract = {
            ...contract,
            data: {
                ...contract.data!,
                contentBody: editableContent
            }
        };
        onApprove(updatedContract);
    };

    const submitChangesRequest = () => {
        if (!changeComments.trim()) return;
        alert("Se han enviado los comentarios al cliente y el estado ha cambiado a 'Requiere Ajustes'.");
        // In a real app, this would update the contract status and save the comments
        setShowRequestChangesModal(false);
        onBack();
    };

    const handleHighlight = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        // Check if selection is inside our editor
        if (editorRef.current && !editorRef.current.contains(selection.anchorNode)) return;

        document.execCommand('hiliteColor', false, '#fef08a'); // Standard yellow highlight
        
        if (editorRef.current) {
            setEditableContent(editorRef.current.innerHTML);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col bg-[#F8FAFC]">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600"/>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{contract.name}</h1>
                        <div className="flex items-center gap-3 text-sm mt-1">
                            <span className="font-mono text-gray-500">{contract.id}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                                Revisión Pendiente
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => {
                            if(confirm("¿Estás seguro de rechazar esta solicitud?")) onReject(contract.id);
                        }}
                        className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors">
                        Rechazar
                    </button>
                    <button 
                        onClick={() => setShowRequestChangesModal(true)}
                        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <MessageCircleIcon className="w-4 h-4"/>
                        Solicitar Cambios
                    </button>
                    <button 
                        onClick={handleApprove}
                        className="px-6 py-2.5 bg-[#10B981] text-white border border-[#059669] rounded-xl font-bold text-sm shadow-md hover:bg-[#059669] transition-colors flex items-center gap-2">
                        <CheckIcon className="w-4 h-4"/>
                        Aprobar y Firmar
                    </button>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left: Context & Metadata */}
                <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Context (Prompt) */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3">Contexto (Prompt del Usuario)</h3>
                        <div className="bg-[#EEF2FF] p-5 rounded-2xl border border-indigo-100">
                            <div className="bg-white/60 p-4 rounded-xl border border-indigo-100/50 shadow-sm backdrop-blur-sm">
                                <p className="text-sm font-bold text-[#4F46E5] mb-2">Prompt Original:</p>
                                <p className="text-gray-700 text-sm italic leading-relaxed">
                                    {contract.data?.description || "No hay prompt registrado. Creado vía formulario."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Metadatos</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-400 font-bold mb-1 uppercase">Tipo</div>
                                    <div className="text-sm font-bold text-gray-900">
                                        {contract.data?.creationMethod === 'AI' ? 'Estándar' : 'Estándar'} 
                                        {/* Assuming screen shot logic, usually AI is Generativo */}
                                    </div>
                                </div>
                                <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="text-xs text-gray-400 font-bold mb-1 uppercase">Creado por</div>
                                    <div className="text-sm font-bold text-gray-900">{contract.data?.contractorName || 'Ana García'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Editable Preview - PAPER STYLE */}
                <div className="w-2/3 bg-gray-100 rounded-2xl border border-gray-200 shadow-inner flex flex-col overflow-hidden relative">
                    {/* Editor Header / Toolbar */}
                    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Borrador Generado por IA</span>
                        
                        <div className="flex items-center gap-4">
                             {/* Highlight Button */}
                             <button 
                                onClick={handleHighlight}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 border border-yellow-200 transition-colors text-xs font-bold"
                                title="Resaltar texto seleccionado"
                            >
                                <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500"></span>
                                Resaltar
                            </button>

                            <div className="w-px h-4 bg-gray-200"></div>

                            <div className="flex items-center gap-2 text-gray-400">
                                {isEditing && <span className="text-xs text-indigo-600 font-bold animate-pulse">Guardando...</span>}
                                <div className="flex items-center gap-1 text-xs font-bold text-gray-400 select-none">
                                    <PenToolIcon className="w-3 h-3"/> Editable
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content - A4 Paper Style */}
                    <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                         <div 
                            id="contract-editor"
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => {
                                setEditableContent(e.currentTarget.innerHTML);
                                setIsEditing(true);
                                setTimeout(() => setIsEditing(false), 1000);
                            }}
                            className="bg-white shadow-xl min-h-[1000px] w-full max-w-[800px] p-12 md:p-16 border border-gray-200 prose prose-sm max-w-none font-serif text-gray-800 outline-none focus:outline-none text-justify"
                            style={{ whiteSpace: 'pre-wrap' }}
                            dangerouslySetInnerHTML={{ __html: editableContent }}
                         />
                    </div>
                </div>
            </div>

            {/* Request Changes Modal */}
            {showRequestChangesModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-scale-in">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <MessageCircleIcon className="w-5 h-5 text-indigo-600"/>
                                Solicitar Cambios
                            </h3>
                            <button onClick={() => setShowRequestChangesModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XIcon className="w-5 h-5"/>
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4">
                            Describe los ajustes que necesitas que realice el solicitante. Estos comentarios serán enviados y el estado pasará a "Requiere Ajustes".
                        </p>

                        <textarea 
                            className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none h-32 bg-gray-50 focus:bg-white transition-all"
                            placeholder="Escribe tus comentarios aquí..."
                            value={changeComments}
                            onChange={(e) => setChangeComments(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={() => setShowRequestChangesModal(false)}
                                className="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-50 rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button 
                                onClick={submitChangesRequest}
                                disabled={!changeComments.trim()}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                Enviar Solicitud
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
