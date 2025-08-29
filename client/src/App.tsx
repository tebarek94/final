import React from 'react';
import {  Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';

// Recipe Management Components
import RecipeManager from './components/recipes/RecipeManager';

// Meal Plan Management Components
import MealPlanManager from './components/mealPlans/MealPlanManager';
import MealSuggestions from './components/mealPlans/MealSuggestions';

// AI Services Components
import AIServices from './components/ai/AIServices';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
      
      >
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Recipe Management - All CRUD operations in one component */}
              <Route path="recipes" element={<RecipeManager />} />
              
              {/* Meal Plan Management - All CRUD operations in one component */}
              <Route path="meal-plans" element={<MealPlanManager />} />
              
              {/* Meal Suggestions */}
              <Route path="meal-suggestions" element={<MealSuggestions />} />
              
              {/* AI Services */}
              <Route path="ai-services" element={<AIServices />} />
              
              <Route path="profile" element={<Profile />} />
              
              {/* Admin routes */}
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
