"use client"

import { useState } from "react"
import { Search, Filter, Plus } from "lucide-react"

const Equipment = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const equipmentData = [
    {
      id: 1,
      name: "Assembly Robot A",
      category: "Assembly",
      team: "Team Delta",
      technician: "Sarah Chen",
      location: "Building A, Floor 1",
      status: "Repaired",
      maintenance: "—",
    },
    {
      id: 2,
      name: "CNC Machine #12",
      category: "Machining",
      team: "Team Alpha",
      technician: "Sarah Chen",
      location: "Building A, Floor 2",
      status: "In Progress",
      maintenance: "3",
    },
    {
      id: 3,
      name: "Conveyor Belt A",
      category: "Transport",
      team: "Team Gamma",
      technician: "Tom Brown",
      location: "Warehouse",
      status: "New",
      maintenance: "2",
    },
    {
      id: 4,
      name: "Forklift #7",
      category: "Transport",
      team: "Team Alpha",
      technician: "Emma Wilson",
      location: "Warehouse",
      status: "Overdue",
      maintenance: "5",
    },
    {
      id: 5,
      name: "Hydraulic Press #3",
      category: "Pressing",
      team: "Team Beta",
      technician: "Mike Johnson",
      location: "Building B, Floor 1",
      status: "Repaired",
      maintenance: "1",
    },
    {
      id: 6,
      name: "Welding Station #2",
      category: "Welding",
      team: "Team Beta",
      technician: "Mike Johnson",
      location: "Building C, Floor 1",
      status: "In Progress",
      maintenance: "2",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Repaired":
        return "text-emerald-600 bg-emerald-50"
      case "In Progress":
        return "text-blue-600 bg-blue-50"
      case "New":
        return "text-gray-600 bg-gray-50"
      case "Overdue":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Equipment</h2>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-500 flex-1"
            />
          </div>

          {/* Filter Dropdown */}
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-700" />
            <span className="text-sm font-medium text-slate-700">{selectedCategory}</span>
          </button>

          {/* Add Equipment Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors ml-auto">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add Equipment</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">EQUIPMENT NAME</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">CATEGORY</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ASSIGNED TEAM</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ASSIGNED TECHNICIAN</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">LOCATION</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">STATUS</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">MAINTENANCE</th>
            </tr>
          </thead>
          <tbody>
            {equipmentData.map((item) => (
              <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.team}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.technician}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.maintenance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Equipment
