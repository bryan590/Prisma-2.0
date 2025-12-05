
import React, { useState } from 'react';
import { SearchIcon, MoreVerticalIcon, PlusIcon, XIcon } from '../components/Icons';
import { Contact } from '../types';

interface ContactsProps {
    contacts: Contact[];
    onAdd: (contact: Contact) => void;
    onDelete: (id: string) => void;
}

export const Contacts: React.FC<ContactsProps> = ({ contacts, onAdd, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newContact, setNewContact] = useState<Partial<Contact>>({ type: 'Individual' });

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        if(newContact.name && newContact.email && newContact.role) {
            onAdd({
                id: Date.now().toString(),
                name: newContact.name,
                email: newContact.email,
                role: newContact.role,
                type: newContact.type as any
            });
            setShowModal(false);
            setNewContact({ type: 'Individual' });
        }
    };

    return (
        <div className="p-8">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contactos</h1>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
                    <PlusIcon className="w-4 h-4" />
                    Nuevo Contacto
                </button>
             </div>
             
             {/* Toolbar */}
             <div className="bg-gray-100 p-4 rounded-xl flex gap-4 mb-6">
                 <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium">{filteredContacts.length} Contactos</button>
                 
                 <div className="flex-1 bg-gray-200 rounded-lg flex items-center px-4">
                     <SearchIcon className="w-4 h-4 text-gray-500 mr-2"/>
                     <input 
                        type="text" 
                        placeholder="Buscar por nombre o correo..." 
                        className="bg-transparent text-sm w-full outline-none" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                 </div>
             </div>

             {/* Table Header */}
             <div className="flex text-sm text-gray-500 border-b border-gray-900 pb-2 mb-4">
                 <div className="w-1/3 pl-4">Identidad</div>
                 <div className="w-1/3">Tipo</div>
                 <div className="w-1/3 text-right pr-4">Acciones</div>
             </div>

             {/* List Item */}
             <div className="space-y-3">
                {filteredContacts.map(contact => (
                    <div key={contact.id} className="bg-white rounded-xl p-4 flex items-center shadow-sm">
                        <div className="w-1/3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} alt="Avatar" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{contact.name}</h4>
                                <p className="text-xs text-gray-500">{contact.role} • {contact.email}</p>
                            </div>
                        </div>
                        <div className="w-1/3">
                            <span className="text-sm font-bold bg-gray-50 px-3 py-1 rounded-full border border-gray-200 text-gray-600">{contact.type}</span>
                        </div>
                        <div className="w-1/3 flex justify-end">
                            <button 
                                onClick={() => onDelete(contact.id)}
                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-400">
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
             </div>

             {/* Add Modal */}
             {showModal && (
                 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                     <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-scale-in">
                         <h2 className="text-xl font-bold mb-4">Agregar Contacto</h2>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-xs font-bold text-gray-500 block mb-1">Nombre</label>
                                 <input 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                                    value={newContact.name || ''}
                                    onChange={e => setNewContact({...newContact, name: e.target.value})}
                                 />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 block mb-1">Rol</label>
                                 <input 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                                    value={newContact.role || ''}
                                    onChange={e => setNewContact({...newContact, role: e.target.value})}
                                 />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 block mb-1">Correo</label>
                                 <input 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                                    value={newContact.email || ''}
                                    onChange={e => setNewContact({...newContact, email: e.target.value})}
                                 />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 block mb-1">Tipo</label>
                                 <select 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none focus:border-indigo-500"
                                    value={newContact.type}
                                    onChange={e => setNewContact({...newContact, type: e.target.value as any})}
                                 >
                                     <option value="Individual">Individual</option>
                                     <option value="Empresa">Empresa</option>
                                 </select>
                             </div>
                         </div>
                         <div className="flex justify-end gap-2 mt-6">
                             <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancelar</button>
                             <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">Guardar</button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    )
}
