
import { GoogleGenAI } from "@google/genai";
import { ContractData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContractClauses = async (data: ContractData): Promise<string[]> => {
  // Kept for backward compatibility
  return [
    `El CONTRATISTA se compromete a entregar los servicios de ${data.serviceName} profesionalmente.`,
    `La contraprestación será de ${data.currency} ${data.price}.`,
    `Ambas partes acuerdan someterse a la jurisdicción local.`
  ];
};

export const chatContractAssistant = async (history: {role: 'user' | 'model', text: string}[], lastMessage: string): Promise<string> => {
    try {
        const conversationContext = history.map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.text}`).join('\n');
        
        const prompt = `
        ACTÚA COMO: Un Asistente Legal experto en redacción de contratos (Prisma AI).
        OBJETIVO: Recopilar la información necesaria para redactar un contrato en MÁXIMO 3 turnos de conversación.
        
        ESTADO ACTUAL DE LA CONVERSACIÓN:
        ${conversationContext}
        
        INPUT DEL USUARIO: "${lastMessage}"
        
        INSTRUCCIONES:
        1. Analiza si ya tienes la siguiente información clave:
           - TIPO DE CONTRATO (Ej. Servicios, Alquiler, NDA).
           - PARTES (Quién contrata a quién).
           - CONDICIONES (Monto, Plazo, Penalidades).
        
        2. Si falta algo, PREGUNTA ESPECÍFICAMENTE por ello. No preguntes todo de golpe.
           - Paso 1: Preguntar propósito/tipo.
           - Paso 2: Preguntar partes involucradas.
           - Paso 3: Preguntar condiciones comerciales.
        
        3. Si el usuario ya dio toda la información (o en el mensaje actual), responde con:
           "¡Perfecto! Tengo todos los datos necesarios. Pulsa 'Generar Borrador' cuando estés listo."
           y haz un brevísimo resumen de lo entendido.
        
        TONO: Profesional, conciso y servicial.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Entendido. ¿Podrías darme más detalles?";
    } catch (error) {
        console.error("Chat Error", error);
        return "Lo siento, tuve un problema de conexión. ¿Podrías repetir eso?";
    }
};

export const generateFullContractBody = async (data: ContractData): Promise<string> => {
    try {
        const prompt = `
        ROL:
        Actúa como un Abogado Corporativo Senior ("Senior Legal Counsel") con más de 15 años de experiencia en derecho mercantil, contratos internacionales y cumplimiento normativo. Tu tono es formal, preciso y preventivo ante riesgos legales. Tu prioridad es la protección de los intereses de la empresa y la claridad en las obligaciones.

        CONTEXTO:
        Estás operando dentro del Sistema de Gestión Legal (CLM) de la empresa. El usuario actual es un cliente interno (gerente de área o comercial) que necesita formalizar una relación de negocios.
        
        Reglas de Negocio:
        - Todas las cláusulas deben cumplir con la legislación vigente en Perú.
        - Si la solicitud es ambigua, asume estándares de mercado protectores para el Contratante.
        - No inventes datos personales (DNI, Nombres) si no se proporcionan; usa placeholders como [INSERTAR DATOS].
        - Prioriza la redacción clara sobre la jerga legal innecesaria ("Plain Language"), pero mantén la robustez legal.

        TAREA:
        Redacta un contrato de servicios profesionales COMPLETO en formato HTML (solo el contenido dentro del body, usa etiquetas h2, p, ul, li, strong).

        DATOS DE ENTRADA:
        - Parte A (Nosotros/Contratante): ${data.contractorName} (ID: ${data.contractorId})
        - Parte B (Cliente/Proveedor): ${data.clientName}
        - Servicio Principal: ${data.serviceName}
        - Descripción del Alcance/Prompt Usuario (HISTORIAL DE CHAT): ${data.description}
        - Duración: Del ${data.startDate} al ${data.endDate}
        - Honorarios: ${data.currency} ${data.price} (${data.paymentType})
        - Penalidad: ${data.hasPenalty ? 'Sí, incluir cláusula de penalidad por mora (1% diario hasta tope 10%).' : 'No.'}

        Estructura requerida en HTML:
        1. Título Centrado
        2. Introducción de Comparecientes (Parte A y Parte B)
        3. Cláusula Primera: Objeto del Contrato (Sé detallado basado en la descripción)
        4. Cláusula Segunda: Obligaciones de las Partes
        5. Cláusula Tercera: Honorarios y Forma de Pago
        6. Cláusula Cuarta: Confidencialidad y Protección de Datos
        7. Cláusula Quinta: Resolución de Disputas (Arbitraje o Poder Judicial)
        8. Espacio para Firmas (Placeholder HTML)

        Genera solo el código HTML del cuerpo.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let text = response.text || '';
        // Clean markdown code blocks if present
        text = text.replace(/```html/g, '').replace(/```/g, '');
        return text;

    } catch (error) {
        console.error("AI Generation Error", error);
        return `
            <h2>CONTRATO DE PRESTACIÓN DE SERVICIOS</h2>
            <p>Conste por el presente documento, el contrato de servicios que celebran de una parte <strong>${data.contractorName}</strong>...</p>
            <h3>1. OBJETO</h3>
            <p>El contratista se obliga a prestar el servicio de ${data.serviceName}.</p>
            <h3>2. HONORARIOS</h3>
            <p>El monto acordado es de ${data.currency} ${data.price}.</p>
            <p><em>(Error al generar contenido completo con IA. Mostrando plantilla base.)</em></p>
        `;
    }
}
