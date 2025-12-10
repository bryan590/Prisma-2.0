
export type ViewState = 'login' | 'dashboard' | 'create' | 'contracts' | 'contacts' | 'settings' | 'alerts' | 'legal_processes' | 'chatbot' | 'client_requests' | 'template_management' | 'ai_validation_detail' | 'signatures';

export type UserRole = 'CLIENT' | 'LAWYER';

export type ContractState = 
  | 'DRAFT' 
  | 'PENDING_LEGAL_VALIDATION' // New state for AI requests waiting for lawyer
  | 'INTERNAL_REVIEW' 
  | 'EXTERNAL_VALIDATION' 
  | 'SIGNATURE_PENDING' 
  | 'SIGNED' 
  | 'COMPLETED'
  | 'REJECTED';

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  category: string;
  content?: string; // Added for template body structure
  isPrivate?: boolean; // New: User specific private template
}

export interface Signer {
    id: string;
    name: string;
    email: string;
    role: 'Parte A' | 'Parte B' | 'Testigo' | 'Revisor';
    type: 'REGISTERED' | 'EXTERNAL'; // Usuario registrado vs Externo
    order: number;
    status: 'PENDING' | 'SIGNED' | 'WAITING' | 'REJECTED';
}

export interface Approval {
    area: string; // Changed from union to string to allow custom approvers
    email?: string; // Added email for notification
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    comment?: string;
    approverName?: string;
    date?: string;
}

export interface ContractData {
  // AI Config
  useAI: boolean;
  creationMethod: 'STANDARD' | 'AI';
  
  // Template info (if standard)
  templateId?: string;
  templateName?: string;

  // Step 1: Parties
  contractorType: 'company' | 'individual';
  contractorName: string;
  contractorId: string; // RUC/DNI
  contractorAddress: string;
  contractorCity: string;
  contractorZip: string;
  contractorEmail: string;
  
  clientName: string;
  clientRep: boolean;

  // Step 2: Service
  startDate: string;
  endDate: string;
  serviceName: string;
  price: string;
  currency: 'USD' | 'PEN' | 'EUR';
  quantity: string;
  description: string;

  // Step 3: Payment
  paymentType: 'single' | 'monthly' | 'on_completion';
  totalAmount: string;
  hasPenalty: boolean;

  // Generated Content
  contentBody?: string;
  
  // Dynamic fields for specific templates
  customFields?: Record<string, string>;
}

export interface Contact {
    id: string;
    name: string;
    role: string;
    email: string;
    type: 'Individual' | 'Empresa';
}

export interface UserProfile {
    companyName: string;
    companyEmail: string;
    serviceName: string;
    categoryName: string;
    userName: string;
    userEmail: string;
    language: string;
    role: UserRole;
}

export interface SavedContract {
    id: string;
    name: string;
    type: string;
    date: string;
    endDate?: string; // Important for expiration
    status: ContractState;
    signers: Signer[];
    approvals?: Approval[];
    previewContent?: string;
    data?: ContractData; // Store full data for editing
}

export interface LegalProcess {
    id: string;
    caseNumber: string; // Expediente
    court: string; // Juzgado
    status: 'Admisorio' | 'Laudo Final' | 'Activo' | 'Suspendido' | 'Cerrado';
    relatedContractId?: string;
    relatedContractName?: string;
    risk: 'Alto' | 'Medio' | 'Bajo';
    description: string;
    lastUpdate: string;
}