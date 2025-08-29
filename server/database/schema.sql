-- Create database
CREATE DATABASE IF NOT EXISTS nutriplan_pro;
USE nutriplan_pro;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    age INT,
    gender ENUM('male', 'female', 'other'),
    weight DECIMAL(5,2), -- in kg
    height DECIMAL(5,2), -- in cm
    activity_level ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'),
    fitness_goal ENUM('weight_loss', 'maintenance', 'muscle_gain'),
    dietary_preferences JSON,
    allergies JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Food categories table
CREATE TABLE food_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table
CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients JSON NOT NULL,
    instructions JSON NOT NULL,
    cooking_time INT, -- in minutes
    servings INT,
    difficulty ENUM('easy', 'medium', 'hard'),
    cuisine_type VARCHAR(100),
    tags JSON,
    image_url VARCHAR(500),
    created_by INT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Recipe nutrition table
CREATE TABLE recipe_nutrition (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT NOT NULL,
    calories DECIMAL(8,2),
    protein DECIMAL(8,2), -- in grams
    carbohydrates DECIMAL(8,2), -- in grams
    fat DECIMAL(8,2), -- in grams
    fiber DECIMAL(8,2), -- in grams
    sugar DECIMAL(8,2), -- in grams
    sodium DECIMAL(8,2), -- in mg
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Meal plans table
CREATE TABLE meal_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_calories DECIMAL(8,2),
    total_protein DECIMAL(8,2),
    total_carbs DECIMAL(8,2),
    total_fat DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Meal plan items table
CREATE TABLE meal_plan_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    meal_plan_id INT NOT NULL,
    recipe_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack'),
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- User suggested meals table
CREATE TABLE user_suggested_meals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    suggested_by INT NOT NULL, -- admin who suggested
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack'),
    recipe_id INT,
    custom_meal JSON, -- for custom meal suggestions
    reason TEXT,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (suggested_by) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- AI analysis results table
CREATE TABLE ai_analysis_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    analysis_type ENUM('meal_suggestion', 'nutrition_analysis', 'diet_optimization'),
    input_data JSON,
    ai_response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default food categories
INSERT INTO food_categories (name, description) VALUES
('Vegetables', 'Fresh and cooked vegetables'),
('Fruits', 'Fresh fruits and berries'),
('Grains', 'Whole grains and cereals'),
('Proteins', 'Meat, fish, eggs, legumes'),
('Dairy', 'Milk, cheese, yogurt'),
('Fats', 'Oils, nuts, seeds'),
('Beverages', 'Drinks and liquids');

-- Insert admin user (password: admin123)
-- Note: This is a properly hashed password using bcrypt
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@nutriplan.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin');