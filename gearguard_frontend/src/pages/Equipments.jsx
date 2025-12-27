"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Wrench,
  Users,
  Calendar,
  BarChart3,
  Search,
  ChevronDown,
  Plus,
  MoreVertical,
  WrenchIcon,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import equipmentService from "../services/equipmentService"
import departmentService from "../services/departmentService"
import teamService from "../services/teamService"
import userService from "../services/userService"

// Equipment Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      "active": { 
        color: "#2E7D32", 
        bgColor: "rgba(46, 125, 50, 0.1)", 
        label: "Active",
        icon: CheckCircle
      },
      "inactive": { 
        color: "#757575", 
        bgColor: "rgba(117, 117, 117, 0.1)", 
        label: "Inactive",
        icon: Clock
      },
      "under_maintenance": { 
        color: "#C62828", 
        bgColor: "rgba(198, 40, 40, 0.1)", 
        label: "Under Maintenance",
        icon: AlertCircle
      },
      "scrapped": { 
        color: "#9B9B9B", 
        bgColor: "rgba(155, 155, 155, 0.1)", 
        label: "Scrapped",
        icon: X
      }
    }
    return configs[status] || configs.active
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      <Icon size={12} />
      {config.label}
    </span>
  )
}

// Action Menu Component
const ActionMenu = ({ equipment, onAction, userRole }) => {
  const [isOpen, setIsOpen] = useState(false)

  const getAvailableActions = () => {
    const baseActions = [
      { id: 'view', label: 'View Details', icon: Eye, color: '#2F2F2F' }
    ]

    if (['admin', 'manager'].includes(userRole)) {
      baseActions.push(
        { id: 'edit', label: 'Edit Equipment', icon: Edit, color: '#2F2F2F' }
      )
    }

    if (['admin', 'manager', 'technician'].includes(userRole)) {
      baseActions.push(
        { id: 'maintenance', label: 'View Maintenance', icon: WrenchIcon, color: '#2F2F2F' }
      )
    }

    if (['admin'].includes(userRole)) {
      baseActions.push(
        { id: 'delete', label: 'Delete Equipment', icon: Trash2, color: '#C62828' }
      )
    }

    return baseActions
  }

  const actions = getAvailableActions()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        style={{ color: "#9B6B8A" }}
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-1 w-48 bg-white rounded-lg border shadow-lg z-10"
          style={{ borderColor: "#E6E6EB" }}
        >
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => {
                onAction(equipment, action.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm flex items-center gap-2 ${
                index === 0 ? 'rounded-t-lg' : 
                index === actions.length - 1 ? 'rounded-b-lg' : ''
              }`}
              style={{ color: action.color }}
            >
              <action.icon size={14} />
              {action.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}

// Add Equipment Modal
const AddEquipmentModal = ({ onClose, departments, teams, technicians, onCreate }) => {
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    department: "",
    maintenanceTeam: "",
    defaultTechnician: "",
    location: "",
    status: "active",
    purchaseDate: "",
    warrantyEndDate: "",
  })

  const [specifications, setSpecifications] = useState([
    { key: "", value: "" }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecs = [...specifications]
    updatedSpecs[index][field] = value
    setSpecifications(updatedSpecs)
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }])
  }

  const removeSpecification = (index) => {
    if (specifications.length > 1) {
      const updatedSpecs = specifications.filter((_, i) => i !== index)
      setSpecifications(updatedSpecs)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.name || !formData.department) {
        throw new Error("Please fill in all required fields")
      }

      // Prepare specifications object
      const specsObj = {}
      specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specsObj[spec.key] = spec.value
        }
      })

      const equipmentData = {
        ...formData,
        specifications: specsObj,
        purchaseDate: formData.purchaseDate || undefined,
        warrantyEndDate: formData.warrantyEndDate || undefined
      }

      await onCreate(equipmentData)
      onClose()
    } catch (err) {
      setError(err.message || "Failed to create equipment")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#E6E6EB" }}>
          <h2 className="text-xl font-bold" style={{ color: "#2F2F2F" }}>
            Add New Equipment
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={24} style={{ color: "#2F2F2F" }} />
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
            {/* Basic Information - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Equipment Name */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Equipment Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter equipment name"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  placeholder="Enter serial number"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Location & Department - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Building A, Floor 2"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Department *
                </label>
                <select
                  name="department"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Team & Technician - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Maintenance Team */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Maintenance Team
                </label>
                <select
                  name="maintenanceTeam"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.maintenanceTeam}
                  onChange={handleChange}
                >
                  <option value="">Select Team (Optional)</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Default Technician */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Default Technician
                </label>
                <select
                  name="defaultTechnician"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.defaultTechnician}
                  onChange={handleChange}
                >
                  <option value="">Select Technician (Optional)</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.name} ({tech.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates & Status - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchase Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.purchaseDate}
                  onChange={handleChange}
                />
              </div>

              {/* Warranty End Date */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                  Warranty End Date
                </label>
                <input
                  type="date"
                  name="warrantyEndDate"
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={formData.warrantyEndDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
                Status
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'active', label: 'Active', color: '#2E7D32' },
                  { value: 'inactive', label: 'Inactive', color: '#757575' },
                  { value: 'under_maintenance', label: 'Under Maintenance', color: '#C62828' },
                  { value: 'scrapped', label: 'Scrapped', color: '#9B9B9B' }
                ].map((status) => (
                  <label
                    key={status.value}
                    className={`px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                      formData.status === status.value ? 'ring-2 ring-offset-1' : ''
                    }`}
                    style={{
                      borderColor: formData.status === status.value ? status.color : '#E6E6EB',
                      backgroundColor: formData.status === status.value ? status.color + '10' : 'transparent',
                      color: formData.status === status.value ? status.color : '#2F2F2F'
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={formData.status === status.value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {status.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: "#2F2F2F" }}>
                  Specifications
                </label>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-sm flex items-center gap-1"
                  style={{ color: "#7A4D6E" }}
                >
                  <Plus size={14} />
                  Add Specification
                </button>
              </div>
              
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Key (e.g., Brand, Model)"
                      className="flex-1 px-3 py-2 border rounded-lg"
                      style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border rounded-lg"
                      style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    />
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="px-3 py-2 rounded-lg border hover:bg-red-50"
                        style={{ borderColor: "#E6E6EB", color: "#C62828" }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t" style={{ borderColor: "#E6E6EB" }}>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border font-medium transition-all"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "#7A4D6E" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9B6B8A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7A4D6E")}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Equipment...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  Add Equipment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Filter Modal Component
const FilterModal = ({ onClose, filters, setFilters, applyFilters }) => {
  const statusOptions = [
    { value: "active", label: "Active", color: "#2E7D32" },
    { value: "inactive", label: "Inactive", color: "#757575" },
    { value: "under_maintenance", label: "Under Maintenance", color: "#C62828" },
    { value: "scrapped", label: "Scrapped", color: "#9B9B9B" }
  ]

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? null : status
    }))
  }

  const handleReset = () => {
    setFilters({
      status: null,
      department: null,
      search: "",
      page: 1,
      limit: 20
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: "#2F2F2F" }}>
            Filter Equipment
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={24} style={{ color: "#2F2F2F" }} />
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
                  className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                    filters.status === status.value ? 'ring-2 ring-offset-1' : ''
                  }`}
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

// Main Equipment Dashboard Component
const GearGuardDashboard = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [equipment, setEquipment] = useState([])
  const [departments, setDepartments] = useState([])
  const [teams, setTeams] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [error, setError] = useState("")
  const [stats, setStats] = useState(null)

  const [filters, setFilters] = useState({
    status: null,
    department: null,
    search: "",
    page: 1,
    limit: 20
  })

  // Navigation items
  const navigationItems = [
    { icon: Settings, label: "Equipment", active: true, path: "/equipment" },
    { icon: Wrench, label: "Maintenance Requests", active: false, path: "/maintenance" },
    { icon: Users, label: "Maintenance Teams", active: false, path: "/teams" },
    { icon: Calendar, label: "Calendar", active: false, path: "/calendar" },
    { icon: BarChart3, label: "Reports", active: false, path: "/reports" },
  ]

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      // Build query params
      const params = {}
      if (filters.status) params.status = filters.status
      if (filters.department) params.department = filters.department
      if (filters.search) params.search = filters.search
      params.page = filters.page
      params.limit = filters.limit

      // Fetch equipment
      const equipmentRes = await equipmentService.getAllEquipment(params)
      setEquipment(equipmentRes.data)

      // Fetch additional data for dropdowns
      const [departmentsRes, teamsRes] = await Promise.all([
        departmentService.getAllDepartments({ limit: 100 }),
        teamService.getAllTeams({ limit: 100 })
      ])
      setDepartments(departmentsRes.data)
      setTeams(teamsRes.data)

      // Fetch technicians
      // Note: You'll need to create a getTechnicians endpoint or filter users
      // For now, we'll filter from a users list if available
      // const techniciansRes = await userService.getTechnicians()
      // setTechnicians(techniciansRes.data)

    } catch (err) {
      console.error('Failed to fetch equipment data:', err)
      setError(err.message || 'Failed to load equipment data')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, fetchData])

  const handleCreateEquipment = async (equipmentData) => {
    try {
      await equipmentService.createEquipment(equipmentData)
      fetchData() // Refresh the list
    } catch (err) {
      throw new Error(err.message || 'Failed to create equipment')
    }
  }

  const handleAction = async (equipmentItem, action) => {
    try {
      switch (action) {
        case 'view':
          // Navigate to equipment details
          console.log('View equipment:', equipmentItem._id)
          break
        case 'edit':
          // Open edit modal
          console.log('Edit equipment:', equipmentItem._id)
          break
        case 'maintenance':
          // Navigate to maintenance history
          console.log('View maintenance history for:', equipmentItem._id)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this equipment?')) {
            await equipmentService.deleteEquipment(equipmentItem._id)
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

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }))
    fetchData()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      backgroundColor: "#F6F2F5",
      transition: { duration: 0.2 },
    },
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading && !equipment.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading equipment data...</span>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        {/* Toolbar */}
        <div
          className="border-b p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderColor: "#E6E6EB", backgroundColor: "#FFFFFF" }}
        >
          <div className="w-full sm:w-auto">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "#2F2F2F" }}>
              Equipment Management
            </h2>
            <p className="text-gray-600">Manage all equipment and their maintenance schedules</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 sm:flex-none">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: "#9B6B8A" }} />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border"
                  style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <button
              onClick={() => fetchData()}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
            >
              <Filter size={18} />
              Filter
              {(filters.status || filters.department) && (
                <span className="ml-1 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                  Active
                </span>
              )}
            </button>

            {['admin', 'manager'].includes(user?.role) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:shadow-lg"
                style={{ backgroundColor: "#7A4D6E" }}
              >
                <Plus size={18} />
                Add Equipment
              </motion.button>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Summary */}
        {stats && (
          <div className="p-6 border-b" style={{ borderColor: "#E6E6EB" }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#F6F2F5" }}>
                <p className="text-sm text-gray-600">Total Equipment</p>
                <p className="text-2xl font-bold mt-2" style={{ color: "#2F2F2F" }}>
                  {equipment.length}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#F6F2F5" }}>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold mt-2" style={{ color: "#2E7D32" }}>
                  {equipment.filter(e => e.status === 'active').length}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#F6F2F5" }}>
                <p className="text-sm text-gray-600">Under Maintenance</p>
                <p className="text-2xl font-bold mt-2" style={{ color: "#C62828" }}>
                  {equipment.filter(e => e.status === 'under_maintenance').length}
                </p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#F6F2F5" }}>
                <p className="text-sm text-gray-600">Maintenance Due</p>
                <p className="text-2xl font-bold mt-2" style={{ color: "#F57C00" }}>
                  {equipment.filter(e => e.nextMaintenanceDate && new Date(e.nextMaintenanceDate) < new Date()).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex-1 overflow-auto p-6"
        >
          {equipment.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Settings size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#2F2F2F" }}>
                No equipment found
              </h3>
              <p className="text-gray-600 mb-6">
                {filters.status || filters.department || filters.search
                  ? "Try changing your filters"
                  : "There is no equipment in the system yet."}
              </p>
              {['admin', 'manager'].includes(user?.role) && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all"
                  style={{ backgroundColor: "#7A4D6E" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9B6B8A")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7A4D6E")}
                >
                  <Plus size={20} />
                  <span>Add Your First Equipment</span>
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border" style={{ borderColor: "#E6E6EB" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#F6F2F5", borderColor: "#E6E6EB" }}>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                      EQUIPMENT NAME
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                      SERIAL NUMBER
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                      DEPARTMENT
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                      MAINTENANCE TEAM
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                      LOCATION
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                      STATUS
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item, index) => (
                    <motion.tr
                      key={item._id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                      whileHover="hover"
                      className="border-b transition-colors cursor-pointer"
                      style={{ borderColor: "#E6E6EB" }}
                    >
                      <td className="px-6 py-4 text-sm font-medium" style={{ color: "#2F2F2F" }}>
                        <div>
                          {item.name}
                          {item.nextMaintenanceDate && new Date(item.nextMaintenanceDate) < new Date() && (
                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
                              Due
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "#9B6B8A" }}>
                        {item.serialNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "#7A4D6E" }}>
                        {item.department?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "#9B6B8A" }}>
                        {item.maintenanceTeam?.name || 'Not Assigned'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "#2F2F2F" }}>
                        {item.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <ActionMenu 
                          equipment={item} 
                          onAction={handleAction}
                          userRole={user?.role}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {equipment.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 border rounded-lg" style={{ borderColor: "#E6E6EB" }}>
              <div className="text-sm mb-4 sm:mb-0" style={{ color: "#9B9B9B" }}>
                Showing {equipment.length} equipment
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
                  disabled={equipment.length < filters.limit}
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
          )}
        </motion.div>
      </motion.div>

      {/* Modals */}
      {showAddModal && (
        <AddEquipmentModal
          onClose={() => setShowAddModal(false)}
          departments={departments}
          teams={teams}
          technicians={technicians}
          onCreate={handleCreateEquipment}
        />
      )}
      
      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
        />
      )}
    </div>
  )
}

export default GearGuardDashboard