"use client"

import { useState } from "react"
import { Plus, Filter, X, Calendar, ChevronDown, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"

// Filter Modal Component
const FilterModal = ({ onClose }) => {
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

        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Status
            </label>
            <div className="space-y-2">
              {["New", "In Progress", "Repaired", "Scrap"].map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" style={{ accentColor: "#7A4D6E" }} />
                  <span style={{ color: "#2F2F2F" }}>{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Date Range
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border font-medium transition-all"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all"
              style={{ backgroundColor: "#7A4D6E" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9B6B8A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7A4D6E")}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// New Request Modal Component
const NewRequestModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    equipment: "",
    date: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("New request:", formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: "#2F2F2F" }}>
            New Maintenance Request
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100" style={{ color: "#2F2F2F" }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Issue Title
            </label>
            <input
              type="text"
              placeholder="Describe the issue..."
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Equipment
            </label>
            <input
              type="text"
              placeholder="Equipment name or ID..."
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "#2F2F2F" }}>
              Date Reported
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border font-medium transition-all"
              style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all"
              style={{ backgroundColor: "#7A4D6E" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9B6B8A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7A4D6E")}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      "new": { color: "#7A4D6E", bgColor: "rgba(122, 77, 110, 0.1)", label: "New" },
      "in-progress": { color: "#C62828", bgColor: "rgba(198, 40, 40, 0.1)", label: "In Progress" },
      "repaired": { color: "#2E7D32", bgColor: "rgba(46, 125, 50, 0.1)", label: "Repaired" },
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

// Action Menu Component
const ActionMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (action) => {
    console.log(`${action} clicked`)
    setIsOpen(false)
  }

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
          className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg z-10"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E6E6EB", borderWidth: "1px" }}
        >
          <button
            onClick={() => handleAction("view")}
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
            style={{ color: "#2F2F2F" }}
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>
          <button
            onClick={() => handleAction("edit")}
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50"
            style={{ color: "#2F2F2F" }}
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleAction("delete")}
            className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
            style={{ color: "#C62828" }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}

// Main Maintenance Requests Component in Table Form
const MaintenanceRequests = () => {
  const [showFilter, setShowFilter] = useState(false)
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  const statuses = [
    { id: "new", label: "New", color: "#7A4D6E", count: 2 },
    { id: "in-progress", label: "In Progress", color: "#C62828", count: 3 },
    { id: "repaired", label: "Repaired", color: "#2E7D32", count: 2 },
    { id: "scrap", label: "Scrap", color: "#9B9B9B", count: 1 },
  ]

  const mockRequests = [
    {
      id: 1,
      status: "new",
      title: "Coolant leak detected in main pump",
      equipment: "CNC Machine #12",
      equipmentId: "EQ-0012",
      reportedBy: "Sarah Chen",
      date: "Dec 28, 2024",
      priority: "High",
      assignedTo: "John Doe",
      initials: "SC",
    },
    {
      id: 2,
      status: "new",
      title: "Unusual vibration during operation",
      equipment: "Hydraulic Press #3",
      equipmentId: "EQ-0003",
      reportedBy: "Michael Johnson",
      date: "Dec 29, 2024",
      priority: "Medium",
      assignedTo: "Not Assigned",
      initials: "MJ",
    },
    {
      id: 3,
      status: "in-progress",
      title: "Belt replacement required",
      equipment: "Conveyor Belt A",
      equipmentId: "EQ-0045",
      reportedBy: "Taylor Brown",
      date: "Dec 25, 2024",
      priority: "High",
      assignedTo: "Alex Wilson",
      initials: "TB",
    },
    {
      id: 4,
      status: "in-progress",
      title: "Annual calibration service",
      equipment: "Assembly Robot A",
      equipmentId: "EQ-0022",
      reportedBy: "Emma Watson",
      date: "Dec 27, 2024",
      priority: "Low",
      assignedTo: "Sam Garcia",
      initials: "EW",
    },
    {
      id: 5,
      status: "in-progress",
      title: "Control panel malfunction",
      equipment: "Welding Station #2",
      equipmentId: "EQ-0018",
      reportedBy: "Sarah Chen",
      date: "Dec 26, 2024",
      priority: "Medium",
      assignedTo: "Lisa Park",
      initials: "SC",
    },
    {
      id: 6,
      status: "repaired",
      title: "Motor replacement completed",
      equipment: "Forklift #7",
      equipmentId: "EQ-0007",
      reportedBy: "Michael Johnson",
      date: "Dec 24, 2024",
      priority: "High",
      assignedTo: "John Doe",
      initials: "MJ",
    },
    {
      id: 7,
      status: "repaired",
      title: "Sensor recalibration",
      equipment: "CNC Machine #5",
      equipmentId: "EQ-0005",
      reportedBy: "Taylor Brown",
      date: "Dec 23, 2024",
      priority: "Low",
      assignedTo: "Alex Wilson",
      initials: "TB",
    },
    {
      id: 8,
      status: "scrap",
      title: "Beyond economical repair",
      equipment: "Old Drill Press #1",
      equipmentId: "EQ-0001",
      reportedBy: "James Davis",
      date: "Dec 20, 2024",
      priority: "Low",
      assignedTo: "Not Assigned",
      initials: "JD",
    },
  ]

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const sortedRequests = [...mockRequests].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    }
    if (sortBy === "priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 }
      return sortOrder === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return 0
  })

  return (
    <div style={{ backgroundColor: "#F6F2F5" }} className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#2F2F2F" }}>
            Maintenance Requests
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
            </button>

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
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-4 mb-6 overflow-x-auto pb-2">
          {statuses.map((status) => (
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
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#E6E6EB", backgroundColor: "#FFFFFF" }}>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#F6F2F5" }}>
                  <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-1"
                    >
                      Request
                      <ChevronDown size={16} className={sortBy === "date" ? "rotate-180" : ""} />
                    </button>
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                    Equipment
                  </th>
                  <th className="text-left p-4 font-semibold" style={{ color: "#2F2F2F" }}>
                    <button
                      onClick={() => handleSort("priority")}
                      className="flex items-center gap-1"
                    >
                      Priority
                      <ChevronDown size={16} className={sortBy === "priority" ? "rotate-180" : ""} />
                    </button>
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
                {sortedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: "#E6E6EB" }}
                  >
                    <td className="p-4">
                      <div>
                        <h3 className="font-semibold text-sm mb-1" style={{ color: "#2F2F2F" }}>
                          {request.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} style={{ color: "#9B6B8A" }} />
                          <span className="text-xs" style={{ color: "#9B9B9B" }}>
                            {request.date}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-sm" style={{ color: "#2F2F2F" }}>
                          {request.equipment}
                        </p>
                        <p className="text-xs" style={{ color: "#7A4D6E" }}>
                          {request.equipmentId}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : request.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {request.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                          style={{ backgroundColor: "#F6F2F5", color: "#7A4D6E" }}
                        >
                          {request.initials}
                        </div>
                        <span className="text-sm" style={{ color: "#2F2F2F" }}>
                          {request.reportedBy}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm" style={{ color: request.assignedTo === "Not Assigned" ? "#9B9B9B" : "#2F2F2F" }}>
                        {request.assignedTo}
                      </span>
                    </td>
                    <td className="p-4">
                      <ActionMenu />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between p-4 border-t" style={{ borderColor: "#E6E6EB" }}>
            <div className="text-sm" style={{ color: "#9B9B9B" }}>
              Showing {sortedRequests.length} of {sortedRequests.length} requests
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 rounded border text-sm transition-all"
                style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 rounded border text-sm transition-all"
                style={{ borderColor: "#E6E6EB", color: "#2F2F2F" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(122, 77, 110, 0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
      {showNewRequest && <NewRequestModal onClose={() => setShowNewRequest(false)} />}
    </div>
  )
}

export default MaintenanceRequests