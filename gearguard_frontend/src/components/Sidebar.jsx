"use client"

import { useState } from "react"
import { Settings, ClipboardList, Users, Calendar, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [activeItem, setActiveItem] = useState("Equipment")

  const menuItems = [
    { icon: Settings, label: "Equipment", id: "Equipment" },
    { icon: ClipboardList, label: "Maintenance Requests", id: "MaintenanceRequests" },
    { icon: Users, label: "Maintenance Teams", id: "MaintenanceTeams" },
    { icon: Calendar, label: "Calendar", id: "Calendar" },
    { icon: BarChart3, label: "Reports", id: "Reports" },
  ]

  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-64"} bg-slate-100 h-screen border-r border-slate-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className={`flex items-center gap-3 p-6 border-b border-slate-200 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="w-10 h-10 bg-purple-700 rounded flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && <span className="text-xl font-bold text-slate-900">GearGuard</span>}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                activeItem === item.id ? "bg-slate-200 text-slate-900" : "text-slate-700 hover:bg-slate-150"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 hover:bg-slate-200 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-slate-700" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
