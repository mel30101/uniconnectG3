class FirestoreChatRepository{
  constructor(db) {
    this.db = db;
  }

  async findById(chatId) {
    const doc = await this.db.collection('chats').doc(chatId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async create(chatId, chatData) {
    await this.db.collection('chats').doc(chatId).set({
      participants: chatData.participants,
      lastMessage: chatData.lastMessage || '',
      updatedAt: new Date()
    });
  }

  async updateLastMessage(chatId, text) {
    await this.db.collection('chats').doc(chatId).set({
      lastMessage: text,
      updatedAt: new Date()
    }, { merge: true });
  }

  async findByUserId(userId) {
    const snapshot = await this.db.collection('chats')
      .where('participants', 'array-contains', userId)
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = FirestoreChatRepository;
