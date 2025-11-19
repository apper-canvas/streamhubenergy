import { getApperClient } from '@/services/apperClient'

class MyListService {
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

  async getMyList() {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('myList_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "content_ids_c"}},
          {"field": {"Name": "added_timestamps_c"}},
          {"field": {"Name": "content_ref_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      const myListRecords = response.data || [];
      
      // Convert to the expected format
      const contentIds = myListRecords.map(record => record.content_ref_c?.Id?.toString()).filter(Boolean);
      const addedTimestamps = {};
      
      myListRecords.forEach(record => {
        if (record.content_ref_c?.Id && record.added_timestamps_c) {
          addedTimestamps[record.content_ref_c.Id.toString()] = new Date(record.added_timestamps_c).getTime();
        }
      });

      return {
        contentIds,
        addedTimestamps
      };
    } catch (error) {
      console.error("Error fetching My List:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async addToList(contentId) {
    try {
      const apperClient = await this.getApperClientInstance();
      
      // Check if already in list
      const existing = await apperClient.fetchRecords('myList_c', {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "content_ref_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contentId)],
          "Include": true
        }]
      });

      if (existing.success && existing.data && existing.data.length > 0) {
        // Already in list, return current state
        return await this.getMyList();
      }

      const response = await apperClient.createRecord('myList_c', {
        records: [{
          content_ids_c: contentId.toString(),
          added_timestamps_c: new Date().toISOString(),
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
          console.error(`Failed to add ${failed.length} records to My List:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
      }

      return await this.getMyList();
    } catch (error) {
      console.error("Error adding to My List:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async removeFromList(contentId) {
    try {
      const apperClient = await this.getApperClientInstance();
      
      // Find the record to delete
      const existing = await apperClient.fetchRecords('myList_c', {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "content_ref_c", 
          "Operator": "EqualTo",
          "Values": [parseInt(contentId)],
          "Include": true
        }]
      });

      if (!existing.success || !existing.data || existing.data.length === 0) {
        // Not in list, return current state
        return await this.getMyList();
      }

      const recordIds = existing.data.map(record => record.Id);
      
      const response = await apperClient.deleteRecord('myList_c', {
        RecordIds: recordIds
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records from My List:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
      }

      return await this.getMyList();
    } catch (error) {
      console.error("Error removing from My List:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async isInList(contentId) {
    try {
      const myListData = await this.getMyList();
      return myListData.contentIds.includes(contentId.toString());
    } catch (error) {
      console.error("Error checking if in My List:", error);
      return false;
    }
  }
}

export default new MyListService();