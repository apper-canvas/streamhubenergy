import { getApperClient } from '@/services/apperClient'

class WatchProgressService {
  constructor() {
    // Identify lookup fields for special handling
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy', 'content_ref_c'];
  }

  async getApperClientInstance() {
    const client = getApperClient();
    if (!client) {
      throw new Error('ApperClient not available. Please ensure SDK is loaded.');
    }
    return client;
  }

  async getAll() {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('watchProgress_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "content_id_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "content_ref_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform to match expected format
      return (response.data || []).map(record => ({
        Id: record.Id,
        contentId: record.content_id_c || record.content_ref_c?.Id?.toString(),
        progress: record.progress_c || 0,
        completed: record.completed_c || false,
        timestamp: new Date(record.timestamp_c || Date.now()).getTime()
      }));
    } catch (error) {
      console.error("Error fetching watch progress:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByContentId(contentId) {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('watchProgress_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "content_id_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "content_ref_c"}}
        ],
        where: [{
          "FieldName": "content_ref_c",
          "Operator": "EqualTo", 
          "Values": [parseInt(contentId)],
          "Include": true
        }]
      });

      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }

      const record = response.data[0];
      return {
        Id: record.Id,
        contentId: record.content_id_c || record.content_ref_c?.Id?.toString(),
        progress: record.progress_c || 0,
        completed: record.completed_c || false,
        timestamp: new Date(record.timestamp_c || Date.now()).getTime()
      };
    } catch (error) {
      console.error(`Error fetching watch progress for content ${contentId}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getContinueWatching() {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('watchProgress_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "content_id_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "timestamp_c"}},
          {"field": {"Name": "content_ref_c"}}
        ],
        where: [
          {
            "FieldName": "progress_c",
            "Operator": "GreaterThan",
            "Values": ["0"],
            "Include": true
          },
          {
            "FieldName": "progress_c", 
            "Operator": "LessThan",
            "Values": ["1"],
            "Include": true
          }
        ],
        orderBy: [{
          "fieldName": "timestamp_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform to match expected format
      return (response.data || []).map(record => ({
        Id: record.Id,
        contentId: record.content_id_c || record.content_ref_c?.Id?.toString(),
        progress: record.progress_c || 0,
        completed: record.completed_c || false,
        timestamp: new Date(record.timestamp_c || Date.now()).getTime()
      }));
    } catch (error) {
      console.error("Error fetching continue watching:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateProgress(contentId, progress) {
    try {
      const apperClient = await this.getApperClientInstance();
      
      // Check if record exists
      const existing = await apperClient.fetchRecords('watchProgress_c', {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "content_ref_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contentId)],
          "Include": true
        }]
      });

      const completed = progress >= 0.95;
      const timestamp = new Date().toISOString();

      if (existing.success && existing.data && existing.data.length > 0) {
        // Update existing record
        const recordId = existing.data[0].Id;
        const response = await apperClient.updateRecord('watchProgress_c', {
          records: [{
            Id: recordId,
            content_id_c: contentId.toString(),
            progress_c: progress,
            completed_c: completed,
            timestamp_c: timestamp,
            content_ref_c: parseInt(contentId)
          }]
        });

        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }

        if (response.results) {
          const failed = response.results.filter(r => !r.success);
          if (failed.length > 0) {
            console.error(`Failed to update ${failed.length} progress records:`, failed);
          }
        }
      } else {
        // Create new record
        const response = await apperClient.createRecord('watchProgress_c', {
          records: [{
            content_id_c: contentId.toString(),
            progress_c: progress,
            completed_c: completed,
            timestamp_c: timestamp,
            content_ref_c: parseInt(contentId)
          }]
        });

        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }

        if (response.results) {
          const failed = response.results.filter(r => !r.success);
          if (failed.length > 0) {
            console.error(`Failed to create ${failed.length} progress records:`, failed);
          }
        }
      }

      return {
        Id: existing.data?.[0]?.Id || Date.now(),
        contentId: contentId.toString(),
        progress,
        completed,
        timestamp: new Date(timestamp).getTime()
      };
    } catch (error) {
      console.error("Error updating watch progress:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(contentId) {
    try {
      const apperClient = await this.getApperClientInstance();
      
      // Find records to delete
      const existing = await apperClient.fetchRecords('watchProgress_c', {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "content_ref_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contentId)],
          "Include": true
        }]
      });

      if (!existing.success || !existing.data || existing.data.length === 0) {
        return false;
      }

      const recordIds = existing.data.map(record => record.Id);
      
      const response = await apperClient.deleteRecord('watchProgress_c', {
        RecordIds: recordIds
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} progress records:`, failed);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting watch progress:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new WatchProgressService();