import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { User, Recipe} from '../../types';

const AdminDashboard: React.FC = () => {
  const {
    users,
    pendingRecipes,
    systemAnalytics,
    userAnalytics,
    loading,
    error,
    getAllUsers,
    getPendingRecipes,
    getSystemAnalytics,
    getUserAnalytics,
    updateUserRole,
    approveRecipe,
    rejectRecipe,
    clearError,
  } = useAdmin();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showUserRoleModal, setShowUserRoleModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    // Load initial data
    getAllUsers();
    getPendingRecipes();
    getSystemAnalytics();
  }, [getAllUsers, getPendingRecipes, getSystemAnalytics]);

  const handleUpdateUserRole = async (userId: number, role: string) => {
    try {
      await updateUserRole(userId, role);
      setShowUserRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
      getAllUsers(); // Refresh user list
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const handleApproveRecipe = async (recipeId: number) => {
    try {
      await approveRecipe(recipeId);
      setShowRecipeModal(false);
      setSelectedRecipe(null);
      getPendingRecipes(); // Refresh pending recipes
    } catch (err) {
      console.error('Failed to approve recipe:', err);
    }
  };

  const handleRejectRecipe = async (recipeId: number) => {
    try {
      await rejectRecipe(recipeId);
      setShowRecipeModal(false);
      setSelectedRecipe(null);
      getPendingRecipes(); // Refresh pending recipes
    } catch (err) {
      console.error('Failed to reject recipe:', err);
    }
  };

  const openUserRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowUserRoleModal(true);
  };

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage users, moderate recipes, and view system analytics.
        </p>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={clearError}
              className="ml-2 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* System Analytics */}
      {systemAnalytics && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">System Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemAnalytics.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Recipes</p>
                  <p className="text-2xl font-bold text-gray-900">{systemAnalytics.total_recipes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Recipes</p>
                  <p className="text-2xl font-bold text-gray-900">{systemAnalytics.pending_recipes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Meal Plans</p>
                  <p className="text-2xl font-bold text-gray-900">{systemAnalytics.total_meal_plans}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button
            onClick={() => getAllUsers()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Users
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                                                 <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                           <span className="text-sm font-medium text-gray-700">
                             {user.first_name.charAt(0).toUpperCase()}
                           </span>
                         </div>
                         <div className="ml-4">
                           <div className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</div>
                           <div className="text-sm text-gray-500">ID: {user.id}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                         Active
                       </span>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openUserRoleModal(user)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pending Recipes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Pending Recipe Approvals</h2>
          <button
            onClick={getPendingRecipes}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Recipes
          </button>
        </div>

        {pendingRecipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No pending recipes to approve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {recipe.image_url && (
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>⏱️ {recipe.cooking_time} min</span>
                    <span>👥 {recipe.servings} servings</span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(recipe.is_approved ? 'approved' : 'pending')}`}>
                      {recipe.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <p><strong>Author:</strong> User #{recipe.created_by}</p>
                    <p><strong>Created:</strong> {new Date(recipe.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openRecipeModal(recipe)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleApproveRecipe(recipe.id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectRecipe(recipe.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Role Update Modal */}
      {showUserRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Update User Role</h2>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Update role for user: <strong>{selectedUser.first_name} {selectedUser.last_name}</strong> 
                </p>
                <p className="text-sm text-gray-500">Current role: {selectedUser.role}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowUserRoleModal(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateUserRole(selectedUser.id, newRole)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Review Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Review Recipe: {selectedRecipe.title}</h2>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <span>⏱️ {selectedRecipe.cooking_time} min</span>
                    <span>👥 {selectedRecipe.servings} servings</span>
                    <span className={`px-2 py-1 rounded ${
                      selectedRecipe.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      selectedRecipe.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedRecipe.difficulty}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-gray-500">•</span>
                          <span>{ingredient.name}</span>
                          <span className="text-gray-500">
                            {ingredient.amount} {ingredient.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                    <ol className="space-y-2">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-blue-600 font-semibold min-w-[20px]">{index + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-3">Recipe Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Author:</span>
                        <span className="ml-2 font-medium">User #{selectedRecipe.created_by}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <span className="ml-2 font-medium">{new Date(selectedRecipe.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusBadgeColor(selectedRecipe.is_approved ? 'approved' : 'pending')}`}>
                          {selectedRecipe.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      {selectedRecipe.cuisine_type && (
                        <div>
                          <span className="text-gray-600">Cuisine:</span>
                          <span className="ml-2 font-medium">{selectedRecipe.cuisine_type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedRecipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => handleApproveRecipe(selectedRecipe.id)}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    >
                      ✅ Approve Recipe
                    </button>
                    <button
                      onClick={() => handleRejectRecipe(selectedRecipe.id)}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                    >
                      ❌ Reject Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
