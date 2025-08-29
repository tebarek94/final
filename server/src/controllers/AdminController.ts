import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { AuthRequest } from '../middleware/auth';

export class AdminController {
  // User Management
  static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const users = await AdminService.getAllUsers(limit, offset);
      
      res.json({
        users,
        pagination: {
          limit,
          offset,
          total: users.length
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  }

  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const user = await AdminService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  }

  static async updateUserRole(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!role || !['user', 'admin'].includes(role)) {
        res.status(400).json({ error: 'Valid role is required' });
        return;
      }

      const user = await AdminService.updateUserRole(userId, role);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        message: 'User role updated successfully',
        user
      });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const success = await AdminService.deleteUser(userId);
      
      if (success) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  // Recipe Management
  static async getPendingRecipes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipes = await AdminService.getPendingRecipes();
      
      res.json({ recipes });
    } catch (error) {
      console.error('Get pending recipes error:', error);
      res.status(500).json({ error: 'Failed to get pending recipes' });
    }
  }

  static async approveRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const success = await AdminService.approveRecipe(recipeId);
      
      if (success) {
        res.json({ message: 'Recipe approved successfully' });
      } else {
        res.status(404).json({ error: 'Recipe not found' });
      }
    } catch (error) {
      console.error('Approve recipe error:', error);
      res.status(500).json({ error: 'Failed to approve recipe' });
    }
  }

  static async rejectRecipe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recipeId = parseInt(req.params.id);
      const success = await AdminService.rejectRecipe(recipeId);
      
      if (success) {
        res.json({ message: 'Recipe rejected successfully' });
      } else {
        res.status(404).json({ error: 'Recipe not found' });
      }
    } catch (error) {
      console.error('Reject recipe error:', error);
      res.status(500).json({ error: 'Failed to reject recipe' });
    }
  }

  // User Suggested Meals
  static async getSuggestedMealsByAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const suggestions = await AdminService.getSuggestedMealsByAdmin(req.user!.id);
      
      res.json({ suggestions });
    } catch (error) {
      console.error('Get suggested meals by admin error:', error);
      res.status(500).json({ error: 'Failed to get suggested meals' });
    }
  }

  static async suggestMealToUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const suggestion = await AdminService.suggestMealToUser(req.body, req.user!.id);
      
      res.status(201).json({
        message: 'Meal suggested successfully',
        suggestion
      });
    } catch (error) {
      console.error('Suggest meal to user error:', error);
      res.status(500).json({ error: 'Failed to suggest meal' });
    }
  }

  static async updateMealSuggestionStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const suggestionId = parseInt(req.params.id);
      const { isAccepted } = req.body;
      
      if (typeof isAccepted !== 'boolean') {
        res.status(400).json({ error: 'isAccepted boolean is required' });
        return;
      }

      const success = await AdminService.updateMealSuggestionStatus(suggestionId, isAccepted);
      
      if (success) {
        res.json({ message: 'Meal suggestion status updated successfully' });
      } else {
        res.status(404).json({ error: 'Meal suggestion not found' });
      }
    } catch (error) {
      console.error('Update meal suggestion status error:', error);
      res.status(500).json({ error: 'Failed to update meal suggestion status' });
    }
  }

  // Analytics
  static async getSystemAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const analytics = await AdminService.getSystemAnalytics();
      
      res.json({ analytics });
    } catch (error) {
      console.error('Get system analytics error:', error);
      res.status(500).json({ error: 'Failed to get system analytics' });
    }
  }

  static async getUserAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id);
      const analytics = await AdminService.getUserAnalytics(userId);
      
      res.json({ analytics });
    } catch (error) {
      console.error('Get user analytics error:', error);
      res.status(500).json({ error: 'Failed to get user analytics' });
    }
  }
}
