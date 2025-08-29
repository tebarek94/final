import { UserModel } from '../models/User';
import { generateToken } from '../config/jwt';
import { LoginRequest, RegisterRequest, User } from '../types';

export class AuthService {
  static async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const user = await UserModel.create(userData);
    if (!user) {
      throw new Error('Failed to create user');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  }

  static async login(loginData: LoginRequest): Promise<{ user: User; token: string }> {
    // Verify password
    const isValidPassword = await UserModel.verifyPassword(loginData.email, loginData.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Get user data
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  }

  static async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await UserModel.verifyPassword(user.email, currentPassword);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    return await UserModel.updatePassword(userId, newPassword);
  }

  static async getProfile(userId: number): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  static async updateProfile(userId: number, updateData: any): Promise<User | null> {
    return await UserModel.update(userId, updateData);
  }
}
