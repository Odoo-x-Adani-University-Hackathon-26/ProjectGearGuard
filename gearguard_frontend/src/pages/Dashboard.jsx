"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Plus,
  AlertTriangle,
  TrendingUp,
  Clock,
  BarChart3,
  Wrench,
  Users,
  Settings,
  RefreshCw,
  Filter,
  ChevronRight,
  Activity,
  Battery,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import dashboardService from "../services/dashboardService"
import maintenanceService from "../services/maintanenceService"
import { useNavigate } from "react-router-dom"

// Stat Card Component
const StatCard = ({ title, value, subtext, icon: Icon, color, trend, loading }) => {
  const getColorClasses = (color) => {
    const colors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        text: 'text-red-900',
        value: 'text-red-600',
        subtext: 'text-red-700'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        text: 'text-blue-900',
        value: 'text-blue-600',
        subtext: 'text-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        text: 'text-green-900',
        value: 'text-green-600',
        subtext: 'text-green-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        text: 'text-purple-900',
        value: 'text-purple-600',
        subtext: 'text-purple-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        text: 'text-orange-900',
        value: 'text-orange-600',
        subtext: 'text-orange-700'
      }
    };
    return colors[color] || colors.blue;
  };

  const colors = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-6 border-2 ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${colors.iconBg}`}>
            <Icon className={`w-6 h-6 ${colors.iconColor}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${colors.text}`}>{title}</p>
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 rounded mt-2 animate-pulse"></div>
            ) : (
              <p className={`text-3xl font-bold mt-2 ${colors.value}`}>{value}</p>
            )}
            {subtext && (
              <p className={`text-sm mt-1 ${colors.subtext}`}>{subtext}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Health Indicator Component
const HealthIndicator = ({ score, equipment }) => {
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    if (score >= 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getHealthText = (score) => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 30) return 'Poor';
    return 'Critical';
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${getHealthColor(score)}`}>
          <Battery className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{equipment.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-full rounded-full ${getHealthColor(score).split(' ')[0].replace('text-', 'bg-')}`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">{score}%</span>
          </div>
        </div>
      </div>
      <span className={`text-sm font-medium px-3 py-1 rounded-full ${getHealthColor(score)}`}>
        {getHealthText(score)}
      </span>
    </div>
  );
};

// Main Dashboard Component
const DashboardContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [equipmentHealth, setEquipmentHealth] = useState([]);
  const [technicianWorkload, setTechnicianWorkload] = useState(null);
  const [error, setError] = useState("");

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all dashboard data in parallel
      const [statsRes, quickStatsRes, healthRes, recentRes] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getQuickStats(),
        dashboardService.getEquipmentHealth(),
        maintenanceService.getAllRequests({ limit: 10, sort: '-createdAt' })
      ]);

      setStats(statsRes.data);
      setQuickStats(quickStatsRes.data);
      setEquipmentHealth(healthRes.data);
      setRecentRequests(recentRes.data || []);

      // Fetch technician workload if admin/manager
      if (user?.role === 'admin' || user?.role === 'manager') {
        try {
          const workloadRes = await dashboardService.getTechnicianWorkload();
          setTechnicianWorkload(workloadRes.data);
        } catch (workloadError) {
          console.log('Technician workload not available:', workloadError);
        }
      }

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const handleCreateRequest = () => {
    navigate('/maintenance');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    if (searchTerm.trim()) {
      navigate(`/maintenance?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const getStageBadge = (stage) => {
    const stageConfig = {
      'new': { color: 'bg-purple-100 text-purple-800', icon: <Plus className="w-3 h-3" /> },
      'assigned': { color: 'bg-blue-100 text-blue-800', icon: <Users className="w-3 h-3" /> },
      'in_progress': { color: 'bg-yellow-100 text-yellow-800', icon: <Activity className="w-3 h-3" /> },
      'completed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> }
    };

    const config = stageConfig[stage?.toLowerCase()] || stageConfig.new;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {stage || 'New'}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'low': { color: 'bg-green-100 text-green-800', label: 'Low' },
      'medium': { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      'high': { color: 'bg-orange-100 text-orange-800', label: 'High' },
      'critical': { color: 'bg-red-100 text-red-800', label: 'Critical' }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || 'User'}! Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboardData()}
            className="p-2 rounded-lg border hover:bg-white transition-colors"
            style={{ borderColor: '#E6E6EB', color: '#2F2F2F' }}
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleCreateRequest}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:shadow-lg"
            style={{ backgroundColor: '#7A4D6E' }}
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError("")}
            className="mt-2 text-sm text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search maintenance requests, equipment, or technicians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ borderColor: '#E6E6EB' }}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <Filter className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Critical Equipment"
          value={quickStats?.criticalEquipment || 0}
          subtext="Health < 30%"
          icon={AlertTriangle}
          color="red"
          loading={loading}
        />
        
        <StatCard
          title="Technician Load"
          value={`${quickStats?.technicianUtilization || 0}%`}
          subtext="Overall Utilization"
          icon={TrendingUp}
          color="blue"
          loading={loading}
        />
        
        <StatCard
          title="Open Requests"
          value={quickStats?.openRequests || 0}
          subtext={`${quickStats?.overdueRequests || 0} Overdue`}
          icon={Clock}
          color="green"
          loading={loading}
        />
        
        <StatCard
          title="Total Equipment"
          value={quickStats?.totalEquipment || 0}
          subtext={`${quickStats?.totalTechnicians || 0} Technicians`}
          icon={Settings}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Maintenance Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#E6E6EB' }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E6E6EB' }}>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Maintenance Activity
              </h3>
              <button 
                onClick={() => navigate('/maintenance')}
                className="text-sm font-medium flex items-center gap-1 hover:text-purple-700 transition-colors" 
                style={{ color: '#7A4D6E' }}
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="p-8 text-center">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent maintenance activity</p>
                <button
                  onClick={handleCreateRequest}
                  className="mt-4 px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: '#7A4D6E' }}
                >
                  Create First Request
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b" style={{ borderColor: '#E6E6EB' }}>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Technician</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stage</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((item) => (
                      <tr 
                        key={item._id} 
                        className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ borderColor: '#E6E6EB' }}
                        onClick={() => navigate(`/maintenance/${item._id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {item.subject || 'No subject'}
                            </span>
                            {item.priority && getPriorityBadge(item.priority)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.createdBy?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.technician?.name || 'Not Assigned'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.equipment?.category || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4">
                          {getStageBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {item.notes?.length > 0 ? item.notes[item.notes.length - 1].content : 'No comments'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Health & Quick Stats */}
        <div className="space-y-6">
          {/* Equipment Health */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E6E6EB' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Equipment Health</h3>
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {equipmentHealth.length} Critical
              </span>
            </div>

            <div className="space-y-3">
              {equipmentHealth.length === 0 ? (
                <div className="text-center py-4">
                  <Battery className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-gray-600">All equipment is healthy!</p>
                </div>
              ) : (
                equipmentHealth.slice(0, 5).map((equipment) => (
                  <HealthIndicator
                    key={equipment._id}
                    score={equipment.healthScore || 0}
                    equipment={equipment}
                  />
                ))
              )}
            </div>

            {equipmentHealth.length > 5 && (
              <button 
                onClick={() => navigate('/equipment')}
                className="w-full mt-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                style={{ borderColor: '#E6E6EB', color: '#7A4D6E' }}
              >
                View All Equipment
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Technician Workload (Admin/Manager only) */}
          {(user?.role === 'admin' || user?.role === 'manager') && technicianWorkload && (
            <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E6E6EB' }}>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Technician Workload</h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overall Utilization</span>
                  <span className="text-lg font-bold" style={{ color: '#7A4D6E' }}>
                    {technicianWorkload.overallUtilization}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${technicianWorkload.overallUtilization}%`,
                      backgroundColor: technicianWorkload.overallUtilization > 80 ? '#C62828' : 
                                     technicianWorkload.overallUtilization > 60 ? '#E65100' : '#2E7D32'
                    }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                {technicianWorkload.technicians && technicianWorkload.technicians.slice(0, 3).map((tech) => (
                  <div key={tech._id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E6E6EB' }}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{tech.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">{tech.activeTasks || 0} active</span>
                        <span className="text-xs text-gray-500">{tech.overdueTasks || 0} overdue</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tech.utilization > 80 ? 'bg-red-100 text-red-800' :
                      tech.utilization > 60 ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {tech.utilization || 0}%
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/teams')}
                className="w-full mt-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                style={{ borderColor: '#E6E6EB', color: '#7A4D6E' }}
              >
                View All Technicians
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E6E6EB' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/maintenance')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Wrench className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">Maintenance Requests</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => navigate('/equipment')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Equipment</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => navigate('/calendar')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">Calendar</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              
              <button 
                onClick={() => navigate('/teams')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-900">Teams</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;