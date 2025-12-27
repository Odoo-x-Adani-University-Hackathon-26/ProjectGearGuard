"use client"

import { useState } from "react"
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
} from "lucide-react"

const GearGuardDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const navigationItems = [
    { icon: Settings, label: "Equipment", active: true },
    { icon: Wrench, label: "Maintenance Requests", active: false },
    { icon: Users, label: "Maintenance Teams", active: false },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: BarChart3, label: "Reports", active: false },
  ]

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
        return "bg-[#E6F4EA] text-[#2E7D32]"
      case "In Progress":
        return "bg-[#F6F2F5] text-[#7A4D6E]"
      case "New":
        return "bg-[#F6F2F5] text-[#7A4D6E]"
      case "Overdue":
        return "bg-[#FDECEA] text-[#C62828]"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
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

  return (
    <div className="flex h-screen bg-white" style={{ backgroundColor: "#FFFFFF" }}>
      {/* 
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 flex flex-col overflow-hidden"
      >
        

        {/* Toolbar */}
        <div
          className="border-b p-6 flex items-center justify-between gap-4 flex-wrap"
          style={{ borderColor: "#E6E6EB", backgroundColor: "#FFFFFF" }}
        >
          <h2 className="text-xl font-semibold" style={{ color: "#2F2F2F" }}>
            Equipment
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
                style={{
                  borderColor: "#E6E6EB",
                  color: "#2F2F2F",
                }}
              >
                {selectedCategory}
                <ChevronDown size={18} />
              </button>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full mt-2 w-48 bg-white rounded-lg border shadow-lg z-10"
                  style={{ borderColor: "#E6E6EB" }}
                >
                  {["All Categories", "Assembly", "Machining", "Transport", "Pressing", "Welding"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        setIsDropdownOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm"
                      style={{ color: "#2F2F2F" }}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:shadow-lg"
              style={{ backgroundColor: "#7A4D6E" }}
            >
              <Plus size={18} />
              Add Equipment
            </motion.button>
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex-1 overflow-auto p-6"
        >
          <div className="rounded-lg border" style={{ borderColor: "#E6E6EB" }}>
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "#E6E6EB", backgroundColor: "#F6F2F5" }}>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                    EQUIPMENT NAME
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                    CATEGORY
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                    ASSIGNED TEAM
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                    ASSIGNED TECHNICIAN
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                    LOCATION
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#2F2F2F" }}>
                    MAINTENANCE
                  </th>
                </tr>
              </thead>
              <tbody>
                {equipmentData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                    whileHover="hover"
                    className="border-b transition-colors cursor-pointer"
                    style={{ borderColor: "#E6E6EB" }}
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#2F2F2F" }}>
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#9B6B8A" }}>
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#7A4D6E" }}>
                      {item.team}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#9B6B8A" }}>
                      {item.technician}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#2F2F2F" }}>
                      {item.location}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm flex items-center gap-3" style={{ color: "#2F2F2F" }}>
                      {item.maintenance !== "—" && (
                        <>
                          <WrenchIcon size={16} />
                          {item.maintenance}
                        </>
                      )}
                      {item.maintenance === "—" && "—"}
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical size={16} style={{ color: "#9B6B8A" }} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GearGuardDashboard
