import pool from '../config/database';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await pool.execute(
      `INSERT INTO users (email, password, first_name, last_name, role) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE id=id`,
      ['admin@nutriplan.com', adminPassword, 'Admin', 'User', 'admin']
    );

    // Create sample users
    const userPassword = await bcrypt.hash('user123', 12);
    await pool.execute(
      `INSERT INTO users (email, password, first_name, last_name, role, age, gender, weight, height, activity_level, fitness_goal, dietary_preferences, allergies) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE id=id`,
      [
        'user@nutriplan.com',
        userPassword,
        'John',
        'Doe',
        'user',
        30,
        'male',
        75.0,
        180.0,
        'moderately_active',
        'maintenance',
        JSON.stringify(['balanced', 'high_protein']),
        JSON.stringify(['nuts', 'shellfish'])
      ]
    );

    // Create sample recipes
    await pool.execute(
      `INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, servings, difficulty, cuisine_type, tags, created_by, is_approved) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE id=id`,
      [
        'Grilled Chicken Salad',
        'A healthy and delicious grilled chicken salad with fresh vegetables',
        JSON.stringify([
          { name: 'Chicken breast', amount: 200, unit: 'g' },
          { name: 'Mixed greens', amount: 100, unit: 'g' },
          { name: 'Cherry tomatoes', amount: 150, unit: 'g' },
          { name: 'Cucumber', amount: 100, unit: 'g' },
          { name: 'Olive oil', amount: 15, unit: 'ml' }
        ]),
        JSON.stringify([
          'Season chicken breast with salt and pepper',
          'Grill chicken for 6-8 minutes per side',
          'Chop vegetables and mix in a bowl',
          'Slice grilled chicken and add to salad',
          'Drizzle with olive oil and serve'
        ]),
        20,
        2,
        'easy',
        'Mediterranean',
        JSON.stringify(['healthy', 'protein', 'salad']),
        1,
        true
      ]
    );

    // Add nutrition info for the recipe
    await pool.execute(
      `INSERT INTO recipe_nutrition (recipe_id, calories, protein, carbohydrates, fat, fiber) 
       VALUES (?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE id=id`,
      [1, 350, 35, 15, 18, 8]
    );

    console.log('✅ Database seeding completed successfully!');
    console.log('�� Admin user: admin@nutriplan.com / admin123');
    console.log('�� Sample user: user@nutriplan.com / user123');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
