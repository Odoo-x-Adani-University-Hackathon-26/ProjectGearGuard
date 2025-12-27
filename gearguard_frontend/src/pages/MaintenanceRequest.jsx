"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Filter, X, Calendar, ChevronDown, MoreVertical, Eye, Edit, Trash2, RefreshCw } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import maintenanceService from "../services/maintanenceService"
import equipmentService from "../services/equipmentService"
import teamService from "../services/teamService"
import departmentService from "../services/departmentService"

// Filter Modal Component
const FilterModal = ({ onClose, filters, setFilters, applyFilters }) => {
  const statusOptions = [
    { value: "new", label: "New", color: "#7A4D6E" },
    { value: "assigned", label: "Assigned", color: "#1976D2" },
    { value: "in_progress", label: "In Progress", color: "#C62828" },
    { value: "completed", label: "Completed", color: "#2E7D32" },
    { value: "cancelled", label: "Cancelled", color: "#757575" },
    { value: "scrap", label: "Scrap", color: "#9B9B9B" }
  ]

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ]

  const requestTypeOptions = [
    { value: "corrective", label: "Corrective" },
    { value: "preventive", label: "Preventive" }
  ]

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? null : status
    }))
  }

  const handlePriorityChange = (priority) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority === priority ? null : priority
    }))
  }

  const handleRequestTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      requestType: prev.requestType === type ? null : type
    }))
  }

  const handleDateChange = (e) => {
    setFilters(prev => ({
      ...prev,
      startDate: e.target.value
    }))
  }

  const handleReset = () => {
    setFilters({
      status: null,
      priority: null,
      requestType: null,
      startDate: "",
      endDate: ""
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: "#2F2F2F" }}>
            Filter Requests
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" style={{ color: "#2F2F2F" }}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${filters.status === status.value ? 'ring-2 ring-offset-1' : ''}`}
                  style={{
                    backgroundColor: filters.status === status.value ? status.color + '20' : '#F6F2F5',
                    color: filters.status === status.value ? status.color : '#2F2F2F',
                    border: `1px solid ${filters.status === status.value ? status.color : '#E6E6EB'}`
                  }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Priority
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorityOptions.map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => handlePriorityChange(priority.value)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${filters.priority === priority.value ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                  style={{
                    backgroundColor: filters.priority === priority.value ? '#E3F2FD' : '#F6F2F5',
                    color: filters.priority === priority.value ? '#1976D2' : '#2F2F2F',
                    border: `1px solid ${filters.priority === priority.value ? '#1976D2' : '#E6E6EB'}`
                  }}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Request Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Request Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {requestTypeOptions.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleRequestTypeChange(type.value)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${filters.requestType === type.value ? 'ring-2 ring-offset-1 ring-purple-500' : ''}`}
                  style={{
                    backgroundColor: filters.requestType === type.value ? '#F3E5F5' : '#F6F2F5',
                    color: filters.requestType === type.value ? '#7B1FA2' : '#2F2F2F',
                    border: `1px solid ${filters.requestType === type.value ? '#7B1FA2' : '#E6E6EB'}`
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              From Date
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              value={filters.startDate}
              onChange={handleDateChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 px-4 py-2 rounded-lg border font-medium transition-all"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Reset
            </button>
            <button
              onClick={() => {
                applyFilters()
                onClose()
              }}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all"
              style={{ backgroundColor: "#7A4D6E" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9B6B8A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7A4D6E")}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
// New Request Modal Component with 2-column layout
const NewRequestModal = ({ onClose, equipmentList, teamList, onCreate }) => {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    equipment: "",
    team: "",
    requestType: "corrective",
    priority: "medium",
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedHours: 1,
    isOverdue: false
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.subject || !formData.description || !formData.equipment || !formData.team) {
        throw new Error("Please fill in all required fields")
      }

      await onCreate(formData)
      onClose()
    } catch (err) {
      setError(err.message || "Failed to create request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#E6E6EB" }}>
          <h2 className="text-xl font-bold" style={{ color: "#2F2F2F" }}>
            New Maintenance Request
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: "#2F2F2F" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Subject (Full Width) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Brief description of the issue..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  borderColor: "#E6E6EB", 
                  color: "#2F2F2F",
                  focusRingColor: "rgba(122, 77, 110, 0.3)"
                }}
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 2: Description (Full Width) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                Detailed Description *
              </label>
              <textarea
                name="description"
                placeholder="Provide detailed information about the issue, symptoms, and any observations..."
                className="w-full px-3 py-2 border rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  borderColor: "#E6E6EB", 
                  color: "#2F2F2F",
                  focusRingColor: "rgba(122, 77, 110, 0.3)"
                }}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Row 3: Equipment & Team (Two Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Equipment *
                </label>
                <select
                  name="equipment"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    borderColor: "#E6E6EB", 
                    color: "#2F2F2F",
                    focusRingColor: "rgba(122, 77, 110, 0.3)"
                  }}
                  value={formData.equipment}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipmentList.map((eq) => (
                    <option key={eq._id} value={eq._id}>
                      {eq.name} {eq.serialNumber ? `(${eq.serialNumber})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Maintenance Team *
                </label>
                <select
                  name="team"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    borderColor: "#E6E6EB", 
                    color: "#2F2F2F",
                    focusRingColor: "rgba(122, 77, 110, 0.3)"
                  }}
                  value={formData.team}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Team</option>
                  {teamList.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Request Type & Priority (Two Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request Type */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Request Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="requestType"
                      value="corrective"
                      checked={formData.requestType === 'corrective'}
                      onChange={handleChange}
                      className="w-4 h-4"
                      style={{ accentColor: "#7A4D6E" }}
                    />
                    <span style={{ color: "#2F2F2F" }}>Corrective</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="requestType"
                      value="preventive"
                      checked={formData.requestType === 'preventive'}
                      onChange={handleChange}
                      className="w-4 h-4"
                      style={{ accentColor: "#7A4D6E" }}
                    />
                    <span style={{ color: "#2F2F2F" }}>Preventive</span>
                  </label>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Priority
                </label>
                <select
                  name="priority"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ 
                    borderColor: "#E6E6EB", 
                    color: "#2F2F2F",
                    focusRingColor: "rgba(122, 77, 110, 0.3)"
                  }}
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Row 5: Scheduled Date & Estimated Hours (Two Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Scheduled Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: "#9B6B8A" }} />
                  <input
                    type="date"
                    name="scheduledDate"
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      borderColor: "#E6E6EB", 
                      color: "#2F2F2F",
                      focusRingColor: "rgba(122, 77, 110, 0.3)"
                    }}
                    value={formData.scheduledDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Estimated Hours
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="estimatedHours"
                    min="0.5"
                    max="100"
                    step="0.5"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      borderColor: "#E6E6EB", 
                      color: "#2F2F2F",
                      focusRingColor: "rgba(122, 77, 110, 0.3)"
                    }}
                    value={formData.estimatedHours}
                    onChange={handleChange}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    hours
                  </span>
                </div>
              </div>
            </div>

            {/* Row 6: Urgent Flag */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors" 
                style={{ borderColor: formData.isOverdue ? "#C62828" : "#E6E6EB" }}>
                <input
                  type="checkbox"
                  name="isOverdue"
                  checked={formData.isOverdue}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                  style={{ accentColor: "#C62828" }}
                />
                <div>
                  <span className="font-medium" style={{ color: formData.isOverdue ? "#C62828" : "#2F2F2F" }}>
                    Mark as Urgent
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    This request requires immediate attention and will be prioritized accordingly.
                  </p>
                </div>
              </label>
            </div>

            {/* Additional Notes (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Any additional information, safety precautions, or special instructions..."
                className="w-full px-3 py-2 border rounded-lg min-h-[80px] focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                  borderColor: "#E6E6EB", 
                  color: "#2F2F2F",
                  focusRingColor: "rgba(122, 77, 110, 0.3)"
                }}
              />
            </div>
          </form>
        </div>

        {/* Footer with Action Buttons - Fixed */}
        <div className="p-6 border-t" style={{ borderColor: "#E6E6EB" }}>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border font-medium transition-all duration-200"
              style={{ 
                borderColor: "#E6E6EB", 
                color: "#2F2F2F",
                backgroundColor: "transparent"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: loading ? "#9B6B8A" : "#7A4D6E",
                opacity: loading ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#9B6B8A"
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#7A4D6E"
                }
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Request...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Create Maintenance Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      "new": { color: "#7A4D6E", bgColor: "rgba(122, 77, 110, 0.1)", label: "New" },
      "assigned": { color: "#1976D2", bgColor: "rgba(25, 118, 210, 0.1)", label: "Assigned" },
      "in_progress": { color: "#C62828", bgColor: "rgba(198, 40, 40, 0.1)", label: "In Progress" },
      "completed": { color: "#2E7D32", bgColor: "rgba(46, 125, 50, 0.1)", label: "Completed" },
      "cancelled": { color: "#757575", bgColor: "rgba(117, 117, 117, 0.1)", label: "Cancelled" },
      "scrap": { color: "#9B9B9B", bgColor: "rgba(155, 155, 155, 0.1)", label: "Scrap" }
    }
    return configs[status] || configs.new
  }

  const config = getStatusConfig(status)

  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  )
}

