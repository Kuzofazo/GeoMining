import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Building2,
  FileCheck2,
  CheckCircle2,
  Circle,
  Trash2,
  Eye,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import { CRMTask, TaskPriority, TaskStatus, TaskCategory } from '../../types/crm';

interface CRMTasksProps {
  initialSearch?: string;
}

export const CRMTasks: React.FC<CRMTasksProps> = ({ initialSearch = '' }) => {
  const [tasks, setTasks] = useState<CRMTask[]>(() => crmService.getTasks());
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedTask, setSelectedTask] = useState<CRMTask | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State for New Task
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignedUserEmail, setNewAssignedUserEmail] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newCategory, setNewCategory] = useState<TaskCategory>('Daily Intake');
  const [newDueDate, setNewDueDate] = useState<string>(() => new Date().toISOString().substring(0, 10));
  const [newDueTime, setNewDueTime] = useState<string>('16:00');
  const [newChecklistItems, setNewChecklistItems] = useState<string[]>(['Verify official documentation']);
  const [newChecklistInput, setNewChecklistInput] = useState('');
  const [newRelatedCompanyId, setNewRelatedCompanyId] = useState('');

  const currentUser = crmService.getCurrentUser();
  const users = crmService.getUsers();
  const companies = crmService.getCompanies();
  const canAssign = crmService.checkPermission('canAssignTasks') || currentUser?.role === 'super_admin';

  const refreshTasks = () => {
    setTasks(crmService.getTasks());
  };

  const todayStr = new Date().toISOString().substring(0, 10);

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    // Search
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedToName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.relatedCompanyName && task.relatedCompanyName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Status Filter
    if (statusFilter === 'my_tasks') {
      if (currentUser && task.assignedToEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
        return false;
      }
    } else if (statusFilter === 'today') {
      if (task.dueDate !== todayStr || task.status === 'completed') return false;
    } else if (statusFilter === 'overdue') {
      if (task.dueDate >= todayStr || task.status === 'completed') return false;
    } else if (statusFilter !== 'all') {
      if (task.status !== statusFilter) return false;
    }

    // Priority Filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    // Category Filter
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

    return true;
  });

  const overdueCount = tasks.filter((t) => t.status !== 'completed' && t.dueDate < todayStr).length;
  const dueTodayCount = tasks.filter((t) => t.status !== 'completed' && t.dueDate === todayStr).length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;

  const handleToggleChecklist = (taskId: string, checklistId: string) => {
    crmService.toggleChecklistItem(taskId, checklistId);
    refreshTasks();
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(crmService.getTaskById(taskId) || null);
    }
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    crmService.updateTaskStatus(taskId, status);
    refreshTasks();
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(crmService.getTaskById(taskId) || null);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this administrative task?')) {
      crmService.deleteTask(taskId);
      refreshTasks();
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    }
  };

  const handleAddChecklistField = () => {
    if (!newChecklistInput.trim()) return;
    setNewChecklistItems([...newChecklistItems, newChecklistInput.trim()]);
    setNewChecklistInput('');
  };

  const handleRemoveChecklistField = (index: number) => {
    setNewChecklistItems(newChecklistItems.filter((_, i) => i !== index));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    const assignedUser = users.find((u) => u.email.toLowerCase() === newAssignedUserEmail.toLowerCase()) || currentUser;
    if (!assignedUser) {
      alert('Please select an assigned employee');
      return;
    }

    const relatedComp = companies.find((c) => c.id === newRelatedCompanyId);

    crmService.addTask({
      title: newTitle,
      description: newDescription,
      assignedToId: assignedUser.id,
      assignedToName: assignedUser.name,
      assignedToEmail: assignedUser.email,
      assignedToRole: assignedUser.role,
      department: assignedUser.department,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
      dueTime: newDueTime,
      checklist: newChecklistItems.map((item, idx) => ({
        id: `chk-${Date.now()}-${idx}`,
        title: item,
        completed: false,
      })),
      relatedCompanyId: relatedComp?.id,
      relatedCompanyName: relatedComp?.companyName,
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewAssignedUserEmail('');
    setNewChecklistItems(['Verify official documentation']);
    setShowCreateModal(false);
    refreshTasks();
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">To Do</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Under Review</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#2a602f] border border-emerald-200 flex items-center gap-1"><CheckCircle2 size={10} /> Completed</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & KPI Stat Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#2a602f] border border-emerald-200">
              <CheckSquare size={20} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Daily Tasks & Deadline Radar
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Bitrix24-style operational task scheduling, departmental accountability, checklists & milestone tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('board')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Board View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              List View
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#2a602f] hover:bg-[#224f26] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Assign Daily Task</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total System Tasks</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
            <Layers size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Due Today</p>
            <p className="text-2xl font-black text-amber-900 mt-0.5">{dueTodayCount}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-700">Overdue (Urgent)</p>
            <p className="text-2xl font-black text-red-900 mt-0.5">{overdueCount}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#2a602f]">Completed Tasks</p>
            <p className="text-2xl font-black text-[#2a602f] mt-0.5">{completedCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-[#2a602f]">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-[#2a602f] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter('my_tasks')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'my_tasks'
                ? 'bg-[#2a602f] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            My Assigned Tasks
          </button>
          <button
            onClick={() => setStatusFilter('today')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'today'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            Due Today ({dueTodayCount})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'overdue'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-700 bg-red-50 hover:bg-red-100'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              statusFilter === 'completed'
                ? 'bg-[#2a602f] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search & Priority Selector */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, officer, company..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f] focus:bg-white"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Task List or Board View */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <CheckSquare size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No tasks match current filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Create a new daily operational task or clear search filters to view departmental assignments.
          </p>
        </div>
      ) : viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['todo', 'in_progress', 'review', 'completed'] as TaskStatus[]).map((colStatus) => {
            const colTasks = filteredTasks.filter((t) => t.status === colStatus);
            const colTitles: Record<TaskStatus, { title: string; color: string }> = {
              todo: { title: 'TO DO / PENDING', color: 'border-slate-300 bg-slate-100 text-slate-700' },
              in_progress: { title: 'IN PROGRESS', color: 'border-blue-300 bg-blue-50 text-blue-700' },
              review: { title: 'STATUTORY REVIEW', color: 'border-purple-300 bg-purple-50 text-purple-700' },
              completed: { title: 'COMPLETED & VERIFIED', color: 'border-emerald-300 bg-emerald-50 text-[#2a602f]' },
            };

            return (
              <div key={colStatus} className="flex flex-col rounded-2xl bg-slate-50/70 border border-slate-200 p-3">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colTitles[colStatus].color}`}>
                      {colTitles[colStatus].title}
                    </span>
                    <span className="text-xs font-black text-slate-400">({colTasks.length})</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colTasks.map((task) => {
                    const isOverdue = task.status !== 'completed' && task.dueDate < todayStr;
                    const isToday = task.status !== 'completed' && task.dueDate === todayStr;
                    const completedChecklist = task.checklist.filter((c) => c.completed).length;

                    return (
                      <div
                        key={task.id}
                        className={`bg-white p-3.5 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                          isOverdue
                            ? 'border-red-300 hover:border-red-400'
                            : isToday
                            ? 'border-amber-300 hover:border-amber-400'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex items-center justify-between gap-1 mb-2">
                          {getPriorityBadge(task.priority)}
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {task.category}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
                          {task.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                          {task.description}
                        </p>

                        {/* Checklist Counter */}
                        {task.checklist.length > 0 && (
                          <div className="mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                              <span>Checklist Progress</span>
                              <span>
                                {completedChecklist}/{task.checklist.length}
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#2a602f] h-full transition-all"
                                style={{ width: `${(completedChecklist / task.checklist.length) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Assignee & Deadline */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate max-w-[120px]">
                            <User size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{task.assignedToName}</span>
                          </div>

                          <div
                            className={`flex items-center gap-1 font-bold ${
                              isOverdue
                                ? 'text-red-600'
                                : isToday
                                ? 'text-amber-600'
                                : 'text-slate-500'
                            }`}
                          >
                            <Clock size={11} />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Task & Category</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Checklist</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => {
                const isOverdue = task.status !== 'completed' && task.dueDate < todayStr;
                const isToday = task.status !== 'completed' && task.dueDate === todayStr;
                const completedCount = task.checklist.filter((c) => c.completed).length;

                return (
                  <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 leading-snug line-clamp-1">{task.title}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">{task.category}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{task.assignedToName}</div>
                      <div className="text-[10px] text-slate-500">{task.department}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">{getPriorityBadge(task.priority)}</td>

                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(task.status)}</td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div
                        className={`font-bold flex items-center gap-1.5 ${
                          isOverdue ? 'text-red-600' : isToday ? 'text-amber-600' : 'text-slate-600'
                        }`}
                      >
                        <Calendar size={13} />
                        <span>{task.dueDate}</span>
                        {isOverdue && <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-700 text-[9px]">LATE</span>}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-700">
                        {completedCount} / {task.checklist.length}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-all"
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getPriorityBadge(selectedTask.priority)}
                  {getStatusBadge(selectedTask.status)}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {selectedTask.category}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">{selectedTask.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Task Directive</h5>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedTask.description}
                </p>
              </div>

              {/* Assignee & Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Assigned Officer</span>
                  <span className="font-bold text-slate-900">{selectedTask.assignedToName}</span>
                  <span className="text-slate-500 block text-[10px]">{selectedTask.department}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Statutory Deadline</span>
                  <span className="font-bold text-slate-900">{selectedTask.dueDate} at {selectedTask.dueTime || '17:00'}</span>
                  <span className="text-slate-500 block text-[10px]">Assigned by: {selectedTask.createdByName}</span>
                </div>
              </div>

              {/* Interactive Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Verification Checklist ({selectedTask.checklist.filter((c) => c.completed).length} / {selectedTask.checklist.length})
                  </h5>
                </div>

                <div className="space-y-2">
                  {selectedTask.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(selectedTask.id, item.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        item.completed
                          ? 'bg-emerald-50/50 border-emerald-200 text-[#2a602f] line-through'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 size={16} className="text-[#2a602f] shrink-0" />
                      ) : (
                        <Circle size={16} className="text-slate-300 shrink-0" />
                      )}
                      <span className="font-medium">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Update Status</h5>
                <div className="grid grid-cols-4 gap-2">
                  {(['todo', 'in_progress', 'review', 'completed'] as TaskStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedTask.id, st)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        selectedTask.status === st
                          ? 'bg-[#2a602f] text-white border-[#2a602f]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Delete Task</span>
              </button>

              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-[#2a602f]">
                  <Plus size={18} />
                </span>
                <h3 className="text-lg font-black text-slate-900">Assign New Daily Task</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="py-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Verify Concession Deed & TIN for New Filing"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Directives & Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide precise instructions for the assigned officer..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f] focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Assign To Employee *
                  </label>
                  <select
                    required
                    value={newAssignedUserEmail}
                    onChange={(e) => setNewAssignedUserEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                  >
                    <option value="">Select Employee...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.name} — {u.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                  >
                    <option value="Daily Intake">Daily Intake</option>
                    <option value="Concession Verification">Concession Verification</option>
                    <option value="Field Inspection">Field Inspection</option>
                    <option value="Regulatory Audit">Regulatory Audit</option>
                    <option value="Client Follow-up">Client Follow-up</option>
                    <option value="Executive Directive">Executive Directive</option>
                    <option value="General Operations">General Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Priority *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Deadline Time
                  </label>
                  <input
                    type="time"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a602f]"
                  />
                </div>
              </div>

              {/* Checklist Builder */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Verification Checklist Steps
                </label>
                <div className="space-y-1.5 mb-2">
                  {newChecklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-xs border border-slate-100">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistField(idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newChecklistInput}
                    onChange={(e) => setNewChecklistInput(e.target.value)}
                    placeholder="Add checklist step..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistField();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistField}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Add Step
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2a602f] hover:bg-[#224f26] text-white font-bold text-xs shadow-sm"
                >
                  Confirm & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
