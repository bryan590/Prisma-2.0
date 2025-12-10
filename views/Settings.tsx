
import React, { useState } from 'react';
import { ArrowLeftIcon, ChevronRightIcon, LinkIcon, CheckIcon, PenToolIcon, BellIcon, MessageCircleIcon } from '../components/Icons';
import { UserProfile } from '../types';

interface SettingsProps {
    profile: UserProfile;
    onUpdate: (profile: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ profile, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'Compañia' | 'Servicios' | 'Perfil' | 'Integraciones' | 'Notificaciones'>('Compañia');
    const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
    const [showSaved, setShowSaved] = useState(false);
    const [defaultSignatureProvider, setDefaultSignatureProvider] = useState('PRISMA');
    
    // Notification States
    const [notifEmail, setNotifEmail] = useState(true);
    const [notifSlack, setNotifSlack] = useState(false);
    const [notifWhatsApp, setNotifWhatsApp] = useState(false);

    const handleSave = () => {
        onUpdate(localProfile);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
    };

    const updateField = (field: keyof UserProfile, value: string) => {
        setLocalProfile(prev => ({ ...prev, [field]: value }));
    };

    const renderContent = () => {
        if (activeTab === 'Compañia') {
            return (
                <div className="space-y-8 animate-fade-in max-w-2xl">
                    <div className="space-y-2">
                        <label className="font-bold text-base text-gray-900">Nombre</label>
                        <input 
                            type="text" 
                            value={localProfile.companyName}
                            onChange={(e) => updateField('companyName', e.target.value)}
                            placeholder="Nombre de la compañia" 
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/50" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-base text-gray-900">Correo</label>
                        <input 
                            type="email" 
                            value={localProfile.companyEmail}
                            onChange={(e) => updateField('companyEmail', e.target.value)}
                            placeholder="empresa@example.com" 
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/50" 
                        />
                    </div>
                </div>
            );
        } else if (activeTab === 'Servicios') {
             return (
                <div className="space-y-8 animate-fade-in max-w-2xl">
                    <div className="space-y-2">
                        <label className="font-bold text-base text-gray-900">Servicios</label>
                        <input 
                            type="text" 
                            value={localProfile.serviceName}
                            onChange={(e) => updateField('serviceName', e.target.value)}
                            placeholder="Nombre del servicio" 
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/50" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="font-bold text-base text-gray-900">Sub-categorías</label>
                        <input 
                            type="text" 
                            value={localProfile.categoryName}
                            onChange={(e) => updateField('categoryName', e.target.value)}
                            placeholder="Nombre de la categoría" 
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500/50" 
                        />
                    </div>
                </div>
            );
        } else if (activeTab === 'Integraciones') {
            return (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* Default Provider Configuration */}
                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <PenToolIcon className="w-5 h-5 text-indigo-600"/>
                            Gestor de Firmas Predeterminado
                        </h4>
                        <p className="text-sm text-gray-600 mb-4 max-w-2xl">
                            Selecciona el sistema que deseas utilizar por defecto al iniciar un proceso de firma desde Prisma CLM.
                        </p>
                        <div className="max-w-md bg-white rounded-xl border border-indigo-200 overflow-hidden shadow-sm">
                            <select 
                                value={defaultSignatureProvider}
                                onChange={(e) => setDefaultSignatureProvider(e.target.value)}
                                className="w-full px-4 py-3 bg-white outline-none text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <option value="PRISMA">Prisma Sign (Nativo)</option>
                                <option value="ADOBE">Adobe Acrobat Sign</option>
                                <option value="DOCUSIGN">Docusign</option>
                                <option value="SIGNWELL">Signwell</option>
                                <option value="SIGNNOW">SignNow</option>
                            </select>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full my-6"></div>
                    
                    <p className="text-gray-500 text-sm mb-6">Conecta Prisma CLM con tus plataformas de firma digital.</p>
                    
                    {/* Adobe Acrobat */}
                    <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-red-200 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-100 group-hover:bg-red-100 transition-colors">
                                <span className="font-bold text-red-600 text-xs">PDF</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Adobe Acrobat Reader</h4>
                                <p className="text-xs text-gray-500">Integración para visualización y firma de PDFs.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                            Conectar
                        </button>
                    </div>

                    {/* Docusign */}
                    <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-200 transition-colors group">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                                <span className="font-bold text-blue-600 text-lg">D</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Docusign</h4>
                                <p className="text-xs text-gray-500">Líder mundial en firmas electrónicas y gestión.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                            Conectar
                        </button>
                    </div>

                    {/* Signwell */}
                    <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-emerald-200 transition-colors group">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                                <span className="font-bold text-emerald-600 text-lg">S</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Signwell</h4>
                                <p className="text-xs text-gray-500">Firmas electrónicas simples y conformes.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                            Conectar
                        </button>
                    </div>

                    {/* SignNow */}
                     <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-orange-200 transition-colors group">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100 group-hover:bg-orange-100 transition-colors">
                                <span className="font-bold text-orange-600 text-lg">SN</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">SignNow</h4>
                                <p className="text-xs text-gray-500">Flujos de trabajo de firma flexibles.</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                            Conectar
                        </button>
                    </div>

                </div>
            );
        } else if (activeTab === 'Notificaciones') {
            return (
                <div className="space-y-8 animate-fade-in max-w-3xl">
                    <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                            <BellIcon className="w-5 h-5"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Preferencias de Alertas</h4>
                            <p className="text-sm text-gray-600">
                                Configura por qué medios deseas recibir notificaciones sobre el estado de tus contratos, firmas pendientes y vencimientos.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Email */}
                        <div className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
                                    <span className="font-bold text-lg">@</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Correo Electrónico</h4>
                                    <p className="text-xs text-gray-500">Recibir resúmenes y alertas críticas.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {/* Slack */}
                        <div className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500">
                                    <span className="font-bold text-lg">#</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Slack</h4>
                                    <p className="text-xs text-gray-500">Mensajes directos para actualizaciones rápidas.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={notifSlack} onChange={() => setNotifSlack(!notifSlack)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 border border-green-100">
                                    <MessageCircleIcon className="w-6 h-6"/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">WhatsApp</h4>
                                    <p className="text-xs text-gray-500">Notificaciones urgentes a tu móvil.</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={notifWhatsApp} onChange={() => setNotifWhatsApp(!notifWhatsApp)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-base text-gray-900">Nombre y Apellido</span>
                        <div className="flex items-center gap-12">
                            <input 
                                className="text-sm text-gray-700 bg-transparent border-b border-gray-200 focus:border-purple-500 outline-none"
                                value={localProfile.userName}
                                onChange={(e) => updateField('userName', e.target.value)}
                            />
                            <button className="text-sm text-[#C084FC] hover:text-purple-600 font-medium">Cambiar nombre</button>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-base text-gray-900">Idioma de sistema</span>
                        <div className="flex items-center gap-12">
                            <span className="text-sm text-gray-700 min-w-[100px] text-right">{localProfile.language}</span>
                            <div className="w-[105px]"></div>
                        </div>
                    </div>

                     <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-base text-gray-900">Correo electrónico</span>
                        <div className="flex items-center gap-12">
                            <input 
                                className="text-sm text-gray-700 bg-transparent border-b border-gray-200 focus:border-purple-500 outline-none"
                                value={localProfile.userEmail}
                                onChange={(e) => updateField('userEmail', e.target.value)}
                            />
                            <button className="text-sm text-[#C084FC] hover:text-purple-600 font-medium">Cambiar correo</button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="font-bold text-base text-gray-900">Contraseña</span>
                        <div className="flex items-center gap-12">
                            <span className="text-sm text-gray-700">********</span>
                            <button className="text-sm text-[#C084FC] hover:text-purple-600 font-medium">Cambiar contraseña</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
             <div className="flex items-center gap-4 mb-8">
                {/* <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </button> */}
                <h1 className="text-3xl font-bold text-gray-900">Ajustes</h1>
             </div>

             <div className="flex gap-8 mb-8 border-b-2 border-gray-100 overflow-x-auto">
                 {['Compañia', 'Servicios', 'Perfil', 'Integraciones', 'Notificaciones'].map((tab) => (
                     <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-4 text-sm font-bold border-b-[3px] transition-all px-2 whitespace-nowrap ${activeTab === tab ? 'border-[#7E57C2] text-[#7E57C2]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab}
                     </button>
                 ))}
             </div>

             <div className="bg-white rounded-[32px] p-12 min-h-[600px] shadow-sm relative border border-gray-50">
                  {renderContent()}

                  <div className="absolute bottom-12 right-12 flex items-center gap-4">
                      {showSaved && <span className="text-green-600 text-sm font-bold animate-fade-in">Guardado con éxito</span>}
                      <button 
                        onClick={handleSave}
                        className="bg-[#C084FC] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#A855F7] transition-all shadow-md hover:shadow-lg">
                          Guardar cambios
                          <ChevronRightIcon className="w-5 h-5" />
                      </button>
                  </div>
             </div>
        </div>
    );
};
