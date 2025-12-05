
import React from 'react';
import { UserRole } from '../types';
import { SparklesIcon } from '../components/Icons';

interface LoginProps {
    onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    ContractAI Manager
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Selecciona tu perfil para ingresar
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-3xl sm:px-10 border border-gray-100">
                    <div className="space-y-4">
                        <button
                            onClick={() => onLogin('CLIENT')}
                            className="w-full flex items-center p-4 border-2 border-transparent hover:border-indigo-500 bg-gray-50 hover:bg-white rounded-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600 border border-gray-100 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="ml-4 text-left">
                                <p className="text-lg font-bold text-gray-900">Cliente</p>
                                <p className="text-xs text-gray-500">Gerente Comercial / RRHH</p>
                            </div>
                            <div className="absolute right-4 text-gray-300 group-hover:text-indigo-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>

                        <button
                            onClick={() => onLogin('LAWYER')}
                            className="w-full flex items-center p-4 border-2 border-transparent hover:border-purple-500 bg-gray-50 hover:bg-white rounded-2xl transition-all group relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600 border border-gray-100 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <div className="ml-4 text-left">
                                <p className="text-lg font-bold text-gray-900">Abogado</p>
                                <p className="text-xs text-gray-500">Legal Counsel / Socio</p>
                            </div>
                            <div className="absolute right-4 text-gray-300 group-hover:text-purple-500">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Powered by Gemini AI</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
