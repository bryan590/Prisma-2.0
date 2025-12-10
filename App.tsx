
import React, { useState } from 'react';
import { ViewState, ContractTemplate, SavedContract, Contact, UserProfile, UserRole, LegalProcess } from './types';
import { Dashboard } from './views/Dashboard';
import { CreateContract } from './views/CreateContract';
import { Contracts } from './views/Contracts';
import { Contacts } from './views/Contacts';
import { Settings } from './views/Settings';
import { Alerts } from './views/Alerts';
import { LegalProcesses } from './views/LegalProcesses';
import { Login } from './views/Login';
import { LegalChatbot } from './views/LegalChatbot';
import { ClientRequests } from './views/ClientRequests';
import { TemplateManagement } from './views/TemplateManagement';
import { AIValidationDetail } from './views/AIValidationDetail';
import { Signatures } from './views/Signatures';
import { 
    HomeIcon, PlusIcon, FileTextIcon, UsersIcon, SettingsIcon,
    SearchIcon, BellIcon, ActivityIcon, LockIcon, LogOutIcon, MessageCircleIcon,
    MenuIcon, LayoutIcon, FeatherIcon, XIcon, ArrowLeftIcon, CheckIcon
} from './components/Icons';

const App = () => {
  // Initial View is Login
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // User Role State
  const [userRole, setUserRole] = useState<UserRole>('CLIENT');
  
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [contractToReview, setContractToReview] = useState<SavedContract | undefined>(undefined);
  
  // Create Flow State needed for Header
  const [stepInfo, setStepInfo] = useState<{ step: number, total: number, labels: string[], title: string, subtitle: string } | null>(null);

  // Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
      { id: 1, title: 'Contrato Aprobado', text: 'El Contrato de Servicios #4501 ha sido aprobado por Legal.', time: 'Hace 5 min', isNew: true },
      { id: 2, title: 'Firma Pendiente', text: 'Tienes documentos pendientes de firma en tu bandeja.', time: 'Hace 2 horas', isNew: true },
      { id: 3, title: 'Nuevo Comentario', text: 'Juan Legal comentó en "Acuerdo NDA - Proveedor".', time: 'Hace 1 día', isNew: false }
  ]);
  
  // Toast Notification State
  const [toast, setToast] = useState<{title: string, message: string, visible: boolean} | null>(null);

  // Helper to show notification
  const showNotification = (title: string, message: string) => {
      // Add to list
      setNotifications(prev => [
          { id: Date.now(), title, text: message, time: 'Ahora', isNew: true },
          ...prev
      ]);
      // Show Toast
      setToast({ title, message, visible: true });
      // Hide after 4s
      setTimeout(() => setToast(prev => prev ? { ...prev, visible: false } : null), 4000);
  };

  // Global State for Contracts
  const [contracts, setContracts] = useState<SavedContract[]>([
    { id: '1', name: 'Contrato Desarrollo Web - Fase 1', type: 'Servicios Profesionales', date: '12/11/25', endDate: '2025-12-01', status: 'INTERNAL_REVIEW', signers: [] },
    { id: '2', name: 'NDA - Nuevo Empleado', type: 'RRHH', date: '10/11/25', endDate: '2026-01-01', status: 'SIGNATURE_PENDING', signers: [] },
    { id: '3', name: 'Alquiler Oficinas Centrales', type: 'Inmobiliario', date: '08/05/25', endDate: '2025-06-01', status: 'SIGNATURE_PENDING', signers: [] },
    { id: '4', name: 'Consultoría Marketing Q2', type: 'Comercial', date: '05/05/25', endDate: '2025-08-01', status: 'SIGNED', signers: [] },
    { id: 'DRAFT-4501', name: 'Convenio de Prácticas', type: 'IA', date: '04/12/2025', endDate: '', status: 'PENDING_LEGAL_VALIDATION', signers: [], data: {
        useAI: true, creationMethod: 'AI', contractorName: 'Cliente Interno', contractorId: '201010101', contractorAddress: '', contractorCity: '', contractorZip: '', contractorEmail: '', 
        clientName: 'Ana García', clientRep: false, startDate: '2025-01-01', endDate: '2025-12-31', serviceName: 'Prácticas Pre-Profesionales', price: '1025', currency: 'PEN', quantity: '1', description: 'Convenio de prácticas para estudiante de administración por 6 meses.', paymentType: 'monthly', totalAmount: '', hasPenalty: false, contractorType: 'company',
        contentBody: `
            <div style="font-family: 'Times New Roman', serif; color: #000;">
                <h2 style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 24px; font-size: 18px;">CONVENIO DE PRÁCTICAS PRE-PROFESIONALES</h2>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Conste por el presente documento, el Convenio de Prácticas que celebran, de una parte, <strong>LA EMPRESA</strong>, identificada con RUC N° 20123456789, con domicilio en [DIRECCIÓN], debidamente representada por su Gerente de RRHH; y, de la otra parte, <strong>ANA GARCÍA</strong>, identificada con DNI N° [DNI], con domicilio en [DOMICILIO], en adelante "EL PRACTICANTE".
                </p>
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">CLÁUSULA PRIMERA: OBJETO</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    El presente convenio tiene por objeto establecer los términos bajo los cuales EL PRACTICANTE realizará sus prácticas pre-profesionales en LA EMPRESA, complementando su formación académica.
                </p>
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">CLÁUSULA SEGUNDA: DURACIÓN</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    El convenio tendrá una duración de 6 meses, iniciando el 01/01/2025 y finalizando el 31/12/2025.
                </p>
            </div>
        `
    } },
  ]);

  // Global State for Templates (Lifted)
  const [templates, setTemplates] = useState<ContractTemplate[]>([
    { 
        id: '1', 
        name: 'Contrato de Servicios', 
        description: 'Para prestación de servicios profesionales independientes.', 
        color: 'bg-indigo-100', 
        icon: '📄', 
        category: 'Comercial', 
        content: `
            <div style="font-family: 'Times New Roman', serif; color: #000;">
                <h2 style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 24px; font-size: 18px;">CONTRATO DE LOCACIÓN DE SERVICIOS</h2>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Conste por el presente documento, el Contrato de Locación de Servicios (en adelante, el "<strong>CONTRATO</strong>") que celebran, de una parte:
                </p>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    <strong>[NOMBRE DE LA EMPRESA CLIENTE]</strong>, con RUC N° <strong>[00000000000]</strong>, con domicilio legal en <strong>[DIRECCIÓN COMPLETA]</strong>, debidamente representada por su Gerente General, el Sr./Sra. <strong>[NOMBRE REPRESENTANTE]</strong>, identificado con DNI N° <strong>[00000000]</strong>; a quien en adelante se le denominará "<strong>EL COMITENTE</strong>"; y, de la otra parte:
                </p>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    <strong>[NOMBRE DEL PROVEEDOR/LOCADOR]</strong>, con RUC/DNI N° <strong>[00000000000]</strong>, con domicilio en <strong>[DIRECCIÓN COMPLETA]</strong>; a quien en adelante se le denominará "<strong>EL LOCADOR</strong>".
                </p>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Ambas partes se reconocen mutuamente capacidad suficiente para contratar y convienen en celebrar el presente contrato bajo los siguientes términos y condiciones:
                </p>
                
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">CLÁUSULA PRIMERA: OBJETO</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Por el presente contrato, EL LOCADOR se obliga a prestar a favor de EL COMITENTE los servicios de <strong>[DESCRIPCIÓN DETALLADA DEL SERVICIO]</strong> (en adelante, los "<strong>SERVICIOS</strong>"), de manera independiente, sin subordinación y con autonomía técnica.
                </p>

                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">CLÁUSULA SEGUNDA: CONTRAPRESTACIÓN Y FORMA DE PAGO</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Como contraprestación por los SERVICIOS, EL COMITENTE pagará a EL LOCADOR la suma total de <strong>[MONTO EN LETRAS Y NÚMEROS]</strong> (más IGV de corresponder), contra la presentación del Recibo por Honorarios o Factura correspondiente y la conformidad del servicio.
                </p>

                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">CLÁUSULA TERCERA: PLAZO</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    El plazo de vigencia del presente contrato será de <strong>[CANTIDAD DE MESES/DÍAS]</strong>, iniciando el <strong>[FECHA INICIO]</strong> y culminando el <strong>[FECHA FIN]</strong>. Dicho plazo podrá ser renovado por acuerdo escrito entre las partes.
                </p>

                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">CLÁUSULA CUARTA: CONFIDENCIALIDAD</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    EL LOCADOR se compromete a mantener en estricta reserva y confidencialidad toda la información a la que tenga acceso con motivo de la prestación de los SERVICIOS, no pudiendo divulgarla a terceros sin autorización expresa de EL COMITENTE.
                </p>
                
                <br/><br/>
                <p style="text-align: center; margin-top: 40px;">
                    Firmado en la ciudad de Lima, a los [DÍA] días del mes de [MES] del año [AÑO].
                </p>
            </div>
        `
    },
    { 
        id: '2', 
        name: 'Acuerdo de Confidencialidad', 
        description: 'NDA estándar para protección de información sensible.', 
        color: 'bg-purple-100', 
        icon: '🔒', 
        category: 'Legal', 
        content: `
            <div style="font-family: 'Times New Roman', serif; color: #000;">
                <h2 style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 24px; font-size: 18px;">ACUERDO DE CONFIDENCIALIDAD (NDA)</h2>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Conste por el presente documento, el Acuerdo de Confidencialidad que celebran, de una parte <strong>[PARTE REVELADORA]</strong> y de la otra parte <strong>[PARTE RECEPTORA]</strong>.
                </p>
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">1. DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Se considera Información Confidencial a todo dato técnico, financiero, comercial o estratégico revelado por una parte a la otra, ya sea de forma verbal, escrita o electrónica.
                </p>
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">2. OBLIGACIONES</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    La Parte Receptora se obliga a no divulgar, copiar ni utilizar la Información Confidencial para fines distintos a los acordados en la relación comercial vigente.
                </p>
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">3. VIGENCIA</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Las obligaciones de confidencialidad permanecerán vigentes por un plazo de <strong>[AÑOS]</strong> años contados a partir de la firma del presente acuerdo.
                </p>
            </div>
        ` 
    },
    { 
        id: '3', 
        name: 'Contrato de Arrendamiento', 
        description: 'Alquiler de oficinas o locales comerciales.', 
        color: 'bg-blue-100', 
        icon: '🏠', 
        category: 'Inmobiliario', 
        content: `
            <div style="font-family: 'Times New Roman', serif; color: #000;">
                <h2 style="text-align: center; font-weight: bold; text-transform: uppercase; margin-bottom: 24px; font-size: 18px;">CONTRATO DE ARRENDAMIENTO DE INMUEBLE</h2>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    Conste por el presente documento, el Contrato de Arrendamiento que celebran el <strong>ARRENDADOR</strong> y el <strong>ARRENDATARIO</strong> respecto del inmueble ubicado en [DIRECCIÓN].
                </p>
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">PRIMERA: EL INMUEBLE</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    El ARRENDADOR es propietario del inmueble ubicado en [DIRECCIÓN COMPLETA], inscrito en la Partida Electrónica N° [NÚMERO] del Registro de Propiedad Inmueble.
                </p>
                <h3 style="font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 12px; font-size: 14px;">SEGUNDA: RENTA</h3>
                <p style="text-align: justify; margin-bottom: 16px; line-height: 1.6;">
                    La renta mensual pactada es de <strong>[MONTO Y MONEDA]</strong>, la cual será pagada por adelantado el primer día de cada mes.
                </p>
            </div>
        `
    },
    { id: '4', name: 'Contrato Laboral', description: 'Indefinido o plazo fijo', color: 'bg-emerald-100', icon: '💼', category: 'RRHH', content: '<h2>CONTRATO DE TRABAJO</h2><p>Contenido base laboral...</p>' },
    { id: '5', name: 'Addenda de Renovación', description: 'Extensión de plazo contractual vigente.', color: 'bg-amber-100', icon: '📄', category: 'Comercial', content: '<h2>ADDENDA AL CONTRATO</h2><p>Contenido base de addenda...</p>' },
    { id: '6', name: 'Licencia de Software', description: 'Términos de uso para SaaS o software on-premise.', color: 'bg-gray-100', icon: '📄', category: 'Tecnología', content: '<h2>LICENCIA DE USO DE SOFTWARE</h2><p>Contenido base de licencia...</p>' },
  ]);

  // Global State for Contacts
  const [contacts, setContacts] = useState<Contact[]>([
      { id: '1', name: 'Juan Ramirez', role: 'Gerente General', email: 'juan@cliente.com', type: 'Individual' },
      { id: '2', name: 'Tech Solutions SAC', role: 'Proveedor TI', email: 'contacto@techsolutions.pe', type: 'Empresa' },
      { id: '3', name: 'Maria Lopez', role: 'Asesora Legal', email: 'maria.legal@estudio.com', type: 'Individual' }
  ]);

  // Global State for Legal Processes
  const [legalProcesses, setLegalProcesses] = useState<LegalProcess[]>([
      { id: 'EXP-4455-2024', caseNumber: 'EXP-4455-2024', court: '15° Juzgado Civil Lima', status: 'Admisorio', relatedContractId: 'CON-2023-889', relatedContractName: 'CON-2023-889', risk: 'Medio', description: 'Incumplimiento', lastUpdate: '01/12/2024' },
      { id: 'EXP-9900-2023', caseNumber: 'EXP-9900-2023', court: 'Arbitraje CCL', status: 'Laudo Final', relatedContractId: 'CON-2022-102', relatedContractName: 'CON-2022-102', risk: 'Alto', description: 'Resolución de contrato', lastUpdate: '20/11/2024' }
  ]);

  // Global State for User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => ({
      companyName: 'Prisma CLM',
      companyEmail: 'admin@prismaclm.com',
      serviceName: 'Consultoría General',
      categoryName: 'Servicios Profesionales',
      userName: 'Juan Legal',
      userEmail: 'juan@prismaclm.com',
      language: 'Español',
      role: 'CLIENT'
  }));

  const handleLogin = (role: UserRole) => {
      setUserRole(role);
      setUserProfile(prev => ({ 
          ...prev, 
          role: role, 
          userName: role === 'LAWYER' ? 'Juan Legal' : 'Ana García' 
      }));
      // Clients default to requests, Lawyers to dashboard
      setCurrentView(role === 'CLIENT' ? 'client_requests' : 'dashboard');
  };

  const handleLogout = () => {
      setCurrentView('login');
      setIsSidebarCollapsed(false);
  };

  const handleUseTemplate = (template: ContractTemplate) => {
    if (template.id === 'ai-custom') {
        setSelectedTemplate(null); 
    } else {
        setSelectedTemplate(template);
    }
    setContractToReview(undefined);
    setCurrentView('create');
  };

  const handleCreateNewRequest = () => {
      setSelectedTemplate(null);
      setContractToReview(undefined);
      setCurrentView('create');
  }

  const handleReviewContract = (contract: SavedContract) => {
      setContractToReview(contract);
      // If it's AI validation for Lawyer, go to new detail view
      if (userRole === 'LAWYER' && contract.status === 'PENDING_LEGAL_VALIDATION') {
          setCurrentView('ai_validation_detail');
      } else {
          setCurrentView('create');
      }
  };

  const handleAddContract = (newContract: SavedContract) => {
    if (contractToReview || contracts.find(c => c.id === newContract.id)) {
        setContracts(contracts.map(c => c.id === newContract.id ? newContract : c));
    } else {
        setContracts([newContract, ...contracts]);
    }
    
    // Notification for new requests
    if (!contractToReview) {
        if (newContract.status === 'PENDING_LEGAL_VALIDATION') {
            showNotification('Solicitud Enviada', 'Tu solicitud ha sido enviada a revisión legal.');
        } else if (newContract.status === 'SIGNATURE_PENDING') {
            showNotification('Proceso Iniciado', 'El contrato ha sido enviado a los firmantes.');
        }
    }

    setCurrentView(userRole === 'CLIENT' ? 'client_requests' : 'dashboard');
    setContractToReview(undefined);
    setSelectedTemplate(null);
    setStepInfo(null); // Clear header step info
  };

  const handleDeleteContract = (id: string) => {
      if(confirm('¿Estás seguro de eliminar este contrato?')) {
          setContracts(contracts.filter(c => c.id !== id));
      }
  };

  const handleAddContact = (newContact: Contact) => {
      setContacts([...contacts, newContact]);
  };

  const handleDeleteContact = (id: string) => {
      if(confirm('¿Estás seguro de eliminar este contacto?')) {
          setContacts(contacts.filter(c => c.id !== id));
      }
  };

  const handleAddTemplate = (newTemplate: ContractTemplate) => {
      setTemplates([...templates, newTemplate]);
  };

  const handleSaveAsTemplate = (contract: SavedContract) => {
    // Logic to convert a contract to a template
    // If it's coming from the "AI Conversion Modal", contract might be just a wrapper with data
    let cleanContent = contract.data?.contentBody || '';
    const data = contract.data || {} as any;

    const newTemplate: ContractTemplate = {
        id: `TPL-PVT-${Date.now()}`,
        name: contract.name, // The modal sets this
        description: 'Plantilla generada automáticamente.',
        category: 'IA Templates',
        color: 'bg-purple-50',
        icon: '🧠',
        content: cleanContent,
        isPrivate: true
    };

    setTemplates([...templates, newTemplate]);
    
    // Add Notification with Toast
    showNotification('Plantilla Guardada', `La plantilla "${newTemplate.name}" se ha guardado exitosamente.`);
  };

  const handleViewAllNotifications = () => {
      setIsNotificationsOpen(false);
      setCurrentView('alerts');
  }

  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
        <button 
            onClick={() => {
                setCurrentView(view);
                setStepInfo(null); // Clear step info when navigating away
            }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 relative group transition-all duration-300
                ${isActive ? 'text-white font-bold' : 'text-slate-400 font-medium hover:text-white hover:bg-slate-800/50'}
                ${isSidebarCollapsed ? 'justify-center px-2' : ''}
            `}
            title={isSidebarCollapsed ? label : ''}
        >
            {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366F1] shadow-[0_0_12px_#6366F1]"></div>
            )}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/20 to-transparent pointer-events-none"></div>
            )}
            
            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 z-10 ${isActive ? 'text-[#818CF8]' : ''}`} />
            {!isSidebarCollapsed && <span className="tracking-tight z-10">{label}</span>}
        </button>
    );
  };

  if (currentView === 'login') {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toast && toast.visible && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 flex items-start gap-4 max-w-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                      <CheckIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{toast.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{toast.message}</p>
                  </div>
                  <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
                      <XIcon className="w-4 h-4" />
                  </button>
              </div>
          </div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-[#0F172A] text-white flex flex-col shrink-0 shadow-2xl transition-all duration-300 z-20 relative`}>
        <div className="h-24 flex items-center px-6 border-b border-slate-800/50">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#4338CA] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/50 shrink-0">
                    <span className="font-bold text-lg">P</span>
                </div>
                {!isSidebarCollapsed && (
                    <div className="animate-fade-in">
                        <h1 className="text-lg font-bold text-white tracking-tight leading-none">Prisma CLM</h1>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-1 py-6 space-y-8 overflow-y-auto scrollbar-hide">
            <div className="space-y-1">
                {!isSidebarCollapsed && <div className="px-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operaciones</div>}
                
                {/* --- CLIENT MENU (Reordered) --- */}
                {userRole === 'CLIENT' && (
                    <>
                        <SidebarItem view="client_requests" icon={FileTextIcon} label="Solicitudes" />
                        <SidebarItem view="dashboard" icon={LayoutIcon} label="Plantillas" />
                        <SidebarItem view="contracts" icon={LockIcon} label="Contratos" />
                        <SidebarItem view="chatbot" icon={MessageCircleIcon} label="Asistente IA" />
                        
                        <div className="my-4 border-t border-slate-800/50 pt-4">
                            {!isSidebarCollapsed && <div className="px-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración</div>}
                            <SidebarItem view="signatures" icon={FeatherIcon} label="Firmas" />
                            <SidebarItem view="settings" icon={SettingsIcon} label="Ajustes e Integraciones" />
                        </div>
                    </>
                )}
                
                {/* --- LAWYER MENU --- */}
                {userRole === 'LAWYER' && (
                    <>
                        <SidebarItem view="dashboard" icon={HomeIcon} label="Validación IA" />
                        <SidebarItem view="legal_processes" icon={LockIcon} label="Procesos Legales" />
                    </>
                )}
            </div>

            {userRole === 'LAWYER' && (
                <div className="space-y-1">
                    {!isSidebarCollapsed && <div className="px-6 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Configuración</div>}
                    
                    <SidebarItem view="template_management" icon={LayoutIcon} label="Gestión Plantillas" />
                    
                    <SidebarItem view="contracts" icon={FileTextIcon} label="Repositorio Global" />
                </div>
            )}
        </div>
        
        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0F172A]">
             <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                 <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shrink-0 border-2 border-[#1E293B]">
                     {userProfile.userName.charAt(0)}L
                 </div>
                 {!isSidebarCollapsed && (
                     <div className="flex-1 min-w-0">
                         <div className="text-sm font-bold text-white truncate">{userProfile.userName}</div>
                         <div className="text-xs text-slate-400 truncate">Head of Legal</div>
                     </div>
                 )}
                 {!isSidebarCollapsed && (
                     <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors">
                         <LogOutIcon className="w-5 h-5"/>
                     </button>
                 )}
             </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <div className="h-16 flex items-center justify-between px-6 shrink-0 bg-white border-b border-gray-200 z-10 sticky top-0">
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors mr-2">
                    <MenuIcon className="w-6 h-6"/>
                </button>

                {/* --- HEADER CONTENT DYNAMICALLY RENDERED HERE --- */}
                {currentView === 'create' && stepInfo && (
                    <div className="flex items-center w-full animate-fade-in">
                        <div className="flex items-center gap-3 mr-8 border-r border-gray-200 pr-8">
                            <button 
                                onClick={() => {
                                    setStepInfo(null);
                                    // Redirect to Requests page always as requested
                                    setCurrentView('client_requests');
                                }} 
                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-500">
                                <ArrowLeftIcon className="w-4 h-4" />
                            </button>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stepInfo.subtitle}</h4>
                                <h2 className="text-lg font-extrabold text-gray-900 leading-none">{stepInfo.title}</h2>
                            </div>
                        </div>
                        {/* Global Steps */}
                        <div className="flex-1 max-w-2xl hidden lg:flex items-center justify-between">
                            {stepInfo.labels.map((label, idx) => {
                                const s = idx + 1;
                                const isCompleted = stepInfo.step > s;
                                const isCurrent = stepInfo.step === s;
                                return (
                                    <div key={s} className="flex flex-col items-center relative w-full">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border mb-1 relative z-10
                                            ${isCurrent ? 'border-indigo-600 bg-white text-indigo-600 scale-110 shadow-sm' : 
                                            (isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-300')}`}>
                                            {isCompleted ? <CheckIcon className="w-3 h-3" /> : s}
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
                                        {/* Connector Line */}
                                        {idx < stepInfo.total - 1 && (
                                            <div className="absolute top-3 left-[50%] w-full h-[2px] bg-gray-100 -z-0">
                                                <div className={`h-full bg-indigo-600 transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'}`}></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 relative">
                {/* Notification Bell */}
                <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative group p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                    <BellIcon className="w-5 h-5 text-gray-500" />
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                    <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-scale-in origin-top-right overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">Notificaciones</h3>
                            <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <XIcon className="w-4 h-4"/>
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${n.isNew ? 'bg-blue-50/50' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm ${n.isNew ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h4>
                                        <span className="text-[10px] text-gray-400">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-snug">{n.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 text-center border-t border-gray-100">
                            <button onClick={handleViewAllNotifications} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Ver todas</button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            {currentView === 'dashboard' && <Dashboard role={userRole} onUseTemplate={handleUseTemplate} contracts={contracts} templates={templates} onNavigate={setCurrentView} onReviewContract={handleReviewContract}/>}
            {currentView === 'create' && <CreateContract role={userRole} existingContract={contractToReview} initialTemplate={selectedTemplate} templates={templates} onBack={() => {
                setStepInfo(null);
                setCurrentView('client_requests');
            }} onFinish={handleAddContract} onSaveTemplate={handleSaveAsTemplate} setStepInfo={setStepInfo} />}
            {currentView === 'ai_validation_detail' && contractToReview && <AIValidationDetail contract={contractToReview} onBack={() => setCurrentView('dashboard')} onApprove={(c) => handleAddContract({...c, status: 'INTERNAL_REVIEW'})} onReject={(id) => { handleDeleteContract(id); setCurrentView('dashboard'); }} />}
            {currentView === 'contracts' && <Contracts contracts={contracts} onDelete={handleDeleteContract} />}
            {currentView === 'client_requests' && <ClientRequests contracts={contracts} onViewContract={handleReviewContract} onCreateNew={handleCreateNewRequest} onSaveAsTemplate={handleSaveAsTemplate} />}
            {currentView === 'chatbot' && <LegalChatbot />}
            {currentView === 'contacts' && <Contacts contacts={contacts} onAdd={handleAddContact} onDelete={handleDeleteContact} />}
            {currentView === 'settings' && <Settings profile={userProfile} onUpdate={setUserProfile} />}
            {currentView === 'template_management' && <TemplateManagement templates={templates} onAddTemplate={handleAddTemplate} />}
            {currentView === 'alerts' && <Alerts contracts={contracts} onViewAll={() => setCurrentView('contracts')} />}
            {currentView === 'legal_processes' && <LegalProcesses processes={legalProcesses} />}
            {currentView === 'signatures' && <Signatures />}
        </div>
      </div>
    </div>
  );
};

export default App;
