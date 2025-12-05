
import React from 'react';
import { SavedContract } from '../types';
import { ActivityIcon, ClockIcon, AlertCircleIcon, TrendingUpIcon, FileTextIcon, ChevronRightIcon } from '../components/Icons';

interface AlertsProps {
    contracts: SavedContract[];
    onViewAll: () => void;
}

export const Alerts: React.FC<AlertsProps> = ({ contracts, onViewAll }) => {
    
    // Calculated KPIs
    const pendingSignatures = contracts.filter(c => c.status === 'SIGNATURE_PENDING').length;
    const completed = contracts.filter(c => c.status === 'SIGNED' || c.status === 'COMPLETED').length;
    const expiringSoon = contracts.filter(c => c.status === 'SIGNED').length; 
    const activityRate = contracts.length > 0 ? '85%' : '0%';

    const KPICard = ({ title, value, subtitle, icon: Icon, colorClass, bgClass }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between group hover:shadow-md transition-all duration-300">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{value}</h3>
                <p className={`text-xs font-medium flex items-center gap-1 ${colorClass}`}>
                    {subtitle}
                </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} transition-transform group-hover:scale-110`}>
                <Icon className={`w-6 h-6 ${colorClass.split(' ')[0]}`} />
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-5 mb-10">
                 <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm">
                    <ActivityIcon className="w-7 h-7" />
                 </div>
                 <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Centro de Alertas</h1>
                    <p className="text-gray-500 text-sm mt-1 font-medium">Monitoreo en tiempo real de vencimientos, firmas y actividad.</p>
                 </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <KPICard 
                    title="Pendientes de Firma" 
                    value={pendingSignatures} 
                    subtitle="Requieren acción"
                    icon={ClockIcon}
                    colorClass="text-indigo-600"
                    bgClass="bg-indigo-50"
                />
                <KPICard 
                    title="Por Vencer (30 días)" 
                    value={expiringSoon} 
                    subtitle="Atención prioritaria"
                    icon={AlertCircleIcon}
                    colorClass="text-amber-500"
                    bgClass="bg-amber-50"
                />
                <KPICard 
                    title="Contratos Activos" 
                    value={completed} 
                    subtitle="+12% vs mes anterior"
                    icon={FileTextIcon}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                />
                <KPICard 
                    title="Tasa de Actividad" 
                    value={activityRate} 
                    subtitle="Alta actividad"
                    icon={TrendingUpIcon}
                    colorClass="text-blue-500"
                    bgClass="bg-blue-50"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: Alerts List */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Vencimientos Próximos</h3>
                        <button 
                            onClick={onViewAll}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Ver reporte completo
                        </button>
                    </div>

                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                        {contracts.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {contracts.map((c, i) => (
                                    <div 
                                        key={i} 
                                        onClick={onViewAll}
                                        className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Vertical Color Bar */}
                                            <div className={`w-1.5 h-12 rounded-full ${i % 2 === 0 ? 'bg-amber-400' : 'bg-red-400'}`}></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">{c.name}</h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{c.type}</span>
                                                    <span>•</span>
                                                    <span>Vence: {c.endDate || '2025-12-01'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="text-right mr-4">
                                                <p className="text-xs font-bold text-gray-900">Quedan {Math.floor(Math.random() * 20) + 1} días</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">PARA RENOVAR</p>
                                            </div>
                                            <button 
                                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all">
                                                <ChevronRightIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <AlertCircleIcon className="w-8 h-8"/>
                                </div>
                                <h3 className="text-gray-900 font-bold mb-1">Todo en orden</h3>
                                <p className="text-gray-500 text-sm">No tienes contratos próximos a vencer.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Activity Feed */}
                <div className="xl:col-span-1 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Actividad Reciente</h3>
                    
                    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 relative">
                        <div className="absolute left-9 top-8 bottom-8 w-0.5 bg-gray-100"></div>
                        
                        <div className="space-y-8 relative">
                            {contracts.slice(0, 5).map((c, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 z-10 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 leading-snug">
                                            <span className="font-bold">{c.name}</span>
                                            <span className="text-gray-500 font-medium"> cambió de estado a </span>
                                            <span className="inline-block px-2 py-0.5 bg-gray-50 rounded text-xs font-bold text-gray-700 mt-1">{c.status}</span>
                                        </p>
                                        <span className="text-xs text-gray-400 font-medium mt-1.5 block">Hace {i * 2 + 1} horas</span>
                                    </div>
                                </div>
                            ))}
                            {contracts.length === 0 && (
                                <p className="text-gray-400 text-sm text-center py-4">Sin actividad reciente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
