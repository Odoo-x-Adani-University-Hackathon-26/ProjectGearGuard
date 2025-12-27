"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react"

// Dashboard Component
export default function DashboardContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const maintenanceData = [
    {
      id: 1,
      subject: "Test activity",
      employee: "Mitchell Adams",
      technician: "Alex Foster",
      category: "Computer",
      stage: "New Request",
      comments: "My company",
    },
    {
      id: 2,
      subject: "Equipment calibration",
      employee: "Sarah Chen",
      technician: "Mike Johnson",
      category: "Machining",
      stage: "In Progress",
      comments: "Pending review",
    },
    {
      id: 3,
      subject: "Preventive maintenance",
      employee: "Tom Brown",
      technician: "Emma Wilson",
      category: "Assembly",
      stage: "Scheduled",
      comments: "Next week",
    },
    {
      id: 4,
      subject: "Emergency repair",
      employee: "John Doe",
      technician: "Sarah Chen",
      category: "Transport",
      stage: "Urgent",
      comments: "High priority",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">
        Dashboard
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button className="px-4 py-2 border-2 border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New
        </button>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-500 flex-1"
          />
        </div>

        <button className="px-4 py-2 bg-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-300 transition-colors">
          Filter
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-900">Critical Equipment</p>
              <p className="text-3xl font-bold text-red-600 mt-2">5 Units</p>
              <p className="text-sm text-red-700 mt-1">(Health &lt; 30%)</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Technician Load</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">85% Utilized</p>
              <p className="text-sm text-blue-700 mt-1">(Assign Carefully)</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Open Requests</p>
              <p className="text-3xl font-bold text-green-600 mt-2">12 Pending</p>
              <p className="text-sm text-green-700 mt-1">3 Overdue</p>
            </div>
          </div>
        </div>

      </div>

      {/* Maintenance Table */}
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Maintenance Activity
      </h3>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Technician</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Stage</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Comments</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium">{item.subject}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.employee}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.technician}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.stage}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
