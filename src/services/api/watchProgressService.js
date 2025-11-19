import watchProgressData from '@/services/mockData/watchProgress.json'

class WatchProgressService {
  constructor() {
    this.watchProgress = [...watchProgressData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.watchProgress]
  }

  async getByContentId(contentId) {
    await this.delay()
    const progress = this.watchProgress.find(wp => wp.contentId === contentId.toString())
    return progress ? { ...progress } : null
  }

  async getContinueWatching() {
    await this.delay()
    return this.watchProgress
      .filter(wp => wp.progress > 0 && wp.progress < 1)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(wp => ({ ...wp }))
  }

  async updateProgress(contentId, progress) {
    await this.delay()
    const existingIndex = this.watchProgress.findIndex(wp => wp.contentId === contentId.toString())
    
    if (existingIndex >= 0) {
      this.watchProgress[existingIndex] = {
        ...this.watchProgress[existingIndex],
        progress,
        timestamp: Date.now(),
        completed: progress >= 0.95
      }
    } else {
      const newId = Math.max(...this.watchProgress.map(wp => wp.Id), 0) + 1
      this.watchProgress.push({
        Id: newId,
        contentId: contentId.toString(),
        progress,
        timestamp: Date.now(),
        completed: progress >= 0.95
      })
    }
    
    const updated = this.watchProgress.find(wp => wp.contentId === contentId.toString())
    return { ...updated }
  }

  async delete(contentId) {
    await this.delay()
    const index = this.watchProgress.findIndex(wp => wp.contentId === contentId.toString())
    if (index >= 0) {
      this.watchProgress.splice(index, 1)
      return true
    }
    return false
  }
}

export default new WatchProgressService()