const { generateUniqueId, searchObjectsByFields, getFieldValuesFromArray } = require('victor-dev-toolbox');
import { Reference } from '@firebase/database-types';
import * as admin from 'firebase-admin';

/**
 * NOTE:
 * Most of the code in this FirebaseClient class was provided by Firebase, and the victor-dev-toolbox npm package
 */
export class FirebaseClient {
  private collection: string = '';
  private db: Reference;
  constructor(collection: string) {
    this.collection = collection;
    this.db = admin.database().ref(this.collection);
  }


  // LIST: Get all records in the collection
  async getAll(): Promise<any[]> {
    try {
      const snapshot = await this.db.once('value'); // Get all records
      if (!snapshot.exists()) {
        // throw new Error('No records found');
        return [];
      }

      const records = snapshot.val(); // Get the full object with IDs as keys
      return Object.values(records); // Return just the objects, not the keys
    } catch (error: any) {
      //   throw new Error(`Error listing records: ${error.message}`);
      return [];
    }
  }

  // READ: Get a record by ID
  async getOne(id: string): Promise<any> {
    try {
      const ref = this.db.child(id); // Reference to a specific record
      const snapshot = await ref.once('value'); // Get the data
      if (!snapshot.exists()) {
        // throw new Error('Record not found');
        return null;
      }
      return snapshot.val(); // Return the data
    } catch (error: any) {
      throw new Error(`Error reading record: ${error.message}`);
    }
  }

  // CREATE: Add a new record to the collection
  async create(data: any): Promise<any> {
    try {
      // Generate a unique ID (you can replace this with your custom ID generator)
      const id = data.id || generateUniqueId();
      data.id = id; // Ensure data has the generated id
      data.createdAt = new Date().toISOString();
      const newRecordRef = this.db.child(id); // Use the generated ID as the key
      await newRecordRef.set(data); // Set the data at the generated ID
      return { id, data }; // Return the id and data

    } catch (error: any) {
      throw new Error(`Error creating record: ${error.message}`);
    }
  }

  // UPDATE: Update an existing record by ID
  async update(id: string, data: any): Promise<any> {
    try {
      const ref = this.db.child(id); // Reference to the specific record
      await ref.update(data); // Update the record with new data
      return { id, data };
    } catch (error: any) {
      throw new Error(`Error updating record: ${error.message}`);
    }
  }

  // DELETE: Delete a record by ID

  async delete(id: string): Promise<any> {
    try {
      const ref = this.db.child(id); // Reference to the specific record
      await ref.remove(); // Remove the record
      return { id };
    } catch (error: any) {
      throw new Error(`Error deleting record: ${error.message}`);
    }
  }


  async deleteCollection() {
    const ref = this.db.remove();
  }




}



