import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await AuthService.register(req.body);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        res.status(409).json({ error: error.message });
      } else {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await AuthService.login(req.body);
      
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({ error: error.message });
      } else {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
      }
    }
  }

  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user.id);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          age: user.age,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
          activity_level: user.activity_level,
          fitness_goal: user.fitness_goal,
          dietary_preferences: user.dietary_preferences,
          allergies: user.allergies,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  static async updateProfile(req: any, res: Response): Promise<void> {
    try {
      const user = await AuthService.updateProfile(req.user.id, req.body);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          age: user.age,
          gender: user.gender,
          weight: user.weight,
          height: user.height,
          activity_level: user.activity_level,
          fitness_goal: user.fitness_goal,
          dietary_preferences: user.dietary_preferences,
          allergies: user.allergies,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  static async changePassword(req: any, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'Current password and new password are required' });
        return;
      }

      const success = await AuthService.changePassword(req.user.id, currentPassword, newPassword);
      
      if (success) {
        res.json({ message: 'Password changed successfully' });
      } else {
        res.status(400).json({ error: 'Failed to change password' });
      }
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        res.status(400).json({ error: error.message });
      } else {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
      }
    }
  }
}
