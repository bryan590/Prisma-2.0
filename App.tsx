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
    MenuIcon, LayoutIcon, FeatherIcon
} from './components/Icons';

const App = () => {
  // Initial View is Login
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // User Role State
  const [userRole, setUserRole] = useState<UserRole>('CLIENT');
  
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [contractToReview, setContractToReview] = useState<SavedContract | undefined>(undefined);

  // Global State for Contracts
  const [contracts, setContracts] = useState<SavedContract[]>([
    { id: '1', name: 'Contrato Desarrollo Web - Fase 1', type: 'Servicios Profesionales', date: '12/11/25', endDate: '2025-12-01', status: 'INTERNAL_REVIEW', signers: [] },
    { id: '2', name: 'NDA - Nuevo Empleado', type: 'RRHH', date: '10/11/25', endDate: '2026-01-01', status: 'SIGNATURE_PENDING', signers: [] },
    { id: '3', name: 'Alquiler Oficinas Centrales', type: 'Inmobiliario', date: '08/05/25', endDate: '2025-06-01', status: 'SIGNATURE_PENDING', signers: [] },
    { id: '4', name: 'Consultoría Marketing Q2', type: 'Comercial', date: '05/05/25', endDate: '2025-08-01', status: 'SIGNED', signers: [] },
    { id: 'DRAFT-4501', name: 'Convenio de Prácticas', type: 'IA', date: '04/12/2025', endDate: '', status: 'PENDING_LEGAL_VALIDATION', signers: [], data: {
        useAI: true, creationMethod: 'AI', contractorName: 'Cliente Interno', contractorId: '201010101', contractorAddress: '', contractorCity: '', contractorZip: '', contractorEmail: '', 
        clientName: 'Ana García', clientRep: false, startDate: '2025-01-01', endDate: '2025-12-31', serviceName: 'Prácticas Pre-Profesionales', price: '1025', currency: 'PEN', quantity: '1', description: 'Convenio de prácticas para estudiante de administración por 6 meses.', paymentType: 'monthly', totalAmount: '', hasPenalty: false, contractorType: 'company',
        contentBody: `<h2>CONVENIO DE PRÁCTICAS</h2><p>El presente documento regula las prácticas...</p><h3>CLÁUSULA PRIMERA: OBJETO</h3><p>El presente contrato tiene por objeto...</p>`
    } },
  ]);

  // Global State for Templates (Lifted)
  const [templates, setTemplates] = useState<ContractTemplate[]>([
    { id: '1', name: 'Contrato de Servicios', description: 'Para prestación de servicios profesionales independientes.', color: 'bg-indigo-100', icon: '📄', category: 'Comercial' },
    { id: '2', name: 'Acuerdo de Confidencialidad', description: 'NDA estándar para protección de información sensible.', color: 'bg-purple-100', icon: '🔒', category: 'Legal' },
    { id: '3', name: 'Contrato de Arrendamiento', description: 'Alquiler de oficinas o locales comerciales.', color: 'bg-blue-100', icon: '🏠', category: 'Inmobiliario' },
    { id: '4', name: 'Contrato Laboral', description: 'Indefinido o plazo fijo', color: 'bg-emerald-100', icon: '💼', category: 'RRHH' },
    { id: '5', name: 'Addenda de Renovación', description: 'Extensión de plazo contractual vigente.', color: 'bg-amber-100', icon: '📄', category: 'Comercial' },
    { id: '6', name: 'Licencia de Software', description: 'Términos de uso para SaaS o software on-premise.', color: 'bg-gray-100', icon: '📄', category: 'Tecnología' },
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
    setCurrentView(userRole === 'CLIENT' ? 'client_requests' : 'dashboard');
    setContractToReview(undefined);
    setSelectedTemplate(null);
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

  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
        <button 
            onClick={() => setCurrentView(view)}
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
            <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                <MenuIcon className="w-6 h-6"/>
            </button>
            <div className="flex-1 px-8">
                 {/* Breadcrumbs or Title could go here */}
            </div>
            <div className="flex items-center gap-4">
                <button className="relative group p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                    <BellIcon className="w-5 h-5 text-gray-500" />
                </button>
            </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            {currentView === 'dashboard' && <Dashboard role={userRole} onUseTemplate={handleUseTemplate} contracts={contracts} templates={templates} onNavigate={setCurrentView} onReviewContract={handleReviewContract}/>}
            {currentView === 'create' && <CreateContract role={userRole} existingContract={contractToReview} initialTemplate={selectedTemplate} templates={templates} onBack={() => setCurrentView('dashboard')} onFinish={handleAddContract} />}
            {currentView === 'ai_validation_detail' && contractToReview && <AIValidationDetail contract={contractToReview} onBack={() => setCurrentView('dashboard')} onApprove={(c) => handleAddContract({...c, status: 'INTERNAL_REVIEW'})} onReject={(id) => { handleDeleteContract(id); setCurrentView('dashboard'); }} />}
            {currentView === 'contracts' && <Contracts contracts={contracts} onDelete={handleDeleteContract} />}
            {currentView === 'client_requests' && <ClientRequests contracts={contracts} onViewContract={handleReviewContract} onCreateNew={handleCreateNewRequest} />}
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