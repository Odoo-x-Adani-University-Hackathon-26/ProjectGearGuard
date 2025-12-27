import { Search, Bell, ChevronDown, LogOut, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Header = ({ currentPage }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate("/login")
    setShowDropdown(false)
  }

  const getUserInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'technician': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-slate-900">{currentPage}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 flex-1 max-w-xs">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search equipment, requests..."
            className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-500 flex-1"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {getUserInitials()}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="text-left">
                <span className="font-medium text-slate-900 block">
                  {user?.name || "User"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role || "User"}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user?.name}</p>
                    <p className="text-sm text-slate-600">{user?.email}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${getRoleBadgeColor(user?.role)}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button 
                  onClick={() => {
                    navigate("/profile")
                    setShowDropdown(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              {/* Last Login Info */}
              <div className="px-4 py-2 border-t border-slate-100 text-xs text-slate-500">
                Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header