import React from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Filter, AlertCircle, CheckCircle, Clock, FileText, Wrench, Zap, Cpu, Factory } from 'lucide-react';

const MaintenanceReports = () => {
  // Requests by Team data
  const teamRequests = [
    { name: 'Team Alpha', value: 52, color: '#7A4D6E', icon: <Wrench className="w-4 h-4" /> },
    { name: 'Team Beta', value: 38, color: '#9B6B8A', icon: <Zap className="w-4 h-4" /> },
    { name: 'Team Gamma', value: 45, color: '#C62828', icon: <Factory className="w-4 h-4" /> },
    { name: 'Team Delta', value: 27, color: '#2E7D32', icon: <Cpu className="w-4 h-4" /> },
  ];

  // Requests by Status data
  const statusData = [
    { name: 'New', count: 15, color: '#E6E6EB', textColor: '#2F2F2F', icon: <FileText className="w-4 h-4" /> },
    { name: 'In Progress', count: 20, color: '#FFF4E5', textColor: '#E65100', icon: <Clock className="w-4 h-4" /> },
    { name: 'Repaired', count: 52, color: '#E6F4EA', textColor: '#2E7D32', icon: <CheckCircle className="w-4 h-4" /> },
    { name: 'Overdue', count: 8, color: '#FDECEA', textColor: '#C62828', icon: <AlertCircle className="w-4 h-4" /> },
  ];

  // Equipment type data
  const equipmentData = [
    { name: 'CNC Machines', value: 26, color: '#7A4D6E' },
    { name: 'Hydraulic Presses', value: 27, color: '#9B6B8A' },
    { name: 'Conveyor Belts', value: 18, color: '#C62828' },
    { name: 'Facilities', value: 9, color: '#2E7D32' },
    { name: 'Robotics', value: 12, color: '#4A5568' },
    { name: 'Welding Stations', value: 15, color: '#2D3748' },
  ];

  // Calculate total requests
  const totalRequests = statusData.reduce((sum, item) => sum + item.count, 0);
  const totalEquipmentRequests = equipmentData.reduce((sum, item) => sum + item.value, 0);

  // Get max value for scaling
  const maxTeamValue = Math.max(...teamRequests.map(t => t.value));
  const maxEquipmentValue = Math.max(...equipmentData.map(e => e.value));

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#F6F2F5' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#2F2F2F' }}>
                Reports
              </h1>
              <p className="text-gray-600" style={{ color: '#2F2F2F' }}>
                Analytics and insights for maintenance operations
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm transition-shadow"
                style={{ 
                  borderColor: '#E6E6EB',
                  backgroundColor: 'white',
                  color: '#2F2F2F'
                }}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-sm transition-shadow"
                style={{ 
                  backgroundColor: '#7A4D6E',
                  color: 'white'
                }}
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border"
              style={{ borderColor: '#E6E6EB' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#9B6B8A' }}>Total Requests</span>
                <FileText className="w-5 h-5" style={{ color: '#7A4D6E' }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#2F2F2F' }}>
                {totalRequests}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4" style={{ color: '#2E7D32' }} />
                <span style={{ color: '#2E7D32' }}>+12% from last month</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border"
              style={{ borderColor: '#E6E6EB' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#9B6B8A' }}>Completed</span>
                <CheckCircle className="w-5 h-5" style={{ color: '#2E7D32' }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#2F2F2F' }}>
                52
              </div>
              <div className="text-sm" style={{ color: '#9B6B8A' }}>
                68% completion rate
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border"
              style={{ borderColor: '#E6E6EB' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#9B6B8A' }}>In Progress</span>
                <Clock className="w-5 h-5" style={{ color: '#E65100' }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#2F2F2F' }}>
                20
              </div>
              <div className="text-sm" style={{ color: '#9B6B8A' }}>
                Avg. 2.1 days remaining
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border"
              style={{ borderColor: '#E6E6EB' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: '#9B6B8A' }}>Overdue</span>
                <AlertCircle className="w-5 h-5" style={{ color: '#C62828' }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#2F2F2F' }}>
                8
              </div>
              <div className="text-sm" style={{ color: '#C62828' }}>
                Needs attention
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Requests by Team */}
          <div className="bg-white rounded-xl p-6 border"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#2F2F2F' }}>
                  Requests by Team
                </h3>
                <p className="text-sm" style={{ color: '#9B6B8A' }}>
                  Distribution of maintenance requests across teams
                </p>
              </div>
              <BarChart3 className="w-6 h-6" style={{ color: '#7A4D6E' }} />
            </div>

            <div className="space-y-4">
              {teamRequests.map((team, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded"
                        style={{ backgroundColor: team.color + '20' }}
                      >
                        <div style={{ color: team.color }}>
                          {team.icon}
                        </div>
                      </div>
                      <span className="font-medium" style={{ color: '#2F2F2F' }}>
                        {team.name}
                      </span>
                    </div>
                    <span className="font-bold" style={{ color: '#2F2F2F' }}>
                      {team.value}
                    </span>
                  </div>
                  
                  {/* Bar chart */}
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E6E6EB' }}>
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(team.value / maxTeamValue) * 100}%`,
                        backgroundColor: team.color
                      }}
                    ></div>
                  </div>
                  
                  {/* Scale markers */}
                  {index === teamRequests.length - 1 && (
                    <div className="flex justify-between text-xs pt-2">
                      {[0, 15, 30, 45, 60].map((marker) => (
                        <span key={marker} style={{ color: '#9B6B8A' }}>{marker}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requests by Status */}
          <div className="bg-white rounded-xl p-6 border"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ color: '#2F2F2F' }}>
                  Requests by Status
                </h3>
                <p className="text-sm" style={{ color: '#9B6B8A' }}>
                  Current status of all maintenance requests
                </p>
              </div>
              <PieChart className="w-6 h-6" style={{ color: '#7A4D6E' }} />
            </div>

            <div className="space-y-4">
              {statusData.map((status, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg flex items-center justify-between hover:shadow-sm transition-shadow cursor-pointer"
                  style={{ 
                    backgroundColor: status.color,
                    border: `1px solid ${status.textColor}20`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: status.textColor + '20' }}>
                      <div style={{ color: status.textColor }}>
                        {status.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium" style={{ color: '#2F2F2F' }}>
                        {status.name}
                      </h4>
                      <p className="text-sm" style={{ color: status.textColor }}>
                        {status.count} requests
                      </p>
                    </div>
                  </div>
                  
                  {/* Percentage */}
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: '#2F2F2F' }}>
                      {status.count}
                    </div>
                    <div className="text-sm" style={{ color: '#9B6B8A' }}>
                      {((status.count / totalRequests) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Equipment Type Distribution */}
        <div className="bg-white rounded-xl p-6 border mb-8"
          style={{ borderColor: '#E6E6EB' }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#2F2F2F' }}>
                Requests by Equipment Type
              </h3>
              <p className="text-sm" style={{ color: '#9B6B8A' }}>
                Breakdown of maintenance requests by equipment category
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <span className="text-lg font-bold" style={{ color: '#2F2F2F' }}>
                Total: {totalEquipmentRequests}
              </span>
            </div>
          </div>

          {/* Equipment Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bar Chart Visualization */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {equipmentData.map((equipment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: equipment.color }}
                        ></div>
                        <span className="font-medium" style={{ color: '#2F2F2F' }}>
                          {equipment.name}
                        </span>
                      </div>
                      <span className="font-bold" style={{ color: '#2F2F2F' }}>
                        {equipment.value}
                      </span>
                    </div>
                    
                    {/* Horizontal Bar */}
                    <div className="h-8 rounded-lg overflow-hidden relative" style={{ backgroundColor: '#F6F2F5' }}>
                      <div 
                        className="h-full rounded-lg flex items-center justify-end pr-3"
                        style={{ 
                          width: `${(equipment.value / maxEquipmentValue) * 100}%`,
                          backgroundColor: equipment.color,
                          minWidth: '30px'
                        }}
                      >
                        <span className="text-white font-bold text-sm">
                          {equipment.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="bg-gray-50 rounded-xl p-6"
              style={{ backgroundColor: '#F6F2F5' }}
            >
              <h4 className="font-bold mb-4" style={{ color: '#2F2F2F' }}>
                Key Insights
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b"
                  style={{ borderColor: '#E6E6EB' }}
                >
                  <span className="text-sm" style={{ color: '#9B6B8A' }}>Most Requests</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: '#9B6B8A' }}
                    ></div>
                    <span className="font-medium" style={{ color: '#2F2F2F' }}>Hydraulic Presses</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b"
                  style={{ borderColor: '#E6E6EB' }}
                >
                  <span className="text-sm" style={{ color: '#9B6B8A' }}>Least Requests</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: '#2E7D32' }}
                    ></div>
                    <span className="font-medium" style={{ color: '#2F2F2F' }}>Facilities</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b"
                  style={{ borderColor: '#E6E6EB' }}
                >
                  <span className="text-sm" style={{ color: '#9B6B8A' }}>Avg. Resolution Time</span>
                  <span className="font-medium" style={{ color: '#2F2F2F' }}>2.5 days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#9B6B8A' }}>MTTR (Mean Time To Repair)</span>
                  <span className="font-medium" style={{ color: '#2F2F2F' }}>3.1 days</span>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t"
                style={{ borderColor: '#E6E6EB' }}
              >
                <h5 className="font-medium mb-3 text-sm" style={{ color: '#2F2F2F' }}>
                  Equipment Categories
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {equipmentData.slice(0, 6).map((equipment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: equipment.color }}
                      ></div>
                      <span className="text-xs truncate" style={{ color: '#2F2F2F' }}>
                        {equipment.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="text-center text-sm pt-6 border-t"
          style={{ 
            borderColor: '#E6E6EB',
            color: '#9B6B8A'
          }}
        >
          <p>Report generated on {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p className="mt-1">Data updates in real-time | Last refresh: Just now</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceReports;