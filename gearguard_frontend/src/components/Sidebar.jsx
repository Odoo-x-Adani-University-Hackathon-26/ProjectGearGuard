"use client"

import { motion } from "framer-motion"
import {
  Settings,
  Wrench,
  Users,
  Calendar,
  BarChart3,
  WrenchIcon,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

const GearGuardSidebar = () => {
  const location = useLocation()

  const navigationItems = [
    { 
      icon: Settings, 
      label: "Equipment", 
      path: "/Equipment",
      active: location.pathname === "/equipment"
    },
    { 
      icon: Wrench, 
      label: "Maintenance Request", 
      path: "/MaintenanceRequest",
      active: location.pathname === "/MaintenanceRequest"
    },
    { 
      icon: Users, 
      label: "Maintenance Teams", 
      path: "/teams",
      active: location.pathname === "/teams"
    },
    { 
      icon: Calendar, 
      label: "Calendar", 
      path: "/calendar",
      active: location.pathname === "/calendar"
    },
    { 
      icon: BarChart3, 
      label: "Reports", 
      path: "/reports",
      active: location.pathname === "/reports"
    },
  ]

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-56 border-r h-screen flex-shrink-0"
      style={{ borderColor: "#E6E6EB", backgroundColor: "#FFFFFF" }}
    >
      {/* Logo */}
      <NavLink to="/" className="block">
        <div className="flex items-center gap-3 p-6 border-b hover:bg-gray-50 transition-colors" style={{ borderColor: "#E6E6EB" }}>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: "#7A4D6E" }}
          >
            <WrenchIcon size={24} />
          </div>
          <span className="font-bold text-lg" style={{ color: "#2F2F2F" }}>
            GearGuard
          </span>
        </div>
      </NavLink>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) => 
                `block w-full ${isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-50'}`
              }
              end={item.path === "/"}
            >
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all`}
                style={{
                  backgroundColor: location.pathname === item.path ? "#7A4D6E" : "transparent",
                }}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </NavLink>
          )
        })}
      </nav>
    </motion.div>
  )
}

export default GearGuardSidebar