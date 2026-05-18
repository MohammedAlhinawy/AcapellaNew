// IndexedDB wrapper for local browser database
const DB_NAME = 'AcapellaDB';
const DB_VERSION = 1;

const STORES = {
  AUTH: 'auth',
};

class IndexedDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create auth store for authentication tokens and user data
        if (!db.objectStoreNames.contains(STORES.AUTH)) {
          const authStore = db.createObjectStore(STORES.AUTH, { keyPath: 'key' });
          authStore.createIndex('key', 'key', { unique: true });
        }
      };
    });
  }

  async get(storeName, key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(new Error(`Failed to get key: ${key}`));
    });
  }

  async set(storeName, key, value) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to set key: ${key}`));
    });
  }

  async delete(storeName, key) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete key: ${key}`));
    });
  }

  async clear(storeName) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to clear store: ${storeName}`));
    });
  }

  async getAll(storeName) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result.map(item => ({ key: item.key, value: item.value }));
        resolve(items);
      };
      request.onerror = () => reject(new Error(`Failed to get all from store: ${storeName}`));
    });
  }
}

// Export singleton instance
export const db = new IndexedDB();

// Export storage keys for auth
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'current_user',
};
