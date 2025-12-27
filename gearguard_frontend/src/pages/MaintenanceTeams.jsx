import React from 'react';
import { Users, AlertCircle, CheckCircle, Wrench, Zap, Droplets, Cpu } from 'lucide-react';

const MaintenanceTeams = () => {
  const teams = [
    {
      id: 1,
      name: 'Team Alpha',
      specialty: 'CNC & Machining',
      members: ['SC', 'MJ', 'TB'],
      memberCount: 3,
      activeRequests: 5,
      icon: <Wrench className="w-5 h-5" />,
      color: 'bg-purple-100'
    },
    {
      id: 2,
      name: 'Team Beta',
      specialty: 'Electrical Systems',
      members: ['EW', 'JD'],
      memberCount: 2,
      activeRequests: 3,
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-blue-50'
    },
    {
      id: 3,
      name: 'Team Gamma',
      specialty: 'Hydraulics & Pneumatics',
      members: ['AK', 'LW', 'DL', 'CP'],
      memberCount: 4,
      activeRequests: 7,
      icon: <Droplets className="w-5 h-5" />,
      color: 'bg-cyan-50'
    },
    {
      id: 4,
      name: 'Team Delta',
      specialty: 'Robotics & Automation',
      members: ['RM', 'KB'],
      memberCount: 2,
      activeRequests: 2,
      icon: <Cpu className="w-5 h-5" />,
      color: 'bg-emerald-50'
    }
  ];

  const totalActiveRequests = teams.reduce((sum, team) => sum + team.activeRequests, 0);
  const totalMembers = teams.reduce((sum, team) => sum + team.memberCount, 0);

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#F6F2F5' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#2F2F2F' }}>
            Maintenance Teams
          </h1>
          <p className="text-gray-600" style={{ color: '#2F2F2F' }}>
            Manage your maintenance teams and assignments
          </p>
          
          {/* Stats Overview */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white">
              <Users style={{ color: '#7A4D6E' }} />
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-lg font-semibold" style={{ color: '#2F2F2F' }}>{totalMembers}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white">
              <AlertCircle style={{ color: '#C62828' }} />
              <div>
                <p className="text-sm text-gray-600">Active Requests</p>
                <p className="text-lg font-semibold" style={{ color: '#2F2F2F' }}>{totalActiveRequests}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white">
              <CheckCircle style={{ color: '#2E7D32' }} />
              <div>
                <p className="text-sm text-gray-600">Teams</p>
                <p className="text-lg font-semibold" style={{ color: '#2F2F2F' }}>{teams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
              style={{ borderColor: '#E6E6EB' }}
            >
              {/* Team Header */}
              <div className={`p-4 ${team.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: '#7A4D6E' }}
                    >
                      <div className="text-white">
                        {team.icon}
                      </div>
                    </div>
                    <div>
                      <h3 
                        className="font-bold text-lg"
                        style={{ color: '#2F2F2F' }}
                      >
                        {team.name}
                      </h3>
                      <p className="text-sm" style={{ color: '#9B6B8A' }}>
                        {team.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" style={{ color: '#7A4D6E' }} />
                    <span className="text-sm font-medium" style={{ color: '#2F2F2F' }}>
                      {team.memberCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Team Content */}
              <div className="p-4">
                {/* Member Initials */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Team Members</p>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((member, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: '#F6F2F5',
                          color: '#7A4D6E',
                          border: '1px solid #E6E6EB'
                        }}
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4" style={{ borderColor: '#E6E6EB' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" style={{ color: '#C62828' }} />
                      <span className="text-sm" style={{ color: '#2F2F2F' }}>
                        Active Requests
                      </span>
                    </div>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        team.activeRequests > 5 
                          ? 'bg-red-50 text-red-700' 
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {team.activeRequests}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div 
                className="px-4 py-3 text-center border-t text-sm font-medium cursor-pointer transition-colors duration-200"
                style={{ 
                  borderColor: '#E6E6EB',
                  color: '#7A4D6E',
                  backgroundColor: '#F6F2F5'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9B6B8A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F6F2F5'}
              >
                View Details
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: '#E6E6EB' }}>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#2E7D32' }}></div>
              <span style={{ color: '#2F2F2F' }}>Low workload (&lt;= 5 requests)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#C62828' }}></div>
              <span style={{ color: '#2F2F2F' }}>High workload (&gt; 5 requests)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7A4D6E' }}></div>
              <span style={{ color: '#2F2F2F' }}>Team leader/manager</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTeams;