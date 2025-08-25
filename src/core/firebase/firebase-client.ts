
import { Reference } from '@firebase/database-types';
import { admin } from './firebase-config';
import { generateUniqueId } from 'victor-dev-toolbox';


export type FirebaseCollections =
  | 'users'
  | 'plant-care-instructions'
  | 'user-plants_'
  | 'plant-health-history'
  | '_identified_-plants'
  | 'customized-user-instructions';
/**
 * FirebaseClient
 * All responses return data exactly as in the database (no {id, data} structures)
 */
export class FirebaseClient {
  private collection: FirebaseCollections;
  private db: Reference;

  constructor(collection: FirebaseCollections) {
    this.collection = collection;
    this.db = admin.database().ref(this.collection);
  }

  // LIST: Get all records in the collection (no keys, just data)
  async getAll(): Promise<any[]> {
    try {
      const snapshot = await this.db.once('value');
      if (!snapshot.exists()) return [];
      const records = snapshot.val();
      return Object.values(records);
    } catch (error: any) {
      return [];
    }
  }

  // READ: Get a record by ID (returns null or object as in DB)
  async getOne(id: string): Promise<any | null> {
    try {
      const snapshot = await this.db.child(id).once('value');
      if (!snapshot.exists()) return null;
      return snapshot.val();
    } catch (error: any) {
      throw new Error(`Error reading record: ${error.message}`);
    }
  }

  // QUERY: Get multiple records by a specific field value
  async getByField(field: string, value: any): Promise<any[]> {
    try {
      const snapshot = await this.db
        .orderByChild(field)
        .equalTo(value)
        .once('value');

      if (!snapshot.exists()) return [];

      return Object.values(snapshot.val());
    } catch (error: any) {
      throw new Error(`Error querying field "${field}": ${error.message}`);
    }
  }

  // QUERY: Get a single record by field
  async getOneByField(field: string, value: any): Promise<any | null> {
    const results = await this.getByField(field, value);
    return results[0] || null;
  }

  // CREATE: Add a new record to the collection (returns the object exactly as stored)
  async create(data: any): Promise<any> {
    delete data.createdAt;
    try {
      const id = data.id || generateUniqueId();
      const payload = {
        ...data,
        id,
        createdAt: new Date().toISOString(),
      };

      await this.db.child(id).set(payload);
      return payload;
    } catch (error: any) {
      throw new Error(`Error creating record: ${error.message}`);
    }
  }

  // UPDATE: Update an existing record by ID (returns the final object after update)
  async update(id: string, data: any): Promise<any> {
    try {
      await this.db.child(id).update(data);
      const updatedSnapshot = await this.db.child(id).once('value');
      return updatedSnapshot.val();
    } catch (error: any) {
      throw new Error(`Error updating record: ${error.message}`);
    }
  }

  // DELETE: Delete a record by ID (returns true on success)
  async delete(id: string): Promise<boolean> {
    try {
      await this.db.child(id).remove();
      return true;
    } catch (error: any) {
      throw new Error(`Error deleting record: ${error.message}`);
    }
  }

  // DELETE COLLECTION: Completely delete the entire collection
  async deleteCollection(): Promise<boolean> {
    try {
      await this.db.remove();
      return true;
    } catch (error: any) {
      throw new Error(`Error deleting collection: ${error.message}`);
    }
  }
}
