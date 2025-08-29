import pool from '../config/database';
import { AIAnalysisResult } from '../types';

export class AIAnalysisModel {
  static async create(analysisData: Omit<AIAnalysisResult, 'id' | 'created_at'>): Promise<AIAnalysisResult | null> {
    const [result] = await pool.execute(
      `INSERT INTO ai_analysis_results (
        user_id, analysis_type, input_data, ai_response
      ) VALUES (?, ?, ?, ?)`,
      [
        analysisData.user_id,
        analysisData.analysis_type,
        JSON.stringify(analysisData.input_data),
        JSON.stringify(analysisData.ai_response)
      ]
    );

    const analysisId = (result as any).insertId;
    return this.findById(analysisId);
  }

  static async findById(id: number): Promise<AIAnalysisResult | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM ai_analysis_results WHERE id = ?',
      [id]
    );

    const analyses = rows as AIAnalysisResult[];
    if (analyses.length === 0) return null;

    const analysis = analyses[0];
    return {
      ...analysis,
      input_data: this.parseJsonField(analysis.input_data),
      ai_response: this.parseJsonField(analysis.ai_response),
      created_at: new Date(analysis.created_at)
    };
  }

  // Add this helper method to safely parse JSON fields
  private static parseJsonField(field: any): any {
    if (!field) return null;
    
    try {
      // If it's already an object/array, return it
      if (typeof field === 'object') return field;
      
      // If it's a string, try to parse it
      if (typeof field === 'string') {
        return JSON.parse(field);
      }
      
      return field;
    } catch (error) {
      console.error('Error parsing JSON field:', error);
      return field; // Return original value if parsing fails
    }
  }

  static async findByUser(userId: number, limit: number = 10): Promise<AIAnalysisResult[]> {
    try {
      // Ensure limit is a number and within reasonable bounds
      const safeLimit = Math.min(Math.max(parseInt(limit.toString()) || 10, 1), 100);
      
      const [rows] = await pool.execute(
        'SELECT * FROM ai_analysis_results WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, safeLimit]
      );

      const analyses = rows as AIAnalysisResult[];
      return analyses.map(analysis => ({
        ...analysis,
        input_data: this.parseJsonField(analysis.input_data),
        ai_response: this.parseJsonField(analysis.ai_response),
        created_at: new Date(analysis.created_at)
      }));
    } catch (error) {
      console.error('Error in findByUser:', error);
      throw new Error('Failed to fetch analysis history');
    }
  }

  static async findByType(analysisType: string, limit: number = 50): Promise<AIAnalysisResult[]> {
    try {
      // Ensure limit is a number and within reasonable bounds
      const safeLimit = Math.min(Math.max(parseInt(limit.toString()) || 50, 1), 100);
      
      const [rows] = await pool.execute(
        'SELECT * FROM ai_analysis_results WHERE analysis_type = ? ORDER BY created_at DESC LIMIT ?',
        [analysisType, safeLimit]
      );

      return (rows as AIAnalysisResult[]).map(analysis => ({
        ...analysis,
        input_data: this.parseJsonField(analysis.input_data),
        ai_response: this.parseJsonField(analysis.ai_response),
        created_at: new Date(analysis.created_at)
      }));
    } catch (error) {
      console.error('Error in findByType:', error);
      throw new Error('Failed to fetch analysis by type');
    }
  }
}
