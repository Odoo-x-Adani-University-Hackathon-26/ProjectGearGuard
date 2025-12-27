import { Search, Bell, ChevronDown } from "lucide-react"

const Header = ({ currentPage, userName = "John Doe", userInitial = "JD" }) => {
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
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-500 flex-1"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-slate-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
          <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {userInitial}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-900">{userName}</span>
            <ChevronDown className="w-4 h-4 text-slate-600" />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header
