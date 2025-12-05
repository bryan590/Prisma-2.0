
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon, ArrowLeftIcon, MessageCircleIcon } from '../components/Icons';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
}

export const LegalChatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'model',
            text: 'Hola. Soy el Asistente Legal Virtual de Prisma. Puedo ayudarte a entender cláusulas complejas, recomendar plantillas o resolver dudas sobre políticas internas. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || inputValue;
        if (!textToSend.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const prompt = `
            Actúa como un Asistente Legal Corporativo experto. Responde preguntas breves sobre derecho contractual, explica términos legales complejos en lenguaje sencillo y sugiere acciones.
            Usuario: ${textToSend}
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text || 'Lo siento, no pude procesar esa consulta.';

            const newModelMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: text,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newModelMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: 'Hubo un error al conectar con el servicio de IA. Por favor intenta de nuevo.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        "¿Qué plantilla uso para un freelancer?",
        "Explícame la cláusula de indemnidad",
        "Política de firmas"
    ];

    return (
        <div className="p-4 md:p-8 h-screen max-w-[1200px] mx-auto flex flex-col">
            <div className="mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <MessageCircleIcon className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Asistente Legal IA</h1>
                    <p className="text-sm text-gray-500">Disponible 24/7 • Respuestas basadas en legislación local</p>
                </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col relative">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                                    <SparklesIcon className="w-4 h-4" />
                                </div>
                            )}
                            
                            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-[#1E293B] text-white rounded-br-none' 
                                : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                            }`}>
                                {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0 mt-1">
                                    <span className="text-xs font-bold">YO</span>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {/* Suggestions (only show if few messages) */}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 mt-4 ml-11">
                            {suggestions.map((s, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSendMessage(s)}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-start items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white shrink-0 shadow-md">
                                <SparklesIcon className="w-4 h-4" />
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-2 bg-white border border-indigo-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all shadow-sm">
                        <input 
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 py-2"
                            placeholder="Escribe tu consulta legal aquí..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button 
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim() || isLoading}
                            className="p-2 bg-[#8B5CF6] text-white rounded-xl hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-2">
                        El asistente puede cometer errores. Verifica la información importante con el departamento legal.
                    </p>
                </div>
            </div>
        </div>
    );
};
