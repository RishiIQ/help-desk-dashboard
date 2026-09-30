import React, { useState } from "react";

const App = () => {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  // Form Fields State
  const [formSubject, setFormSubject] = useState("");
  const [formRequester, setFormRequester] = useState("");
  const [formPriority, setFormPriority] = useState("Medium");
  const [formStatus, setFormStatus] = useState("Open");
  const [formCategory, setFormCategory] = useState("Authentication");
  const [formAssignee, setFormAssignee] = useState("Kavitha");
  const [formDescription, setFormDescription] = useState("");

  // New Comment Input
  const [commentText, setCommentText] = useState("");

  // Expanded Ticket List State with Tamil Names
  const [tickets, setTickets] = useState([
    {
      id: "#101",
      subject: "Cannot login to user portal",
      requester: "Murugan",
      priority: "High",
      status: "Open",
      category: "Authentication",
      assignee: "Kavitha",
      slaDue: "2h 15m",
      dateCreated: "Oct 24, 10:30 AM",
      description: "Getting a 500 error code when trying to sign in with Google SSO.",
      comments: [{ author: "Support Agent", text: "Looking into the server authentication logs." }]
    },
    {
      id: "#102",
      subject: "Billing charge double on annual subscription",
      requester: "Kavitha",
      priority: "Urgent",
      status: "In Progress",
      category: "Billing",
      assignee: "Karthik",
      slaDue: "Overdue",
      dateCreated: "Oct 24, 09:15 AM",
      description: "I was charged twice for my monthly enterprise subscription renewal.",
      comments: [{ author: "Karthik", text: "Processing refund through gateway." }]
    },
    {
      id: "#103",
      subject: "Update company email address request",
      requester: "Divya",
      priority: "Low",
      status: "Resolved",
      category: "Account",
      assignee: "Kavitha",
      slaDue: "1d 8h",
      dateCreated: "Oct 23, 02:10 PM",
      description: "Please help me change my registered account email address to divya@firm.com.",
      comments: []
    },
    {
      id: "#104",
      subject: "API webhook returning timeout error 504",
      requester: "Anbu",
      priority: "High",
      status: "Open",
      category: "Integration",
      assignee: "Unassigned",
      slaDue: "45m",
      dateCreated: "Oct 23, 11:00 AM",
      description: "Our webhook endpoint synchronization fails during bulk data triggers.",
      comments: []
    },
    {
      id: "#105",
      subject: "Export data to CSV failing on large range",
      requester: "Vijay",
      priority: "Medium",
      status: "In Progress",
      category: "Reports",
      assignee: "Karthik",
      slaDue: "3h 30m",
      dateCreated: "Oct 22, 04:20 PM",
      description: "The analytics export utility crashes when selecting a date range exceeding 90 days.",
      comments: []
    }
  ]);

  // Toast Helper
  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Create Ticket Handler
  const handleCreate = (e) => {
    e.preventDefault();
    if (!formSubject || !formRequester) return;

    const newTicket = {
      id: `#10${tickets.length + 1}`,
      subject: formSubject,
      requester: formRequester,
      priority: formPriority,
      status: formStatus,
      category: formCategory,
      assignee: formAssignee,
      slaDue: "4h 00m",
      dateCreated: "Just now",
      description: formDescription || "No description provided.",
      comments: []
    };

    setTickets([newTicket, ...tickets]);
    setShowCreateModal(false);
    setFormSubject("");
    setFormRequester("");
    setFormDescription("");
    showNotification("Ticket created successfully!");
  };

  // Fixed Edit Ticket Handler
  const handleEdit = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          subject: formSubject,
          priority: formPriority,
          status: formStatus,
          category: formCategory,
          assignee: formAssignee,
          description: formDescription
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id));
    setShowEditModal(false);
    showNotification("Ticket updated successfully!");
  };

  // Delete Ticket Handler
  const handleDelete = () => {
    setTickets(tickets.filter((t) => t.id !== deleteId));
    if (selectedTicket && selectedTicket.id === deleteId) {
      setSelectedTicket(null);
    }
    setDeleteId(null);
    showNotification("Ticket deleted.");
  };

  // Add Comment Handler
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicket) return;

    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        const newComments = [...t.comments, { author: "Rishi (Admin)", text: commentText }];
        return { ...t, comments: newComments };
      }
      return t;
    });

    setTickets(updated);
    setSelectedTicket(updated.find(t => t.id === selectedTicket.id));
    setCommentText("");
    showNotification("Comment added!");
  };

  // Open Edit Form and populate states with the selected ticket data
  const openEditForm = (t) => {
    setSelectedTicket(t);
    setFormSubject(t.subject);
    setFormRequester(t.requester);
    setFormPriority(t.priority);
    setFormStatus(t.status);
    setFormCategory(t.category);
    setFormAssignee(t.assignee);
    setFormDescription(t.description);
    setShowEditModal(true);
  };

  // Graph Calculations
  const totalCount = tickets.length || 1;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const progressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  const urgentHighCount = tickets.filter(t => t.priority === 'Urgent' || t.priority === 'High').length;
  const mediumLowCount = tickets.filter(t => t.priority === 'Medium' || t.priority === 'Low').length;

  return (
    <div className="p-4 sm:p-8 max-w-screen mx-auto font-sans text-slate-900 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 min-h-screen selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-6 p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 text-sm font-medium flex items-center justify-between animate-bounce">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      {/* Modern Header */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-5 mb-8 bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl shadow-indigo-950/10 text-white border border-indigo-800/30">
        <div className="space-y-1">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
            Helpdesk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Support Management</h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">Dashboard & Tracking</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-serif font-bold text-base shadow-md">
              R
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Rishi</p>
              <p className="text-[11px] text-indigo-300 font-medium mt-1">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => {
              setFormSubject("");
              setFormRequester("");
              setFormDescription("");
              setShowCreateModal(true);
            }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
          >
            + New Ticket
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-3xl h-fit border border-slate-200/80 shadow-sm">
          <div className="md:col-span-1 flex flex-row md:flex-col gap-2">
            <button
              onClick={() => { setActiveTab("dashboard"); setSelectedTicket(null); }}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 ${
                activeTab === "dashboard" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              <span>📋</span> Dashboard & Tickets
            </button>
            <button
              onClick={() => { setActiveTab("reports"); setSelectedTicket(null); }}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3 ${
                activeTab === "reports" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                  : "text-slate-600 hover:bg-slate-100/80"
              }`}
            >
               <span>📈</span> Reports & Analytics
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC CONTENT VIEWS */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB 1: DASHBOARD & TICKETS */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80">
                <input
                  type="text"
                  placeholder="🔍 Search by ID, Subject, or Requester..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm flex-1 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-sm text-slate-700 outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* Ticket Table */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-300 border-b border-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 px-5">ID</th>
                        <th className="py-4 px-5">Subject</th>
                        <th className="py-4 px-5">Requester</th>
                        <th className="py-4 px-5">Priority</th>
                        <th className="py-4 px-5">Status</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredTickets.length > 0 ? (
                        filteredTickets.map((t) => (
                          <tr
                            key={t.id}
                            onClick={() => setSelectedTicket(t)}
                            className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                          >
                            <td className="py-4 px-5 font-extrabold text-indigo-600 whitespace-nowrap">{t.id}</td>
                            <td className="py-4 px-5 font-semibold text-slate-800">{t.subject}</td>
                            <td className="py-4 px-5 text-slate-600 font-medium whitespace-nowrap">{t.requester}</td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                t.priority === 'High' || t.priority === 'Urgent' 
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                                {t.status}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => openEditForm(t)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition shadow-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteId(t.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition shadow-xs"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-slate-400 text-sm font-medium">
                            No tickets found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ticket Detail View */}
              {selectedTicket && (
                <div className="bg-slate-200 p-6 sm:p-8 rounded-3xl shadow-lg shadow-indigo-950/5 border border-slate-200/80 space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                        {selectedTicket.id}
                      </span>
                      <h2 className="font-extrabold text-xl text-slate-900 mt-2">
                        {selectedTicket.subject}
                      </h2>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold transition"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-4 rounded-2xl border border-slate-200/60 font-medium">
                    <div><span className="font-bold text-slate-700">Requester:</span> {selectedTicket.requester}</div>
                    <div><span className="font-bold text-slate-700">Assignee:</span> {selectedTicket.assignee}</div>
                    <div><span className="font-bold text-slate-700">Category:</span> {selectedTicket.category}</div>
                    <div><span className="font-bold text-slate-700">SLA Due:</span> <span className="text-rose-600 font-extrabold">{selectedTicket.slaDue}</span></div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed"><span className="font-bold text-slate-900">Description:</span> {selectedTicket.description}</p>

                  {/* Comments Section */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Comments & Activity Timeline</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {selectedTicket.comments.length > 0 ? (
                        selectedTicket.comments.map((c, i) => (
                          <div key={i} className="bg-slate-50 p-3.5 rounded-2xl text-xs border border-slate-200/60 space-y-1">
                            <span className="font-bold text-indigo-600">{c.author}</span>
                            <p className="text-slate-700 font-medium">{c.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No comments recorded yet.</p>
                      )}
                    </div>

                    <form onSubmit={handleAddComment} className="flex flex-col sm:flex-row gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Write an internal comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl text-xs flex-1 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner font-medium"
                      />
                      <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md transition">
                        Post Comment
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REPORTS & GRAPHS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
                <h2 className="font-extrabold text-xl text-slate-900">Support Analytics Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl text-center shadow-xs">
                    <div className="text-3xl font-extrabold text-indigo-600">{tickets.length}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Total Tickets</div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl text-center shadow-xs">
                    <div className="text-3xl font-extrabold text-amber-600">{openCount}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Open Tickets</div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl text-center shadow-xs">
                    <div className="text-3xl font-extrabold text-emerald-600">{resolvedCount}</div>
                    <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">Resolved Tickets</div>
                  </div>
                </div>
              </div>

              {/* VISUAL GRAPHS SECTION */}
              <div className="bg-blue-100 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
                <h3 className="font-extrabold text-lg text-slate-900">Ticket Distribution Analytics</h3>
                
                {/* Status Bar Graph */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">By Status Breakdown</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                        <span>Open ({openCount})</span>
                        <span>{Math.round((openCount / totalCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: `${(openCount / totalCount) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                        <span>In Progress ({progressCount})</span>
                        <span>{Math.round((progressCount / totalCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: `${(progressCount / totalCount) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                        <span>Resolved ({resolvedCount})</span>
                        <span>{Math.round((resolvedCount / totalCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: `${(resolvedCount / totalCount) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Priority Breakdown Graph */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">By Severity & Priority</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                        <span>High / Urgent Priority ({urgentHighCount})</span>
                        <span>{Math.round((urgentHighCount / totalCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: `${(urgentHighCount / totalCount) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1.5 font-bold text-slate-700">
                        <span>Medium / Low Priority ({mediumLowCount})</span>
                        <span>{Math.round((mediumLowCount / totalCount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
                        <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: `${(mediumLowCount / totalCount) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-7 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Create New Ticket</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Subject *</label>
                <input
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Requester Name *</label>
                <input
                  required
                  value={formRequester}
                  onChange={(e) => setFormRequester(e.target.value)}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Authentication">Authentication</option>
                    <option value="Billing">Billing</option>
                    <option value="Account">Account</option>
                    <option value="Integration">Integration</option>
                    <option value="Reports">Reports</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Assignee</label>
                  <select
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Kavitha">Kavitha</option>
                    <option value="Karthik">Karthik</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-3 border border-slate-200 rounded-2xl bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition"
                >
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-7 sm:p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">Edit Ticket ({selectedTicket?.id})</h3>
            <form onSubmit={handleEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Subject</label>
                <input
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Authentication">Authentication</option>
                    <option value="Billing">Billing</option>
                    <option value="Account">Account</option>
                    <option value="Integration">Integration</option>
                    <option value="Reports">Reports</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Assignee</label>
                  <select
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 font-medium"
                  >
                    <option value="Kavitha">Kavitha</option>
                    <option value="Karthik">Karthik</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows="3"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl w-full text-sm outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-3 border border-slate-200 rounded-2xl bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition"
                >
                  Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4 border border-slate-200">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold shadow-inner">⚠️</div>
            <h3 className="font-extrabold text-lg text-slate-900">Delete Ticket {deleteId}?</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Are you sure you want to delete this support ticket? This action cannot be undone.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-3 border border-slate-200 rounded-2xl bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-3 bg-rose-600 text-white rounded-2xl text-xs font-bold hover:bg-rose-700 shadow-md shadow-rose-500/20 transition"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;