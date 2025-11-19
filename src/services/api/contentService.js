import contentData from '@/services/mockData/content.json'

class ContentService {
  constructor() {
    this.content = [...contentData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.content]
  }

  async getById(id) {
    await this.delay()
    const item = this.content.find(c => c.Id === parseInt(id))
    return item ? { ...item } : null
  }

  async getFeatured() {
    await this.delay()
    // Return a random featured item
    const randomIndex = Math.floor(Math.random() * this.content.length)
    return { ...this.content[randomIndex] }
  }

  async getByGenre(genre) {
    await this.delay()
    return this.content
      .filter(c => c.genre.includes(genre))
      .map(c => ({ ...c }))
  }

  async getByType(type) {
    await this.delay()
    return this.content
      .filter(c => c.type === type)
      .map(c => ({ ...c }))
  }

  async search(query) {
    await this.delay()
    const searchTerm = query.toLowerCase()
    return this.content
      .filter(c => 
        c.title.toLowerCase().includes(searchTerm) ||
        c.synopsis.toLowerCase().includes(searchTerm) ||
        c.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
        c.cast.some(actor => actor.toLowerCase().includes(searchTerm))
      )
      .map(c => ({ ...c }))
  }

  async getTrending() {
    await this.delay()
    // Return popular content based on rating
    return this.content
      .filter(c => parseFloat(c.rating) >= 8.5)
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .map(c => ({ ...c }))
  }

  async getNewReleases() {
    await this.delay()
    // Return recent content (2015 and later)
    return this.content
      .filter(c => c.releaseYear >= 2015)
      .sort((a, b) => b.releaseYear - a.releaseYear)
      .map(c => ({ ...c }))
  }
}

export default new ContentService()