import React, { useState, useEffect } from 'react';
import { 
  Users, AlertCircle, CheckCircle, Wrench, Zap, Droplets, Cpu, 
  Plus, X, User, Mail, Trash2, Edit, Save, Clock, Award, Shield, 
  Activity, Briefcase, Calendar, ChevronLeft, ChevronRight, Filter, Search 
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const MaintenanceTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamLeader: '',
    specializations: []
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    teamLeader: '',
    specializations: []
  });
  const [newSpecialization, setNewSpecialization] = useState('');
  const [editNewSpecialization, setEditNewSpecialization] = useState('');
  const [teamStats, setTeamStats] = useState({
    completedTasks: 0,
    ongoingTasks: 0,
    efficiency: 0,
    avgResponseTime: '0h'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  useEffect(() => {
    fetchTeams();
    fetchAvailableUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/maintenance-teams`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching teams:', err);
      setTeams(getMockTeams());
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/maintenance-teams/users/available`);
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTeamDetails = async (teamId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/maintenance-teams/${teamId}`);
      if (response.ok) {
        const teamDetails = await response.json();
        setSelectedTeam(teamDetails);
        
        // Fetch team statistics
        const statsResponse = await fetch(`${API_BASE_URL}/maintenance-teams/${teamId}/stats`);
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setTeamStats(stats);
        } else {
          // Fallback to mock stats
          setTeamStats({
            completedTasks: Math.floor(Math.random() * 50) + 20,
            ongoingTasks: teamDetails.activeRequests || Math.floor(Math.random() * 10) + 1,
            efficiency: Math.floor(Math.random() * 30) + 70,
            avgResponseTime: `${Math.floor(Math.random() * 6) + 1}h ${Math.floor(Math.random() * 60)}m`
          });
        }
      }
    } catch (err) {
      console.error('Error fetching team details:', err);
    }
  };

  const handleViewDetails = async (team) => {
  try {
    // Fetch team details from API
    const response = await fetch(`${API_BASE_URL}/maintenance-teams/${team._id || team.id}`);
    if (response.ok) {
      const teamDetails = await response.json();
      setSelectedTeam(teamDetails);
      setShowViewModal(true);
    } else {
      // If API fails, use mock data
      setSelectedTeam({
        ...team,
        description: team.description || 'No description available',
        createdAt: team.createdAt || new Date().toISOString(),
        teamLeader: team.teamLeader || { name: 'No leader assigned', email: '', role: '' }
      });
      setShowViewModal(true);
    }
  } catch (err) {
    console.error('Error fetching team details:', err);
    // Use mock data as fallback
    setSelectedTeam({
      ...team,
      description: team.description || 'No description available',
      createdAt: team.createdAt || new Date().toISOString(),
      teamLeader: team.teamLeader || { name: 'No leader assigned', email: '', role: '' }
    });
    setShowViewModal(true);
  }
};

  const handleEditTeam = async (team) => {
    await fetchTeamDetails(team._id || team.id);
    
    // Prepare edit form data
    setEditFormData({
      name: team.name,
      description: team.description || '',
      teamLeader: team.teamLeader?._id || team.teamLeader || '',
      specializations: team.specializations || []
    });
    
    // Set selected members
    if (team.members && team.members.length > 0) {
      const memberIds = team.members.map(member => member._id || member);
      setSelectedMembers(memberIds);
    } else {
      setSelectedMembers([]);
    }
    
    setShowEditModal(true);
    setShowViewModal(false);
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/maintenance-teams/${teamId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete team');
        }

        setTeams(teams.filter(team => team._id !== teamId));
        if (showViewModal && selectedTeam && selectedTeam._id === teamId) {
          setShowViewModal(false);
        }
        if (showEditModal && selectedTeam && selectedTeam._id === teamId) {
          setShowEditModal(false);
        }
        alert('Team deleted successfully!');
      } catch (err) {
        alert('Error deleting team: ' + err.message);
      }
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      const teamData = {
        ...editFormData,
        members: selectedMembers
      };

      const response = await fetch(`${API_BASE_URL}/maintenance-teams/${selectedTeam._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData)
      });

      if (!response.ok) {
        throw new Error('Failed to update team');
      }

      const updatedTeam = await response.json();
      
      // Update the teams list
      setTeams(teams.map(team => 
        team._id === selectedTeam._id ? updatedTeam : team
      ));
      
      // Update selected team
      setSelectedTeam(updatedTeam);
      
      setShowEditModal(false);
      setShowViewModal(true);
      alert('Team updated successfully!');
    } catch (err) {
      alert('Error updating team: ' + err.message);
    }
  };

  // Mock data fallback
  const getMockTeams = () => {
    return [
      {
        _id: '1',
        name: 'Team Alpha',
        description: 'Specializes in CNC and machining equipment maintenance',
        specializations: ['CNC', 'Machining', 'Precision Equipment'],
        teamLeader: { _id: '1', name: 'John Smith', email: 'john@example.com', role: 'manager' },
        members: [
          { _id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'technician', avatar: null },
          { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'technician', avatar: null }
        ],
        memberCount: 3,
        activeRequests: 5,
        color: 'bg-purple-100',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        _id: '2',
        name: 'Team Beta',
        description: 'Electrical systems and power maintenance specialists',
        specializations: ['Electrical Systems', 'Power Distribution'],
        teamLeader: { _id: '1', name: 'John Smith', email: 'john@example.com', role: 'manager' },
        members: [
          { _id: '4', name: 'Emma Wilson', email: 'emma@example.com', role: 'technician', avatar: null },
          { _id: '5', name: 'David Brown', email: 'david@example.com', role: 'technician', avatar: null }
        ],
        memberCount: 2,
        activeRequests: 3,
        color: 'bg-blue-50',
        createdAt: '2024-02-20T14:15:00Z'
      },
      {
        _id: '3',
        name: 'Team Gamma',
        description: 'Hydraulic and pneumatic systems experts',
        specializations: ['Hydraulics', 'Pneumatics', 'Fluid Systems'],
        teamLeader: { _id: '6', name: 'Robert Miller', email: 'robert@example.com', role: 'manager' },
        members: [
          { _id: '7', name: 'Lisa Taylor', email: 'lisa@example.com', role: 'technician', avatar: null },
          { _id: '8', name: 'Alex Kim', email: 'alex@example.com', role: 'technician', avatar: null },
          { _id: '9', name: 'Karen Baker', email: 'karen@example.com', role: 'technician', avatar: null }
        ],
        memberCount: 4,
        activeRequests: 7,
        color: 'bg-cyan-50',
        createdAt: '2024-03-10T09:45:00Z'
      },
      {
        _id: '4',
        name: 'Team Delta',
        description: 'Robotics and automation maintenance specialists',
        specializations: ['Robotics', 'Automation', 'PLC Programming'],
        teamLeader: { _id: '10', name: 'James Wilson', email: 'james@example.com', role: 'manager' },
        members: [
          { _id: '11', name: 'Sophia Garcia', email: 'sophia@example.com', role: 'technician', avatar: null },
          { _id: '12', name: 'Michael Chen', email: 'michael@example.com', role: 'technician', avatar: null }
        ],
        memberCount: 2,
        activeRequests: 2,
        color: 'bg-emerald-50',
        createdAt: '2024-03-25T16:20:00Z'
      }
    ];
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const teamData = {
        ...formData,
        members: selectedMembers
      };

      const response = await fetch(`${API_BASE_URL}/maintenance-teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData)
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      const newTeam = await response.json();
      setTeams([...teams, newTeam]);
      setShowAddModal(false);
      resetForm();
      
      alert('Team created successfully!');
    } catch (err) {
      alert('Error creating team: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      teamLeader: '',
      specializations: []
    });
    setSelectedMembers([]);
    setNewSpecialization('');
  };

  const addSpecialization = (isEdit = false) => {
    const spec = isEdit ? editNewSpecialization : newSpecialization;
    const currentSpecs = isEdit ? editFormData.specializations : formData.specializations;
    const setForm = isEdit ? setEditFormData : setFormData;
    const setNewSpec = isEdit ? setEditNewSpecialization : setNewSpecialization;

    if (spec.trim() && !currentSpecs.includes(spec.trim())) {
      setForm({
        ...(isEdit ? editFormData : formData),
        specializations: [...currentSpecs, spec.trim()]
      });
      setNewSpec('');
    }
  };

  const removeSpecialization = (index, isEdit = false) => {
    const currentSpecs = isEdit ? editFormData.specializations : formData.specializations;
    const setForm = isEdit ? setEditFormData : setFormData;
    
    const updated = [...currentSpecs];
    updated.splice(index, 1);
    setForm({ 
      ...(isEdit ? editFormData : formData), 
      specializations: updated 
    });
  };

  const toggleMemberSelection = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const getTeamIcon = (specialty) => {
    if (specialty?.toLowerCase().includes('cnc') || specialty?.toLowerCase().includes('machining')) {
      return <Wrench className="w-5 h-5" />;
    } else if (specialty?.toLowerCase().includes('electrical')) {
      return <Zap className="w-5 h-5" />;
    } else if (specialty?.toLowerCase().includes('hydraulic') || specialty?.toLowerCase().includes('pneumatic')) {
      return <Droplets className="w-5 h-5" />;
    } else if (specialty?.toLowerCase().includes('robot') || specialty?.toLowerCase().includes('automation')) {
      return <Cpu className="w-5 h-5" />;
    }
    return <Wrench className="w-5 h-5" />;
  };

  const getTeamColor = (index) => {
    const colors = ['bg-purple-100', 'bg-blue-50', 'bg-cyan-50', 'bg-emerald-50'];
    return colors[index % colors.length];
  };

  const getMemberInitials = (name) => {
    if (!name) return 'UU';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter teams based on search and filter
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterSpecialty === 'all' || 
      (team.specializations?.some(spec => 
        spec.toLowerCase().includes(filterSpecialty.toLowerCase())
      ));
    
    return matchesSearch && matchesFilter;
  });

  // Get unique specializations for filter
  const allSpecializations = [...new Set(
    teams.flatMap(team => team.specializations || [])
  )];

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: '#F6F2F5' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#7A4D6E' }}></div>
          <p style={{ color: '#2F2F2F' }}>Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error && teams.length === 0) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: '#F6F2F5' }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchTeams}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#7A4D6E', color: 'white' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalActiveRequests = teams.reduce((sum, team) => sum + (team.activeRequests || 0), 0);
  const totalMembers = teams.reduce((sum, team) => sum + (team.memberCount || team.members?.length || 0), 0);

  return (
    <div 
      className="min-h-screen p-4 md:p-6 lg:p-8"
      style={{ backgroundColor: '#F6F2F5' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#2F2F2F' }}>
                Maintenance Teams
              </h1>
              <p className="text-gray-600" style={{ color: '#2F2F2F' }}>
                Manage your maintenance teams and assignments
              </p>
            </div>
            
            {/* Add Team Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-md hover:bg-[#8B5B7E]"
              style={{ 
                backgroundColor: '#7A4D6E', 
                color: 'white',
                border: '1px solid #6A3D62'
              }}
            >
              <Plus className="w-5 h-5" />
              Add New Team
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#9B6B8A' }} />
              <input
                type="text"
                placeholder="Search teams by name, description, or specialization..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  borderColor: '#E6E6EB',
                  backgroundColor: 'white',
                  color: '#2F2F2F'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5" style={{ color: '#9B6B8A' }} />
              <select
                className="px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  borderColor: '#E6E6EB',
                  backgroundColor: 'white',
                  color: '#2F2F2F'
                }}
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                <option value="all">All Specializations</option>
                {allSpecializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
          
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
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white">
              <div className="w-5 h-5 flex items-center justify-center" style={{ color: '#7A4D6E' }}>
                <span className="font-bold">{filteredTeams.length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Filtered</p>
                <p className="text-lg font-semibold" style={{ color: '#2F2F2F' }}>{filteredTeams.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border" style={{ borderColor: '#E6E6EB' }}>
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#9B6B8A' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#2F2F2F' }}>No teams found</h3>
            <p className="text-sm mb-4" style={{ color: '#666' }}>
              {searchTerm || filterSpecialty !== 'all' 
                ? 'Try changing your search or filter criteria'
                : 'No maintenance teams available'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSpecialty('all');
              }}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ 
                backgroundColor: '#F6F2F5',
                color: '#7A4D6E',
                border: '1px solid #E6E6EB'
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeams.map((team, index) => (
              <div
                key={team._id || team.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
                style={{ borderColor: '#E6E6EB' }}
              >
                {/* Team Header */}
                <div className={`p-4 ${getTeamColor(index)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: '#7A4D6E' }}
                      >
                        <div className="text-white">
                          {getTeamIcon(team.specializations?.[0] || team.specialty)}
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
                          {team.specializations?.join(', ') || team.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" style={{ color: '#7A4D6E' }} />
                      <span className="text-sm font-medium" style={{ color: '#2F2F2F' }}>
                        {team.memberCount || team.members?.length || 0}
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
                      {team.members?.slice(0, 4).map((member, memberIndex) => (
                        <div
                          key={member._id || memberIndex}
                          className="px-3 py-1.5 rounded-md text-sm font-medium"
                          style={{
                            backgroundColor: '#F6F2F5',
                            color: '#7A4D6E',
                            border: '1px solid #E6E6EB'
                          }}
                        >
                          {typeof member === 'string' 
                            ? member 
                            : getMemberInitials(member.name || 'UU')}
                        </div>
                      ))}
                      {team.members?.length > 4 && (
                        <div
                          className="px-3 py-1.5 rounded-md text-sm font-medium"
                          style={{
                            backgroundColor: '#F6F2F5',
                            color: '#7A4D6E',
                            border: '1px solid #E6E6EB'
                          }}
                        >
                          +{team.members.length - 4}
                        </div>
                      )}
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
                          (team.activeRequests || 0) > 5 
                            ? 'bg-red-50 text-red-700' 
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {team.activeRequests || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                {/* Footer */}
<button
  className="w-full px-4 py-3 text-center border-t text-sm font-medium transition-colors duration-200 hover:bg-[#9B6B8A] hover:text-white focus:outline-none"
  style={{ 
    borderColor: '#E6E6EB',
    color: '#7A4D6E',
    backgroundColor: '#F6F2F5'
  }}
  onClick={() => handleViewDetails(team)}
>
  View Details
</button>
              </div>
            ))}
          </div>
        )}

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

      {/* Add Team Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>Create New Maintenance Team</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" style={{ color: '#2F2F2F' }} />
                </button>
              </div>

              <form onSubmit={handleAddTeam}>
                {/* Team Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5',
                      color: '#2F2F2F'
                    }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter team name"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5',
                      color: '#2F2F2F'
                    }}
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter team description"
                  />
                </div>

                {/* Team Leader */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Team Leader
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5',
                      color: '#2F2F2F'
                    }}
                    value={formData.teamLeader}
                    onChange={(e) => setFormData({...formData, teamLeader: e.target.value})}
                  >
                    <option value="">Select Team Leader</option>
                    {availableUsers.filter(user => user.role === 'manager').map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Specializations
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ 
                        borderColor: '#E6E6EB',
                        backgroundColor: '#F6F2F5',
                        color: '#2F2F2F'
                      }}
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization(false))}
                      placeholder="Add specialization (e.g., CNC, Electrical)"
                    />
                    <button
                      type="button"
                      onClick={() => addSpecialization(false)}
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: '#7A4D6E', 
                        color: 'white'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Specializations List */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-md text-sm"
                        style={{
                          backgroundColor: '#F6F2F5',
                          color: '#7A4D6E',
                          border: '1px solid #E6E6EB'
                        }}
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index, false)}
                          className="ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Team Members
                  </label>
                  <div 
                    className="border rounded-lg p-3 max-h-60 overflow-y-auto"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5'
                    }}
                  >
                    {availableUsers.length === 0 ? (
                      <p className="text-center py-4" style={{ color: '#666' }}>
                        No users available
                      </p>
                    ) : (
                      availableUsers.map(user => (
                        <div
                          key={user._id}
                          className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer transition-colors ${
                            selectedMembers.includes(user._id) ? 'bg-white border' : 'hover:bg-white hover:border'
                          }`}
                          style={{ 
                            borderColor: selectedMembers.includes(user._id) ? '#7A4D6E' : '#E6E6EB'
                          }}
                          onClick={() => toggleMemberSelection(user._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                              style={{ backgroundColor: '#7A4D6E' }}
                            >
                              {getMemberInitials(user.name)}
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: '#2F2F2F' }}>
                                {user.name}
                              </p>
                              <p className="text-sm flex items-center gap-1" style={{ color: '#666' }}>
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="px-2 py-1 text-xs rounded"
                              style={{ 
                                backgroundColor: user.role === 'manager' ? '#7A4D6E20' : '#E6E6EB',
                                color: user.role === 'manager' ? '#7A4D6E' : '#666'
                              }}
                            >
                              {user.role}
                            </span>
                            {selectedMembers.includes(user._id) && (
                              <CheckCircle className="w-5 h-5" style={{ color: '#2E7D32' }} />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E6E6EB' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 rounded-lg font-medium border transition-colors hover:bg-[#E6E6EB]"
                    style={{ 
                      borderColor: '#E6E6EB',
                      color: '#2F2F2F',
                      backgroundColor: '#F6F2F5'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[#8B5B7E]"
                    style={{ 
                      backgroundColor: '#7A4D6E', 
                      color: 'white',
                      border: '1px solid #6A3D62'
                    }}
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: '#7A4D6E' }}
                  >
                    <div className="text-white">
                      {getTeamIcon(selectedTeam.specializations?.[0])}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: '#2F2F2F' }}>
                      {selectedTeam.name}
                    </h2>
                    <p className="text-sm" style={{ color: '#9B6B8A' }}>
                      {selectedTeam.specializations?.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditTeam(selectedTeam)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Edit Team"
                  >
                    <Edit className="w-5 h-5" style={{ color: '#7A4D6E' }} />
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" style={{ color: '#2F2F2F' }} />
                  </button>
                </div>
              </div>

              {/* Team Description */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F6F2F5' }}>
                <p className="text-sm" style={{ color: '#2F2F2F' }}>
                  {selectedTeam.description || 'No description available'}
                </p>
              </div>

              {/* Team Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E6E6EB' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4" style={{ color: '#2E7D32' }} />
                    <p className="text-sm" style={{ color: '#666' }}>Completed Tasks</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#2F2F2F' }}>
                    {teamStats.completedTasks}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E6E6EB' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4" style={{ color: '#C62828' }} />
                    <p className="text-sm" style={{ color: '#666' }}>Ongoing Tasks</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#2F2F2F' }}>
                    {selectedTeam.activeRequests || teamStats.ongoingTasks}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E6E6EB' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4" style={{ color: '#FF9800' }} />
                    <p className="text-sm" style={{ color: '#666' }}>Efficiency</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#2F2F2F' }}>
                    {teamStats.efficiency}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E6E6EB' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" style={{ color: '#2196F3' }} />
                    <p className="text-sm" style={{ color: '#666' }}>Avg Response</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#2F2F2F' }}>
                    {teamStats.avgResponseTime}
                  </p>
                </div>
              </div>

              {/* Team Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Team Leader */}
                <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E6E6EB' }}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#2F2F2F' }}>
                    <Shield className="w-4 h-4" />
                    Team Leader
                  </h3>
                  {selectedTeam.teamLeader ? (
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: '#7A4D6E' }}
                      >
                        {getMemberInitials(selectedTeam.teamLeader.name)}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2F2F2F' }}>
                          {selectedTeam.teamLeader.name}
                        </p>
                        <p className="text-sm flex items-center gap-1" style={{ color: '#666' }}>
                          <Mail className="w-3 h-3" />
                          {selectedTeam.teamLeader.email}
                        </p>
                        <p className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
                           style={{ backgroundColor: '#7A4D6E20', color: '#7A4D6E' }}>
                          {selectedTeam.teamLeader.role}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: '#666' }}>No team leader assigned</p>
                  )}
                </div>

                {/* Team Information */}
                <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E6E6EB' }}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#2F2F2F' }}>
                    <Briefcase className="w-4 h-4" />
                    Team Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#666' }}>Total Members:</span>
                      <span className="font-medium" style={{ color: '#2F2F2F' }}>
                        {selectedTeam.memberCount || selectedTeam.members?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#666' }}>Active Requests:</span>
                      <span className="font-medium" style={{ color: '#2F2F2F' }}>
                        {selectedTeam.activeRequests || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm" style={{ color: '#666' }}>Created On:</span>
                      <span className="font-medium" style={{ color: '#2F2F2F' }}>
                        {formatDate(selectedTeam.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#2F2F2F' }}>
                  <Users className="w-4 h-4" />
                  Team Members ({selectedTeam.members?.length || 0})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTeam.members && selectedTeam.members.length > 0 ? (
                    selectedTeam.members.map((member, index) => (
                      <div 
                        key={member._id || index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        style={{ 
                          borderColor: '#E6E6EB',
                          backgroundColor: '#F6F2F5'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ backgroundColor: '#7A4D6E' }}
                          >
                            {getMemberInitials(member.name)}
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: '#2F2F2F' }}>
                              {member.name}
                            </p>
                            <p className="text-sm flex items-center gap-1" style={{ color: '#666' }}>
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <span 
                          className="px-2 py-1 text-xs rounded"
                          style={{ 
                            backgroundColor: member.role === 'manager' ? '#7A4D6E20' : '#E6E6EB',
                            color: member.role === 'manager' ? '#7A4D6E' : '#666'
                          }}
                        >
                          {member.role}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center py-4" style={{ color: '#666' }}>
                      No team members assigned
                    </p>
                  )}
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#2F2F2F' }}>
                  <Award className="w-4 h-4" />
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTeam.specializations && selectedTeam.specializations.length > 0 ? (
                    selectedTeam.specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 rounded-md text-sm font-medium"
                        style={{
                          backgroundColor: '#F6F2F5',
                          color: '#7A4D6E',
                          border: '1px solid #E6E6EB'
                        }}
                      >
                        {spec}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: '#666' }}>No specializations listed</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E6E6EB' }}>
                <button
                  type="button"
                  onClick={() => handleDeleteTeam(selectedTeam._id || selectedTeam.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors hover:bg-red-50"
                  style={{ 
                    borderColor: '#F44336',
                    color: '#F44336',
                    backgroundColor: 'white'
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Team
                </button>
                <button
                  type="button"
                  onClick={() => handleEditTeam(selectedTeam)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border transition-colors hover:bg-[#E6E6EB]"
                  style={{ 
                    borderColor: '#E6E6EB',
                    color: '#2F2F2F',
                    backgroundColor: '#F6F2F5'
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Edit Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[#8B5B7E]"
                  style={{ 
                    backgroundColor: '#7A4D6E', 
                    color: 'white',
                    border: '1px solid #6A3D62'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {showEditModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ borderColor: '#E6E6EB' }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#2F2F2F' }}>
                  Edit {selectedTeam.name}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowViewModal(true);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" style={{ color: '#2F2F2F' }} />
                </button>
              </div>

              <form onSubmit={handleUpdateTeam}>
                {/* Team Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5',
                      color: '#2F2F2F'
                    }}
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    placeholder="Enter team name"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5',
                      color: '#2F2F2F'
                    }}
                    rows="3"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    placeholder="Enter team description"
                  />
                </div>

                {/* Team Leader */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Team Leader
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5',
                      color: '#2F2F2F'
                    }}
                    value={editFormData.teamLeader}
                    onChange={(e) => setEditFormData({...editFormData, teamLeader: e.target.value})}
                  >
                    <option value="">Select Team Leader</option>
                    {availableUsers.filter(user => user.role === 'manager').map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Specializations
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ 
                        borderColor: '#E6E6EB',
                        backgroundColor: '#F6F2F5',
                        color: '#2F2F2F'
                      }}
                      value={editNewSpecialization}
                      onChange={(e) => setEditNewSpecialization(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization(true))}
                      placeholder="Add specialization (e.g., CNC, Electrical)"
                    />
                    <button
                      type="button"
                      onClick={() => addSpecialization(true)}
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ 
                        backgroundColor: '#7A4D6E', 
                        color: 'white'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Specializations List */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editFormData.specializations.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-md text-sm"
                        style={{
                          backgroundColor: '#F6F2F5',
                          color: '#7A4D6E',
                          border: '1px solid #E6E6EB'
                        }}
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index, true)}
                          className="ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#2F2F2F' }}>
                    Team Members
                  </label>
                  <div 
                    className="border rounded-lg p-3 max-h-60 overflow-y-auto"
                    style={{ 
                      borderColor: '#E6E6EB',
                      backgroundColor: '#F6F2F5'
                    }}
                  >
                    {availableUsers.length === 0 ? (
                      <p className="text-center py-4" style={{ color: '#666' }}>
                        No users available
                      </p>
                    ) : (
                      availableUsers.map(user => (
                        <div
                          key={user._id}
                          className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer transition-colors ${
                            selectedMembers.includes(user._id) ? 'bg-white border' : 'hover:bg-white hover:border'
                          }`}
                          style={{ 
                            borderColor: selectedMembers.includes(user._id) ? '#7A4D6E' : '#E6E6EB'
                          }}
                          onClick={() => toggleMemberSelection(user._id)}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                              style={{ backgroundColor: '#7A4D6E' }}
                            >
                              {getMemberInitials(user.name)}
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: '#2F2F2F' }}>
                                {user.name}
                              </p>
                              <p className="text-sm flex items-center gap-1" style={{ color: '#666' }}>
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="px-2 py-1 text-xs rounded"
                              style={{ 
                                backgroundColor: user.role === 'manager' ? '#7A4D6E20' : '#E6E6EB',
                                color: user.role === 'manager' ? '#7A4D6E' : '#666'
                              }}
                            >
                              {user.role}
                            </span>
                            {selectedMembers.includes(user._id) && (
                              <CheckCircle className="w-5 h-5" style={{ color: '#2E7D32' }} />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#666' }}>
                    Selected: {selectedMembers.length} member(s)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E6E6EB' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setShowViewModal(true);
                    }}
                    className="px-4 py-2 rounded-lg font-medium border transition-colors hover:bg-[#E6E6EB]"
                    style={{ 
                      borderColor: '#E6E6EB',
                      color: '#2F2F2F',
                      backgroundColor: '#F6F2F5'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[#8B5B7E]"
                    style={{ 
                      backgroundColor: '#7A4D6E', 
                      color: 'white',
                      border: '1px solid #6A3D62'
                    }}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTeams;