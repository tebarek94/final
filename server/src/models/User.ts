import pool from '../config/database';
import { User, RegisterRequest, UpdateProfileRequest } from '../types';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async create(userData: RegisterRequest): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const [result] = await pool.execute(
      `INSERT INTO users (
        email, password, first_name, last_name, age, gender, 
        weight, height, activity_level, fitness_goal, 
        dietary_preferences, allergies
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.email,
        hashedPassword,
        userData.first_name,
        userData.last_name,
        userData.age || null,
        userData.gender || null,
        userData.weight || null,
        userData.height || null,
        userData.activity_level || null,
        userData.fitness_goal || null,
        JSON.stringify(userData.dietary_preferences || []),
        JSON.stringify(userData.allergies || [])
      ]
    );

    const userId = (result as any).insertId;
    return this.findById(userId);
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    const users = rows as User[];
    if (users.length === 0) return null;

    const user = users[0];
    return {
      ...user,
      dietary_preferences: this.parseJsonField(user.dietary_preferences),
      allergies: this.parseJsonField(user.allergies),
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at)
    };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const users = rows as User[];
    if (users.length === 0) return null;

    const user = users[0];
    return {
      ...user,
      dietary_preferences: this.parseJsonField(user.dietary_preferences),
      allergies: this.parseJsonField(user.allergies),
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at)
    };
  }

  static async update(id: number, updateData: UpdateProfileRequest): Promise<User | null> {
    const fields = [];
    const values = [];

    if (updateData.first_name !== undefined) {
      fields.push('first_name = ?');
      values.push(updateData.first_name);
    }
    if (updateData.last_name !== undefined) {
      fields.push('last_name = ?');
      values.push(updateData.last_name);
    }
    if (updateData.age !== undefined) {
      fields.push('age = ?');
      values.push(updateData.age);
    }
    if (updateData.gender !== undefined) {
      fields.push('gender = ?');
      values.push(updateData.gender);
    }
    if (updateData.weight !== undefined) {
      fields.push('weight = ?');
      values.push(updateData.weight);
    }
    if (updateData.height !== undefined) {
      fields.push('height = ?');
      values.push(updateData.height);
    }
    if (updateData.activity_level !== undefined) {
      fields.push('activity_level = ?');
      values.push(updateData.activity_level);
    }
    if (updateData.fitness_goal !== undefined) {
      fields.push('fitness_goal = ?');
      values.push(updateData.fitness_goal);
    }
    if (updateData.dietary_preferences !== undefined) {
      fields.push('dietary_preferences = ?');
      values.push(JSON.stringify(updateData.dietary_preferences));
    }
    if (updateData.allergies !== undefined) {
      fields.push('allergies = ?');
      values.push(JSON.stringify(updateData.allergies));
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    return (result as any).affectedRows > 0;
  }

  static async findAll(limit: number = 100, offset: number = 0): Promise<User[]> {
    // Ensure limit and offset are valid integers
    const validLimit = Math.max(1, Math.min(1000, parseInt(limit.toString()) || 100));
    const validOffset = Math.max(0, parseInt(offset.toString()) || 0);
    
    const [rows] = await pool.execute(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [validLimit, validOffset]
    );

    return (rows as User[]).map(user => ({
      ...user,
      dietary_preferences: JSON.parse(user.dietary_preferences as any || '[]'),
      allergies: JSON.parse(user.allergies as any || '[]'),
      created_at: new Date(user.created_at),
      updated_at: new Date(user.updated_at)
    }));
  }

  static async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;

    return bcrypt.compare(password, user.password);
  }

  // Add this helper method to safely parse JSON fields
  private static parseJsonField(field: any): any[] {
    if (!field) return [];
    
    try {
      // If it's already an array, return it
      if (Array.isArray(field)) return field;
      
      // If it's a string, try to parse it
      if (typeof field === 'string') {
        return JSON.parse(field);
      }
      
      // If it's already parsed JSON, return it
      return field;
    } catch (error) {
      console.error('Error parsing JSON field:', error);
      return [];
    }
  }
}
