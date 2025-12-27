import api from './api';

const teamService = {
  // Create team
  createTeam: async (teamData) => {
    try {
      console.log('📤 Creating team:', teamData.name);
      const response = await api.post('/teams', teamData);
      console.log('✅ Team created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create team error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to create team' };
    }
  },

  // Get all teams
  getAllTeams: async (params = {}) => {
    try {
      console.log('📤 Fetching teams');
      const response = await api.get('/teams', { params });
      console.log('✅ Teams fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get teams error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch teams' };
    }
  },

  // Get team by ID
  getTeamById: async (id) => {
    try {
      console.log(`📤 Fetching team ${id}`);
      const response = await api.get(`/teams/${id}`);
      console.log('✅ Team fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get team error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch team' };
    }
  },

  // Get team requests
  getTeamRequests: async (id, params = {}) => {
    try {
      console.log(`📤 Fetching requests for team ${id}`);
      const response = await api.get(`/teams/${id}/requests`, { params });
      console.log('✅ Team requests fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get team requests error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch team requests' };
    }
  },

  // Update team
  updateTeam: async (id, teamData) => {
    try {
      console.log(`📤 Updating team ${id}:`, teamData);
      const response = await api.put(`/teams/${id}`, teamData);
      console.log('✅ Team updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update team error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update team' };
    }
  },

  // Add team member
  addTeamMember: async (id, memberId) => {
    try {
      console.log(`📤 Adding member ${memberId} to team ${id}`);
      const response = await api.put(`/teams/${id}/add-member`, { memberId });
      console.log('✅ Member added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Add team member error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to add team member' };
    }
  },

  // Remove team member
  removeTeamMember: async (id, memberId) => {
    try {
      console.log(`📤 Removing member ${memberId} from team ${id}`);
      const response = await api.put(`/teams/${id}/remove-member`, { memberId });
      console.log('✅ Member removed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Remove team member error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to remove team member' };
    }
  },

  // Delete team
  deleteTeam: async (id) => {
    try {
      console.log(`📤 Deleting team ${id}`);
      const response = await api.delete(`/teams/${id}`);
      console.log('✅ Team deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete team error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to delete team' };
    }
  },
};

export default teamService;