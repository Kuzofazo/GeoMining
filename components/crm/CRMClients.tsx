import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  Building2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Eye,
  Trash2,
  X,
  FileCheck2,
  Globe,
  DollarSign,
  TrendingUp,
  Send,
  CheckSquare,
  Square,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import {
  ClientProfile,
  ClientTier,
  ServiceRequest,
  CommunicationLog,
  FollowUpTask,
  ServiceRequestStage,
} from '../../types/crm';

interface CRMClientsProps {
  initialSearch?: string;
}

export const CRMClients: React.FC<CRMClientsProps> = ({ initialSearch = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  // Modals
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCommModal, setShowCommModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Add Client Form
  const [newClient, setNewClient] = useState({
    clientName: '',
    tier: 'Strategic Investor' as ClientTier,
    primaryContactName: '',
    primaryContactTitle: 'Managing Director',
    email: '',
    phone: '',
    country: 'Liberia',
    status: 'active' as ClientProfile['status'],
    totalContractValueUSD: 50000,
    accountManager: 'Carlos E. Tingban',
  });

  // Add Service Form
  const [newService, setNewService] = useState({
    serviceTitle: '',
    serviceCategory: 'Mining License Package Acquisition' as ServiceRequest['serviceCategory'],
    estimatedValueUSD: 35000,
    stage: 'inquiry' as ServiceRequestStage,
    startDate: new Date().toISOString().substring(0, 10),
    targetCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    leadConsultant: 'Carlos E. Tingban',
    progressPct: 15,
    notes: '',
  });

  // Add Communication Form
  const [newComm, setNewComm] = useState({
    date: new Date().toISOString().substring(0, 10),
    channel: 'In-Person Meeting' as CommunicationLog['channel'],
    summary: '',
    conductedBy: 'Carlos E. Tingban',
    nextFollowUpDate: '',
  });

  // Add Task Form
  const [newTask, setNewTask] = useState({
    title: '',
    assignedTo: 'Carlos E. Tingban',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    priority: 'high' as FollowUpTask['priority'],
    category: 'Client Follow-up' as FollowUpTask['category'],
  });

  const clients = crmService.getClients();
  const canManage = crmService.checkPermission('canManageClients');
  const canDelete = crmService.checkPermission('canDeleteRecords');

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContactName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.accountManager.toLowerCase().includes(search.toLowerCase());

    const matchesTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.clientName || !newClient.primaryContactName) return;

    crmService.addClient({
      clientName: newClient.clientName,
      tier: newClient.tier,
      primaryContactName: newClient.primaryContactName,
      primaryContactTitle: newClient.primaryContactTitle,
      email: newClient.email,
      phone: newClient.phone,
      country: newClient.country,
      status: newClient.status,
      totalContractValueUSD: Number(newClient.totalContractValueUSD) || 0,
      accountManager: newClient.accountManager,
    });

    setShowAddClientModal(false);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newService.serviceTitle) return;

    crmService.addServiceRequest(selectedClient.id, {
      serviceTitle: newService.serviceTitle,
      serviceCategory: newService.serviceCategory,
      estimatedValueUSD: Number(newService.estimatedValueUSD) || 0,
      stage: newService.stage,
      startDate: newService.startDate,
      targetCompletionDate: newService.targetCompletionDate,
      leadConsultant: newService.leadConsultant,
      progressPct: Number(newService.progressPct) || 0,
      notes: newService.notes,
    });

    setSelectedClient(crmService.getClientById(selectedClient.id) || null);
    setShowServiceModal(false);
  };

  const handleAddComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newComm.summary) return;

    crmService.addCommunicationLog(selectedClient.id, {
      date: newComm.date,
      channel: newComm.channel,
      summary: newComm.summary,
      conductedBy: newComm.conductedBy,
      nextFollowUpDate: newComm.nextFollowUpDate || undefined,
    });

    setSelectedClient(crmService.getClientById(selectedClient.id) || null);
    setShowCommModal(false);
    setNewComm({
      date: new Date().toISOString().substring(0, 10),
      channel: 'In-Person Meeting',
      summary: '',
      conductedBy: 'Carlos E. Tingban',
      nextFollowUpDate: '',
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newTask.title) return;

    crmService.addFollowUpTask(selectedClient.id, {
      title: newTask.title,
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      category: newTask.category,
    });

    setSelectedClient(crmService.getClientById(selectedClient.id) || null);
    setShowTaskModal(false);
    setNewTask({
      title: '',
      assignedTo: 'Carlos E. Tingban',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      priority: 'high',
      category: 'Client Follow-up',
    });
  };

  const handleToggleTask = (taskId: string) => {
    if (!selectedClient) return;
    crmService.toggleFollowUpTask(selectedClient.id, taskId);
    setSelectedClient(crmService.getClientById(selectedClient.id) || null);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client profile?')) {
      crmService.deleteClient(id);
      setSelectedClient(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users2 size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Client Relationship Management (CRM)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Investor relationship lifecycle, technical consultancy service requests, stakeholder correspondence, and commercial engagement pipelines.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2a602f] hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
          >
            <Plus size={16} className="text-[#ffc30d]" />
            <span>New Client Account</span>
          </button>
        )}
      </div>

      {/* Search and Tier Filter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, representative, country, or account manager..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          />
        </div>

        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Client Tiers</option>
          <option value="Tier 1 Enterprise">Tier 1 Enterprise</option>
          <option value="Strategic Investor">Strategic Investor</option>
          <option value="Commercial Operator">Commercial Operator</option>
          <option value="Artisanal Cooperative">Artisanal Cooperative</option>
        </select>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const completedTasks = client.followUps.filter((t) => t.completed).length;
          return (
            <div
              key={client.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {client.tier}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-800">
                    ${client.totalContractValueUSD.toLocaleString()} USD
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-1 mb-1">
                  {client.clientName}
                </h3>
                <div className="text-xs text-slate-600 font-semibold mb-3 flex items-center gap-1.5">
                  <Globe size={13} className="text-slate-400 shrink-0" />
                  <span>{client.country}</span>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs mb-4">
                  <div className="font-bold text-slate-900">{client.primaryContactName}</div>
                  <div className="text-slate-500 text-[11px]">{client.primaryContactTitle}</div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px] pt-1">
                    <Mail size={12} className="text-blue-500 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Phone size={12} className="text-blue-500 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                {/* Pipeline Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-slate-600 mb-4">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-sm font-black text-blue-600">{client.serviceRequests.length}</div>
                    <div className="text-slate-400 uppercase text-[9px]">Services</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-sm font-black text-emerald-600">{client.communicationLogs.length}</div>
                    <div className="text-slate-400 uppercase text-[9px]">Logs</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-sm font-black text-amber-600">
                      {client.followUps.length - completedTasks}
                    </div>
                    <div className="text-slate-400 uppercase text-[9px]">Open Tasks</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Lead: {client.accountManager}</span>
                <button
                  onClick={() => setSelectedClient(client)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Eye size={13} />
                  <span>Open CRM Dossier</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Client CRM Dossier Modal ────────────────────────────────────── */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedClient(null)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200 shrink-0">
                  <Users2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {selectedClient.clientName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                      {selectedClient.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Primary Contact: <strong>{selectedClient.primaryContactName}</strong> ({selectedClient.primaryContactTitle}) • Origin: {selectedClient.country}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedClient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">Account Manager: {selectedClient.accountManager}</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Briefcase size={13} />
                  <span>Add Service Request</span>
                </button>
                <button
                  onClick={() => setShowCommModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <MessageSquare size={13} />
                  <span>Log Meeting / Call</span>
                </button>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Assign Follow-up</span>
                </button>
              </div>
            </div>

            {/* Section 1: Active Service Requests Pipeline */}
            <div className="mt-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <Briefcase size={16} className="text-blue-600" />
                <span>Service Requests &amp; Engagements ({selectedClient.serviceRequests.length})</span>
              </h3>

              <div className="space-y-3">
                {selectedClient.serviceRequests.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center">No active service requests recorded.</p>
                ) : (
                  selectedClient.serviceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{req.serviceTitle}</h4>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                            {req.stage.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{req.serviceCategory}</p>
                        {req.notes && <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{req.notes}</p>}
                        <div className="text-[10px] text-slate-400 mt-2">
                          Lead: <strong>{req.leadConsultant}</strong> • Target: {req.targetCompletionDate}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-slate-900">
                          ${req.estimatedValueUSD.toLocaleString()} USD
                        </div>
                        <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all"
                            style={{ width: `${req.progressPct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 mt-1 block">
                          {req.progressPct}% Complete
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 2: Communication Logs */}
            <div className="mt-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-600" />
                <span>Communication History ({selectedClient.communicationLogs.length})</span>
              </h3>

              <div className="space-y-2.5">
                {selectedClient.communicationLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px]">
                          {log.channel}
                        </span>
                        <span className="text-slate-400 text-[11px]">{log.date}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">By: {log.conductedBy}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed mt-1.5">{log.summary}</p>
                    {log.nextFollowUpDate && (
                      <div className="text-[10px] text-amber-700 font-bold mt-2">
                        Next Scheduled Follow-up: {log.nextFollowUpDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Follow-Up Action Tasks */}
            <div className="mt-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <CheckSquare size={16} className="text-amber-600" />
                <span>Pending Follow-ups &amp; Action Tasks ({selectedClient.followUps.length})</span>
              </h3>

              <div className="space-y-2">
                {selectedClient.followUps.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {task.completed ? (
                        <CheckSquare size={18} className="text-emerald-600 shrink-0" />
                      ) : (
                        <Square size={18} className="text-slate-400 shrink-0" />
                      )}
                      <div className={`text-xs ${task.completed ? 'line-through text-slate-400' : 'font-bold text-slate-900'}`}>
                        {task.title}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[10px]">
                      <span className="text-slate-400">Assigned: {task.assignedTo}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-700">
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Client Modal ─────────────────────────────────────────────── */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowAddClientModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Register Client Account</h3>
              <button onClick={() => setShowAddClientModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Client / Corporate Name *</label>
                <input
                  type="text"
                  required
                  value={newClient.clientName}
                  onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                  placeholder="e.g. Atlantic Mining Corp"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Tier</label>
                  <select
                    value={newClient.tier}
                    onChange={(e) => setNewClient({ ...newClient, tier: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Tier 1 Enterprise">Tier 1 Enterprise</option>
                    <option value="Strategic Investor">Strategic Investor</option>
                    <option value="Commercial Operator">Commercial Operator</option>
                    <option value="Artisanal Cooperative">Artisanal Cooperative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={newClient.country}
                    onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                    placeholder="e.g. Liberia, China, UK"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Lead Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newClient.primaryContactName}
                    onChange={(e) => setNewClient({ ...newClient, primaryContactName: e.target.value })}
                    placeholder="e.g. Melvin Scott"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Contact Title</label>
                  <input
                    type="text"
                    value={newClient.primaryContactTitle}
                    onChange={(e) => setNewClient({ ...newClient, primaryContactTitle: e.target.value })}
                    placeholder="Managing Director"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="contact@client.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Phone</label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+231 77 000 0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-black uppercase tracking-wider"
                >
                  Register Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Add Service Request Modal ─────────────────────────────────────── */}
      {showServiceModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowServiceModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">New Service Engagement</h3>
              <button onClick={() => setShowServiceModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Engagement Title *</label>
                <input
                  type="text"
                  required
                  value={newService.serviceTitle}
                  onChange={(e) => setNewService({ ...newService, serviceTitle: e.target.value })}
                  placeholder="e.g. EIA Baseline Study for Mining Concession"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Service Category</label>
                <select
                  value={newService.serviceCategory}
                  onChange={(e) => setNewService({ ...newService, serviceCategory: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Mining License Package Acquisition">Mining License Package Acquisition</option>
                  <option value="Statutory Due Diligence & Title Verification">Due Diligence &amp; Title Verification</option>
                  <option value="Environmental & Social Impact Assessment (ESIA)">Environmental Impact Assessment (ESIA)</option>
                  <option value="Mineral Exploration & Geological Surveys">Mineral Exploration &amp; Surveys</option>
                  <option value="Geotechnical Engineering & Slope Stability">Geotechnical Engineering</option>
                  <option value="Client Security & Concession Advisory">Client Security Advisory</option>
                  <option value="EPA Regulatory Compliance Audit">EPA Regulatory Compliance Audit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Contract Value (USD)</label>
                  <input
                    type="number"
                    value={newService.estimatedValueUSD}
                    onChange={(e) => setNewService({ ...newService, estimatedValueUSD: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Pipeline Stage</label>
                  <select
                    value={newService.stage}
                    onChange={(e) => setNewService({ ...newService, stage: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="inquiry">Inquiry</option>
                    <option value="due_diligence">Due Diligence</option>
                    <option value="proposal_submitted">Proposal Sent</option>
                    <option value="contract_signed">Contract Signed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-black uppercase tracking-wider"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Add Communication Modal ─────────────────────────────────────── */}
      {showCommModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowCommModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Log Stakeholder Correspondence</h3>
              <button onClick={() => setShowCommModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddComm} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Channel</label>
                  <select
                    value={newComm.channel}
                    onChange={(e) => setNewComm({ ...newComm, channel: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="In-Person Meeting">In-Person Meeting</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Official Email">Official Email</option>
                    <option value="Field Mission">Field Mission</option>
                    <option value="Formal Letter">Formal Letter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={newComm.date}
                    onChange={(e) => setNewComm({ ...newComm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Executive Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={newComm.summary}
                  onChange={(e) => setNewComm({ ...newComm, summary: e.target.value })}
                  placeholder="Summarize key discussions, agreements, or statutory requests..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Next Follow-up Date (Optional)</label>
                <input
                  type="date"
                  value={newComm.nextFollowUpDate}
                  onChange={(e) => setNewComm({ ...newComm, nextFollowUpDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCommModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-wider"
                >
                  Log Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Add Task Modal ──────────────────────────────────────────────── */}
      {showTaskModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowTaskModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase">Assign Follow-Up Task</h3>
              <button onClick={() => setShowTaskModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Task Description *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Deliver ESIA scoping draft to client"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Assigned Officer</label>
                  <input
                    type="text"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white font-black uppercase tracking-wider"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