// Priority Badge Component
const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    const configs = {
      "low": { color: "#2E7D32", bgColor: "rgba(46, 125, 50, 0.1)", label: "Low" },
      "medium": { color: "#F57C00", bgColor: "rgba(245, 124, 0, 0.1)", label: "Medium" },
      "high": { color: "#C62828", bgColor: "rgba(198, 40, 40, 0.1)", label: "High" },
      "critical": { color: "#7B1FA2", bgColor: "rgba(123, 31, 162, 0.1)", label: "Critical" }
    }
    return configs[priority] || configs.medium
  }

  const config = getPriorityConfig(priority)

  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  )
}

// Action Menu Component
const ActionMenu = ({ request, onAction }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (action) => {
    onAction(request, action)
    setIsOpen(false)
  }

  const getAvailableActions = () => {
    const baseActions = [
      { id: 'view', label: 'View Details', icon: Eye, color: '#2F2F2F' }
    ]

    if (['admin', 'manager'].includes(request.userRole)) {
      baseActions.push(
        { id: 'edit', label: 'Edit', icon: Edit, color: '#2F2F2F' }
      )
    }

    if (['admin', 'manager', 'technician'].includes(request.userRole)) {
      if (request.status === 'new') {
        baseActions.push(
          { id: 'assign', label: 'Assign Technician', icon: Edit, color: '#2F2F2F' }
        )
      }
      if (['assigned', 'in_progress'].includes(request.status)) {
        baseActions.push(
          { id: 'update_status', label: 'Update Status', icon: Edit, color: '#2F2F2F' },
          { id: 'add_note', label: 'Add Note', icon: Edit, color: '#2F2F2F' }
        )
      }
    }

    if (['admin'].includes(request.userRole)) {
      baseActions.push(
        { id: 'delete', label: 'Delete', icon: Trash2, color: '#C62828' }
      )
    }

    return baseActions
  }

  const actions = getAvailableActions()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded hover:bg-gray-100"
        style={{ color: "#2F2F2F" }}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-48 rounded-lg shadow-lg z-10"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E6E6EB", borderWidth: "1px" }}
        >
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 ${
                index === 0 ? 'rounded-t-lg' : 
                index === actions.length - 1 ? 'rounded-b-lg' : ''
              }`}
              style={{ color: action.color }}
            >
              <action.icon size={16} />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Maintenance Requests Component
const MaintenanceRequests = () => {
  const { user } = useAuth()
  const [showFilter, setShowFilter] = useState(false)
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState([])
  const [stats, setStats] = useState(null)
  const [equipmentList, setEquipmentList] = useState([])
  const [teamList, setTeamList] = useState([])
  const [error, setError] = useState("")
  
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    requestType: null,
    startDate: "",
    endDate: "",
    page: 1,
    limit: 20
  })

  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch based on user role
      let requestsData
      if (user?.role === 'employee') {
        requestsData = await maintenanceService.getMyRequests()
      } else if (user?.role === 'technician') {
        requestsData = await maintenanceService.getTeamRequests()
      } else {
        // Build query params from filters
        const params = {}
        if (filters.status) params.status = filters.status
        if (filters.priority) params.priority = filters.priority
        if (filters.requestType) params.requestType = filters.requestType
        if (filters.startDate) params.startDate = filters.startDate
        if (filters.endDate) params.endDate = filters.endDate
        params.page = filters.page
        params.limit = filters.limit

        requestsData = await maintenanceService.getAllRequests(params)
      }

      setRequests(requestsData.data)

      // Fetch stats
      const statsData = await maintenanceService.getRequestsStats()
      setStats(statsData.data)

      // Fetch equipment and teams for dropdowns
      if (user?.role !== 'employee') {
        const [equipmentRes, teamsRes] = await Promise.all([
          equipmentService.getAllEquipment({ limit: 100 }),
          teamService.getAllTeams({ limit: 100 })
        ])
        setEquipmentList(equipmentRes.data)
        setTeamList(teamsRes.data)
      }

    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [user, filters])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, fetchData])

  const handleCreateRequest = async (requestData) => {
    try {
      await maintenanceService.createRequest(requestData)
      fetchData() // Refresh the list
    } catch (err) {
      throw new Error(err.message || 'Failed to create request')
    }
  }

  const handleAction = async (request, action) => {
    try {
      switch (action) {
        case 'view':
          // Navigate to request details page
          console.log('View request:', request._id)
          break
        case 'edit':
          // Open edit modal
          console.log('Edit request:', request._id)
          break
        case 'assign':
          // Open assign technician modal
          console.log('Assign technician to request:', request._id)
          break
        case 'update_status':
          // Open update status modal
          console.log('Update status of request:', request._id)
          break
        case 'add_note':
          // Open add note modal
          console.log('Add note to request:', request._id)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this request?')) {
            await maintenanceService.deleteRequest(request._id)
            fetchData() // Refresh the list
          }
          break
      }
    } catch (err) {
      console.error('Action failed:', err)
      setError(err.message || 'Action failed')
    }
  }

  const applyFilters = () => {
    setFilters(prev => ({ ...prev, page: 1 }))
    fetchData()
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Calculate status counts from stats
  const getStatusCounts = () => {
    if (!stats?.byStatus) return []
    
    const statusConfigs = {
      "new": { label: "New", color: "#7A4D6E" },
      "assigned": { label: "Assigned", color: "#1976D2" },
      "in_progress": { label: "In Progress", color: "#C62828" },
      "completed": { label: "Completed", color: "#2E7D32" },
      "cancelled": { label: "Cancelled", color: "#757575" },
      "scrap": { label: "Scrap", color: "#9B9B9B" }
    }

    return stats.byStatus.map(item => ({
      id: item.status,
      label: statusConfigs[item.status]?.label || item.status,
      color: statusConfigs[item.status]?.color || "#7A4D6E",
      count: item.count
    }))
  }

  if (loading && !requests.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading maintenance requests...</span>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: "#F6F2F5" }} className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#2F2F2F" }}>
              Maintenance Requests
            </h1>
            {stats && (
              <p className="text-gray-600 mt-2">
                Total: {stats.totalRequests} requests • {stats.totalHours || 0} hours spent • ${stats.totalCost || 0} cost
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => fetchData()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all"
              style={{
                borderColor: "#E6E6EB",
                color: "#2F2F2F",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <RefreshCw size={20} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all"
              style={{
                borderColor: "#E6E6EB",
                color: "#2F2F2F",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Filter size={20} />
              <span>Filter</span>
              {(filters.status || filters.priority || filters.requestType) && (
                <span className="ml-1 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                  Active
                </span>
              )}
            </button>

            {user?.role !== 'technician' && (
              <button
                onClick={() => setShowNewRequest(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all"
                style={{ backgroundColor: "#7A4D6E" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9B6B8A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7A4D6E")}
              >
                <Plus size={20} />
                <span>New Request</span>
              </button>
            )}
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

        {/* Status Summary */}
        <div className="flex flex-wrap gap-4 mb-6 overflow-x-auto pb-2">
          {getStatusCounts().map((status) => (
            <div key={status.id} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
              <span className="font-medium" style={{ color: "#2F2F2F" }}>
                {status.label}
              </span>
              <span
                className="ml-1 px-2 py-1 rounded text-sm font-semibold"
                style={{ backgroundColor: "rgba(122, 77, 110, 0.1)", color: "#7A4D6E" }}
              >
                {status.count}
              </span>
            </div>
          ))}
        </div>

        {/* Table Container */}
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#2F2F2F" }}>
              No maintenance requests found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.status || filters.priority || filters.requestType 
                ? "Try changing your filters" 
                : user?.role === 'employee' 
                  ? "You haven't created any maintenance requests yet."
                  : "There are no maintenance requests in the system."}
            </p>
            {user?.role !== 'technician' && (
              <button
                onClick={() => setShowNewRequest(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all"
                style={{ backgroundColor: "#7A4D6E" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9B6B8A")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7A4D6E")}
              >
                <Plus size={20} />
                <span>Create Your First Request</span>
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#E6E6EB", backgroundColor: "#FFFFFF" }}>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#F6F2F5" }}>
                    <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                      <button
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-1"
                      >
                        Request
                        <ChevronDown size={16} className={sortBy === "createdAt" ? (sortOrder === "asc" ? "" : "rotate-180") : ""} />
                      </button>
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                      Equipment
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                      Priority
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                      Reported By
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                      Assigned To
                    </th>
                    <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request._id}
                      className="border-t hover:bg-gray-50 transition-colors"
                      style={{ borderColor: "#E6E6EB" }}
                    >
                      <td className="p-4">
                        <div>
                          <h3 className="font-semibold text-sm mb-1" style={{ color: "#2F2F2F" }}>
                            {request.subject}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} style={{ color: "#9B6B8A" }} />
                            <span className="text-xs" style={{ color: "#9B9B9B" }}>
                              {formatDate(request.createdAt)}
                            </span>
                            {request.scheduledDate && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs" style={{ color: "#9B6B8A" }}>
                                  Scheduled: {formatDate(request.scheduledDate)}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {request.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm" style={{ color: "#2F2F2F" }}>
                            {request.equipment?.name || 'Unknown Equipment'}
                          </p>
                          <p className="text-xs" style={{ color: "#7A4D6E" }}>
                            {request.equipment?.serialNumber || 'No Serial'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <PriorityBadge priority={request.priority} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                            style={{ backgroundColor: "#F6F2F5", color: "#7A4D6E" }}
                          >
                            {request.createdBy?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                          </div>
                          <div>
                            <span className="text-sm block" style={{ color: "#2F2F2F" }}>
                              {request.createdBy?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {request.createdBy?.role || 'user'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {request.technician ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                              style={{ backgroundColor: "#E3F2FD", color: "#1976D2" }}
                            >
                              {request.technician.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                            </div>
                            <span className="text-sm" style={{ color: "#2F2F2F" }}>
                              {request.technician.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: "#9B9B9B" }}>
                            Not Assigned
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <ActionMenu 
                          request={{ ...request, userRole: user?.role }} 
                          onAction={handleAction}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t" style={{ borderColor: "#E6E6EB" }}>
              <div className="text-sm mb-4 sm:mb-0" style={{ color: "#9B9B9B" }}>
                Showing {requests.length} requests
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={filters.page === 1}
                  className="px-4 py-2 rounded border text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={requests.length < filters.limit}
                  className="px-4 py-2 rounded border text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFilter && (
        <FilterModal 
          onClose={() => setShowFilter(false)} 
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
        />
      )}
      
      {showNewRequest && (
        <NewRequestModal 
          onClose={() => setShowNewRequest(false)} 
          equipmentList={equipmentList}
          teamList={teamList}
          onCreate={handleCreateRequest}
        />
      )}
    </div>
  )
}

export default MaintenanceRequests