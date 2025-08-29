import React, { useState } from 'react';
import { useMealSuggestions } from '../../hooks/useMealSuggestions';
import { UserSuggestedMeal } from '../../types';
import CreateMealSuggestion from './CreateMealSuggestion';

const MealSuggestions: React.FC = () => {
  const {
    userSuggestions,
    receivedSuggestions,
    loading,
    error,
    acceptSuggestion,
    rejectSuggestion,
    deleteSuggestion
  } = useMealSuggestions();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('received');

  const handleAccept = async (id: number) => {
    try {
      await acceptSuggestion(id);
    } catch (err) {
      console.error('Failed to accept suggestion:', err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectSuggestion(id);
    } catch (err) {
      console.error('Failed to reject suggestion:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this suggestion?')) {
      try {
        await deleteSuggestion(id);
      } catch (err) {
        console.error('Failed to delete suggestion:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMealTypeColor = (mealType: string) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-purple-100 text-purple-800',
      snack: 'bg-blue-100 text-blue-800'
    };
    return colors[mealType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderSuggestionCard = (suggestion: UserSuggestedMeal, isReceived: boolean) => (
    <div key={suggestion.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(suggestion.meal_type)}`}>
            {suggestion.meal_type.charAt(0).toUpperCase() + suggestion.meal_type.slice(1)}
          </span>
          {suggestion.is_accepted && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Accepted
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(suggestion.created_at)}
        </span>
      </div>

      {suggestion.recipe ? (
        <div className="mb-3">
          <h4 className="font-medium text-gray-900">{suggestion.recipe.title}</h4>
          <p className="text-sm text-gray-600">{suggestion.recipe.description}</p>
        </div>
      ) : suggestion.custom_meal && (
        <div className="mb-3">
          <h4 className="font-medium text-gray-900">Custom Meal</h4>
          <p className="text-sm text-gray-600">{suggestion.custom_meal}</p>
        </div>
      )}

      {suggestion.reason && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Reason:</span> {suggestion.reason}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {isReceived && !suggestion.is_accepted && (
          <>
            <button
              onClick={() => handleAccept(suggestion.id)}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(suggestion.id)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </>
        )}
        {!isReceived && (
          <button
            onClick={() => handleDelete(suggestion.id)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <CreateMealSuggestion
        onSuccess={() => setShowCreateForm(false)}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Meal Suggestions</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Suggest a Meal
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Received Suggestions ({receivedSuggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sent Suggestions ({userSuggestions.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'received' ? (
          receivedSuggestions.length > 0 ? (
            receivedSuggestions.map(suggestion => renderSuggestionCard(suggestion, true))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No received meal suggestions yet.</p>
              <p className="text-sm">When someone suggests a meal to you, it will appear here.</p>
            </div>
          )
        ) : (
          userSuggestions.length > 0 ? (
            userSuggestions.map(suggestion => renderSuggestionCard(suggestion, false))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No sent meal suggestions yet.</p>
              <p className="text-sm">Start suggesting meals to other users to see them here.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MealSuggestions;
