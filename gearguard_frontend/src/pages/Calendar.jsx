import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Wrench, Search, Filter, AlertCircle, CheckCircle, Settings, Droplets } from 'lucide-react';

const PreventiveMaintenanceCalendar = () => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const calendarDays = [
    { day: 1, events: [] },
    { day: 2, events: [] },
    { day: 3, events: [] },
    { day: 4, events: [] },
    { day: 5, events: [{ type: 'preventive', title: 'Preventive', color: '#E6F4EA', textColor: '#2E7D32' }] },
    { day: 6, events: [] },
    { day: 7, events: [] },
    { day: 8, events: [] },
    { day: 9, events: [] },
    { day: 10, events: [] },
    { day: 11, events: [] },
    { day: 12, events: [{ type: 'inspection', title: 'Inspection', color: '#E6F4EA', textColor: '#2E7D32' }] },
    { day: 13, events: [] },
    { day: 14, events: [] },
    { day: 15, events: [{ type: 'calibration', title: 'Calibration', color: '#FDECEA', textColor: '#C62828' }] },
    { day: 16, events: [] },
    { day: 17, events: [] },
    { day: 18, events: [] },
    { day: 19, events: [{ type: 'preventive', title: 'Preventive', color: '#E6F4EA', textColor: '#2E7D32' }] },
    { day: 20, events: [] },
    { day: 21, events: [] },
    { day: 22, events: [{ type: 'lubrication', title: 'Lubrication', color: '#FDECEA', textColor: '#C62828' }] },
    { day: 23, events: [] },
    { day: 24, events: [] },
    { day: 25, events: [] },
    { day: 26, events: [{ type: 'inspection', title: 'Inspection', color: '#E6F4EA', textColor: '#2E7D32' }] },
    { day: 27, events: [{ type: 'preventive', title: 'Preventive', color: '#E6F4EA', textColor: '#2E7D32' }] },
    { day: 28, events: [] },
    { day: 29, events: [] },
    { day: 30, events: [] },
    { day: 31, events: [] },
  ];

  const upcomingTasks = [
    { id: 1, title: 'CNC Machine Calibration', date: 'Dec 15, 2025', type: 'calibration', priority: 'high' },
    { id: 2, title: 'Monthly Equipment Inspection', date: 'Dec 12, 2025', type: 'inspection', priority: 'medium' },
    { id: 3, title: 'Quarterly Preventive Maintenance', date: 'Dec 5, 2025', type: 'preventive', priority: 'medium' },
    { id: 4, title: 'Conveyor System Lubrication', date: 'Dec 22, 2025', type: 'lubrication', priority: 'high' },
  ];

  const getEventIcon = (type) => {
    switch(type) {
      case 'preventive': return <Wrench className="w-3 h-3" />;
      case 'inspection': return <Search className="w-3 h-3" />;
      case 'calibration': return <Settings className="w-3 h-3" />;
      case 'lubrication': return <Droplets className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: { bg: '#FDECEA', text: '#C62828', label: 'High' },
      medium: { bg: '#FFF4E5', text: '#E65100', label: 'Medium' },
      low: { bg: '#E6F4EA', text: '#2E7D32', label: 'Low' }
    };
    const color = colors[priority] || colors.medium;
    
    return (
      <span 
        className="text-xs px-2 py-1 rounded-full font-medium"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {color.label}
      </span>
    );
  };

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
                Calendar
              </h1>
              <p className="text-gray-600" style={{ color: '#2F2F2F' }}>
                Preventive maintenance schedule overview
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:shadow-sm transition-shadow"
                style={{ 
                  borderColor: '#E6E6EB',
                  backgroundColor: 'white',
                  color: '#2F2F2F'
                }}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:shadow-sm transition-shadow"
                style={{ 
                  backgroundColor: '#7A4D6E',
                  color: 'white'
                }}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Add Schedule</span>
              </button>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="bg-white rounded-xl p-4 md:p-6 mb-6 border"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <h2 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>
                  December 2025
                </h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-50"
                    style={{ color: '#7A4D6E' }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-50"
                    style={{ color: '#7A4D6E' }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E6F4EA' }}></div>
                  <span className="text-sm" style={{ color: '#2F2F2F' }}>Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FDECEA' }}></div>
                  <span className="text-sm" style={{ color: '#2F2F2F' }}>Critical</span>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekDays.map((day) => (
                    <div 
                      key={day}
                      className="text-center py-3 font-medium text-sm"
                      style={{ 
                        color: '#9B6B8A',
                        borderBottom: '2px solid #E6E6EB'
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((dayData, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border rounded-lg ${
                        dayData.day === 26 ? 'col-span-2' : ''
                      }`}
                      style={{ 
                        borderColor: '#E6E6EB',
                        backgroundColor: dayData.events.length > 0 ? '#FFFFFF' : '#FFFFFF'
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span 
                          className={`text-sm font-medium ${
                            dayData.events.length > 0 ? 'font-bold' : ''
                          }`}
                          style={{ color: '#2F2F2F' }}
                        >
                          {dayData.day}
                        </span>
                        {dayData.events.length > 0 && (
                          <div className="flex gap-1">
                            {dayData.events.map((event, idx) => (
                              <div
                                key={idx}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: event.textColor }}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Events */}
                      <div className="space-y-1">
                        {dayData.events.map((event, idx) => (
                          <div
                            key={idx}
                            className="text-xs px-2 py-1.5 rounded flex items-center gap-1"
                            style={{ 
                              backgroundColor: event.color,
                              color: event.textColor,
                              border: `1px solid ${event.textColor}20`
                            }}
                          >
                            {getEventIcon(event.type)}
                            <span className="font-medium truncate">{event.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notes for overlapping events */}
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E6E6EB' }}>
                  <p className="text-sm" style={{ color: '#9B6B8A' }}>
                    <span className="font-medium" style={{ color: '#2F2F2F' }}>Note:</span> Some dates may have multiple overlapping maintenance tasks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 border"
              style={{ borderColor: '#E6E6EB' }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: '#2F2F2F' }}>
                Maintenance Legend
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#E6F4EA' }}>
                    <Wrench className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Preventive Maintenance</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Routine equipment checks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#FDECEA' }}>
                    <Settings className="w-5 h-5" style={{ color: '#C62828' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Calibration</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Precision adjustment tasks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#E6F4EA' }}>
                    <Search className="w-5 h-5" style={{ color: '#2E7D32' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Inspection</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Visual and functional checks</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: '#F6F2F5' }}
                >
                  <div className="p-2 rounded" style={{ backgroundColor: '#FDECEA' }}>
                    <Droplets className="w-5 h-5" style={{ color: '#C62828' }} />
                  </div>
                  <div>
                    <h4 className="font-medium" style={{ color: '#2F2F2F' }}>Lubrication</h4>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>Moving parts maintenance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl p-6 border h-fit"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: '#2F2F2F' }}>
                Upcoming Tasks
              </h3>
              <span className="text-sm px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: '#E6F4EA',
                  color: '#2E7D32'
                }}
              >
                4 tasks
              </span>
            </div>
            
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                  style={{ 
                    borderColor: '#E6E6EB',
                    backgroundColor: task.priority === 'high' ? '#FFF8F8' : '#FFFFFF'
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getEventIcon(task.type)}
                      <h4 className="font-medium" style={{ color: '#2F2F2F' }}>
                        {task.title}
                      </h4>
                    </div>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: '#7A4D6E' }} />
                      <span className="text-sm" style={{ color: '#9B6B8A' }}>
                        {task.date}
                      </span>
                    </div>
                    <CheckCircle className="w-4 h-4" style={{ color: '#2E7D32' }} />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-3 rounded-lg border hover:shadow-sm transition-shadow flex items-center justify-center gap-2"
              style={{ 
                borderColor: '#7A4D6E',
                color: '#7A4D6E'
              }}
            >
              <span>View All Tasks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreventiveMaintenanceCalendar;