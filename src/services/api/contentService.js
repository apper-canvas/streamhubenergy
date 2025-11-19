import { getApperClient } from '@/services/apperClient'

class ContentService {
  constructor() {
    // Identify lookup fields for special handling
    this.lookupFields = ['Owner', 'CreatedBy', 'ModifiedBy'];
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
      const response = await apperClient.fetchRecords('content_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "synopsis_c"}},
          {"field": {"Name": "videoUrl_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "release_year_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "maturity_rating_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "genre_c"}},
          {"field": {"Name": "cast_c"}},
          {"field": {"Name": "director_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "backdrop_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching all content:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.getRecordById('content_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "synopsis_c"}},
          {"field": {"Name": "videoUrl_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "release_year_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "maturity_rating_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "genre_c"}},
          {"field": {"Name": "cast_c"}},
          {"field": {"Name": "director_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "backdrop_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getFeatured() {
    try {
      const allContent = await this.getAll();
      if (allContent.length === 0) return null;
      
      // Return a random featured item
      const randomIndex = Math.floor(Math.random() * allContent.length);
      return allContent[randomIndex];
    } catch (error) {
      console.error("Error fetching featured content:", error);
      throw error;
    }
  }

  async getByGenre(genre) {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('content_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "synopsis_c"}},
          {"field": {"Name": "videoUrl_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "release_year_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "maturity_rating_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "genre_c"}},
          {"field": {"Name": "cast_c"}},
          {"field": {"Name": "director_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "backdrop_c"}}
        ],
        where: [{
          "FieldName": "genre_c",
          "Operator": "Contains",
          "Values": [genre],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching content by genre ${genre}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByType(type) {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('content_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "synopsis_c"}},
          {"field": {"Name": "videoUrl_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "release_year_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "maturity_rating_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "genre_c"}},
          {"field": {"Name": "cast_c"}},
          {"field": {"Name": "director_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "backdrop_c"}}
        ],
        where: [{
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": [type],
          "Include": true
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching content by type ${type}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('content_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "synopsis_c"}},
          {"field": {"Name": "videoUrl_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "release_year_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "maturity_rating_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "genre_c"}},
          {"field": {"Name": "cast_c"}},
          {"field": {"Name": "director_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "backdrop_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "title_c",
                  "operator": "Contains",
                  "values": [query]
                },
                {
                  "fieldName": "synopsis_c", 
                  "operator": "Contains",
                  "values": [query]
                },
                {
                  "fieldName": "genre_c",
                  "operator": "Contains", 
                  "values": [query]
                },
                {
                  "fieldName": "cast_c",
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            }
          ]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error searching content for "${query}":`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getTrending() {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('content_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "synopsis_c"}},
          {"field": {"Name": "videoUrl_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "release_year_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "maturity_rating_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "genre_c"}},
          {"field": {"Name": "cast_c"}},
          {"field": {"Name": "director_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "backdrop_c"}}
        ],
        where: [{
          "FieldName": "rating_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": ["8.5"],
          "Include": true
        }],
        orderBy: [{
          "fieldName": "rating_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching trending content:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getNewReleases() {
    try {
      const apperClient = await this.getApperClientInstance();
      const response = await apperClient.fetchRecords('content_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "synopsis_c"}},
          {"field": {"Name": "videoUrl_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "release_year_c"}},
          {"field": {"Name": "rating_c"}},
          {"field": {"Name": "maturity_rating_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "genre_c"}},
          {"field": {"Name": "cast_c"}},
          {"field": {"Name": "director_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "backdrop_c"}}
        ],
        where: [{
          "FieldName": "release_year_c",
          "Operator": "GreaterThanOrEqualTo",
          "Values": ["2015"],
          "Include": true
        }],
        orderBy: [{
          "fieldName": "release_year_c",
          "sorttype": "DESC"
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching new releases:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export default new ContentService();