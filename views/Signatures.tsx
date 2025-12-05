import React, { useState } from 'react';
import { PlusIcon, XIcon, PenToolIcon, UploadCloudIcon, CheckIcon, FeatherIcon } from '../components/Icons';

interface Signature {
    id: string;
    name: string;
    type: 'DRAWN' | 'UPLOADED' | 'TEXT';
    url?: string; // For uploaded/drawn
    text?: string; // For text based
    font?: string;
    date: string;
    isDefault: boolean;
}

export const Signatures: React.FC = () => {
    const [signatures, setSignatures] = useState<Signature[]>([
        { id: '1', name: 'Firma Oficial', type: 'DRAWN', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Signature_sample.svg', date: '10/11/2024', isDefault: true },
        { id: '2', name: 'Iniciales', type: 'TEXT', text: 'J.L.', font: 'font-serif', date: '05/12/2024', isDefault: false }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'DRAW' | 'UPLOAD' | 'TEXT'>('DRAW');
    
    // Mock States for creation
    const [textSignature, setTextSignature] = useState('');
    const [selectedFont, setSelectedFont] = useState('font-serif');

    const handleSetDefault = (id: string) => {
        setSignatures(signatures.map(s => ({
            ...s,
            isDefault: s.id === id
        })));
    };

    const handleDelete = (id: string) => {
        if(confirm('¿Eliminar esta firma?')) {
            setSignatures(signatures.filter(s => s.id !== id));
        }
    };

    const handleSaveSignature = () => {
        const newSig: Signature = {
            id: Date.now().toString(),
            name: `Firma ${signatures.length + 1}`,
            type: activeTab === 'DRAW' ? 'DRAWN' : (activeTab === 'UPLOAD' ? 'UPLOADED' : 'TEXT'),
            date: new Date().toLocaleDateString(),
            isDefault: signatures.length === 0,
            text: activeTab === 'TEXT' ? textSignature : undefined,
            font: activeTab === 'TEXT' ? selectedFont : undefined,
            url: activeTab !== 'TEXT' ? 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Signature_sample.svg' : undefined // Mock
        };
        setSignatures([...signatures, newSig]);
        setIsModalOpen(false);
        setTextSignature('');
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in">
             <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Firmas</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestiona tus firmas digitales para agilizar los procesos.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg">
                    <PlusIcon className="w-4 h-4" />
                    Nueva Firma
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {signatures.map(sig => (
                     <div key={sig.id} className={`bg-white rounded-2xl p-6 border transition-all relative group ${sig.isDefault ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'border-gray-200 hover:shadow-lg'}`}>
                         {sig.isDefault && (
                             <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">
                                 Predeterminada
                             </div>
                         )}
                         
                         <div className="h-32 bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-gray-100 overflow-hidden">
                             {sig.type === 'TEXT' ? (
                                 <span className={`text-3xl text-gray-800 ${sig.font}`}>{sig.text}</span>
                             ) : (
                                 <img src={sig.url} alt="Firma" className="max-h-20 opacity-80" />
                             )}
                         </div>

                         <div className="flex justify-between items-end">
                             <div>
                                 <h3 className="font-bold text-gray-900">{sig.name}</h3>
                                 <p className="text-xs text-gray-500">Creada el {sig.date}</p>
                             </div>
                             
                             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 {!sig.isDefault && (
                                     <button 
                                        onClick={() => handleSetDefault(sig.id)}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100" title="Hacer predeterminada">
                                         <CheckIcon className="w-4 h-4" />
                                     </button>
                                 )}
                                 <button 
                                    onClick={() => handleDelete(sig.id)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100" title="Eliminar">
                                     <XIcon className="w-4 h-4" />
                                 </button>
                             </div>
                         </div>
                     </div>
                 ))}
                 
                 {/* Create Card */}
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all h-[240px]">
                     <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                         <PlusIcon className="w-6 h-6" />
                     </div>
                     <span className="font-bold text-sm">Agregar Nueva Firma</span>
                 </button>
             </div>

             {/* Modal */}
             {isModalOpen && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-scale-in">
                         <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                             <h2 className="text-xl font-bold text-gray-900">Crear Firma</h2>
                             <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                 <XIcon className="w-6 h-6" />
                             </button>
                         </div>

                         <div className="p-6">
                             {/* Tabs */}
                             <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                                 {(['DRAW', 'UPLOAD', 'TEXT'] as const).map(tab => (
                                     <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                     >
                                         {tab === 'DRAW' ? 'Dibujar' : (tab === 'UPLOAD' ? 'Subir Imagen' : 'Texto')}
                                     </button>
                                 ))}
                             </div>

                             {/* Content Area */}
                             <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl h-48 flex items-center justify-center relative mb-6">
                                 {activeTab === 'DRAW' && (
                                     <div className="text-center text-gray-400">
                                         <PenToolIcon className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                                         <p className="text-xs font-medium">Dibuja tu firma aquí (Simulado)</p>
                                     </div>
                                 )}
                                 {activeTab === 'UPLOAD' && (
                                     <div className="text-center text-gray-400">
                                         <UploadCloudIcon className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                                         <p className="text-xs font-medium">Arrastra una imagen o haz clic</p>
                                     </div>
                                 )}
                                 {activeTab === 'TEXT' && (
                                     <div className="w-full px-8">
                                         <input 
                                            type="text" 
                                            placeholder="Escribe tu nombre"
                                            className={`w-full text-center text-3xl border-b border-gray-200 outline-none pb-2 ${selectedFont}`}
                                            value={textSignature}
                                            onChange={(e) => setTextSignature(e.target.value)}
                                            autoFocus
                                         />
                                     </div>
                                 )}
                             </div>

                             {activeTab === 'TEXT' && (
                                 <div className="flex justify-center gap-4 mb-6">
                                     {['font-serif', 'font-mono', 'font-sans'].map(font => (
                                         <button 
                                            key={font}
                                            onClick={() => setSelectedFont(font)}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${selectedFont === font ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500'}`}
                                         >
                                             Aa
                                         </button>
                                     ))}
                                 </div>
                             )}

                             <div className="flex gap-3">
                                 <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
                                 <button onClick={handleSaveSignature} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-md">Guardar Firma</button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};