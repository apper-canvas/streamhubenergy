import myListData from '@/services/mockData/myList.json'

class MyListService {
  constructor() {
    this.myList = { ...myListData }
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getMyList() {
    await this.delay()
    return {
      contentIds: [...this.myList.contentIds],
      addedTimestamps: { ...this.myList.addedTimestamps }
    }
  }

  async addToList(contentId) {
    await this.delay()
    const id = contentId.toString()
    
    if (!this.myList.contentIds.includes(id)) {
      this.myList.contentIds.push(id)
      this.myList.addedTimestamps[id] = Date.now()
    }
    
    return {
      contentIds: [...this.myList.contentIds],
      addedTimestamps: { ...this.myList.addedTimestamps }
    }
  }

  async removeFromList(contentId) {
    await this.delay()
    const id = contentId.toString()
    
    const index = this.myList.contentIds.indexOf(id)
    if (index >= 0) {
      this.myList.contentIds.splice(index, 1)
      delete this.myList.addedTimestamps[id]
    }
    
    return {
      contentIds: [...this.myList.contentIds],
      addedTimestamps: { ...this.myList.addedTimestamps }
    }
  }

  async isInList(contentId) {
    await this.delay()
    return this.myList.contentIds.includes(contentId.toString())
  }
}

export default new MyListService()