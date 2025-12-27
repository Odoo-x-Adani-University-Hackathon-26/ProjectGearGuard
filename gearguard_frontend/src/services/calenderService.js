import api from './api';

const calendarService = {
  // Get maintenance schedule for a specific month
  getMaintenanceSchedule: async (year, month, params = {}) => {
    try {
      console.log(`📤 Fetching maintenance schedule for ${year}-${month}`);
      const response = await api.get('/maintenance/calendar', { 
        params: { year, month, ...params }
      });
      console.log('✅ Schedule fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get schedule error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch schedule' };
    }
  },

  // Get upcoming maintenance tasks
  getUpcomingTasks: async (days = 30) => {
    try {
      console.log(`📤 Fetching upcoming tasks for next ${days} days`);
      const response = await api.get('/maintenance/upcoming', { params: { days } });
      console.log('✅ Upcoming tasks fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get upcoming tasks error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch upcoming tasks' };
    }
  },

  // Schedule preventive maintenance
  scheduleMaintenance: async (scheduleData) => {
    try {
      console.log('📤 Scheduling maintenance:', scheduleData);
      const response = await api.post('/maintenance/schedule', scheduleData);
      console.log('✅ Maintenance scheduled:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Schedule maintenance error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to schedule maintenance' };
    }
  },

  // Update maintenance schedule
  updateSchedule: async (id, scheduleData) => {
    try {
      console.log(`📤 Updating schedule ${id}:`, scheduleData);
      const response = await api.put(`/maintenance/schedule/${id}`, scheduleData);
      console.log('✅ Schedule updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update schedule error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update schedule' };
    }
  },

  // Mark task as completed
  markAsCompleted: async (id, completionData) => {
    try {
      console.log(`📤 Marking task ${id} as completed:`, completionData);
      const response = await api.put(`/maintenance/${id}/complete`, completionData);
      console.log('✅ Task completed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Mark as completed error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to mark task as completed' };
    }
  },

  // Reschedule task
  rescheduleTask: async (id, newDate) => {
    try {
      console.log(`📤 Rescheduling task ${id} to ${newDate}`);
      const response = await api.put(`/maintenance/${id}/reschedule`, { newDate });
      console.log('✅ Task rescheduled:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Reschedule error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to reschedule task' };
    }
  },

  // Get maintenance statistics
  getMaintenanceStats: async () => {
    try {
      console.log('📤 Fetching maintenance statistics');
      const response = await api.get('/maintenance/calendar/stats');
      console.log('✅ Maintenance stats fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get maintenance stats error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch maintenance statistics' };
    }
  },

  // Get equipment maintenance history
  getEquipmentMaintenanceHistory: async (equipmentId) => {
    try {
      console.log(`📤 Fetching maintenance history for equipment ${equipmentId}`);
      const response = await api.get(`/maintenance/equipment/${equipmentId}/history`);
      console.log('✅ Equipment history fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get equipment history error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch equipment maintenance history' };
    }
  },

  // Get overdue tasks
  getOverdueTasks: async () => {
    try {
      console.log('📤 Fetching overdue tasks');
      const response = await api.get('/maintenance/overdue');
      console.log('✅ Overdue tasks fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get overdue tasks error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch overdue tasks' };
    }
  },
};

export default calendarService;