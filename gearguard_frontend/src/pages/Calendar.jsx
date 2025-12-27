"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Wrench, Search, Filter, 
  AlertCircle, CheckCircle, Settings, Droplets, Plus, X, Clock,
  RefreshCw, Eye, Edit, Trash2, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import calendarService from '../services/calenderService';
import equipmentService from '../services/equipmentService';
import teamService from '../services/teamService';
import maintenanceService from '../services/maintanenceService';

// Schedule Maintenance Modal
const ScheduleMaintenanceModal = ({ onClose, equipmentList, teamList, onSchedule }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipment: '',
    team: '',
    requestType: 'preventive',
    priority: 'medium',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedHours: 2,
    scheduleType: 'one-time',
    isRecurring: false,
    recurrencePattern: {}
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.subject || !formData.equipment || !formData.team || !formData.scheduledDate) {
        throw new Error('Please fill in all required fields');
      }

      await onSchedule(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule maintenance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E6E6EB' }}>
          <h2 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>Schedule Preventive Maintenance</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={24} style={{ color: '#2F2F2F' }} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Maintenance task description"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Scheduled Date *</label>
                <input
                  type="date"
                  name="scheduledDate"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Equipment & Team - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Equipment *</label>
                <select
                  name="equipment"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                  value={formData.equipment}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipmentList.map(eq => (
                    <option key={eq._id} value={eq._id}>
                      {eq.name} {eq.serialNumber ? `(${eq.serialNumber})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Team *</label>
                <select
                  name="team"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                  value={formData.team}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Team</option>
                  {teamList.map(team => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority & Recurrence - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Priority</label>
                <select
                  name="priority"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Schedule Type</label>
                <select
                  name="scheduleType"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                  value={formData.scheduleType}
                  onChange={handleChange}
                >
                  <option value="one-time">One-time</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Description</label>
              <textarea
                name="description"
                placeholder="Detailed description of the maintenance task..."
                className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>Estimated Hours</label>
              <input
                type="number"
                name="estimatedHours"
                min="0.5"
                step="0.5"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
                value={formData.estimatedHours}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t" style={{ borderColor: '#E6E6EB' }}>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border font-medium"
              style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: '#7A4D6E' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar size={20} />
                  Schedule Maintenance
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Details Modal
const TaskDetailsModal = ({ task, onClose, onAction }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: { bg: '#FDECEA', text: '#C62828', label: 'High' },
      critical: { bg: '#FDECEA', text: '#C62828', label: 'Critical' },
      medium: { bg: '#FFF4E5', text: '#E65100', label: 'Medium' },
      low: { bg: '#E6F4EA', text: '#2E7D32', label: 'Low' }
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: { bg: '#F6F2F5', text: '#7A4D6E', label: 'New' },
      scheduled: { bg: '#F6F2F5', text: '#7A4D6E', label: 'Scheduled' },
      assigned: { bg: '#E3F2FD', text: '#1976D2', label: 'Assigned' },
      in_progress: { bg: '#FFF4E5', text: '#E65100', label: 'In Progress' },
      completed: { bg: '#E6F4EA', text: '#2E7D32', label: 'Completed' }
    };
    return colors[status] || colors.new;
  };

  const priority = getPriorityColor(task.priority);
  const status = getStatusColor(task.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E6E6EB' }}>
          <h2 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>Task Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={24} style={{ color: '#2F2F2F' }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title and Status */}
            <div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#2F2F2F' }}>{task.title}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium" 
                  style={{ backgroundColor: priority.bg, color: priority.text }}>
                  {priority.label} Priority
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" 
                  style={{ backgroundColor: status.bg, color: status.text }}>
                  {status.label}
                </span>
                {task.isOverdue && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Scheduled Date</p>
                <p className="font-medium" style={{ color: '#2F2F2F' }}>
                  <Calendar className="inline w-4 h-4 mr-2" />
                  {formatDate(task.date)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Equipment</p>
                <p className="font-medium" style={{ color: '#2F2F2F' }}>
                  <Settings className="inline w-4 h-4 mr-2" />
                  {task.equipment?.name || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned Team</p>
                <p className="font-medium" style={{ color: '#2F2F2F' }}>
                  <Wrench className="inline w-4 h-4 mr-2" />
                  {task.team?.name || 'Not Assigned'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Request Type</p>
                <p className="font-medium" style={{ color: '#2F2F2F' }}>
                  <Wrench className="inline w-4 h-4 mr-2" />
                  {task.requestType ? task.requestType.charAt(0).toUpperCase() + task.requestType.slice(1) : 'Preventive'}
                </p>
              </div>
            </div>

            {/* Description */}
            {task.description && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-700">{task.description}</p>
              </div>
            )}

            {/* Notes */}
            {task.notes && task.notes.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <div className="space-y-2">
                  {task.notes.map((note, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50">
                      <p className="text-sm text-gray-700">{note.content}</p>
                      {note.createdBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          By {note.createdBy.name} • {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t" style={{ borderColor: '#E6E6EB' }}>
          <div className="flex gap-4">
            <button
              onClick={() => onAction(task, 'complete')}
              className="flex-1 px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#2E7D32' }}
            >
              Mark as Complete
            </button>
            <button
              onClick={() => onAction(task, 'reschedule')}
              className="flex-1 px-6 py-3 rounded-lg border font-medium"
              style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
            >
              Reschedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to check if a day is today
const isToday = (currentDate, day) => {
  const today = new Date();
  return (
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    day === today.getDate()
  );
};

// Helper function to remove duplicate tasks by ID
const removeDuplicateTasks = (tasks) => {
  const uniqueTasks = [];
  const taskIds = new Set();
  
  tasks.forEach(task => {
    if (!taskIds.has(task._id)) {
      taskIds.add(task._id);
      uniqueTasks.push(task);
    }
  });
  
  return uniqueTasks;
};

// Main Calendar Component
const PreventiveMaintenanceCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [stats, setStats] = useState(null);
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Fetch calendar data
      const scheduleRes = await calendarService.getMaintenanceSchedule(year, month);
      setCalendarData(scheduleRes.data || {});

      // Fetch upcoming tasks with date information
      const tasksRes = await calendarService.getUpcomingTasks(30);
      const formattedTasks = (tasksRes.data || []).map(task => ({
        ...task,
        date: task.scheduledDate || task.date || new Date().toISOString(),
        type: task.requestType || 'preventive',
        title: task.subject || 'Untitled Task',
        priority: task.priority || 'medium',
        status: task.status || 'scheduled'
      }));
      setUpcomingTasks(formattedTasks);

      // Fetch equipment and teams for dropdowns
      const [equipmentRes, teamsRes, statsRes] = await Promise.all([
        equipmentService.getAllEquipment({ limit: 100 }),
        teamService.getAllTeams({ limit: 100 }),
        calendarService.getMaintenanceStats()
      ]);

      setEquipmentList(equipmentRes.data || []);
      setTeamList(teamsRes.data || []);
      setStats(statsRes.data || {});

    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
      setError(err.message || 'Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleScheduleMaintenance = async (scheduleData) => {
    try {
      await calendarService.scheduleMaintenance(scheduleData);
      fetchData(); // Refresh data
    } catch (err) {
      throw new Error(err.message || 'Failed to schedule maintenance');
    }
  };

  const handleTaskAction = async (task, action) => {
    try {
      switch (action) {
        case 'view':
          // Fetch full task details
          const taskDetails = await maintenanceService.getRequestById(task._id);
          setSelectedTask(taskDetails.data);
          break;
        case 'complete':
          if (window.confirm('Mark this task as completed?')) {
            await calendarService.markAsCompleted(task._id, {
              actualHours: task.estimatedHours || 2,
              notes: 'Completed via calendar'
            });
            fetchData();
          }
          break;
        case 'reschedule':
          const newDate = prompt('Enter new date (YYYY-MM-DD):');
          if (newDate) {
            await calendarService.rescheduleTask(task._id, newDate);
            fetchData();
          }
          break;
      }
    } catch (err) {
      console.error('Task action failed:', err);
      setError(err.message || 'Action failed');
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getMonthYearString = () => {
    return currentDate.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Create array of days
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'preventive': return <Wrench className="w-3 h-3" />;
      case 'corrective': return <AlertCircle className="w-3 h-3" />;
      case 'inspection': return <Search className="w-3 h-3" />;
      case 'calibration': return <Settings className="w-3 h-3" />;
      case 'lubrication': return <Droplets className="w-3 h-3" />;
      default: return <Wrench className="w-3 h-3" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: { bg: '#FDECEA', text: '#C62828', label: 'High' },
      critical: { bg: '#FDECEA', text: '#C62828', label: 'Critical' },
      medium: { bg: '#FFF4E5', text: '#E65100', label: 'Medium' },
      low: { bg: '#E6F4EA', text: '#2E7D32', label: 'Low' }
    };
    const color = colors[priority] || colors.medium;
    
    return (
      <span 
        className="text-xs px-2 py-1 rounded-full font-medium"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {color.label}
      </span>
    );
  };

  if (loading && !Object.keys(calendarData).length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading calendar...</span>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth();

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#F6F2F5' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#2F2F2F' }}>
                Preventive Maintenance Calendar
              </h1>
              <p className="text-gray-600">
                Schedule and track all preventive maintenance activities
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fetchData()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm transition-shadow"
                style={{ 
                  borderColor: '#E6E6EB',
                  backgroundColor: 'white',
                  color: '#2F2F2F'
                }}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              {['admin', 'manager'].includes(user?.role) && (
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-sm transition-shadow"
                  style={{ 
                    backgroundColor: '#7A4D6E',
                    color: 'white'
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Schedule Maintenance</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6EB' }}>
                <p className="text-sm text-gray-600">Total Scheduled</p>
                <p className="text-2xl font-bold mt-2" style={{ color: '#2F2F2F' }}>
                  {stats.totalScheduled || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6EB' }}>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold mt-2" style={{ color: '#1976D2' }}>
                  {stats.upcomingCount || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6EB' }}>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold mt-2" style={{ color: '#C62828' }}>
                  {stats.overdueCount || 0}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E6EB' }}>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold mt-2" style={{ color: '#2E7D32' }}>
                  {(stats.monthlyStats?.find(s => s._id === 'completed')?.count) || 0}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Calendar Header */}
          <div className="bg-white rounded-xl p-4 md:p-6 mb-6 border"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <h2 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>
                  {getMonthYearString()}
                </h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg hover:bg-gray-50"
                    style={{ color: '#7A4D6E' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg hover:bg-gray-50"
                    style={{ color: '#7A4D6E' }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E6F4EA' }}></div>
                  <span className="text-sm" style={{ color: '#2F2F2F' }}>Preventive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E3F2FD' }}></div>
                  <span className="text-sm" style={{ color: '#2F2F2F' }}>Corrective</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FDECEA' }}></div>
                  <span className="text-sm" style={{ color: '#2F2F2F' }}>High Priority</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekDays.map((day) => (
                    <div 
                      key={day}
                      className="text-center py-3 font-medium text-sm"
                      style={{ 
                        color: '#9B6B8A',
                        borderBottom: '2px solid #E6E6EB'
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days - FIXED VERSION */}
                <div className="grid grid-cols-7 gap-1">
                  {daysInMonth.map((day) => {
                    // Get events ONLY from calendarData (this is the main source)
                    const events = calendarData[day] || [];
                    
                    // Remove duplicate tasks by ID to ensure each task appears only once
                    const uniqueEvents = removeDuplicateTasks(events);
                    
                    const hasEvents = uniqueEvents.length > 0;
                    
                    return (
                      <motion.div
                        key={day}
                        whileHover={{ scale: 1.02 }}
                        className={`min-h-[120px] p-2 border rounded-lg transition-all ${
                          hasEvents ? 'cursor-pointer hover:shadow-md' : ''
                        }`}
                        style={{ 
                          borderColor: hasEvents ? '#7A4D6E' : '#E6E6EB',
                          backgroundColor: hasEvents ? '#F6F2F5' : '#FFFFFF',
                          borderWidth: hasEvents ? '2px' : '1px'
                        }}
                        onClick={() => {
                          if (hasEvents && uniqueEvents[0]) {
                            handleTaskAction(uniqueEvents[0], 'view');
                          }
                        }}
                      >
                        {/* Date Header */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span 
                              className={`text-sm font-medium ${
                                hasEvents ? 'font-bold' : ''
                              }`}
                              style={{ 
                                color: hasEvents ? '#7A4D6E' : '#2F2F2F'
                              }}
                            >
                              {day}
                            </span>
                            
                            {/* Today indicator */}
                            {isToday(currentDate, day) && (
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                          
                          {/* Event indicators */}
                          {hasEvents && (
                            <div className="flex items-center gap-1">
                              <div className="text-xs text-gray-500">
                                {uniqueEvents.length}
                              </div>
                              <div className="flex gap-1">
                                {uniqueEvents.slice(0, 3).map((event, idx) => {
                                  const priority = event.priority || 'medium';
                                  const requestType = event.requestType || 'preventive';
                                  
                                  // Determine color based on request type and priority
                                  let dotColor = '#2E7D32'; // Default green for preventive
                                  if (requestType === 'corrective') dotColor = '#1976D2'; // Blue for corrective
                                  if (priority === 'high' || priority === 'critical') dotColor = '#C62828'; // Red for high priority
                                  
                                  return (
                                    <div
                                      key={idx}
                                      className="w-2 h-2 rounded-full"
                                      style={{ 
                                        backgroundColor: dotColor
                                      }}
                                      title={`${event.title} (${requestType} - ${priority} priority)`}
                                    ></div>
                                  );
                                })}
                                {uniqueEvents.length > 3 && (
                                  <span className="text-xs text-gray-500">+{uniqueEvents.length - 3}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Events Display - SHOW ONLY UNIQUE EVENTS */}
                        <div className="space-y-1 max-h-[80px] overflow-y-auto">
                          {uniqueEvents.slice(0, 3).map((event, idx) => {
                            const priority = event.priority || 'medium';
                            const requestType = event.requestType || 'preventive';
                            const isOverdue = event.isOverdue || event.status === 'overdue';
                            
                            // Determine colors based on request type and priority
                            let colors = {
                              bg: '#E6F4EA', // Light green for preventive
                              text: '#2E7D32', // Green text
                              border: '#A7D7A4' // Light green border
                            };
                            
                            if (requestType === 'corrective') {
                              colors = {
                                bg: '#E3F2FD', // Light blue for corrective
                                text: '#1976D2', // Blue text
                                border: '#90CAF9' // Light blue border
                              };
                            }
                            
                            // Priority overrides
                            if (priority === 'high' || priority === 'critical') {
                              colors = {
                                bg: '#FDECEA', // Light red
                                text: '#C62828', // Red text
                                border: '#F5C2C7' // Light red border
                              };
                            } else if (priority === 'medium') {
                              colors = {
                                bg: '#FFF4E5', // Light orange
                                text: '#E65100', // Orange text
                                border: '#FFD8A6' // Light orange border
                              };
                            }
                            
                            // Overdue override
                            if (isOverdue) {
                              colors = {
                                bg: '#FDECEA', // Light red
                                text: '#C62828', // Red text
                                border: '#F5C2C7' // Light red border
                              };
                            }
                            
                            // Completed override
                            if (event.status === 'completed') {
                              colors = {
                                bg: '#F3F4F6', // Light gray
                                text: '#6B7280', // Gray text
                                border: '#D1D5DB' // Gray border
                              };
                            }

                            return (
                              <motion.div
                                key={event._id || idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-xs px-2 py-1.5 rounded flex items-center gap-1 border"
                                style={{ 
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                  borderColor: colors.border
                                }}
                                title={`${event.title} - ${event.description || 'No description'} (${requestType}, ${priority} priority)`}
                              >
                                {getEventIcon(requestType)}
                                <span className="font-medium truncate">
                                  {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
                                </span>
                                {isOverdue && (
                                  <AlertCircle className="w-3 h-3 ml-auto" />
                                )}
                              </motion.div>
                            );
                          })}
                          
                          {uniqueEvents.length === 0 && (
                            <div className="text-center py-4">
                              <p className="text-xs text-gray-400">No tasks</p>
                            </div>
                          )}
                          
                          {uniqueEvents.length > 3 && (
                            <div className="text-xs text-center text-gray-500 pt-1">
                              +{uniqueEvents.length - 3} more
                            </div>
                          )}
                        </div>
                        
                        {/* Status summary */}
                        {hasEvents && (
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              {uniqueEvents.some(e => e.priority === 'critical' || e.priority === 'high') && (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                              {uniqueEvents.some(e => e.isOverdue || e.status === 'overdue') && (
                                <span className="text-red-500 font-medium">Overdue</span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-500">
                                {uniqueEvents.length} task{uniqueEvents.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 border"
              style={{ borderColor: '#E6E6EB' }}
            >
              <h3 className="text-lg font-bold mb-6" style={{ color: '#2F2F2F' }}>
                Maintenance Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#E6F4EA' }}>
                    <Wrench className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Preventive Maintenance</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Routine equipment checks and servicing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#E3F2FD' }}>
                    <AlertCircle className="w-5 h-5" style={{ color: '#1976D2' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Corrective Maintenance</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Fix equipment failures and issues</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#FFF4E5' }}>
                    <Search className="w-5 h-5" style={{ color: '#E65100' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Inspection</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Visual and functional assessment</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#FDECEA' }}>
                    <Droplets className="w-5 h-5" style={{ color: '#C62828' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Lubrication</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Moving parts maintenance and lubrication</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl p-6 border h-fit"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: '#2F2F2F' }}>
                Upcoming Tasks (Next 30 Days)
              </h3>
              <span className="text-sm px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: '#E6F4EA',
                  color: '#2E7D32'
                }}
              >
                {upcomingTasks.length} tasks
              </span>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: '#9B6B8A' }} />
                  <p className="text-gray-600">No upcoming maintenance tasks</p>
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <motion.div 
                    key={task._id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: task.priority === 'high' || task.priority === 'critical' ? '#FFF8F8' : '#FFFFFF'
                    }}
                    onClick={() => handleTaskAction(task, 'view')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getEventIcon(task.type)}
                        <h4 className="font-medium" style={{ color: '#2F2F2F' }}>
                          {task.title}
                        </h4>
                      </div>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" style={{ color: '#7A4D6E' }} />
                        <span className="text-sm" style={{ color: '#9B6B8A' }}>
                          {new Date(task.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4" style={{ color: '#2E7D32' }} />
                        ) : (
                          <Clock className="w-4 h-4" style={{ color: '#E65100' }} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {upcomingTasks.length > 0 && (
              <button 
                onClick={() => {/* Navigate to all tasks page */}}
                className="w-full mt-6 py-3 rounded-lg border hover:shadow-sm transition-shadow flex items-center justify-center gap-2"
                style={{ 
                  borderColor: '#7A4D6E',
                  color: '#7A4D6E'
                }}
              >
                <span>View All Tasks</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showScheduleModal && (
          <ScheduleMaintenanceModal
            onClose={() => setShowScheduleModal(false)}
            equipmentList={equipmentList}
            teamList={teamList}
            onSchedule={handleScheduleMaintenance}
          />
        )}
        
        {selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onAction={handleTaskAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreventiveMaintenanceCalendar;